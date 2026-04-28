/**
 * buildTerrasseSectionView.js — Coupe transversale terrasse
 *
 * Schéma fixe (pas de données engine dynamiques sauf foundationType).
 * Montre l'empilement : lames → lambourde → plot → sol.
 *
 * Échelle ~1:4 fixe (SC=0.28 mm/mm réel)
 * Dimensions réelles des sections en mm.
 *
 * Entrée  : { width, joistCount, foundationType, thicknessCm }
 * Sortie  : { layers, meta }
 */
import {
  createLayers, line, rect, text, dimension, addPrimitives,
} from './primitives.js';
import { MAT } from './palette.js';

/* ── Constantes de section (mm réels) ── */
const SC  = 0.28;       // échelle mm réel → mm écran
const BW  = 145 * SC;   // largeur lame
const BT  = 28  * SC;   // épaisseur lame
const BG  = 3   * SC;   // jeu entre lames
const JW  = 45  * SC;   // largeur lambourde
const JH  = 70  * SC;   // hauteur lambourde
const PW  = 200 * SC;   // largeur plot
const PH  = 60  * SC;   // hauteur plot

const N_BOARDS = 3;      // nombre de lames montrées
const TOTAL_BW = N_BOARDS * BW + (N_BOARDS - 1) * BG;

/**
 * @param {object} params
 * @param {number} params.width         Largeur terrasse (m) — pour texte info
 * @param {number} params.joistCount    Nombre de lambourdes — pour texte info
 * @param {string} params.foundationType  'slab' | 'pads'
 * @param {number} params.thicknessCm  Épaisseur dalle (cm) si slab
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, meta }}
 */
