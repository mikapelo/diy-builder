/**
 * buildTerrasseTopView.js — Plan de structure / plan de pose terrasse
 *
 * Projection : x monde → x écran, y (profondeur) → y écran (vers le bas)
 *
 * HIÉRARCHIE GRAPHIQUE (plan constructif, pas vue de platelage fini) :
 *   1er plan : plots (cercles pleins, contour fort)
 *   2e plan  : lambourdes + doubles lambourdes (rects opaques, trait moyen)
 *   3e plan  : entretoises, coupes, jonctions (rects + tirets)
 *   Fond     : lames en fantôme très léger (contour fin, pas de fill)
 *
 * Les coordonnées engine (generateDeck) sont centrées sur (0,0).
 * Ce builder décale de (+width/2, +depth/2) pour ramener l'origine au coin.
 *
 * Entrée  : deckData (résultat de generateDeck), dims { width, depth }
 * Sortie  : { layers, proj, meta }
 */
import {
  createLayers, line, rect, circle, text, dimension, addPrimitives,
} from './primitives.js';
import { fitScale, topProjection } from './projections.js';
import { MAT, PLAN_BG } from './palette.js';
import { staggerEntretoises } from '../deckStagger.js';

/* ── Constantes de section pour le rendu (import interdit de deckConstants) ── */
const BOARD_W_M = 0.145;   // largeur lame (m) — lecture seule, pas de calcul
const JOIST_W_M = 0.045;   // largeur lambourde (m)
const PAD_R_M   = 0.100;   // rayon plot (m) — diamètre 200mm

