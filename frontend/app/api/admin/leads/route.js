import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { getRedis } from '@/lib/redis';

// Comparaison timing-safe + guards (audit H3)
// Refuse si ADMIN_PASSWORD absent, vide ou < 16 chars (mauvaise config = pas d'accès)
function checkAuth(req) {
  const auth = req.headers.get('authorization') ?? '';
  if (!auth.startsWith('Basic ')) return false;

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof expected !== 'string' || expected.length < 16) return false;

  let decoded;
  try {
    decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
  } catch {
    return false;
  }
  const idx = decoded.indexOf(':');
  if (idx < 0) return false;
  const password = decoded.slice(idx + 1);
  if (!password) return false;

  // Padding pour aligner les longueurs (évite leak de longueur via timing)
  const a = Buffer.from(password.padEnd(128, '\0'));
  const b = Buffer.from(expected.padEnd(128, '\0'));
  if (a.length !== b.length) return false;
  // timingSafeEqual + double-check de longueur (un attaquant ne doit pas connaître la longueur réelle)
  const eq = timingSafeEqual(a, b);
  return eq && password.length === expected.length;
}

/**
 * Lit un index trié Redis et hydrate les entrées correspondantes.
 * Retourne les leads du plus récent au plus ancien.
 */
async function readIndex(redis, indexKey) {
  const keys = await redis.zrange(indexKey, 0, -1, 'REV');
  if (!keys || keys.length === 0) return [];

  const pipeline = redis.pipeline();
  keys.forEach((key) => pipeline.get(key));
  const results = await pipeline.exec();

  return results
    .map(([err, val]) => {
      if (err || !val) return null;
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
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

    // Deux populations distinctes : contacts opt-in PDF (freemium, non vendables)
    // et demandes de devis artisan (consenties, transmissibles à un partenaire).
    const [leads, artisanLeads] = await Promise.all([
      readIndex(redis, 'leads:index'),
      readIndex(redis, 'artisan-leads:index'),
    ]);

    return NextResponse.json({
      leads,
      total: leads.length,
      artisanLeads,
      artisanTotal: artisanLeads.length,
    });
  } catch (err) {
    console.error('[/api/admin/leads]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
