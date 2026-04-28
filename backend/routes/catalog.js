/**
 * backend/routes/catalog.js
 * ─────────────────────────────────────────────────────────────
 * Endpoints d'administration du catalogue scrapé.
 * Ne modifie pas /api/calcul-terrasse.
 *
 * Routes :
 *   POST /api/catalog/update   — déclencher une MAJ manuelle
 *   GET  /api/catalog/status   — statut + dernier run
 *   GET  /api/catalog/history  — historique des runs
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router  = express.Router();
const { updateCatalog, getRunHistory } = require('../services/catalogService');
const db = require('../database/db');

// ── Garde simple anti-double-déclenchement ────────────────────
let updateEnCours = false;

/**
 * POST /api/catalog/update
 * Lance une mise à jour manuelle du catalogue.
 * Protégé contre les lancements simultanés.
 *
 * Recommandation : ajouter une clé API en production
 *   Authorization: Bearer <CATALOG_SECRET>
 */
router.post('/update', async (req, res) => {
  if (updateEnCours) {
    return res.status(409).json({
      success: false,
      message: 'Une mise à jour est déjà en cours. Réessayez dans quelques minutes.',
    });
  }

  updateEnCours = true;
  console.log('\n📡 Mise à jour catalogue déclenchée via API');

  // Répondre immédiatement — la MAJ tourne en arrière-plan
  res.status(202).json({
    success: true,
    message: 'Mise à jour du catalogue démarrée. Consultez /api/catalog/status pour le résultat.',
    started_at: new Date().toISOString(),
  });

  // Exécution asynchrone hors du cycle requête
  try {
    const resultat = await updateCatalog();
    console.log(`\n📡 MAJ API terminée : ${JSON.stringify(resultat)}`);
  } catch (err) {
    console.error('\n📡 MAJ API erreur :', err.message);
  } finally {
    updateEnCours = false;
  }
});

/**
 * GET /api/catalog/status
 * Retourne le statut du catalogue : nb produits, dernier run.
 */
router.get('/status', async (req, res) => {
  try {
    // Compte des produits par source et catégorie
    const { rows: comptes } = await db.query(`
      SELECT categorie, source, COUNT(*) AS nb
      FROM produits
      GROUP BY categorie, source
      ORDER BY categorie, source
    `);

    // Dernier run par magasin
    const { rows: dernierRun } = await db.query(`
      SELECT DISTINCT ON (magasin)
        magasin, statut, nb_produits, created_at, message
      FROM catalogue_runs
      ORDER BY magasin, created_at DESC
    `);

    // Produits scrapés les plus récents
    const { rows: recents } = await db.query(`
      SELECT p.nom, p.categorie, pr.prix, m.nom AS magasin, p.scraped_at
      FROM produits p
      JOIN prix pr ON pr.produit_id = p.id
      JOIN magasins m ON m.id = pr.magasin_id
      WHERE p.source = 'scraper'
      ORDER BY p.scraped_at DESC
      LIMIT 5
    `);

    return res.json({
      success:      true,
      en_cours:     updateEnCours,
      catalogue:    comptes,
      derniers_runs: dernierRun,
      produits_recents: recents,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/catalog/history
 * Retourne l'historique des 20 derniers runs.
 */
router.get('/history', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20'), 100);
    const runs  = await getRunHistory(limit);
    return res.json({ success: true, runs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
