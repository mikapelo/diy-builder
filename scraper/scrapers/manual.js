/**
 * manual.js — Scraper manuel (saisie directe dans prices-override.json)
 *
 * Utilisé comme fallback pour les enseignes bloquées (ex: Leroy Merlin / Datadome)
 * ou pour corriger ponctuellement un prix scrappé incorrect.
 *
 * Interface identique aux autres scrapers :
 *   scrapeManual() → { materialId: { storeId: price } }
 *
 * Source de données : ../prices-override.json
 * Format du fichier :
 *   {
 *     "prices": {
 *       "chevron_60x80":  { "leroymerlin": 3.47 },
 *       "lame_terrasse":  { "leroymerlin": 13.00, "castorama": 11.90 },
 *       ...
 *     }
 *   }
 *
 * Priorité dans le pipeline : appliqué EN DERNIER, après tous les scrapers
 * automatiques. Un prix scrappé avec succès écrase l'override correspondant.
 * Un prix absent du scraping (ex: LM bloqué) conserve la valeur manuelle.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OVERRIDE_PATH = join(__dirname, '../prices-override.json');

export async function scrapeManual() {
  if (!existsSync(OVERRIDE_PATH)) {
    console.warn('  [manual] Aucun fichier prices-override.json trouvé, ignoré.');
    return {};
  }

  let data;
  try {
    data = JSON.parse(readFileSync(OVERRIDE_PATH, 'utf8'));
  } catch (err) {
    console.warn(`  [manual] Erreur lecture prices-override.json : ${err.message}`);
    return {};
  }

  const prices = data.prices ?? {};
  const entries = Object.entries(prices);

  if (entries.length === 0) {
    console.warn('  [manual] prices-override.json vide, ignoré.');
    return {};
  }

  const byStore = {};
  for (const [materialId, stores] of entries) {
    for (const [storeId, price] of Object.entries(stores)) {
      if (typeof price === 'number' && price > 0) {
        if (!byStore[storeId]) byStore[storeId] = 0;
        byStore[storeId]++;
      }
    }
  }

  const storeSummary = Object.entries(byStore)
    .map(([s, n]) => `${s}: ${n}`)
    .join(', ');
  console.log(`  [manual] ${entries.length} matériaux chargés (${storeSummary})`);

  return prices;
}
