'use client';

/**
 * useSimulatorUrl.js — Sync URL ↔ dimensions simulateur
 *
 * Encode uniquement w, d, h dans l'URL (?w=4.0&d=3.0&h=2.3).
 * Pas de BOM, pas de budget, pas de viewMode — intentionnellement limité.
 *
 * Objectif : bookmark personnel ou partage familial.
 * Le résultat complet (matériaux, prix) nécessite toujours de passer
 * par le simulateur — ce qui préserve le tunnel de lead artisan.
 *
 * Usage :
 *   useSimulatorUrl(width, depth, height);  // dans SimulatorContent
 */

import { useEffect, useRef } from 'react';

// Bornes globales de sécurité pour la lecture des params URL
const BOUNDS = {
  w: [0.5, 30],
  d: [0.5, 20],
  h: [1.8, 3.0],
};

/**
 * Lit les params w, d, h depuis l'URL courante.
 * Appelé au moment de l'initialisation du state (lazy initializer).
 * @returns {{ w: number|null, d: number|null, h: number|null }}
 */
export function readSimulatorUrlParams() {
  if (typeof window === 'undefined') return { w: null, d: null, h: null };
  const p = new URLSearchParams(window.location.search);
  const parse = (key) => {
    const v = parseFloat(p.get(key));
    if (isNaN(v)) return null;
    const [min, max] = BOUNDS[key];
    return Math.min(Math.max(Math.round(v * 10) / 10, min), max);
  };
  return { w: parse('w'), d: parse('d'), h: parse('h') };
}

/**
 * Hook qui met à jour l'URL quand les dimensions changent.
 * Utilise replaceState (pas pushState) pour ne pas polluer l'historique.
 * Debounced à 500ms pour ne pas écrire à chaque pixel de slider.
 *
 * @param {number} width
 * @param {number} depth
 * @param {number|undefined} height  — undefined pour terrasse et clôture
 */
export function useSimulatorUrl(width, depth, height) {
  const timerRef   = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Ignorer le premier rendu (valeurs viennent déjà de l'URL ou des defaults)
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      params.set('w', width.toFixed(1));
      params.set('d', depth.toFixed(1));
      if (height !== undefined) {
        params.set('h', height.toFixed(1));
      } else {
        params.delete('h');
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }, 500);

    return () => clearTimeout(timerRef.current);
  }, [width, depth, height]);
}
