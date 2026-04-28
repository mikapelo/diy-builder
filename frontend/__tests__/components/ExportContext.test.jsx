// @vitest-environment jsdom
/**
 * ExportContext.test.jsx
 *
 * Teste le Context qui remplace window.__r3fExport :
 *   - set/get de la valeur bridge (useRef, pas de re-render)
 *   - useSetExportBridge et useExportBridge fonctionnent en tandem
 *   - throw si utilisés hors du Provider
 *   - getBridge() retourne null avant tout setBridge()
 *
 * Pas de Three.js requis.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import {
  ExportBridgeProvider,
  useSetExportBridge,
  useExportBridge,
} from '@/components/simulator/shared/ExportContext.jsx';

afterEach(cleanup);

/* ── Wrapper helper pour les hooks ───────────────────────────── */
const wrapper = ({ children }) => (
  <ExportBridgeProvider>{children}</ExportBridgeProvider>
);

describe('ExportContext — getBridge initial', () => {
  it('getBridge() retourne null avant tout setBridge()', () => {
    const { result } = renderHook(
      () => ({ get: useExportBridge(), set: useSetExportBridge() }),
      { wrapper }
    );
    expect(result.current.get()).toBeNull();
  });
});

describe('ExportContext — set puis get', () => {
  it('getBridge() retourne la valeur après setBridge()', () => {
    const { result } = renderHook(
      () => ({ get: useExportBridge(), set: useSetExportBridge() }),
      { wrapper }
    );

    const bridge = { camera: 'cam', gl: 'gl', scene: 'scene' };
    act(() => result.current.set(bridge));

    expect(result.current.get()).toEqual(bridge);
  });

  it('setBridge remplace la valeur existante', () => {
    const { result } = renderHook(
      () => ({ get: useExportBridge(), set: useSetExportBridge() }),
      { wrapper }
    );

    act(() => result.current.set({ camera: 'cam1' }));
    act(() => result.current.set({ camera: 'cam2' }));

    expect(result.current.get().camera).toBe('cam2');
  });

  it('setBridge(null) remet le bridge à null', () => {
    const { result } = renderHook(
      () => ({ get: useExportBridge(), set: useSetExportBridge() }),
      { wrapper }
    );

    act(() => result.current.set({ camera: 'cam' }));
    act(() => result.current.set(null));

    expect(result.current.get()).toBeNull();
  });
});

describe('ExportContext — fonctions stables (useCallback)', () => {
  it('setBridge est une référence stable entre renders', () => {
    const { result, rerender } = renderHook(
      () => useSetExportBridge(),
      { wrapper }
    );
    const ref1 = result.current;
    rerender();
    const ref2 = result.current;
    expect(ref1).toBe(ref2); // même référence → useCallback vide
  });

  it('getBridge est une référence stable entre renders', () => {
    const { result, rerender } = renderHook(
      () => useExportBridge(),
      { wrapper }
    );
    const ref1 = result.current;
    rerender();
    const ref2 = result.current;
    expect(ref1).toBe(ref2);
  });
});

describe('ExportContext — erreurs hors Provider', () => {
  it('useSetExportBridge throw si utilisé hors du Provider', () => {
    // Vitest/RTL: renderHook sans wrapper → pas de Provider
    expect(() => {
      renderHook(() => useSetExportBridge());
    }).toThrow('useSetExportBridge must be used within <ExportBridgeProvider>');
  });

  it('useExportBridge throw si utilisé hors du Provider', () => {
    expect(() => {
      renderHook(() => useExportBridge());
    }).toThrow('useExportBridge must be used within <ExportBridgeProvider>');
  });
});

describe('ExportContext — Provider sans enfants', () => {
  it('Provider se rend sans enfants sans erreur', () => {
    expect(() => {
      render(<ExportBridgeProvider />);
    }).not.toThrow();
  });
});
