/**
 * garde-corps-wiring.test.js — Tests du câblage option garde-corps → BOM terrasse
 *
 * Couvre :
 *   - enabled=false (ou absent) → zéro ligne garde-corps ajoutée au BOM terrasse
 *   - enabled=true 1 côté        → 3 lignes (poteaux, lisses, balustres) cohérentes
 *   - enabled=true 4 côtés        → quantités ≈ 4× celles d'un seul côté
 *   - prix unitaires résolus depuis materialPrices.js pour les 3 nouveaux IDs
 *
 * Le moteur generateGardeCorps est testé séparément (garde-corps-engine.test.js).
 * Ici on valide UNIQUEMENT la traversée DeckSimulator → costCalculator.
 */
import { describe, it, expect } from 'vitest';
import { calculateDetailedCost } from '../lib/costCalculator.js';
import { generateGardeCorps } from '../modules/garde-corps/engine.js';
import { findMaterial } from '../lib/materialPrices.js';

/* Réplique de la logique DeckSimulator.gardeCorpsBOM — gardée locale pour
 * que le test reste indépendant de l'orchestrateur React. */
function buildGardeCorpsBOM(width, depth, sides, height = 1.0) {
  const sideLengths = sides.map(s => (s === 'avant' || s === 'arrière') ? width : depth);
  const perimeter = sideLengths.reduce((a, b) => a + b, 0);
  if (perimeter <= 0) return null;
  const gc = generateGardeCorps(perimeter, height);
  return {
    enabled: true,
    postCount: gc.postCount,
    postLength: gc.postLength,
    railCount: gc.railCount,
    railLength: gc.railLength,
    balustreCount: gc.balustreCount,
    balustreLength: gc.balustreLength,
    perimeter: gc.perimeter,
    height: gc.height,
    sides,
  };
}

/** Base terrasse 4 m × 3 m — quantités UI typiques. */
const TERRASSE_4x3 = {
  boards: 10,
  joists: 7,
  pads: 16,
  screws: 140,
  bande: 25,
  entretoises: 0,
  slab: null,
};

const GC_IDS = ['poteau_gc_70', 'lisse_gc_60x40', 'balustre_gc_40'];

