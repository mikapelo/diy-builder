/**
 * formatters.js — Helpers de formatage numérique partagés (UI + PDF)
 *
 * Source unique pour l'affichage des longueurs/quantités dans les
 * composants React (MaterialsList) et les helpers de coût (costCalculator).
 *
 * Convention :
 *   - Séparateur décimal : point "." (cohérent avec le reste des composants
 *     simulateur — ClotureSketch, PergolaSketch, CabanonSketch utilisent tous
 *     `.toFixed(2)` natif). Le PDF a son propre helper `fmtLen` dans
 *     `lib/pdf/pdfHelpers.js` qui utilise la virgule française.
 *   - Précision : 2 décimales par défaut (centimètre près).
 *   - Si la valeur tombe sur un entier, on omet les décimales (4 m, pas 4.00 m).
 *
 * Aucun calcul n'est modifié — ce sont uniquement des helpers de RENDU.
 */

/**
 * Formate une longueur en mètres pour l'affichage UI (sans le suffixe "m").
 * Tolère une valeur en string (déjà pré-formatée par l'engine) ou en number.
 *
 * @param {number|string} m  Longueur en mètres
 * @param {number} [digits=2]  Nombre de décimales max (par défaut 2)
 * @returns {string}  "4.67", "3", "3.5"… sans unité
 */
export function formatLength(m, digits = 2) {
  if (m == null) return '';
  // Si déjà une string non-numérique (rare), retourner tel quel
  const n = typeof m === 'string' ? parseFloat(m) : m;
  if (!isFinite(n)) return String(m);
  const rounded = Math.round(n * 10 ** digits) / 10 ** digits;
  if (rounded === Math.floor(rounded)) return String(rounded);
  return rounded.toFixed(digits);
}

/**
 * Formate une longueur avec le suffixe " m".
 * Pratique pour les labels BOM : `Poteaux (${formatLengthM(4.6666)})` → "Poteaux (4.67 m)".
 *
 * @param {number|string} m  Longueur en mètres
 * @param {number} [digits=2]  Nombre de décimales max
 * @returns {string}  "4.67 m"
 */
export function formatLengthM(m, digits = 2) {
  return `${formatLength(m, digits)} m`;
}
