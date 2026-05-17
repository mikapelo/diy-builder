// @vitest-environment jsdom
/**
 * MaterialsList.test.jsx
 *
 * Teste le rendu du composant MaterialsList pour :
 *   - mode terrasse  : groupes par catégorie, affichage quantités
 *   - mode cabanon   : 4 groupes (Ossature, Toiture, Revêtement, Quincaillerie)
 *   - chape béton    : affichée si betonVolume > 0, masquée sinon
 *
 * Pas de Three.js, pas de WebGL — tests purement DOM.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);

/**
 * On laisse calculateDetailedCost réel tourner (pas de mock "throw").
 * On mocke uniquement les imports de branding qui ne fonctionnent pas en jsdom.
 */
vi.mock('@/components/ui/BrandIcon', () => ({
  default: ({ name }) => <span data-testid="brand-icon">{name}</span>,
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
  chevronLength:        3.90,
  roofEntretoises:       4,
  roofEntretoiseLength: 2.50,
  bardage:              35,
  osbSurface:            8,
  osbPanels:             4,
  contreventement:       2,
  visBardage:           350,
  visEntretoises:       200,
  equerres:              24,
  sabotsChevrons:        8,
  membrane:              20,
  slab:                  null,
};

/* ── Tests terrasse ───────────────────────────────────────────── */

describe('MaterialsList — terrasse', () => {
  it('affiche le titre Matériaux estimés', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('Matériaux estimés')).toBeInTheDocument();
  });

  it('affiche les lames terrasse (via groupByCategory)', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('Lames terrasse 145×28')).toBeInTheDocument();
  });

  it('affiche les lambourdes (via groupByCategory)', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('Lambourdes 60×70')).toBeInTheDocument();
  });

  it('affiche la quantité de lames avec waste factor (50 × 1.10 = 55.00)', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('55.00')).toBeInTheDocument();
  });

  it('ne rend pas la section Fondations si betonVolume est null', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.queryByText('Fondations')).not.toBeInTheDocument();
  });

  it('ne rend pas la section Fondations si betonVolume = 0', () => {
    const mats = { ...TERRASSE_MATS, slab: { betonVolume: 0 } };
    render(<MaterialsList materials={mats} projectType="terrasse" />);
    expect(screen.queryByText('Fondations')).not.toBeInTheDocument();
  });

  it('affiche la section Fondations si betonVolume > 0', () => {
    render(<MaterialsList materials={TERRASSE_MATS_WITH_SLAB} projectType="terrasse" />);
    expect(screen.getByText('Fondations')).toBeInTheDocument();
  });

  it('affiche le béton dans la section Fondations', () => {
    render(<MaterialsList materials={TERRASSE_MATS_WITH_SLAB} projectType="terrasse" />);
    expect(screen.getByText('Béton C20/25 (livré)')).toBeInTheDocument();
  });

  it("n'affiche pas les entretoises si qty = 0", () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.queryByText('Entretoises 60×70')).not.toBeInTheDocument();
  });

  it('affiche les entretoises si qty > 0', () => {
    const mats = { ...TERRASSE_MATS, entretoises: 6 };
    render(<MaterialsList materials={mats} projectType="terrasse" />);
    expect(screen.getByText('Entretoises 60×70')).toBeInTheDocument();
  });

  it('affiche le sélecteur enseigne', () => {
    render(<MaterialsList materials={TERRASSE_MATS} projectType="terrasse" />);
    expect(screen.getByText('Leroy Merlin')).toBeInTheDocument();
  });
});

/* ── Tests cabanon ────────────────────────────────────────────── */

describe('MaterialsList — cabanon', () => {
  it('affiche les groupes Ossature, Toiture, Revêtement, Quincaillerie', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText('Ossature')).toBeInTheDocument();
    expect(screen.getByText('Toiture')).toBeInTheDocument();
    expect(screen.getByText('Revêtement')).toBeInTheDocument();
    expect(screen.getByText('Quincaillerie')).toBeInTheDocument();
  });

  it('affiche les montants avec le studCount', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText('Montant 9×9 cm')).toBeInTheDocument();
  });

  it('affiche les chevrons', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText(/Chevrons 60×80/)).toBeInTheDocument();
  });

  it('affiche la membrane sous-toiture', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.getByText('Membrane sous-toiture')).toBeInTheDocument();
  });

  it('ne rend pas de section Fondations par défaut (slab=null)', () => {
    render(<MaterialsList materials={CABANON_MATS} projectType="cabanon" />);
    expect(screen.queryByText('Fondations')).not.toBeInTheDocument();
  });

  it('affiche la section Fondations si slab définie pour cabanon', () => {
    const mats = {
      ...CABANON_MATS,
      slab: { betonVolume: 1.8, treillisPanels: 3, calesQty: 12, polyaneArea: 15,
              gravierVolume: 1.2, coffrageLinear: 14, jointsActive: true,
              jointsLinear: 7, thicknessCm: 12, totalPrice: 620 },
    };
    render(<MaterialsList materials={mats} projectType="cabanon" />);
    expect(screen.getByText('Fondations')).toBeInTheDocument();
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
