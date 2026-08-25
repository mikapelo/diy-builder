'use client';

/**
 * useScrollDepth — mesure jusqu'où les guides sont réellement lus.
 *
 * L'audit du 25/08 a conclu que l'exposition était le facteur limitant du CTA
 * devis : les pages font 70 000 à 100 000 px et le CTA n'apparaissait qu'à 94 %.
 * C'était une **déduction tirée de la longueur des pages**, jamais une mesure.
 * Ce hook la transforme en donnée : sans elle, impossible de savoir si le CTA
 * remonté à ~21 % est seulement vu.
 *
 * Volume maîtrisé — deux seuils seulement (50 % et 90 %), une fois chacun par
 * page et par onglet, et uniquement sous /guides/. Plafond : 2 événements par
 * vue de guide, là où un suivi 25/50/75/100 sur tout le site en produirait
 * quatre fois plus pour une instance Umami auto-hébergée en offre gratuite.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/hooks/useAnalytics.js';

const SEUILS = [50, 90];

export default function useScrollDepth() {
  /* usePathname et non window.location : monté dans le layout racine, l'effet
     ne serait joué qu'une fois sans cette dépendance — les navigations côté
     client ne seraient jamais mesurées. */
  const path = usePathname();

  useEffect(() => {
    if (!path?.startsWith('/guides/')) return;

    const atteints = new Set();
    // -Infinity et non 0 : sinon le tout premier défilement tombe dans la
    // fenêtre de limitation et serait ignoré
    let dernierAppel = -Infinity;

    const mesurer = () => {
      const doc = document.documentElement;
      const hauteurUtile = doc.scrollHeight - window.innerHeight;
      if (hauteurUtile <= 0) return;

      const pct = ((window.scrollY / hauteurUtile) * 100);
      for (const seuil of SEUILS) {
        if (pct < seuil || atteints.has(seuil)) continue;
        atteints.add(seuil);

        const cle = `scroll-depth:${path}:${seuil}`;
        try {
          if (sessionStorage.getItem(cle)) continue;
          sessionStorage.setItem(cle, '1');
        } catch { /* navigation privée : on trace quand même */ }

        trackEvent('scroll-depth', { seuil, page: path });
      }
      if (atteints.size === SEUILS.length) retirer();
    };

    /* Limitation par horloge et non par requestAnimationFrame : rAF ne
       s'exécute pas dans un onglet d'arrière-plan, et le drapeau « en attente »
       resterait alors bloqué — le suivi s'arrêterait définitivement pour la
       page. Le calcul est trivial, 200 ms suffisent amplement. */
    const onScroll = () => {
      const t = performance.now();
      if (t - dernierAppel < 200) return;
      dernierAppel = t;
      mesurer();
    };

    const retirer = () => window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return retirer;
  }, [path]);
}
