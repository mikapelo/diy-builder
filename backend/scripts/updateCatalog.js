#!/usr/bin/env node
/**
 * backend/scripts/updateCatalog.js
 * ═══════════════════════════════════════════════════════════════
 * Script CLI de mise à jour du catalogue.
 *
 * UTILISATION
 * ───────────
 *   node scripts/updateCatalog.js             # mise à jour complète
 *   node scripts/updateCatalog.js --dry-run   # scrape sans insérer
 *   node scripts/updateCatalog.js --purge     # purge + mise à jour
 *   node scripts/updateCatalog.js --history   # affiche les 10 derniers runs
 *
 * VIA NPM
 *   npm run catalog:update
 *
 * CRON (recommandé : 1x/jour à 3h du matin)
 *   0 3 * * * cd /app && node scripts/updateCatalog.js >> /var/log/catalog.log 2>&1
 *
 * CODES DE SORTIE
 *   0 — succès (même si 0 produit scrapé — BDD intacte)
 *   1 — erreur critique (BDD inaccessible, crash)
 * ═══════════════════════════════════════════════════════════════
 */

// Charger .env depuis le dossier parent du script (= racine backend)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { updateCatalog, getRunHistory, purgerAnciensProduits } = require('../services/catalogService');

// ── Parse des flags CLI ────────────────────────────────────────
const args   = process.argv.slice(2);
const DRY    = args.includes('--dry-run');
const PURGE  = args.includes('--purge');
const HIST   = args.includes('--history');
const HELP   = args.includes('--help') || args.includes('-h');

if (HELP) {
  console.log(`
DIY Builder — Mise à jour du catalogue

Usage :
  node scripts/updateCatalog.js [options]

Options :
  --dry-run    Scraper les sites sans insérer en BDD
  --purge      Supprimer les produits > 30 jours avant la MAJ
  --history    Afficher l'historique des 10 derniers runs
  --help       Ce message

Variables d'environnement requises :
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

Variables optionnelles (scrapers) :
  SCRAPER_TIMEOUT_MS     Timeout réseau (défaut: 15000)
  SCRAPER_MAX_RETRY      Nombre de tentatives (défaut: 3)
  SCRAPER_DELAY_MS       Délai entre requêtes (défaut: 2000)
  `);
  process.exit(0);
}

// ── Gestionnaire de sortie propre ──────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('\n❌ Erreur non gérée :', reason?.message || reason);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  Interruption manuelle — la BDD reste dans son état courant');
  process.exit(0);
});

// ═══════════════════════════════════════════════════════════════
async function main() {
  // ── Mode historique ──────────────────────────────────────
  if (HIST) {
    const runs = await getRunHistory(10);
    console.log('\n📋 Historique des 10 derniers runs :\n');
    if (runs.length === 0) {
      console.log('  Aucun run enregistré.');
    } else {
      for (const r of runs) {
        const date = new Date(r.created_at).toLocaleString('fr-FR');
        const icon = r.statut === 'success' ? '✅' : r.statut === 'blocked' ? '⛔' : '❌';
        console.log(`  ${icon} ${date} — ${r.magasin} : ${r.nb_produits} produits (${r.statut})`);
        if (r.message) console.log(`     └─ ${r.message}`);
      }
    }
    console.log('');
    process.exit(0);
  }

  // ── Mode dry-run ──────────────────────────────────────────
  if (DRY) {
    console.log('\n🔍 Mode --dry-run : les produits ne seront pas insérés en BDD\n');
    const { lancerTousLesScrapers } = require('../scrapers/index');
    const { produits, stats } = await lancerTousLesScrapers();

    console.log('\n📦 Aperçu des produits scrapés :');
    for (const p of produits.slice(0, 20)) {
      console.log(`  [${p.magasin}] ${p.categorie} — ${p.nom} — ${p.prix}€`);
    }
    if (produits.length > 20) {
      console.log(`  … et ${produits.length - 20} autres`);
    }
    console.log(`\n  Total : ${produits.length} produits (dry-run, BDD inchangée)\n`);
    process.exit(0);
  }

  // ── Mode purge avant MAJ ──────────────────────────────────
  if (PURGE) {
    console.log('\n🧹 Purge des anciens produits scrapés…');
    await purgerAnciensProduits(30);
  }

  // ── Mise à jour complète ──────────────────────────────────
  console.log('\n🚀 Démarrage mise à jour catalogue…\n');

  let exitCode = 0;
  try {
    const resultat = await updateCatalog();

    if (resultat.succes) {
      console.log('\n✅ Mise à jour terminée avec succès');
      console.log(`   Insérés    : ${resultat.nb_inseres}`);
      console.log(`   Mis à jour : ${resultat.nb_mis_a_jour}`);
      console.log(`   Rejetés    : ${resultat.nb_rejetes}`);
      console.log(`   Durée      : ${(resultat.duree_ms / 1000).toFixed(1)}s\n`);
    } else {
      console.warn('\n⚠️  Mise à jour partielle ou sans résultat');
      console.warn(`   ${resultat.message}`);
      console.warn('   Les données existantes restent actives.\n');
      exitCode = 0; // Pas d'erreur fatale — BDD intacte
    }

  } catch (err) {
    console.error('\n❌ Erreur critique :', err.message);
    console.error('   La base de données n\'a pas été modifiée (rollback effectué).\n');
    exitCode = 1;
  }

  // Fermer proprement le pool de connexions
  try {
    const db = require('../database/db');
    if (db.end) await db.end();
  } catch (_) {}

  process.exit(exitCode);
}

main();
