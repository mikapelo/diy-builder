/**
 * useSimulationStart.test.jsx
 *
 * Invariants (audit CTA devis du 25/08/2026) :
 *   - l'événement porte le VRAI module — la version précédente écrivait
 *     'cabanon' en dur, laissant pergola/terrasse/clôture à zéro
 *   - il ne part PAS au montage : seulement au premier changement de dimension
 *   - un seul envoi, quel que soit le nombre de réglages
 *   - un changement de module rouvre la mesure
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('@/hooks/useAnalytics.js', () => ({ trackSimulationStart: vi.fn() }));

import useSimulationStart from '@/hooks/useSimulationStart';
import { trackSimulationStart } from '@/hooks/useAnalytics.js';

beforeEach(() => vi.clearAllMocks());

const monter = (props) =>
  renderHook(({ t, w, d }) => useSimulationStart(t, w, d), { initialProps: props });

describe('useSimulationStart', () => {
  it('ne part pas au montage — arriver sur le simulateur n\'est pas simuler', () => {
    monter({ t: 'pergola', w: 4, d: 3 });
    expect(trackSimulationStart).not.toHaveBeenCalled();
  });

  it('part au premier changement de dimension, avec le vrai module', () => {
    const { rerender } = monter({ t: 'pergola', w: 4, d: 3 });
    rerender({ t: 'pergola', w: 5, d: 3 });
    expect(trackSimulationStart).toHaveBeenCalledWith({ module: 'pergola', width: 5, depth: 3 });
  });

  it.each(['terrasse', 'cabanon', 'pergola', 'cloture'])(
    'couvre le module %s (avant : cabanon seul était instrumenté)',
    (module) => {
      const { rerender } = monter({ t: module, w: 4, d: 3 });
      rerender({ t: module, w: 4.5, d: 3 });
      expect(trackSimulationStart).toHaveBeenCalledWith(
        expect.objectContaining({ module }),
      );
    },
  );

  it('un seul envoi malgré plusieurs réglages', () => {
    const { rerender } = monter({ t: 'cloture', w: 10, d: 1.5 });
    rerender({ t: 'cloture', w: 11, d: 1.5 });
    rerender({ t: 'cloture', w: 12, d: 1.5 });
    rerender({ t: 'cloture', w: 12, d: 2 });
    expect(trackSimulationStart).toHaveBeenCalledTimes(1);
  });

  it('changement de module → nouvelle mesure', () => {
    const { rerender } = monter({ t: 'pergola', w: 4, d: 3 });
    rerender({ t: 'pergola', w: 5, d: 3 });
    rerender({ t: 'cabanon', w: 4, d: 3 });
    rerender({ t: 'cabanon', w: 4.5, d: 3 });
    expect(trackSimulationStart).toHaveBeenCalledTimes(2);
    expect(trackSimulationStart).toHaveBeenLastCalledWith(
      expect.objectContaining({ module: 'cabanon' }),
    );
  });

  it('dimensions invalides ignorées', () => {
    const { rerender } = monter({ t: 'pergola', w: 0, d: 0 });
    rerender({ t: 'pergola', w: 0, d: 3 });
    expect(trackSimulationStart).not.toHaveBeenCalled();
  });
});
