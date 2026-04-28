/**
 * useLivePrices.js — Hook React pour les prix temps réel
 *
 * Charge le cache /api/prices au montage.
 * Fallback silencieux vers MATERIAL_PRICES statique si :
 *   - l'API répond 404 (cache pas encore généré)
 *   - l'API répond 503 (erreur serveur)
 *   - le fetch échoue (réseau, SSR, etc.)
 *
 * Usage :
 *   const { prices, stores, date, live, staleDays } = useLivePrices();
 *
 *   - prices    : tableau MATERIAL_PRICES (live ou statique)
 *   - stores    : tableau STORES (inchangé)
 *   - date      : date de dernière mise à jour (string 'YYYY-MM-DD' ou null)
 *   - live      : true si les prix viennent du cache scrappé
 *   - staleDays : nombre de jours depuis la dernière mise à jour (null si statique)
 */

import { useState, useEffect } from 'react';
import { MATERIAL_PRICES, STORES } from '@/lib/materialPrices.js';

const STALE_THRESHOLD_DAYS = 30;

function computeStaleDays(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function useLivePrices() {
  const [state, setState] = useState({
    prices:    MATERIAL_PRICES,
    stores:    STORES,
    date:      null,
    live:      false,
    staleDays: null,
    sources:   [],
  });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/prices')
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        if (!data?.prices?.length) return;

        const staleDays = computeStaleDays(data.date);

        setState({
          prices:    data.prices,
          stores:    STORES,
          date:      data.date ?? null,
          live:      true,
          staleDays,
          sources:   data.sources ?? [],
        });
      })
      .catch(() => {
        // Fallback silencieux — les prix statiques restent actifs
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}

/**
 * Helper : indique si le cache est considéré comme périmé.
 */
export function isPricesCacheStale(staleDays) {
  return staleDays !== null && staleDays > STALE_THRESHOLD_DAYS;
}
