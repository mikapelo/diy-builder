/**
 * deckGeometry.js — Fonctions de géométrie pure du simulateur terrasse
 *
 * Partagées entre DeckScene.jsx (rendu Three.js) et TechnicalPlan.jsx (SVG).
 * Aucune dépendance React / Three.js — fonctions testables isolément.
 *
 * Système de coordonnées monde (identique dans les deux consommateurs) :
 *   X = largeur    (gauche–droite)
 *   Z = profondeur (avant–arrière)
 *   Origine = centre de la terrasse
 */

import {
  BOARD_WIDTH, BOARD_GAP, BOARD_LEN, CUT_GAP, BOARD_OVERHANG,
  JOIST_W, JOIST_LEN,
  JOIST_ENTRAXE, PAD_ENTRAXE, ENTR_SPACING,
  MAX_JOIST_COUNT, MAX_PAD_ROWS, MAX_BOARD_ROWS,
} from './deckConstants.js';

/* ═══════════════════════════════════════════════════════════
   COMPTAGES DTU 51.4
═══════════════════════════════════════════════════════════ */

/**
 * Nombre de lambourdes selon l'entraxe DTU (40 cm).
 * @param {number} width  Largeur de la terrasse en m
 * @returns {number}
 */
export function computeJoistCount(width) {
  return Math.min(Math.floor(width / JOIST_ENTRAXE) + 1, MAX_JOIST_COUNT);
}

/**
 * Nombre de rangées de plots selon l'entraxe DTU (60 cm).
 * @param {number} depth  Profondeur de la terrasse en m
 * @returns {number}
 */
export function computePlotRows(depth) {
  return Math.min(Math.floor(depth / PAD_ENTRAXE) + 1, MAX_PAD_ROWS);
}

/* ═══════════════════════════════════════════════════════════
   SEGMENTS DE LAMES
   ──────────────────────────────────────────────────────────
   Chaque rangée est positionnée en Z, chaque lame s'étend en X.
   Débord BOARD_OVERHANG de chaque côté (DTU 51.4).
   Stagger : rangées paires  → première coupe à 3 m
             rangées impaires → première coupe à 1.5 m
   @param  {number} width
   @param  {number} depth
   @returns {Array<{xCenter:number, zCenter:number, segLen:number}>}
═══════════════════════════════════════════════════════════ */
export function buildBoardSegments(width, depth) {
  const effW     = width + 2 * BOARD_OVERHANG;
  const step     = BOARD_WIDTH + BOARD_GAP;
  const rowCount = Math.min(Math.floor(depth / step) + 1, MAX_BOARD_ROWS);
  const segs     = [];

  for (let row = 0; row < rowCount; row++) {
    const zCenter = -depth / 2 + BOARD_WIDTH / 2 + row * step;
    const isOdd   = row % 2 === 1;
    let   xLocal  = 0;

    if (isOdd) {
      const rawLen  = Math.min(BOARD_LEN / 2, effW);
      const hasNext = rawLen < effW - 0.001;
      const segLen  = hasNext ? rawLen - CUT_GAP / 2 : rawLen;
      segs.push({ xCenter: -effW / 2 + segLen / 2, zCenter, segLen });
      xLocal += rawLen;
    }

    while (xLocal < effW - 0.001) {
      const rawLen  = Math.min(BOARD_LEN, effW - xLocal);
      const hasNext = xLocal + rawLen < effW - 0.001;
      const shrinkL = (xLocal > (isOdd ? BOARD_LEN / 2 : 0) + 0.001) ? CUT_GAP / 2 : 0;
      const shrinkR = hasNext ? CUT_GAP / 2 : 0;
      const segLen  = rawLen - shrinkL - shrinkR;
      segs.push({
        xCenter: -effW / 2 + xLocal + shrinkL + segLen / 2,
        zCenter,
        segLen,
      });
      xLocal += rawLen;
    }
  }
  return segs;
}

