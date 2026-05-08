/**
 * index.js — Orchestrateur du scraper DIY Builder
 *
 * Modes :
 *   node index.js            → lance le cron (toutes les semaines)
 *   node index.js --once     → une seule exécution immédiate
 *   node index.js --dry-run  → teste la connectivité sans écrire de fichier
 *   node index.js --no-push  → écrit materialPrices.js mais ne pushe pas
 *
 * Pipeline (Option A — scraper → commit → Vercel auto-deploy) :
 *   1. Fetch HTML/headless sur chaque enseigne (en parallèle partiel)
 *   2. Merge sur la base statique materialPrices.js
 *   3. Réécriture de materialPrices.js avec les prix mis à jour
 *   4. git commit + git push → Vercel détecte et rebuilde automatiquement
 *
 * Pas de cache JSON intermédiaire — materialPrices.js EST la source de vérité.
 */

import cron              from 'node-cron';
import { chromium }      from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync }      from 'child_process';

import { mergePrices }       from './normalizer.js';
import { scrapeCastorama }   from './scrapers/castorama.js';
import { scrapeLeroyMerlin } from './scrapers/leroymerlin.js';
import { scrapeBricodepot }  from './scrapers/bricodepot.js';
import { scrapeManoMano }    from './scrapers/manomano.js';
import { scrapePointP }      from './scrapers/pointp.js';
import { scrapeGedimat }     from './scrapers/gedimat.js';
import { scrapeChausson }    from './scrapers/chausson.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Chemin vers la source de vérité des prix
const STATIC_PATH = join(__dirname, '../frontend/lib/materialPrices.js');

// Chemin vers l'override manuel (prix saisis à la main, ex: LM bloqué Datadome)
const OVERRIDE_PATH = join(__dirname, 'prices-override.json');

// Racine du repo git (pour le commit)
const REPO_ROOT = join(__dirname, '..');

/**
 * Charge les MATERIAL_PRICES statiques depuis materialPrices.js.
 * Parsing léger par regex — évite les dépendances sur le resolver Next.js.
 */
async function loadStaticPrices() {
  const src = readFileSync(STATIC_PATH, 'utf8');
  const match = src.match(/export\s+const\s+MATERIAL_PRICES\s*=\s*(\[[\s\S]+?\]);/);
  if (!match) throw new Error('MATERIAL_PRICES introuvable dans materialPrices.js');
  return eval(match[1]); // eslint-disable-line no-eval
}

/**
 * Réécrit materialPrices.js avec les prix fusionnés.
 *
 * Stratégie : mise à jour ligne par ligne — on préserve tous les commentaires
 * et la structure du fichier. Seuls les blocs `prices: { ... }` et le flag
 * `scraped:` sont remplacés sur les lignes concernées.
 *
 * Pré-requis : chaque entrée MATERIAL_PRICES tient sur une seule ligne
 * (format actuel du fichier).
 *
 * @param {Array} mergedPrices — résultat de mergePrices()
 * @param {string} date — date ISO courte (YYYY-MM-DD)
 */
function writeMaterialPrices(mergedPrices, date) {
  let src = readFileSync(STATIC_PATH, 'utf8');

  // 1. Mettre à jour PRICES_DATE
  src = src.replace(
    /export\s+const\s+PRICES_DATE\s*=\s*'[\d-]+'/,
    `export const PRICES_DATE = '${date}'`
  );

  // 2. Pour chaque matériau mis à jour, remplacer prices: {...} et scraped:
  for (const mat of mergedPrices) {
    // Construire la chaîne prices: { store: val, ... }
    const pricesStr = Object.entries(mat.prices)
      .map(([store, val]) => `${store}: ${val}`)
      .join(', ');
    const newPricesBlock = `prices: { ${pricesStr} }`;

    // Regex : trouve la ligne contenant id: 'materialId' et remplace
    // le bloc prices: { ... } existant (inline, sur la même ligne)
    const idPattern = new RegExp(
      `(\\{[^}]*?id:\\s*'${escapeRegex(mat.id)}'[^\\n]*?)prices:\\s*\\{[^}]*\\}`,
      'g'
    );

    // Remplace aussi scraped: true/false si la ligne en contient un
    src = src.replace(idPattern, (_, prefix) => {
      // Mettre à jour scraped: dans le prefix si présent
      const updatedPrefix = prefix.replace(
        /scraped:\s*(true|false)/,
        `scraped: ${mat.scraped ? 'true' : 'false'}`
      );
      return `${updatedPrefix}${newPricesBlock}`;
    });
  }

  writeFileSync(STATIC_PATH, src, 'utf8');

  const updatedCount = mergedPrices.filter(p => p.scraped).length;
  console.log(`[scraper] ✅ materialPrices.js mis à jour (${updatedCount}/${mergedPrices.length} prix live)`);
}

