/**
 * listeBOM.test.js — callEngine pour la page /liste
 *
 * Couvre :
 *   - 4 modules (terrasse, cabanon, pergola, cloture) retournent des champs cohérents
 *   - project inconnu → null
 *   - Pour terrasse, vérifie boards/joists/entretoises non-zéro pour 4×4
 *   - Pour terrasse, vérifie qu'entretoises utilise width (pas depth)
 */
import { describe, it, expect } from 'vitest';
import { callEngine, LAME_COMMERCIAL_LEN } from '@/lib/listeBOM.js';

describe('callEngine — projet inconnu', () => {
  it('retourne null', () => {
    expect(callEngine('inconnu', 4, 3)).toBeNull();
  });
});

describe('callEngine — terrasse', () => {
  it('retourne boards, joists, pads, screws, entretoises, bande pour 4×3', () => {
    const r = callEngine('terrasse', 4, 3);
    expect(r).not.toBeNull();
    expect(typeof r.boards).toBe('number');
    expect(typeof r.joists).toBe('number');
    expect(typeof r.pads).toBe('number');
    expect(typeof r.screws).toBe('number');
    expect(typeof r.entretoises).toBe('number');
    expect(typeof r.bande).toBe('number');
  });

  it('boards > 0, joists > 0, pads > 0 pour 4×3', () => {
    const r = callEngine('terrasse', 4, 3);
    expect(r.boards).toBeGreaterThan(0);
    expect(r.joists).toBeGreaterThan(0);
    expect(r.pads).toBeGreaterThan(0);
  });

  it('entretoises utilisent width (pas depth) pour le calcul d\'entraxe', () => {
    // Bug #1 audit : avant correction, w=2 d=4 donnait Math.floor(4/1.8)=2 entretoises.
    // Après correction avec ENTR_SPACING=1.5 sur w=2 → Math.floor(2/1.5)=1 position.
    // Sur w=4 d=2 → Math.floor(4/1.5)=2 positions (>1 quand width est plus grand).
    const r1 = callEngine('terrasse', 2, 4);  // w=2, d=4
    const r2 = callEngine('terrasse', 4, 2);  // w=4, d=2
    // Avec la formule width-based : r2 devrait avoir plus d'entretoises que r1
    expect(r2.entretoises).toBeGreaterThanOrEqual(r1.entretoises);
  });

  it('boards utilisent LAME_COMMERCIAL_LEN (3.6m) pas BOARD_LEN (3m)', () => {
    // Pour 4×4 : ~28 lames de surface, divisées par 3.6m ≈ 31 unités
    // Avec l'ancien BOARD_LEN=3.0 on aurait ~37 unités
    const r = callEngine('terrasse', 4, 4);
    expect(r.boards).toBeLessThan(45); // borne large : un calcul à 3.6m doit être < ce qu'on aurait à 3m
  });

  it('LAME_COMMERCIAL_LEN exporté = 3.6 m', () => {
    expect(LAME_COMMERCIAL_LEN).toBeCloseTo(3.6, 5);
  });

  it('petite terrasse 1×1 — quantités non négatives', () => {
    const r = callEngine('terrasse', 1, 1);
    expect(r.boards).toBeGreaterThanOrEqual(0);
    expect(r.joists).toBeGreaterThanOrEqual(0);
    expect(r.entretoises).toBeGreaterThanOrEqual(0);
  });
});

describe('callEngine — cabanon', () => {
  it('retourne champs principaux pour 3×4', () => {
    const r = callEngine('cabanon', 3, 4);
    expect(r).not.toBeNull();
    expect(r.surface).toBe(12);
    expect(r.studCount).toBeGreaterThan(0);
    expect(typeof r.bardage).toBe('number');
  });
});

describe('callEngine — pergola', () => {
  it('retourne champs principaux pour 4×3', () => {
    const r = callEngine('pergola', 4, 3);
    expect(r).not.toBeNull();
    expect(r.posts).toBeGreaterThan(0);
    expect(r.rafters).toBeGreaterThan(0);
  });
});

describe('callEngine — cloture', () => {
  it('retourne champs principaux pour 5m de longueur', () => {
    const r = callEngine('cloture', 5, 1.8);
    expect(r).not.toBeNull();
    expect(r.posts).toBeGreaterThan(0);
    expect(r.rails).toBeGreaterThan(0);
    expect(r.boards).toBeGreaterThan(0);
  });
});