/**
 * @param {object} deckData  Résultat de generateDeck(width, depth)
 * @param {object} dims      { width, depth } en mètres
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildTerrasseTopView(deckData, dims, viewport) {
  const { width, depth } = dims;
  const {
    boardSegs, joistSegs, cutXPositions, doubleJoistSegs,
    entretoiseSegs, padPositions, joistJoints,
    joistCount, plotRows,
  } = deckData;

  /* ── Décalage engine (0,0 centre) → builder (0,0 coin) ── */
  const hw = width / 2;
  const hd = depth / 2;

  const { ox, oy, drawW, drawH } = viewport;
  const sc = fitScale(width, depth, drawW, drawH);
  const projOx = ox + (drawW - width * sc) / 2;
  const proj = topProjection(projOx, oy, sc);
  const { px, py } = proj;

  const layers = createLayers();

  /* ── Sections en mm écran (min lisibles) ── */
  const boardWmm = Math.max(BOARD_W_M * sc, 0.8);
  const joistWmm = Math.max(JOIST_W_M * sc, 0.7);
  const padRmm   = Math.min(Math.max(PAD_R_M * sc, 1.8), 4.0);

  /* ── 1. Fond terrasse ── */
  addPrimitives(layers, [
    rect('background', px(0), py(0), width * sc, depth * sc,
      { fill: PLAN_BG, stroke: [215, 208, 195], lineWidth: 0.12 }),
  ]);

  /* ── 2. Lames — fantôme discret (fond, pas de fill, trait très fin) ── */
  if (boardSegs) {
    boardSegs.forEach(seg => {
      const wx = seg.xCenter + hw - seg.segLen / 2;
      const wz = seg.zCenter + hd - BOARD_W_M / 2;
      const segW = seg.segLen;
      addPrimitives(layers, [
        rect('background',
          px(wx), py(wz), segW * sc, boardWmm,
          { stroke: [185, 170, 148], lineWidth: 0.15 }),
      ]);
    });
  }

  /* ── 3. Lambourdes régulières — structure porteuse principale ── */
  if (joistSegs) {
    const xSet = new Set();
    joistSegs.forEach(s => xSet.add(+(s.xPos).toFixed(6)));
    xSet.forEach(xPos => {
      const wx = xPos + hw;
      addPrimitives(layers, [
        rect('structurePrimary',
          px(wx) - joistWmm / 2, py(0), joistWmm, depth * sc,
          { fill: MAT.chevron.fill, stroke: MAT.chevron.stroke, lineWidth: 0.5 }),
      ]);
    });
  }

  /* ── 4. Doubles lambourdes (aux coupes) — accentuées ── */
  if (doubleJoistSegs) {
    const dxSet = new Set();
    doubleJoistSegs.forEach(s => dxSet.add(+(s.xPos).toFixed(6)));
    dxSet.forEach(xPos => {
      const wx = xPos + hw;
      addPrimitives(layers, [
        rect('structurePrimary',
          px(wx) - joistWmm / 2, py(0), joistWmm, depth * sc,
          { fill: [100, 75, 40], stroke: [60, 40, 15], lineWidth: 0.4 }),
      ]);
    });
  }

  /* ── 5. Lignes de coupe (tirets verticaux) ── */
  if (cutXPositions) {
    cutXPositions.forEach(xCut => {
      const wx = xCut + hw;
      addPrimitives(layers, [
        line('framings', px(wx), py(0), px(wx), py(depth),
          { stroke: [150, 90, 40], lineWidth: 0.35, dash: [1.5, 1] }),
      ]);
    });
  }

  /* ── 6. Jonctions lambourdes (tirets horizontaux) ── */
  if (joistJoints) {
    const zSet = new Set();
    joistJoints.forEach(j => zSet.add(+(j.zAbs).toFixed(3)));
    zSet.forEach(zAbs => {
      const wz = zAbs + hd;
      addPrimitives(layers, [
        line('framings', px(0), py(wz), px(width), py(wz),
          { stroke: [90, 60, 30], lineWidth: 0.3, dash: [2, 1.5] }),
      ]);
    });
  }

  /* ── 7. Entretoises en quinconce (décalage DTU — clouage en bout) ── */
  if (entretoiseSegs) {
    const staggered = staggerEntretoises(entretoiseSegs, JOIST_W_M);
    staggered.forEach(e => {
      const wx = e.xCenter + hw - e.segLen / 2;
      const wz = e.zPos + hd;
      addPrimitives(layers, [
        rect('structurePrimary',
          px(wx), py(wz) - joistWmm / 2, e.segLen * sc, joistWmm,
          { fill: MAT.lisse.fill, stroke: MAT.lisse.stroke, lineWidth: 0.5 }),
      ]);
    });
  }

  /* ── 8. Plots ── */
  if (padPositions) {
    padPositions.forEach(p => {
      const wx = p.x + hw;
      const wz = p.z + hd;
      addPrimitives(layers, [
        circle('structurePrimary', px(wx), py(wz), padRmm,
          { fill: MAT.beton.fill, stroke: MAT.beton.stroke, lineWidth: 0.5 }),
      ]);
    });
  }

  /* ── 9. Contour (outline) ── */
  addPrimitives(layers, [
    rect('outline', px(0), py(0), width * sc, depth * sc,
      { stroke: MAT.contour.stroke, lineWidth: 0.6 }),
  ]);

  /* ── 10. Cotations ── */
  // Largeur
  addPrimitives(layers, [
    dimension('dimensions', 'h', px(0), px(width), py(depth) + 10,
      `${width.toFixed(2)} m`, { fontSize: 7 }),
  ]);
  // Profondeur
  addPrimitives(layers, [
    dimension('dimensions', 'v', py(0), py(depth), px(0) - 12,
      `${depth.toFixed(2)} m`, { fontSize: 6.5 }),
  ]);
  // Entraxe lambourdes
  if (joistCount >= 2) {
    const entrCm = Math.round(width / (joistCount - 1) * 100);
    // Positions des 2 premières lambourdes
    const j0x = px(0);             // première lambourde au bord
    const j1x = px(width / (joistCount - 1));
    addPrimitives(layers, [
      dimension('dimensions', 'h', j0x, j1x, py(0) - 6,
        `e=${entrCm} cm`, { fontSize: 5, stroke: [150, 100, 30] }),
    ]);
  }
  // Débord lames (cantilever DTU 51.4)
  addPrimitives(layers, [
    text('labels', px(0) - 3, py(depth / 2),
      'Débord 12 mm',
      { fontSize: 5, color: [120, 100, 60], align: 'right', fontStyle: 'italic' }),
  ]);

  // Entraxe plots
  if (plotRows >= 2) {
    const pEntrCm = Math.round(depth / (plotRows - 1) * 100);
    addPrimitives(layers, [
      dimension('dimensions', 'v', py(0), py(depth / (plotRows - 1)), px(width) + 12,
        `e=${pEntrCm} cm`, { fontSize: 5, stroke: [28, 110, 55] }),
    ]);
  }

  /* ── 11. Labels d'orientation ── */
  addPrimitives(layers, [
    text('labels', px(width / 2), py(0) - 18, 'JONCTION MAISON',
      { fontSize: 7, fontWeight: 'bold', color: [25, 25, 42], align: 'center' }),
    text('labels', px(width / 2), py(depth) + 18, 'FAÇADE',
      { fontSize: 6, color: [90, 100, 118], align: 'center' }),
    text('labels', px(0) - 8, py(depth / 2), 'GAUCHE',
      { fontSize: 5.5, color: [90, 100, 118], align: 'center' }),
    text('labels', px(width) + 8, py(depth / 2), 'DROITE',
      { fontSize: 5.5, color: [90, 100, 118], align: 'center' }),
  ]);

  /* ── 12. Surface ── */
  addPrimitives(layers, [
    text('labels', px(width / 2), py(depth / 2) + 2,
      `${(width * depth).toFixed(2)} m²`,
      { fontSize: 8, color: [120, 130, 148], align: 'center', fontStyle: 'italic' }),
  ]);

  return {
    layers,
    proj,
    meta: { width, depth, joistCount, plotRows },
  };
}
