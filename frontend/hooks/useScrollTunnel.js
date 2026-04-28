'use client';

/**
 * useScrollTunnel — reveal progressif + soft-snap des sections résultats
 *
 * Extrait de DeckSimulator.jsx (Phase B — décomposition orchestrateur).
 *
 * Attache un scroll listener sur window. Pour chaque .sim-tunnel-section :
 *   - Ajoute .revealed quand la section entre dans le viewport
 *   - Ajoute .active à la section la plus visible
 *   - Après arrêt du scroll, snap doucement vers la section la plus proche
 *
 * @param {React.RefObject} tunnelRef — ref vers le conteneur .sim-tunnel
 */
import { useEffect } from 'react';

export function useScrollTunnel(tunnelRef) {
  useEffect(() => {
    const tunnel = tunnelRef.current;
    if (!tunnel) return;

    let activeEl = null;
    let ticking = false;
    let snapTimer = null;
    let isSnapping = false;

    const SNAP_DELAY  = 180;
    const SNAP_ZONE   = 120;
    const SNAP_OFFSET = 20;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const sections = tunnel.querySelectorAll('.sim-tunnel-section');
        const vh = window.innerHeight;
        const revealLine = vh - 60;
        const activeBand = vh * 0.4;

        let bestSection = null;
        let bestDist = Infinity;

        sections.forEach((s) => {
          const rect = s.getBoundingClientRect();

          if (!s.classList.contains('revealed') && rect.top < revealLine) {
            s.classList.add('revealed');
          }

          if (rect.top < activeBand && rect.bottom > 80) {
            const dist = Math.abs(rect.top - activeBand * 0.3);
            if (dist < bestDist) {
              bestDist = dist;
              bestSection = s;
            }
          }
        });

        const atBottom = (window.scrollY + vh) >= (document.documentElement.scrollHeight - 80);
        if (atBottom && sections.length) {
          bestSection = sections[sections.length - 1];
        }

        if (bestSection !== activeEl) {
          if (activeEl) activeEl.classList.remove('active');
          if (bestSection) bestSection.classList.add('active');
          activeEl = bestSection;
        }
      });

      if (!isSnapping) {
        clearTimeout(snapTimer);
        snapTimer = setTimeout(doSoftSnap, SNAP_DELAY);
      }
    }

    function doSoftSnap() {
      const sections = tunnel.querySelectorAll('.sim-tunnel-section.revealed');
      if (!sections.length) return;

      const tunnelRect = tunnel.getBoundingClientRect();
      if (tunnelRect.bottom < 0 || tunnelRect.top > window.innerHeight) return;

      let closest = null;
      let closestDist = Infinity;

      sections.forEach((s) => {
        const top = s.getBoundingClientRect().top;
        const dist = Math.abs(top - SNAP_OFFSET);
        if (dist < SNAP_ZONE && dist < closestDist) {
          closestDist = dist;
          closest = s;
        }
      });

      if (!closest) return;

      const target = closest.getBoundingClientRect().top + window.scrollY - SNAP_OFFSET;
      const delta = Math.abs(window.scrollY - target);
      if (delta < 4) return;

      isSnapping = true;
      window.scrollTo({ top: target, behavior: 'smooth' });
      setTimeout(() => { isSnapping = false; }, 450);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(snapTimer);
      if (activeEl) activeEl.classList.remove('active');
    };
  }, [tunnelRef]);
}
