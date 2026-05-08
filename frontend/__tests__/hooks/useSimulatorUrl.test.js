/**
 * useSimulatorUrl.test.js
 *
 * Teste readSimulatorUrlParams (pure function) :
 *   - parsing valide
 *   - NaN → null
 *   - clamp aux bornes BOUNDS
 *   - SSR (window absent) → null
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readSimulatorUrlParams } from '@/hooks/useSimulatorUrl.js';

function setSearch(qs) {
  window.history.replaceState(null, '', `/?${qs}`);
}

describe('readSimulatorUrlParams', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('parse w, d, h valides', () => {
    setSearch('w=4&d=3&h=2.4');
    expect(readSimulatorUrlParams()).toEqual({ w: 4, d: 3, h: 2.4 });
  });

  it('valeurs absentes → null', () => {
    setSearch('');
    expect(readSimulatorUrlParams()).toEqual({ w: null, d: null, h: null });
  });

  it('NaN → null pour le champ concerné', () => {
    setSearch('w=foo&d=2&h=bar');
    expect(readSimulatorUrlParams()).toEqual({ w: null, d: 2, h: null });
  });

  it('clamp aux bornes basses (w >= 0.5)', () => {
    setSearch('w=0.1&d=0.1&h=0.1');
    expect(readSimulatorUrlParams()).toEqual({ w: 0.5, d: 0.5, h: 1.8 });
  });

  it('clamp aux bornes hautes (w <= 30)', () => {
    setSearch('w=99&d=99&h=99');
    expect(readSimulatorUrlParams()).toEqual({ w: 30, d: 20, h: 3.0 });
  });

  it('arrondi à 0.1 m', () => {
    setSearch('w=4.234&d=3.567&h=2.451');
    const r = readSimulatorUrlParams();
    expect(r.w).toBeCloseTo(4.2, 5);
    expect(r.d).toBeCloseTo(3.6, 5);
    expect(r.h).toBeCloseTo(2.5, 5);
  });
});
