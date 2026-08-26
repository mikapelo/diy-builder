// @vitest-environment jsdom
/**
 * leadSource.test.js — Provenance d'une demande de devis
 *
 * Invariants couverts :
 *   - Le placement est whitelisté : une valeur inventée devient 'inconnu'
 *   - Le référent est réduit à son DOMAINE, jamais l'URL complète
 *   - Une navigation interne n'est pas une provenance
 *   - La capture est idempotente : la PREMIÈRE entrée de session gagne, même
 *     après plusieurs pages (c'est tout l'intérêt : au moment où le formulaire
 *     part, document.referrer désigne une page interne)
 *   - Des identifiants de clic on garde le nom, jamais la valeur
 *   - Le serveur borne tout ce qui vient du client
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  LEAD_PLACEMENTS, PLACEMENT_UNKNOWN,
  normalizePlacement, captureEntry, readEntry, sanitizeLeadSource, formatSource,
} from '@/lib/leadSource';

/** Simule un chargement de page : referrer + URL courante. */
function visite({ referrer = '', host = 'www.diy-builder.fr', pathname = '/', search = '' }) {
  Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });
  Object.defineProperty(window, 'location', {
    value: { hostname: host, pathname, search },
    configurable: true, writable: true,
  });
}

beforeEach(() => { sessionStorage.clear(); });
afterEach(() => { sessionStorage.clear(); });

describe('normalizePlacement', () => {
  it.each(LEAD_PLACEMENTS)('accepte le placement connu « %s »', (p) => {
    expect(normalizePlacement(p)).toBe(p);
  });

  it('remplace une valeur inventée par « inconnu »', () => {
    expect(normalizePlacement('bandeau-magique')).toBe(PLACEMENT_UNKNOWN);
  });

  it('remplace undefined par « inconnu »', () => {
    expect(normalizePlacement(undefined)).toBe(PLACEMENT_UNKNOWN);
  });
});

describe('captureEntry — provenance de la session', () => {
  it('réduit le référent à son domaine, sans www ni chemin', () => {
    visite({ referrer: 'https://www.lm.facebook.com/groupes/bricolage?post=42', pathname: '/' });
    captureEntry();
    expect(readEntry().referrer).toBe('lm.facebook.com');
  });

  it('ne retient pas une navigation interne comme provenance', () => {
    visite({ referrer: 'https://www.diy-builder.fr/guides/pergola', pathname: '/pergola' });
    captureEntry();
    expect(readEntry().referrer).toBe('');
  });

  it('retient la page d\'arrivée', () => {
    visite({ referrer: 'https://www.google.com/', pathname: '/guides/cabanon' });
    captureEntry();
    expect(readEntry().landing).toBe('/guides/cabanon');
  });

  it('garde la PREMIÈRE entrée : une 2e page ne l\'écrase pas', () => {
    visite({ referrer: 'https://lm.facebook.com/', pathname: '/' });
    captureEntry();
    // La personne navigue en interne — c'est ici que l'ancienne approche perdait la source
    visite({ referrer: 'https://www.diy-builder.fr/', pathname: '/pergola' });
    captureEntry();
    expect(readEntry()).toMatchObject({ referrer: 'lm.facebook.com', landing: '/' });
  });

  it('conserve les utm_* avec leur valeur', () => {
    visite({ referrer: '', pathname: '/', search: '?utm_source=facebook&utm_medium=social' });
    captureEntry();
    expect(readEntry().campaign).toBe('utm_source=facebook;utm_medium=social');
  });

  it('ne garde que le NOM d\'un identifiant de clic, pas sa valeur', () => {
    visite({ referrer: 'https://lm.facebook.com/', pathname: '/', search: '?fbclid=IwY2xjawT7nqJwZG9mBWV4dG4' });
    captureEntry();
    const { campaign } = readEntry();
    expect(campaign).toBe('fbclid');
    expect(campaign).not.toContain('IwY2xjaw');
  });

  it('sans marquage, campaign est vide', () => {
    visite({ referrer: 'https://www.google.com/', pathname: '/guides/pergola' });
    captureEntry();
    expect(readEntry().campaign).toBe('');
  });

  it('readEntry renvoie null quand rien n\'a été capturé', () => {
    expect(readEntry()).toBeNull();
  });

  it('ne jette pas si le stockage est bloqué', () => {
    visite({ referrer: 'https://lm.facebook.com/', pathname: '/' });
    const vrai = sessionStorage.setItem;
    sessionStorage.setItem = () => { throw new Error('stockage bloqué'); };
    expect(() => captureEntry()).not.toThrow();
    sessionStorage.setItem = vrai;
  });
});

describe('sanitizeLeadSource — nettoyage serveur', () => {
  it('conserve une provenance légitime', () => {
    expect(sanitizeLeadSource({
      placement: 'post-pdf',
      entry: { referrer: 'lm.facebook.com', landing: '/pergola', campaign: 'fbclid' },
    })).toEqual({ placement: 'post-pdf', referrer: 'lm.facebook.com', landing: '/pergola', campaign: 'fbclid' });
  });

  it('sans source du tout → placement inconnu et champs vides', () => {
    expect(sanitizeLeadSource(undefined)).toEqual({
      placement: PLACEMENT_UNKNOWN, referrer: '', landing: '', campaign: '',
    });
  });

  it('borne les champs longs — un payload client n\'entre pas non borné en base', () => {
    const s = sanitizeLeadSource({
      placement: 'guide',
      entry: { referrer: 'x'.repeat(5000), landing: 'y'.repeat(5000), campaign: 'z'.repeat(5000) },
    });
    expect(s.referrer.length).toBe(100);
    expect(s.landing.length).toBe(200);
    expect(s.campaign.length).toBe(160);
  });

  it('ignore un type inattendu au lieu de le stocker', () => {
    const s = sanitizeLeadSource({ placement: 'guide', entry: { referrer: { evil: true }, landing: 42 } });
    expect(s.referrer).toBe('');
    expect(s.landing).toBe('');
  });
});

describe('formatSource — libellé lisible', () => {
  it('affiche « direct » quand il n\'y a pas de référent', () => {
    expect(formatSource({ placement: 'guide', referrer: '', campaign: '' })).toBe('direct');
  });

  it('affiche le canal seul sans marquage', () => {
    expect(formatSource({ referrer: 'google.com', campaign: '' })).toBe('google.com');
  });

  it('accole le marquage de campagne au canal', () => {
    expect(formatSource({ referrer: 'lm.facebook.com', campaign: 'fbclid' })).toBe('lm.facebook.com (fbclid)');
  });

  it('sans source → tiret', () => {
    expect(formatSource(null)).toBe('—');
  });
});
