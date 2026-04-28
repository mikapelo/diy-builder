/**
 * app/api/prices/route.js — API Route Next.js 14 (App Router)
 *
 * Sert le cache de prix généré par scraper/index.js.
 * Revalidation ISR toutes les heures (Next.js edge cache).
 *
 * GET /api/prices
 *   → 200 { date, updated, sources, prices: [...] }  si cache présent
 *   → 404 { error: 'cache_not_found' }               si pas encore généré
 *   → 503 { error: 'cache_unavailable' }             si lecture échoue
 *
 * Le hook useLivePrices gère le fallback vers materialPrices.js si 404/503.
 */

import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const revalidate = 3600; // ISR : revalide au max toutes les heures

const CACHE_PATH = join(process.cwd(), 'public', 'prices-cache.json');

/** Cache mémoire pour éviter de relire le fichier à chaque requête */
let memCache = null;
let memCacheTime = 0;
const MEM_TTL = 60 * 60 * 1000; // 1 heure

export function GET() {
  try {
    if (!existsSync(CACHE_PATH)) {
      return NextResponse.json(
        { error: 'cache_not_found', hint: 'Run scraper/index.js --once to generate the cache.' },
        { status: 404 }
      );
    }

    const now = Date.now();
    if (!memCache || now - memCacheTime > MEM_TTL) {
      const raw = readFileSync(CACHE_PATH, 'utf8');
      memCache = JSON.parse(raw);
      memCacheTime = now;
    }

    return NextResponse.json(memCache, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[api/prices] Erreur lecture cache :', err.message);
    return NextResponse.json(
      { error: 'cache_unavailable' },
      { status: 503 }
    );
  }
}
