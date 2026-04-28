/**
 * buildClotureElevation.js — Vue d'élévation de la clôture
 *
 * Projection : x monde → x écran, y (hauteur) → y écran (vers le haut)
 * Éléments dessinés : poteaux, rails (haut/bas), lames verticales, sol
 *
 * Entrée  : geometry issue de generateCloture()
 * Sortie  : { layers, proj, meta }
 *
 * Mode interrompue (width > MAX_FULL_WIDTH) :
 *   - Portion gauche : x < SHOW_EACH_END
 *   - Portion droite : x > width - SHOW_EACH_END, réaffiché décalé
 *   - Symbole break // au centre + annotation longueur omise
 *   - Cotation sur la longueur totale réelle
 */
import {
  createLayers, line, rect, text, dimension, addPrimitives,
} from './primitives.js';
import { fitScale, createProjectionCtx } from './projections.js';
import { MAT } from './palette.js';

/* ── Seuils mode interrompue ── */
const MAX_FULL_WIDTH = 8;    // m — au-dessus de ce seuil → mode interrompue
const SHOW_EACH_END  = 2.5;  // m — portion affichée de chaque côté
const BREAK_SPACE    = 1.5;  // m — espace réservé au symbole break

/**
 * @param {object} geometry  geometry issue du moteur clôture
 * @param {object} viewport  { ox, oy, drawW, drawH }
 * @returns {{ layers, proj, meta }}
 */
export function buildClotureElevation(geometry, viewport) {
  const {
    width, height,
    postSection, postSpacing,
    railW, railH,
    boardW, boardGap, footEmbed,
  } = geometry.dimensions;

  const posts = geometry.posts ?? [];
  const rails = geometry.rails ?? [];
  const boards = geometry.boards ?? [];

  const { ox, oy, drawW, drawH } = viewport;

  if (width > MAX_FULL_WIDTH) {
    return buildClotureElevationBreak(
      { width, height, postSection, postSpacing, railW, railH, boardW, boardGap, footEmbed },
      { posts, rails, boards },
      viewport,
    );
  }

  /* ── Mode normal (width <= MAX_FULL_WIDTH) ── */
  const sc = fitScale(width, height, drawW, drawH);
  const projOx = ox + (drawW - width * sc) / 2;
  const proj = createProjectionCtx(projOx, oy, sc);
  const { px, py } = proj;

  const layers = createLayers();

  const postWmm = Math.max(postSection * sc, 1.8);
  const railHmm = Math.max(railH * sc, 1);
  const boardWmm = Math.max(boardW * sc, 0.6);

  drawBoards(layers, boards, px, py, boardWmm, sc);
  drawRails(layers, rails, px, py, railHmm, railH, sc);
  drawPosts(layers, posts, px, py, postWmm, sc);
  drawGround(layers, px, py, width);
  drawDimensionsFull(layers, px, py, width, height, posts, postSpacing, footEmbed, postWmm, sc);

  return {
    layers,
    proj,
    meta: { width, height, postSpacing, footEmbed },
  };
}

/* ────────────────────────────────────────────────────────────────────
   Mode interrompue
   ──────────────────────────────────────────────────────────────────── */

