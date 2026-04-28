/**
 * cloture-engine.test.js — Tests unitaires du moteur clôture
 *
 * Couvre :
 *   - generateCloture : quantitatifs (poteaux, rails, lames, quincaillerie)
 *   - geometry.posts : positions X + hauteur
 *   - geometry.rails : travées, x1/x2, type top/bottom
 *   - geometry.boards : répartition dans les travées
 *   - edge cases : dimensions minimales, non-multiples de POST_SPACING
 */
import { describe, it, expect } from 'vitest';
import { generateCloture } from '../modules/cloture/engine.js';

/* ── Helpers ──────────────────────────────────────────────────── */
const r3 = (v) => +v.toFixed(3);

/* ── Constantes de référence (dupliquées pour les assertions) ── */
const POST_SECTION = 0.09;
const POST_SPACING = 2.00;
const RAIL_INSET_TOP = 0.10;
const RAIL_INSET_BOTTOM = 0.10;
const BOARD_W = 0.12;
const BOARD_GAP = 0.02;
const VIS_PER_BOARD = 4;
const VIS_PER_RAIL_POST = 2;
// DTU 31.1 pratique : max(0.50, height/3) — pour h=1.50m → max(0.50, 0.50) = 0.50
const FOOT_EMBED = 0.50;

/* ══════════════════════════════════════════════════════════════ */
/*  Cas nominal : clôture 6m × 1.50m (3 travées de 2m)          */
/* ══════════════════════════════════════════════════════════════ */
describe('generateCloture — cas nominal 6m × 1.50m', () => {
  const s = generateCloture(6, 1.50);

  /* ── Quantitatifs ────────────────────────────────────────── */
  describe('quantitatifs', () => {
    it('4 poteaux pour 6m (3 travées de 2m)', () => {
      expect(s.postCount).toBe(4);
      expect(s.posts).toBe(4);
    });

    it('6 rails (2 par travée × 3 travées)', () => {
      expect(s.railCount).toBe(6);
      expect(s.rails).toBe(6);
    });

    it('longueur poteau = hauteur + FOOT_EMBED', () => {
      expect(s.postLength).toBeCloseTo(1.50 + FOOT_EMBED, 3);
    });

    it('longueur rail = espacement - section poteau', () => {
      expect(s.railLength).toBeCloseTo(r3(2.0 - POST_SECTION), 3);
    });

    it('longueur lame = hauteur - insets', () => {
      const expected = 1.50 - RAIL_INSET_TOP - RAIL_INSET_BOTTOM;
      expect(s.boardLength).toBeCloseTo(expected, 3);
    });

    it('surface = width × height', () => {
      expect(s.surface).toBeCloseTo(6 * 1.50, 2);
    });

    it('linéaire = width', () => {
      expect(s.linearMeters).toBeCloseTo(6, 3);
    });

    it('boardCount > 0 et multiple de 3 travées', () => {
      expect(s.boardCount).toBeGreaterThan(0);
      // Chaque travée a le même nombre de lames
      expect(s.boardCount % 3).toBe(0);
    });
  });

  /* ── Quincaillerie ──────────────────────────────────────── */
  describe('quincaillerie', () => {
    it('vis lames = boardCount × VIS_PER_BOARD', () => {
      expect(s.visLames).toBe(s.boardCount * VIS_PER_BOARD);
    });

    it('vis rails = railCount × 2 × VIS_PER_RAIL_POST', () => {
      expect(s.visRails).toBe(s.railCount * 2 * VIS_PER_RAIL_POST);
    });

    it('ancrages = postCount', () => {
      expect(s.ancrages).toBe(s.postCount);
    });
  });

  /* ── Geometry poteaux ──────────────────────────────────── */
  describe('geometry.posts', () => {
    it('4 poteaux en geometry', () => {
      expect(s.geometry.posts).toHaveLength(4);
    });

    it('premier poteau à x=0', () => {
      expect(s.geometry.posts[0].x).toBeCloseTo(0, 3);
    });

    it('dernier poteau à x=6', () => {
      expect(s.geometry.posts[3].x).toBeCloseTo(6, 3);
    });

    it('espacement régulier entre poteaux', () => {
      for (let i = 1; i < s.geometry.posts.length; i++) {
        const dx = s.geometry.posts[i].x - s.geometry.posts[i - 1].x;
        expect(dx).toBeCloseTo(2.0, 3);
      }
    });

    it('chaque poteau a la bonne hauteur', () => {
      s.geometry.posts.forEach(p => {
        expect(p.height).toBeCloseTo(1.50, 3);
      });
    });
  });

  /* ── Geometry rails ────────────────────────────────────── */
  describe('geometry.rails', () => {
    it('6 rails en geometry', () => {
      expect(s.geometry.rails).toHaveLength(6);
    });

    it('3 rails top + 3 rails bottom', () => {
      const tops = s.geometry.rails.filter(r => r.type === 'top');
      const bottoms = s.geometry.rails.filter(r => r.type === 'bottom');
      expect(tops).toHaveLength(3);
      expect(bottoms).toHaveLength(3);
    });

    it('x1 < x2 pour chaque rail', () => {
      s.geometry.rails.forEach(r => {
        expect(r.x2).toBeGreaterThan(r.x1);
      });
    });

    it('rails ne chevauchent pas les poteaux', () => {
      const halfPost = POST_SECTION / 2;
      s.geometry.rails.forEach(r => {
        // x1 doit être ≥ face intérieure du poteau gauche
        expect(r.x1).toBeGreaterThanOrEqual(halfPost - 0.001);
      });
    });

    it('rail top y = hauteur - RAIL_INSET_TOP', () => {
      const tops = s.geometry.rails.filter(r => r.type === 'top');
      tops.forEach(r => {
        expect(r.y).toBeCloseTo(1.50 - RAIL_INSET_TOP, 3);
      });
    });

    it('rail bottom y = RAIL_INSET_BOTTOM', () => {
      const bottoms = s.geometry.rails.filter(r => r.type === 'bottom');
      bottoms.forEach(r => {
        expect(r.y).toBeCloseTo(RAIL_INSET_BOTTOM, 3);
      });
    });
  });

  /* ── Geometry lames ────────────────────────────────────── */
  describe('geometry.boards', () => {
    it('nombre de lames geometry = boardCount', () => {
      expect(s.geometry.boards).toHaveLength(s.boardCount);
    });

    it('chaque lame appartient à une travée valide', () => {
      s.geometry.boards.forEach(b => {
        expect(b.span).toBeGreaterThanOrEqual(0);
        expect(b.span).toBeLessThan(3);
      });
    });

    it('lames restent dans l\'espace utile de leur travée', () => {
      const halfPost = POST_SECTION / 2;
      s.geometry.boards.forEach(b => {
        const spanStart = b.span * 2.0 + halfPost;
        const spanEnd = (b.span + 1) * 2.0 - halfPost;
        expect(b.x).toBeGreaterThanOrEqual(spanStart - 0.001);
        expect(b.x + BOARD_W).toBeLessThanOrEqual(spanEnd + 0.001);
      });
    });

    it('hauteur lame = boardLength', () => {
      s.geometry.boards.forEach(b => {
        expect(b.height).toBeCloseTo(s.boardLength, 3);
      });
    });
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Cas non-multiple : clôture 5m (ceil(5/2)=3 travées)         */
/* ══════════════════════════════════════════════════════════════ */
describe('generateCloture — 5m non-multiple de POST_SPACING', () => {
  const s = generateCloture(5, 1.80);

  it('4 poteaux (3 travées)', () => {
    expect(s.postCount).toBe(4);
  });

  it('espacement réel = 5/3 ≈ 1.667m (< POST_SPACING)', () => {
    const actual = s.geometry.dimensions.postSpacing;
    expect(actual).toBeLessThanOrEqual(POST_SPACING);
    expect(actual).toBeCloseTo(r3(5 / 3), 3);
  });

  it('dernier poteau à x=5', () => {
    const last = s.geometry.posts[s.geometry.posts.length - 1];
    expect(last.x).toBeCloseTo(5, 2);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Cas minimal : clôture très courte (< POST_SPACING)           */
/* ══════════════════════════════════════════════════════════════ */
describe('generateCloture — cas minimal 1m', () => {
  const s = generateCloture(1, 1.20);

  it('au minimum 2 poteaux', () => {
    expect(s.postCount).toBeGreaterThanOrEqual(2);
  });

  it('au minimum 2 rails (1 travée)', () => {
    expect(s.railCount).toBeGreaterThanOrEqual(2);
  });

  it('au minimum 1 lame', () => {
    expect(s.boardCount).toBeGreaterThanOrEqual(1);
  });

  it('geometry.dimensions.width = 1', () => {
    expect(s.geometry.dimensions.width).toBeCloseTo(1, 3);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Cas large : clôture 20m (10 travées)                         */
/* ══════════════════════════════════════════════════════════════ */
describe('generateCloture — grande clôture 20m', () => {
  const s = generateCloture(20, 1.50);

  it('11 poteaux (10 travées)', () => {
    expect(s.postCount).toBe(11);
  });

  it('20 rails', () => {
    expect(s.railCount).toBe(20);
  });

  it('espacement = 2.0m exactement', () => {
    expect(s.geometry.dimensions.postSpacing).toBeCloseTo(2.0, 3);
  });

  it('geometry boards distribués sur 10 travées', () => {
    const spans = new Set(s.geometry.boards.map(b => b.span));
    expect(spans.size).toBe(10);
  });
});

/* ══════════════════════════════════════════════════════════════ */
/*  Invariants structurels                                        */
/* ══════════════════════════════════════════════════════════════ */
describe('generateCloture — invariants', () => {
  const configs = [
    [4, 1.50],
    [6, 1.80],
    [10, 1.20],
    [3.5, 1.50],
    [7.3, 2.00],
  ];

  configs.forEach(([w, h]) => {
    describe(`${w}m × ${h}m`, () => {
      const s = generateCloture(w, h);

      it('postCount = intervals + 1', () => {
        const intervals = Math.max(1, Math.ceil(w / POST_SPACING));
        expect(s.postCount).toBe(intervals + 1);
      });

      it('railCount = 2 × travées', () => {
        expect(s.railCount).toBe(2 * (s.postCount - 1));
      });

      it('geometry posts length = postCount', () => {
        expect(s.geometry.posts).toHaveLength(s.postCount);
      });

      it('geometry rails length = railCount', () => {
        expect(s.geometry.rails).toHaveLength(s.railCount);
      });

      it('espacement ≤ POST_SPACING', () => {
        expect(s.geometry.dimensions.postSpacing).toBeLessThanOrEqual(POST_SPACING + 0.001);
      });
    });
  });
});
