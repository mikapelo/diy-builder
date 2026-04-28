/**
 * buildSectionView.js — Coupe transversale du cabanon (sens largeur)
 *
 * Vue frontale coupée montrant l'empilement structurel complet :
 * sol → lisse basse → montants → sablières → chevrons → OSB → couverture
 *
 * Projection : x monde → x écran, z monde → y écran (vers le haut)
 */
import {
  createLayers, line, rect, polygon, text, dimension, addPrimitives,
} from './primitives.js';
import { fitScale, createProjectionCtx } from './projections.js';
import { SECTION as SEC } from '@/lib/cabanonConstants.js';

/* ── Constantes structurelles (m) ─────────────────────────────────── */
const OVERHANG    = 0.20;
const BARDAGE_THK = 0.018;
const OSB_THK     = 0.012;
const ROOF_THK    = 0.025;
const CHEVRON_SEC = 0.08;
const BARDAGE_LAME_H = 0.15;   // hauteur d'une lame de bardage (m)

/* ── Palette contrastée ───────────────────────────────────────────── */
const C = {
  ground:  { fill: [222, 215, 200], stroke: [160, 148, 128] },
  shadow:  { fill: [195, 190, 178] },
  lisse:   { fill: [235, 215, 170], stroke: [110, 82, 40] },
  stud:    { fill: [175, 198, 225], stroke: [55, 82, 120] },
  ghost:   { fill: [205, 218, 232], stroke: [120, 140, 165] },
  sab1:    { fill: [230, 208, 165], stroke: [120, 90, 45] },
  sab2:    { fill: [218, 195, 152], stroke: [135, 100, 55] },
  chevron: { fill: [228, 195, 135], stroke: [155, 110, 50] },
  osb:     { fill: [242, 235, 218], stroke: [145, 125, 85] },
  roof:    { fill: [75, 82, 100],   stroke: [40, 45, 60] },
  bardage: { fill: [225, 200, 162], stroke: [155, 120, 72] },
  contour: [25, 25, 45],
};