/* ══════════════════════════════════════════════════════════════ */
/*  Invariant 1 : enabled=false → aucun ajout                     */
/* ══════════════════════════════════════════════════════════════ */
describe('câblage garde-corps — désactivé', () => {
  it('aucune ligne garde-corps quand gardeCorps absent', () => {
    const lines = calculateDetailedCost({ ...TERRASSE_4x3 }, 'leroymerlin', 'terrasse');
    const ids = lines.map(l => l.materialId);
    for (const gid of GC_IDS) expect(ids).not.toContain(gid);
  });

  it('aucune ligne garde-corps quand gardeCorps.enabled = false', () => {
    const lines = calculateDetailedCost(
      { ...TERRASSE_4x3, gardeCorps: { enabled: false } },
      'leroymerlin', 'terrasse',
    );
    const ids = lines.map(l => l.materialId);
    for (const gid of GC_IDS) expect(ids).not.toContain(gid);
  });

  it('BOM terrasse standard reste identique (boards/joists/pads/screws/bande)', () => {
    const lines = calculateDetailedCost({ ...TERRASSE_4x3 }, 'leroymerlin', 'terrasse');
    const ids = lines.map(l => l.materialId);
    expect(ids).toContain('lame_terrasse');
    expect(ids).toContain('lambourde_60x70');
    expect(ids).toContain('plot_beton');
    expect(ids).toContain('vis_inox_a2');
    expect(ids).toContain('bande_bitume');
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Invariant 2 : enabled=true 1 côté → 3 lignes cohérentes       */
/* ══════════════════════════════════════════════════════════════ */
describe('câblage garde-corps — activé, 1 côté avant (4 m)', () => {
  const gc = buildGardeCorpsBOM(4, 3, ['avant']);
  const lines = calculateDetailedCost(
    { ...TERRASSE_4x3, gardeCorps: gc },
    'leroymerlin', 'terrasse',
  );
  const gcLines = lines.filter(l => GC_IDS.includes(l.materialId));

  it('ajoute exactement 3 lignes garde-corps (poteaux + lisses + balustres)', () => {
    expect(gcLines).toHaveLength(3);
    const ids = gcLines.map(l => l.materialId).sort();
    expect(ids).toEqual([...GC_IDS].sort());
  });

  it('toutes les lignes garde-corps sont catégorisées "Garde-corps"', () => {
    for (const line of gcLines) expect(line.category).toBe('Garde-corps');
  });

  it('quantités > 0 et prix unitaires résolus', () => {
    for (const line of gcLines) {
      expect(line.quantity).toBeGreaterThan(0);
      expect(line.unitPrice).toBeGreaterThan(0);
      expect(line.subtotal).toBeGreaterThan(0);
    }
  });

  it('périmètre garde-corps = width seule (côté avant)', () => {
    expect(gc.perimeter).toBeCloseTo(4, 3);
  });

  it('quantité poteaux = postCount × postLength (waste factor inclus)', () => {
    // postCount=5 (ceil(4/1.2)+1), postLength=1.10 → brut=5.5 ml, waste×1.10 → 6.05
    const poteauLine = gcLines.find(l => l.materialId === 'poteau_gc_70');
    const expectedRaw = gc.postCount * gc.postLength;
    expect(poteauLine.quantity).toBeCloseTo(+(expectedRaw * 1.10).toFixed(2), 2);
  });

  it('quantité lisses = railLength brut × waste factor 1.10', () => {
    const lisseLine = gcLines.find(l => l.materialId === 'lisse_gc_60x40');
    expect(lisseLine.quantity).toBeCloseTo(+(gc.railLength * 1.10).toFixed(2), 2);
  });

  it('BOM terrasse standard préservé en plus du garde-corps', () => {
    const ids = lines.map(l => l.materialId);
    expect(ids).toContain('lame_terrasse');
    expect(ids).toContain('lambourde_60x70');
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Invariant 3 : 4 côtés ≈ 4× quantités 1 côté                   */
/* ══════════════════════════════════════════════════════════════ */
describe('câblage garde-corps — activé, 4 côtés vs 1 côté', () => {
  const SIDE_LEN = 4; // terrasse carrée 4×4 → tous les côtés font 4 m
  const TERRASSE_4x4 = { ...TERRASSE_4x3 };

  const gc1 = buildGardeCorpsBOM(SIDE_LEN, SIDE_LEN, ['avant']);
  const gc4 = buildGardeCorpsBOM(SIDE_LEN, SIDE_LEN, ['avant', 'arrière', 'gauche', 'droite']);

  const lines1 = calculateDetailedCost({ ...TERRASSE_4x4, gardeCorps: gc1 }, 'leroymerlin', 'terrasse');
  const lines4 = calculateDetailedCost({ ...TERRASSE_4x4, gardeCorps: gc4 }, 'leroymerlin', 'terrasse');

  it('périmètre 4 côtés = 4 × périmètre 1 côté', () => {
    expect(gc4.perimeter).toBeCloseTo(4 * gc1.perimeter, 3);
  });

  it('quantité lisses 4 côtés = 4 × quantité 1 côté', () => {
    const l1 = lines1.find(l => l.materialId === 'lisse_gc_60x40').quantity;
    const l4 = lines4.find(l => l.materialId === 'lisse_gc_60x40').quantity;
    expect(l4).toBeCloseTo(4 * l1, 1);
  });

  it('quantité balustres 4 côtés ≈ 4 × quantité 1 côté (±10 %)', () => {
    // Les travées étant identiques (côté = 4 m répété), le ratio est exact.
    const b1 = lines1.find(l => l.materialId === 'balustre_gc_40').quantity;
    const b4 = lines4.find(l => l.materialId === 'balustre_gc_40').quantity;
    const ratio = b4 / b1;
    expect(ratio).toBeGreaterThan(3.5);
    expect(ratio).toBeLessThan(4.5);
  });

  it('quantité poteaux 4 côtés > 1 côté (un poteau supplémentaire par bout réutilisé en pratique)', () => {
    const p1 = lines1.find(l => l.materialId === 'poteau_gc_70').quantity;
    const p4 = lines4.find(l => l.materialId === 'poteau_gc_70').quantity;
    expect(p4).toBeGreaterThan(p1);
  });

  it('subtotal total garde-corps 4 côtés > 1 côté', () => {
    const sum = (lines) => lines
      .filter(l => GC_IDS.includes(l.materialId))
      .reduce((s, l) => s + l.subtotal, 0);
    expect(sum(lines4)).toBeGreaterThan(sum(lines1));
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Invariant 3b : sides=[] → perimeter=0 → BOM null             */
/* ══════════════════════════════════════════════════════════════ */
describe('câblage garde-corps — sides=[] (aucun côté sélectionné)', () => {
  it('buildGardeCorpsBOM retourne null quand sides=[]', () => {
    const result = buildGardeCorpsBOM(4, 3, []);
    expect(result).toBeNull();
  });

  it('calculateDetailedCost sans ligne garde-corps quand gardeCorps=null (sides=[])', () => {
    // Simule ce que DeckSimulator fait quand buildGardeCorpsBOM retourne null :
    // gardeCorps = null (ou undefined). Le useMemo de DeckSimulator passe null,
    // et enabled=true n'est jamais positionné.
    const lines = calculateDetailedCost(
      { ...TERRASSE_4x3, gardeCorps: null },
      'leroymerlin', 'terrasse',
    );
    const ids = lines.map(l => l.materialId);
    for (const gid of GC_IDS) expect(ids).not.toContain(gid);
  });

  it('calculateDetailedCost sans ligne garde-corps quand enabled=true mais perimeter=0 (guard engine)', () => {
    // Cas pathologique : objet gardeCorps avec enabled=true mais quantités nulles
    // (si le BOM était construit manuellement avec perimeter=0)
    const lines = calculateDetailedCost(
      { ...TERRASSE_4x3, gardeCorps: { enabled: true, postCount: 0, postLength: 0, railLength: 0, balustreCount: 0, balustreLength: 0, perimeter: 0 } },
      'leroymerlin', 'terrasse',
    );
    const ids = lines.map(l => l.materialId);
    for (const gid of GC_IDS) expect(ids).not.toContain(gid);
    const gcLines = lines.filter(l => l.category === 'Garde-corps');
    expect(gcLines).toHaveLength(0);
  });

  it('cas miroir : enabled=true, sides=[avant] → perimeter > 0, lignes présentes', () => {
    const gc = buildGardeCorpsBOM(4, 3, ['avant']);
    expect(gc).not.toBeNull();
    expect(gc.perimeter).toBeGreaterThan(0);
    const lines = calculateDetailedCost(
      { ...TERRASSE_4x3, gardeCorps: gc },
      'leroymerlin', 'terrasse',
    );
    const gcLines = lines.filter(l => GC_IDS.includes(l.materialId));
    expect(gcLines.length).toBeGreaterThan(0);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Invariant 4 : prix unitaires disponibles pour les 4 enseignes */
/* ══════════════════════════════════════════════════════════════ */
describe('câblage garde-corps — prix matériaux', () => {
  for (const id of GC_IDS) {
    it(`${id} existe dans materialPrices.js avec prix pour toutes les enseignes`, () => {
      const mat = findMaterial(id);
      expect(mat).toBeTruthy();
      for (const store of ['leroymerlin', 'castorama', 'bricodepot']) {
        expect(mat.prices[store]).toBeGreaterThan(0);
      }
    });
  }
});
