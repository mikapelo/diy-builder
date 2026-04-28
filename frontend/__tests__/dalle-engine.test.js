/**
 * dalle-engine.test.js
 *
 * Tests du moteur dalle béton V1 :
 *   - épaisseurs réglementaires (DTU 13.3 §5)
 *   - volumes béton + bascule sacs/toupie
 *   - forme drainante
 *   - joints de fractionnement (DTU 13.3 §6) — surface max piéton/véhicule
 *   - treillis soudé et recouvrement 15%
 *   - invariants (volumes > 0, surfaces positives)
 *
 * Convention d'axes : X=largeur, Z=profondeur, Y=épaisseur.
 */
import { describe, it, expect } from 'vitest';
import {
  generateDalle,
  getEpaisseur,
  getJointArea,
  computeJointGrid,
  buildJointSegments,
} from '../modules/dalle/engine.js';
import {
  EPAISSEUR_PIETONNE,
  EPAISSEUR_VEHICULE,
  EPAISSEUR_PL,
  JOINT_AREA_PIETON,
  JOINT_AREA_VEHICULE,
  FORME_THICKNESS,
  SAC_BETON_VOLUME,
  TREILLIS_OVERLAP_FACTOR,
  TOUPIE_VOLUME_THRESHOLD,
} from '../lib/dalleConstants.js';

/* ── Helpers d'épaisseur et joints ──────────────────────────── */

describe('getEpaisseur', () => {
  it('épaisseur 10 cm pour usage piéton', () => {
    expect(getEpaisseur('pietonne')).toBe(EPAISSEUR_PIETONNE);
    expect(getEpaisseur('pietonne')).toBe(0.10);
  });

  it('épaisseur 12 cm pour usage véhicule', () => {
    expect(getEpaisseur('vehicule')).toBe(EPAISSEUR_VEHICULE);
    expect(getEpaisseur('vehicule')).toBe(0.12);
  });

  it('épaisseur 20 cm pour usage poids lourds', () => {
    expect(getEpaisseur('pl')).toBe(EPAISSEUR_PL);
    expect(getEpaisseur('pl')).toBe(0.20);
  });

  it('usage inconnu retombe sur piéton', () => {
    expect(getEpaisseur(undefined)).toBe(EPAISSEUR_PIETONNE);
    expect(getEpaisseur('foo')).toBe(EPAISSEUR_PIETONNE);
  });
});

describe('getJointArea', () => {
  it('surface 25 m² pour piéton (DTU 13.3 §6)', () => {
    expect(getJointArea('pietonne')).toBe(JOINT_AREA_PIETON);
  });

  it('surface 40 m² pour véhicule (DTU 13.3 §6)', () => {
    expect(getJointArea('vehicule')).toBe(JOINT_AREA_VEHICULE);
  });
});

describe('computeJointGrid', () => {
  it('pavés respectent la surface max pour 4×6 piéton (≤ 25 m²)', () => {
    const { nx, nz } = computeJointGrid(4, 6, 25);
    const pave = (4 / nx) * (6 / nz);
    expect(pave).toBeLessThanOrEqual(25);
  });

  it('retourne 1×1 pour petite dalle sous le seuil', () => {
    const { nx, nz } = computeJointGrid(3, 4, 25); // 12 m² < 25
    expect(nx).toBe(1);
    expect(nz).toBe(1);
  });

  it('subdivise une grande dalle véhicule (10×10 = 100 m², max 40)', () => {
    const { nx, nz } = computeJointGrid(10, 10, 40);
    const pave = (10 / nx) * (10 / nz);
    expect(pave).toBeLessThanOrEqual(40);
  });
});

describe('buildJointSegments', () => {
  it('produit nx-1 joints longitudinaux + nz-1 joints transversaux', () => {
    const segs = buildJointSegments(6, 4, 3, 2);
    // 2 joints longitudinaux + 1 joint transversal = 3
    expect(segs.length).toBe(3);
  });

  it('aucun segment pour grille 1×1', () => {
    expect(buildJointSegments(3, 4, 1, 1)).toEqual([]);
  });
});

