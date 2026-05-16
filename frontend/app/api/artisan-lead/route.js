import { NextResponse } from 'next/server';
import { checkRateLimit, tooManyRequestsResponse } from '@/lib/rateLimit';

const RESEND_API = 'https://api.resend.com/emails';

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
    const { name, email, phone, zipCode, message, projectType, dims } = await req.json();

    // Validation minimale
    if (!phone || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Numéro de téléphone requis' }, { status: 400 });
    }
    if (!zipCode || zipCode.trim().length < 4) {
      return NextResponse.json({ error: 'Code postal requis' }, { status: 400 });
    }
    // Whitelist projectType — évite injection via libellé custom (audit M2)
    const safeProject = VALID_PROJECTS.has(projectType) ? projectType : null;
    const label       = safeProject ? PROJECT_LABELS[safeProject] : 'Projet bois';
    const dimsStr     = dims ? `${Number(dims.width).toFixed(2)} m × ${Number(dims.depth).toFixed(2)} m` : '';
    const surfaceStr  = dims?.area ? ` — ${Number(dims.area).toFixed(2)} m²` : '';
    const notifyTo    = process.env.LEAD_NOTIFY_EMAIL ?? 'contact@diy-builder.fr';

    /* ── 1. Notification owner ── */
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
          </table>
        </div>
      `,
    });

    /* ── 2. Confirmation client (si email fourni) ── */
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
