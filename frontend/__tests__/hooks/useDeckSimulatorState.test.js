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

describe('useDeckSimulatorState — valeurs initiales', () => {
  it('width initial = 5.5 m', () => {
    const { result } = renderHook(() => useDeckSimulatorState());
    expect(result.current.width).toBe(5.5);
  });

  it('depth initial = 3.5 m', () => {
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
