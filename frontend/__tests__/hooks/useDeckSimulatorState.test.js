/**
 * useDeckSimulatorState.test.js
 *
 * Teste le hook centralisé d'état du simulateur :
 *   - valeurs initiales documentées
 *   - setters fonctionnels
 *   - pas de régression si l'on change les defaults
 *
 * Environnement : jsdom (renderHook crée un composant React)
 */
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeckSimulatorState } from '@/core/useDeckSimulatorState.js';
import { PROJECT_DEFAULTS } from '@/lib/seoSchemas.js';
import { boundsFor } from '@/components/simulator/DeckControls.jsx';

describe('useDeckSimulatorState — valeurs initiales', () => {
  it('width initial terrasse = 5.5 m', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    expect(result.current.width).toBe(5.5);
  });

  it('depth initial terrasse = 3.5 m', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    expect(result.current.depth).toBe(3.5);
  });

  it('height initial = 2.3 m', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    expect(result.current.height).toBe(2.3);
  });

  it("viewMode initial = 'assembled'", () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    expect(result.current.viewMode).toBe('assembled');
  });

  it("foundationType initial = 'ground'", () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    expect(result.current.foundationType).toBe('ground');
  });

  it('slabThickness initial = 12 cm', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    expect(result.current.slabThickness).toBe(12);
  });
});

describe('useDeckSimulatorState — setters', () => {
  it('setWidth met à jour width', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    act(() => result.current.setWidth(4.0));
    expect(result.current.width).toBe(4.0);
  });

  it('setDepth met à jour depth', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    act(() => result.current.setDepth(6.0));
    expect(result.current.depth).toBe(6.0);
  });

  it('setHeight met à jour height', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    act(() => result.current.setHeight(2.8));
    expect(result.current.height).toBe(2.8);
  });

  it("setViewMode permet de passer à 'detailed'", () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    act(() => result.current.setViewMode('detailed'));
    expect(result.current.viewMode).toBe('detailed');
  });

  it("setViewMode permet de passer à 'exploded'", () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    act(() => result.current.setViewMode('exploded'));
    expect(result.current.viewMode).toBe('exploded');
  });

  it("setFoundationType bascule vers 'slab'", () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    act(() => result.current.setFoundationType('slab'));
    expect(result.current.foundationType).toBe('slab');
  });

  it('setSlabThickness met à jour slabThickness', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    act(() => result.current.setSlabThickness(15));
    expect(result.current.slabThickness).toBe(15);
  });
});

/* ── Régression C-1 (audit simulateurs 2026-07-01) ──────────────────
   Un trio de défauts global (5.5 × 3.5) ouvrait la clôture à 3,50 m de haut
   pour une borne UI à 2,20 m, et le cabanon à 5,50 m de large pour un max
   de 5 m. InputStepper ne clampe pas la valeur initiale : le 1er rendu,
   le premier calcul, la 3D et le PDF partaient donc faux.
   Invariant : pour chaque module, (w, d) initial ∈ [min, max] de ses bornes. */
describe('useDeckSimulatorState — défauts par module dans les bornes', () => {
  // showHeight tel que calculé dans DeckSimulator : ni terrasse, ni clôture
  const showHeightFor = (t) => t !== 'terrasse' && t !== 'cloture';

  for (const projectType of Object.keys(PROJECT_DEFAULTS)) {
    it(`${projectType} : width et depth initiaux respectent boundsFor()`, () => {
      const { result } = renderHook(() => useDeckSimulatorState(projectType));
      const b = boundsFor(projectType, showHeightFor(projectType));

      expect(result.current.width).toBeGreaterThanOrEqual(b.wMin);
      expect(result.current.width).toBeLessThanOrEqual(b.wMax);
      expect(result.current.depth).toBeGreaterThanOrEqual(b.dMin);
      expect(result.current.depth).toBeLessThanOrEqual(b.dMax);
    });
  }

  /* Un <input type="range"> aligne son thumb sur la grille min + k × step.
     Un défaut hors grille affiche donc un curseur en désaccord avec le champ
     chiffré (clôture : champ 1,50 m, thumb 1,30 m au pas de 0,5 m). */
  for (const projectType of Object.keys(PROJECT_DEFAULTS)) {
    it(`${projectType} : défauts alignés sur la grille du curseur`, () => {
      const { result } = renderHook(() => useDeckSimulatorState(projectType));
      const b = boundsFor(projectType, showHeightFor(projectType));
      const onGrid = (v, min, step) => Math.abs((v - min) / step - Math.round((v - min) / step)) < 1e-9;

      expect(onGrid(result.current.width, b.wMin, 0.5)).toBe(true);
      expect(onGrid(result.current.depth, b.dMin, b.dStep ?? 0.5)).toBe(true);
    });
  }

  it('clôture : hauteur initiale 1,50 m, sous le plafond légal courant (2,60 m)', () => {
    const { result } = renderHook(() => useDeckSimulatorState('cloture'));
    expect(result.current.depth).toBe(1.5);   // depth = hauteur pour la clôture
    expect(result.current.width).toBe(15);
    expect(result.current.depth).toBeLessThan(2.6);
  });

  it('module inconnu : repli sur les défauts terrasse', () => {
    const { result } = renderHook(() => useDeckSimulatorState('bardage'));
    expect(result.current.width).toBe(PROJECT_DEFAULTS.terrasse.w);
    expect(result.current.depth).toBe(PROJECT_DEFAULTS.terrasse.d);
  });
});

describe('useDeckSimulatorState — contrat de surface', () => {
  it('expose tous les setters attendus', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    const keys = Object.keys(result.current);
    expect(keys).toContain('setWidth');
    expect(keys).toContain('setDepth');
    expect(keys).toContain('setHeight');
    expect(keys).toContain('setViewMode');
    expect(keys).toContain('setFoundationType');
    expect(keys).toContain('setSlabThickness');
  });
});
