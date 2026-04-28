// @vitest-environment jsdom
/**
 * MaterialsList.test.jsx
 *
 * Teste le rendu du composant MaterialsList pour :
 *   - mode terrasse  : sections matériaux, masquage chape si betonVolume=0
 *   - mode cabanon   : 4 groupes (Ossature, Toiture, Revêtement, Quincaillerie)
 *   - chape béton    : affichée si betonVolume > 0, masquée sinon
 *
 * Pas de Three.js, pas de WebGL — tests purement DOM.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Mock costCalculator pour forcer le mode fallback (affichage simple sans prix)
vi.mock('@/lib/costCalculator.js', () => ({
  calculateDetailedCost: vi.fn(() => { throw new Error('mock — force fallback'); }),
  groupByCategory: vi.fn(() => ({})),
  calculateTotalCost: vi.fn(() => 0),
}));

import MaterialsList from '@/components/simulator/MaterialsList.jsx';

/* ── Fixtures ─────────────────────────────────────────────────── */

const TERRASSE_MATS = {
  boards:      50,
  joists:      20,
  pads:        12,
  screws:      460,
  entretoises: 0,
  bande:       20,
  slab:        null,
};

const TERRASSE_MATS_WITH_SLAB = {
  ...TERRASSE_MATS,
  slab: {
    betonVolume:    2.5,
    treillisPanels: 4,
    calesQty:       16,
    polyaneArea:    20,
    gravierVolume:  1.8,
    coffrageLinear: 18,
    jointsActive:   false,
    thicknessCm:    12,
    totalPrice:     850,
  },
};

const CABANON_MATS = {
  studCount:            14,
  lissesBasses:         21,
  lissesHautes:         21,
  lissesHautes2:        10,
  chevrons:              8,
  chevronLength:        '3.90',
  roofEntretoises:       4,
  roofEntretoiseLength: '2.50',
  bardage:              35,
  contreventement:       2,
  visBardage:           350,
  visEntretoises:       200,
  equerres:              24,
  membrane:              20,
  slab:                  null,
};

/* ── Tests terrasse ───────────────────────────────────────────── */

describe('MaterialsList — terrasse', () => {
  it('affiche le titre Matériaux estimés', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('Matériaux estimés')).toBeInTheDocument();
  });

  it('affiche les lames terrasse et lambourdes', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('Lames terrasse 145×28')).toBeInTheDocument();
    expect(screen.getByText('Lambourdes 45×70')).toBeInTheDocument();
  });

  it('affiche la quantité de lames (50 pcs)', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('50.00')).toBeInTheDocument();
  });

  it('ne rend pas la section Dalle béton si betonVolume est null', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.queryByText('Dalle béton')).not.toBeInTheDocument();
  });

  it('ne rend pas la section Dalle béton si betonVolume = 0', () => {
    const mats = { ...TERRASSE_MATS, slab: { betonVolume: 0 } };
    render(<MaterialsList materials={mats} projectType="terrasse" />);
    expect(screen.queryByText('Dalle béton')).not.toBeInTheDocument();
  });

  it('affiche la section Dalle béton si betonVolume > 0', () => {
    render(<MaterialsList materials={TERRASSE_MATS_WITH_SLAB} projectType="terrasse" />);
    expect(screen.getByText('Dalle béton')).toBeInTheDocument();
  });

  it('affiche le volume béton dans la section chape', () => {
    render(<MaterialsList materials={TERRASSE_MATS_WITH_SLAB} projectType="terrasse" />);
    expect(screen.getByText('Béton C20/25 (marge incluse)')).toBeInTheDocument();
    expect(screen.getByText('2.50')).toBeInTheDocument();
  });

  it("n'affiche pas les entretoises si qty = 0", () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.queryByText('Entretoises 45×70')).not.toBeInTheDocument();
  });

  it('affiche les entretoises si qty > 0', () => {
    const mats = { ...TERRASSE_MATS, entretoises: 6 };
    render(<MaterialsList materials={mats} projectType="terrasse" />);
    expect(screen.getByText('Entretoises 45×70')).toBeInTheDocument();
  });
});

/* ── Tests cabanon ────────────────────────────────────────────── */

describe('MaterialsList — cabanon', () => {
  it('affiche les 4 groupes de sections', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText('Ossature')).toBeInTheDocument();
    expect(screen.getByText('Toiture')).toBeInTheDocument();
    expect(screen.getByText('Revêtement')).toBeInTheDocument();
    expect(screen.getByText('Quincaillerie')).toBeInTheDocument();
  });

  it('affiche le nombre de montants (studCount = 14)', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText('Montants 9,5×9,5 cm')).toBeInTheDocument();
    expect(screen.getByText('14.00')).toBeInTheDocument();
  });

  it("affiche le label chevrons avec la longueur interpolée", () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText('Chevrons (3.90 m)')).toBeInTheDocument();
  });

  it("affiche le label entretoises toiture avec la longueur interpolée", () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText('Entretoises toiture (2.50 m)')).toBeInTheDocument();
  });

  it('ne rend pas de section Dalle béton par défaut (slab=null)', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.queryByText('Dalle béton')).not.toBeInTheDocument();
  });

  it('affiche la section Dalle béton si slab définie pour cabanon', () => {
    const mats = {
      ...CABANON_MATS,
      slab: { betonVolume: 1.8, treillisPanels: 3, calesQty: 12, polyaneArea: 15,
              gravierVolume: 1.2, coffrageLinear: 14, jointsActive: true,
              jointsLinear: 7, thicknessCm: 12, totalPrice: 620 },
    };
    render(<MaterialsList materials={mats} projectType="cabanon" />);
    expect(screen.getByText('Dalle béton')).toBeInTheDocument();
    expect(screen.getByText('Joints de fractionnement')).toBeInTheDocument();
  });
});

/* ── projectType par défaut = 'terrasse' ─────────────────────── */

describe('MaterialsList — projectType par défaut', () => {
  it("utilise le rendu terrasse si projectType n'est pas fourni", () => {
    render(<MaterialsList materials={TERRASSE_MATS} />);
    expect(screen.getByText('Lames terrasse 145×28')).toBeInTheDocument();
    expect(screen.queryByText('Ossature')).not.toBeInTheDocument();
  });
});
