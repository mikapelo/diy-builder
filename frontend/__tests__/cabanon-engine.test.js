/**
 * cabanon-engine.test.js — Tests unitaires du moteur cabanon
 *
 * Couvre :
 *   - wallStudH / wallDef.studHeight : hauteurs sous sablière mono-pente
 *   - generateCabanon : surface, studCount, geometry, invariants
 *   - geometry.roof : angle et len précalculés
 *   - geometry.bracing : positions 3D précalculées
 *   - geometry.lisses : len3d, ang3d, mx3d
 *   - edge cases : dimensions minimales et maximales
 */
import { describe, it, expect } from 'vitest';
import { generateCabanon, wallDef } from '../modules/cabanon/engine.js';
import { SLOPE_RATIO } from '../lib/cabanonConstants.js';

/* ── Helpers ──────────────────────────────────────────────────── */
const r3 = (v) => +v.toFixed(3);

/* ── wallDef.studHeight ───────────────────────────────────────── */
describe('wallDef.studHeight', () => {
  const W = 4, D = 3, H = 2.3, S = r3(W * SLOPE_RATIO);

  it('wall 3 (gauche, x=0) → toujours H', () => {
    const def = wallDef(3, W, D, H, S);
    expect(def.studHeight(0)).toBeCloseTo(H, 3);
    expect(def.studHeight(D / 2)).toBeCloseTo(H, 3);
    expect(def.studHeight(D)).toBeCloseTo(H, 3);
  });

  it('wall 1 (droite, x=width) → toujours H+slope', () => {
    const def = wallDef(1, W, D, H, S);
    expect(def.studHeight(0)).toBeCloseTo(r3(H + S), 3);
    expect(def.studHeight(D)).toBeCloseTo(r3(H + S), 3);
  });

  it('wall 0 (façade) → interpolation linéaire u/width', () => {
    const def = wallDef(0, W, D, H, S);
    expect(def.studHeight(0)).toBeCloseTo(H, 3);          // bord gauche
    expect(def.studHeight(W)).toBeCloseTo(r3(H + S), 3);  // bord droit
    expect(def.studHeight(W / 2)).toBeCloseTo(r3(H + S / 2), 3); // milieu
  });

  it('wall 2 (arrière) → interpolation inversée', () => {
    const def = wallDef(2, W, D, H, S);
    expect(def.studHeight(0)).toBeCloseTo(r3(H + S), 3);  // u=0 → gx=width
    expect(def.studHeight(W)).toBeCloseTo(H, 3);           // u=width → gx=0
  });
});

/* ── generateCabanon — quantitatifs ──────────────────────────── */
describe('generateCabanon — matériaux', () => {
  it('retourne les champs BOM attendus pour 3×4', () => {
    const r = generateCabanon(3, 4);
    expect(r.surface).toBe(12);
    expect(r.perimeter).toBe(14);
    expect(typeof r.studCount).toBe('number');
    expect(r.studCount).toBeGreaterThan(0);
    expect(typeof r.bardage).toBe('number');
    expect(typeof r.roofArea).toBe('number');
  });

  it('surface = width × depth', () => {
    const r = generateCabanon(5.5, 3.5);
    expect(r.surface).toBeCloseTo(5.5 * 3.5, 2);
  });
});

/* ── generateCabanon — geometry.dimensions ──────────────────── */
describe('generateCabanon — geometry.dimensions', () => {
  it('slope = width × SLOPE_RATIO', () => {
    const { geometry } = generateCabanon(4, 3);
    expect(geometry.dimensions.slope).toBeCloseTo(4 * SLOPE_RATIO, 3);
  });

  it('plateHeight = height + 2 × SECTION (DTU 31.2 §9.1.1.2 — 95mm)', () => {
    const { geometry } = generateCabanon(4, 3, { height: 2.3 });
    expect(geometry.dimensions.plateHeight).toBeCloseTo(2.3 + 2 * 0.095, 3);
  });

  it('wall 1 height = height + slope', () => {
    const { geometry } = generateCabanon(4, 3, { height: 2.3 });
    const slope = 4 * SLOPE_RATIO;
    expect(geometry.walls[1].height).toBeCloseTo(2.3 + slope, 3);
  });

  it('wall 0, 2, 3 height = height', () => {
    const { geometry } = generateCabanon(4, 3, { height: 2.3 });
    expect(geometry.walls[0].height).toBeCloseTo(2.3, 3);
    expect(geometry.walls[2].height).toBeCloseTo(2.3, 3);
    expect(geometry.walls[3].height).toBeCloseTo(2.3, 3);
  });
});

