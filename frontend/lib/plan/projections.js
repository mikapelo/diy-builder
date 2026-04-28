/**
 * projections.js — Fonctions de projection pures pour vues techniques
 *
 * Chaque projection convertit des coordonnées monde (m) en coordonnées écran (mm PDF ou px SVG).
 * Toutes sont des fonctions pures : (config) → (worldX, worldY, worldZ?) → { x, y }
 *
 * Convention :
 *   monde : x = largeur, y = profondeur, z = hauteur
 *   écran : x = droite, y = bas (SVG/PDF)
 */

/**
 * Crée un contexte de projection avec échelle et origine.
 * @param {number} ox     Origine écran X (mm ou px)
 * @param {number} oy     Origine écran Y (bas du dessin, mm ou px)
 * @param {number} scale  Pixels/mm par mètre monde
 * @returns {{ px, py, sc }}
 */
export function createProjectionCtx(ox, oy, scale) {
  return {
    sc: scale,
    /** Monde X → Écran X */
    px: (u) => ox + u * scale,
    /** Monde Z (hauteur) → Écran Y (vers le haut = y diminue) */
    py: (v) => oy - v * scale,
  };
}

/**
 * Calcule l'échelle optimale pour qu'un rectangle monde tienne dans une zone écran.
 * @param {number} worldW   Largeur monde (m)
 * @param {number} worldH   Hauteur monde (m)
 * @param {number} screenW  Largeur écran dispo (mm ou px)
 * @param {number} screenH  Hauteur écran dispo (mm ou px)
 * @param {number} [margin=0.85] Facteur de marge (0..1)
 */
export function fitScale(worldW, worldH, screenW, screenH, margin = 0.85) {
  return Math.min(screenW / worldW, screenH / worldH) * margin;
}

/* ────────────────────────────────────────────────────────────────────
   Projections spécifiques par type de vue
   ──────────────────────────────────────────────────────────────────── */

/**
 * Façade (wall 0) : monde x → écran x, monde z → écran y (vers le haut)
 * Identique à la projection par défaut createProjectionCtx.
 */
export const facadeProjection = createProjectionCtx;

/**
 * Plan de dessus : monde x → écran x, monde y → écran y (vers le bas)
 * @returns {{ px, py, sc }}
 */
export function topProjection(ox, oy, scale) {
  return {
    sc: scale,
    px: (u) => ox + u * scale,
    py: (v) => oy + v * scale,  // y monde vers le bas en écran
  };
}

/**
 * Coupe transversale (sens largeur) : identique à façade (x, z)
 */
export const sectionProjection = createProjectionCtx;

/**
 * Projection oblique (cabinet/cavalier 30°)
 * Projette les 3 dimensions monde sur un plan 2D.
 * @param {number} ox     Origine écran X
 * @param {number} oy     Origine écran Y (bas)
 * @param {number} scale  Échelle
 * @param {number} [angle=30]  Angle de fuite (degrés)
 * @param {number} [ratio=0.5] Facteur de réduction profondeur
 * @returns {{ project(x,y,z) → {x,y}, sc }}
 */
export function obliqueProjection(ox, oy, scale, angle = 30, ratio = 0.5) {
  const rad = (angle * Math.PI) / 180;
  const cosA = Math.cos(rad) * ratio;
  const sinA = Math.sin(rad) * ratio;

  return {
    sc: scale,
    /**
     * @param {number} x  Largeur (m)
     * @param {number} y  Profondeur (m)
     * @param {number} z  Hauteur (m)
     * @returns {{ x: number, y: number }}
     */
    project: (x, y, z) => ({
      x: ox + (x + y * cosA) * scale,
      y: oy - (z + y * sinA) * scale,
    }),
  };
}
