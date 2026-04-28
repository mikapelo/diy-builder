/**
 * buildPergolaFacadeView.js — Vue d'élévation/façade de la pergola
 *
 * Projection : x monde → x écran, z (hauteur) → y écran (vers le haut)
 * Éléments dessinés : poteaux, longerons, traverses (vue de bout), chevrons (vue de bout)
 *
 * Entrée  : geometry issue de generatePergola()
 * Sortie  : { layers, proj, meta }
 */
import {
  createLayers, line, rect, text, dimension, addPrimitives,
} from './primitives.js';
import { fitScale, createProjectionCtx } from './projections.js';
import { MAT } from './palette.js';

/**
 * @param {object} geometry  geometry issue du moteur pergola
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildPergolaFacadeView(geometry, viewport) {
  const {
    width, height, overhang,
    postSection, beamW, beamH, rafterW, rafterH,
    rafterSpacing, braceSection,
  } = geometry.dimensions;

  const posts = geometry.posts ?? [];
  const beamsLong = geometry.beamsLong ?? [];
  const rafters = geometry.rafters ?? [];
  const braces = geometry.braces ?? [];

  /* ── Dimensions monde ── */
  const totalH = height + beamH + rafterH;    // sol → dessus chevron
  const totalW = width;                       // largeur entre poteaux

  const { ox, oy, drawW, drawH } = viewport;
  const sc = fitScale(totalW, totalH, drawW, drawH);
  const projOx = ox + (drawW - totalW * sc) / 2;
  const proj = createProjectionCtx(projOx, oy, sc);
  const { px, py } = proj;

  const layers = createLayers();

  /* ── Section bois en mm écran (min 1.5mm pour lisibilité) ── */
  const postW = Math.max(postSection * sc, 1.8);
  const beamHmm = Math.max(beamH * sc, 2);
  const beamWmm = Math.max(beamW * sc, 1.2);
  const rafterHmm = Math.max(rafterH * sc, 1.5);
  const rafterWmm = Math.max(rafterW * sc, 1);

  /* ── 1. Poteaux — rectangles verticaux ── */
  // Façade : on voit les 2 poteaux du côté z≈0 (tolérance flottant)
  const EPS = 0.001;
  const facadePosts = posts.filter(p => Math.abs(p.z) < EPS);
  facadePosts.forEach(p => {
    addPrimitives(layers, [
      rect('structurePrimary', px(p.x) - postW / 2, py(p.height), postW, p.height * sc,
        { fill: MAT.ossature.fill, stroke: MAT.ossature.stroke, lineWidth: 0.5 }),
    ]);
  });

  /* ── 2. Longerons — rectangle horizontal en façade (le longeron z≈0) ── */
  const facadeBeam = beamsLong.find(b => Math.abs(b.z) < EPS);
  if (facadeBeam) {
    const bx1 = px(facadeBeam.x1);
    const bx2 = px(facadeBeam.x2);
    const by = py(facadeBeam.y + beamH);
    addPrimitives(layers, [
      rect('structurePrimary', bx1, by, bx2 - bx1, beamHmm,
        { fill: MAT.sabliere.fill, stroke: MAT.sabliere.stroke, lineWidth: 0.4 }),
    ]);
  }

  /* ── 3. Traverses — vues de bout (petits rectangles aux extrémités) ── */
  // Les traverses courent en Z, vues de face elles apparaissent comme des sections
  const beamsShort = geometry.beamsShort ?? [];
  beamsShort.forEach(bs => {
    const bsY = py(bs.y + beamH);          // beamsShort.y = dessous traverse = beamTopY
    addPrimitives(layers, [
      rect('structureSecondary', px(bs.x) - beamWmm / 2, bsY, beamWmm, beamHmm,
        { fill: MAT.sabliere.fill, stroke: MAT.sabliere.stroke, lineWidth: 0.5, dash: [1.5, 1] }),
    ]);
  });

  /* ── 4. Chevrons — vues de bout (sections transversales) ── */
  // Chaque chevron court en Z ; vu de façade, c'est un petit rectangle
  const chevronY = height + beamH;  // dessous chevron
  rafters.forEach(r => {
    addPrimitives(layers, [
      rect('structureSecondary', px(r.x) - rafterWmm / 2, py(chevronY + rafterH),
        rafterWmm, rafterHmm,
        { fill: MAT.chevron.fill, stroke: MAT.chevron.stroke, lineWidth: 0.4 }),
    ]);
  });

  /* ── 4b. Jambes de force (contreventement — plan X, façade z≈0) ── */
  const EPS_BRACE = 0.01;
  const facadeBraces = braces.filter(br =>
    br.plane === 'X' && Math.abs(br.z1) < EPS_BRACE
  );
  facadeBraces.forEach(br => {
    addPrimitives(layers, [
      line('structureSecondary', px(br.x1), py(br.y1), px(br.x2), py(br.y2),
        { stroke: MAT.ossature.stroke, lineWidth: 0.5 }),
    ]);
  });

  /* ── 5. Ligne de sol ── */
  addPrimitives(layers, [
    line('contours', px(0) - 8, py(0), px(width) + 8, py(0),
      { stroke: MAT.sol.stroke, lineWidth: 0.5 }),
  ]);

  /* ── 6. Contour d'ensemble (outline) ── */
  addPrimitives(layers, [
    // Enveloppe extérieure simplifiée : poteaux + longeron
    line('outline', px(0) - postW / 2 - 0.5, py(0), px(0) - postW / 2 - 0.5, py(height + beamH),
      { stroke: MAT.contour.stroke, lineWidth: 0.5 }),
    line('outline', px(width) + postW / 2 + 0.5, py(0), px(width) + postW / 2 + 0.5, py(height + beamH),
      { stroke: MAT.contour.stroke, lineWidth: 0.5 }),
    line('outline', px(0) - postW / 2 - 0.5, py(height + beamH), px(width) + postW / 2 + 0.5, py(height + beamH),
      { stroke: MAT.contour.stroke, lineWidth: 0.5 }),
  ]);

  /* ── 7. Cotations ── */
  // Largeur totale
  addPrimitives(layers, [
    dimension('dimensions', 'h', px(0), px(width), py(0) + 12,
      `${width.toFixed(2)} m`, { fontSize: 7 }),
  ]);
  // Hauteur poteau
  addPrimitives(layers, [
    dimension('dimensions', 'v', py(0), py(height), px(0) - 14,
      `${height.toFixed(2)} m`, { fontSize: 6.5 }),
  ]);
  // Hauteur totale (sol → dessus chevron)
  addPrimitives(layers, [
    dimension('dimensions', 'v', py(0), py(totalH), px(width) + 14,
      `${totalH.toFixed(2)} m`, { fontSize: 6.5 }),
  ]);
  // Entraxe chevrons (entre 2 premiers)
  if (rafters.length >= 2) {
    const r0x = px(rafters[0].x);
    const r1x = px(rafters[1].x);
    addPrimitives(layers, [
      dimension('dimensions', 'h', r0x, r1x, py(totalH) - 6,
        `e=${rafterSpacing.toFixed(2)}`, { fontSize: 5, stroke: [90, 75, 50] }),
    ]);
  }

  /* ── 8. Labels — hauteur longeron ── */
  // Sections matériaux portées par la légende externe ; seule la hauteur
  // de la pièce intermédiaire (longeron) est cotée pour lisibilité.
  addPrimitives(layers, [
    dimension('dimensions', 'v', py(height), py(height + beamH), px(width / 2) + 8,
      `${(beamH * 100).toFixed(0)} cm`, { fontSize: 5, stroke: [90, 75, 50] }),
  ]);

  return {
    layers,
    proj,
    meta: { width, height, totalH, totalW, overhang },
  };
}