/* ── generateCabanon — geometry.roof précalculé ─────────────── */
describe('generateCabanon — geometry.roof', () => {
  it('roof.angle = atan2(slope, width)', () => {
    const { geometry } = generateCabanon(4, 3);
    const slope = 4 * SLOPE_RATIO;
    expect(geometry.roof.angle).toBeCloseTo(Math.atan2(slope, 4), 5);
  });

  it('roof.len = sqrt(width² + slope²)', () => {
    const { geometry } = generateCabanon(4, 3);
    const slope = 4 * SLOPE_RATIO;
    expect(geometry.roof.len).toBeCloseTo(Math.sqrt(16 + slope ** 2), 5);
  });

  it('roof a 4 vertices', () => {
    const { geometry } = generateCabanon(4, 3);
    expect(geometry.roof.vertices).toHaveLength(4);
  });
});

/* ── generateCabanon — geometry.structuralStuds ─────────────── */
describe('generateCabanon — geometry.structuralStuds', () => {
  it('length > 0', () => {
    const { geometry } = generateCabanon(3, 4);
    expect(geometry.structuralStuds.length).toBeGreaterThan(0);
  });

  it('chaque stud a x, y, height, zBase', () => {
    const { geometry } = generateCabanon(3, 4);
    geometry.structuralStuds.forEach(s => {
      expect(typeof s.x).toBe('number');
      expect(typeof s.y).toBe('number');
      expect(s.height).toBeGreaterThan(0);
      expect(typeof s.zBase).toBe('number');
    });
  });

  it('aucun stud avec height <= 0', () => {
    const { geometry } = generateCabanon(3, 4);
    const bad = geometry.structuralStuds.filter(s => s.height <= 0);
    expect(bad).toHaveLength(0);
  });
});

/* ── generateCabanon — geometry.framings ────────────────────── */
describe('generateCabanon — geometry.framings', () => {
  it('au moins 2 framings (linteau porte + linteau fenêtre)', () => {
    const { geometry } = generateCabanon(3, 4);
    expect(geometry.framings.length).toBeGreaterThanOrEqual(2);
  });

  it('chaque framing a wall, u, v, w, hh', () => {
    const { geometry } = generateCabanon(3, 4);
    geometry.framings.forEach(f => {
      expect(f.wall).toBeGreaterThanOrEqual(0);
      expect(f.wall).toBeLessThanOrEqual(3);
      expect(typeof f.u).toBe('number');
      expect(typeof f.v).toBe('number');
      expect(f.w).toBeGreaterThan(0);
      expect(f.hh).toBeGreaterThan(0);
    });
  });
});

/* ── generateCabanon — geometry.bracing (positions 3D) ──────── */
describe('generateCabanon — geometry.bracing', () => {
  it('8 membres maximum (2 par mur × 4 murs) quand aucune ouverture ne chevauche', () => {
    // Murs latéraux (1,2,3) n'ont pas d'ouvertures → 6 braces là.
    // Mur 0 (façade) : les 2 braces par défaut chevauchent la porte et la fenêtre → 0 sur le mur 0.
    // Total pour 3×4 avec ouvertures par défaut : 6
    const { geometry } = generateCabanon(3, 4);
    expect(geometry.bracing.length).toBeGreaterThanOrEqual(4);
    expect(geometry.bracing.length).toBeLessThanOrEqual(8);
  });

  it('aucun contreventement sur le mur 0 ne chevauche la porte ou la fenêtre', () => {
    const { geometry } = generateCabanon(3, 4);
    const wall0Braces = geometry.bracing.filter(b => b.wall === 0);
    // La porte occupe [0.45, 1.35] et la fenêtre [1.86, 2.46] sur un mur de 3m
    // Les deux panneaux de contreventement chevauchent ces zones → aucun brace wall 0
    wall0Braces.forEach(b => {
      const uMin = Math.min(b.u0, b.u1);
      const uMax = Math.max(b.u0, b.u1);
      // Vérifier que ce brace ne chevauche ni la porte ni la fenêtre
      const overlapsDoor   = uMax > 0.45 && uMin < 1.35;
      const overlapsWindow = uMax > 1.86 && uMin < 2.46;
      expect(overlapsDoor || overlapsWindow).toBe(false);
    });
  });

  it('sans ouvertures : 8 membres (2 par mur × 4 murs)', () => {
    const { geometry } = generateCabanon(3, 4, { openings: [] });
    expect(geometry.bracing).toHaveLength(8);
  });

  it('chaque brace a les champs 3D précalculés', () => {
    const { geometry } = generateCabanon(3, 4);
    geometry.bracing.forEach(b => {
      expect(typeof b.cx).toBe('number');
      expect(typeof b.cy).toBe('number');
      expect(typeof b.cz).toBe('number');
      expect(b.len3d).toBeGreaterThan(0);
      expect(typeof b.rx).toBe('number');
      expect(typeof b.ry).toBe('number');
      expect(typeof b.rz).toBe('number');
    });
  });
});

