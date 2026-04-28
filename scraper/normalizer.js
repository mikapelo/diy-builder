/**
 * normalizer.js — Utilitaires de normalisation des prix scrappés
 *
 * Chaque scraper retourne { materialId: { storeId: rawPrice } }.
 * Ce module fusionne ces données sur la base statique de materialPrices.js
 * et normalise les prix (prix/ml pour les pièces vendues à la pièce).
 */

/**
 * Normalise un prix brut en prix unitaire selon l'unité cible.
 * @param {number} rawPrice  — prix brut en €
 * @param {string} unit      — 'm lin.' | 'pcs' | 'm²' | 'lot'
 * @param {number} refLen    — longueur de référence en m (pour 'm lin.')
 * @param {number} refArea   — surface de référence en m² (pour 'm²')
 * @returns {number}
 */
export function normalizePricePerUnit(rawPrice, unit, refLen, refArea) {
  if (unit === 'm lin.' && refLen && refLen > 0) {
    return parseFloat((rawPrice / refLen).toFixed(2));
  }
  if (unit === 'm²' && refArea && refArea > 0) {
    return parseFloat((rawPrice / refArea).toFixed(2));
  }
  return parseFloat(rawPrice.toFixed(2));
}

/**
 * Extrait un prix numérique depuis une chaîne brute.
 * Gère : "13,90 €", "13.90", "13,90", "price: 13.90"
 * @param {string|number} raw
 * @returns {number|null}
 */
export function parsePrice(raw) {
  if (typeof raw === 'number') return isNaN(raw) ? null : raw;
  if (!raw) return null;
  const cleaned = String(raw).replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}

/**
 * Fusionne les prix scrappés sur la liste statique MATERIAL_PRICES.
 * Les prix scrappés écrasent les prix statiques seulement s'ils sont valides.
 *
 * @param {Array}  basePrices   — MATERIAL_PRICES statique
 * @param {Object} scraped      — { materialId: { storeId: price } }
 * @returns {Array}             — nouvelle liste avec scraped: true sur les lignes mises à jour
 */
export function mergePrices(basePrices, scraped) {
  return basePrices.map(mat => {
    const updates = scraped[mat.id];
    if (!updates) return mat;

    const newPrices = { ...mat.prices };
    let updated = false;
    for (const [storeId, price] of Object.entries(updates)) {
      if (price !== null && price > 0) {
        newPrices[storeId] = price;
        updated = true;
      }
    }
    return updated ? { ...mat, prices: newPrices, scraped: true } : mat;
  });
}
