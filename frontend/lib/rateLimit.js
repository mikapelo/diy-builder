/**
 * rateLimit.js — Sliding window rate limiter via ioredis
 *
 * Usage :
 *   import { checkRateLimit } from '@/lib/rateLimit';
 *   const { ok, retryAfter } = await checkRateLimit(req, 'leads', 10, 60);
 *   if (!ok) return new Response('Too Many Requests', { status: 429, ... });
 *
 * Implémentation : sliding window via Redis sorted sets (ZADD + ZREMRANGEBYSCORE).
 * Si Redis est indisponible, le limiter laisse passer (fail-open) plutôt que
 * bloquer le service — meilleur pour disponibilité, à pondérer selon menace.
 *
 * Audit Sprint 5 — clos H2 (spam relay endpoints leads).
 */

import { getRedis } from './redis';

/**
 * Extrait la meilleure IP cliente depuis les headers Vercel/Next.
 * Priorité : x-forwarded-for (premier hop), x-real-ip, fallback "unknown".
 */
function getClientIP(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xri = req.headers.get('x-real-ip');
  if (xri) return xri.trim();
  return 'unknown';
}

/**
 * Vérifie si la requête est sous quota.
 *
 * @param {Request} req      - objet Request (Next.js fetch API)
 * @param {string} bucket    - identifiant logique (ex: 'leads', 'artisan')
 * @param {number} max       - max d'appels autorisés dans la fenêtre
 * @param {number} windowSec - durée de la fenêtre en secondes
 * @returns {Promise<{ok: boolean, retryAfter: number, remaining: number}>}
 */
export async function checkRateLimit(req, bucket, max, windowSec) {
  const ip = getClientIP(req);
  const key = `rl:${bucket}:${ip}`;
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const cutoff = now - windowMs;

  try {
    const redis = getRedis();
    const pipe = redis.pipeline();
    pipe.zremrangebyscore(key, 0, cutoff);            // purge entrées expirées
    pipe.zadd(key, now, `${now}-${Math.random()}`);   // ajoute timestamp courant
    pipe.zcard(key);                                  // compte la fenêtre
    pipe.expire(key, windowSec + 1);                  // TTL pour auto-cleanup
    const results = await pipe.exec();
    const count = results?.[2]?.[1] ?? 0;
    const remaining = Math.max(0, max - count);
    if (count > max) {
      return { ok: false, retryAfter: windowSec, remaining: 0 };
    }
    return { ok: true, retryAfter: 0, remaining };
  } catch (err) {
    // Redis KO → fail-open (priorité disponibilité)
    // eslint-disable-next-line no-console
    console.warn('[rateLimit] Redis indisponible, fail-open:', err.message);
    return { ok: true, retryAfter: 0, remaining: max };
  }
}

/**
 * Retourne une Response 429 standardisée avec headers Retry-After.
 */
export function tooManyRequestsResponse(retryAfter) {
  return new Response(
    JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    },
  );
}
