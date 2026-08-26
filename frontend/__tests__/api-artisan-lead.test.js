/**
 * api-artisan-lead.test.js — POST /api/artisan-lead
 *
 * Invariants couverts :
 *   - Un lead sans consentement prouvé n'entre PAS en base (garde serveur :
 *     la case cochée côté client est contournable)
 *   - Un lead consenti est archivé AVANT l'envoi des emails — une panne Resend
 *     ne doit plus faire perdre la demande
 *   - Le texte et la version du consentement sont archivés avec le lead
 *     (art. 7.1 RGPD : charge de la preuve du consentement)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const redisMock = { set: vi.fn(), zadd: vi.fn() };

vi.mock('@/lib/redis', () => ({ getRedis: () => redisMock }));
vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: async () => ({ ok: true }),
  tooManyRequestsResponse: () => new Response('429', { status: 429 }),
}));

const { POST } = await import('@/app/api/artisan-lead/route.js');
const { CONSENT_TEXT, CONSENT_VERSION } = await import('@/lib/leadConsent.js');

const VALID = {
  name: 'Jean Dupont',
  email: 'jean@exemple.fr',
  phone: '0612345678',
  zipCode: '39000',
  message: 'Terrasse sur plots',
  projectType: 'terrasse',
  dims: { width: 5.5, depth: 4.5, area: 24.75 },
  consent: true,
  consentVersion: CONSENT_VERSION,
};

function req(body) {
  return new Request('http://localhost/api/artisan-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Dernier lead écrit en base, désérialisé. */
function storedLead() {
  const [, payload] = redisMock.set.mock.calls.at(-1);
  return JSON.parse(payload);
}

beforeEach(() => {
  redisMock.set.mockReset().mockResolvedValue('OK');
  redisMock.zadd.mockReset().mockResolvedValue(1);
  // Resend : réponse valide par défaut
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'x' }) });
});

describe('POST /api/artisan-lead — garde de consentement', () => {
  it('sans consentement → 400 et rien en base', async () => {
    const res = await POST(req({ ...VALID, consent: false }));
    expect(res.status).toBe(400);
    expect(redisMock.set).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('consentement absent du payload → 400', async () => {
    const { consent, ...sansConsent } = VALID;
    const res = await POST(req(sansConsent));
    expect(res.status).toBe(400);
    expect(redisMock.set).not.toHaveBeenCalled();
  });

  it('consentement en chaîne "true" → refusé (vérification stricte)', async () => {
    const res = await POST(req({ ...VALID, consent: 'true' }));
    expect(res.status).toBe(400);
    expect(redisMock.set).not.toHaveBeenCalled();
  });
});

describe('POST /api/artisan-lead — archivage', () => {
  it('lead consenti → 200, écrit en base avec index dédié', async () => {
    const res = await POST(req(VALID));
    expect(res.status).toBe(200);

    const [key, , mode, ttl] = redisMock.set.mock.calls[0];
    expect(key).toMatch(/^artisan-lead:\d+$/);
    expect(mode).toBe('EX');
    expect(ttl).toBe(365 * 24 * 3600);           // 12 mois = durée annoncée

    // Index séparé de leads:index — ces leads-là sont transmissibles
    expect(redisMock.zadd.mock.calls[0][0]).toBe('artisan-leads:index');
  });

  it('le lead archivé porte la preuve du consentement', async () => {
    await POST(req(VALID));
    const lead = storedLead();
    expect(lead.consent).toEqual({
      given: true,
      version: CONSENT_VERSION,
      text: CONSENT_TEXT,
    });
  });

  it('champs métier archivés (identité, contact, zone, projet)', async () => {
    await POST(req(VALID));
    const lead = storedLead();
    expect(lead.name).toBe('Jean Dupont');
    expect(lead.phone).toBe('0612345678');
    expect(lead.zipCode).toBe('39000');
    expect(lead.projectType).toBe('terrasse');
    expect(lead.dims.area).toBe(24.75);
    expect(lead.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('projectType inconnu → normalisé à null (whitelist)', async () => {
    await POST(req({ ...VALID, projectType: '<script>' }));
    expect(storedLead().projectType).toBeNull();
  });

  it('message tronqué à 2000 caractères', async () => {
    await POST(req({ ...VALID, message: 'x'.repeat(5000) }));
    expect(storedLead().message).toHaveLength(2000);
  });

  it('panne Resend → le lead est déjà en base', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => 'no key' });
    const res = await POST(req(VALID));
    expect(res.status).toBe(500);                 // l'appel échoue…
    expect(redisMock.set).toHaveBeenCalledTimes(1); // …mais la demande est conservée
    expect(storedLead().phone).toBe('0612345678');
  });

  it('Redis indisponible → la demande part quand même par email', async () => {
    redisMock.set.mockRejectedValue(new Error('ECONNREFUSED'));
    const res = await POST(req(VALID));
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalled();
  });
});

describe('POST /api/artisan-lead — validation existante préservée', () => {
  it('téléphone trop court → 400', async () => {
    const res = await POST(req({ ...VALID, phone: '06' }));
    expect(res.status).toBe(400);
  });

  it('code postal manquant → 400', async () => {
    const res = await POST(req({ ...VALID, zipCode: '' }));
    expect(res.status).toBe(400);
  });
});

/* D-2 (audit tracking du 26/08/2026) — jusqu'ici la route archivait tout SAUF
   la provenance : attribuer un lead exigeait de reconstruire sa session à la
   main dans Umami. Ces cas gardent le champ en place et bornent ce qui entre. */
describe('POST /api/artisan-lead — provenance archivée', () => {
  const SOURCE = {
    placement: 'post-pdf',
    entry: { referrer: 'lm.facebook.com', landing: '/', campaign: 'fbclid' },
  };

  it('archive le bouton d\'origine et le canal d\'entrée', async () => {
    await POST(req({ ...VALID, source: SOURCE }));
    expect(storedLead().source).toEqual({
      placement: 'post-pdf', referrer: 'lm.facebook.com', landing: '/', campaign: 'fbclid',
    });
  });

  it('un lead sans provenance reste valide, marqué « inconnu »', async () => {
    const res = await POST(req(VALID));
    expect(res.status).toBe(200);
    expect(storedLead().source.placement).toBe('inconnu');
  });

  it('un placement inventé par le client est refusé, pas stocké tel quel', async () => {
    await POST(req({ ...VALID, source: { placement: '<script>', entry: {} } }));
    expect(storedLead().source.placement).toBe('inconnu');
  });

  it('une provenance non bornée est tronquée avant la base', async () => {
    await POST(req({ ...VALID, source: { placement: 'guide', entry: { referrer: 'a'.repeat(9000) } } }));
    expect(storedLead().source.referrer).toHaveLength(100);
  });

  it('la provenance figure dans la notification owner', async () => {
    await POST(req({ ...VALID, source: SOURCE }));
    const [, init] = global.fetch.mock.calls[0];
    const html = JSON.parse(init.body).html;
    expect(html).toContain('Origine');
    expect(html).toContain('post-pdf');
    expect(html).toContain('lm.facebook.com (fbclid)');
  });
});
