/**
 * utils/format.js
 * ─────────────────────────────────────────────────────────────
 * Fonctions utilitaires de formatage — prix, surfaces, stats.
 * Aucune dépendance React : fonctions pures réutilisables par
 * n'importe quel calculateur (terrasse, cabanon, pergola…).
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Formate un prix avec 2 décimales.
 * @param {number|null} prix
 * @returns {string} ex: "124.50 €"
 */
export function formatPrix(prix) {
  if (prix == null) return '—';
  return `${prix.toFixed(2)} €`;
}

/**
 * Retourne le prix minimum formaté depuis l'objet de détail du comparateur.
 * @param {Object|undefined} detail  ex: { 'Leroy Merlin': 320.5, 'Castorama': 345 }
 * @returns {string} ex: "320 €"
 */
export function getPrixMin(detail) {
  if (!detail) return '—';
  const prices = Object.values(detail);
  if (!prices.length) return '—';
  return `${Math.min(...prices).toFixed(0)} €`;
}

/**
 * Capitalise la première lettre d'une chaîne.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Construit le tableau de stats résumé affiché après un calcul.
 * @param {Object} resultat — réponse complète du backend
 * @returns {Array<{ val: string|number, label: string, icon: string }>}
 */
export function getStatsResume(resultat) {
  if (!resultat) return [];
  return [
    {
      val:   `${resultat.projet.surface_m2} m²`,
      label: 'Surface totale',
      icon:  '📐',
    },
    {
      val:   resultat.materiaux.reduce((s, m) => s + m.quantite, 0),
      label: 'Pièces à acheter',
      icon:  '📦',
    },
    {
      val:   getPrixMin(resultat.comparateur_prix?.detail),
      label: 'Meilleur prix',
      icon:  '💰',
    },
    {
      val:   capitalize(resultat.projet.type_bois),
      label: 'Type de bois',
      icon:  '🌲',
    },
  ];
}
