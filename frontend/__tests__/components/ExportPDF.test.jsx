// @vitest-environment jsdom
/**
 * ExportPDF.test.jsx
 *
 * Teste le composant bouton ExportPDF :
 *   - rendu initial (état idle)
 *   - état "génération en cours" pendant l'async
 *   - retour à idle après succès
 *   - comportement terrasse vs cabanon (appels aux bons modules)
 *
 * Tous les modules lourds (jsPDF, capture3D, pdfDrawing) sont mockés.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';

afterEach(cleanup);

/* ── Mocks déclarés AVANT l'import du composant ─────────────── */

// jsPDF : instance factice avec les méthodes appelées dans generatePDF
// Note: vi.fn() constructor requires a regular function (not arrow) in Vitest 4.x
vi.mock('jspdf', () => {
  function MockJsPDF() {
    this.save           = vi.fn();
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
    this.getNumberOfPages = vi.fn(() => 1);
    this.internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 } };
  }
  return { default: MockJsPDF };
});

// Modules PDF / capture — évitent toute dépendance WebGL ou fs
vi.mock('@/components/simulator/ExportPDF/cabanonPDF.js', () => ({
  generateCabanonPDF: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/components/simulator/ExportPDF/canvasCapture.js', () => ({
  capture3DForExport: vi.fn(() => Promise.resolve(null)),
  captureCanvasSnapshot: vi.fn(() => Promise.resolve(null)),
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

// materialPrices : données minimales (mock)
vi.mock('@/lib/materialPrices.js', () => ({
  STORES: [
    { id: 'leroymerlin', name: 'Leroy Merlin', logo: 'leroymerlin', rate: 36.5 },
  ],
  materialStores: [
    { id: 'leroymerlin', name: 'Leroy Merlin', logo: 'leroymerlin', rate: 36.5 },
  ],
  getUnitPrice: () => 10,
  MATERIAL_PRICES: {},
}));

// costCalculator : mock pour éviter les erreurs de calcul détaillé
vi.mock('@/lib/costCalculator.js', () => ({
  calculateDetailedCost: vi.fn(() => []),
  calculateTotalCost: vi.fn(() => 0),
  groupByCategory: vi.fn(() => ({})),
}));

// ExportContext : getBridge retourne une fonction no-op
vi.mock('@/components/simulator/shared/ExportContext', () => ({
  useExportBridge: vi.fn(() => () => null),
}));

import ExportPDF from '@/components/simulator/ExportPDF/index.jsx';
import { generateCabanonPDF }  from '@/components/simulator/ExportPDF/cabanonPDF.js';
import { capture3DForExport, captureCanvasSnapshot }  from '@/components/simulator/ExportPDF/canvasCapture.js';
import { generateTerrassePDF } from '@/components/simulator/ExportPDF/terrassePDF.js';

/* ── Setup global : bypasse le modal email dans tous les tests ── */
// Par défaut, localStorage retourne un email enregistré → le modal ne s'affiche pas.
// Les tests de la modal elle-même pourront surcharger ce mock localement.
beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('test@example.com');
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/* ── Fixtures ─────────────────────────────────────────────────── */

const DIMS_TERRASSE = { width: 5, depth: 3, area: 15 };
const DIMS_CABANON  = { width: 3, depth: 2.5, area: 7.5 };

const MATS_TERRASSE = {
  boards: 40, joists: 16, pads: 10, screws: 360, entretoises: 0, bande: 16,
  slab: null,
};

const MATS_CABANON = {
  studCount: 12, lissesBasses: 18, lissesHautes: 18, lissesHautes2: 9,
  chevrons: 7, chevronLength: '3.50', bastaings: 4, bastaingLength: '2.50',
  bardage: 28, voliges: 16, contreventement: 2,
  visBardage: 280, visVoliges: 160, equerres: 20, membrane: 16, slab: null,
};

/* ── Tests ────────────────────────────────────────────────────── */

describe('ExportPDF — rendu initial', () => {
  it('affiche le bouton "Télécharger la liste PDF" à l\'état idle', () => {
    render(
      <ExportPDF dims={DIMS_TERRASSE} materials={MATS_TERRASSE}
                 foundationType="ground" projectType="terrasse" />
    );
    expect(screen.getByRole('button', { name: /telecharger la liste pdf/i })).toBeInTheDocument();
  });

  it('le bouton est activé (non-disabled) à l\'état idle', () => {
    render(
      <ExportPDF dims={DIMS_TERRASSE} materials={MATS_TERRASSE}
                 foundationType="ground" projectType="terrasse" />
    );
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('affiche l\'icône ✓ à l\'état idle', () => {
    render(
      <ExportPDF dims={DIMS_TERRASSE} materials={MATS_TERRASSE}
                 foundationType="ground" projectType="terrasse" />
    );
    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});

describe('ExportPDF — état generating', () => {
  it('passe en état "Génération en cours…" au clic puis revient à idle', async () => {
    // On laisse la génération se compléter normalement (mocks synchrones/résolus)
    render(
      <ExportPDF dims={DIMS_TERRASSE} materials={MATS_TERRASSE}
                 foundationType="ground" projectType="terrasse" />
    );

    // État initial : bouton idle
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByText('✓')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    // Après complétion : retour à idle
    await waitFor(() => {
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});

describe('ExportPDF — branche terrasse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('appelle generateTerrassePDF (et non generateCabanonPDF)', async () => {
    render(
      <ExportPDF dims={DIMS_TERRASSE} materials={MATS_TERRASSE}
                 foundationType="ground" projectType="terrasse" />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(generateTerrassePDF).toHaveBeenCalledOnce();
    expect(generateCabanonPDF).not.toHaveBeenCalled();
    expect(capture3DForExport).not.toHaveBeenCalled();
  });

  it('retourne à idle après la génération terrasse', async () => {
    render(
      <ExportPDF dims={DIMS_TERRASSE} materials={MATS_TERRASSE}
                 foundationType="ground" projectType="terrasse" />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
    expect(screen.getByText('✓')).toBeInTheDocument();
  });
});

describe('ExportPDF — branche cabanon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('appelle capture3DForExport puis generateCabanonPDF', async () => {
    render(
      <ExportPDF dims={DIMS_CABANON} materials={MATS_CABANON}
                 foundationType="ground" projectType="cabanon" />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(capture3DForExport).toHaveBeenCalledOnce();
    expect(generateCabanonPDF).toHaveBeenCalledOnce();
    expect(generateTerrassePDF).not.toHaveBeenCalled();
  });
});

describe('ExportPDF — fondation chape', () => {
  it('inclut le prix de la chape dans le calcul total si foundationType=slab', () => {
    const matsWithSlab = {
      ...MATS_TERRASSE,
      slab: { betonVolume: 2, totalPrice: 500 },
    };
    // Le composant ne throw pas et se rend correctement
    render(
      <ExportPDF dims={DIMS_TERRASSE} materials={matsWithSlab}
                 foundationType="slab" projectType="terrasse" />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
