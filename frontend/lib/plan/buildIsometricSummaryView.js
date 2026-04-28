/**
 * buildIsometricSummaryView.js — Vue de synthèse isométrique simplifiée
 *
 * Page 1 du PDF : compréhension immédiate du volume global.
 * Aucun détail structurel (montants, chevrons, OSB, sablières).
 * Seulement : volume murs + toit mono-pente + ouvertures simplifiées + cotations globales.
 *
 * Projection : oblique cabinet 30°, ratio 0.5
 */
import {
  createLayers, line, rect, polygon, text, addPrimitives,
} from './primitives.js';
import { obliqueProjection } from './projections.js';

/* ── Palette sobre et premium ─────────────────────────────────────── */
const PAL = {
  wallFront:  [238, 228, 210],   // bois clair chaud — face avant
  wallSide:   [222, 212, 192],   // bois légèrement ombré — face droite
  wallBack:   [210, 200, 180],   // face arrière (partiellement visible)
  roofTop:    [82, 88, 105],     // gris acier — dessus toit
  roofEdge:   [68, 74, 90],      // tranche toit
  door:       [95, 65, 35],      // brun foncé sobre
  doorFill:   [130, 98, 62],     // remplissage porte
  window:     [65, 95, 140],     // bleu-gris
  windowFill: [205, 218, 238],   // vitre claire
  edge:       [35, 35, 52],      // contours principaux
  edgeLight:  [120, 120, 140],   // contours secondaires
  dimLine:    [55, 55, 70],      // cotations
  dimText:    [40, 40, 58],      // texte cotations
  ground:     [215, 210, 200],   // ombre au sol
};

const OVERHANG   = 0.20;   // débord de toiture (m)
const ROOF_THK   = 0.06;   // épaisseur visuelle toit (m) — exagérée pour lisibilité