/* ── generateCabanon — geometry.lisses (précalculées) ───────── */
describe('generateCabanon — geometry.lisses', () => {
  it('4 lisses basses, 4 hautes, 4 hautes2', () => {
    const { geometry } = generateCabanon(3, 4);
    expect(geometry.lisses.basses).toHaveLength(4);
    expect(geometry.lisses.hautes).toHaveLength(4);
    expect(geometry.lisses.hautes2).toHaveLength(4);
  });

  it('chaque lisse a len3d, ang3d, mx3d, mz3d', () => {
    const { geometry } = generateCabanon(3, 4);
    [...geometry.lisses.basses, ...geometry.lisses.hautes].forEach(l => {
      expect(l.len3d).toBeGreaterThan(0);
      expect(typeof l.ang3d).toBe('number');
      expect(typeof l.mx3d).toBe('number');
      expect(typeof l.mz3d).toBe('number');
    });
  });
});

/* ── generateCabanon — voile OSB (DTU 31.2 §9.2.2) ─────────────── */
describe('generateCabanon — voile contreventement OSB', () => {
  it('osbSurface > 0 pour 3×4', () => {
    const { osbSurface } = generateCabanon(3, 4);
    expect(osbSurface).toBeGreaterThan(0);
  });

  it('osbSurface = wallArea − openingArea', () => {
    const r = generateCabanon(3, 4);
    const openingArea = r.geometry.openings.reduce((s, o) => s + o.width * o.height, 0);
    expect(r.osbSurface).toBeCloseTo(r.wallArea - openingArea, 2);
  });

  it('osbPanels ≥ 1 et = ceil(osbSurface / 2.9768)', () => {
    const r = generateCabanon(4, 3);
    expect(r.osbPanels).toBeGreaterThanOrEqual(1);
    expect(r.osbPanels).toBe(Math.ceil(r.osbSurface / (1.22 * 2.44)));
  });

  it('osbSurface ≥ 0 et osbPanels ≥ 1 sans ouvertures', () => {
    const { osbSurface, osbPanels } = generateCabanon(3, 4, { openings: [] });
    expect(osbSurface).toBeGreaterThan(0);
    expect(osbPanels).toBeGreaterThan(0);
  });

  it('osbPanels augmente avec la taille du cabanon', () => {
    const small = generateCabanon(2, 2);
    const large = generateCabanon(6, 6);
    expect(large.osbPanels).toBeGreaterThan(small.osbPanels);
  });
});

/* ── Edge cases ───────────────────────────────────────────────── */
describe('generateCabanon — edge cases', () => {
  it('dimensions minimales 2×2 — pas de crash', () => {
    expect(() => generateCabanon(2, 2)).not.toThrow();
    const { geometry } = generateCabanon(2, 2);
    expect(geometry.structuralStuds.length).toBeGreaterThan(0);
  });

  it('dimensions maximales 6×6 — pas de crash', () => {
    expect(() => generateCabanon(6, 6)).not.toThrow();
    const { geometry } = generateCabanon(6, 6);
    expect(geometry.structuralStuds.length).toBeGreaterThan(0);
  });

  it('hauteur custom 2.7m', () => {
    const { geometry } = generateCabanon(4, 3, { height: 2.7 });
    expect(geometry.dimensions.height).toBe(2.7);
    expect(geometry.walls[1].height).toBeCloseTo(2.7 + 4 * SLOPE_RATIO, 3);
  });
});
