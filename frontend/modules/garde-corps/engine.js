/**
 * modules/garde-corps/engine.js — Moteur de calcul Garde-corps V1
 *
 * Extension optionnelle du simulateur Terrasse. Depuis un périmètre linéaire
 * (somme des côtés à protéger) et une hauteur, calcule les quantitatifs
 * matériaux (poteaux, lisses, balustres) conformes NF DTU 36.3 P3 + R111-15.
 *
 * Sources :
 *   - NF DTU 36.3 P3 (septembre 2014), notamment Annexe C (garde-corps extérieurs)
 *   - CCH R111-15 (hauteur mini 1.00 m pour dénivelé ≥ 1.00 m)
 *   - Décret 95-949 (espacement libre ≤ 110 mm, sécurité enfants)
 *
 * Convention d'axes :
 *   X = direction principale (le long d'un côté)
 *   Z = transverse
 *   Y = hauteur (vertical)
 *
 * NE CONTIENT PAS de Three.js — moteur pur.
 */

import {
  MAX_POST_SPACING,
  MAX_BALUSTER_GAP,
  MIN_HEIGHT_TERRACE,
  POST_SECTION,
  RAIL_SECTION_H,
  POST_EMBED,
} from '@/lib/gardeCorpsConstants.js';

/** Arrondi à 3 décimales — élimine les artefacts IEEE 754. */
function r3(v) { return +v.toFixed(3); }

/**
 * Calcule le nombre de balustres par travée en respectant l'espacement maxi DTU.
 *
 * Source : Décret 95-949 — espacement libre entre balustres ≤ 110 mm.
 * On se base sur MAX_POST_SPACING pour rester conservateur : même si la
 * travée réelle est légèrement inférieure, on garantit ainsi que l'espacement
 * reste ≤ MAX_BALUSTER_GAP partout.
 *
 * @param {number} balustreSpacing Espacement cible entre balustres (m)
 * @returns {number} Nombre de balustres par travée (arrondi sup.)
 */
function computeBalustrePerBay(balustreSpacing) {
  // Nombre d'intervalles entre balustres dans une travée max.
  // balustrePerBay = intervalles - 1 car les poteaux tiennent les bords.
  const intervals = Math.ceil(MAX_POST_SPACING / balustreSpacing);
  return Math.max(1, intervals - 1);
}

/**
 * Génère les positions géométriques des poteaux, lisses et balustres pour
 * un tracé polygonal défini par `sides` (longueurs par côté, alignées sur X).
 *
 * Les côtés sont concaténés linéairement sur l'axe X (pas de coins 3D) :
 * cette simplification suffit pour le BOM et un aperçu 2D/3D basique.
 * Une extension future pourra gérer les angles réels si besoin.
 *
 * @param {number[]} sides        Longueurs par côté (m)
 * @param {number}   height       Hauteur garde-corps (m)
 * @param {number}   postLength   Hauteur totale poteau avec ancrage (m)
 * @param {number}   balustreLen  Hauteur utile balustre (m)
 * @returns {{ posts: Array, rails: Array, balustres: Array }}
 */
function buildGeometry(sides, height, postLength, balustreLen) {
  const posts = [];
  const rails = [];
  const balustres = [];

  let cursor = 0;
  for (const sideLength of sides) {
    if (sideLength <= 0) continue;

    // Poteaux régulièrement espacés sur ce côté (≤ MAX_POST_SPACING)
    const intervals = Math.max(1, Math.ceil(sideLength / MAX_POST_SPACING));
    const spacing = sideLength / intervals;
    const sideStart = cursor;
    const sideEnd = cursor + sideLength;

    // Un poteau à chaque extrémité + intermédiaires
    const sidePostX = [];
    for (let i = 0; i <= intervals; i++) {
      const x = r3(sideStart + i * spacing);
      sidePostX.push(x);
      posts.push({ x, y: 0, z: 0, height: postLength });
    }

    // Lisses haute et basse (segments continus entre premier et dernier poteau)
    const yRailBottom = RAIL_SECTION_H;
    const yRailTop = r3(height - RAIL_SECTION_H);
    rails.push({
      x1: sideStart, y1: yRailBottom, z1: 0,
      x2: sideEnd,   y2: yRailBottom, z2: 0,
    });
    rails.push({
      x1: sideStart, y1: yRailTop, z1: 0,
      x2: sideEnd,   y2: yRailTop, z2: 0,
    });

    // Balustres répartis uniformément entre chaque paire de poteaux consécutifs
    const perBay = computeBalustrePerBay(MAX_BALUSTER_GAP);
    for (let i = 0; i < sidePostX.length - 1; i++) {
      const bayStart = sidePostX[i] + POST_SECTION / 2;
      const bayEnd   = sidePostX[i + 1] - POST_SECTION / 2;
      const usable   = bayEnd - bayStart;
      const step     = usable / (perBay + 1);
      for (let j = 1; j <= perBay; j++) {
        balustres.push({
          x: r3(bayStart + j * step),
          z: 0,
          height: balustreLen,
        });
      }
    }

    cursor = sideEnd;
  }

  return { posts, rails, balustres };
}

