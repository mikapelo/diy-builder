/**
 * modules/dalle/engine.js — Moteur de calcul Dalle béton V1
 *
 * Dalle béton désolidarisée rectangulaire extérieure (cour, parking,
 * abri voiture, allée). Calcule volumes, joints de fractionnement,
 * treillis soudé et géométrie simplifiée.
 *
 * Source : NF DTU 13.3 P1-1 (décembre 2021) — Travaux de dallages,
 * conception, calcul et exécution.
 *
 * Convention d'axes :
 *   X = largeur
 *   Z = profondeur
 *   Y = vertical (épaisseur)
 *
 * NE CONTIENT PAS de Three.js — moteur pur.
 */

import {
  EPAISSEUR_PIETONNE,
  EPAISSEUR_VEHICULE,
  EPAISSEUR_PL,
  JOINT_AREA_PIETON,
  JOINT_AREA_VEHICULE,
  FORME_THICKNESS,
  SAC_BETON_VOLUME,
  TOUPIE_VOLUME_THRESHOLD,
  TREILLIS_SURFACE_THRESHOLD,
  TREILLIS_OVERLAP_FACTOR,
} from '@/lib/dalleConstants.js';

/** Arrondi à 3 décimales — élimine les artefacts IEEE 754 */
function r3(v) { return +v.toFixed(3); }
/** Arrondi à 2 décimales — pour surfaces et volumes lisibles */
function r2(v) { return +v.toFixed(2); }

/**
 * Retourne l'épaisseur réglementaire selon l'usage de la dalle.
 * Source : DTU 13.3 §5 — Dimensionnement du dallage.
 *
 * @param {'pietonne'|'vehicule'|'pl'} usage
 * @returns {number} épaisseur (m)
 */
export function getEpaisseur(usage) {
  if (usage === 'vehicule') return EPAISSEUR_VEHICULE;
  if (usage === 'pl')       return EPAISSEUR_PL;
  return EPAISSEUR_PIETONNE;
}

/**
 * Retourne la surface max entre joints de fractionnement selon l'usage.
 * Source : DTU 13.3 §6 — Joints.
 *
 * @param {'pietonne'|'vehicule'|'pl'} usage
 * @returns {number} surface max (m²)
 */
export function getJointArea(usage) {
  if (usage === 'vehicule' || usage === 'pl') return JOINT_AREA_VEHICULE;
  return JOINT_AREA_PIETON;
}

/**
 * Calcule le nombre de divisions sur un axe pour respecter la surface max
 * entre joints. On cherche le quadrillage le plus économique (moins de joints)
 * qui satisfait l'invariant : panelArea = (width / nx) × (depth / nz) ≤ maxArea.
 *
 * Stratégie : subdiviser équitablement les deux axes, en commençant par
 * diviser le plus long, jusqu'à ce que l'aire de chaque pavé ≤ maxArea.
 *
 * @param {number} width
 * @param {number} depth
 * @param {number} maxArea  Surface max d'un pavé (m²)
 * @returns {{ nx: number, nz: number }} Nombre de pavés en X et Z
 */
export function computeJointGrid(width, depth, maxArea) {
  if (width <= 0 || depth <= 0 || maxArea <= 0) {
    return { nx: 1, nz: 1 };
  }
  let nx = 1;
  let nz = 1;
  while ((width / nx) * (depth / nz) > maxArea) {
    // Subdiviser l'axe dont le segment est actuellement le plus long
    if ((width / nx) >= (depth / nz)) nx += 1;
    else                                nz += 1;
  }
  return { nx, nz };
}

/**
 * Construit les segments de joints (positions des lignes de fractionnement).
 * Chaque joint interne est une ligne complète traversant la dalle.
 *
 * @param {number} width
 * @param {number} depth
 * @param {number} nx  Pavés en X (nombre de joints longitudinaux = nx - 1)
 * @param {number} nz  Pavés en Z (nombre de joints transversaux = nz - 1)
 * @returns {Array<{x1:number,z1:number,x2:number,z2:number}>}
 */
export function buildJointSegments(width, depth, nx, nz) {
  const joints = [];
  // Joints longitudinaux (parallèles à Z) — à x = width * i / nx, i=1..nx-1
  for (let i = 1; i < nx; i++) {
    const x = r3((width * i) / nx);
    joints.push({ x1: x, z1: 0, x2: x, z2: depth });
  }
  // Joints transversaux (parallèles à X) — à z = depth * j / nz, j=1..nz-1
  for (let j = 1; j < nz; j++) {
    const z = r3((depth * j) / nz);
    joints.push({ x1: 0, z1: z, x2: width, z2: z });
  }
  return joints;
}

/**
 * Génère la structure complète d'une dalle béton.
 *
 * @param {number} width            Largeur (m, axe X)
 * @param {number} depth            Profondeur (m, axe Z)
 * @param {object} [options={}]
 * @param {'pietonne'|'vehicule'|'pl'} [options.usage='pietonne']
 * @param {boolean} [options.withTreillis]  Par défaut true si surface > 10 m²
 * @returns {object} Structure complète : quantitatifs + geometry
 */
export function generateDalle(width, depth, options = {}) {
  const usage = options.usage ?? 'pietonne';
  const surface = r2(width * depth);

  // ── Épaisseur et volume béton (DTU 13.3 §5) ─────────────────
  const epaisseur = getEpaisseur(usage);
  const volumeBeton = r3(surface * epaisseur);

  // Bascule sac prêt-à-gâcher (< 3 m³) vers toupie (≥ 3 m³)
  const needsToupie = volumeBeton >= TOUPIE_VOLUME_THRESHOLD;
  const sacsBeton = needsToupie ? 0 : Math.ceil(volumeBeton / SAC_BETON_VOLUME);

  // ── Forme drainante sous dalle (DTU 13.3 §7.3) ──────────────
  const volumeForme = r3(surface * FORME_THICKNESS);

  // ── Joints de fractionnement (DTU 13.3 §6) ──────────────────
  const jointArea = getJointArea(usage);
  const { nx, nz } = computeJointGrid(width, depth, jointArea);
  const jointsSegments = buildJointSegments(width, depth, nx, nz);
  const jointCount = jointsSegments.length;
  // Joints longitudinaux font depth, transversaux font width
  const jointsLongitudinaux = Math.max(0, nx - 1) * depth;
  const jointsTransversaux  = Math.max(0, nz - 1) * width;
  const jointsLinear = r3(jointsLongitudinaux + jointsTransversaux);

  // ── Treillis soudé ST25 (DTU 13.3 §5.4) ─────────────────────
  // Par défaut : treillis si surface > 10 m² (masse critique de retrait).
  const withTreillis = options.withTreillis ?? (surface > TREILLIS_SURFACE_THRESHOLD);
  const treillisSurface = withTreillis
    ? r2(surface * TREILLIS_OVERLAP_FACTOR)
    : 0;

  // ── Geometry object ─────────────────────────────────────────
  const geometry = {
    dimensions: { width, depth, epaisseur },
    joints: jointsSegments,
    surface,
  };

  return {
    // ── BOM ──────────────────────────────────────────────
    surface,
    epaisseur,
    volumeBeton,
    sacsBeton,
    needsToupie,
    volumeForme,
    treillisSurface,
    jointsLinear,
    jointCount,
    usage,

    // ── Geometry ─────────────────────────────────────────
    geometry,
  };
}
