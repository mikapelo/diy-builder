import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';
import { checkRateLimit, tooManyRequestsResponse } from '@/lib/rateLimit';

const RESEND_API = 'https://api.resend.com/emails';

const PROJECT_LABELS = {
  terrasse: 'Terrasse',
  cabanon: 'Cabanon',
  pergola: 'Pergola',
  cloture: 'Clôture',
};

const VALID_PROJECTS = new Set(['terrasse', 'cabanon', 'pergola', 'cloture']);

// Limite payload PDF : 5 Mo en base64 (~3.7 Mo binaire) (audit M4)
const MAX_PDF_BASE64_BYTES = 5 * 1024 * 1024;

// TTL Redis pour rétention RGPD (1 an, audit L4)
const LEAD_TTL_SECONDS = 365 * 24 * 3600;

// Échappement HTML pour empêcher l'injection dans les emails (audit H1)
function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Sanitisation filename : restreint au charset sûr (audit M4)
function sanitizeFilename(name, projectType) {
  const fallback = `devis-${projectType ?? 'projet'}.pdf`;
  if (!name || typeof name !== 'string') return fallback;
  const cleaned = name.replace(/[^a-z0-9._-]/gi, '_').slice(0, 80);
  return cleaned.length > 0 ? cleaned : fallback;
}

async function sendEmail({ to, subject, html, attachments }) {
  const body = {
    from: 'DIY Builder <contact@diy-builder.fr>',
    to,
    subject,
    html,
  };
  if (attachments) body.attachments = attachments;
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function POST(req) {
  // Rate limit : 10 req/min/IP (audit H2 — anti spam relay Resend)
  const rl = await checkRateLimit(req, 'leads', 10, 60);
  if (!rl.ok) return tooManyRequestsResponse(rl.retryAfter);

  try {
    const { email, projectType, dims, pdfBase64, filename } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }
    // Garde payload PDF — évite épuisement quota Resend (audit M4)
    if (pdfBase64 && typeof pdfBase64 === 'string' && pdfBase64.length > MAX_PDF_BASE64_BYTES) {
      return NextResponse.json({ error: 'Fichier trop volumineux' }, { status: 413 });
    }

    const safeProject = VALID_PROJECTS.has(projectType) ? projectType : null;
    const label       = safeProject ? PROJECT_LABELS[safeProject] : 'Projet';
    const dimsStr     = dims ? `${Number(dims.width).toFixed(2)} m × ${Number(dims.depth).toFixed(2)} m` : '';
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL ?? 'contact@diy-builder.fr';
    const safeLabel   = String(label).replace(/[\r\n]+/g, ' ');
    const safeFilename = sanitizeFilename(filename, safeProject);

    /* ── 1. Email de confirmation à l'utilisateur ── */
    await sendEmail({
      to: email,
      subject: `Votre devis ${safeLabel} — DIY Builder`,
      attachments: pdfBase64 ? [{ filename: safeFilename, content: pdfBase64 }] : undefined,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #fafaf8; border-radius: 12px;">
          <h1 style="font-size: 22px; color: #1a1c1b; margin: 0 0 12px;">Votre devis ${escHtml(label)} 📋</h1>
          <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Votre liste de matériaux${dimsStr ? ` pour un projet <strong>${escHtml(label)} ${escHtml(dimsStr)}</strong>` : ''} vient d'être téléchargée.
          </p>
          <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Retrouvez tous nos simulateurs sur
            <a href="https://www.diy-builder.fr" style="color: #C9971E; font-weight: 600;">diy-builder.fr</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e5e2d8; margin: 0 0 16px;" />
          <p style="color: #9c9188; font-size: 12px; margin: 0;">
            Vous avez téléchargé ce devis depuis diy-builder.fr.
            Pour vous désabonner, répondez à cet email avec "stop".
          </p>
        </div>
      `,
    });

    /* ── 2. Notification lead à l'owner ── */
    await sendEmail({
      to: notifyEmail,
      subject: `[Lead] ${email} — ${safeLabel}${dimsStr ? ` ${dimsStr}` : ''}`,
      html: `
        <p style="font-family: Inter, sans-serif; font-size: 14px; color: #1a1c1b;">
          Nouveau lead PDF :<br/>
          <strong>${escHtml(email)}</strong><br/>
          Projet : ${escHtml(label)}${dimsStr ? ` — ${escHtml(dimsStr)}` : ''}
        </p>
      `,
    });

    /* ── 3. Stockage lead dans Redis avec TTL RGPD (1 an, audit L4) ── */
    try {
      const redis = getRedis();
      const ts = Date.now();
      const lead = {
        email,
        projectType: safeProject,
        dims: dims ?? null,
        createdAt: new Date(ts).toISOString(),
      };
      // ioredis : `'EX', seconds` pour TTL
      await redis.set(`lead:${ts}`, JSON.stringify(lead), 'EX', LEAD_TTL_SECONDS);
      // Index trié par timestamp pour récupération chronologique
      await redis.zadd('leads:index', ts, `lead:${ts}`);
    } catch (redisErr) {
      // Redis non disponible en dev local — on ne bloque pas l'envoi email
      console.warn('[/api/leads] Redis unavailable:', redisErr.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/leads]', err.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