/**
 * Commit et push materialPrices.js vers le dépôt git distant.
 * Vercel détecte le push sur main et rebuilde automatiquement.
 *
 * @param {string} date — date courte pour le message de commit
 * @param {string[]} sources — liste des enseignes mises à jour
 */
function gitCommitAndPush(date, sources) {
  const sourcesLabel = sources.length > 0 ? sources.join(', ') : 'overrides manuels';

  try {
    // Vérifier s'il y a des changements à commiter
    const status = execSync('git diff --name-only frontend/lib/materialPrices.js', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();

    if (!status) {
      console.log('[git] Aucun changement dans materialPrices.js — commit ignoré.');
      return;
    }

    execSync('git add frontend/lib/materialPrices.js', { cwd: REPO_ROOT, stdio: 'pipe' });

    const msg = `chore(prices): mise à jour automatique scraper ${date}\n\nSources : ${sourcesLabel}\n[skip ci]`;
    execSync(`git commit -m ${JSON.stringify(msg)}`, { cwd: REPO_ROOT, stdio: 'pipe' });

    execSync('git push', { cwd: REPO_ROOT, stdio: 'inherit' });

    console.log('[git] ✅ Commit + push → Vercel rebuild déclenché');
  } catch (err) {
    console.error('[git] ❌ Échec commit/push :', err.message.split('\n')[0]);
    console.error('[git]    Les prix ont été écrits dans materialPrices.js mais non pushés.');
    console.error('[git]    Pushez manuellement : git push');
  }
}

/** Échappe les caractères spéciaux regex dans un ID matériau */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Exécution principale : lance tous les scrapers et fusionne les résultats.
 * @param {boolean} dryRun   — si true, n'écrit rien (log seulement)
 * @param {boolean} noPush   — si true, écrit materialPrices.js mais ne pushe pas
 */
async function run(dryRun = false, noPush = false) {
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
  const castoCount = Object.keys(castoResult).length;
  if (castoCount > 0) {
    Object.assign(allScraped, castoResult);
    successList.push(`Castorama (${castoCount} prix)`);
  } else {
    failList.push('Castorama');
  }

  // ── 2. Sites Playwright (un seul browser partagé pour BD) ────
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
      // Les prix scrappés ont priorité sur les overrides pour la même enseigne.
      // Les matériaux absents du scraping conservent leur valeur manuelle.
      Object.assign(allScraped, deepMerge(overridePrices, allScraped));
      console.log(`[scraper] 📝 Override manuel : ${overrideCount} prix chargés`);
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
    console.log('[scraper] Mode dry-run — aucun fichier écrit.');
    console.log('[scraper] Aperçu des prix scrappés :');
    Object.entries(allScraped).forEach(([id, stores]) => {
      console.log(`   ${id}:`, JSON.stringify(stores));
    });
    return;
  }

  // ── 6. Réécriture materialPrices.js + commit + push ──────────
  const today = new Date().toISOString().split('T')[0];
  writeMaterialPrices(mergedPrices, today);

  if (!noPush) {
    gitCommitAndPush(today, successList);
  } else {
    console.log('[scraper] Mode --no-push — commit ignoré. Pushez manuellement si besoin.');
  }
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

const dryRun = args.includes('--dry-run');
const noPush = args.includes('--no-push');

if (dryRun) {
  run(true, false).catch(onError);
} else if (args.includes('--once')) {
  run(false, noPush).catch(onError);
} else {
  // Mode daemon : exécution immédiate + cron hebdomadaire (lundi 6h)
  console.log('[scraper] Démarrage en mode daemon (cron lundi 6h)');
  run(false, noPush).catch(onError);
  cron.schedule('0 6 * * 1', () => run(false, noPush).catch(onError));
}
