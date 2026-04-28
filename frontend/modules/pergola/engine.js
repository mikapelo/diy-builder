/**
 * modules/pergola/engine.js — Moteur de calcul Pergola V1
 *
 * Pergola autoportée rectangulaire : 4 poteaux, 2 longerons (X),
 * 2 traverses (Z), N chevrons (Z) avec porte-à-faux.
 *
 * Sources :
 *   - docs/pergola-design-rules.md
 *   - NF DTU 31.1 (charpente bois) §5.10 Durabilité, §5.7 Assemblages
 *   - NF EN 335 (classes d'emploi du bois)
 *   - BILP Pergola — Projet G
 *
 * Convention d'axes :
 *   X = largeur (longerons)
 *   Z = profondeur (chevrons, traverses)
 *   Y = hauteur (vertical)
 *
 * NE CONTIENT PAS de Three.js — moteur pur.
 */

import {
  POST_SECTION,
  BEAM_W, BEAM_H,
  BEAM_SECTIONS,
  MAX_POST_SPAN,
  BEAM_OVERHANG,
  RAFTER_W, RAFTER_H,
  RAFTER_SECTIONS,
  RAFTER_SPACING,
  DEFAULT_HEIGHT,
  OVERHANG,
  FOOT_CLEARANCE,
  BRACE_SECTION,
  BRACE_DROP,
  BRACE_RUN,
  VIS_PER_BRACE,
  VIS_PER_RAFTER_BEAM,
  VIS_PER_POST_BEAM,
  ANCHORS_PER_POST,
  BOULONS_PER_TRAVERSE,
} from '@/lib/pergolaConstants.js';

/** Arrondi à 3 décimales — élimine les artefacts IEEE 754 */
function r3(v) { return +v.toFixed(3); }

/**
 * Sélectionne la section de longeron basée sur la portée réelle entre poteaux.
 *
 * @param {number} span Portée en mètres (distance entre deux poteaux consécutifs)
 * @returns {{ w: number, h: number }} Largeur et hauteur de la section (m)
 */
export function computeBeamSection(span) {
  for (const section of BEAM_SECTIONS) {
    if (span <= section.maxSpan) {
      return { w: section.w, h: section.h };
    }
  }
  // Fallback (ne devrait pas arriver ici avec Infinity en dernière entrée)
  return { w: BEAM_W, h: BEAM_H };
}

/**
 * Calcule les positions des poteaux avec support dynamique pour les grandes portées.
 *
 * Logique :
 *   - Si width ≤ MAX_POST_SPAN : 4 poteaux aux coins
 *   - Si width > MAX_POST_SPAN : ajoute des poteaux intermédiaires sur les deux
 *     côtés (z=0 et z=depth) espacés uniformément selon MAX_POST_SPAN
 *
 * @param {number} width      Largeur en mètres (axe X)
 * @param {number} depth      Profondeur en mètres (axe Z)
 * @returns {{ posts: Array, postCount: number, postSpan: number }}
 */
export function computePostPositions(width, depth) {
  const posts = [];

  if (width <= MAX_POST_SPAN) {
    // Cas simple : 4 poteaux aux angles
    posts.push(
      { x: 0,     z: 0 },
      { x: width, z: 0 },
      { x: width, z: depth },
      { x: 0,     z: depth }
    );
    return { posts, postCount: 4, postSpan: width };
  }

  // Cas complexe : ajouter des poteaux intermédiaires
  const intervals = Math.ceil(width / MAX_POST_SPAN);
  const postSpan = width / intervals; // Portée réelle entre poteaux
  const postsPerSide = intervals + 1;

  // Poteaux sur z=0 (côté avant)
  for (let i = 0; i < postsPerSide; i++) {
    posts.push({ x: r3(i * postSpan), z: 0 });
  }

  // Poteaux sur z=depth (côté arrière), en sens inverse pour continuité
  for (let i = postsPerSide - 1; i >= 0; i--) {
    posts.push({ x: r3(i * postSpan), z: depth });
  }

  const postCount = 2 * postsPerSide;
  return { posts, postCount, postSpan };
}

/**
 * Sélectionne la section de chevron selon la profondeur (portée libre).
 * Au-delà de 3.5 m, on passe de 50×80 à 50×100 pour respecter la flèche L/300.
 *
 * @param {number} depth Profondeur de la pergola (portée des chevrons, m)
 * @returns {{ w: number, h: number }}
 */
export function computeRafterSection(depth) {
  for (const section of RAFTER_SECTIONS) {
    if (depth <= section.maxDepth) {
      return { w: section.w, h: section.h };
    }
  }
  return { w: RAFTER_W, h: RAFTER_H };
}

/**
 * Calcule le nombre de chevrons en fonction de la largeur et de l'entraxe.
 *
 * Logique : on distribue les chevrons uniformément entre les deux longerons.
 * Les chevrons d'extrémité sont aux bords extérieurs des longerons.
 *
 * @param {number} width     Largeur intérieure (axe X)
 * @param {number} spacing   Entraxe cible entre chevrons
 * @returns {{ count: number, actualSpacing: number }}
 */
