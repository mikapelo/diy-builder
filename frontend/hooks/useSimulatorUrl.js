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
 * Écrit l'URL sans déclencher de « page vue ».
 *
 * D-1 (audit tracking du 26/08/2026) — Umami et le routeur Next remplacent
 * chacun `history.replaceState` par une propriété propre à l'objet `history`,
 * et celle d'Umami envoie une page vue à chaque appel. Résultat : **1 251 des
 * 1 677 « pages vues » simulateur sur 28 jours (75 %) étaient des crans de
 * curseur** — la session qui a produit le lead du 26/08 en pesait 24 à elle
 * seule. Tout taux ayant « vues simulateur » au dénominateur était faux d'un
 * facteur 4, et le rebond du site mécaniquement sous-estimé.
 *
 * `History.prototype.replaceState` court-circuite les deux propriétés propres.
 * Vérifié en direct sur la production : la méthode patchée envoie 1 page vue,
 * la native 0, et l'URL change dans les deux cas.
 *
 * **`history.state` est reporté, pas écrasé.** Next y range `__NA` et
 * `__PRIVATE_NEXTJS_INTERNALS_TREE` ; passer `null` comme le faisait l'ancien
 * appel les effacerait — sans le patch Next pour les réinjecter, la navigation
 * arrière du routeur casserait.
 */
function replaceUrlSansPageVue(newUrl) {
  const natif = window.History?.prototype?.replaceState;
  if (typeof natif === 'function') {
    natif.call(window.history, window.history.state, '', newUrl);
  } else {
    // Environnement sans History.prototype : l'URL prime sur la mesure.
    window.history.replaceState(window.history.state, '', newUrl);
  }
}

/**
 * Hook qui met à jour l'URL quand les dimensions changent.
 * Utilise replaceState (pas pushState) pour ne pas polluer l'historique.
 * Debounced à 500ms pour ne pas écrire à chaque pixel de slider — le debounce
 * ne suffisait pas : chaque valeur STABILISÉE produisait quand même une page vue.
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
      if (newUrl === window.location.pathname + window.location.search) return;
      replaceUrlSansPageVue(newUrl);
    }, 500);

    return () => clearTimeout(timerRef.current);
  }, [width, depth, height]);
}
