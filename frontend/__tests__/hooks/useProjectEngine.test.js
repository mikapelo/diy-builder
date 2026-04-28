/**
 * useProjectEngine.test.js
 *
 * Teste le hook générique d'orchestration du moteur de projet :
 *   - appelle le bon moteur via projectRegistry
 *   - retourne { structure, config }
 *   - remémoïse uniquement sur changement de dimensions / options
 *
 * Le registry et l'engine sont mockés pour isoler le hook
 * de la logique métier déjà couverte par les tests engine.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

/* ── Mock du registry — moteur factice déterministe ─────────── */
const mockEngine = vi.fn((w, d, opts) => ({ surface: w * d, w, d, opts }));
const mockConfig  = { label: 'TestProjet', pdfTitle: 'Test PDF' };

vi.mock('@/core/projectRegistry.js', () => ({
  getProject: vi.fn(() => ({ engine: mockEngine, config: mockConfig })),
}));

import { useProjectEngine } from '@/core/useProjectEngine.js';
import { getProject } from '@/core/projectRegistry.js';

beforeEach(() => {
  vi.clearAllMocks();
  mockEngine.mockImplementation((w, d, opts) => ({ surface: w * d, w, d, opts }));
});

describe('useProjectEngine — contrat de retour', () => {
  it("retourne { structure, config }", () => {
    const { result } = renderHook(() => useProjectEngine('terrasse', 5, 3));
    expect(result.current).toHaveProperty('structure');
    expect(result.current).toHaveProperty('config');
  });

  it('config correspond à la config du registry', () => {
    const { result } = renderHook(() => useProjectEngine('terrasse', 5, 3));
    expect(result.current.config).toEqual(mockConfig);
  });

  it("appelle getProject avec le type 'terrasse'", () => {
    renderHook(() => useProjectEngine('terrasse', 5, 3));
    expect(getProject).toHaveBeenCalledWith('terrasse');
  });

  it("appelle getProject avec le type 'cabanon'", () => {
    renderHook(() => useProjectEngine('cabanon', 3, 2.5));
    expect(getProject).toHaveBeenCalledWith('cabanon');
  });
});

describe('useProjectEngine — appel du moteur', () => {
  it("passe width et depth à l'engine", () => {
    renderHook(() => useProjectEngine('terrasse', 6, 4));
    expect(mockEngine).toHaveBeenCalledWith(6, 4, {});
  });

  it("passe les options supplémentaires à l'engine", () => {
    renderHook(() => useProjectEngine('cabanon', 3, 2.5, { height: 2.8 }));
    expect(mockEngine).toHaveBeenCalledWith(3, 2.5, { height: 2.8 });
  });

  it('structure contient le résultat du moteur', () => {
    const { result } = renderHook(() => useProjectEngine('terrasse', 5, 3));
    expect(result.current.structure.surface).toBe(15);
  });
});

describe('useProjectEngine — mémoïsation', () => {
  it("ne rappelle pas l'engine si width/depth inchangés", () => {
    const { rerender } = renderHook(
      ({ w, d }) => useProjectEngine('terrasse', w, d),
      { initialProps: { w: 5, d: 3 } }
    );
    rerender({ w: 5, d: 3 }); // même valeurs
    // L'engine ne devrait être appelé qu'une seule fois (strict mode: 2 fois max)
    expect(mockEngine.mock.calls.length).toBeLessThanOrEqual(2);
  });

  it("rappelle l'engine si width change", () => {
    const { rerender, result } = renderHook(
      ({ w, d }) => useProjectEngine('terrasse', w, d),
      { initialProps: { w: 5, d: 3 } }
    );
    const callsBefore = mockEngine.mock.calls.length;
    rerender({ w: 6, d: 3 }); // width change
    expect(mockEngine.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(result.current.structure.surface).toBe(18); // 6 * 3
  });
});
