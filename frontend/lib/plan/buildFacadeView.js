/**
 * buildFacadeView.js — Construit les primitives de la vue de façade (wall 0)
 *
 * Entrée  : geometry (depuis engine.js, non modifié)
 * Sortie  : layers object avec primitives standardisées
 *
 * Projection : x monde → x écran, z monde → y écran (vers le haut)
 * Tous les éléments structurels sont dessinés en sections bois (rectangles).
 */
import {
  createLayers, line, rect, polygon, text, dimension, addPrimitives,
} from './primitives.js';
import { fitScale, createProjectionCtx } from './projections.js';
import { SECTION as SEC } from '@/lib/cabanonConstants.js';

/**
 * @param {object} geometry  geometry issue du moteur cabanon
 * @param {object} viewport  { ox, oy, drawW, drawH } — zone de dessin disponible (mm PDF ou px SVG)
 * @returns {{ layers, proj, meta }}
 */
export function buildFacadeView(geometry, viewport) {
  const { width, depth, height, slope, plateHeight } = geometry.dimensions;
  const openings = geometry.openings ?? [];
  const allStuds = geometry.structuralStuds ?? [];
  const framings = geometry.framings ?? [];
  const lissesArr = geometry.lisses ?? {};
  const chevrons = geometry.chevrons ?? [];

  const hMax = height + slope;
  const { ox, oy, drawW, drawH } = viewport;
  const sc = fitScale(width, hMax, drawW, drawH);
  const projOx = ox + (drawW - width * sc) / 2;
  const proj = createProjectionCtx(projOx, oy, sc);
  const { px, py } = proj;

  const layers = createLayers();
  const wallOps = openings.filter(o => o.wall === 0);

  /* ── Section bois en mm écran (min 1.5mm pour lisibilité) ── */
  const secMm = Math.max(SEC * sc, 1.5);

  /* ── Helpers classification montants ── */
  const isKing = (x) => wallOps.some(o =>
    Math.abs(x - o.u) < SEC * 1.5 || Math.abs(x - (o.u + o.width)) < SEC * 1.5
  );
  const isCorner = (x) => x < SEC * 2 || x > width - SEC * 2;

  /* ── 1. Contours (trait fort, dessus tout) ── */
  const C_COL = [30, 30, 50];
  addPrimitives(layers, [
    line('contours', px(0), py(0), px(0), py(height), { stroke: C_COL, lineWidth: 0.8 }),
    line('contours', px(width), py(0), px(width), py(height + slope), { stroke: C_COL, lineWidth: 0.8 }),
    line('contours', px(0), py(height), px(width), py(height + slope), { stroke: C_COL, lineWidth: 0.8 }),
    line('contours', px(0), py(0), px(width), py(0), { stroke: C_COL, lineWidth: 0.8 }),
  ]);

  /* ── 2. Roof — marques chevrons sur la pente ── */
  const chevCount = chevrons.length;
  if (chevCount > 1) {
    const step = width / (chevCount + 1);
    for (let i = 1; i <= Math.min(chevCount, 15); i++) {
      const u = i * step;
      const hAtU = height + (u / width) * slope;
      addPrimitives(layers, [
        line('roof', px(u), py(hAtU) - 1.5, px(u), py(hAtU) + 1.5,
          { stroke: [140, 100, 60], lineWidth: 0.35 }),
      ]);
    }
  }

  /* ── 3. Structure primaire — lisses en rectangles ── */
  const LISSE_B_FILL = [225, 210, 180];   const LISSE_B_STK = [90, 70, 45];
  const LISSE_H_FILL = [220, 205, 175];   const LISSE_H_STK = [100, 80, 60];
  const LISSE_H2_FILL = [215, 200, 170];  const LISSE_H2_STK = [120, 95, 70];

  // Lisse basse wall 0 — rectangle pleine largeur
  addPrimitives(layers, [
    rect('structurePrimary', px(0), py(SEC), width * sc, secMm,
      { fill: LISSE_B_FILL, stroke: LISSE_B_STK, lineWidth: 0.4 }),
  ]);

  // Sablière haute 1 — rectangle incliné approché par polygone
  // Pour une pente faible, on utilise un parallélogramme (4 points)
  const sh1z = height;          // z bas gauche
  const sh1zr = height + slope; // z bas droite
  addPrimitives(layers, [
    polygon('structurePrimary', [
      [px(0),     py(sh1z)],
      [px(width), py(sh1zr)],
      [px(width), py(sh1zr + SEC)],
      [px(0),     py(sh1z + SEC)],
    ], { fill: LISSE_H_FILL, stroke: LISSE_H_STK, lineWidth: 0.4 }),
  ]);

  // Double sablière — au-dessus
  const sh2z = height + SEC;
  const sh2zr = height + slope + SEC;
  addPrimitives(layers, [
    polygon('structurePrimary', [
      [px(0),     py(sh2z)],
      [px(width), py(sh2zr)],
      [px(width), py(sh2zr + SEC)],
      [px(0),     py(sh2z + SEC)],
    ], { fill: LISSE_H2_FILL, stroke: LISSE_H2_STK, lineWidth: 0.4 }),
  ]);

  /* ── 4. Montants facade — rectangles verticaux ── */
  const STUD_REG_FILL = [195, 210, 225];  const STUD_REG_STK = [80, 100, 130];
  const STUD_KING_FILL = [180, 200, 230]; const STUD_KING_STK = [40, 80, 160];
  const STUD_CORN_FILL = [185, 205, 225]; const STUD_CORN_STK = [50, 90, 140];
  const STUD_CRIP_FILL = [200, 215, 230]; const STUD_CRIP_STK = [110, 140, 165];

  const facadeStuds = allStuds.filter(s => Math.abs(s.y) < 0.01);

  // Detecter les montants doubles : grouper par position x (tolerance 2cm)
  // et decaler legerement pour montrer le doublage
  const xGroups = new Map();
  facadeStuds.forEach(s => {
    const xKey = Math.round(s.x * 50);  // arrondi a 2cm
    if (!xGroups.has(xKey)) xGroups.set(xKey, []);
    xGroups.get(xKey).push(s);
  });

  facadeStuds.forEach(s => {
    const king = isKing(s.x);
    const corner = isCorner(s.x);
    const isCripple = s.height < height * 0.5;
    const base = s.zBase ?? 0;
    const layer = (king || corner) ? 'structurePrimary' : 'structureSecondary';
    const fill = king ? STUD_KING_FILL : corner ? STUD_CORN_FILL : isCripple ? STUD_CRIP_FILL : STUD_REG_FILL;
    const stroke = king ? STUD_KING_STK : corner ? STUD_CORN_STK : isCripple ? STUD_CRIP_STK : STUD_REG_STK;
    const lw = (king || corner) ? 0.5 : 0.4;

    // Decalage pour montants doubles : deux rectangles cote a cote
    const xKey = Math.round(s.x * 50);
    const group = xGroups.get(xKey);
    const idx = group.indexOf(s);
    const isDouble = group.length > 1 && !isCripple;
    const halfSec = secMm / 2;
    const gap = 0.4;  // ecart visuel entre les deux montants (mm)
    let drawX;
    let drawW;
    if (isDouble && group.length === 2) {
      // Montant double : chaque piece = demi-section, avec un ecart central
      drawW = halfSec - gap / 2;
      drawX = px(s.x) - halfSec + idx * (halfSec + gap / 2);
    } else {
      drawW = secMm;
      drawX = px(s.x) - halfSec;
    }

    const studH = s.height * sc;
    const studTop = py(base + s.height);
    addPrimitives(layers, [
      rect(layer, drawX, studTop, drawW, studH,
        { fill, stroke, lineWidth: lw }),
    ]);
  });

  /* ── 5. Framings — linteaux + seuils (rectangles pleins) ── */
  framings.filter(f => f.wall === 0).forEach(f => {
    const halfW = f.w / 2;
    const x1 = px(f.u - halfW), x2 = px(f.u + halfW);
    const y1 = py(f.v), y2 = py(f.v + f.hh);
    addPrimitives(layers, [
      rect('framings', Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1),
        { fill: [240, 220, 190], stroke: [170, 95, 35], lineWidth: 0.5 }),
    ]);
  });

  /* ── 6. Ouvertures ── */
  wallOps.forEach(o => {
    const x1 = px(o.u), x2 = px(o.u + o.width);
    const y1 = py(o.v), y2 = py(o.v + o.height);
    const isDoor = o.type === 'door';
    const fill = isDoor ? [245, 240, 232] : [230, 240, 252];
    addPrimitives(layers, [
      rect('openings', Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1),
        { fill, stroke: [120, 100, 80], lineWidth: 0.5 }),
    ]);
    if (!isDoor) {
      addPrimitives(layers, [
        line('openings', (x1 + x2) / 2, Math.min(y1, y2), (x1 + x2) / 2, Math.max(y1, y2),
          { stroke: [120, 100, 80], lineWidth: 0.25 }),
        line('openings', Math.min(x1, x2), (y1 + y2) / 2, Math.max(x1, x2), (y1 + y2) / 2,
          { stroke: [120, 100, 80], lineWidth: 0.25 }),
      ]);
    }
  });

  /* ── 7. Dimensions — cotations principales ── */
  addPrimitives(layers, [
    dimension('dimensions', 'h', px(0), px(width), py(0) + 12, `${width.toFixed(2)} m`, { fontSize: 7 }),
    dimension('dimensions', 'v', py(0), py(height), px(0) - 12, `${height.toFixed(2)} m`, { fontSize: 6.5 }),
    dimension('dimensions', 'v', py(0), py(height + slope), px(width) + 12, `${(height + slope).toFixed(2)} m`, { fontSize: 6.5 }),
  ]);

  /* Cotations ouvertures détaillées */
  const DIM_COL = [90, 75, 50];
  const door = wallOps.find(o => o.type === 'door');
  if (door) {
    if (door.u > 0.15) {
      addPrimitives(layers, [
        dimension('dimensions', 'h', px(0), px(door.u), py(0) + 6, `${door.u.toFixed(2)}`,
          { fontSize: 5, stroke: DIM_COL }),
      ]);
    }
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(door.u), px(door.u + door.width), py(door.height) - 2, `${door.width.toFixed(2)} m`,
        { fontSize: 5.5, stroke: DIM_COL }),
      dimension('dimensions', 'v', py(0), py(door.height), px(door.u) - 5, `h${door.height.toFixed(2)}`,
        { fontSize: 4.5, stroke: DIM_COL }),
    ]);
  }

  const win = wallOps.find(o => o.type === 'window');
  if (win) {
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(0), px(win.u), py(0) + 8.5, `${win.u.toFixed(2)}`,
        { fontSize: 5, stroke: [60, 80, 120] }),
      dimension('dimensions', 'h', px(win.u), px(win.u + win.width), py(win.v) + 3, `${win.width.toFixed(2)}`,
        { fontSize: 5, stroke: DIM_COL }),
      dimension('dimensions', 'v', py(0), py(win.v), px(win.u + win.width) + 8, `allege ${win.v.toFixed(2)}`,
        { fontSize: 4.5, stroke: DIM_COL, dash: [1, 0.8] }),
      dimension('dimensions', 'v', py(win.v), py(win.v + win.height), px(win.u) - 6, `h${win.height.toFixed(2)}`,
        { fontSize: 4.5, stroke: DIM_COL }),
    ]);
  }

  /* ── 8. Labels — info toiture (une seule ligne pour éviter superposition) ── */
  const roofLen = geometry.roof?.len ?? Math.sqrt(width ** 2 + slope ** 2);
  const midPx = (px(0) + px(width)) / 2;
  const midPy = (py(height) + py(height + slope)) / 2;
  addPrimitives(layers, [
    text('labels', midPx, midPy - 1,
      `rampant ${roofLen.toFixed(2)} m  /  denivele ${slope.toFixed(2)} m`,
      { fontSize: 5, fontStyle: 'italic', color: [80, 70, 55], align: 'center' }),
  ]);

  return {
    layers,
    proj,
    meta: { width, depth, height, slope, hMax, roofLen },
  };
}