function buildClotureElevationBreak(dims, elements, viewport) {
  const { width, height, postSection, postSpacing, railW, railH, boardW, boardGap, footEmbed } = dims;
  const { posts, rails, boards } = elements;
  const { ox, oy, drawW, drawH } = viewport;

  /* Largeur virtuelle = deux portions + espace break */
  const virtualWidth = SHOW_EACH_END * 2 + BREAK_SPACE;
  const sc = fitScale(virtualWidth, height, drawW, drawH);
  const projOx = ox + (drawW - virtualWidth * sc) / 2;
  const proj = createProjectionCtx(projOx, oy, sc);
  const { px, py } = proj;

  const layers = createLayers();

  const postWmm = Math.max(postSection * sc, 1.8);
  const railHmm = Math.max(railH * sc, 1);
  const boardWmm = Math.max(boardW * sc, 0.6);

  /* Décalage x pour la portion droite : ramener x_monde vers la portion droite virtuelle */
  const rightOffset = -(width - virtualWidth);

  /* ── Portion gauche : éléments dont x <= SHOW_EACH_END ── */
  const boardsLeft = boards.filter(b => b.x < SHOW_EACH_END);
  const railsLeft  = clipRailsLeft(rails, SHOW_EACH_END);
  const postsLeft  = posts.filter(p => p.x <= SHOW_EACH_END);

  drawBoards(layers, boardsLeft, px, py, boardWmm, sc);
  drawRails(layers, railsLeft, px, py, railHmm, railH, sc);
  drawPosts(layers, postsLeft, px, py, postWmm, sc);

  /* ── Portion droite : éléments dont x >= width - SHOW_EACH_END, décalés ── */
  const boardsRight = boards
    .filter(b => b.x >= width - SHOW_EACH_END)
    .map(b => ({ ...b, x: b.x + rightOffset }));
  const railsRight = clipRailsRight(rails, width - SHOW_EACH_END)
    .map(r => ({ ...r, x1: r.x1 + rightOffset, x2: r.x2 + rightOffset }));
  const postsRight = posts
    .filter(p => p.x >= width - SHOW_EACH_END)
    .map(p => ({ ...p, x: p.x + rightOffset }));

  drawBoards(layers, boardsRight, px, py, boardWmm, sc);
  drawRails(layers, railsRight, px, py, railHmm, railH, sc);
  drawPosts(layers, postsRight, px, py, postWmm, sc);

  /* ── Sol ── */
  drawGround(layers, px, py, virtualWidth);

  /* ── Symbole break au centre de l'espace réservé ── */
  const breakCenterX = SHOW_EACH_END + BREAK_SPACE / 2;
  drawBreakSymbol(layers, px, py, breakCenterX, height);

  /* ── Annotation longueur omise ── */
  const omittedLength = width - 2 * SHOW_EACH_END;
  drawBreakAnnotation(layers, px, py, breakCenterX, height, omittedLength);

  /* ── Cotations ── */
  drawDimensionsBreak(layers, px, py, virtualWidth, width, height, posts, postSpacing, footEmbed, postWmm, sc);

  return {
    layers,
    proj,
    meta: { width, height, postSpacing, footEmbed, breakMode: true },
  };
}

/* ────────────────────────────────────────────────────────────────────
   Helpers de découpage des rails
   ──────────────────────────────────────────────────────────────────── */

function clipRailsLeft(rails, maxX) {
  return rails
    .filter(r => r.x1 < maxX)
    .map(r => ({ ...r, x2: Math.min(r.x2, maxX) }));
}

function clipRailsRight(rails, minX) {
  return rails
    .filter(r => r.x2 > minX)
    .map(r => ({ ...r, x1: Math.max(r.x1, minX) }));
}

/* ────────────────────────────────────────────────────────────────────
   Helpers de dessin communs
   ──────────────────────────────────────────────────────────────────── */

function drawBoards(layers, boards, px, py, boardWmm, sc) {
  boards.forEach(b => {
    addPrimitives(layers, [
      rect('structureSecondary',
        px(b.x), py(b.y + b.height), boardWmm, b.height * sc,
        { fill: MAT.bardage.fill, stroke: MAT.bardage.stroke, lineWidth: 0.4 }),
    ]);
  });
}

function drawRails(layers, rails, px, py, railHmm, railH, sc) {
  rails.forEach(r => {
    addPrimitives(layers, [
      rect('structurePrimary',
        px(r.x1), py(r.y + railH), (r.x2 - r.x1) * sc, railHmm,
        { fill: MAT.lisse.fill, stroke: MAT.lisse.stroke, lineWidth: 0.5 }),
    ]);
  });
}

function drawPosts(layers, posts, px, py, postWmm, sc) {
  posts.forEach(p => {
    addPrimitives(layers, [
      rect('structurePrimary',
        px(p.x) - postWmm / 2, py(p.height), postWmm, p.height * sc,
        { fill: MAT.ossature.fill, stroke: MAT.ossature.stroke, lineWidth: 0.5 }),
    ]);
  });
}

function drawGround(layers, px, py, widthVirtual) {
  addPrimitives(layers, [
    line('contours', px(0) - 6, py(0), px(widthVirtual) + 6, py(0),
      { stroke: MAT.sol.stroke, lineWidth: 0.5 }),
  ]);
}

/* ────────────────────────────────────────────────────────────────────
   Symbole break //
   Convention architecturale : deux barres obliques avec encoches
   ──────────────────────────────────────────────────────────────────── */

