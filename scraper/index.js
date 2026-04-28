/**
 * index.js — Orchestrateur du scraper DIY Builder
 *
 * Modes :
 *   node index.js            → lance le cron (toutes les semaines)
 *   node index.js --once     → une seule exécution immédiate
 *   node index.js --dry-run  → teste la connectivité sans écrire le cache
 *
 * Sorties :
 *   ../frontend/public/prices-cache.json  ← lu par l'API Next.js
 *
 * Pipeline :
 *   1. Fetch HTML/headless sur chaque enseigne (en parallèle partiel)
 *   2. Merge sur la base statique materialPrices.js
 *   3. Écriture du cache JSON avec date + métadonnées
 */

import cron        from 'node-cron';
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import { mergePrices }       from './normalizer.js';
import { scrapeCastorama }   from './scrapers/castorama.js';
import { scrapeLeroyMerlin } from './scrapers/leroymerlin.js';
import { scrapeBricodepot }  from './scrapers/bricodepot.js';
import { scrapeManoMano }    from './scrapers/manomano.js';
import { scrapePointP }      from './scrapers/pointp.js';
import { scrapeGedimat }     from './scrapers/gedimat.js';
import { scrapeChausson }    from './scrapers/chausson.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Chemin vers le cache (lu par le frontend Next.js)
const CACHE_PATH = join(__dirname, '../frontend/public/prices-cache.json');

// Chemin vers la base statique (fallback)
const STATIC_PATH = join(__dirname, '../frontend/lib/materialPrices.js');

// Chemin vers l'override manuel (prix saisis à la main, ex: LM bloqué)
const OVERRIDE_PATH = join(__dirname, 'prices-override.json');

/**
 * Charge les MATERIAL_PRICES statiques via dynamic import
 * (le fichier est un ES module Next.js avec alias @/).
 */
async function loadStaticPrices() {
  // On lit le fichier et extrait le tableau avec une regex légère
  // pour éviter les dépendances sur le resolver Next.js
  const src = readFileSync(STATIC_PATH, 'utf8');
  const match = src.match(/export\s+const\s+MATERIAL_PRICES\s*=\s*(\[[\s\S]+?\]);/);
  if (!match) throw new Error('MATERIAL_PRICES introuvable dans materialPrices.js');
  return eval(match[1]); // eslint-disable-line no-eval
}

/**
 * Écrit le cache JSON (crée aussi le dossier public/ si absent).
 */
function writeCache(prices, meta = {}) {
  const payload = {
    date:    new Date().toISOString().split('T')[0],
    updated: new Date().toISOString(),
    sources: meta.sources ?? [],
    prices,
  };
  writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2));
  console.log(`[scraper] ✅ Cache écrit → ${CACHE_PATH}`);
  console.log(`[scraper]    ${prices.filter(p => p.scraped).length}/${prices.length} matériaux avec prix live`);
}

/**
 * Exécution principale : lance tous les scrapers et fusionne les résultats.
 */
