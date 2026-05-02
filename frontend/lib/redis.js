/**
 * redis.js — Singleton ioredis pour les routes API Vercel
 *
 * Utilise REDIS_URL (injecté automatiquement par Vercel Storage).
 * Le client est réutilisé entre les invocations warm (module-level singleton).
 */

import Redis from 'ioredis';

let client = null;

export function getRedis() {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL is not defined');

  client = new Redis(url, {
    // Vercel functions : TLS activé si l'URL commence par rediss://
    tls: url.startsWith('rediss://') ? {} : undefined,
    maxRetriesPerRequest: 3,
    connectTimeout: 5000,
    lazyConnect: false,
  });

  client.on('error', (err) => {
    console.error('[redis]', err.message);
  });

  return client;
}
