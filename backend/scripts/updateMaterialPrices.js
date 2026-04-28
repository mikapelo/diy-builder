#!/usr/bin/env node
/**
 * backend/scripts/updateMaterialPrices.js
 * ═══════════════════════════════════════════════════════════════
 * Scrape Castorama + ManoMano et met à jour leurs prix respectifs dans
 * frontend/lib/materialPrices.js avec les valeurs réelles.
 *
 * UTILISATION
 * ───────────
 *   # Scrape + patch direct (nécessite USE_PLAYWRIGHT=true dans .env)
 *   USE_PLAYWRIGHT=true node scripts/updateMaterialPrices.js
 *
 *   # Scrape + sauvegarder les données brutes sans patcher
 *   USE_PLAYWRIGHT=true node scripts/updateMaterialPrices.js --dry-run
 *
 *   # Scrape + sauvegarder les données brutes ET patcher
 *   USE_PLAYWRIGHT=true node scripts/updateMaterialPrices.js --save-data
 *
 *   # Patcher depuis un fichier JSON sauvegardé (sans re-scraper)
 *   node scripts/updateMaterialPrices.js --from-file data/scrape_YYYY-MM-DD.json
 *
 * ALGORITHME DE SÉLECTION DU PRIX
 * ────────────────────────────────
 * Pour chaque materialId, les produits collectés sont convertis
 * dans l'unité cible (ml, pcs, m², lot, sac) en utilisant le
 * champ `longueur` extrait du nom produit :
 *
 *   unit='m lin.'  → prix_ml = prix / longueur  (si longueur > 0)
 *   unit='pcs'     → cherche longueur ≈ refLen (±30%),
 *                    ou scale par refLen/longueur si longueur connue
 *   unit=other     → prix brut (m², lot, sac, m³)
 *
 * Filtre anti-outlier : garde les prix dans [20 %, 300 %] du prix
 * Castorama actuel. Si aucun produit passe le filtre, le prix est
 * conservé intact et un avertissement est émis.
 *
 * Prix retenu = médiane des prix convertis valides.
 * ═══════════════════════════════════════════════════════════════
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs   = require('fs');
const path = require('path');

// ── Chemins ───────────────────────────────────────────────────
const PRICES_FILE   = path.join(__dirname, '..', '..', 'frontend', 'lib', 'materialPrices.js');
const DATA_DIR      = path.join(__dirname, '..', 'data');
const CATALOGUE_PATH = path.join(__dirname, '..', 'scrapers', 'catalogue.js');

// ── Parse flags CLI ───────────────────────────────────────────
const args      = process.argv.slice(2);
const DRY_RUN   = args.includes('--dry-run');
const SAVE_DATA = args.includes('--save-data');
const FROM_FILE_IDX = args.indexOf('--from-file');
const FROM_FILE = FROM_FILE_IDX !== -1 ? args[FROM_FILE_IDX + 1] : null;
const HELP      = args.includes('--help') || args.includes('-h');

if (HELP) {
  console.log(`
DIY Builder — Mise à jour des prix materialPrices.js depuis Castorama + ManoMano

Usage :
  node scripts/updateMaterialPrices.js [options]

Options :
  --dry-run              Scrape et affiche le diff sans écrire le fichier
  --save-data            Sauvegarde les données brutes dans backend/data/
  --from-file <fichier>  Charge les données depuis un fichier JSON (pas de scrape)
  --help                 Ce message

Requiert USE_PLAYWRIGHT=true dans .env (sauf avec --from-file).
  `);
  process.exit(0);
}

// ── Valider l'environnement ───────────────────────────────────
if (!FROM_FILE) {
  const hasPW = process.env.USE_PLAYWRIGHT?.toLowerCase() === 'true';
  const hasSB = !!process.env.SCRAPINGBEE_API_KEY;
  if (!hasPW && !hasSB) {
    console.error('❌ Aucun moteur de scraping configuré.');
    console.error('   → USE_PLAYWRIGHT=true          (pour Castorama)');
    console.error('   → SCRAPINGBEE_API_KEY=<clé>    (pour LM + BD)');
    console.error('   Ou utilisez --from-file pour charger un JSON existant.');
    process.exit(1);
  }
}

// ── Charger le catalogue (mapping materialId → unit info) ─────
const { CATALOGUE } = require(CATALOGUE_PATH);

// ── Helpers ───────────────────────────────────────────────────

/** Médiane d'un tableau de nombres */
function median(arr) {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Arrondi à 2 décimales au plus, mais sans zéro inutile */
function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Convertit le prix brut d'un produit scrapé en prix dans l'unité cible.
 *
 * @param {number} prix      — prix brut du produit (€)
 * @param {number} longueur  — longueur extraite du nom (m), 0 si inconnue
 * @param {string} unit      — unité cible de materialPrices.js
 * @param {number} refLen    — longueur de référence (pour unit='pcs'), en m
 * @returns {number|null}    — prix dans l'unité cible, ou null si impossible
 */
function convertirPrix(prix, longueur, unit, refLen) {
  if (!prix || prix <= 0) return null;

  // extraireLongueur() retourne des millimètres — convertir en mètres ici
  const longueurM = longueur > 0 ? longueur / 1000 : 0;

  switch (unit) {
    case 'm lin.': {
      // Le produit est vendu à la pièce (3m, 4m, etc.) ou au ml.
      // Si longueur connue : convertir en €/ml
      if (longueurM > 0) return prix / longueurM;
      // Sans longueur, on ne peut pas convertir — ignorer
      return null;
    }

    case 'pcs': {
      // Produit vendu à la pièce.
      if (!refLen) {
        // Pas de longueur de référence → prix direct
        return prix;
      }
      // Avec refLen (en mètres), chercher les pièces de longueur proche
      if (longueurM > 0) {
        const ratio = longueurM / refLen;
        // Pièce dans ±30% de la longueur de référence → prix direct
        if (ratio >= 0.70 && ratio <= 1.30) return prix;
        // Pièce plus longue ou plus courte → scaler (prorata linéaire)
        return prix * (refLen / longueurM);
      }
      // Sans longueur : prendre le prix direct (on espère que c'est la bonne longueur)
      return prix;
    }

    case 'm²':
    case 'lot':
    case 'sac':
    case 'm³':
      // Prix direct — le produit est censé être vendu dans cette unité
      return prix;

    default:
      return prix;
  }
}

/**
 * Pour un materialId, sélectionne le meilleur prix Castorama parmi
 * les produits scrapés. Applique la conversion d'unité et filtre les
 * outliers avant de prendre la médiane.
 *
 * @param {string}   materialId   — ID du matériau (ex: 'montant_45x90')
 * @param {Object[]} produits     — tous les produits scrapés pour ce materialId
 * @param {string}   unit         — unité cible ('m lin.', 'pcs', 'm²', ...)
 * @param {number}   refLen       — longueur de référence en m (pour pcs)
 * @param {number}   prixActuel   — prix Castorama actuel dans materialPrices.js
 * @returns {{ prix: number|null, source: string, nbCandidats: number }}
 */
function selectionnerPrix(materialId, produits, unit, refLen, prixActuel) {
  if (produits.length === 0) {
    return { prix: null, source: 'no_products', nbCandidats: 0 };
  }

  // Convertir chaque produit dans l'unité cible
  const convertis = [];
  for (const p of produits) {
    const pConv = convertirPrix(p.prix, p.longueur || 0, unit, refLen);
    if (pConv !== null && pConv > 0) {
      convertis.push({ pConv, produit: p });
    }
  }

  if (convertis.length === 0) {
    return { prix: null, source: 'conversion_failed', nbCandidats: 0 };
  }

  // Filtre anti-outlier : [20%, 300%] du prix actuel
  // (si pas de prix actuel, accepter tout dans [0.10, 10000])
  const minAccept = prixActuel ? prixActuel * 0.20 : 0.10;
  const maxAccept = prixActuel ? prixActuel * 3.00 : 10000;

  const filtres = convertis.filter(({ pConv }) => pConv >= minAccept && pConv <= maxAccept);

  if (filtres.length === 0) {
    // Tous sont hors fourchette → prendre le moins cher converti quand même
    // mais le signaler comme suspect
    const allPrices = convertis.map(c => c.pConv);
    const med = median(allPrices);
    return {
      prix:        round2(med),
      source:      'out_of_range',
      nbCandidats: convertis.length,
    };
  }

  const prixFiltres = filtres.map(c => c.pConv);
  const med = median(prixFiltres);

  return {
    prix:        round2(med),
    source:      'ok',
    nbCandidats: filtres.length,
  };
}

// ── Lecture / patch de materialPrices.js ──────────────────────

/**
 * Lit materialPrices.js et renvoie son contenu sous forme de texte.
 */
function lireMaterialPrices() {
  return fs.readFileSync(PRICES_FILE, 'utf8');
}

/**
 * Met à jour le prix d'une enseigne et le flag scraped pour un materialId.
 * Opère sur les lignes du fichier (chaque entrée = 1 ligne).
 *
 * @param {string} contenu     — contenu actuel du fichier
 * @param {string} materialId  — ID du matériau à mettre à jour
 * @param {number} newPrice    — nouveau prix €
 * @param {string} enseigne    — champ à patcher ('castorama' | 'manomano' | ...)
 * @returns {{ contenu: string, changed: boolean, oldPrice: number|null }}
 */
function patcherPrix(contenu, materialId, newPrice, enseigne = 'castorama') {
  const lines = contenu.split('\n');
  let changed   = false;
  let oldPrice  = null;

  const reOld = new RegExp(`${enseigne}:\\s*([\\d.]+)`);
  const reNew = new RegExp(`${enseigne}:\\s*[\\d.]+`);

  for (let i = 0; i < lines.length; i++) {
    // Cherche la ligne contenant cet ID exact
    if (!lines[i].includes(`id: '${materialId}'`)) continue;

    const originalLine = lines[i];

    // Extraire l'ancien prix de l'enseigne
    const matchOld = originalLine.match(reOld);
    if (matchOld) oldPrice = parseFloat(matchOld[1]);

    // Ne pas changer si le prix est identique (à 1% près)
    if (oldPrice !== null && Math.abs(newPrice - oldPrice) / oldPrice < 0.01) {
      break;
    }

    // Remplacer le prix de l'enseigne
    const updated = originalLine.replace(reNew, `${enseigne}: ${newPrice}`);

    // Marquer comme scraped: true (si scraped: false)
    lines[i] = updated.replace(/scraped:\s*false/, 'scraped: true');
    changed = lines[i] !== originalLine;
    break;
  }

  return { contenu: lines.join('\n'), changed, oldPrice };
}

/** Met à jour PRICES_DATE dans le fichier */
function patcherDate(contenu, dateStr) {
  return contenu.replace(
    /export const PRICES_DATE = '[^']+'/,
    `export const PRICES_DATE = '${dateStr}'`
  );
}

