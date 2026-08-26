// @vitest-environment jsdom
/**
 * usePDFExport.test.js
 *
 * Couvre le hook de génération PDF prod (utilisé par DeckSimulator).
 *
 * Vérifie :
 *   1. État initial idle, transition vers generating au clic
 *   2. Retour à done puis idle après 2500ms
 *   3. Routage vers le bon generator selon projectType (4 branches)
 *   4. Path avec email → POST /api/leads, pas de doc.save()
 *   5. Path sans email → doc.save() avec filename normalisé
 *   6. Fallback rate/m² si calculateDetailedCost retourne tableau vide
 *
 * Tous les modules lourds (jspdf, capture3D, generators, costCalculator)
 * sont mockés pour isoler la logique d'orchestration du hook.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

/* ── Mocks — vi.mock est hoisted, intercepte aussi les import() dynamiques ── */

const mockSave = vi.fn();

vi.mock('jspdf', () => {
  function MockJsPDF() {
    this.save           = mockSave;
    this.setFontSize    = vi.fn();
    this.setFont        = vi.fn();
    this.text           = vi.fn();
    this.line           = vi.fn();
    this.addPage        = vi.fn();
    this.setTextColor   = vi.fn();
    this.setDrawColor   = vi.fn();
    this.setFillColor   = vi.fn();
    this.rect           = vi.fn();
    this.addImage       = vi.fn();
    this.roundedRect    = vi.fn();
    this.setLineWidth   = vi.fn();
    this.splitTextToSize = vi.fn(() => ['line']);
    this.getNumberOfPages = vi.fn(() => 1);
    this.output         = vi.fn(() => 'data:application/pdf;base64,ZmFrZQ==');
    this.internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 } };
  }
  return { default: MockJsPDF };
});

vi.mock('@/components/simulator/ExportPDF/cabanonPDF.js', () => ({
  generateCabanonPDF: vi.fn(() => Promise.resolve()),
}));
vi.mock('@/components/simulator/ExportPDF/terrassePDF.js', () => ({
  generateTerrassePDF: vi.fn(),
}));
vi.mock('@/components/simulator/ExportPDF/pergolaPDF.js', () => ({
  generatePergolaPDF: vi.fn(),
}));
vi.mock('@/components/simulator/ExportPDF/cloturePDF.js', () => ({
  generateCloturePDF: vi.fn(),
}));

vi.mock('@/components/simulator/ExportPDF/canvasCapture.js', () => ({
  capture3DForExport: vi.fn(() => Promise.resolve(null)),
  captureCanvasSnapshot: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('@/lib/materialPrices.js', () => ({
  STORES: [
    { id: 'leroymerlin', name: 'Leroy Merlin', logo: 'leroymerlin', rate: 36.5 },
    { id: 'castorama',   name: 'Castorama',    logo: 'castorama',   rate: 38.0 },
  ],
}));

const mockDetailedCost = vi.fn(() => [{ unitPrice: 10, qty: 5, total: 50 }]);
const mockTotalCost    = vi.fn(() => 50);
const mockGroupBy      = vi.fn(() => ({ structure: [] }));

vi.mock('@/lib/costCalculator.js', () => ({
  calculateDetailedCost: (...args) => mockDetailedCost(...args),
  calculateTotalCost:    (...args) => mockTotalCost(...args),
  groupByCategory:       (...args) => mockGroupBy(...args),
}));

vi.mock('@/hooks/useAnalytics.js', () => ({
  trackPDFExport: vi.fn(),
  trackPDFExportFailed: vi.fn(),
}));

import { usePDFExport } from '@/hooks/usePDFExport.js';
import { generateCabanonPDF }  from '@/components/simulator/ExportPDF/cabanonPDF.js';
import { generateTerrassePDF } from '@/components/simulator/ExportPDF/terrassePDF.js';
import { generatePergolaPDF }  from '@/components/simulator/ExportPDF/pergolaPDF.js';
import { generateCloturePDF }  from '@/components/simulator/ExportPDF/cloturePDF.js';
import { capture3DForExport, captureCanvasSnapshot } from '@/components/simulator/ExportPDF/canvasCapture.js';
import { trackPDFExport, trackPDFExportFailed } from '@/hooks/useAnalytics.js';

/* ── Fixtures ─────────────────────────────────────────────────── */

const DIMS = { width: 3, depth: 2.5, area: 7.5 };
const MATS = { boards: 40, joists: 16 };
const CONFIG = { label: 'Test', pdfTitle: 'Test PDF' };

function makeHookProps(overrides = {}) {
  return {
    projectType: 'cabanon',
    dims: DIMS,
    materials: MATS,
    config: CONFIG,
    foundationType: 'ground',
    slab: null,
    getBridge: () => () => null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockDetailedCost.mockImplementation(() => [{ unitPrice: 10, qty: 5, total: 50 }]);
  mockTotalCost.mockImplementation(() => 50);
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/* ── Tests ────────────────────────────────────────────────────── */

describe('usePDFExport — état initial', () => {
  it('expose handleExportPDF et pdfStatus="idle"', () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps()));
    expect(result.current.pdfStatus).toBe('idle');
    expect(typeof result.current.handleExportPDF).toBe('function');
  });
});

describe('usePDFExport — transitions de statut', () => {
  it('passe idle → done après succès, puis idle après 2500ms', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'terrasse' })));

      await act(async () => {
        await result.current.handleExportPDF();
      });

      expect(result.current.pdfStatus).toBe('done');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(2600);
      });

      expect(result.current.pdfStatus).toBe('idle');
    } finally {
      vi.useRealTimers();
    }
  });

  it('appelle trackPDFExport avec le projectType', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'pergola' })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    expect(trackPDFExport).toHaveBeenCalledWith({ module: 'pergola' });
  });
});

