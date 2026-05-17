/**
 * terrasse-topview-gardecorps.test.js — Invariants rendu garde-corps dans
 * le plan technique vue de dessus du PDF terrasse.
 *
 * Couvre :
 *   - enabled=false (ou absent) → ZÉRO primitive garde-corps ajoutée
 *   - enabled=true → segments framings supplémentaires + label garde-corps
 *   - mapping côtés : 'avant'/'arrière' = horizontal, 'gauche'/'droite' = vertical
 */
import { describe, it, expect } from 'vitest';
import { generateDeck } from '../lib/deckEngine.js';
import { buildTerrasseTopView } from '../lib/plan/buildTerrasseTopView.js';

const DIMS = { width: 4, depth: 3 };
const VIEWPORT = { ox: 0, oy: 0, drawW: 160, drawH: 120 };

/** Compte les segments framings ressemblant à un trait garde-corps (couleur bleue). */
function countGcLines(layers) {
  return layers.framings.filter(
    p => p.type === 'line'
      && Array.isArray(p.stroke)
      && p.stroke[0] === 28 && p.stroke[1] === 90 && p.stroke[2] === 138,
  ).length;
}

/** Compte les labels "Garde-corps" présents. */
function countGcLabels(layers) {
  return layers.labels.filter(
    p => p.type === 'text' && typeof p.content === 'string' && p.content.includes('Garde-corps'),
  ).length;
}

describe('buildTerrasseTopView — garde-corps désactivé', () => {
  it('aucun segment garde-corps quand options omis', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT);
    expect(countGcLines(layers)).toBe(0);
    expect(countGcLabels(layers)).toBe(0);
  });

  it('aucun segment garde-corps quand enabled=false', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT,
      { gardeCorps: { enabled: false, sides: ['avant'] } });
    expect(countGcLines(layers)).toBe(0);
    expect(countGcLabels(layers)).toBe(0);
  });
});

describe('buildTerrasseTopView — garde-corps activé', () => {
  it('1 côté avant → 1 segment + 1 label', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT,
      { gardeCorps: { enabled: true, height: 1.0, sides: ['avant'] } });
    expect(countGcLines(layers)).toBe(1);
    expect(countGcLabels(layers)).toBe(1);
  });

  it('4 côtés → 4 segments', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT, {
      gardeCorps: { enabled: true, height: 1.0, sides: ['avant', 'arrière', 'gauche', 'droite'] },
    });
    expect(countGcLines(layers)).toBe(4);
  });

  it('avant + arrière → 2 traits horizontaux (y1 == y2)', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT, {
      gardeCorps: { enabled: true, height: 1.0, sides: ['avant', 'arrière'] },
    });
    const lines = layers.framings.filter(
      p => p.type === 'line'
        && Array.isArray(p.stroke) && p.stroke[0] === 28,
    );
    expect(lines).toHaveLength(2);
    for (const l of lines) {
      expect(Math.abs(l.y1 - l.y2)).toBeLessThan(0.001);
    }
  });

  it('gauche + droite → 2 traits verticaux (x1 == x2)', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT, {
      gardeCorps: { enabled: true, height: 1.0, sides: ['gauche', 'droite'] },
    });
    const lines = layers.framings.filter(
      p => p.type === 'line'
        && Array.isArray(p.stroke) && p.stroke[0] === 28,
    );
    expect(lines).toHaveLength(2);
    for (const l of lines) {
      expect(Math.abs(l.x1 - l.x2)).toBeLessThan(0.001);
    }
  });

  it('label garde-corps inclut la hauteur formatée', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT,
      { gardeCorps: { enabled: true, height: 1.10, sides: ['avant'] } });
    const label = layers.labels.find(p => p.type === 'text' && p.content?.includes('Garde-corps'));
    expect(label).toBeDefined();
    expect(label.content).toContain('1.10');
  });

  it('segments garde-corps marqués comme pointillés (dash)', () => {
    const deck = generateDeck(DIMS.width, DIMS.depth);
    const { layers } = buildTerrasseTopView(deck, DIMS, VIEWPORT,
      { gardeCorps: { enabled: true, height: 1.0, sides: ['avant'] } });
    const line = layers.framings.find(
      p => p.type === 'line'
        && Array.isArray(p.stroke) && p.stroke[0] === 28,
    );
    expect(line.dash).toBeDefined();
    expect(Array.isArray(line.dash)).toBe(true);
  });
});
