/**
 * pergola-engine.test.js
 *
 * Tests du moteur pergola V2 :
 *   - retour structure (champs attendus)
 *   - BOM (poteaux, longerons, traverses, chevrons, quincaillerie)
 *   - geometry (posts, beamsLong, beamsShort, rafters, dimensions)
 *   - cohérence chevrons (count, spacing, overhang)
 *   - bornes (min/max dimensions, hauteur personnalisée)
 *   - poteaux intermédiaires (largeur > MAX_POST_SPAN)
 *
 * Convention d'axes : X=largeur, Z=profondeur, Y=hauteur.
 */
import { describe, it, expect } from 'vitest';
import { generatePergola, computeRafters } from '../modules/pergola/engine.js';
import {
  POST_SECTION, BEAM_H, RAFTER_SPACING, OVERHANG, DEFAULT_HEIGHT, FOOT_CLEARANCE,
  MAX_POST_SPAN, BEAM_OVERHANG, BEAM_W,
} from '../lib/pergolaConstants.js';

/* ── computeRafters ──────────────────────────────────────────── */

describe('computeRafters', () => {
  it('retourne au moins 2 chevrons pour toute largeur > 0', () => {
    expect(computeRafters(1).count).toBeGreaterThanOrEqual(2);
    expect(computeRafters(0.5).count).toBeGreaterThanOrEqual(2);
  });

  it('retourne 2 chevrons pour largeur = 0', () => {
    expect(computeRafters(0).count).toBe(2);
  });

  it('entraxe effectif ≤ spacing cible pour largeur standard', () => {
    const { actualSpacing } = computeRafters(4, 0.60);
    expect(actualSpacing).toBeLessThanOrEqual(0.61); // tolérance arrondi
  });

  it('nombre de chevrons cohérent pour 3 m (entraxe 0.60)', () => {
    const { count } = computeRafters(3, 0.60);
    expect(count).toBe(6); // 3/0.60 = 5 intervals → 6 chevrons
  });

  it('nombre de chevrons cohérent pour 4 m', () => {
    const { count } = computeRafters(4, 0.60);
    expect(count).toBeGreaterThanOrEqual(7);
    expect(count).toBeLessThanOrEqual(8);
  });
});

/* ── generatePergola — retour structure ──────────────────────── */

describe('generatePergola — structure returned', () => {
  // width=4 > MAX_POST_SPAN=3.50 → 6 poteaux (intermédiaires)
  const r = generatePergola(4, 3);

  it('retourne surface = width × depth', () => {
    expect(r.surface).toBe(12);
  });

  it('retourne postCount = 6 (largeur > MAX_POST_SPAN → intermédiaires)', () => {
    expect(r.postCount).toBe(6);
  });

  it('retourne rafterCount > 0', () => {
    expect(r.rafterCount).toBeGreaterThan(0);
  });

  it('retourne beamLongLength = width + 2×BEAM_OVERHANG', () => {
    expect(r.beamLongLength).toBeCloseTo(4 + 2 * BEAM_OVERHANG, 3);
  });

  it('retourne beamShortLength = depth - BEAM_W (traverse nette)', () => {
    expect(r.beamShortLength).toBeCloseTo(3 - BEAM_W, 3);
  });

  it('retourne rafterLength = depth + 2×OVERHANG', () => {
    expect(r.rafterLength).toBeCloseTo(3 + 2 * OVERHANG, 3);
  });

  it('retourne postLength = height + FOOT_CLEARANCE', () => {
    expect(r.postLength).toBeCloseTo(DEFAULT_HEIGHT + FOOT_CLEARANCE, 3);
  });
});

/* ── generatePergola — BOM ───────────────────────────────────── */

describe('generatePergola — BOM', () => {
  const r = generatePergola(4, 3);

  it('posts = postCount', () => {
    expect(r.posts).toBe(r.postCount);
  });

  it('beamsLong = 2', () => {
    expect(r.beamsLong).toBe(2);
  });

  it('beamsShort = nombre de positions X uniques de poteaux', () => {
    // width=4, MAX_POST_SPAN=3.5 → 3 positions X (0, 2, 4) → 3 traverses
    expect(r.beamsShort).toBe(3);
  });

  it('rafters = rafterCount', () => {
    expect(r.rafters).toBe(r.rafterCount);
  });

  it('visChevrons > 0', () => {
    expect(r.visChevrons).toBeGreaterThan(0);
  });

  it('visChevrons = rafterCount × 2 × VIS_PER_RAFTER_BEAM', () => {
    expect(r.visChevrons).toBe(r.rafterCount * 2 * 2);
  });

  it('visPoteaux = postCount × VIS_PER_POST_BEAM', () => {
    expect(r.visPoteaux).toBe(r.postCount * 4);
  });

  it('ancragePoteaux = postCount', () => {
    expect(r.ancragePoteaux).toBe(r.postCount);
  });
});

/* ── generatePergola — geometry.dimensions ───────────────────── */

describe('generatePergola — geometry.dimensions', () => {
  const { geometry } = generatePergola(4, 3);
  const dim = geometry.dimensions;

  it('width = 4', () => {
    expect(dim.width).toBe(4);
  });

  it('depth = 3', () => {
    expect(dim.depth).toBe(3);
  });

  it('height = DEFAULT_HEIGHT par défaut', () => {
    expect(dim.height).toBe(DEFAULT_HEIGHT);
  });

  it('overhang = OVERHANG', () => {
    expect(dim.overhang).toBe(OVERHANG);
  });

  it('beamTopY = height + beamH', () => {
    expect(dim.beamTopY).toBeCloseTo(DEFAULT_HEIGHT + dim.beamH, 5);
  });

  it('rafterTopY = beamTopY + rafterH', () => {
    expect(dim.rafterTopY).toBeGreaterThan(dim.beamTopY);
  });
});

