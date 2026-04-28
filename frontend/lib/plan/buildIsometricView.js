/**
 * buildIsometricView.js — Vue oblique 3D du cabanon
 *
 * Projection oblique (cabinet 30°, ratio 0.5) montrant le volume global,
 * la pente de toiture, et les dimensions principales annotées.
 */
import {
  createLayers, line, polygon, text, addPrimitives,
} from './primitives.js';
import { obliqueProjection } from './projections.js';
import { SECTION as SEC } from '@/lib/cabanonConstants.js';

/* ── Palette ─────────────────────────────────────────────── */
const FACE_FRONT  = [240, 232, 215];
const FACE_SIDE   = [228, 218, 198];
const FACE_ROOF   = [110, 115, 128];
const FACE_TOP    = [235, 228, 212];
const EDGE_VIS    = [40, 40, 60];
const EDGE_HIDDEN = [165, 165, 180];
const DIM_COL     = [50, 50, 65];

/**
 * @param {object} geometry  geometry issue du moteur cabanon
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildIsometricView(geometry, viewport) {
  const { width: w, depth: d, height: h, slope, plateHeight } = geometry.dimensions;
  const roofLen = geometry.roof?.len ?? Math.sqrt(w ** 2 + slope ** 2);
  const surface = w * d;
  const hs = h + slope;          // hauteur côté haut
  const ph = plateHeight;        // hauteur plaque (h + 2*SEC)
  const phs = ph + slope;        // plaque côté haut

  const { ox, oy, drawW, drawH } = viewport;

  /* ── Calcul de l'échelle via bounding box projetée ── */
  const angle = 30, ratio = 0.5;
  const rad = (angle * Math.PI) / 180;
  const cosA = Math.cos(rad) * ratio;
  const sinA = Math.sin(rad) * ratio;
  const projW = w + d * cosA;
  const projH = phs + d * sinA + 0.2;
  const sc = Math.min(drawW / projW, drawH / projH) * 0.82;

  const projOx = ox + (drawW - projW * sc) / 2;
  const projOy = oy;
  const proj = obliqueProjection(projOx, projOy, sc, angle, ratio);
  const p = proj.project;

  const layers = createLayers();

  /* ── Points clés 3D ── */
  const B = {
    fl: p(0, 0, 0),   fr: p(w, 0, 0),
    br: p(w, d, 0),    bl: p(0, d, 0),
  };
  const T = {
    fl: p(0, 0, h),    fr: p(w, 0, hs),
    br: p(w, d, hs),   bl: p(0, d, h),
  };
  const R = {
    fl: p(0, 0, ph),   fr: p(w, 0, phs),
    br: p(w, d, phs),  bl: p(0, d, ph),
  };

  /* ═══════════ 1. ARÊTES CACHÉES (dashed) ═══════════ */
  addPrimitives(layers, [
    line('background', B.fl.x, B.fl.y, B.bl.x, B.bl.y,
      { stroke: EDGE_HIDDEN, lineWidth: 0.2, dash: [2, 1.5] }),
    line('background', B.bl.x, B.bl.y, B.br.x, B.br.y,
      { stroke: EDGE_HIDDEN, lineWidth: 0.2, dash: [2, 1.5] }),
    line('background', B.bl.x, B.bl.y, T.bl.x, T.bl.y,
      { stroke: EDGE_HIDDEN, lineWidth: 0.2, dash: [2, 1.5] }),
  ]);

  /* ═══════════ 2. FACES PLEINES ═══════════ */
  // Face avant (y=0)
  addPrimitives(layers, [
    polygon('contours', [
      [B.fl.x, B.fl.y], [B.fr.x, B.fr.y],
      [T.fr.x, T.fr.y], [T.fl.x, T.fl.y],
    ], { fill: FACE_FRONT, stroke: EDGE_VIS, lineWidth: 0.5 }),
  ]);

  // Face droite (x=w)
  addPrimitives(layers, [
    polygon('contours', [
      [B.fr.x, B.fr.y], [B.br.x, B.br.y],
      [T.br.x, T.br.y], [T.fr.x, T.fr.y],
    ], { fill: FACE_SIDE, stroke: EDGE_VIS, lineWidth: 0.5 }),
  ]);

  // Face supérieure (entre sablières et toiture) — triangle mur gauche
  addPrimitives(layers, [
    polygon('structurePrimary', [
      [T.fl.x, T.fl.y], [T.bl.x, T.bl.y],
      [R.bl.x, R.bl.y], [R.fl.x, R.fl.y],
    ], { fill: FACE_TOP, stroke: EDGE_VIS, lineWidth: 0.3 }),
  ]);

  /* ═══════════ 3. TOIT ═══════════ */
  addPrimitives(layers, [
    polygon('roof', [
      [R.fl.x, R.fl.y], [R.fr.x, R.fr.y],
      [R.br.x, R.br.y], [R.bl.x, R.bl.y],
    ], { fill: FACE_ROOF, stroke: EDGE_VIS, lineWidth: 0.6 }),
  ]);

  /* ═══════════ 4. ARÊTES SUPÉRIEURES VISIBLES ═══════════ */
  addPrimitives(layers, [
    line('outline', T.bl.x, T.bl.y, T.br.x, T.br.y,
      { stroke: EDGE_VIS, lineWidth: 0.4 }),
    line('outline', T.fl.x, T.fl.y, T.bl.x, T.bl.y,
      { stroke: EDGE_VIS, lineWidth: 0.4 }),
  ]);

  /* ═══════════ 5. OUVERTURES (esquissées sur la face avant) ═══════════ */
  const wallOps = (geometry.openings ?? []).filter(o => o.wall === 0);
  wallOps.forEach(o => {
    const bl = p(o.u, 0, o.v);
    const br = p(o.u + o.width, 0, o.v);
    const tr = p(o.u + o.width, 0, o.v + o.height);
    const tl = p(o.u, 0, o.v + o.height);
    const isDoor = o.type === 'door';
    const col = isDoor ? [120, 70, 25] : [50, 90, 150];
    const fill = isDoor ? [245, 240, 232] : [225, 235, 250];
    addPrimitives(layers, [
      polygon('openings', [
        [bl.x, bl.y], [br.x, br.y], [tr.x, tr.y], [tl.x, tl.y],
      ], { fill, stroke: col, lineWidth: 0.4 }),
    ]);
  });

  /* ═══════════ 6. COTATIONS ═══════════ */
  // Largeur (sous le bord avant)
  const wDimY = B.fl.y + 8;
  addPrimitives(layers, [
    line('dimensions', B.fl.x, wDimY, B.fr.x, wDimY,
      { stroke: DIM_COL, lineWidth: 0.25 }),
    line('dimensions', B.fl.x, wDimY - 1.5, B.fl.x, wDimY + 1.5,
      { stroke: DIM_COL, lineWidth: 0.25 }),
    line('dimensions', B.fr.x, wDimY - 1.5, B.fr.x, wDimY + 1.5,
      { stroke: DIM_COL, lineWidth: 0.25 }),
    text('dimensions', (B.fl.x + B.fr.x) / 2, wDimY - 2,
      `${w.toFixed(2)} m`, { fontSize: 7, fontWeight: 'bold', color: DIM_COL, align: 'center' }),
  ]);

  // Profondeur (le long du bord droit bas)
  const dOff = 6;
  const dS = { x: B.fr.x + dOff, y: B.fr.y };
  const dE = { x: B.br.x + dOff, y: B.br.y };
  addPrimitives(layers, [
    line('dimensions', dS.x, dS.y, dE.x, dE.y,
      { stroke: DIM_COL, lineWidth: 0.25 }),
    text('dimensions', (dS.x + dE.x) / 2 + 3, (dS.y + dE.y) / 2,
      `${d.toFixed(2)} m`, { fontSize: 7, fontWeight: 'bold', color: DIM_COL }),
  ]);

  // Hauteur (côté gauche avant)
  const hX = B.fl.x - 6;
  addPrimitives(layers, [
    line('dimensions', hX, B.fl.y, hX, T.fl.y,
      { stroke: DIM_COL, lineWidth: 0.25 }),
    line('dimensions', hX - 1.5, B.fl.y, hX + 1.5, B.fl.y,
      { stroke: DIM_COL, lineWidth: 0.25 }),
    line('dimensions', hX - 1.5, T.fl.y, hX + 1.5, T.fl.y,
      { stroke: DIM_COL, lineWidth: 0.25 }),
    text('dimensions', hX - 2, (B.fl.y + T.fl.y) / 2 + 1,
      `${h.toFixed(2)} m`, { fontSize: 6, color: DIM_COL, align: 'right' }),
  ]);

  /* ═══════════ 7. INFOS ═══════════ */
  const infoY = oy + 12;
  addPrimitives(layers, [
    text('labels', ox + drawW / 2, infoY,
      `Surface : ${surface.toFixed(2)} m²  ·  Pente : ${(slope / w * 100).toFixed(0)}%  ·  Rampant : ${roofLen.toFixed(2)} m`,
      { fontSize: 7, color: [60, 70, 90], align: 'center' }),
  ]);

  return { layers, proj, meta: { width: w, depth: d, height: h, slope, surface } };
}
