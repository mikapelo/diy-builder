/**
 * bardage-engine.test.js — Tests unitaires du moteur bardage
 *
 * Couvre :
 *   - generateBardage : quantitatifs pose horizontale + verticale
 *   - rowCount / colCount selon pose
 *   - totalLameLength cohérent (rowCount × width en pose H)
 *   - tasseaux respectent DTU 41.2 §7.6.1 (entraxe ≤ 0.60 m)
 *   - déduction ouvertures sur la surface
 *   - positions geometry non-vides
 *   - visCount = rowCount × tasseauCount × VIS_PER_LAME
 *   - invariants : totalLameLength > 0 pour toute surface > 0
 *   - edge cases : valeurs limites, options manquantes
 */
import { describe, it, expect } from 'vitest';
import { generateBardage } from '../modules/bardage/engine.js';

/* ── Constantes référence (dupliquées pour lisibilité des assertions) ── */
const LAME_WIDTH = 0.140;
const RECOUVREMENT = 0.020;
const LAME_VISIBLE = LAME_WIDTH - RECOUVREMENT;  // 0.120 m
const TASSEAU_SPACING = 0.600;
const VIS_PER_LAME = 2;

/* ══════════════════════════════════════════════════════════════ */
/*  Pose horizontale — cas nominal 4m × 2.5m                     */
/* ══════════════════════════════════════════════════════════════ */
describe('generateBardage — pose horizontale 4m × 2.5m', () => {
  const s = generateBardage(4, 2.5);

  it('rowCount correct pour 2.5m de hauteur pose horizontale', () => {
    // ceil(2.5 / 0.120) = ceil(20.833) = 21 rangées
    const expected = Math.ceil(2.5 / LAME_VISIBLE);
    expect(s.rowCount).toBe(expected);
  });

  it('pose par défaut = horizontal', () => {
    expect(s.pose).toBe('horizontal');
  });

  it('totalLameLength = rowCount × width', () => {
    expect(s.totalLameLength).toBeCloseTo(s.rowCount * 4, 3);
  });

  it('tasseauCount = ceil(width / TASSEAU_SPACING) + 1', () => {
    // ceil(4 / 0.6) + 1 = 7 + 1 = 8
    expect(s.tasseauCount).toBe(Math.ceil(4 / TASSEAU_SPACING) + 1);
  });

  it('tasseaux respectent DTU 41.2 — espacement ≤ 0.60 m', () => {
    const gaps = [];
    const t = s.geometry.tasseaux;
    for (let i = 1; i < t.length; i++) {
      gaps.push(t[i].x - t[i - 1].x);
    }
    expect(gaps.every((g) => g <= TASSEAU_SPACING + 1e-9)).toBe(true);
  });

  it('totalTasseauLength = tasseauCount × height', () => {
    expect(s.totalTasseauLength).toBeCloseTo(s.tasseauCount * 2.5, 3);
  });

  it('visCount = rowCount × tasseauCount × 2', () => {
    expect(s.visCount).toBe(s.rowCount * s.tasseauCount * VIS_PER_LAME);
  });

  it('surface brute (sans ouverture) = width × height', () => {
    expect(s.surface).toBeCloseTo(4 * 2.5, 2);
  });

  it('génère des positions geometry non-vides', () => {
    expect(s.geometry.lames.length).toBeGreaterThan(0);
    expect(s.geometry.tasseaux.length).toBeGreaterThan(0);
    expect(s.geometry.lames.length).toBe(s.rowCount);
    expect(s.geometry.tasseaux.length).toBe(s.tasseauCount);
  });

  it('chaque lame a une position y positive ou nulle', () => {
    expect(s.geometry.lames.every((l) => l.y >= 0)).toBe(true);
  });

  it('classes d\'emploi conformes DTU 41.2', () => {
    expect(s.lameTreatment).toBe('UC3b');
    expect(s.tasseauTreatment).toBe('UC3a');
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Pose verticale                                               */
/* ══════════════════════════════════════════════════════════════ */
describe('generateBardage — pose verticale 3m × 2m', () => {
  const s = generateBardage(3, 2, { pose: 'vertical' });

  it('pose verticale : colCount correct', () => {
    // ceil(3 / 0.120) = 25 colonnes
    const expected = Math.ceil(3 / LAME_VISIBLE);
    expect(s.rowCount).toBe(expected);
  });

  it('totalLameLength = colCount × height en pose verticale', () => {
    expect(s.totalLameLength).toBeCloseTo(s.rowCount * 2, 3);
  });

  it('tasseauCount horizontaux = ceil(height/0.6) + 1 en pose V', () => {
    expect(s.tasseauCount).toBe(Math.ceil(2 / TASSEAU_SPACING) + 1);
  });

  it('tasseaux horizontaux respectent entraxe ≤ 0.60 m', () => {
    const t = s.geometry.tasseaux;
    for (let i = 1; i < t.length; i++) {
      expect(t[i].y1 - t[i - 1].y1).toBeLessThanOrEqual(TASSEAU_SPACING + 1e-9);
    }
  });

  it('totalTasseauLength = tasseauCount × width en pose V', () => {
    expect(s.totalTasseauLength).toBeCloseTo(s.tasseauCount * 3, 3);
  });

  it('geometry.pose = vertical', () => {
    expect(s.geometry.pose).toBe('vertical');
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Déduction des ouvertures                                      */
/* ══════════════════════════════════════════════════════════════ */
describe('generateBardage — déduction ouvertures', () => {
  it('déduction ouvertures : surface réduite correctement', () => {
    const s = generateBardage(4, 2.5, { openings: 2 }); // 2 m² à déduire
    expect(s.surface).toBeCloseTo(4 * 2.5 - 2, 2);
  });

  it('ouverture négative ignorée (clamp à 0)', () => {
    const s = generateBardage(4, 2.5, { openings: -5 });
    expect(s.surface).toBeCloseTo(10, 2);
  });

  it('ouverture supérieure à la surface donne 0', () => {
    const s = generateBardage(4, 2.5, { openings: 999 });
    expect(s.surface).toBe(0);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Largeur de lame personnalisée                                */
/* ══════════════════════════════════════════════════════════════ */
describe('generateBardage — lame largeur custom', () => {
  it('lame 180mm : pureau visible = 180 - 20 = 160mm', () => {
    const s = generateBardage(4, 2, { lameWidth: 0.180 });
    // ceil(2 / 0.160) = 13 rangées
    expect(s.rowCount).toBe(Math.ceil(2 / 0.160));
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Invariants / edge cases                                      */
/* ══════════════════════════════════════════════════════════════ */
describe('generateBardage — invariants', () => {
  it('totalLameLength > 0 pour toute surface > 0', () => {
    const cases = [
      [1, 1],
      [2.4, 2.5],
      [10, 3],
      [0.5, 0.5],
    ];
    cases.forEach(([w, h]) => {
      const s = generateBardage(w, h);
      expect(s.totalLameLength).toBeGreaterThan(0);
    });
  });

  it('rowCount ≥ 1 même pour hauteur très petite', () => {
    const s = generateBardage(2, 0.05);
    expect(s.rowCount).toBeGreaterThanOrEqual(1);
  });

  it('toutes les lames ont z ≥ 0 (derrière le parement)', () => {
    const s = generateBardage(3, 2);
    expect(s.geometry.lames.every((l) => l.z >= 0)).toBe(true);
  });

  it('options manquantes : defaults appliqués (pose horizontale)', () => {
    const s = generateBardage(3, 2);
    expect(s.pose).toBe('horizontal');
    expect(s.geometry.dimensions.lameWidth).toBeCloseTo(LAME_WIDTH, 3);
  });

  it('pose invalide fallback sur horizontal', () => {
    const s = generateBardage(3, 2, { pose: 'diagonal' });
    expect(s.pose).toBe('horizontal');
  });

  it('visCount > 0 pour toute surface non-nulle', () => {
    const s = generateBardage(2, 2);
    expect(s.visCount).toBeGreaterThan(0);
  });
});