/**
 * @param {object} geometry  geometry issue du moteur cabanon
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildIsometricSummaryView(geometry, viewport) {
  const { width: w, depth: d, height: h, slope } = geometry.dimensions;
  const surface = w * d;
  const hHigh = h + slope;   // hauteur côté droit (haut de pente)

  const { ox, oy, drawW, drawH } = viewport;

  /* ── Projection oblique ── */
  const angle = 30, ratio = 0.5;
  const rad = (angle * Math.PI) / 180;
  const cosA = Math.cos(rad) * ratio;
  const sinA = Math.sin(rad) * ratio;

  // Bounding box projetée
  const projW = w + d * cosA + 2 * OVERHANG;
  const projH = hHigh + ROOF_THK + d * sinA + OVERHANG * sinA + 0.15;
  const sc = Math.min(drawW / projW, drawH / projH) * 0.78;

  const projOx = ox + (drawW - (w + d * cosA) * sc) / 2;
  const projOy = oy + 5;
  const proj = obliqueProjection(projOx, projOy, sc, angle, ratio);
  const p = proj.project;

  const layers = createLayers();

  /* ── Points clés 3D ─────────────────────────────────────────── */
  // Base (z=0)
  const B = {
    fl: p(0, 0, 0),     fr: p(w, 0, 0),
    br: p(w, d, 0),     bl: p(0, d, 0),
  };
  // Haut des murs (z=h côté gauche, z=hHigh côté droit)
  const T = {
    fl: p(0, 0, h),     fr: p(w, 0, hHigh),
    br: p(w, d, hHigh), bl: p(0, d, h),
  };
  // Toit avec débords et épaisseur
  const ovh = OVERHANG;
  const R = {
    fl: p(-ovh, -ovh, h),           fr: p(w + ovh, -ovh, hHigh),
    br: p(w + ovh, d + ovh, hHigh), bl: p(-ovh, d + ovh, h),
  };
  const Rt = {  // dessus toit (épaisseur)
    fl: p(-ovh, -ovh, h + ROOF_THK),           fr: p(w + ovh, -ovh, hHigh + ROOF_THK),
    br: p(w + ovh, d + ovh, hHigh + ROOF_THK), bl: p(-ovh, d + ovh, h + ROOF_THK),
  };

  /* ═══════════ 1. OMBRE AU SOL ═══════════ */
  const shadowOff = 2.5;
  addPrimitives(layers, [
    polygon('background', [
      [B.fl.x + shadowOff, B.fl.y + shadowOff],
      [B.fr.x + shadowOff, B.fr.y + shadowOff],
      [B.br.x + shadowOff, B.br.y + shadowOff],
      [B.bl.x + shadowOff, B.bl.y + shadowOff],
    ], { fill: PAL.ground, stroke: PAL.ground, lineWidth: 0 }),
  ]);

  /* ═══════════ 2. FACES MURS (3 faces visibles) ═══════════ */

  // Face arrière (y=d) — partiellement visible au-dessus du toit
  addPrimitives(layers, [
    polygon('contours', [
      [B.bl.x, B.bl.y], [B.br.x, B.br.y],
      [T.br.x, T.br.y], [T.bl.x, T.bl.y],
    ], { fill: PAL.wallBack, stroke: PAL.edgeLight, lineWidth: 0.25 }),
  ]);

  // Face droite (x=w)
  addPrimitives(layers, [
    polygon('contours', [
      [B.fr.x, B.fr.y], [B.br.x, B.br.y],
      [T.br.x, T.br.y], [T.fr.x, T.fr.y],
    ], { fill: PAL.wallSide, stroke: PAL.edge, lineWidth: 0.45 }),
  ]);

  // Face avant (y=0) — face principale
  addPrimitives(layers, [
    polygon('contours', [
      [B.fl.x, B.fl.y], [B.fr.x, B.fr.y],
      [T.fr.x, T.fr.y], [T.fl.x, T.fl.y],
    ], { fill: PAL.wallFront, stroke: PAL.edge, lineWidth: 0.55 }),
  ]);

  /* ═══════════ 3. OUVERTURES SIMPLIFIÉES (face avant) ═══════════ */
  const openings = (geometry.openings ?? []).filter(o => o.wall === 0);

  openings.forEach(o => {
    const bl = p(o.u, 0, o.v);
    const br = p(o.u + o.width, 0, o.v);
    const tr = p(o.u + o.width, 0, o.v + o.height);
    const tl = p(o.u, 0, o.v + o.height);
    const pts = [[bl.x, bl.y], [br.x, br.y], [tr.x, tr.y], [tl.x, tl.y]];

    if (o.type === 'door') {
      // Porte : rectangle plein sombre
      addPrimitives(layers, [
        polygon('openings', pts, { fill: PAL.doorFill, stroke: PAL.door, lineWidth: 0.5 }),
      ]);
      // Poignée (petit cercle symbolisé par un point)
      const handleX = (br.x + tr.x) / 2 - (br.x - bl.x) * 0.15;
      const handleY = (bl.y + tl.y) / 2;
      addPrimitives(layers, [
        rect('openings', handleX - 0.5, handleY - 0.5, 1, 1,
          { fill: [60, 50, 35], stroke: [60, 50, 35], lineWidth: 0 }),
      ]);
    } else {
      // Fenêtre : rectangle clair + croix
      addPrimitives(layers, [
        polygon('openings', pts, { fill: PAL.windowFill, stroke: PAL.window, lineWidth: 0.45 }),
      ]);
      // Croisillons fenêtre (horizontal + vertical)
      const midX = (bl.x + br.x) / 2;
      const midY = (bl.y + tl.y) / 2;
      const midXt = (tl.x + tr.x) / 2;
      addPrimitives(layers, [
        line('openings', midX, bl.y, midXt, tl.y,
          { stroke: PAL.window, lineWidth: 0.3 }),
        line('openings', (bl.x + tl.x) / 2, midY, (br.x + tr.x) / 2, midY,
          { stroke: PAL.window, lineWidth: 0.3 }),
      ]);
    }
  });

  /* ═══════════ 4. TOIT MONO-PENTE ═══════════ */

  // Tranche avant du toit (épaisseur visible)
  addPrimitives(layers, [
    polygon('roof', [
      [R.fl.x, R.fl.y], [R.fr.x, R.fr.y],
      [Rt.fr.x, Rt.fr.y], [Rt.fl.x, Rt.fl.y],
    ], { fill: PAL.roofEdge, stroke: PAL.edge, lineWidth: 0.35 }),
  ]);

  // Tranche droite du toit
  addPrimitives(layers, [
    polygon('roof', [
      [R.fr.x, R.fr.y], [R.br.x, R.br.y],
      [Rt.br.x, Rt.br.y], [Rt.fr.x, Rt.fr.y],
    ], { fill: PAL.roofEdge, stroke: PAL.edge, lineWidth: 0.3 }),
  ]);

  // Dessus du toit (face principale)
  addPrimitives(layers, [
    polygon('roof', [
      [Rt.fl.x, Rt.fl.y], [Rt.fr.x, Rt.fr.y],
      [Rt.br.x, Rt.br.y], [Rt.bl.x, Rt.bl.y],
    ], { fill: PAL.roofTop, stroke: PAL.edge, lineWidth: 0.55 }),
  ]);

  /* ═══════════ 5. CONTOURS FORTS (silhouette nette) ═══════════ */
  // Arêtes verticales avant
  addPrimitives(layers, [
    line('outline', B.fl.x, B.fl.y, T.fl.x, T.fl.y,
      { stroke: PAL.edge, lineWidth: 0.65 }),
    line('outline', B.fr.x, B.fr.y, T.fr.x, T.fr.y,
      { stroke: PAL.edge, lineWidth: 0.65 }),
  ]);
  // Arête verticale arrière droite
  addPrimitives(layers, [
    line('outline', B.br.x, B.br.y, T.br.x, T.br.y,
      { stroke: PAL.edge, lineWidth: 0.4 }),
  ]);
  // Base avant
  addPrimitives(layers, [
    line('outline', B.fl.x, B.fl.y, B.fr.x, B.fr.y,
      { stroke: PAL.edge, lineWidth: 0.6 }),
  ]);
  // Base droite
  addPrimitives(layers, [
    line('outline', B.fr.x, B.fr.y, B.br.x, B.br.y,
      { stroke: PAL.edge, lineWidth: 0.5 }),
  ]);

  /* ═══════════ 6. COTATIONS GLOBALES ═══════════ */
  const tk = 1.8;   // longueur tick
  const dimGap = 10; // écart cotation ↔ volume

  // ── Largeur (sous le bord avant) ──
  const wY = B.fl.y + dimGap;
  addPrimitives(layers, [
    line('dimensions', B.fl.x, wY, B.fr.x, wY,
      { stroke: PAL.dimLine, lineWidth: 0.25 }),
    line('dimensions', B.fl.x, wY - tk, B.fl.x, wY + tk,
      { stroke: PAL.dimLine, lineWidth: 0.25 }),
    line('dimensions', B.fr.x, wY - tk, B.fr.x, wY + tk,
      { stroke: PAL.dimLine, lineWidth: 0.25 }),
    // Lignes d'attache
    line('dimensions', B.fl.x, B.fl.y + 1, B.fl.x, wY - tk,
      { stroke: PAL.dimLine, lineWidth: 0.1 }),
    line('dimensions', B.fr.x, B.fr.y + 1, B.fr.x, wY - tk,
      { stroke: PAL.dimLine, lineWidth: 0.1 }),
    text('dimensions', (B.fl.x + B.fr.x) / 2, wY - 2.5,
      `${w.toFixed(2)} m`, { fontSize: 8, fontWeight: 'bold', color: PAL.dimText, align: 'center' }),
  ]);

  // ── Profondeur (le long du bord droit) ──
  const dOff = dimGap;
  const dS = { x: B.fr.x + dOff, y: B.fr.y };
  const dE = { x: B.br.x + dOff, y: B.br.y };
  addPrimitives(layers, [
    line('dimensions', dS.x, dS.y, dE.x, dE.y,
      { stroke: PAL.dimLine, lineWidth: 0.25 }),
    // Lignes d'attache
    line('dimensions', B.fr.x + 1, B.fr.y, dS.x - 1, dS.y,
      { stroke: PAL.dimLine, lineWidth: 0.1 }),
    line('dimensions', B.br.x + 1, B.br.y, dE.x - 1, dE.y,
      { stroke: PAL.dimLine, lineWidth: 0.1 }),
    text('dimensions', (dS.x + dE.x) / 2 + 4, (dS.y + dE.y) / 2 - 1,
      `${d.toFixed(2)} m`, { fontSize: 8, fontWeight: 'bold', color: PAL.dimText }),
  ]);

  // ── Hauteur (côté gauche, hauteur basse) ──
  const hX = B.fl.x - dimGap;
  addPrimitives(layers, [
    line('dimensions', hX, B.fl.y, hX, T.fl.y,
      { stroke: PAL.dimLine, lineWidth: 0.25 }),
    line('dimensions', hX - tk, B.fl.y, hX + tk, B.fl.y,
      { stroke: PAL.dimLine, lineWidth: 0.25 }),
    line('dimensions', hX - tk, T.fl.y, hX + tk, T.fl.y,
      { stroke: PAL.dimLine, lineWidth: 0.25 }),
    // Lignes d'attache
    line('dimensions', B.fl.x - 1, B.fl.y, hX + tk, B.fl.y,
      { stroke: PAL.dimLine, lineWidth: 0.1 }),
    line('dimensions', T.fl.x - 1, T.fl.y, hX + tk, T.fl.y,
      { stroke: PAL.dimLine, lineWidth: 0.1 }),
    text('dimensions', hX - 2.5, (B.fl.y + T.fl.y) / 2 + 1.5,
      `${h.toFixed(2)} m`, { fontSize: 7, color: PAL.dimText, align: 'right' }),
  ]);

  /* ═══════════ 7. INFOS SYNTHÈSE ═══════════ */
  const pente = (slope / w * 100).toFixed(1);
  const angleDeg = (Math.atan2(slope, w) * 180 / Math.PI).toFixed(1);

  // Info compacte sous le dessin
  const infoY = Math.max(B.bl.y, wY + 8) + 10;
  addPrimitives(layers, [
    text('labels', ox + drawW / 2, infoY,
      `Surface au sol : ${surface.toFixed(2)} m²`,
      { fontSize: 9, fontWeight: 'bold', color: [35, 40, 55], align: 'center' }),
    text('labels', ox + drawW / 2, infoY + 6,
      `Pente : ${pente}% (${angleDeg}°)  ·  Hauteur basse ${h.toFixed(2)} m / haute ${hHigh.toFixed(2)} m`,
      { fontSize: 7, color: [80, 88, 108], align: 'center' }),
  ]);

  return {
    layers, proj,
    meta: { width: w, depth: d, height: h, slope, surface, hHigh },
  };
}