/* ── generateDalle — structure retournée ────────────────────── */

describe('generateDalle — structure de base', () => {
  const r = generateDalle(4, 3); // piéton par défaut, 12 m²

  it('retourne surface = width × depth', () => {
    expect(r.surface).toBe(12);
  });

  it('retourne usage piéton par défaut', () => {
    expect(r.usage).toBe('pietonne');
  });

  it('retourne volumeBeton = surface × épaisseur', () => {
    expect(r.volumeBeton).toBeCloseTo(12 * 0.10, 3);
  });

  it('retourne volumeForme = surface × 0.10 (DTU 13.3 §7.3)', () => {
    expect(r.volumeForme).toBeCloseTo(12 * FORME_THICKNESS, 3);
  });

  it('retourne un objet geometry avec dimensions et joints', () => {
    expect(r.geometry).toBeDefined();
    expect(r.geometry.dimensions.width).toBe(4);
    expect(r.geometry.dimensions.depth).toBe(3);
    expect(r.geometry.dimensions.epaisseur).toBe(0.10);
    expect(Array.isArray(r.geometry.joints)).toBe(true);
  });
});

describe('generateDalle — usage et épaisseur', () => {
  it('usage véhicule applique épaisseur 12 cm', () => {
    const r = generateDalle(4, 3, { usage: 'vehicule' });
    expect(r.epaisseur).toBe(0.12);
    expect(r.volumeBeton).toBeCloseTo(12 * 0.12, 3);
  });

  it('usage PL applique épaisseur 20 cm', () => {
    const r = generateDalle(4, 3, { usage: 'pl' });
    expect(r.epaisseur).toBe(0.20);
  });
});

describe('generateDalle — sacs vs toupie', () => {
  it('sacsBeton cohérent pour petite dalle 2×2 piéton', () => {
    const r = generateDalle(2, 2); // 4 m² × 0.10 = 0.4 m³
    expect(r.needsToupie).toBe(false);
    // 0.4 / 0.017 ≈ 23.5 → 24 sacs
    expect(r.sacsBeton).toBe(Math.ceil(0.4 / SAC_BETON_VOLUME));
    expect(r.sacsBeton).toBeGreaterThan(0);
  });

  it('needsToupie = true pour dalle dont le volume ≥ 3 m³', () => {
    // 30 m² piéton = 3 m³ exactement → seuil inclus
    const r = generateDalle(5, 6);
    expect(r.volumeBeton).toBeGreaterThanOrEqual(TOUPIE_VOLUME_THRESHOLD);
    expect(r.needsToupie).toBe(true);
    expect(r.sacsBeton).toBe(0);
  });

  it('needsToupie = false pour dalle dont le volume < 3 m³', () => {
    // 20 m² piéton = 2 m³ < 3
    const r = generateDalle(4, 5);
    expect(r.volumeBeton).toBeLessThan(TOUPIE_VOLUME_THRESHOLD);
    expect(r.needsToupie).toBe(false);
    expect(r.sacsBeton).toBeGreaterThan(0);
  });
});