/**
 * @param {object} geometry  geometry issue du moteur cabanon
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildSectionView(geometry, viewport) {
  const { width, depth, height, slope, plateHeight } = geometry.dimensions;
  const chevrons = geometry.chevrons ?? [];
  const roofLen = geometry.roof?.len ?? Math.sqrt(width ** 2 + slope ** 2);

  /* ── Échelle et projection ── */
  const hTotal = plateHeight + slope + ROOF_THK + OSB_THK + CHEVRON_SEC + 0.08;
  const { ox, oy, drawW, drawH } = viewport;
  const sc = fitScale(width + 0.5, hTotal + 0.15, drawW, drawH);
  const projOx = ox + (drawW - width * sc) / 2;
  const proj = createProjectionCtx(projOx, oy, sc);
  const { px, py } = proj;

  const layers = createLayers();
  const ss = Math.max(SEC * sc, 1.2);
  const hR = height + slope;

  /* ═══════════ 1. SOL + OMBRE DE CONTACT ═══════════ */
  const groundPad = 0.4;
  const gW = (width + groundPad * 2) * sc;
  const gX = px(-groundPad);
  const groundY = py(0);

  // Ombre de contact (rectangle subtil sous la structure)
  addPrimitives(layers, [
    rect('background', px(-0.05), groundY - 0.4, (width + 0.10) * sc, 1.6,
      { fill: C.shadow.fill, stroke: C.shadow.fill, lineWidth: 0 }),
  ]);

  // Sol hachuré
  addPrimitives(layers, [
    rect('background', gX, groundY, gW, 5,
      { fill: C.ground.fill, stroke: C.ground.stroke, lineWidth: 0.2 }),
  ]);
  for (let i = 0; i < gW; i += 2.2) {
    addPrimitives(layers, [
      line('background', gX + i, groundY, gX + i + 1.8, groundY + 5,
        { stroke: C.ground.stroke, lineWidth: 0.08 }),
    ]);
  }
  // Trait de sol fort
  addPrimitives(layers, [
    line('background', gX, groundY, gX + gW, groundY,
      { stroke: [110, 100, 82], lineWidth: 0.6 }),
  ]);

  /* ═══════════ 2. LISSE BASSE ═══════════ */
  addPrimitives(layers, [
    rect('structurePrimary', px(0), py(SEC), width * sc, ss,
      { fill: C.lisse.fill, stroke: C.lisse.stroke, lineWidth: 0.5 }),
  ]);

  /* ═══════════ 3. MONTANTS PRINCIPAUX ═══════════ */
  addPrimitives(layers, [
    rect('structurePrimary', px(0), py(height), ss, (height - SEC) * sc,
      { fill: C.stud.fill, stroke: C.stud.stroke, lineWidth: 0.5 }),
    rect('structurePrimary', px(width) - ss, py(hR), ss, (hR - SEC) * sc,
      { fill: C.stud.fill, stroke: C.stud.stroke, lineWidth: 0.5 }),
  ]);

  /* ═══════════ 4. MONTANTS INTERMÉDIAIRES (fantômes) ═══════════ */
  for (let u = 0.60; u < width - 0.15; u += 0.60) {
    const hAtU = height + (u / width) * slope;
    addPrimitives(layers, [
      rect('structureSecondary', px(u) - ss / 2, py(hAtU), ss, (hAtU - SEC) * sc,
        { fill: C.ghost.fill, stroke: C.ghost.stroke, lineWidth: 0.2, dash: [2.5, 1.5] }),
    ]);
  }

  /* ═══════════ 5. SABLIÈRE HAUTE ═══════════ */
  addPrimitives(layers, [
    polygon('structurePrimary', [
      [px(0), py(height)], [px(width), py(hR)],
      [px(width), py(hR + SEC)], [px(0), py(height + SEC)],
    ], { fill: C.sab1.fill, stroke: C.sab1.stroke, lineWidth: 0.5 }),
  ]);

  /* ═══════════ 6. DOUBLE SABLIÈRE ═══════════ */
  addPrimitives(layers, [
    polygon('structurePrimary', [
      [px(0), py(height + SEC)], [px(width), py(hR + SEC)],
      [px(width), py(hR + 2 * SEC)], [px(0), py(height + 2 * SEC)],
    ], { fill: C.sab2.fill, stroke: C.sab2.stroke, lineWidth: 0.4 }),
  ]);

  /* ═══════════ 7. CHEVRONS (sections coupées) ═══════════ */
  // Convention dessin technique : les chevrons courent de x1→x2 (largeur),
  // espacés le long de Y (profondeur). Cette coupe transversale les montre
  // en section. On répartit N marques uniformément sur le rampant,
  // avec N = nombre réel de chevrons issu de la géométrie.
  const cs = Math.max(CHEVRON_SEC * sc, 1.0);
  const nChev = Math.max(chevrons.length, 2);
  const chevPositions = Array.from({ length: nChev }, (_, i) => {
    const margin = 0.06;
    return margin + (1 - 2 * margin) * i / (nChev - 1);
  });
  chevPositions.forEach(t => {
    const u = t * width;
    const zAtU = plateHeight + (u / width) * slope;
    addPrimitives(layers, [
      rect('roof', px(u) - cs / 2, py(zAtU + CHEVRON_SEC), cs, cs,
        { fill: C.chevron.fill, stroke: C.chevron.stroke, lineWidth: 0.35 }),
    ]);
    // Diagonale de section coupée (convention dessin technique)
    addPrimitives(layers, [
      line('roof', px(u) - cs / 2, py(zAtU + CHEVRON_SEC),
        px(u) + cs / 2, py(zAtU + CHEVRON_SEC) - cs,
        { stroke: C.chevron.stroke, lineWidth: 0.1 }),
    ]);
  });

  /* ═══════════ 8. VOLIGES / OSB (avec hachures) ═══════════ */
  /* Le débord prolonge la même pente que les chevrons :
   * Δz = OVERHANG × slope / width. Sans ce terme, le toit n'est pas
   * parallèle à la structure (pente plus faible sur la largeur totale). */
  const ovRise = OVERHANG * slope / width;
  const osbZ = plateHeight + CHEVRON_SEC;
  const osbPoly = [
    [px(-OVERHANG), py(osbZ - ovRise)],
    [px(width + OVERHANG), py(osbZ + slope + ovRise)],
    [px(width + OVERHANG), py(osbZ + slope + ovRise + OSB_THK)],
    [px(-OVERHANG), py(osbZ - ovRise + OSB_THK)],
  ];
  addPrimitives(layers, [
    polygon('roof', osbPoly, { fill: C.osb.fill, stroke: C.osb.stroke, lineWidth: 0.4 }),
  ]);
  // Hachures diagonales pour texture OSB
  const osbLeft = px(-OVERHANG);
  const osbRight = px(width + OVERHANG);
  const osbYBase = py(osbZ - ovRise);
  const osbThkPx = Math.max(OSB_THK * sc, 0.8);
  const totalSlope = slope + 2 * ovRise;  // pente totale sur toute la largeur avec débords
  for (let hx = osbLeft; hx < osbRight; hx += 2.5) {
    const tRatio = (hx - osbLeft) / (osbRight - osbLeft);
    const localOsbY = osbYBase - tRatio * totalSlope * sc;
    addPrimitives(layers, [
      line('roof', hx, localOsbY, hx + 1.2, localOsbY - osbThkPx,
        { stroke: C.osb.stroke, lineWidth: 0.06 }),
    ]);
  }

  /* ═══════════ 9. COUVERTURE BAC ACIER (avec nervures) ═══════════ */
  const roofZ = osbZ + OSB_THK;
  const roofPoly = [
    [px(-OVERHANG), py(roofZ - ovRise)],
    [px(width + OVERHANG), py(roofZ + slope + ovRise)],
    [px(width + OVERHANG), py(roofZ + slope + ovRise + ROOF_THK)],
    [px(-OVERHANG), py(roofZ - ovRise + ROOF_THK)],
  ];
  addPrimitives(layers, [
    polygon('roof', roofPoly, { fill: C.roof.fill, stroke: C.roof.stroke, lineWidth: 0.55 }),
  ]);
  // Nervures bac acier (petits rectangles en relief)
  const roofLeft = px(-OVERHANG);
  const roofRight = px(width + OVERHANG);
  const roofSpan = roofRight - roofLeft;
  const nervureCount = Math.round(roofSpan / 3.5);
  const nervureSpacing = roofSpan / nervureCount;
  const nervureH = Math.max(ROOF_THK * sc * 0.45, 0.3);
  for (let ni = 1; ni < nervureCount; ni++) {
    const nx = roofLeft + ni * nervureSpacing;
    const tRatio = ni / nervureCount;
    const localRoofY = py(roofZ - ovRise) - tRatio * totalSlope * sc;
    addPrimitives(layers, [
      line('roof', nx, localRoofY, nx, localRoofY - nervureH,
        { stroke: [55, 62, 78], lineWidth: 0.15 }),
    ]);
  }

  /* ═══════════ 10. BARDAGE (lames horizontales) ═══════════ */
  const bardageW = Math.max(BARDAGE_THK * sc, 0.8);
  const lameH = BARDAGE_LAME_H * sc;
  const lameCount = lameH > 0.5 ? Math.max(2, Math.floor(height * sc / lameH)) : 1;
  const actualLameH = height * sc / lameCount;

  // Bardage gauche (x=0, hauteur=height)
  for (let li = 0; li < lameCount; li++) {
    const ly = groundY - (li + 1) * actualLameH;
    const lh = actualLameH - 0.15;
    addPrimitives(layers, [
      rect('structureSecondary', px(0) - bardageW, ly, bardageW, lh,
        { fill: C.bardage.fill, stroke: C.bardage.stroke, lineWidth: 0.4 }),
    ]);
  }

  // Bardage droit (x=width, hauteur=hR)
  const lameCountR = lameH > 0.5 ? Math.max(2, Math.floor(hR * sc / lameH)) : 1;
  const actualLameHR = hR * sc / lameCountR;
  for (let li = 0; li < lameCountR; li++) {
    const ly = groundY - (li + 1) * actualLameHR;
    const lh = actualLameHR - 0.15;
    addPrimitives(layers, [
      rect('structureSecondary', px(width), ly, bardageW, lh,
        { fill: C.bardage.fill, stroke: C.bardage.stroke, lineWidth: 0.4 }),
    ]);
  }

  /* ═══════════ 11. CONTOUR FORT ═══════════ */
  addPrimitives(layers, [
    line('outline', px(0), py(0), px(0), py(height),
      { stroke: C.contour, lineWidth: 0.8 }),
    line('outline', px(width), py(0), px(width), py(hR),
      { stroke: C.contour, lineWidth: 0.8 }),
    // Base
    line('outline', px(0), py(0), px(width), py(0),
      { stroke: C.contour, lineWidth: 0.6 }),
  ]);

  /* ═══════════ 12. COTATIONS ═══════════ */
  addPrimitives(layers, [
    // Largeur (sous le sol)
    dimension('dimensions', 'h', px(0), px(width), py(0) + 12,
      `${width.toFixed(2)} m`, { fontSize: 7, fontWeight: 'bold' }),
    // Hauteur gauche
    dimension('dimensions', 'v', py(0), py(height), px(0) - 14,
      `${height.toFixed(2)} m`, { fontSize: 6.5 }),
    // Hauteur droite
    dimension('dimensions', 'v', py(0), py(hR), px(width) + 14,
      `${hR.toFixed(2)} m`, { fontSize: 6.5 }),
    // Delta pente
    dimension('dimensions', 'v', py(height), py(hR), px(width) + 22,
      `+${slope.toFixed(2)} m`, { fontSize: 5.5, stroke: [160, 55, 55] }),
  ]);

  /* ── Rampant + pente (texte unique sur la toiture) ── */
  const midX = (px(0) + px(width)) / 2;
  const roofMidZ = roofZ + slope * 0.4 + ROOF_THK / 2;
  const pctSlope = (slope / width * 100).toFixed(1);
  const degSlope = (Math.atan2(slope, width) * 180 / Math.PI).toFixed(1);
  addPrimitives(layers, [
    text('labels', midX, py(roofMidZ) - 2,
      `Rampant ${roofLen.toFixed(2)} m  -  Pente ${pctSlope}% (${degSlope})`,
      { fontSize: 5, fontStyle: 'italic', color: [50, 50, 70], align: 'center' }),
  ]);

  /* ═══════════ 13. ANNOTATIONS CALLOUT ═══════════ */
  const calloutX = Math.min(px(width) + 32, ox + drawW - 38);
  const tickLen = 3;

  const rawCallouts = [
    { z: roofZ + slope + ROOF_THK / 2,          label: 'Couverture bac acier',  col: C.roof.stroke },
    { z: osbZ + slope + OSB_THK / 2,            label: 'Voliges / OSB 12 mm',   col: C.osb.stroke },
    { z: plateHeight + slope + CHEVRON_SEC / 2,  label: 'Chevrons 80x80',        col: C.chevron.stroke },
    { z: height + slope + SEC * 1.5,             label: 'Double sablière 90x90', col: C.sab2.stroke },
    { z: height + slope + SEC / 2,               label: 'Sablière haute 90x90',  col: C.sab1.stroke },
    { z: hR * 0.50,                              label: 'Montants 90x90',        col: C.stud.stroke },
    { z: SEC / 2,                                label: 'Lisse basse 90x90',     col: C.lisse.stroke },
  ];

  // Trier de haut en bas (z décroissant → y screen croissant)
  rawCallouts.sort((a, b) => b.z - a.z);
  const callouts = rawCallouts.map(c => ({ ...c, screenY: py(c.z) }));

  // Espacement minimum entre labels (8mm évite la superposition des 5 labels toiture)
  const minGap = 8;
  for (let i = 1; i < callouts.length; i++) {
    if (callouts[i].screenY - callouts[i - 1].screenY < minGap) {
      callouts[i].screenY = callouts[i - 1].screenY + minGap;
    }
  }

  callouts.forEach(c => {
    // Ligne horizontale de repérage (tick + trait vers le label)
    addPrimitives(layers, [
      // Trait horizontal du point source au callout
      line('labels', px(width) + 2, py(c.z), calloutX, c.screenY,
        { stroke: [180, 180, 192], lineWidth: 0.12 }),
      // Tick horizontal devant le texte
      line('labels', calloutX, c.screenY, calloutX + tickLen, c.screenY,
        { stroke: c.col, lineWidth: 0.25 }),
      // Texte du label
      text('labels', calloutX + tickLen + 1.5, c.screenY + 1.2, c.label,
        { fontSize: 5, color: c.col }),
    ]);
  });

  return { layers, proj, meta: { width, depth, height, slope, hTotal, roofLen, plateHeight } };
}