/* ── generatePergola — geometry.posts ────────────────────────── */

describe('generatePergola — geometry.posts', () => {
  // Cas simple : width ≤ MAX_POST_SPAN → 4 poteaux
  const { geometry: geoSmall } = generatePergola(3, 2);

  it('4 poteaux aux angles si width ≤ MAX_POST_SPAN', () => {
    expect(geoSmall.posts).toHaveLength(4);
  });

  it('poteaux à x=0/width, z=0/depth (cas simple)', () => {
    const xs = geoSmall.posts.map(p => p.x).sort((a, b) => a - b);
    const zs = geoSmall.posts.map(p => p.z).sort((a, b) => a - b);
    expect(xs).toEqual([0, 0, 3, 3]);
    expect(zs).toEqual([0, 0, 2, 2]);
  });

  it('chaque poteau a une hauteur = height', () => {
    geoSmall.posts.forEach(p => {
      expect(p.height).toBe(DEFAULT_HEIGHT);
    });
  });

  // Cas avec poteaux intermédiaires : width > MAX_POST_SPAN
  const { geometry: geoLarge } = generatePergola(4, 3);

  it('6 poteaux si width > MAX_POST_SPAN (intermédiaires)', () => {
    expect(geoLarge.posts).toHaveLength(6);
  });

  it('poteaux intermédiaires à x = postSpan', () => {
    const xs = [...new Set(geoLarge.posts.map(p => p.x))].sort((a, b) => a - b);
    expect(xs).toEqual([0, 2, 4]);
  });
});

/* ── generatePergola — geometry.beams ────────────────────────── */

describe('generatePergola — geometry.beams', () => {
  const { geometry } = generatePergola(4, 3);

  it('2 longerons (beamsLong)', () => {
    expect(geometry.beamsLong).toHaveLength(2);
  });

  it('longerons à z=0 et z=depth', () => {
    const zs = geometry.beamsLong.map(b => b.z).sort((a, b) => a - b);
    expect(zs).toEqual([0, 3]);
  });

  it('longerons avec débord BEAM_OVERHANG', () => {
    geometry.beamsLong.forEach(b => {
      expect(b.x1).toBeCloseTo(-BEAM_OVERHANG, 5);
      expect(b.x2).toBeCloseTo(4 + BEAM_OVERHANG, 5);
    });
  });

  it('traverses (beamsShort) = 1 par position X de poteau', () => {
    // width=4 > 3.5 → 3 positions X → 3 traverses
    expect(geometry.beamsShort).toHaveLength(3);
  });

  it('traverses aux positions X des poteaux', () => {
    const xs = geometry.beamsShort.map(b => b.x).sort((a, b) => a - b);
    expect(xs).toEqual([0, 2, 4]);
  });
});

/* ── generatePergola — geometry.rafters ──────────────────────── */

describe('generatePergola — geometry.rafters', () => {
  const { geometry } = generatePergola(4, 3);

  it('rafters count > 0', () => {
    expect(geometry.rafters.length).toBeGreaterThan(0);
  });

  it('premier chevron à x=0', () => {
    expect(geometry.rafters[0].x).toBeCloseTo(0, 5);
  });

  it('dernier chevron à x ≈ width', () => {
    const last = geometry.rafters[geometry.rafters.length - 1];
    expect(last.x).toBeCloseTo(4, 2);
  });

  it('porte-à-faux avant : z1 = -OVERHANG', () => {
    geometry.rafters.forEach(r => {
      expect(r.z1).toBeCloseTo(-OVERHANG, 5);
    });
  });

  it('porte-à-faux arrière : z2 = depth + OVERHANG', () => {
    geometry.rafters.forEach(r => {
      expect(r.z2).toBeCloseTo(3 + OVERHANG, 5);
    });
  });

  it('chevrons posés sur les longerons (y = beamTopY)', () => {
    const { beamTopY } = geometry.dimensions;
    geometry.rafters.forEach(r => {
      expect(r.y).toBeCloseTo(beamTopY, 5);
    });
  });
});

/* ── generatePergola — hauteur personnalisée ─────────────────── */

describe('generatePergola — hauteur personnalisée', () => {
  it('hauteur 2.80 m → posts height = 2.80', () => {
    const { geometry } = generatePergola(3, 2, { height: 2.80 });
    expect(geometry.dimensions.height).toBe(2.80);
    geometry.posts.forEach(p => expect(p.height).toBe(2.80));
  });

  it('postLength change avec la hauteur', () => {
    const r = generatePergola(3, 2, { height: 2.80 });
    expect(r.postLength).toBeCloseTo(2.80 + FOOT_CLEARANCE, 3);
  });
});

/* ── generatePergola — bornes ────────────────────────────────── */

describe('generatePergola — bornes', () => {
  it('ne crashe pas avec des dimensions minimales (1×1)', () => {
    expect(() => generatePergola(1, 1)).not.toThrow();
    const r = generatePergola(1, 1);
    expect(r.postCount).toBe(4);
    expect(r.rafterCount).toBeGreaterThanOrEqual(2);
  });

  it('ne crashe pas avec des dimensions maximales (8×6)', () => {
    expect(() => generatePergola(8, 6)).not.toThrow();
    const r = generatePergola(8, 6);
    expect(r.rafterCount).toBeGreaterThan(5);
  });

  it('surface correcte pour 5.5×3.5', () => {
    const r = generatePergola(5.5, 3.5);
    expect(r.surface).toBe(19.25);
  });
});
