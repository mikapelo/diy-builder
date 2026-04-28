/**
 * garde-corps-engine.test.js — Tests unitaires du moteur garde-corps
 *
 * Couvre :
 *   - Nombre de poteaux vs entraxe maxi 1.20 m (NF DTU 36.3 P3 §C)
 *   - Espacement balustres ≤ 110 mm (Décret 95-949, sécurité enfants)
 *   - Hauteur mini 1.00 m (CCH R111-15) avec clamp
 *   - Invariants géométriques (>= 2 poteaux, railLength, tableaux vides)
 *   - Génération geometry avec options.sides
 */
import { describe, it, expect } from 'vitest';
import { generateGardeCorps } from '@/modules/garde-corps/engine.js';
import {
  MAX_POST_SPACING,
  MAX_BALUSTER_GAP,
  MIN_HEIGHT_TERRACE,
  RAIL_SECTION_H,
  POST_EMBED,
} from '@/lib/gardeCorpsConstants.js';

/* ══════════════════════════════════════════════════════════════ */
/*  Cas nominal : périmètre 12 m, hauteur 1 m                    */
/* ══════════════════════════════════════════════════════════════ */
describe('generateGardeCorps — cas nominal 12m × 1.00m', () => {
  const s = generateGardeCorps(12, 1.0);

  it('postCount correct pour 12m de périmètre (ceil(12/1.2) + 1 = 11)', () => {
    // intervals = ceil(12 / 1.20) = 10 → 11 poteaux
    expect(s.postCount).toBe(11);
  });

  it('railLength = 2 × perimeter (lisse haute + lisse basse)', () => {
    expect(s.railCount).toBe(2);
    expect(s.railLength).toBeCloseTo(2 * 12, 3);
  });

  it('balustreLength = hauteur - 2 × RAIL_SECTION_H', () => {
    expect(s.balustreLength).toBeCloseTo(1.0 - 2 * RAIL_SECTION_H, 3);
  });

  it('postLength = hauteur + POST_EMBED', () => {
    expect(s.postLength).toBeCloseTo(1.0 + POST_EMBED, 3);
  });

  it('balustreCount respecte DTU 36.3 / Décret 95-949 — espacement ≤ 0.11 m', () => {
    // Pour une travée MAX_POST_SPACING, (perBay + 1) intervalles
    // → espacement réel = MAX_POST_SPACING / (perBay + 1) ≤ MAX_BALUSTER_GAP.
    const bayCount = s.postCount - 1;
    expect(s.balustreCount).toBeGreaterThan(0);
    const perBay = s.balustreCount / bayCount;
    const actualSpacing = MAX_POST_SPACING / (perBay + 1);
    expect(actualSpacing).toBeLessThanOrEqual(MAX_BALUSTER_GAP);
  });

  it('balustreSpacing retourné ≤ MAX_BALUSTER_GAP', () => {
    expect(s.balustreSpacing).toBeLessThanOrEqual(MAX_BALUSTER_GAP);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Hauteur mini : clamp à MIN_HEIGHT_TERRACE                    */
/* ══════════════════════════════════════════════════════════════ */
describe('generateGardeCorps — hauteur mini CCH R111-15', () => {
  it('hauteur mini 1.00 m respectée — clamp si height < MIN_HEIGHT_TERRACE', () => {
    const s = generateGardeCorps(6, 0.8);
    expect(s.height).toBe(MIN_HEIGHT_TERRACE);
    expect(s.height).toBeGreaterThanOrEqual(1.0);
  });

  it('hauteur supérieure à 1 m respectée telle quelle', () => {
    const s = generateGardeCorps(6, 1.20);
    expect(s.height).toBeCloseTo(1.20, 3);
  });

  it('hauteur absente → défaut MIN_HEIGHT_TERRACE', () => {
    const s = generateGardeCorps(6);
    expect(s.height).toBe(MIN_HEIGHT_TERRACE);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Invariants structurels                                        */
/* ══════════════════════════════════════════════════════════════ */
describe('generateGardeCorps — invariants', () => {
  it('postCount >= 2 pour tout périmètre > 0', () => {
    for (const p of [0.5, 1.0, 2.4, 5.5, 15, 100]) {
      const s = generateGardeCorps(p, 1.0);
      expect(s.postCount).toBeGreaterThanOrEqual(2);
    }
  });

  it('railLength = 2 × perimeter pour n’importe quel périmètre', () => {
    for (const p of [3, 6, 12, 18, 25]) {
      const s = generateGardeCorps(p, 1.0);
      expect(s.railLength).toBeCloseTo(2 * p, 3);
    }
  });

  it('balustreCount = balustrePerBay × (postCount - 1) — multiple du nb de travées', () => {
    const s = generateGardeCorps(10, 1.0);
    const bayCount = s.postCount - 1;
    expect(s.balustreCount % bayCount).toBe(0);
  });

  it('périmètre = 0 → postCount = 0, balustreCount = 0, railLength = 0', () => {
    const s = generateGardeCorps(0, 1.0);
    expect(s.postCount).toBe(0);
    expect(s.balustreCount).toBe(0);
    expect(s.railLength).toBe(0);
  });

  it('périmètre négatif → traité comme 0', () => {
    const s = generateGardeCorps(-5, 1.0);
    expect(s.postCount).toBe(0);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Géométrie 3D : options.sides                                  */
/* ══════════════════════════════════════════════════════════════ */
describe('generateGardeCorps — geometry 3D', () => {
  it('génère geometry vide si options.sides absent', () => {
    const s = generateGardeCorps(14, 1.0);
    expect(s.geometry.posts).toEqual([]);
    expect(s.geometry.rails).toEqual([]);
    expect(s.geometry.balustres).toEqual([]);
  });

  it('génère geometry avec positions si options.sides = [4, 6, 4]', () => {
    const s = generateGardeCorps(14, 1.0, { sides: [4, 6, 4] });

    // 3 côtés :
    //   côté 4 m → ceil(4/1.2)=4 intervals → 5 poteaux
    //   côté 6 m → ceil(6/1.2)=5 intervals → 6 poteaux
    //   côté 4 m → 5 poteaux
    //   total geometry.posts = 5 + 6 + 5 = 16
    expect(s.geometry.posts).toHaveLength(16);

    // 2 lisses par côté × 3 côtés = 6 segments de lisses
    expect(s.geometry.rails).toHaveLength(6);

    // Tous les poteaux ont la même hauteur = postLength
    expect(s.geometry.posts.every(p => p.height === s.postLength)).toBe(true);

    // Toutes les balustres ont une hauteur positive = balustreLength
    expect(s.geometry.balustres.length).toBeGreaterThan(0);
    expect(s.geometry.balustres.every(b => b.height === s.balustreLength)).toBe(true);
    expect(s.geometry.balustres.every(b => b.height > 0)).toBe(true);
  });

  it('toutes les positions x des poteaux sont strictement croissantes', () => {
    const s = generateGardeCorps(14, 1.0, { sides: [4, 6, 4] });
    const xs = s.geometry.posts.map(p => p.x);
    for (let i = 1; i < xs.length; i++) {
      expect(xs[i]).toBeGreaterThanOrEqual(xs[i - 1]);
    }
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Options : balustreSpacing                                     */
/* ══════════════════════════════════════════════════════════════ */
describe('generateGardeCorps — options.balustreSpacing', () => {
  it('balustreSpacing plus serré demandé → respecté', () => {
    const s = generateGardeCorps(6, 1.0, { balustreSpacing: 0.08 });
    expect(s.balustreSpacing).toBeLessThanOrEqual(0.08);
  });

  it('balustreSpacing plus large que DTU → clampé à la limite DTU', () => {
    const s = generateGardeCorps(6, 1.0, { balustreSpacing: 0.20 });
    expect(s.balustreSpacing).toBeLessThanOrEqual(MAX_BALUSTER_GAP);
  });
});
