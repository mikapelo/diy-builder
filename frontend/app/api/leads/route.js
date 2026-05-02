import { NextResponse } from 'next/server';

const RESEND_API = 'https://api.resend.com/emails';

const PROJECT_LABELS = {
  terrasse: 'Terrasse',
  cabanon: 'Cabanon',
  pergola: 'Pergola',
  cloture: 'Clôture',
};

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
  try {
    const { email, projectType, dims, pdfBase64, filename } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const label = PROJECT_LABELS[projectType] ?? projectType;
    const dimsStr = dims ? `${dims.width} m × ${dims.depth} m` : '';
    const notifyEmail = process.env.LEAD_NOTIFY_EMAIL ?? 'contact@diy-builder.fr';

    /* ── 1. Email de confirmation à l'utilisateur ── */
    await sendEmail({
      to: email,
      subject: `Votre devis ${label} — DIY Builder`,
      attachments: pdfBase64 ? [{ filename: filename ?? `devis-${projectType}.pdf`, content: pdfBase64 }] : undefined,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #fafaf8; border-radius: 12px;">
          <h1 style="font-size: 22px; color: #1a1c1b; margin: 0 0 12px;">Votre devis ${label} 📋</h1>
          <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Votre liste de matériaux${dimsStr ? ` pour un projet <strong>${label} ${dimsStr}</strong>` : ''} vient d'être téléchargée.
          </p>
          <p style="color: #66625a; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Retrouvez tous nos simulateurs sur
            <a href="https://diy-builder.fr" style="color: #C9971E; font-weight: 600;">diy-builder.fr</a>
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
      subject: `[Lead] ${email} — ${label}${dimsStr ? ` ${dimsStr}` : ''}`,
      html: `
        <p style="font-family: Inter, sans-serif; font-size: 14px; color: #1a1c1b;">
          Nouveau lead PDF :<br/>
          <strong>${email}</strong><br/>
          Projet : ${label}${dimsStr ? ` — ${dimsStr}` : ''}
        </p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/leads]', err.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
