// @vitest-environment jsdom
/**
 * useSimulatorUrl.test.jsx — Sync URL ↔ dimensions, sans fausse page vue
 *
 * Invariant central (D-1, audit du 26/08/2026) : écrire l'URL ne doit PAS
 * passer par `history.replaceState`, qu'Umami et le routeur Next remplacent
 * chacun par une propriété propre à l'objet `history`. Celle d'Umami envoyait
 * une page vue à chaque cran de curseur stabilisé — 75 % des « pages vues »
 * simulateur sur 28 jours.
 *
 * Le test simule exactement ce montage : une propriété propre qui compte les
 * appels, au-dessus de `History.prototype`.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSimulatorUrl, readSimulatorUrlParams } from '@/hooks/useSimulatorUrl';

/** Rejoue le montage réel : Umami/Next posent une propriété propre sur `history`. */
function poserPatchAnalytics() {
  const appels = [];
  const natif = History.prototype.replaceState;
  Object.defineProperty(window.history, 'replaceState', {
    value: function (state, unused, url) {
      appels.push(url);                       // ← la « page vue » parasite
      return natif.call(window.history, state, unused, url);
    },
    configurable: true, writable: true,
  });
  return appels;
}

function retirerPatch() {
  delete window.history.replaceState;
}

beforeEach(() => {
  vi.useFakeTimers();
  History.prototype.replaceState.call(window.history, { __NA: true }, '', '/pergola');
});

afterEach(() => {
  retirerPatch();
  vi.useRealTimers();
});

describe('useSimulatorUrl — l\'URL suit les dimensions', () => {
  it('écrit w, d et h après le debounce', () => {
    const { rerender } = renderHook(({ w, d, h }) => useSimulatorUrl(w, d, h), {
      initialProps: { w: 5.5, d: 3.5, h: 2.3 },
    });
    rerender({ w: 5.0, d: 2.5, h: 2.2 });
    vi.advanceTimersByTime(500);
    expect(window.location.search).toBe('?w=5.0&d=2.5&h=2.2');
  });

  it('n\'écrit rien au premier rendu — les valeurs viennent déjà de l\'URL', () => {
    renderHook(() => useSimulatorUrl(5.5, 3.5, 2.3));
    vi.advanceTimersByTime(500);
    expect(window.location.search).toBe('');
  });

  it('omet h pour les modules sans hauteur (terrasse, clôture)', () => {
    const { rerender } = renderHook(({ w, d, h }) => useSimulatorUrl(w, d, h), {
      initialProps: { w: 4.0, d: 3.0, h: undefined },
    });
    rerender({ w: 4.5, d: 3.0, h: undefined });
    vi.advanceTimersByTime(500);
    expect(window.location.search).toBe('?w=4.5&d=3.0');
  });
});

describe('useSimulatorUrl — aucune page vue parasite (D-1)', () => {
  it('ne passe PAS par le replaceState patché par Umami', () => {
    const appels = poserPatchAnalytics();
    const { rerender } = renderHook(({ w, d, h }) => useSimulatorUrl(w, d, h), {
      initialProps: { w: 5.5, d: 3.5, h: 2.3 },
    });
    rerender({ w: 5.0, d: 3.5, h: 2.3 });
    vi.advanceTimersByTime(500);

    expect(window.location.search).toBe('?w=5.0&d=3.5&h=2.3');   // l'URL suit…
    expect(appels).toEqual([]);                                   // …sans page vue
  });

  it('16 changements de dimension = 0 page vue (le profil de la session du 26/08)', () => {
    const appels = poserPatchAnalytics();
    const { rerender } = renderHook(({ w, d, h }) => useSimulatorUrl(w, d, h), {
      initialProps: { w: 5.5, d: 3.0, h: 2.3 },
    });
    for (let i = 0; i < 16; i++) {
      rerender({ w: 5.5 - i * 0.1, d: 3.0, h: 2.3 });
      vi.advanceTimersByTime(500);
    }
    expect(appels).toEqual([]);
    expect(window.location.search).toBe('?w=4.0&d=3.0&h=2.3');
  });

  it('reporte history.state — Next y range son arbre de routage', () => {
    const { rerender } = renderHook(({ w, d, h }) => useSimulatorUrl(w, d, h), {
      initialProps: { w: 5.5, d: 3.5, h: 2.3 },
    });
    rerender({ w: 5.0, d: 3.5, h: 2.3 });
    vi.advanceTimersByTime(500);
    // Passer `null` ici casserait la navigation arrière du routeur App Router
    expect(window.history.state).toEqual({ __NA: true });
  });

  it('une valeur inchangée n\'écrit pas du tout', () => {
    History.prototype.replaceState.call(window.history, { __NA: true }, '', '/pergola?w=5.0&d=3.5&h=2.3');
    const appels = poserPatchAnalytics();
    const spy = vi.spyOn(History.prototype, 'replaceState');
    const { rerender } = renderHook(({ w, d, h }) => useSimulatorUrl(w, d, h), {
      initialProps: { w: 5.0, d: 3.5, h: 2.3 },
    });
    rerender({ w: 5.0, d: 3.5, h: 2.3 });
    vi.advanceTimersByTime(500);
    expect(spy).not.toHaveBeenCalled();
    expect(appels).toEqual([]);
    spy.mockRestore();
  });
});

describe('readSimulatorUrlParams — lecture bornée', () => {
  it('lit et arrondit au décimètre', () => {
    History.prototype.replaceState.call(window.history, null, '', '/pergola?w=5.47&d=2.53&h=2.31');
    expect(readSimulatorUrlParams()).toEqual({ w: 5.5, d: 2.5, h: 2.3 });
  });

  it('borne les valeurs aberrantes au lieu de les accepter', () => {
    History.prototype.replaceState.call(window.history, null, '', '/pergola?w=999&d=-40&h=0.1');
    expect(readSimulatorUrlParams()).toEqual({ w: 30, d: 0.5, h: 1.8 });
  });

  it('renvoie null pour un paramètre absent ou illisible', () => {
    History.prototype.replaceState.call(window.history, null, '', '/pergola?w=abc');
    expect(readSimulatorUrlParams()).toEqual({ w: null, d: null, h: null });
  });
});
