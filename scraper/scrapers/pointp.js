/**
 * pointp.js — Scraper Point.P
 *
 * ⚠️  Prix sur devis uniquement (enseigne pro) — aucun prix public affiché.
 * Désactivé. Retourne toujours {}.
 */

export async function scrapePointP(_browser) {
  console.warn('  [pointp] Enseigne pro — prix sur devis uniquement, ignoré.');
  return {};
}
