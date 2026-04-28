/**
 * deckEngine.js — Moteur de calcul DTU 51.4 centralisé
 *
 * Point d'entrée unique pour tous les calculs structurels du simulateur.
 * Wrap les fonctions de deckGeometry.js et retourne un objet complet.
 *
 * Usage :
 *   const deck = generateDeck(width, depth);
 *   // → accès à deck.joistCount, deck.boardSegs, deck.padPositions…
 */

import {
  JOIST_ENTRAXE,
  PAD_ENTRAXE,
  ENTR_SPACING,
  BOARD_LEN,
  JOIST_LEN,
} from './deckConstants.js';

import {
  computeJoistCount,
  computePlotRows,
  buildBoardSegments,
  buildJoistData,
  findCutXPositions,
  buildDoubleJoistSegs,
  buildEntretoises,
  buildPadPositions,
  snapJoistsToCuts,
} from './deckGeometry.js';

/* ════════════════════════════════════════════════════════════
   CONSTANTES DTU EXPOSÉES — pour les consommateurs qui ont
   besoin des espacements de référence (affichage, validation)
════════════════════════════════════════════════════════════ */
export const DTU = {
  JOIST_SPACING:   JOIST_ENTRAXE,    // 0.40 m  — entraxe lambourdes
  PLOT_SPACING:    PAD_ENTRAXE,      // 0.60 m  — entraxe plots
  BLOCKING_MAX:    ENTR_SPACING,     // 1.50 m  — espacement max entretoises
  BOARD_LENGTH:    BOARD_LEN,        // m       — longueur standard lame (3.0 m)
  JOIST_LENGTH:    JOIST_LEN,        // m       — longueur standard lambourde
};

/* ════════════════════════════════════════════════════════════
   MOTEUR PRINCIPAL
   ─────────────────────────────────────────────────────────
   Calcule intégralement la structure à partir des dimensions.
   Toutes les valeurs dérivées sont calculées ici — aucun
   composant ne doit redériver lui-même ces données.
════════════════════════════════════════════════════════════ */

/**
 * Génère la structure complète d'une terrasse DTU 51.4.
 *
 * @param {number} width  Largeur en mètres (axe X)
 * @param {number} depth  Profondeur en mètres (axe Z)
 * @returns {{
 *   joistCount:      number,
 *   plotRows:        number,
 *   totalPads:       number,
 *   nbRangees:       number,
 *   traveeLen:       number,
 *   boardSegs:       Array<{xCenter:number, zCenter:number, segLen:number}>,
 *   boardRows:       Array<{zCenter:number, segs:Array}>,
 *   joistSegs:       Array<{xPos:number, zCenter:number, segLen:number}>,
 *   joistJoints:     Array<{xPos:number, zAbs:number}>,
 *   joistXPositions: number[],
 *   joistJointZs:    number[],
 *   cutXPositions:   number[],
 *   doubleJoistSegs: Array<{xPos:number, zCenter:number, segLen:number}>,
 *   entretoiseSegs:  Array<{xCenter:number, zPos:number, segLen:number}>,
 *   padPositions:    Array<{x:number, z:number}>,
 * }}
 */
export function generateDeck(width, depth) {
  /* ── Comptages DTU ── */
  const joistCount = computeJoistCount(width);
  const plotRows   = computePlotRows(depth);

  /* ── Positions X uniformes initiales ── */
  const joistSpan     = Math.max(joistCount - 1, 1);
  const uniformJoistX = Array.from(
    { length: joistCount },
    (_, col) => -width / 2 + (col / joistSpan) * width,
  );

  /* ── Coupes de lames (indépendant des lambourdes) ── */
  const boardSegs     = buildBoardSegments(width, depth);
  const cutXPositions = findCutXPositions(width, depth);

  /* ── Snap : décaler les lambourdes régulières sous les coupes captables
     (DTU 51.4). Les rives restent fixes, entraxe max garanti ≤ 0.50 m.
     Les coupes non captables garderont une paire de doublées classique. ── */
  const joistXPositions = snapJoistsToCuts(uniformJoistX, cutXPositions);

  /* ── Géométrie brute (consomme les positions snappées) ── */
  const { segments: joistSegs,
          joints:   joistJoints }           = buildJoistData(width, depth, joistCount, joistXPositions);
  const doubleJoistSegs                     = buildDoubleJoistSegs(width, depth, joistXPositions);
  const entretoiseSegs                      = buildEntretoises(width, depth, joistXPositions);
  const padPositions                        = buildPadPositions(
                                               width, depth, joistCount, plotRows, joistJoints, joistXPositions);

  /* ── Totaux ── */
  const totalPads = padPositions.length;

  /* ── Rangées d'entretoises (info texte — reflète buildEntretoises) ── */
  const nbRangees = width < DTU.BLOCKING_MAX ? 0
                  : width < 2               ? 1
                  :                           Math.floor(width / DTU.BLOCKING_MAX);
  /* spacing basé sur la portée (width), identique à buildEntretoises */
  const spacing   = nbRangees > 0 ? width / (nbRangees + 1) : 0;
  const traveeLen = Math.round(spacing * 100);         // cm, arrondi

  /* ── Structures dérivées (TechnicalPlan + ExportPDF) ── */

  /* Lames groupées par rangée (zCenter unique) */
  const boardRowMap = new Map();
  boardSegs.forEach(seg => {
    const k = seg.zCenter.toFixed(6);
    if (!boardRowMap.has(k)) boardRowMap.set(k, { zCenter: seg.zCenter, segs: [] });
    boardRowMap.get(k).segs.push(seg);
  });
  const boardRows = [...boardRowMap.values()];

  /* joistXPositions déjà calculé plus haut — réutilisé directement */

  /* Z positions uniques des jonctions de lambourdes */
  const joistJointZSet = new Set();
  joistJoints.forEach(j => joistJointZSet.add(Math.round(j.zAbs * 1000) / 1000));
  const joistJointZs = [...joistJointZSet];

  return {
    joistCount,
    plotRows,
    totalPads,
    nbRangees,
    traveeLen,
    boardSegs,
    boardRows,
    joistSegs,
    joistJoints,
    joistXPositions,
    joistJointZs,
    cutXPositions,
    doubleJoistSegs,
    entretoiseSegs,
    padPositions,
  };
}
