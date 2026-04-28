/**
 * modules/bardage/engine.js — Moteur de calcul Bardage V1
 *
 * Bardage bois extérieur : lames sur ossature secondaire (tasseaux).
 * Deux poses supportées :
 *   - horizontal : lames courantes sur toute la largeur, tasseaux verticaux
 *   - vertical   : lames courantes sur toute la hauteur, tasseaux horizontaux
 *
 * Source : NF DTU 41.2 P1-1 (août 2015).
 *
 * Convention d'axes :
 *   X = largeur surface à barder (horizontal)
 *   Y = hauteur surface à barder (vertical)
 *   Z = profondeur ossature/lame
 *
 * NE CONTIENT PAS de Three.js — moteur pur.
 */

import {
  LAME_WIDTH,
  LAME_THICKNESS,
  RECOUVREMENT,
  LAME_VISIBLE,
  TASSEAU_SECTION,
  TASSEAU_SPACING,
  WOOD_CLASS_LAME,
  WOOD_CLASS_TASS,
  VIS_PER_LAME,
} from '@/lib/bardageConstants.js';

/** Arrondi 3 décimales — usage interne geometry. */
function r3(v) {
  return +v.toFixed(3);
}

/** Surface nette = surface brute - ouvertures (m²). */
function netSurface(width, height, openings) {
  const gross = width * height;
  const net = gross - Math.max(0, openings);
  return Math.max(0, net);
}

/** Calcule la pose horizontale — lames courantes sur la largeur.
 *  DTU 41.2 §7.6.2.5 : fixation à chaque support, recouvrement ≥ 10%. */
function computeHorizontal(width, height, lameW) {
  // Pureau visible pour la lame choisie (≥ RECOUVREMENT minimum garanti)
  const lameVisible = lameW === LAME_WIDTH ? LAME_VISIBLE : (lameW - RECOUVREMENT);
  // Nombre de rangées sur la hauteur (1 lame par rangée sur toute la largeur)
  const rowCount = Math.max(1, Math.ceil(height / lameVisible));
  // Longueur totale lames à commander = rowCount × largeur
  const totalLameLength = r3(rowCount * width);
  // Tasseaux verticaux — DTU 41.2 §7.6.1.2.1 : entraxe ≤ TASSEAU_SPACING
  const tasseauCount = Math.ceil(width / TASSEAU_SPACING) + 1;
  const totalTasseauLength = r3(tasseauCount * height);
  // Vis : rowCount × tasseauCount × VIS_PER_LAME
  const visCount = rowCount * tasseauCount * VIS_PER_LAME;

  // Geometry : positions des lames (y) et tasseaux (x)
  const lames = [];
  for (let i = 0; i < rowCount; i++) {
    const y = r3(i * lameVisible);
    lames.push({ y, x1: 0, x2: r3(width), z: r3(TASSEAU_SECTION) });
  }

  const tasseaux = [];
  const tasseauStep = width / Math.max(1, tasseauCount - 1);
  for (let j = 0; j < tasseauCount; j++) {
    const x = r3(j * tasseauStep);
    tasseaux.push({ x, y1: 0, y2: r3(height), z: 0 });
  }

  return {
    rowCount,
    totalLameLength,
    tasseauCount,
    totalTasseauLength,
    visCount,
    lameVisible,
    lames,
    tasseaux,
  };
}

/** Calcule la pose verticale — lames courantes sur la hauteur.
 *  DTU 41.2 §7.6.2.6 : tasseaux horizontaux espacés de 65 cm max. */
function computeVertical(width, height, lameW) {
  const lameVisible = lameW === LAME_WIDTH ? LAME_VISIBLE : (lameW - RECOUVREMENT);
  // Nombre de colonnes (lames verticales) sur la largeur
  const colCount = Math.max(1, Math.ceil(width / lameVisible));
  // Longueur totale lames = colCount × hauteur
  const totalLameLength = r3(colCount * height);
  // Tasseaux horizontaux — entraxe ≤ TASSEAU_SPACING
  const tasseauCount = Math.ceil(height / TASSEAU_SPACING) + 1;
  const totalTasseauLength = r3(tasseauCount * width);
  const visCount = colCount * tasseauCount * VIS_PER_LAME;

  // Geometry : lames verticales à position X, tasseaux horizontaux
  const lames = [];
  for (let i = 0; i < colCount; i++) {
    const x = r3(i * lameVisible);
    // En pose verticale les lames sont elles-mêmes verticales : on stocke x pivot
    lames.push({ y: 0, x1: x, x2: x, z: r3(TASSEAU_SECTION) });
  }

  const tasseaux = [];
  const tasseauStep = height / Math.max(1, tasseauCount - 1);
  for (let j = 0; j < tasseauCount; j++) {
    const y = r3(j * tasseauStep);
    tasseaux.push({ x: 0, y1: y, y2: y, z: 0 });
  }

  return {
    rowCount: colCount,
    totalLameLength,
    tasseauCount,
    totalTasseauLength,
    visCount,
    lameVisible,
    lames,
    tasseaux,
  };
}

/**
 * Génère la structure complète d'un ouvrage de bardage.
 *
 * @param {number}  width              Largeur surface à barder (m)
 * @param {number}  height             Hauteur surface à barder (m)
 * @param {object}  [options={}]       Options
 * @param {'horizontal'|'vertical'} [options.pose='horizontal']
 * @param {number}  [options.lameWidth=LAME_WIDTH]  Largeur lame (m)
 * @param {number}  [options.openings=0]            Surface ouvertures à déduire (m²)
 * @returns {object}                   Quantitatifs + geometry
 */
export function generateBardage(width, height, options = {}) {
  const pose = options.pose === 'vertical' ? 'vertical' : 'horizontal';
  const lameW = options.lameWidth ?? LAME_WIDTH;
  const openings = options.openings ?? 0;

  const surface = r3(netSurface(width, height, openings));

  const calc = pose === 'horizontal'
    ? computeHorizontal(width, height, lameW)
    : computeVertical(width, height, lameW);

  // ── Geometry 3D ─────────────────────────────────────────────
  const geometry = {
    dimensions: {
      width: r3(width),
      height: r3(height),
      lameWidth: r3(lameW),
      lameThickness: LAME_THICKNESS,
      tasseauSection: TASSEAU_SECTION,
      lameVisible: r3(calc.lameVisible),
    },
    lames: calc.lames,
    tasseaux: calc.tasseaux,
    pose,
  };

  return {
    // ── BOM — Quantitatifs ────────────────────────────────────
    surface,
    rowCount: calc.rowCount,
    totalLameLength: calc.totalLameLength,
    tasseauCount: calc.tasseauCount,
    totalTasseauLength: calc.totalTasseauLength,
    visCount: calc.visCount,
    pose,

    // ── Durabilité — DTU 41.2 §7.2.2 + Annexe B ────────────────
    lameTreatment: WOOD_CLASS_LAME,
    tasseauTreatment: WOOD_CLASS_TASS,

    // ── Geometry ───────────────────────────────────────────────
    geometry,
  };
}