/**
 * Génère la structure complète d'un garde-corps.
 *
 * @param {number}   perimeter                Longueur totale (m) de garde-corps
 * @param {number}   [height]                 Hauteur (m), défaut MIN_HEIGHT_TERRACE
 * @param {object}   [options]
 * @param {number[]} [options.sides]          Longueurs par côté (m) pour geometry 3D
 * @param {number}   [options.balustreSpacing] Espacement cible balustres (m)
 * @returns {object} Quantitatifs + geometry
 */
export function generateGardeCorps(perimeter, height = MIN_HEIGHT_TERRACE, options = {}) {
  const {
    sides = null,
    balustreSpacing: requestedSpacing,
  } = options;

  // ── Clamp hauteur à la mini réglementaire (terrasse ≥ 1 m)
  // CCH R111-15 : ne jamais renvoyer un garde-corps inférieur à la hauteur mini.
  const effectiveHeight = Math.max(height, MIN_HEIGHT_TERRACE);

  // ── Périmètre effectif : 0 ou négatif ⇒ aucun besoin, clampé à 0
  const effectivePerimeter = Math.max(0, perimeter);

  // ── Espacement balustre : respecte la limite DTU par défaut ───
  // Arrondi à 1 cm inférieur pour rester strictement sous 0.11 m.
  const defaultSpacing = Math.floor(MAX_BALUSTER_GAP * 100) / 100;
  const balustreSpacing = requestedSpacing && requestedSpacing > 0
    ? Math.min(requestedSpacing, defaultSpacing)
    : defaultSpacing;

  // ── Poteaux ───────────────────────────────────────────────────
  // NF DTU 36.3 P3 §C + MAX_POST_SPACING :
  //   intervals = ceil(perimeter / MAX_POST_SPACING)
  //   postCount = intervals + 1 (un poteau à chaque extrémité)
  // Invariant : postCount >= 2 dès que perimeter > 0.
  let postCount;
  if (effectivePerimeter <= 0) {
    postCount = 0;
  } else {
    const intervals = Math.max(1, Math.ceil(effectivePerimeter / MAX_POST_SPACING));
    postCount = intervals + 1;
  }

  const postLength = r3(effectiveHeight + POST_EMBED);

  // ── Lisses (haute + basse obligatoires) ──────────────────────
  // NF DTU 36.3 P3 §C.2 : main courante + lisse basse en sous-face.
  const railCount = 2;
  const railLength = r3(effectivePerimeter * railCount);

  // ── Balustres ────────────────────────────────────────────────
  // Nombre par travée = ceil(entraxe_max / espacement_cible) - 1
  const bayCount = Math.max(0, postCount - 1);
  const balustrePerBay = computeBalustrePerBay(balustreSpacing);
  const balustreCount = balustrePerBay * bayCount;
  const balustreLength = r3(effectiveHeight - 2 * RAIL_SECTION_H);

  // ── Geometry 3D (optionnelle) ────────────────────────────────
  let geometry = { posts: [], rails: [], balustres: [] };
  if (Array.isArray(sides) && sides.length > 0) {
    geometry = buildGeometry(sides, effectiveHeight, postLength, balustreLength);
  }

  return {
    // ── BOM — Pièces bois ──────────────────────────────────
    postCount,
    postLength,       // longueur unitaire en m
    railCount,
    railLength,       // longueur totale lisses en m
    balustreCount,
    balustreLength,   // longueur unitaire en m

    // ── Récap géométrique ──────────────────────────────────
    perimeter: r3(effectivePerimeter),
    height: effectiveHeight,
    balustreSpacing,

    // ── Geometry 3D ────────────────────────────────────────
    geometry,
  };
}
