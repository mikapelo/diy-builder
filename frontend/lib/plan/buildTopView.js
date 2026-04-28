/**
 * buildTopView.js — Vue de dessus (plan au sol) du cabanon
 *
 * Projection : x monde → x écran, y monde (profondeur) → y écran (vers le bas)
 * Montre l'implantation : murs, montants, ouvertures, chevrons, cotations.
 */
import {
  createLayers, line, rect, polygon, text, dimension, addPrimitives,
} from './primitives.js';
import { fitScale, topProjection } from './projections.js';
import { SECTION as SEC } from '@/lib/cabanonConstants.js';
const WALL_THK = SEC * 1.8;   // épaisseur visuelle mur (plus lisible)

/* ── Palette contrastée ───────────────────────────────────────────── */
const C = {
  interior: { fill: [248, 250, 252] },
  wall:     { fill: [225, 218, 202], stroke: [25, 25, 42], inner: [180, 172, 155] },
  stud:     { fill: [155, 178, 208], stroke: [50, 75, 112] },
  door:     { stroke: [155, 88, 28], fill: [252, 248, 242] },
  window:   { stroke: [45, 88, 155], fill: [230, 240, 255] },
  chevron:  { stroke: [165, 128, 82] },
  dim:      [45, 45, 55],
};

/**
 * @param {object} geometry  geometry issue du moteur cabanon
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildTopView(geometry, viewport) {
  const { width, depth } = geometry.dimensions;
  const openings = geometry.openings ?? [];
  const allStuds = geometry.structuralStuds ?? [];
  const chevrons = geometry.chevrons ?? [];
  const roofEntretoises = geometry.roofEntretoises ?? [];

  const { ox, oy, drawW, drawH } = viewport;
  const sc = fitScale(width, depth, drawW, drawH, 0.75);
  const projOx = ox + (drawW - width * sc) / 2;
  const projOy = oy + 20;
  const proj = topProjection(projOx, projOy, sc);
  const { px, py } = proj;
  const wt = Math.max(WALL_THK * sc, 2.0);
  const ss = Math.max(SEC * sc, 1.5);

  const layers = createLayers();

  /* ═══════════ 0. FOND INTÉRIEUR ═══════════ */
  addPrimitives(layers, [
    rect('background', px(0), py(0), width * sc, depth * sc,
      { fill: C.interior.fill, stroke: C.interior.fill, lineWidth: 0 }),
  ]);

  /* ═══════════ 1. CHEVRONS (lignes transversales — sous les murs) ═══════════ */
  chevrons.forEach(c => {
    if (c.y <= depth) {
      addPrimitives(layers, [
        line('roof', px(0), py(c.y), px(width), py(c.y),
          { stroke: C.chevron.stroke, lineWidth: 0.4, dash: [1.8, 1.2] }),
      ]);
    }
  });

  /* ═══════════ 1b. ENTRETOISES TOITURE (entre chevrons, en quinconce) ═══════════ */
  roofEntretoises.forEach(e => {
    const z1 = e.yCenter - e.segLen / 2;
    const z2 = e.yCenter + e.segLen / 2;
    addPrimitives(layers, [
      line('roof', px(e.x), py(z1), px(e.x), py(z2),
        { stroke: C.chevron.stroke, lineWidth: 0.15, dash: [0.8, 0.6] }),
    ]);
  });

  /* ═══════════ 2. MURS avec L-joints sans débord ni espace ═══════════
     Wall 0 et 2 couvrent la largeur totale extérieure (y compris les
     zones de coin). Wall 1 et 3 remplissent uniquement l'espace entre
     les faces intérieures de wall 0 et wall 2 → jonction en L parfaite.

     Périmètre extérieur total :
       Ouest  = px(0)     - wt/2
       Est    = px(width) + wt/2
       Nord   = py(0)     - wt/2
       Sud    = py(depth) + wt/2                                        */

  const outerL  = px(0)     - wt / 2;   // bord ouest extérieur
  const outerR  = px(width) + wt / 2;   // bord est  extérieur
  const outerN  = py(0)     - wt / 2;   // bord nord extérieur
  const outerS  = py(depth) + wt / 2;   // bord sud  extérieur
  const innerN  = py(0)     + wt / 2;   // face intérieure nord (wall 0)
  const innerS  = py(depth) - wt / 2;   // face intérieure sud  (wall 2)
  const outerTotalW = outerR - outerL;  // largeur extérieure totale
  const innerH      = innerS - innerN;  // hauteur entre faces intérieures

  // Wall 0 (façade, nord) — pleine largeur extérieure, couvre les 2 coins nord
  addPrimitives(layers, [
    rect('structurePrimary', outerL, outerN, outerTotalW, wt,
      { fill: C.wall.fill, stroke: C.wall.stroke, lineWidth: 0.6 }),
    line('structurePrimary', outerL, innerN - 0.3, outerR, innerN - 0.3,
      { stroke: C.wall.inner, lineWidth: 0.15 }),
  ]);

  // Wall 2 (arrière, sud) — pleine largeur extérieure, couvre les 2 coins sud
  addPrimitives(layers, [
    rect('structurePrimary', outerL, innerS, outerTotalW, wt,
      { fill: C.wall.fill, stroke: C.wall.stroke, lineWidth: 0.6 }),
    line('structurePrimary', outerL, innerS + 0.3, outerR, innerS + 0.3,
      { stroke: C.wall.inner, lineWidth: 0.15 }),
  ]);

  // Wall 3 (gauche, ouest) — entre faces intérieures nord/sud, pas de débord
  addPrimitives(layers, [
    rect('structurePrimary', outerL, innerN, wt, innerH,
      { fill: C.wall.fill, stroke: C.wall.stroke, lineWidth: 0.6 }),
    line('structurePrimary', outerL + wt - 0.3, innerN, outerL + wt - 0.3, innerS,
      { stroke: C.wall.inner, lineWidth: 0.15 }),
  ]);

  // Wall 1 (droite, est) — entre faces intérieures nord/sud, pas de débord
  addPrimitives(layers, [
    rect('structurePrimary', outerR - wt, innerN, wt, innerH,
      { fill: C.wall.fill, stroke: C.wall.stroke, lineWidth: 0.6 }),
    line('structurePrimary', outerR - wt + 0.3, innerN, outerR - wt + 0.3, innerS,
      { stroke: C.wall.inner, lineWidth: 0.15 }),
  ]);

  /* ═══════════ 3. MONTANTS (plus grands, plus visibles) ═══════════ */
  /* TOL élargie pour capter les montants L-corner (à SEC/2 du bord) et
   * les seconds montants du L (à SEC + SEC/2 du bord). */
  const TOL = SEC * 2;
  allStuds.forEach(s => {
    /* Masquer les jack studs (trimmers) — cohérent avec le mode détaillé 3D. */
    if (s.type === 'jack') return;
    const onWall = Math.abs(s.y) < TOL
               || Math.abs(s.y - depth) < TOL
               || Math.abs(s.x - width) < TOL
               || Math.abs(s.x) < TOL;
    if (!onWall) return;

    /* Snapper sur la face extérieure du mur primaire — aligne les montants
     * d'angle (à H du bord) avec les montants réguliers (au bord). */
    const dN = Math.abs(s.y);
    const dS = Math.abs(s.y - depth);
    const dW = Math.abs(s.x);
    const dE = Math.abs(s.x - width);
    const dMin = Math.min(dN, dS, dW, dE);

    let drawX = s.x;
    let drawY = s.y;
    if (dW <= dMin + 0.001) drawX = 0;
    if (dE <= dMin + 0.001) drawX = width;
    if (dN <= dMin + 0.001) drawY = 0;
    if (dS <= dMin + 0.001) drawY = depth;

    const cx = px(drawX) - ss / 2;
    const cy = py(drawY) - ss / 2;
    addPrimitives(layers, [
      rect('structureSecondary', cx, cy, ss, ss,
        { fill: C.stud.fill, stroke: C.stud.stroke, lineWidth: 0.5 }),
    ]);
    // Diagonale de section (convention technique)
    addPrimitives(layers, [
      line('structureSecondary', cx, cy, cx + ss, cy + ss,
        { stroke: C.stud.stroke, lineWidth: 0.08 }),
    ]);
  });

  /* ═══════════ 4. OUVERTURES ═══════════ */
  const wallOps = openings.filter(o => o.wall === 0);
  wallOps.forEach(o => {
    const x1 = px(o.u);
    const x2 = px(o.u + o.width);
    const isDoor = o.type === 'door';
    const col = isDoor ? C.door.stroke : C.window.stroke;

    // Effacer le mur (fond blanc)
    addPrimitives(layers, [
      rect('openings', x1 - 0.3, py(0) - wt / 2 - 0.3, (o.width) * sc + 0.6, wt + 0.6,
        { fill: [252, 253, 255], stroke: [252, 253, 255], lineWidth: 0 }),
    ]);

    // Traits de bord de l'ouverture
    addPrimitives(layers, [
      line('openings', x1, py(0) - wt / 2, x1, py(0) + wt / 2,
        { stroke: col, lineWidth: 0.5 }),
      line('openings', x2, py(0) - wt / 2, x2, py(0) + wt / 2,
        { stroke: col, lineWidth: 0.5 }),
    ]);

    if (isDoor) {
      /* ── Porte : arc lisse + trait vantail ── */
      const r = o.width * sc;
      const arcStep = 0.04;
      const arcPts = [];
      for (let a = 0; a <= Math.PI / 2 + 0.001; a += arcStep) {
        arcPts.push([x1 + Math.cos(a) * r, py(0) + Math.sin(a) * r]);
      }
      for (let i = 0; i < arcPts.length - 1; i++) {
        addPrimitives(layers, [
          line('openings', arcPts[i][0], arcPts[i][1], arcPts[i + 1][0], arcPts[i + 1][1],
            { stroke: col, lineWidth: 0.2 }),
        ]);
      }
      // Trait vantail (du pivot au bout de l'arc)
      addPrimitives(layers, [
        line('openings', x1, py(0), x1, py(0) + r,
          { stroke: col, lineWidth: 0.25, dash: [1.2, 0.8] }),
      ]);
    } else {
      /* ── Fenêtre : double trait + croix (norme architecturale) ── */
      const yTop = py(0) - wt * 0.3;
      const yBot = py(0) + wt * 0.3;
      // Double trait horizontal
      addPrimitives(layers, [
        line('openings', x1, yTop, x2, yTop, { stroke: col, lineWidth: 0.35 }),
        line('openings', x1, yBot, x2, yBot, { stroke: col, lineWidth: 0.35 }),
      ]);
      // Croix diagonale (symbole fenêtre en plan)
      addPrimitives(layers, [
        line('openings', x1, yTop, x2, yBot, { stroke: col, lineWidth: 0.15 }),
        line('openings', x1, yBot, x2, yTop, { stroke: col, lineWidth: 0.15 }),
      ]);
      // Fond léger
      addPrimitives(layers, [
        rect('openings', x1, yTop, (x2 - x1), (yBot - yTop),
          { fill: C.window.fill, stroke: C.window.fill, lineWidth: 0 }),
      ]);
      // Re-tracer les traits par-dessus le fond
      addPrimitives(layers, [
        line('openings', x1, yTop, x2, yTop, { stroke: col, lineWidth: 0.35 }),
        line('openings', x1, yBot, x2, yBot, { stroke: col, lineWidth: 0.35 }),
        line('openings', x1, yTop, x2, yBot, { stroke: col, lineWidth: 0.15 }),
        line('openings', x1, yBot, x2, yTop, { stroke: col, lineWidth: 0.15 }),
      ]);
    }

    // Label ouverture
    addPrimitives(layers, [
      text('labels', (x1 + x2) / 2, py(0) - wt / 2 - 3,
        isDoor ? 'Porte' : 'Fenêtre',
        { fontSize: 5.5, color: col, align: 'center', fontWeight: 'bold' }),
    ]);
  });

  /* ═══════════ 5. COTATIONS ═══════════ */
  addPrimitives(layers, [
    // Largeur (sous le plan)
    dimension('dimensions', 'h', px(0), px(width), py(depth) + wt / 2 + 12,
      `${width.toFixed(2)} m`, { fontSize: 7, fontWeight: 'bold' }),
    // Profondeur (à droite)
    dimension('dimensions', 'v', py(0), py(depth), px(width) + wt / 2 + 14,
      `${depth.toFixed(2)} m`, { fontSize: 7 }),
  ]);

  /* ── Cotes ouvertures ── */
  const DIM_COL = [85, 70, 45];
  const door = wallOps.find(o => o.type === 'door');
  const win = wallOps.find(o => o.type === 'window');

  if (door && door.u > 0.12) {
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(0), px(door.u), py(0) - wt / 2 - 6,
        `${door.u.toFixed(2)}`, { fontSize: 5, stroke: DIM_COL }),
      dimension('dimensions', 'h', px(door.u), px(door.u + door.width),
        py(0) - wt / 2 - 10, `${door.width.toFixed(2)} m`,
        { fontSize: 5, stroke: DIM_COL }),
    ]);
  }
  if (win) {
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(win.u), px(win.u + win.width),
        py(0) - wt / 2 - 14, `${win.width.toFixed(2)} m`,
        { fontSize: 5, stroke: [50, 75, 125] }),
    ]);
  }

  /* ═══════════ 5b. ENTRAXE MONTANTS ═══════════ */
  // Cote d'entraxe entre 2 montants réguliers sur le mur arrière (wall 2)
  const wall2Studs = allStuds
    .filter(s => Math.abs(s.y - depth) < 0.02)
    .sort((a, b) => a.x - b.x);
  if (wall2Studs.length >= 3) {
    // Prendre le 2e et 3e (indices 1,2) pour éviter le coin
    const s1 = wall2Studs[1];
    const s2 = wall2Studs[2];
    const spacing = Math.abs(s2.x - s1.x);
    if (spacing > 0.3 && spacing < 1.0) {
      addPrimitives(layers, [
        dimension('dimensions', 'h', px(s1.x), px(s2.x), py(depth) + wt / 2 + 6,
          `e=${(spacing * 100).toFixed(0)} cm`, { fontSize: 5.5, stroke: [85, 70, 45] }),
      ]);
    }
  }

  /* ═══════════ 6. LABELS ORIENTATION ═══════════ */
  addPrimitives(layers, [
    text('labels', px(width / 2), py(0) - wt / 2 - 18, 'FAÇADE',
      { fontSize: 8, fontWeight: 'bold', color: [25, 25, 42], align: 'center' }),
    text('labels', px(width / 2), py(depth) + wt / 2 + 20, 'ARRIÈRE',
      { fontSize: 6, color: [90, 100, 118], align: 'center' }),
    text('labels', px(0) - wt / 2 - 8, py(depth / 2) + 1.5, 'GAUCHE',
      { fontSize: 5.5, color: [90, 100, 118], align: 'center' }),
    text('labels', px(width) + wt / 2 + 8, py(depth / 2) + 1.5, 'DROITE',
      { fontSize: 5.5, color: [90, 100, 118], align: 'center' }),
  ]);

  /* ═══════════ 7. SURFACE ═══════════ */
  const surface = width * depth;
  addPrimitives(layers, [
    text('labels', px(width / 2), py(depth / 2) + 2,
      `${surface.toFixed(2)} m²`,
      { fontSize: 8, color: [120, 130, 148], align: 'center', fontStyle: 'italic' }),
  ]);

  return {
    layers, proj,
    meta: { width, depth, surface },
  };
}
