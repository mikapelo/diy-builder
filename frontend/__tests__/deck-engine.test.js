/**
 * deck-engine.test.js — Tests de sanité du moteur terrasse
 *
 * NE PAS modifier la logique — tests de non-régression uniquement.
 */
import { describe, it, expect } from 'vitest';
import { generateDeck, DTU } from '../lib/deckEngine.js';
import { buildDoubleJoistSegs } from '../lib/deckGeometry.js';

describe('generateDeck — structure retournée', () => {
  it('retourne joistCount > 0 pour 4×3', () => {
    const d = generateDeck(4, 3);
    expect(d.joistCount).toBeGreaterThan(0);
  });

  it('totalPads > 0', () => {
    const d = generateDeck(4, 3);
    expect(d.totalPads).toBeGreaterThan(0);
  });

  it('boardSegs est un tableau non vide', () => {
    const d = generateDeck(4, 3);
    expect(Array.isArray(d.boardSegs)).toBe(true);
    expect(d.boardSegs.length).toBeGreaterThan(0);
  });

  it('joistSegs est un tableau non vide', () => {
    const d = generateDeck(4, 3);
    expect(Array.isArray(d.joistSegs)).toBe(true);
    expect(d.joistSegs.length).toBeGreaterThan(0);
  });
});

describe('generateDeck — invariants DTU', () => {
  it('joistCount augmente avec la profondeur (width)', () => {
    const d1 = generateDeck(3, 3);
    const d2 = generateDeck(6, 3);
    expect(d2.joistCount).toBeGreaterThanOrEqual(d1.joistCount);
  });

  it('DTU.JOIST_SPACING est 0.40 m', () => {
    expect(DTU.JOIST_SPACING).toBe(0.40);
  });

  it('pas de crash sur dimensions minimales 2×2', () => {
    expect(() => generateDeck(2, 2)).not.toThrow();
  });

  it('pas de crash sur grandes dimensions 8×5', () => {
    expect(() => generateDeck(8, 5)).not.toThrow();
  });
});

/* ── JOIST_W local pour les assertions de collision ── */
const JOIST_W = 0.060;