/* ═══════════════════════════════════════════════════════════
   SEGMENTS DE LAMBOURDES
   ──────────────────────────────────────────────────────────
   Chaque lambourde = colonne en X, s'étend en Z (profondeur).
   Segmentée si depth > 3 m (longueur standard).
   Stagger : colonnes paires  → jonction à 3 m
             colonnes impaires → jonction à 1.5 m

   @param  {number}         width
   @param  {number}         depth
   @param  {number}         joistCount
   @param  {number[]|null}  joistXPositions  (optionnel) positions X réelles ;
                            si null → positions uniformes recalculées (backcompat)
   @returns {{ segments: Array<{xPos:number, zCenter:number, segLen:number}>,
               joints:   Array<{xPos:number, zAbs:number}> }}
═══════════════════════════════════════════════════════════ */
export function buildJoistData(width, depth, joistCount, joistXPositions = null) {
  const positions = joistXPositions ?? Array.from(
    { length: joistCount },
    (_, col) => -width / 2 + (col / Math.max(joistCount - 1, 1)) * width,
  );
  const segments = [];
  const joints   = [];

  for (let col = 0; col < positions.length; col++) {
    const xPos    = positions[col];
    const firstAt = (col % 2 === 0) ? JOIST_LEN : JOIST_LEN / 2;
    let   zLocal  = 0;

    const firstLen = Math.min(firstAt, depth);
    segments.push({ xPos, zCenter: -depth / 2 + firstLen / 2, segLen: firstLen });
    zLocal += firstLen;

    if (zLocal < depth - 0.001) joints.push({ xPos, zAbs: -depth / 2 + zLocal });

    while (zLocal < depth - 0.001) {
      const rawLen = Math.min(JOIST_LEN, depth - zLocal);
      segments.push({ xPos, zCenter: -depth / 2 + zLocal + rawLen / 2, segLen: rawLen });
      zLocal += rawLen;
      if (zLocal < depth - 0.001) joints.push({ xPos, zAbs: -depth / 2 + zLocal });
    }
  }
  return { segments, joints };
}

/* ═══════════════════════════════════════════════════════════
   SNAP DES LAMBOURDES RÉGULIÈRES SUR LES COUPES DE LAMES
   ──────────────────────────────────────────────────────────
   Principe structural (DTU 51.4) :
   Chaque coupe de lame a besoin d'un appui sous le joint. Plutôt
   que de générer une paire de doublées à côté d'une lambourde
   régulière proche (clusters serrés, 10-15 cm d'écart, inutiles
   structurellement), on DÉCALE la régulière pour qu'elle passe
   EXACTEMENT sous la coupe, puis on redistribue uniformément les
   lambourdes voisines entre ancres (rives + lambourdes snappées).

   Règles :
   1. Les lambourdes de rive (index 0 et dernier) sont des ancres
      fixes — jamais déplacées.
   2. Une coupe "capte" la lambourde intérieure non-ancrée la plus
      proche, si dist ≤ SNAP_THRESHOLD.
   3. Après snap+redistribution, l'entraxe max doit rester
      ≤ MAX_ENTRAXE_AFTER_SNAP (0.50 m — portée acceptable pour
      lame 28 mm selon DTU 51.4).
   4. Si la contrainte d'entraxe est violée, le snap est refusé →
      la coupe gardera une paire de doublées classique.
   5. Les coupes sont traitées dans l'ordre croissant.

   @param  {number[]} joistXPositions  Positions uniformes initiales
   @param  {number[]} cutXPositions    Positions des coupes de lames
   @returns {number[]}                 Positions ajustées (même longueur)
═══════════════════════════════════════════════════════════ */

/** Distance max acceptée entre une coupe et la lambourde candidate au snap. */
const SNAP_THRESHOLD = 0.22;   // 22 cm

/** Entraxe max toléré après redistribution (DTU 51.4 — lame 28 mm). */
const MAX_ENTRAXE_AFTER_SNAP = 0.50;   // 50 cm

