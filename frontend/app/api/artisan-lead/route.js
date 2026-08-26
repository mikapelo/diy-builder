import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { checkRateLimit, tooManyRequestsResponse } from '@/lib/rateLimit';
import { CONSENT_VERSION, CONSENT_TEXT } from '@/lib/leadConsent';
import { sanitizeLeadSource, formatSource } from '@/lib/leadSource';

const RESEND_API = 'https://api.resend.com/emails';

// TTL Redis — 1 an, aligné sur la durée annoncée dans la politique de confidentialité
const ARTISAN_LEAD_TTL_SECONDS = 365 * 24 * 3600;

// Garde de volume sur le champ libre — évite de stocker un payload non borné
const MAX_MESSAGE_CHARS = 2000;

const PROJECT_LABELS = {
  terrasse: 'Terrasse bois',
  cabanon:  'Cabanon ossature bois',
  pergola:  'Pergola bois',
  cloture:  'Clôture bois',
};

const VALID_PROJECTS = new Set(['terrasse', 'cabanon', 'pergola', 'cloture']);

// Échappement HTML pour empêcher l'injection dans les emails admin (audit H1)
function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendEmail({ to, subject, html }) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'DIY Builder <contact@diy-builder.fr>',
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend ${res.status}: ${err}`);
  }
  return res.json();
}

export async function POST(req) {
  // Rate limit : 5 req/min/IP — formulaire artisan plus sensible (audit H2)
  const rl = await checkRateLimit(req, 'artisan', 5, 60);
  if (!rl.ok) return tooManyRequestsResponse(rl.retryAfter);

  try {
    const { name, email, phone, zipCode, message, projectType, dims, consent, consentVersion, source } =
      await req.json();

    // Validation minimale
    if (!phone || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Numéro de téléphone requis' }, { status: 400 });
    }
    if (!zipCode || zipCode.trim().length < 4) {
      return NextResponse.json({ error: 'Code postal requis' }, { status: 400 });
    }
    // Consentement vérifié côté serveur : la case cochée dans la modale est
    // contournable. Un lead sans accord prouvé n'est pas transmissible et
    // contaminerait le lot — on le refuse à l'entrée.
    if (consent !== true) {
      return NextResponse.json({ error: 'Consentement requis' }, { status: 400 });
    }
    // Whitelist projectType — évite injection via libellé custom (audit M2)
    const safeProject = VALID_PROJECTS.has(projectType) ? projectType : null;
    const label       = safeProject ? PROJECT_LABELS[safeProject] : 'Projet bois';
    const dimsStr     = dims ? `${Number(dims.width).toFixed(2)} m × ${Number(dims.depth).toFixed(2)} m` : '';
    const surfaceStr  = dims?.area ? ` — ${Number(dims.area).toFixed(2)} m²` : '';
    const notifyTo    = process.env.LEAD_NOTIFY_EMAIL ?? 'contact@diy-builder.fr';
    /* Provenance : bouton d'origine + entrée de session. Le client peut envoyer
       n'importe quoi, la whitelist et les bornes sont côté serveur. */
    const leadSource  = sanitizeLeadSource(source);

    /* ── 1. Archivage Redis — AVANT les emails ──
       Volontairement en premier : une panne Resend ne doit plus faire perdre le
       lead. C'est ce qui a rendu la 2ᵉ demande d'août non identifiable.
       Le texte de consentement est archivé avec le lead (art. 7.1 RGPD : la
       charge de la preuve du consentement pèse sur le responsable). */
    try {
      const redis = getRedis();
      const ts = Date.now();
      const lead = {
        name:        name ? String(name).trim() : null,
        email:       email ? String(email).trim() : null,
        phone:       String(phone).trim(),
        zipCode:     String(zipCode).trim(),
        message:     message ? String(message).slice(0, MAX_MESSAGE_CHARS) : null,
        projectType: safeProject,
        dims:        dims ?? null,
        createdAt:   new Date(ts).toISOString(),
        /* D-2 (audit tracking du 26/08/2026) : sans ces champs, l'attribution
           d'un lead exigeait de reconstruire sa session à la main dans Umami. */
        source:      leadSource,
        consent: {
          given:   true,
          // Version renvoyée par le client, retombée sur celle du serveur si absente
          version: typeof consentVersion === 'string' ? consentVersion : CONSENT_VERSION,
          text:    CONSENT_TEXT,
        },
      };
      await redis.set(`artisan-lead:${ts}`, JSON.stringify(lead), 'EX', ARTISAN_LEAD_TTL_SECONDS);
      // Index dédié : ces leads sont vendables, ceux de /api/leads ne le sont pas
      await redis.zadd('artisan-leads:index', ts, `artisan-lead:${ts}`);
    } catch (redisErr) {
      // Redis absent en dev local — on ne bloque pas l'envoi des emails
      console.warn('[/api/artisan-lead] Redis unavailable:', redisErr.message);
    }

    /* ── 2. Notification owner ── */
    // Subject : strip CRLF pour éviter l'injection de headers email (audit M2)
    const safeLabel    = String(label).replace(/[\r\n]+/g, ' ');
    const safeZipShort = String(zipCode).replace(/[\r\n]+/g, ' ').slice(0, 32);
    await sendEmail({
      to: notifyTo,
      subject: `[Artisan] Demande ${safeLabel}${dimsStr ? ` — ${dimsStr}` : ''} — ${safeZipShort}`,
      html: `
        <div style="font-family: Inter, sans-serif; font-size: 14px; color: #1a1c1b; max-width: 520px;">
          <h2 style="font-size: 18px; margin: 0 0 16px; color: #1a1c1b;">
            Nouvelle demande artisan — ${escHtml(label)}
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #66625a; width: 130px;">Nom</td>
                <td style="padding: 6px 0; font-weight: 600;">${escHtml(name) || '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #66625a;">Téléphone</td>
                <td style="padding: 6px 0; font-weight: 600;">${escHtml(phone)}</td></tr>
            <tr><td style="padding: 6px 0; color: #66625a;">Email</td>
                <td style="padding: 6px 0;">${escHtml(email) || '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #66625a;">Code postal</td>
                <td style="padding: 6px 0;">${escHtml(zipCode)}</td></tr>
            <tr><td style="padding: 6px 0; color: #66625a;">Projet</td>
                <td style="padding: 6px 0;">${escHtml(label)}</td></tr>
            ${dimsStr ? `<tr><td style="padding: 6px 0; color: #66625a;">Dimensions</td>
                <td style="padding: 6px 0;">${escHtml(dimsStr)}${escHtml(surfaceStr)}</td></tr>` : ''}
            ${message ? `<tr><td style="padding: 6px 0; color: #66625a; vertical-align: top;">Message</td>
                <td style="padding: 6px 0; white-space: pre-wrap;">${escHtml(message)}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #66625a;">Origine</td>
                <td style="padding: 6px 0;">${escHtml(leadSource.placement)} · ${escHtml(formatSource(leadSource))}</td></tr>
          </table>
        </div>
      `,
    });

    /* ── 3. Confirmation client (si email fourni) ── */
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const firstName = name ? String(name).split(' ')[0] : '';
      await sendEmail({
        to: email,
        subject: `Votre demande ${safeLabel} — DIY Builder`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #fafaf8; border-radius: 12px;">
            <h1 style="font-size: 20px; color: #1a1c1b; margin: 0 0 12px;">Demande reçue ✅</h1>
            <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Merci ${escHtml(firstName)} ! Votre demande pour un <strong>${escHtml(label)}</strong>
              ${dimsStr ? `(${escHtml(dimsStr)})` : ''} a bien été transmise.
            </p>
            <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Nous vous recontacterons dans les meilleurs délais.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e2d8; margin: 0 0 16px;" />
            <p style="color: #9c9188; font-size: 12px; margin: 0;">
              <a href="https://www.diy-builder.fr" style="color: #C9971E;">diy-builder.fr</a>
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/artisan-lead]', err.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