describe('usePDFExport — routage par projectType', () => {
  it('cabanon → capture3DForExport + generateCabanonPDF', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'cabanon' })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    expect(capture3DForExport).toHaveBeenCalledOnce();
    expect(generateCabanonPDF).toHaveBeenCalledOnce();
    expect(generateTerrassePDF).not.toHaveBeenCalled();
    expect(generatePergolaPDF).not.toHaveBeenCalled();
    expect(generateCloturePDF).not.toHaveBeenCalled();
  });

  it('terrasse → captureCanvasSnapshot + generateTerrassePDF', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'terrasse' })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    expect(captureCanvasSnapshot).toHaveBeenCalledWith(expect.any(Function), DIMS, 'terrasse');
    expect(generateTerrassePDF).toHaveBeenCalledOnce();
    expect(generateCabanonPDF).not.toHaveBeenCalled();
  });

  it('pergola → captureCanvasSnapshot + generatePergolaPDF', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'pergola' })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    expect(captureCanvasSnapshot).toHaveBeenCalledWith(expect.any(Function), DIMS, 'pergola');
    expect(generatePergolaPDF).toHaveBeenCalledOnce();
    expect(generateCabanonPDF).not.toHaveBeenCalled();
  });

  it('cloture → captureCanvasSnapshot + generateCloturePDF', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'cloture' })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    expect(captureCanvasSnapshot).toHaveBeenCalledWith(expect.any(Function), DIMS, 'cloture');
    expect(generateCloturePDF).toHaveBeenCalledOnce();
    expect(generateCabanonPDF).not.toHaveBeenCalled();
  });
});

describe('usePDFExport — sortie : save vs lead capture', () => {
  it('sans email → doc.save() avec filename projectType-WxD.pdf', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'terrasse' })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    expect(mockSave).toHaveBeenCalledWith(`terrasse-${DIMS.width}x${DIMS.depth}m.pdf`);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('avec email → POST /api/leads, pas de doc.save()', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'cabanon' })));
    await act(async () => {
      await result.current.handleExportPDF('user@example.com');
    });
    expect(mockSave).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('/api/leads', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('user@example.com'),
    }));
  });
});

describe('usePDFExport — fallback budget', () => {
  it('utilise rate/m² si calculateDetailedCost retourne tableau vide', async () => {
    mockDetailedCost.mockImplementation(() => []);
    const { result } = renderHook(() => usePDFExport(makeHookProps({ projectType: 'terrasse' })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    // Le fallback passe par STORES[i].rate * area (36.5 × 7.5 ≈ 274)
    // Vérification indirecte : le generator est appelé avec un budgetByStore non vide
    const callArgs = generateTerrassePDF.mock.calls[0][1];
    expect(callArgs.budgetByStore).toBeDefined();
    expect(callArgs.budgetByStore.length).toBeGreaterThan(0);
    expect(callArgs.budgetByStore[0].fallback).toBe(true);
  });

  it('inclut le prix de la chape si foundationType=slab', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps({
      projectType: 'terrasse',
      foundationType: 'slab',
      slab: { betonVolume: 2, totalPrice: 500 },
    })));
    await act(async () => {
      await result.current.handleExportPDF();
    });
    const callArgs = generateTerrassePDF.mock.calls[0][1];
    // bestPrice = matTotal + slabTotal — au moins >= 500
    expect(callArgs.bestPrice).toBeGreaterThanOrEqual(500);
  });
});

/* D-4 (audit tracking du 26/08/2026) — `pdf-export` partait AVANT le `try`, donc
   comptait les tentatives. Or la proposition post-téléchargement ne s'affiche
   que sur un export réussi : s'en servir comme dénominateur de son taux
   d'acceptation surestimait le nombre de propositions affichées. */
describe('usePDFExport — l\'export n\'est compté que s\'il aboutit', () => {
  it('génération réussie → pdf-export une fois, aucun échec', async () => {
    const { result } = renderHook(() => usePDFExport(makeHookProps()));
    await act(async () => { await result.current.handleExportPDF(); });
    expect(trackPDFExport).toHaveBeenCalledWith({ module: 'cabanon' });
    expect(trackPDFExportFailed).not.toHaveBeenCalled();
  });

  it('génération en échec → AUCUN pdf-export, un pdf-export-failed', async () => {
    generateCabanonPDF.mockRejectedValueOnce(new Error('jsPDF a explosé'));
    const erreur = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => usePDFExport(makeHookProps()));
    await act(async () => { await result.current.handleExportPDF(); });

    expect(trackPDFExport).not.toHaveBeenCalled();
    expect(trackPDFExportFailed).toHaveBeenCalledWith({ module: 'cabanon' });
    erreur.mockRestore();
  });

  it('l\'échec ne laisse pas le bouton bloqué sur « generating »', async () => {
    generateCabanonPDF.mockRejectedValueOnce(new Error('boom'));
    const erreur = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => usePDFExport(makeHookProps()));
    await act(async () => { await result.current.handleExportPDF(); });
    expect(result.current.pdfStatus).toBe('idle');
    erreur.mockRestore();
  });
});