function redistributeInterval(positions, i1, i2) {
  const segments = i2 - i1;
  if (segments < 2) return;                                        // rien à lisser
  const x1 = positions[i1];
  const x2 = positions[i2];
  for (let k = 1; k < segments; k++) {
    positions[i1 + k] = x1 + (k / segments) * (x2 - x1);
  }
}

function maxEntraxe(positions) {
  let max = 0;
  for (let i = 1; i < positions.length; i++) {
    const d = positions[i] - positions[i - 1];
    if (d > max) max = d;
  }
  return max;
}

function findLeftAnchor(anchored, idx) {
  let i = idx - 1;
  while (i > 0 && !anchored[i]) i--;
  return i;
}

function findRightAnchor(anchored, idx) {
  let i = idx + 1;
  while (i < anchored.length - 1 && !anchored[i]) i++;
  return i;
}

export function snapJoistsToCuts(joistXPositions, cutXPositions) {
  const n = joistXPositions.length;
  if (n < 3 || !cutXPositions || cutXPositions.length === 0) {
    return [...joistXPositions];
  }

  const positions = [...joistXPositions];
  const anchored  = new Array(n).fill(false);
  anchored[0]     = true;
  anchored[n - 1] = true;

  const sortedCuts = [...cutXPositions].sort((a, b) => a - b);

  for (const xCut of sortedCuts) {
    /* ── Trouver la lambourde intérieure non-ancrée la plus proche ── */
    let bestIdx  = -1;
    let bestDist = Infinity;
    for (let i = 1; i < n - 1; i++) {
      if (anchored[i]) continue;
      const d = Math.abs(positions[i] - xCut);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    if (bestIdx === -1 || bestDist > SNAP_THRESHOLD) continue;

    /* ── Simuler le snap + redistribution ── */
    const simulated = [...positions];
    simulated[bestIdx] = xCut;
    const left  = findLeftAnchor(anchored, bestIdx);
    const right = findRightAnchor(anchored, bestIdx);
    redistributeInterval(simulated, left, bestIdx);
    redistributeInterval(simulated, bestIdx, right);

    /* ── Accepter uniquement si l'entraxe max reste conforme ── */
    if (maxEntraxe(simulated) <= MAX_ENTRAXE_AFTER_SNAP) {
      for (let i = 0; i < n; i++) positions[i] = simulated[i];
      anchored[bestIdx] = true;
    }
  }
  return positions;
}

/* ═══════════════════════════════════════════════════════════
   POSITIONS X DES COUPES DE LAMES
   ──────────────────────────────────────────────────────────
   Retourne les positions X monde de chaque coupe de lame
   qui tombe à l'intérieur de la structure (hors lambourdes de rive).
   Utilisé pour positionner les doubles lambourdes.
   @param  {number} width
   @param  {number} depth
   @returns {number[]}
═══════════════════════════════════════════════════════════ */
export function findCutXPositions(width, depth) {
  const effW     = width + 2 * BOARD_OVERHANG;
  const step     = BOARD_WIDTH + BOARD_GAP;
  const rowCount = Math.min(Math.floor(depth / step) + 1, MAX_BOARD_ROWS);
  const cutXSet  = new Set();

  for (let row = 0; row < rowCount; row++) {
    const isOdd       = row % 2 === 1;
    const firstCutLoc = isOdd ? BOARD_LEN / 2 : BOARD_LEN;
    for (let xl = firstCutLoc; xl < effW - 0.001; xl += BOARD_LEN) {
      const worldX = Math.round((-effW / 2 + xl) * 1000) / 1000;
      /* Garder uniquement les coupes entre les lambourdes de rive */
      if (worldX > -width / 2 + JOIST_W && worldX < width / 2 - JOIST_W) {
        cutXSet.add(worldX);
      }
    }
  }
  return [...cutXSet];
}

/* ═══════════════════════════════════════════════════════════
   DOUBLES LAMBOURDES — DTU 51.4 (3D)
   ──────────────────────────────────────────────────────────
   Principe : paire complète à chaque coupe (solution
   traditionnelle du charpentier). Priorité à la réalité
   structurelle sur l'économie de matière.

   À chaque position de coupe de lame, on pose une paire à
   xCoupe ± JOIST_W/2. Deux règles de suppression — et UNIQUEMENT
   deux — toutes deux liées à la géométrie physique, jamais à
   une "coverage assumée" :

   Règle 1 — Corps : si la coupe tombe dans le corps d'une
   lambourde régulière (|xj−xCoupe| < JOIST_W/2), la régulière
   est centrée sous le joint → chaque about de lame a son appui
   (bearing ≥ JOIST_W/2) → aucune pièce supplémentaire.

   Règle 2 — Collision physique : si le placement d'un côté
   de la paire entrerait en collision avec une régulière
   (|xj−xPaire| < JOIST_W = chevauchement des sections 45 mm),
   ce côté est omis — la régulière joue le rôle de ce côté de
   paire. Dans ce cas, le cantilever de la lame au-delà de la
   régulière reste ≤ JOIST_W/2 = 22,5 mm (dans les tolérances
   DTU pour une lame 28 mm).

   Dans tous les autres cas : PAIRE COMPLÈTE.

   @param  {number}   width
   @param  {number}   depth
   @param  {number[]} joistXPositions  Positions X monde des lambourdes régulières
   @returns {Array<{xPos:number, zCenter:number, segLen:number}>}
═══════════════════════════════════════════════════════════ */

/** Seuil de collision physique : une régulière "remplace" un côté de paire
 *  UNIQUEMENT si sa section chevaucherait physiquement celle de la paire
 *  (distance centres < JOIST_W = 45 mm = somme des demi-sections). Jamais
 *  de suppression pour "coverage assumée" : au-delà de ce seuil, la paire
 *  est toujours posée complète — c'est la solution traditionnelle et la
 *  seule qui garantit un appui direct sous chaque about de lame. */
const COVER_THRESH = JOIST_W;   // 4,5 cm — collision physique uniquement

/** Génère les segments d'une colonne de lambourde à position xPos sur toute la profondeur. */
function makeJoistColumn(xPos, depth) {
  const segs = [];
  let zLocal = 0;
  while (zLocal < depth - 0.001) {
    const segLen = Math.min(JOIST_LEN, depth - zLocal);
    segs.push({ xPos, zCenter: -depth / 2 + zLocal + segLen / 2, segLen });
    zLocal += segLen;
  }
  return segs;
}

export function buildDoubleJoistSegs(width, depth, joistXPositions = []) {
  const cutXPositions = findCutXPositions(width, depth);
  const segs = [];

  cutXPositions.forEach(xCut => {
    // Règle 1 — Corps : coupe dans le corps d'une lambourde existante → déjà couverte
    const cutInBody = joistXPositions.some(xj => Math.abs(xj - xCut) < JOIST_W / 2);
    if (cutInBody) return;

    const xL = xCut - JOIST_W / 2;
    const xR = xCut + JOIST_W / 2;

    // Règle 2 — Côté gauche : une lambourde à gauche de la coupe couvre xL
    const skipLeft = joistXPositions.some(
      xj => xj <= xCut && Math.abs(xj - xL) < COVER_THRESH,
    );
    // Règle 3 — Côté droit : une lambourde à droite de la coupe couvre xR
    const skipRight = joistXPositions.some(
      xj => xj >= xCut && Math.abs(xj - xR) < COVER_THRESH,
    );

    if (!skipLeft)  segs.push(...makeJoistColumn(xL, depth));
    if (!skipRight) segs.push(...makeJoistColumn(xR, depth));
  });

  return segs;
}

/* ═══════════════════════════════════════════════════════════
   ENTRETOISES — lignes continues (DTU 51.4)
   ──────────────────────────────────────────────────────────
   PRINCIPE STRUCTURAL :
     Le nombre de lignes et leur espacement dépendent de la LARGEUR
     (portée des lambourdes — longueur entre supports).
     Les positions sont calculées sur l'axe de la portée (width),
     puis mappées sur l'axe Z (profondeur) du repère monde.

   CALCUL DU NOMBRE DE LIGNES :
     span     = width  (portée des lambourdes)
     rowCount = floor(span / ENTR_SPACING)
     rowCount = 1 si span < 2 m
     rowCount = 0 si span < ENTR_SPACING  (pas d'entretoise)

   POSITIONNEMENT (axe de la portée → Z monde) :
     spacing    = span / (rowCount + 1)         ← espacement basé sur la portée
     xPos[i]    = i × spacing                   ← position locale 0…span
     zPos[i]    = −span/2 + xPos[i]             ← centré sur le repère monde
     (lignes hors de [−depth/2, +depth/2] ignorées)

   @param  {number}   width           Largeur de la terrasse en m (portée)
   @param  {number}   depth           Profondeur de la terrasse en m
   @param  {number[]} joistXPositions Positions X monde des lambourdes (triées ASC)
   @returns {Array<{xCenter:number, zPos:number, segLen:number}>}
═══════════════════════════════════════════════════════════ */
export function buildEntretoises(width, depth, joistXPositions) {
  if (joistXPositions.length < 2) return [];

  /* ── Nombre de lignes basé sur la portée (largeur) ── */
  let rowCount;
  if (width < ENTR_SPACING) {
    rowCount = 0;                                 // < 1.5 m : aucune entretoise
  } else if (width < 2) {
    rowCount = 1;                                 // 1.5–2 m : 1 ligne
  } else {
    rowCount = Math.floor(width / ENTR_SPACING);  // ≥ 2 m   : 1 ligne / 1.5 m
  }

  if (rowCount === 0) return [];

  /* ── Positions Z dérivées de l'espacement sur la portée ── */
  const span    = width;
  const spacing = span / (rowCount + 1);   // espacement sur l'axe de la portée
  const halfZ   = depth / 2;
  const items   = [];

  for (let i = 1; i <= rowCount; i++) {
    /* Même zPos pour toutes les entretoises de cette ligne */
    const zPos = -span / 2 + i * spacing;

    /* Ignorer les lignes hors de la profondeur réelle du plancher */
    if (zPos < -halfZ || zPos > halfZ) continue;

    /* Chaque paire de lambourdes adjacentes → ligne continue */
    for (let j = 0; j < joistXPositions.length - 1; j++) {
      const x1     = joistXPositions[j];
      const x2     = joistXPositions[j + 1];
      const segLen = x2 - x1 - JOIST_W;   // clair entre faces intérieures
      if (segLen > 0.01) {
        items.push({ xCenter: (x1 + x2) / 2, zPos, segLen });
      }
    }
  }
  return items;
}

/* ═══════════════════════════════════════════════════════════
   POSITIONS DES PLOTS
   ──────────────────────────────────────────────────────────
   Grille régulière : un plot sous chaque lambourde × plotRows
   + plots extra sous chaque jonction de lambourde.
   @param  {number}                       width
   @param  {number}                       depth
   @param  {number}                       joistCount
   @param  {number}                       plotRows
   @param  {Array<{xPos:number, zAbs:number}>} joistJoints
   @param  {number[]|null}                joistXPositions  (optionnel) positions X
                                          réelles (snappées) ; si null, grille uniforme.
   @returns {Array<{x:number, z:number}>}
═══════════════════════════════════════════════════════════ */
export function buildPadPositions(
  width, depth, joistCount, plotRows, joistJoints, joistXPositions = null,
) {
  const colSpan   = Math.max(joistCount - 1, 1);
  const rowSpan   = Math.max(plotRows   - 1, 1);
  const positions = joistXPositions ?? Array.from(
    { length: joistCount },
    (_, c) => -width / 2 + (c / colSpan) * width,
  );
  const pts       = [];

  for (let r = 0; r < plotRows; r++) {
    for (let c = 0; c < joistCount; c++) {
      pts.push({
        x: positions[c],
        z: -depth / 2 + (r / rowSpan) * depth,
      });
    }
  }
  joistJoints.forEach(j => pts.push({ x: j.xPos, z: j.zAbs }));
  return pts;
}
