'use client';
import { useCallback, useRef } from 'react';

/**
 * Scroll-reveal hook using IntersectionObserver.
 *
 * Returns a callback ref — attach it to the container that holds
 * `.reveal` / `.reveal-scale` elements. The observer fires once
 * per element, adding `.is-visible` when it enters the viewport.
 *
 * Also tracks `.snap-section` elements: adds `.section-active`
 * to the most visible section for a subtle focus effect.
 */
export function useScrollReveal(options = {}) {
  const observerRef = useRef(null);
  const sectionObserverRef = useRef(null);

  const callbackRef = useCallback((container) => {
    // Disconnect previous observers
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (sectionObserverRef.current) {
      sectionObserverRef.current.disconnect();
      sectionObserverRef.current = null;
    }

    if (!container) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      container.querySelectorAll('.reveal, .reveal-scale').forEach(el => {
        el.classList.add('is-visible');
      });
      container.querySelectorAll('.snap-section').forEach(el => {
        el.classList.add('section-active');
      });
      return;
    }

    // ── Reveal observer (one-shot per element) ──
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    const targets = container.querySelectorAll('.reveal, .reveal-scale');
    targets.forEach((el) => revealObserver.observe(el));
    observerRef.current = revealObserver;

    // ── Section active observer (continuous) ──
    const sections = container.querySelectorAll('.snap-section');
    if (sections.length === 0) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-active');
          } else {
            entry.target.classList.remove('section-active');
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: '0px',
      }
    );

    sections.forEach((el) => sectionObserver.observe(el));
    sectionObserverRef.current = sectionObserver;
  }, []);

  return callbackRef;
}