// ── Point d'entrée principal ──────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('  DIY Builder — Mise à jour materialPrices.js');
  console.log(`  Mode : ${FROM_FILE ? `--from-file ${path.basename(FROM_FILE)}` : DRY_RUN ? '--dry-run' : 'apply'}`);
  console.log('═══════════════════════════════════════════════\n');

  // ── 1. Vérifier les crédits ScrapingBee si configuré ─────
  if (process.env.SCRAPINGBEE_API_KEY && !FROM_FILE) {
    const { verifierCredits } = require('../scrapers/scrapingbee-client');
    const credits = await verifierCredits();
    if (credits !== null && credits < 100) {
      console.warn(`⚠️  Seulement ${credits} crédits restants — un run complet coûte ~360 crédits.`);
    }
  }

  // ── 2. Obtenir les produits scrapés ───────────────────────
  let produits = [];

  if (FROM_FILE) {
    // Charger depuis un fichier JSON sauvegardé
    const filePath = path.isAbsolute(FROM_FILE) ? FROM_FILE : path.join(process.cwd(), FROM_FILE);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Fichier introuvable : ${filePath}`);
      process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    produits = Array.isArray(raw) ? raw : raw.produits || [];
    console.log(`📂 ${produits.length} produits chargés depuis ${path.basename(filePath)}\n`);

  } else {
    const hasPW = process.env.USE_PLAYWRIGHT?.toLowerCase() === 'true';
    const hasSB = !!process.env.SCRAPINGBEE_API_KEY;

    // ── Castorama + ManoMano via Playwright ───────────────
    if (hasPW) {
      console.log('🔵 Scraping Castorama (Playwright + stealth)…\n');
      const { scrapeCastorama } = require('../scrapers/castorama');
      const resCasto = await scrapeCastorama();
      produits.push(...resCasto.produits);
      console.log(`✅ Castorama : ${resCasto.produits.length} produits\n`);

      console.log('🟣 Scraping ManoMano (Playwright + stealth)…\n');
      const { scrapeManoMano } = require('../scrapers/manomano');
      const resMM = await scrapeManoMano();
      produits.push(...resMM.produits);
      console.log(`✅ ManoMano : ${resMM.produits.length} produits\n`);

      const { closeBrowser } = require('../scrapers/playwright-client');
      await closeBrowser();
    }

    // ── Leroy Merlin + Brico Dépôt via ScrapingBee ────────
    if (hasSB) {
      console.log('🐝 Scraping Leroy Merlin (ScrapingBee)…\n');
      const { scrapeLeroyMerlin } = require('../scrapers/leroymerlin');
      const resLM = await scrapeLeroyMerlin();
      produits.push(...resLM.produits);
      console.log(`✅ Leroy Merlin : ${resLM.produits.length} produits\n`);

      console.log('🐝 Scraping Brico Dépôt (ScrapingBee)…\n');
      const { scrapeBricoDepot } = require('../scrapers/bricodepot');
      const resBD = await scrapeBricoDepot();
      produits.push(...resBD.produits);
      console.log(`✅ Brico Dépôt : ${resBD.produits.length} produits\n`);
    }

    if (produits.length === 0) {
      console.error('❌ Aucun produit scrapé. Vérifiez USE_PLAYWRIGHT et SCRAPINGBEE_API_KEY.');
      process.exit(1);
    }

    console.log(`📦 Total : ${produits.length} produits scrapés\n`);

    // Sauvegarder si demandé
    if (SAVE_DATA || DRY_RUN) {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      const dateStr  = new Date().toISOString().slice(0, 10);
      const dataFile = path.join(DATA_DIR, `scrape_all_${dateStr}.json`);
      fs.writeFileSync(dataFile, JSON.stringify(produits, null, 2), 'utf8');
      console.log(`💾 Données sauvegardées : backend/data/${path.basename(dataFile)}\n`);
    }
  }

  if (produits.length === 0) {
    console.error('❌ Aucun produit disponible. Vérifiez le scraper.');
    process.exit(1);
  }

  // ── 2. Grouper les produits par enseigne × materialId ────
  const parCastoId = {};  // Castorama uniquement
  const parMMId    = {};  // ManoMano uniquement
  for (const p of produits) {
    if (!p.materialId) continue;
    const mag = (p.magasin || '').toLowerCase();
    if (mag === 'castorama') {
      if (!parCastoId[p.materialId]) parCastoId[p.materialId] = [];
      parCastoId[p.materialId].push(p);
    } else if (mag === 'manomano') {
      if (!parMMId[p.materialId]) parMMId[p.materialId] = [];
      parMMId[p.materialId].push(p);
    }
  }
  // Rétrocompat : parMaterialId = union (pour éventuels --from-file anciens)
  const parMaterialId = {};
  for (const p of produits) {
    if (!p.materialId) continue;
    if (!parMaterialId[p.materialId]) parMaterialId[p.materialId] = [];
    parMaterialId[p.materialId].push(p);
  }

  // ── 3. Lire materialPrices.js ─────────────────────────────
  if (!fs.existsSync(PRICES_FILE)) {
    console.error(`❌ Fichier introuvable : ${PRICES_FILE}`);
    process.exit(1);
  }
  let contenu = lireMaterialPrices();

  // ── 4. Construire la table unit/refLen depuis le fichier ──
  // Plutôt que de parser le JS, on extrait unit et refLen par regex
  const unitMap   = {};
  const refLenMap = {};
  const prixMap   = {};   // prix castorama actuels (filtre anti-outlier)
  const prixMapMM = {};   // prix manomano actuels  (filtre anti-outlier)

  for (const line of contenu.split('\n')) {
    // Cherche les lignes de la forme : { id: 'xxx', ..., unit: 'yyy', ... }
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (!idMatch) continue;
    const id = idMatch[1];

    const unitMatch   = line.match(/unit:\s*'([^']+)'/);
    if (unitMatch) unitMap[id] = unitMatch[1];

    const refLenMatch = line.match(/refLen:\s*([\d.]+)/);
    if (refLenMatch) refLenMap[id] = parseFloat(refLenMatch[1]);

    const castoMatch  = line.match(/castorama:\s*([\d.]+)/);
    if (castoMatch) prixMap[id] = parseFloat(castoMatch[1]);

    const mmMatch = line.match(/manomano:\s*([\d.]+)/);
    if (mmMatch) prixMapMM[id] = parseFloat(mmMatch[1]);
  }

  // ── 5a. Calculer diff Castorama ──────────────────────────
  console.log('─── Castorama — résultats par matériau ─────────\n');

  const updatesCasto = [];
  let nbOk = 0, nbSkipped = 0, nbNoData = 0;

  for (const cat of CATALOGUE) {
    const { id: materialId } = cat;
    const produitsId  = parCastoId[materialId] || [];
    const unit        = unitMap[materialId]   || 'pcs';
    const refLen      = refLenMap[materialId] || null;
    const prixActuel  = prixMap[materialId]   || null;

    const { prix, source, nbCandidats } = selectionnerPrix(
      materialId, produitsId, unit, refLen, prixActuel
    );

    const icon = prix === null ? '⚠️ ' : source === 'out_of_range' ? '🟡' : '✅';
    const label = `${icon} ${materialId.padEnd(28)} [${unit}]`;

    if (prix === null) {
      console.log(`${label}  → SKIP (${source}, ${produitsId.length} bruts)`);
      nbNoData++;
      continue;
    }

    const diff = prixActuel !== null
      ? ` (${prixActuel}€ → ${prix}€, ${Math.round((prix - prixActuel) / prixActuel * 100) > 0 ? '+' : ''}${Math.round((prix - prixActuel) / prixActuel * 100)}%)`
      : ` (nouveau: ${prix}€)`;

    console.log(`${label}  → ${prix}€  [${nbCandidats} candidats${source === 'out_of_range' ? ', ⚠️ hors fourchette' : ''}]${diff}`);

    if (source === 'out_of_range') {
      console.log(`   ⚠️  Hors fourchette [${prixActuel ? (prixActuel * 0.2).toFixed(2) : 0}–${prixActuel ? (prixActuel * 3).toFixed(2) : '∞'}€]. Vérifier.`);
    }

    updatesCasto.push({ materialId, prix, prixActuel, source });

    if (prixActuel !== null && Math.abs(prix - prixActuel) / prixActuel < 0.01) {
      nbSkipped++;
    } else {
      nbOk++;
    }
  }

  // ── 5b. Calculer diff ManoMano ────────────────────────────
  console.log('\n─── ManoMano — résultats par matériau ──────────\n');

  const updatesMM = [];
  let nbOkMM = 0, nbSkippedMM = 0, nbNoDataMM = 0;

  for (const cat of CATALOGUE) {
    if (cat.stores && !cat.stores.includes('manomano')) continue; // exclu ManoMano
    const { id: materialId } = cat;
    const produitsId  = parMMId[materialId] || [];
    const unit        = unitMap[materialId]   || 'pcs';
    const refLen      = refLenMap[materialId] || null;
    const prixActuel  = prixMapMM[materialId] || null;

    const { prix, source, nbCandidats } = selectionnerPrix(
      materialId, produitsId, unit, refLen, prixActuel
    );

    const icon = prix === null ? '⚠️ ' : source === 'out_of_range' ? '🟡' : '✅';
    const label = `${icon} ${materialId.padEnd(28)} [${unit}]`;

    if (prix === null) {
      console.log(`${label}  → SKIP (${source}, ${produitsId.length} bruts)`);
      nbNoDataMM++;
      continue;
    }

    const diff = prixActuel !== null
      ? ` (${prixActuel}€ → ${prix}€, ${Math.round((prix - prixActuel) / prixActuel * 100) > 0 ? '+' : ''}${Math.round((prix - prixActuel) / prixActuel * 100)}%)`
      : ` (nouveau: ${prix}€)`;

    console.log(`${label}  → ${prix}€  [${nbCandidats} candidats${source === 'out_of_range' ? ', ⚠️ hors fourchette' : ''}]${diff}`);

    if (source === 'out_of_range') {
      console.log(`   ⚠️  Hors fourchette [${prixActuel ? (prixActuel * 0.2).toFixed(2) : 0}–${prixActuel ? (prixActuel * 3).toFixed(2) : '∞'}€]. Vérifier.`);
    }

    updatesMM.push({ materialId, prix, prixActuel, source });

    if (prixActuel !== null && Math.abs(prix - prixActuel) / prixActuel < 0.01) {
      nbSkippedMM++;
    } else {
      nbOkMM++;
    }
  }

  console.log(`\n─── Résumé ───────────────────────────────────────`);
  console.log(`  Castorama — maj : ${nbOk}  inchangés : ${nbSkipped}  skip : ${nbNoData}`);
  console.log(`  ManoMano  — maj : ${nbOkMM}  inchangés : ${nbSkippedMM}  skip : ${nbNoDataMM}`);

  if (DRY_RUN) {
    console.log('\n  🔍 Mode --dry-run : materialPrices.js NON modifié.\n');
    return;
  }

  // ── 6. Patcher materialPrices.js ─────────────────────────
  // Les items 'out_of_range' ne sont jamais patchés automatiquement
  // (prix hors fourchette = conversion douteuse, vérification manuelle requise).
  let nbMaj = 0;
  for (const { materialId, prix, source } of updatesCasto) {
    if (source === 'out_of_range') continue;
    const { contenu: nouveau, changed } = patcherPrix(contenu, materialId, prix, 'castorama');
    if (changed) {
      contenu = nouveau;
      nbMaj++;
    }
  }
  for (const { materialId, prix, source } of updatesMM) {
    if (source === 'out_of_range') continue;
    const { contenu: nouveau, changed } = patcherPrix(contenu, materialId, prix, 'manomano');
    if (changed) {
      contenu = nouveau;
      nbMaj++;
    }
  }

  // Mettre à jour la date
  const today = new Date().toISOString().slice(0, 10);
  contenu = patcherDate(contenu, today);

  fs.writeFileSync(PRICES_FILE, contenu, 'utf8');

  console.log(`\n✅ ${nbMaj} prix mis à jour dans frontend/lib/materialPrices.js`);
  console.log(`   PRICES_DATE mis à jour : ${today}`);
  console.log('\n🔔 Pense à lancer npm test depuis frontend/ pour vérifier les tests.\n');
}

// ── Gestion des erreurs non capturées ────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('\n❌ Erreur non gérée :', reason?.message || reason);
  process.exit(1);
});

main().catch(err => {
  console.error('\n❌ Erreur critique :', err.message);
  process.exit(1);
});
