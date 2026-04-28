'use client';

/**
 * useFocusTrap — piege le focus clavier a l'interieur d'un conteneur (WCAG 2.1).
 *
 * Usage :
 *   const panelRef = useRef(null);
 *   useFocusTrap(open, panelRef);
 *   return <div ref={panelRef}>…</div>;
 *
 * Comportement :
 *   - A l'activation : memorise document.activeElement (element declencheur).
 *   - Sur Tab : boucle le focus du dernier au premier element focusable du conteneur.
 *   - Sur Shift+Tab : boucle du premier au dernier.
 *   - Au demontage / desactivation : restitue le focus au declencheur.
 *
 * Les elements disables ou `tabindex="-1"` sont exclus du cycle.
 */

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

function getFocusables(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

export default function useFocusTrap(active, containerRef) {
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    // Memorise l'element declencheur pour restitution ulterieure
    returnFocusRef.current = document.activeElement;

    const handleKey = (e) => {
      if (e.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;
      const focusables = getFocusables(container);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;

      // Focus hors du conteneur : recentrer sur le premier
      if (!container.contains(activeEl)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      const toRestore = returnFocusRef.current;
      if (toRestore && typeof toRestore.focus === 'function' && document.body.contains(toRestore)) {
        // Restitue le focus au declencheur (accessibilite : pas de focus perdu sur body)
        toRestore.focus();
      }
    };
  }, [active, containerRef]);
}
