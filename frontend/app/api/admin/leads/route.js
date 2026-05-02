import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

function checkAuth(req) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Basic ')) return false;
  const decoded = Buffer.from(auth.slice(6), 'base64').toString();
  const [, password] = decoded.split(':');
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(req) {
  if (!checkAuth(req)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="DIY Builder Admin"' },
    });
  }

  try {
    // Récupère les clés dans l'ordre chronologique décroissant (les plus récents en premier)
    const keys = await kv.zrange('leads:index', 0, -1, { rev: true });

    if (!keys || keys.length === 0) {
      return NextResponse.json({ leads: [], total: 0 });
    }

    const raw = await Promise.all(keys.map((key) => kv.get(key)));
    const leads = raw
      .map((v) => {
        try {
          return typeof v === 'string' ? JSON.parse(v) : v;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ leads, total: leads.length });
  } catch (err) {
    console.error('[/api/admin/leads]', err.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