export function buildTerrasseSectionView(params, viewport) {
  const { width, joistCount, foundationType, thicknessCm } = params;
  const isSlab = foundationType === 'slab';

  const { ox, oy } = viewport;
  const cx = ox + 62;   // centre horizontal de la coupe

  const layers = createLayers();

  /* ── Positions verticales (empilement de haut en bas) ── */
  const boardY  = oy;
  const joistY  = boardY + BT;
  const padY    = joistY + JH;
  const groundY = padY + PH;

  const bx0 = cx - TOTAL_BW / 2;
  const jx  = cx - JW / 2;
  const px  = cx - PW / 2;

  /* ── 1. Sol / Dalle ── */
  if (isSlab) {
    // Dalle béton — rectangle + hachures croisées
    addPrimitives(layers, [
      rect('background', ox - 62, groundY, 200, 10,
        { fill: MAT.beton.fill, stroke: MAT.beton.stroke, lineWidth: 0.3 }),
    ]);
    // Hachures verticales
    for (let hx = ox - 60; hx < ox + 138; hx += 7) {
      addPrimitives(layers, [
        line('background', hx, groundY + 1, hx, groundY + 9,
          { stroke: [140, 145, 160], lineWidth: 0.15 }),
      ]);
    }
    // Hachures horizontales
    for (let hy = groundY + 3; hy < groundY + 9; hy += 3) {
      addPrimitives(layers, [
        line('background', ox - 62, hy, ox + 138, hy,
          { stroke: [140, 145, 160], lineWidth: 0.15 }),
      ]);
    }
  } else {
    // Sol naturel — rectangle + diagonales
    addPrimitives(layers, [
      rect('background', ox - 62, groundY, 200, 6,
        { fill: MAT.sol.fill, stroke: MAT.sol.stroke, lineWidth: 0.18 }),
    ]);
    for (let hx = ox - 62; hx < ox + 138; hx += 5) {
      addPrimitives(layers, [
        line('background', hx, groundY, Math.min(hx + 4, ox + 138), groundY + 3,
          { stroke: [160, 140, 110], lineWidth: 0.18 }),
      ]);
    }
  }

  /* ── 2. Plot ── */
  addPrimitives(layers, [
    rect('structurePrimary', px, padY, PW, PH,
      { fill: MAT.beton.fill, stroke: MAT.beton.stroke, lineWidth: 0.35 }),
  ]);
  // Détails décoratifs du plot (points latéraux)
  addPrimitives(layers, [
    rect('structurePrimary', px + 3, padY + PH / 2 - 1, 2.5, 2.5,
      { fill: [120, 120, 120], stroke: [90, 90, 90], lineWidth: 0.2 }),
    rect('structurePrimary', px + PW - 5.5, padY + PH / 2 - 1, 2.5, 2.5,
      { fill: [120, 120, 120], stroke: [90, 90, 90], lineWidth: 0.2 }),
  ]);

  /* ── 2b. Bande bitume (isolant plot/lambourde) ── */
  const BITUMEN_H = 4 * SC;  // 4 mm réel
  addPrimitives(layers, [
    rect('structureSecondary', jx - 2, padY - BITUMEN_H, JW + 4, BITUMEN_H,
      { fill: [50, 50, 55], stroke: [30, 30, 35], lineWidth: 0.2 }),
  ]);

  /* ── 3. Lambourde ── */
  addPrimitives(layers, [
    rect('structurePrimary', jx, joistY, JW, JH,
      { fill: MAT.chevron.fill, stroke: MAT.chevron.stroke, lineWidth: 0.35 }),
  ]);
  // Veines du bois
  for (let g = 1; g <= 4; g++) {
    addPrimitives(layers, [
      line('structurePrimary', jx + 1, joistY + JH * g / 5, jx + JW - 1, joistY + JH * g / 5,
        { stroke: [200, 160, 90], lineWidth: 0.1 }),
    ]);
  }

  /* ── 4. Lames (3 lames avec jeu) ── */
  for (let i = 0; i < N_BOARDS; i++) {
    const bx = bx0 + i * (BW + BG);
    addPrimitives(layers, [
      rect('structureSecondary', bx, boardY, BW, BT,
        { fill: MAT.bardage.fill, stroke: MAT.bardage.stroke, lineWidth: 0.3 }),
    ]);
    // Grain intérieur
    addPrimitives(layers, [
      line('structureSecondary', bx + 2, boardY + BT * 0.33, bx + BW - 2, boardY + BT * 0.33,
        { stroke: [205, 158, 90], lineWidth: 0.1 }),
      line('structureSecondary', bx + 2, boardY + BT * 0.66, bx + BW - 2, boardY + BT * 0.66,
        { stroke: [205, 158, 90], lineWidth: 0.1 }),
    ]);
  }

  /* ── 5. Vis de fixation ── */
  addPrimitives(layers, [
    line('framings', cx, boardY + BT, cx, joistY + JH * 0.5,
      { stroke: [60, 60, 60], lineWidth: 0.3 }),
  ]);

  /* ── 6. Tige réglage plot ── */
  addPrimitives(layers, [
    line('framings', cx, padY, cx, padY - 2,
      { stroke: [90, 90, 90], lineWidth: 0.4 }),
  ]);

  /* ── 7. Labels latéraux (annotations) ── */
  const lx = ox + 133;
  const labelStroke = [160, 160, 160];

  function addElementLabel(rightEdgeX, midY, title, subtitle) {
    // Ligne pointillée
    addPrimitives(layers, [
      line('labels', rightEdgeX + 1, midY, lx - 2, midY,
        { stroke: labelStroke, lineWidth: 0.2, dash: [1, 1.2] }),
    ]);
    // Titre
    addPrimitives(layers, [
      text('labels', lx, midY - 2, title,
        { fontSize: 8.5, fontWeight: 'bold', color: [20, 25, 30] }),
    ]);
    // Sous-titre
    addPrimitives(layers, [
      text('labels', lx, midY + 3.5, subtitle,
        { fontSize: 7.5, color: [80, 85, 90] }),
    ]);
  }

  addElementLabel(bx0 + TOTAL_BW, boardY + BT / 2, 'Lame terrasse', '145 × 28 mm');
  addElementLabel(jx + JW,        joistY + JH / 2, 'Lambourde',     '45 × 70 mm');
  addElementLabel(jx + JW + 2,    padY - BITUMEN_H / 2, 'Bande bitume',  'isolant 4 mm');
  addElementLabel(px + PW,        padY + PH / 2,   'Plot réglable', '200 × 60 mm');

  /* ── 8. Label sol/dalle ── */
  if (isSlab) {
    addPrimitives(layers, [
      text('labels', ox - 62, groundY + 8,
        `Dalle beton - ${thicknessCm} cm`,
        { fontSize: 8, fontStyle: 'italic', color: [70, 75, 100] }),
    ]);
  } else {
    addPrimitives(layers, [
      text('labels', ox - 62, groundY + 5,
        'Sol naturel',
        { fontSize: 8, fontStyle: 'italic', color: [110, 85, 50] }),
    ]);
  }

  /* ── 9. Cotations (dimensions en mm) ── */
  // Largeur lame
  addPrimitives(layers, [
    dimension('dimensions', 'h', bx0, bx0 + BW, boardY - 5,
      '145 mm', { fontSize: 5.5 }),
  ]);
  // Jeu inter-lames
  addPrimitives(layers, [
    text('dimensions', bx0 + BW + BG / 2, boardY - 1.5,
      '3 mm', { fontSize: 5.5, align: 'center', color: [120, 120, 120] }),
  ]);
  // Largeur lambourde
  addPrimitives(layers, [
    dimension('dimensions', 'h', jx, jx + JW, padY + PH + 8,
      '45 mm', { fontSize: 5.5 }),
  ]);
  // Largeur plot
  addPrimitives(layers, [
    dimension('dimensions', 'h', px, px + PW, padY + PH + 14.5,
      '200 mm', { fontSize: 5.5 }),
  ]);
  // Hauteurs verticales
  addPrimitives(layers, [
    dimension('dimensions', 'v', boardY, joistY, ox - 64,
      '28 mm', { fontSize: 5.5 }),
    dimension('dimensions', 'v', joistY, padY, ox - 68,
      '70 mm', { fontSize: 5.5 }),
    dimension('dimensions', 'v', padY, groundY, ox - 72,
      '60 mm', { fontSize: 5.5 }),
  ]);

  return {
    layers,
    meta: { width, joistCount, foundationType, thicknessCm, isSlab },
  };
}