function drawBreakSymbol(layers, px, py, breakCenterX, height) {
  const xC   = px(breakCenterX);
  const yTop = py(height * 1.05);
  const yBot = py(-0.05);

  /* Demi-largeur d'une barre (en mm PDF) et espacement */
  const toothW = 3;
  const barGap = 2.5;

  /* Première barre oblique (gauche) */
  addPrimitives(layers, [
    line('labels', xC - barGap / 2 - toothW, yBot, xC - barGap / 2 + toothW, yTop,
      { stroke: [60, 60, 60], lineWidth: 0.8 }),
  ]);

  /* Deuxième barre oblique (droite) */
  addPrimitives(layers, [
    line('labels', xC + barGap / 2 - toothW, yBot, xC + barGap / 2 + toothW, yTop,
      { stroke: [60, 60, 60], lineWidth: 0.8 }),
  ]);

  /* Encoches horizontales aux extrémités pour renforcer la lisibilité */
  addPrimitives(layers, [
    line('labels',
      xC - barGap / 2 - toothW - 1, yBot - 1,
      xC - barGap / 2 + toothW + 1, yBot - 1,
      { stroke: [60, 60, 60], lineWidth: 0.4 }),
    line('labels',
      xC + barGap / 2 - toothW - 1, yTop + 1,
      xC + barGap / 2 + toothW + 1, yTop + 1,
      { stroke: [60, 60, 60], lineWidth: 0.4 }),
  ]);
}

function drawBreakAnnotation(layers, px, py, breakCenterX, height, omittedLength) {
  addPrimitives(layers, [
    text('labels', px(breakCenterX), py(height * 1.15),
      `\u2261 ${omittedLength.toFixed(2)} m`,
      { fontSize: 5.5, align: 'center', italic: true, stroke: [80, 80, 80] }),
  ]);
}

/* ────────────────────────────────────────────────────────────────────
   Cotations
   ──────────────────────────────────────────────────────────────────── */

function drawDimensionsFull(layers, px, py, width, height, posts, postSpacing, footEmbed, postWmm, sc) {
  addPrimitives(layers, [
    dimension('dimensions', 'h', px(0), px(width), py(0) + 12,
      `${width.toFixed(2)} m`, { fontSize: 7 }),
    dimension('dimensions', 'v', py(0), py(height), px(0) - 14,
      `${height.toFixed(2)} m`, { fontSize: 6.5 }),
  ]);

  if (posts.length >= 2) {
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(posts[0].x), px(posts[1].x), py(height) + 6,
        `e=${postSpacing.toFixed(2)}`, { fontSize: 5, stroke: [90, 75, 50] }),
    ]);
  }

  if (footEmbed > 0) {
    addPrimitives(layers, [
      dimension('dimensions', 'v', py(0), py(-footEmbed), px(width) + 14,
        `ancr. ${(footEmbed * 100).toFixed(0)} cm`, { fontSize: 5, stroke: [90, 75, 50] }),
      rect('structureSecondary',
        px(0) - postWmm / 2, py(0), postWmm, footEmbed * sc,
        { fill: [210, 210, 215], stroke: MAT.ossature.stroke, lineWidth: 0.2, dash: [1.5, 1] }),
    ]);
  }
}

function drawDimensionsBreak(layers, px, py, virtualWidth, totalWidth, height, posts, postSpacing, footEmbed, postWmm, sc) {
  /* Cotation longueur totale réelle sur l'emprise virtuelle */
  addPrimitives(layers, [
    dimension('dimensions', 'h', px(0), px(virtualWidth), py(0) + 12,
      `${totalWidth.toFixed(2)} m (total)`, { fontSize: 6.5 }),
    dimension('dimensions', 'v', py(0), py(height), px(0) - 14,
      `${height.toFixed(2)} m`, { fontSize: 6.5 }),
  ]);

  /* Entraxe entre les deux premiers poteaux de la portion gauche */
  const postsLeft = posts.filter(p => p.x <= SHOW_EACH_END);
  if (postsLeft.length >= 2) {
    addPrimitives(layers, [
      dimension('dimensions', 'h', px(postsLeft[0].x), px(postsLeft[1].x), py(height) + 6,
        `e=${postSpacing.toFixed(2)}`, { fontSize: 5, stroke: [90, 75, 50] }),
    ]);
  }

  /* Scellement indicatif côté droit de la zone virtuelle */
  if (footEmbed > 0) {
    addPrimitives(layers, [
      dimension('dimensions', 'v', py(0), py(-footEmbed), px(virtualWidth) + 14,
        `ancr. ${(footEmbed * 100).toFixed(0)} cm`, { fontSize: 5, stroke: [90, 75, 50] }),
    ]);
  }
}