describe('buildDoubleJoistSegs — collision avec lambourdes régulières', () => {
  it('invariant global : aucune double lambourde ne chevauche une régulière (widths 3–8 m)', () => {
    [3, 4, 5, 6, 7, 8].forEach(w => {
      const deck = generateDeck(w, 4);
      deck.doubleJoistSegs.forEach(seg => {
        deck.joistXPositions.forEach(xj => {
          const dist = Math.abs(seg.xPos - xj);
          expect(dist).toBeGreaterThanOrEqual(
            JOIST_W - 0.001,
            `width=${w}m : double lambourde à ${seg.xPos.toFixed(3)} chevauche régulière à ${xj.toFixed(3)}`,
          );
        });
      });
    });
  });

  it('Snap width=5m : les coupes captables voient leur lambourde régulière décalée sous la coupe', () => {
    // Comportement snap (DTU 51.4) : plutôt que générer une paire à côté d'une
    // régulière proche, on décale la régulière pour qu'elle passe SOUS la coupe.
    // width=5m : cuts [-1.012, 0.488, 1.988]. Les deux premières sont captables,
    // la troisième (près du bord) est refusée car elle violerait l'entraxe max.
    const deck = generateDeck(5, 4);
    const hasJoistAt = (x, tol = 0.003) =>
      deck.joistXPositions.some(xj => Math.abs(xj - x) < tol);
    expect(hasJoistAt(-1.012)).toBe(true);
    expect(hasJoistAt( 0.488)).toBe(true);
    // Coupe à 1.988 (snap refusé) : PAIRE COMPLÈTE posée.
    // Régulière à 2.098 (dist 11 cm > JOIST_W=4.5cm) → aucune collision → pas de skip.
    const uniqueDoubleXs = [...new Set(deck.doubleJoistSegs.map(s => s.xPos))];
    const pair = uniqueDoubleXs.filter(x => Math.abs(x - 1.988) < JOIST_W);
    expect(pair.length).toBe(2);
    // Paire centrée autour de la coupe
    expect(pair.some(x => Math.abs(x - (1.988 - JOIST_W / 2)) < 0.003)).toBe(true);
    expect(pair.some(x => Math.abs(x - (1.988 + JOIST_W / 2)) < 0.003)).toBe(true);
  });

  it('Snap width=4m : coupe intérieure captée, coupe près bord → paire isolée', () => {
    const deck = generateDeck(4, 4);
    // Cut à -0.512 doit être captée (joist régulier snappé dessus)
    const hasJoistAtLeft = deck.joistXPositions.some(xj => Math.abs(xj + 0.512) < 0.003);
    expect(hasJoistAtLeft).toBe(true);
    // Cut à 0.988 (snap refusé, régulières à 0.744 / 1.163 → dist 17-24 cm >> JOIST_W) → paire complète
    const uniqueDoubleXs = [...new Set(deck.doubleJoistSegs.map(s => s.xPos))];
    const pair = uniqueDoubleXs.filter(x => Math.abs(x - 0.988) < JOIST_W);
    expect(pair.length).toBe(2);
  });

  it('Cas A (width=7m) : la coupe à ≈0.988 m est couverte sans collision', () => {
    // width=7m : joist à 1.029, coupe à 0.988 (dist 4.1 cm < 6.75 cm) → Cas A
    const deck = generateDeck(7, 4);
    deck.doubleJoistSegs.forEach(seg => {
      deck.joistXPositions.forEach(xj => {
        expect(Math.abs(seg.xPos - xj)).toBeGreaterThanOrEqual(JOIST_W - 0.001);
      });
    });
  });

  it('buildDoubleJoistSegs sans joistXPositions (rétrocompat) : retourne un tableau', () => {
    // Appel sans 3e argument — doit fonctionner en mode Cas B généralisé
    const result = buildDoubleJoistSegs(4, 3);
    expect(Array.isArray(result)).toBe(true);
  });

  it('invariant snap : entraxe max ≤ 0.50 m (DTU 51.4 lame 28 mm) pour widths 3–8 m', () => {
    [3, 3.5, 4, 4.5, 5, 6, 6.5, 7, 8].forEach(w => {
      const deck = generateDeck(w, 4);
      for (let i = 1; i < deck.joistXPositions.length; i++) {
        const entraxe = deck.joistXPositions[i] - deck.joistXPositions[i - 1];
        expect(entraxe).toBeLessThanOrEqual(
          0.50 + 0.001,
          `width=${w}m : entraxe ${entraxe.toFixed(4)} entre joist ${i - 1} et ${i} dépasse 0.50 m`,
        );
      }
    });
  });

  it('invariant snap : rives (joist[0] et joist[n-1]) restent à ±width/2', () => {
    [3, 4, 5, 6, 7, 8].forEach(w => {
      const deck = generateDeck(w, 4);
      const n = deck.joistXPositions.length;
      expect(Math.abs(deck.joistXPositions[0] + w / 2)).toBeLessThan(1e-9);
      expect(Math.abs(deck.joistXPositions[n - 1] - w / 2)).toBeLessThan(1e-9);
    });
  });

  it('invariant snap : joistCount (BOM) reste inchangé par le snap', () => {
    // Le snap ne change que les POSITIONS, jamais le nombre → BOM identique
    [3, 4, 5, 6, 7, 8].forEach(w => {
      const expectedCount = Math.floor(w / 0.40) + 1;
      const deck = generateDeck(w, 4);
      expect(deck.joistCount).toBe(expectedCount);
      expect(deck.joistXPositions.length).toBe(expectedCount);
    });
  });

  it('invariant structure : chaque coupe a un appui direct sous son joint (DTU 51.4)', () => {
    // Option B : paire complète sauf collision physique. Chaque coupe DOIT avoir
    // soit une régulière centrée dessus (snap ou corps), soit une paire autour
    // (|xJoist - xCut| ≤ JOIST_W/2 + ε pour au moins une lambourde).
    // Cantilever max admissible entre about de lame et premier appui : ≤ JOIST_W/2.
    [3, 3.5, 4, 4.5, 5, 6, 6.5, 7, 8].forEach(w => {
      const deck = generateDeck(w, 4);
      const allJoistXs = [...deck.joistXPositions, ...deck.doubleJoistSegs.map(s => s.xPos)];
      deck.cutXPositions.forEach(xCut => {
        const hasSupport = allJoistXs.some(xj => Math.abs(xj - xCut) <= JOIST_W / 2 + 0.001);
        expect(hasSupport).toBe(
          true,
          `width=${w}m : coupe à ${xCut.toFixed(3)} sans appui direct (≤ JOIST_W/2)`,
        );
      });
    });
  });

  it('skip — coupe dans le corps d\'une lambourde : aucune double lambourde ajoutée (width=6.5m)', () => {
    // Pour width=6.5m, la coupe odd à ≈1.238 m tombe dans le corps du joist à 1.219 m
    // dist = 0.019 m < JOIST_W/2 = 0.0225 m → lambourde existante couvre le joint
    // → aucune double lambourde ne doit être générée autour de ce xCut
    const deck = generateDeck(6.5, 3.5);
    const xCutApprox = 1.238;
    const nearDoubles = deck.doubleJoistSegs.filter(s => Math.abs(s.xPos - xCutApprox) < 0.05);
    expect(nearDoubles.length).toBe(0);
  });
});