async function run(dryRun = false) {
  console.log('\n[scraper] ─────────────────────────────────────────');
  console.log('[scraper] Démarrage mise à jour prix matériaux');
  console.log('[scraper] Date :', new Date().toLocaleString('fr-FR'));
  console.log('[scraper] ─────────────────────────────────────────');

  const staticPrices = await loadStaticPrices();
  const allScraped   = {};
  const successList  = [];
  const failList     = [];

  // ── 1. Castorama (fetch simple, pas de browser) ──────────────
  console.log('\n[castorama] Démarrage...');
  const castoResult = await scrapeCastorama().catch(err => {
    console.error('[castorama] Échec global :', err.message);
    return {};
  });
  const castaCount = Object.keys(castoResult).length;
  if (castaCount > 0) {
    Object.assign(allScraped, castoResult);
    successList.push(`Castorama (${castaCount} prix)`);
  } else {
    failList.push('Castorama');
  }

  // ── 2. Sites Playwright (un seul browser partagé) ────────────
  let browser = null;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=fr-FR'],
    });
  } catch (err) {
    console.warn('\n[playwright] Navigateur indisponible — sites headless ignorés.');
    console.warn('[playwright] Exécutez : cd scraper && npx playwright install');
    failList.push('Brico Dépôt');
  }

  if (browser) {
    try {
      // Leroy Merlin — browser stealth indépendant (playwright-extra)
      console.log('\n[leroymerlin] Démarrage (stealth)...');
      const lmResult = await scrapeLeroyMerlin().catch(err => {
        console.error('[leroymerlin] Échec global :', err.message);
        return {};
      });
      if (Object.keys(lmResult).length > 0) {
        Object.assign(allScraped, deepMerge(allScraped, lmResult));
        successList.push(`Leroy Merlin (${Object.keys(lmResult).length} prix)`);
      } else {
        failList.push('Leroy Merlin (Datadome)');
      }

      // Brico Dépôt
      console.log('\n[bricodepot] Démarrage...');
      const bdResult = await scrapeBricodepot(browser).catch(err => {
        console.error('[bricodepot] Échec global :', err.message);
        return {};
      });
      if (Object.keys(bdResult).length > 0) {
        Object.assign(allScraped, deepMerge(allScraped, bdResult));
        successList.push(`Brico Dépôt (${Object.keys(bdResult).length} prix)`);
      } else {
        failList.push('Brico Dépôt');
      }

      // ManoMano (marketplace — browser stealth indépendant)
      console.log('\n[manomano] Démarrage (stealth)...');
      const mmResult = await scrapeManoMano().catch(err => {
        console.error('[manomano] Échec global :', err.message);
        return {};
      });
      if (Object.keys(mmResult).length > 0) {
        Object.assign(allScraped, deepMerge(allScraped, mmResult));
        successList.push(`ManoMano (${Object.keys(mmResult).length} prix)`);
      } else {
        failList.push('ManoMano');
      }

      // Point.P, Gedimat, Chausson — désactivés (prix sur devis uniquement)
      await scrapePointP(browser);
      await scrapeGedimat(browser);
      await scrapeChausson(browser);

    } finally {
      await browser.close();
    }
  }

  // ── 3. Override manuel (ex: LM bloqué Datadome) ─────────────
  if (existsSync(OVERRIDE_PATH)) {
    try {
      const overrideData = JSON.parse(readFileSync(OVERRIDE_PATH, 'utf8'));
      const overridePrices = overrideData.prices ?? {};
      const overrideCount = Object.values(overridePrices)
        .reduce((n, stores) => n + Object.keys(stores).length, 0);
      // deepMerge(overridePrices, allScraped) : les prix scrappés écrasent les overrides
      // pour la même enseigne. Les matériaux absents du scraping conservent leur valeur manuelle.
      Object.assign(allScraped, deepMerge(overridePrices, allScraped));
      console.log(`[scraper] 📝 Override manuel : ${overrideCount} prix chargés (${OVERRIDE_PATH})`);
    } catch (err) {
      console.warn('[scraper] Override ignoré :', err.message);
    }
  }

  // ── 4. Merge sur la base statique ────────────────────────────
  const mergedPrices = mergePrices(staticPrices, allScraped);

  // ── 5. Rapport ───────────────────────────────────────────────
  console.log('\n[scraper] ─── Résumé ───────────────────────────────');
  console.log('[scraper] ✅ Succès  :', successList.join(', ') || 'aucun');
  console.log('[scraper] ⚠️  Échecs  :', failList.join(', ')   || 'aucun');

  if (dryRun) {
    console.log('[scraper] Mode dry-run — cache non écrit.');
    console.log('[scraper] Aperçu des prix scrappés :');
    Object.entries(allScraped).forEach(([id, stores]) => {
      console.log(`   ${id}:`, JSON.stringify(stores));
    });
    return;
  }

  // ── 6. Écriture cache ─────────────────────────────────────────
  writeCache(mergedPrices, { sources: successList });
}

/** Deep merge pour les objets { materialId: { storeId: price } } */
function deepMerge(base, patch) {
  const result = { ...base };
  for (const [key, val] of Object.entries(patch)) {
    result[key] = { ...(result[key] ?? {}), ...val };
  }
  return result;
}

// ── CLI / Cron ────────────────────────────────────────────────────
const args = process.argv.slice(2);

const onError = err => { console.error('[scraper] Erreur fatale :', err.message); process.exit(1); };

if (args.includes('--dry-run')) {
  run(true).catch(onError);
} else if (args.includes('--once')) {
  run(false).catch(onError);
} else {
  // Mode daemon : exécution immédiate + cron hebdomadaire (lundi 6h)
  console.log('[scraper] Démarrage en mode daemon (cron lundi 6h)');
  run(false).catch(onError);
  cron.schedule('0 6 * * 1', () => run(false).catch(onError));
}
