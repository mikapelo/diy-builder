/**
 * backend/scrapers/index.js
 * ═══════════════════════════════════════════════════════════════
 * Orchestrateur des scrapers — point d'entrée unique.
 *
 * STRATÉGIE DE ROBUSTESSE
 * ───────────────────────
 * Chaque scraper tourne en isolation : si LM est bloqué,
 * Castorama et BD continuent. L'échec d'un scraper ne propage
 * jamais d'exception au code appelant.
 *
 * STRUCTURE DE RETOUR
 * ───────────────────
 * {
 *   produits: Product[],    — liste unifiée, tous magasins
 *   stats: {
 *     total:          number,
 *     par_magasin:    { [magasin]: number },
 *     par_categorie:  { [cat]: number },
 *     scrapers:       ScraperStats[],
 *     duree_ms:       number,
 *     nb_bloques:     number,
 *   }
 * }
 * ═══════════════════════════════════════════════════════════════
 */

const { scrapeLeroyMerlin } = require('./leroymerlin');
const { scrapeCastorama    } = require('./castorama');
const { scrapeBricoDepot   } = require('./bricodepot');
const { scrapeManoMano     } = require('./manomano');

/**
 * Lance tous les scrapers en parallèle (avec isolation des erreurs).
 * Retourne la liste unifiée + les statistiques d'exécution.
 *
 * @returns {Promise<{ produits: Object[], stats: Object }>}
 */
async function lancerTousLesScrapers() {
  const debut = Date.now();

  console.log('═══════════════════════════════════════════════');
  console.log('  DIY Builder — Mise à jour catalogue');
  console.log(`  ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════════');

  // Lancement en parallèle — Promise.allSettled pour l'isolation
  // Note : Castorama et ManoMano partagent le même navigateur Playwright (singleton).
  // Les deux tournent en séquentiel via leurs propres délais internes.
  const [resLM, resCASTO, resBD, resMM] = await Promise.allSettled([
    scrapeLeroyMerlin(),
    scrapeCastorama(),
    scrapeBricoDepot(),
    scrapeManoMano(),
  ]);

  // Normaliser les résultats (fulfilled ou rejected)
  const resultats = [
    extraireResultat(resLM,   'Leroy Merlin'),
    extraireResultat(resCASTO,'Castorama'),
    extraireResultat(resBD,   'Brico Dépôt'),
    extraireResultat(resMM,   'ManoMano'),
  ];

  // Unifier tous les produits
  const tousLesProduits = resultats.flatMap(r => r.produits);

  // Statistiques globales
  const stats = construireStats(resultats, tousLesProduits, Date.now() - debut);

  afficherResume(stats);

  // Fermer le navigateur Playwright s'il a été ouvert
  if ((process.env.USE_PLAYWRIGHT || '').toLowerCase() === 'true') {
    const { closeBrowser } = require('./playwright-client');
    await closeBrowser();
  }

  return { produits: tousLesProduits, stats };
}

/**
 * Extrait les données d'un Promise.allSettled result.
 * Protège contre les exceptions non capturées dans les scrapers.
 */
function extraireResultat(settled, magasin) {
  if (settled.status === 'fulfilled') {
    return settled.value;
  }
  // Le scraper a lancé une exception non capturée
  console.error(`\n❌ ${magasin} — exception non capturée : ${settled.reason?.message}`);
  return {
    produits: [],
    stats: {
      magasin,
      nb_produits: 0,
      nb_bloques:  0,
      nb_erreurs:  1,
      duree_ms:    0,
      statut:      'failed',
      message:     settled.reason?.message,
    },
  };
}

function construireStats(resultats, tousLesProduits, dureeMs) {
  const parMagasin    = {};
  const parCategorie  = {};
  let nbBloques = 0;

  for (const r of resultats) {
    parMagasin[r.stats.magasin] = r.stats.nb_produits;
    if (r.stats.statut === 'blocked') nbBloques++;
  }

  for (const p of tousLesProduits) {
    parCategorie[p.categorie] = (parCategorie[p.categorie] || 0) + 1;
  }

  return {
    total:         tousLesProduits.length,
    par_magasin:   parMagasin,
    par_categorie: parCategorie,
    scrapers:      resultats.map(r => r.stats),
    duree_ms:      dureeMs,
    nb_bloques:    nbBloques,
  };
}

function afficherResume(stats) {
  console.log('\n═══════════════════════════════════════════════');
  console.log(`  ✅ Scraping terminé en ${(stats.duree_ms / 1000).toFixed(1)}s`);
  console.log(`  📦 ${stats.total} produits au total`);
  console.log('  Par magasin :');
  for (const [mag, nb] of Object.entries(stats.par_magasin)) {
    console.log(`    ${nb > 0 ? '✅' : '⚠️ '} ${mag} : ${nb} produits`);
  }
  console.log('  Par catégorie :');
  for (const [cat, nb] of Object.entries(stats.par_categorie)) {
    console.log(`    • ${cat} : ${nb}`);
  }
  if (stats.nb_bloques > 0) {
    console.log(`\n  ⛔ ${stats.nb_bloques} scraper(s) bloqué(s) par anti-bot`);
    console.log('     → Les données existantes en BDD restent actives');
    console.log('     → Voir README.md section "Scraping" pour les alternatives');
  }
  console.log('═══════════════════════════════════════════════\n');
}

module.exports = { lancerTousLesScrapers };