describe('generateDalle — joints DTU 13.3 §6', () => {
  it('joints respectent DTU 13.3 — surface max 25 m² piéton', () => {
    // 6×5 = 30 m² piéton → doit être fractionné
    const r = generateDalle(6, 5, { usage: 'pietonne' });
    expect(r.jointCount).toBeGreaterThanOrEqual(1);
    // Inspecte chaque pavé construit par les joints
    const { nx, nz } = computeJointGrid(6, 5, JOINT_AREA_PIETON);
    const paveSurface = (6 / nx) * (5 / nz);
    expect(paveSurface).toBeLessThanOrEqual(JOINT_AREA_PIETON);
  });

  it('joints respectent DTU 13.3 — surface max 40 m² véhicule', () => {
    // 8×6 = 48 m² véhicule → doit être fractionné mais moins qu'en piéton
    const r = generateDalle(8, 6, { usage: 'vehicule' });
    expect(r.jointCount).toBeGreaterThanOrEqual(1);
    const { nx, nz } = computeJointGrid(8, 6, JOINT_AREA_VEHICULE);
    const paveSurface = (8 / nx) * (6 / nz);
    expect(paveSurface).toBeLessThanOrEqual(JOINT_AREA_VEHICULE);
  });

  it('aucun joint pour petite dalle 3×4 piéton (12 m² < 25 m²)', () => {
    const r = generateDalle(3, 4);
    expect(r.jointCount).toBe(0);
    expect(r.jointsLinear).toBe(0);
  });

  it('jointsLinear cohérent : longitudinaux × depth + transversaux × width', () => {
    // 6×5 piéton → nx=2, nz=1 → 1 joint longitudinal de longueur 5
    const r = generateDalle(6, 5);
    const expected = (2 - 1) * 5 + (1 - 1) * 6; // 5
    expect(r.jointsLinear).toBeCloseTo(expected, 3);
  });
});

describe('generateDalle — treillis soudé', () => {
  it('treillisSurface inclut 15% recouvrement si actif', () => {
    // Surface > 10 m² → treillis actif par défaut
    const r = generateDalle(4, 4); // 16 m²
    expect(r.treillisSurface).toBeCloseTo(16 * TREILLIS_OVERLAP_FACTOR, 2);
  });

  it('pas de treillis en dessous du seuil si withTreillis non forcé', () => {
    const r = generateDalle(2, 3); // 6 m² < 10
    expect(r.treillisSurface).toBe(0);
  });

  it('withTreillis:true force le treillis même sur petite surface', () => {
    const r = generateDalle(2, 3, { withTreillis: true });
    expect(r.treillisSurface).toBeCloseTo(6 * TREILLIS_OVERLAP_FACTOR, 2);
  });

  it('withTreillis:false désactive le treillis même sur grande surface', () => {
    const r = generateDalle(6, 6, { withTreillis: false });
    expect(r.treillisSurface).toBe(0);
  });
});

/* ── Invariants métier ──────────────────────────────────────── */

describe('generateDalle — invariants', () => {
  it('volumeBeton > 0 pour toute surface > 0', () => {
    expect(generateDalle(1, 1).volumeBeton).toBeGreaterThan(0);
    expect(generateDalle(0.5, 0.5).volumeBeton).toBeGreaterThan(0);
    expect(generateDalle(12, 8, { usage: 'pl' }).volumeBeton).toBeGreaterThan(0);
  });

  it('volumeForme = surface × FORME_THICKNESS pour toute dalle', () => {
    const cases = [[2, 2], [4, 3], [10, 10], [6, 8]];
    for (const [w, d] of cases) {
      const r = generateDalle(w, d);
      expect(r.volumeForme).toBeCloseTo(w * d * FORME_THICKNESS, 3);
    }
  });

  it('sacsBeton toujours entier positif si pas de toupie', () => {
    const r = generateDalle(2, 2);
    expect(Number.isInteger(r.sacsBeton)).toBe(true);
    expect(r.sacsBeton).toBeGreaterThanOrEqual(0);
  });

  it('jointCount entier ≥ 0', () => {
    const r = generateDalle(10, 10, { usage: 'pietonne' });
    expect(Number.isInteger(r.jointCount)).toBe(true);
    expect(r.jointCount).toBeGreaterThanOrEqual(0);
  });

  it('options manquantes → défaut piéton sans crash', () => {
    expect(() => generateDalle(3, 3)).not.toThrow();
    expect(() => generateDalle(3, 3, {})).not.toThrow();
  });
});
