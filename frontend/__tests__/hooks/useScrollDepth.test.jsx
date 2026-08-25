/**
 * useScrollDepth.test.jsx
 *
 * « L'exposition est le facteur limitant » était une déduction tirée de la
 * longueur des pages (70 000 à 100 000 px), jamais une mesure. Ce hook la
 * transforme en donnée. Contraintes vérifiées ici : bornage aux guides, deux
 * seuils, aucun doublon, et volume plafonné.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

let cheminCourant = '/guides/pergola';
vi.mock('next/navigation', () => ({ usePathname: () => cheminCourant }));
vi.mock('@/hooks/useAnalytics.js', () => ({ trackEvent: vi.fn() }));

import useScrollDepth from '@/hooks/useScrollDepth';
import { trackEvent } from '@/hooks/useAnalytics.js';

/** Place le défilement à un pourcentage donné et notifie les écouteurs. */
function defiler(pct) {
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 10000, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true, writable: true });
  window.scrollY = Math.round((10000 - 1000) * pct / 100);
  window.dispatchEvent(new Event('scroll'));
}

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  cheminCourant = '/guides/pergola';
  // la limitation est temporelle : on repart d'une horloge avancée
  vi.spyOn(performance, 'now').mockReturnValue(0);
});

const avancerHorloge = (ms) => performance.now.mockReturnValue(performance.now() + ms);

describe('useScrollDepth', () => {
  it('sous 50 % → aucun événement', () => {
    renderHook(() => useScrollDepth());
    defiler(30);
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it('50 % franchi → un événement, avec la page', () => {
    renderHook(() => useScrollDepth());
    defiler(60);
    expect(trackEvent).toHaveBeenCalledWith('scroll-depth', { seuil: 50, page: '/guides/pergola' });
  });

  it('90 % franchi → les deux seuils, jamais plus', () => {
    renderHook(() => useScrollDepth());
    defiler(60);
    avancerHorloge(500);
    defiler(95);
    expect(trackEvent).toHaveBeenCalledTimes(2);
    expect(trackEvent).toHaveBeenLastCalledWith('scroll-depth', { seuil: 90, page: '/guides/pergola' });
  });

  it('redescendre puis remonter ne recompte pas', () => {
    renderHook(() => useScrollDepth());
    defiler(95);
    avancerHorloge(500); defiler(10);
    avancerHorloge(500); defiler(95);
    expect(trackEvent).toHaveBeenCalledTimes(2);
  });

  it.each(['/', '/calculateur', '/guides', '/politique-confidentialite'])(
    'hors guides (%s) → rien',
    (chemin) => {
      cheminCourant = chemin;
      renderHook(() => useScrollDepth());
      defiler(95);
      expect(trackEvent).not.toHaveBeenCalled();
    },
  );

  it('plafond : deux événements par page, quoi qu\'il arrive', () => {
    renderHook(() => useScrollDepth());
    for (let i = 0; i < 20; i++) { avancerHorloge(500); defiler(50 + i * 3); }
    expect(trackEvent).toHaveBeenCalledTimes(2);
  });
});
