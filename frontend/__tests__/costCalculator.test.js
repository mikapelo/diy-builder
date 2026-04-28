/**
 * costCalculator.test.js — Tests unitaires du calculateur de coûts
 *
 * Couvre :
 *   - safeLine : guards NaN/null
 *   - calculateDetailedCost : mapping par projectType (cloture, cabanon, terrasse, pergola)
 *   - WOOD_WASTE_FACTOR : appliqué aux matériaux bois, pas à la quincaillerie
 *   - calculateTotalCost : somme des subtotals
 *   - groupByCategory : regroupement correct
 *   - edge cases : structure null, quantités à 0
 */
import { describe, it, expect } from 'vitest';
import { calculateDetailedCost, calculateTotalCost, groupByCategory } from '../lib/costCalculator.js';

/* ── Constante de référence ───────────────────────────────────── */
const WOOD_WASTE_FACTOR = 1.10;

/* ══════════════════════════════════════════════════════════════ */
/*  calculateDetailedCost — guards / edge cases                   */
/* ══════════════════════════════════════════════════════════════ */
describe('calculateDetailedCost — guards', () => {
  it('retourne [] si structure est null', () => {
    expect(calculateDetailedCost(null, 'leroymerlin', 'cabanon')).toEqual([]);
  });

  it('retourne [] si structure est undefined', () => {
    expect(calculateDetailedCost(undefined, 'leroymerlin', 'terrasse')).toEqual([]);
  });

  it('retourne [] si structure est vide (pas de quantités)', () => {
    const result = calculateDetailedCost({}, 'leroymerlin', 'cabanon');
    expect(result).toEqual([]);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  calculateDetailedCost — clôture                               */
/* ══════════════════════════════════════════════════════════════ */
describe('calculateDetailedCost — cloture', () => {
  const clotureStructure = {
    posts: 4,
    postLength: 1.90,
    rails: 6,
    railLength: 1.91,
    boards: 39,
    boardLength: 1.30,
    visLames: 156,
    visRails: 24,
    ancrages: 4,
  };

  const lines = calculateDetailedCost(clotureStructure, 'leroymerlin', 'cloture');

  it('génère des lignes pour poteaux, rails, lames, vis, ancrages', () => {
    const ids = lines.map(l => l.materialId);
    expect(ids).toContain('poteau_cloture_90');
    expect(ids).toContain('lisse_cloture_45x90');
    expect(ids).toContain('lame_cloture');
    expect(ids).toContain('vis_inox_a2');
    expect(ids).toContain('ancrage_poteau_cloture');
  });

  it('applique waste factor aux matériaux bois clôture', () => {
    const poteaux = lines.find(l => l.materialId === 'poteau_cloture_90');
    // 4 poteaux × 1.10 waste
    expect(poteaux.quantity).toBeCloseTo(4 * WOOD_WASTE_FACTOR, 2);
  });

  it('applique waste factor aux rails (vendus en ml)', () => {
    const rails = lines.find(l => l.materialId === 'lisse_cloture_45x90');
    // quantity brute = 6 × 1.91 = 11.46, × 1.10 = 12.606
    const rawQty = +(6 * 1.91).toFixed(2);
    expect(rails.quantity).toBeCloseTo(rawQty * WOOD_WASTE_FACTOR, 1);
  });

  it('n\'applique PAS waste aux vis (quincaillerie)', () => {
    const visLames = lines.find(l => l.label.includes('Vis fixation lames'));
    // 156 vis → ceil(156/100) = 2 lots, pas de waste
    expect(visLames.quantity).toBe(2);
  });

  it('n\'applique PAS waste aux ancrages (quincaillerie)', () => {
    const ancrages = lines.find(l => l.materialId === 'ancrage_poteau_cloture');
    expect(ancrages.quantity).toBe(4);
  });

  it('chaque ligne a un subtotal = unitPrice × quantity', () => {
    lines.forEach(line => {
      expect(line.subtotal).toBeCloseTo(line.unitPrice * line.quantity, 2);
    });
  });

  it('chaque ligne a une catégorie', () => {
    lines.forEach(line => {
      expect(line.category).toBeTruthy();
    });
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  calculateDetailedCost — cabanon                               */
/* ══════════════════════════════════════════════════════════════ */
describe('calculateDetailedCost — cabanon', () => {
  const cabanonStructure = {
    studCount: 24,
    lissesBasses: 12.8,
    lissesHautes: 12.8,
    lissesHautes2: 12.8,
    chevrons: 6,
    chevronLength: 3.2,
    roofEntretoises: 10,
    roofEntretoiseLength: 0.5,
    bastaings: 2,
    bastaingLength: 4.0,
    bardage: 22.4,
    contreventement: 8,
    osbSurface: 20.5,
    osbPanels: 7,
    height: 2.3,
    membrane: 13.2,
    visBardage: 620,
    visVoliges: 380,
    equerres: 48,
    sabotsChevrons: 6,
    sabotsBastaings: 2,
  };

  const lines = calculateDetailedCost(cabanonStructure, 'castorama', 'cabanon');

  it('génère des lignes pour les principaux matériaux', () => {
    const ids = lines.map(l => l.materialId);
    expect(ids).toContain('montant_90x90');
    expect(ids).toContain('lisse_90x90');
    expect(ids).toContain('chevron_60x80');
    expect(ids).toContain('bardage_pin');
    expect(ids).toContain('entretoise_toiture');
    expect(ids).toContain('contreventement_osb');
  });

  it('chevrons quantity = count × longueur avec waste', () => {
    const chevrons = lines.find(l => l.materialId === 'chevron_60x80');
    const rawQty = +(6 * 3.2).toFixed(2);
    expect(chevrons.quantity).toBeCloseTo(rawQty * WOOD_WASTE_FACTOR, 1);
  });

  it('contreventement OSB utilise osbSurface depuis l\'engine (DTU 31.2 §9.2.2)', () => {
    const osb = lines.find(l => l.materialId === 'contreventement_osb');
    // osbSurface = 20.5 (surface réelle engine) — pas d'approximation
    expect(osb.quantity).toBe(20.5);
    expect(osb.label).toContain('7 pann.');
  });

  it('équerres sans waste (quincaillerie)', () => {
    const equerres = lines.find(l => l.materialId === 'equerre_fixation');
    expect(equerres.quantity).toBe(48);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  calculateDetailedCost — terrasse                              */
/* ══════════════════════════════════════════════════════════════ */
describe('calculateDetailedCost — terrasse', () => {
  const terrasseStructure = {
    boards: 20,
    joists: 10,
    pads: 12,
    screws: 350,
    bande: 8,
    entretoises: 4,
  };

  const lines = calculateDetailedCost(terrasseStructure, 'bricodepot', 'terrasse');

  it('génère des lignes pour lames, lambourdes, plots', () => {
    const ids = lines.map(l => l.materialId);
    expect(ids).toContain('lame_terrasse');
    expect(ids).toContain('lambourde_60x70');
    expect(ids).toContain('plot_beton');
  });

  it('lames terrasse avec waste factor', () => {
    const lames = lines.find(l => l.label.includes('Lames terrasse'));
    expect(lames.quantity).toBeCloseTo(20 * WOOD_WASTE_FACTOR, 2);
  });

  it('plots sans waste (béton)', () => {
    const plots = lines.find(l => l.materialId === 'plot_beton');
    expect(plots.quantity).toBe(12);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  calculateDetailedCost — fondations (cross-project)            */
/* ══════════════════════════════════════════════════════════════ */
describe('calculateDetailedCost — fondations', () => {
  const structWithSlab = {
    studCount: 4,   // cabanon minimal
    slab: {
      betonVolume: 2.5,
      treillisPanels: 3,
      polyaneArea: 12,
      gravierVolume: 1.5,
    },
  };

  const lines = calculateDetailedCost(structWithSlab, 'leroymerlin', 'cabanon');

  it('ajoute les matériaux fondation quand slab est présent', () => {
    const ids = lines.map(l => l.materialId);
    expect(ids).toContain('beton_c20_25');
    expect(ids).toContain('treillis_st25c');
    expect(ids).toContain('polyane_200');
    expect(ids).toContain('gravier_0_31_5');
  });

  it('pas de waste sur les fondations (pas de bois)', () => {
    const beton = lines.find(l => l.materialId === 'beton_c20_25');
    expect(beton.quantity).toBe(2.5);  // pas × 1.10
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  calculateTotalCost                                            */
/* ══════════════════════════════════════════════════════════════ */
describe('calculateTotalCost', () => {
  it('somme correcte des subtotals', () => {
    const lines = [
      { subtotal: 100.50 },
      { subtotal: 200.00 },
      { subtotal: 50.25 },
    ];
    expect(calculateTotalCost(lines)).toBeCloseTo(350.75, 2);
  });

  it('retourne 0 pour un tableau vide', () => {
    expect(calculateTotalCost([])).toBe(0);
  });

  it('ignore les subtotals manquants (undefined)', () => {
    const lines = [
      { subtotal: 100 },
      {},
      { subtotal: 50 },
    ];
    expect(calculateTotalCost(lines)).toBeCloseTo(150, 2);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  groupByCategory                                               */
/* ══════════════════════════════════════════════════════════════ */
describe('groupByCategory', () => {
  const lines = [
    { materialId: 'a', category: 'Structure', subtotal: 100 },
    { materialId: 'b', category: 'Structure', subtotal: 200 },
    { materialId: 'c', category: 'Quincaillerie', subtotal: 50 },
    { materialId: 'd', subtotal: 30 },  // pas de catégorie
  ];

  it('regroupe par catégorie', () => {
    const grouped = groupByCategory(lines);
    expect(Object.keys(grouped)).toContain('Structure');
    expect(Object.keys(grouped)).toContain('Quincaillerie');
  });

  it('met les sans-catégorie dans "Autres"', () => {
    const grouped = groupByCategory(lines);
    expect(grouped['Autres']).toHaveLength(1);
  });

  it('2 items dans Structure', () => {
    const grouped = groupByCategory(lines);
    expect(grouped['Structure']).toHaveLength(2);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Waste factor — vérification transversale                      */
/* ══════════════════════════════════════════════════════════════ */
describe('WOOD_WASTE_FACTOR — comportement transversal', () => {
  it('les 3 enseignes produisent le même nombre de lignes pour une même structure', () => {
    const struct = { posts: 4, rails: 6, boards: 39, boardLength: 1.3, railLength: 1.91, visLames: 156, visRails: 24, ancrages: 4 };
    const lm = calculateDetailedCost(struct, 'leroymerlin', 'cloture');
    const casto = calculateDetailedCost(struct, 'castorama', 'cloture');
    const brico = calculateDetailedCost(struct, 'bricodepot', 'cloture');
    expect(lm.length).toBe(casto.length);
    expect(lm.length).toBe(brico.length);
  });

  it('les quantités sont identiques quelle que soit l\'enseigne', () => {
    const struct = { posts: 4, rails: 6, boards: 39, boardLength: 1.3, railLength: 1.91, visLames: 156, visRails: 24, ancrages: 4 };
    const lm = calculateDetailedCost(struct, 'leroymerlin', 'cloture');
    const casto = calculateDetailedCost(struct, 'castorama', 'cloture');
    lm.forEach((line, i) => {
      expect(line.quantity).toBeCloseTo(casto[i].quantity, 2);
    });
  });
});
