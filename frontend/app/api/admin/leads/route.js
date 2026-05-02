import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

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
    const redis = getRedis();

    // Récupère les clés triées par score décroissant (les plus récents en premier)
    const keys = await redis.zrange('leads:index', 0, -1, 'REV');

    if (!keys || keys.length === 0) {
      return NextResponse.json({ leads: [], total: 0 });
    }

    const pipeline = redis.pipeline();
    keys.forEach((key) => pipeline.get(key));
    const results = await pipeline.exec();

    const leads = results
      .map(([err, val]) => {
        if (err || !val) return null;
        try {
          return typeof val === 'string' ? JSON.parse(val) : val;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({ leads, total: leads.length });
  } catch (err) {
    console.error('[/api/admin/leads]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