export function computeRafters(width, spacing = RAFTER_SPACING) {
  if (width <= 0) return { count: 2, actualSpacing: 0 };
  // Espace utile entre les deux chevrons d'extrémité
  const usable = width;
  const intervals = Math.max(1, Math.round(usable / spacing));
  const count = intervals + 1;
  const actualSpacing = usable / intervals;
  return { count, actualSpacing };
}

/**
 * Génère la structure complète d'une pergola.
 *
 * @param {number}  width           Largeur en mètres (axe X, longerons)
 * @param {number}  depth           Profondeur en mètres (axe Z, chevrons)
 * @param {object}  [options={}]
 * @param {number}  [options.height] Hauteur poteaux sol→longeron (m)
 * @returns {object} Structure complète : quantitatifs + geometry
 */
export function generatePergola(width, depth, options = {}) {
  const { height = DEFAULT_HEIGHT } = options;

  // ── Dimensions dérivées ─────────────────────────────────────
  const surface = +(width * depth).toFixed(2);

  // ── Poteaux (dynamiques selon portée) ────────────────────────
  const { posts, postCount, postSpan } = computePostPositions(width, depth);
  const postLength = +(height + FOOT_CLEARANCE).toFixed(3); // hauteur utile

  // ── Sections de longeron selon portée réelle ─────────────────
  const { w: beamW, h: beamH } = computeBeamSection(postSpan);

  // ── Section chevron selon profondeur (portée libre) ─────────
  const { w: rafterW, h: rafterH } = computeRafterSection(depth);

  const beamY = height;                        // Y dessous longeron = hauteur poteau
  const beamTopY = r3(beamY + beamH);         // Y dessus longeron (arrondi IEEE 754)
  // Traverses au MÊME niveau que les longerons (assemblage mi-bois en réalité)
  const rafterY = beamTopY;                    // Chevrons posés SUR longerons/traverses
  const rafterTopY = r3(rafterY + rafterH);   // Y dessus chevron (arrondi IEEE 754)

  // ── Longerons (2, courent en X, avec débord au-delà des poteaux) ──
  // Les longerons reposent sur les poteaux et dépassent de BEAM_OVERHANG
  const beamLongLength = +(width + 2 * BEAM_OVERHANG).toFixed(3);
  const beamsLong = [
    { x1: -BEAM_OVERHANG, x2: width + BEAM_OVERHANG, z: 0,     y: beamY },
    { x1: -BEAM_OVERHANG, x2: width + BEAM_OVERHANG, z: depth, y: beamY },
  ];

  // ── Traverses (N, courent en Z) ─────────────────────────────
  // Une traverse à chaque position X de poteau (pas seulement aux extrémités),
  // raccourcie pour s'arrêter au bord intérieur de chaque longeron (demi-section).
  // Les poteaux intermédiaires reçoivent aussi leur traverse pour le contreventement en Z.
  const halfBeam = beamW / 2;
  const beamShortLength = +(depth - beamW).toFixed(3);  // longueur nette entre longerons
  const uniquePostX = [...new Set(posts.map(p => r3(p.x)))].sort((a, b) => a - b);
  const beamsShort = uniquePostX.map(x => ({
    x, z1: halfBeam, z2: depth - halfBeam, y: beamY,
  }));

  // ── Chevrons (N, courent en Z avec porte-à-faux) ───────────
  const { count: rafterCount, actualSpacing: rafterActualSpacing } = computeRafters(width);
  const rafterLength = +(depth + 2 * OVERHANG).toFixed(3);

  const rafters = [];
  for (let i = 0; i < rafterCount; i++) {
    rafters.push({
      x: r3(i * rafterActualSpacing),
      z1: -OVERHANG,                 // porte-à-faux avant
      z2: depth + OVERHANG,          // porte-à-faux arrière
      y: rafterY,
    });
  }

  // ── Jambes de force (contreventement diagonal) ──────────────
  // 2 jambes par poteau, les deux le long du longeron (axe X).
  // Chaque paire forme un V inversé sous la poutre.
  //
  //        longeron ─────────────────── (y = beamY)
  //                 ╲             ╱
  //                  ╲           ╱
  //                   ╲         ╱
  //                    ╲       ╱
  //                     poteau          (y = beamY - BRACE_DROP)
  //
  // ── Logique de positionnement des jambes de force ──
  //
  // Référence photo : les poteaux de COIN reçoivent un L (1 brace
  // sur le longeron en X + 1 brace sur la traverse en Z, chacune
  // dirigée vers l'intérieur). Les poteaux INTERMÉDIAIRES reçoivent
  // un V (2 braces symétriques le long du longeron en X).
  //
  const braces = [];
  const EPS = 0.001;

  // Identifier les coins : combinaison {x ≈ 0 ou x ≈ width} × {z ≈ 0 ou z ≈ depth}
  function isCorner(p) {
    const atXmin = Math.abs(p.x) < EPS;
    const atXmax = Math.abs(p.x - width) < EPS;
    const atZmin = Math.abs(p.z) < EPS;
    const atZmax = Math.abs(p.z - depth) < EPS;
    return (atXmin || atXmax) && (atZmin || atZmax);
  }

  // Direction intérieure pour un coin
  function cornerDirs(p) {
    const dx = Math.abs(p.x) < EPS ? +1 : -1;       // vers l'intérieur en X
    const dz = Math.abs(p.z) < EPS ? +1 : -1;       // vers l'intérieur en Z
    return { dx, dz };
  }

  // Limites du longeron (axe X) avec overhang
  const beamXmin = -BEAM_OVERHANG;
  const beamXmax = width + BEAM_OVERHANG;

  posts.forEach(p => {
    if (isCorner(p)) {
      // ── Poteau de coin → L (1 brace X + 1 brace Z) ──
      const { dx, dz } = cornerDirs(p);

      // Brace le long du longeron (plan X) — vers l'intérieur
      const xRun = dx > 0
        ? Math.min(BRACE_RUN, beamXmax - p.x)
        : Math.min(BRACE_RUN, p.x - beamXmin);
      if (xRun >= 0.10) {
        braces.push({
          x1: p.x,  y1: r3(beamY - BRACE_DROP),  z1: p.z,
          x2: r3(p.x + dx * xRun),  y2: beamY,  z2: p.z,
          plane: 'X',
        });
      }

      // Brace le long de la traverse (plan Z) — vers l'intérieur
      // Traverse au même niveau que le longeron → brace monte jusqu'à beamY
      braces.push({
        x1: p.x,  y1: r3(beamY - BRACE_DROP),  z1: p.z,
        x2: p.x,  y2: beamY,  z2: r3(p.z + dz * BRACE_RUN),
        plane: 'Z',
      });

    } else {
      // ── Poteau intermédiaire → V (2 braces symétriques en X) ──
      const leftRun  = Math.min(BRACE_RUN, p.x - beamXmin);
      const rightRun = Math.min(BRACE_RUN, beamXmax - p.x);

      if (leftRun >= 0.10) {
        braces.push({
          x1: p.x,  y1: r3(beamY - BRACE_DROP),  z1: p.z,
          x2: r3(p.x - leftRun),  y2: beamY,  z2: p.z,
          plane: 'X',
        });
      }
      if (rightRun >= 0.10) {
        braces.push({
          x1: p.x,  y1: r3(beamY - BRACE_DROP),  z1: p.z,
          x2: r3(p.x + rightRun),  y2: beamY,  z2: p.z,
          plane: 'X',
        });
      }
    }
  });

  const braceCount = braces.length;
  // Longueur de la jambe standard (course pleine) — pour le BOM on prend la plus longue
  const braceLength = +Math.sqrt(BRACE_DROP * BRACE_DROP + BRACE_RUN * BRACE_RUN).toFixed(3);

  // ── BOM — Quincaillerie ─────────────────────────────────────
  const visChevrons      = rafterCount * 2 * VIS_PER_RAFTER_BEAM;  // 2 longerons × vis par intersection
  const visPoteaux       = postCount * VIS_PER_POST_BEAM;
  const visBraces        = braceCount * VIS_PER_BRACE;
  const ancragePoteaux   = postCount * ANCHORS_PER_POST;
  const beamsShortCount  = beamsShort.length;                      // N traverses (1 par position X de poteau)
  const boulonsTraverses = beamsShortCount * 2 * BOULONS_PER_TRAVERSE; // N traverses × 2 extrémités × boulons

  // ── Geometry object ─────────────────────────────────────────
  const geometry = {
    dimensions: {
      width,
      depth,
      height,
      postSpan,                     // Portée réelle entre poteaux consécutifs
      overhang: OVERHANG,
      beamOverhang: BEAM_OVERHANG,
      postSection: POST_SECTION,
      beamW,                        // Section dynamique selon portée
      beamH,                        // Section dynamique selon portée
      rafterW,
      rafterH,
      braceSection: BRACE_SECTION,
      rafterSpacing: rafterActualSpacing,
      beamTopY,
      rafterTopY,
    },
    posts: posts.map(p => ({ ...p, height })),
    beamsLong,
    beamsShort,
    rafters,
    braces,
  };

  return {
    // ── Quantitatifs de base ───────────────────────────
    surface,
    postCount,
    rafterCount,
    braceCount,
    beamLongLength,
    beamShortLength,
    rafterLength,
    braceLength,
    postLength,

    // ── BOM — Pièces bois ──────────────────────────────
    posts:      postCount,
    beamsLong:  2,
    beamsShort: beamsShortCount,
    rafters:    rafterCount,
    braces:     braceCount,

    // ── BOM — Quincaillerie ────────────────────────────
    visChevrons,
    visPoteaux,
    visBraces,
    ancragePoteaux,
    boulonsTraverses,

    // NOTE : le waste factor (pertes coupe/chutes) est géré par costCalculator.js.

    // ── Geometry ───────────────────────────────────────
    geometry,
  };
}
