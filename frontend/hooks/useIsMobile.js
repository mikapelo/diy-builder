'use client';

import { useEffect, useState } from 'react';

/**
 * useIsMobile — détection viewport mobile.
 *
 * Retourne `true` si la fenêtre est ≤ breakpoint (default 640px).
 * Réagit aux changements de taille (resize + orientationchange).
 *
 * SSR-safe : renvoie false par défaut, puis se synchronise au mount.
 *
 * @param {number} breakpoint - Largeur max en px (défaut 640)
 * @returns {boolean}
 */
export default function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mq.matches);

    onChange(); // initial sync

    // Compat anciens navigateurs (Safari < 14)
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    } else {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, [breakpoint]);

  return isMobile;
}
