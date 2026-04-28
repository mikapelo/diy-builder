/**
 * services/api.js
 * ─────────────────────────────────────────────────────────────
 * Couche de communication avec le backend DIY Builder.
 * Centralise toutes les requêtes HTTP — un seul endroit à modifier
 * si l'URL de base ou les endpoints changent.
 *
 * Ajouter ici les appels pour : cabanon, pergola, clôture…
 * ─────────────────────────────────────────────────────────────
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Calcule une terrasse bois.
 * @param {{ largeur: number, longueur: number, type_bois: string }} params
 * @returns {Promise<Object>} — réponse complète du backend
 * @throws {Error} — message d'erreur lisible côté UI
 */
export async function calculerTerrasseAPI({ largeur, longueur, type_bois }) {
  const res = await fetch(`${API_URL}/api/calcul-terrasse`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ largeur, longueur, type_bois }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.erreurs?.join(' ') || data.message || 'Erreur de calcul.');
  }

  return data;
}

// À venir :
// export async function calculerCabanonAPI(params) { ... }
// export async function calculerPergolaAPI(params) { ... }
// export async function calculerClotureAPI(params) { ... }
