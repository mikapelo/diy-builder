/**
 * buildPergolaTopView.js — Vue de dessus de la pergola
 *
 * Projection : x monde → x écran, z (profondeur) → y écran (vers le bas)
 * Éléments dessinés : poteaux (carrés), longerons (X), traverses (Z),
 *                     chevrons (Z avec porte-à-faux)
 *
 * Entrée  : geometry issue de generatePergola()
 * Sortie  : { layers, proj, meta }
 */
import {
  createLayers, line, rect, dimension, addPrimitives,
} from './primitives.js';
import { fitScale, topProjection } from './projections.js';
import { MAT } from './palette.js';

/**
 * @param {object} geometry  geometry issue du moteur pergola
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildPergolaTopView(geometry, viewport) {
  const {
    width, depth, overhang,
    postSection, beamW, rafterW,
    rafterSpacing,
  } = geometry.dimensions;

  const beamOverhang = geometry.dimensions.beamOverhang ?? 0;

  const posts = geometry.posts ?? [];
  const beamsLong = geometry.beamsLong ?? [];
  const beamsShort = geometry.beamsShort ?? [];
  const rafters = geometry.rafters ?? [];
  const braces = geometry.braces ?? [];

  /* ── Dimensions monde incluant porte-à-faux ── */
  const totalW = width + 2 * beamOverhang;
  const totalD = depth + 2 * overhang;    // chevrons dépassent devant/derrière

  const { ox, oy, drawW, drawH } = viewport;
  const sc = fitScale(totalW, totalD, drawW, drawH);
  // Centrer horizontalement et décaler oy pour que z=-overhang soit visible
  const projOx = ox + (drawW - totalW * sc) / 2 + beamOverhang * sc;
  const projOy = oy + overhang * sc;  // décalage pour le porte-à-faux avant
  const proj = topProjection(projOx, projOy, sc);
  const { px, py } = proj;

  const layers = createLayers();

  /* ── Sections en mm écran (min lisible) ── */
  const postMm = Math.max(postSection * sc, 2);
  const beamWmm = Math.max(beamW * sc, 1.2);     // largeur visible longeron/traverse (épaisseur)
  const raftWmm = Math.max(rafterW * sc, 0.8);

  /* ── 1. Zone couverte — fond léger ── */
  addPrimitives(layers, [
    rect('background', px(0), py(0), width * sc, depth * sc,
      { fill: [245, 248, 252], stroke: [210, 215, 225], lineWidth: 0.15 }),
  ]);

  /* ── 2. Chevrons (Z, avec porte-à-faux) — traits fins parallèles ── */
  rafters.forEach(r => {
    const rx = px(r.x);
    addPrimitives(layers, [
      line('structureSecondary', rx, py(r.z1), rx, py(r.z2),
        { stroke: MAT.chevron.stroke, lineWidth: 0.4 }),
    ]);
    // Sections en bout (petits traits transversaux)
    addPrimitives(layers, [
      line('structureSecondary', rx - raftWmm / 2, py(r.z1), rx + raftWmm / 2, py(r.z1),
        { stroke: MAT.chevron.stroke, lineWidth: 0.4 }),
      line('structureSecondary', rx - raftWmm / 2, py(r.z2), rx + raftWmm / 2, py(r.z2),
        { stroke: MAT.chevron.stroke, lineWidth: 0.4 }),
    ]);
  });

  /* ── 3. Longerons (X) — traits plus épais ── */
  beamsLong.forEach(bl => {
    const by = py(bl.z);
    addPrimitives(layers, [
      rect('structurePrimary', px(bl.x1), by - beamWmm / 2, (bl.x2 - bl.x1) * sc, beamWmm,
        { fill: MAT.sabliere.fill, stroke: MAT.sabliere.stroke, lineWidth: 0.5 }),
    ]);
  });

  /* ── 4. Traverses (Z) — traits plus épais ── */
  beamsShort.forEach(bs => {
    const bx = px(bs.x);
    addPrimitives(layers, [
      rect('structurePrimary', bx - beamWmm / 2, py(bs.z1), beamWmm, (bs.z2 - bs.z1) * sc,
        { fill: MAT.sabliere.fill, stroke: MAT.sabliere.stroke, lineWidth: 0.5 }),
    ]);
  });

  /* ── 5. Poteaux (carrés avec diagonale) ── */
  posts.forEach(p => {
    const cx = px(p.x);
    const cy = py(p.z);
    addPrimitives(layers, [
      rect('structurePrimary', cx - postMm / 2, cy - postMm / 2, postMm, postMm,
        { fill: MAT.ossature.fill, stroke: MAT.ossature.stroke, lineWidth: 0.5 }),
      // Diagonale pour marquer la section
      line('structurePrimary', cx - postMm / 2, cy - postMm / 2, cx + postMm / 2, cy + postMm / 2,
        { stroke: MAT.ossature.stroke, lineWidth: 0.2 }),
    ]);
  });

  /* ── 5b. Jambes de force (vue de dessus — projection diagonale) ── */
  const braceStroke = [120, 90, 60];
  braces.forEach(br => {
    addPrimitives(layers, [
      line('structureSecondary', px(br.x1), py(br.z1), px(br.x2), py(br.z2),
        { stroke: braceStroke, lineWidth: 0.4 }),
    ]);
  });

  /* ── 6. Cotations ── */
  // Largeur totale (X)
  addPrimitives(layers, [
    dimension('dimensions', 'h', px(0), px(width), py(-overhang) - 8,
      `${width.toFixed(2)} m`, { fontSize: 7 }),
  ]);
  // Profondeur totale (Z, entre poteaux)
  addPrimitives(layers, [
    dimension('dimensions', 'v', py(0), py(depth), px(0) - 14,
      `${depth.toFixed(2)} m`, { fontSize: 6.5 }),
  ]);
  // Porte-à-faux
  if (overhang > 0) {
    addPrimitives(layers, [
      dimension('dimensions', 'v', py(-overhang), py(0), px(width) + 14,
        `${overhang.toFixed(2)}`, { fontSize: 5, stroke: [90, 75, 50] }),
      dimension('dimensions', 'v', py(depth), py(depth + overhang), px(width) + 14,
        `${overhang.toFixed(2)}`, { fontSize: 5, stroke: [90, 75, 50] }),
    ]);
  }
  // Porte-à-faux des longerons
  if (beamOverhang > 0) {
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(-beamOverhang), px(0), py(0) - 6,
        `${beamOverhang.toFixed(2)}`, { fontSize: 4.5, stroke: [90, 75, 50] }),
    ]);
  }
  // Entraxe chevrons
  if (rafters.length >= 2) {
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(rafters[0].x), px(rafters[1].x), py(depth + overhang) + 8,
        `e=${rafterSpacing.toFixed(2)}`, { fontSize: 5, stroke: [90, 75, 50] }),
    ]);
  }

  /* ── 7. Labels — entraxe sur le dessin ── */
  // Le titre de vue est porté par pageTitle() dans pergolaPDF.js.
  // Pas de labels texte redondants avec la légende ou les cotations.

  return {
    layers,
    proj,
    meta: { width, depth, overhang, totalW, totalD },
  };
}
