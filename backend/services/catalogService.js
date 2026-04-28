/**
 * backend/services/catalogService.js
 * ═══════════════════════════════════════════════════════════════
 * Service de mise à jour du catalogue produits.
 *
 * RESPONSABILITÉS
 * ───────────────
 * 1. Déclencher les scrapers (via scrapers/index.js)
 * 2. Nettoyer et valider les produits bruts
 * 3. Upsert dans PostgreSQL (pas de doublons)
 * 4. Enregistrer les résultats dans catalogue_runs
 * 5. Ne jamais casser l'API existante :
 *    si tout échoue, les données manuelles restent actives
 *
 * STRATÉGIE UPSERT
 * ────────────────
 * Chaque produit scrapé est identifié par la clé (nom, magasin_id).
 * Si le produit existe → on met à jour le prix et la date.
 * Si le produit n'existe pas → on l'insère.
 * Les produits manuels (source='manual') ne sont jamais écrasés.
 *
 * SCHÉMA REQUIS
 * ─────────────
 * Appliquer database/migration_scraper.sql avant la première exécution.
 * ═══════════════════════════════════════════════════════════════
 */

require('dotenv').config();
const db = require('../database/db');
const { lancerTousLesScrapers } = require('../scrapers/index');

// ── Validation renforcée des produits ─────────────────────────
const CATEGORIES_VALIDES = ['lame_terrasse', 'lambourde', 'vis'];
const MAGASINS_VALIDES   = ['Leroy Merlin', 'Castorama', 'Brico Dépôt'];
const PRIX_MIN = 0.50;
const PRIX_MAX = 500;
const NOM_MIN  = 5;
const NOM_MAX  = 255;

/**
 * Nettoie et valide un produit brut.
 * Retourne null si le produit doit être rejeté.
 *
 * @param {Object} p — produit brut depuis le scraper
 * @returns {Object|null}
 */
function nettoyerProduit(p) {
  if (!p) return null;

  const nom = String(p.nom || '').trim().replace(/\s+/g, ' ');
  if (nom.length < NOM_MIN || nom.length > NOM_MAX) return null;

  const prix = parseFloat(p.prix);
  if (isNaN(prix) || prix < PRIX_MIN || prix > PRIX_MAX) return null;

  if (!CATEGORIES_VALIDES.includes(p.categorie)) return null;
  if (!MAGASINS_VALIDES.includes(p.magasin))     return null;

  const url = String(p.url || '').trim();
  if (!url.startsWith('http'))                   return null;

  const longueur = p.longueur ? parseFloat(p.longueur) : null;

  return {
    nom,
    categorie:  p.categorie,
    longueur:   longueur && longueur > 0 && longueur < 10000 ? longueur : null,
    prix:       parseFloat(prix.toFixed(2)),
    magasin:    p.magasin,
    url:        url.substring(0, 500),
  };
}

/**
 * Récupère l'id d'un magasin depuis son nom.
 * Utilise un cache en mémoire pour éviter les requêtes répétées.
 */
const cacheIdMagasins = {};
async function getMagasinId(nom) {
  if (cacheIdMagasins[nom]) return cacheIdMagasins[nom];
  const { rows } = await db.query('SELECT id FROM magasins WHERE nom = $1', [nom]);
  if (!rows[0]) throw new Error(`Magasin inconnu en BDD : "${nom}"`);
  cacheIdMagasins[nom] = rows[0].id;
  return rows[0].id;
}

/**
 * Upsert d'un produit dans la BDD.
 *
 * Logique :
 *   - Cherche un produit avec le même nom dans la même catégorie (source='scraper')
 *   - S'il existe : met à jour longueur, scraped_at
 *   - S'il n'existe pas : insère un nouveau produit
 *   - Dans les deux cas : upsert du prix lié au magasin
 *
 * @returns {'inserted'|'updated'|'skipped'}
 */
async function upsertProduit(produit, client) {
  const { nom, categorie, longueur, prix, magasin, url } = produit;
  const magasinId = await getMagasinId(magasin);

  // ── 1. Trouver ou créer le produit ──────────────────────
  const { rows: existing } = await client.query(
    `SELECT id FROM produits
     WHERE nom = $1 AND categorie = $2 AND source = 'scraper'
     LIMIT 1`,
    [nom, categorie]
  );

  let produitId;
  let action;

  if (existing.length > 0) {
    // Mise à jour du produit existant
    produitId = existing[0].id;
    await client.query(
      `UPDATE produits
       SET longueur = COALESCE($1, longueur),
           scraped_at = NOW()
       WHERE id = $2`,
      [longueur, produitId]
    );
    action = 'updated';
  } else {
    // Insertion d'un nouveau produit scrapé
    const { rows: inserted } = await client.query(
      `INSERT INTO produits (nom, categorie, longueur, source, scraped_at)
       VALUES ($1, $2, $3, 'scraper', NOW())
       RETURNING id`,
      [nom, categorie, longueur]
    );
    produitId = inserted[0].id;
    action = 'inserted';
  }

  // ── 2. Upsert du prix pour ce produit + magasin ─────────
  await client.query(
    `INSERT INTO prix (produit_id, magasin_id, prix, url, updated_at, source)
     VALUES ($1, $2, $3, $4, NOW(), 'scraper')
     ON CONFLICT (produit_id, magasin_id)
     DO UPDATE SET
       prix       = EXCLUDED.prix,
       url        = EXCLUDED.url,
       updated_at = NOW(),
       source     = 'scraper'`,
    [produitId, magasinId, prix, url]
  );

  return action;
}

/**
 * Enregistre le résultat d'un run dans la table catalogue_runs.
 */
async function logRun(magasin, statut, nbProduits, nbErreurs, dureeMs, message) {
  try {
    await db.query(
      `INSERT INTO catalogue_runs
         (magasin, statut, nb_produits, nb_erreurs, duree_ms, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [magasin, statut, nbProduits, nbErreurs, dureeMs, message || null]
    );
  } catch (err) {
    // Le log ne doit jamais bloquer le process principal
    console.warn('⚠️  Erreur lors du log du run :', err.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE EXPORTÉE
// ═══════════════════════════════════════════════════════════════

/**
 * Met à jour le catalogue complet :
 *   1. Lance les scrapers
 *   2. Valide et nettoie
 *   3. Upsert dans PostgreSQL (transaction par magasin)
 *   4. Journalise les résultats
 *
 * @returns {Promise<CatalogUpdateResult>}
 */
async function updateCatalog() {
  const debut = Date.now();

  // ── 1. Scraping ───────────────────────────────────────────
  let produitsRaw = [];
  let scrapeStats = null;
  try {
    const result = await lancerTousLesScrapers();
    produitsRaw  = result.produits;
    scrapeStats  = result.stats;
  } catch (err) {
    console.error('❌ Erreur critique scrapers :', err.message);
    // On retourne proprement — la BDD reste intacte
    return {
      succes:      false,
      message:     `Scraping échoué : ${err.message}`,
      nb_inseres:  0,
      nb_mis_a_jour: 0,
      nb_rejetes:  0,
      duree_ms:    Date.now() - debut,
    };
  }

  // ── 2. Nettoyage ──────────────────────────────────────────
  const produitsPropres = produitsRaw
    .map(nettoyerProduit)
    .filter(Boolean);

  const nbRejetes = produitsRaw.length - produitsPropres.length;
  console.log(`\n🧹 Nettoyage : ${produitsPropres.length} valides, ${nbRejetes} rejetés`);

  if (produitsPropres.length === 0) {
    console.warn('⚠️  Aucun produit à insérer — catalogue BDD inchangé');

    // Log l'échec pour chaque magasin
    if (scrapeStats) {
      for (const s of scrapeStats.scrapers) {
        await logRun(s.magasin, s.statut, 0, s.nb_erreurs, s.duree_ms, s.message);
      }
    }

    return {
      succes:        false,
      message:       'Scrapers bloqués ou aucun produit extrait',
      nb_inseres:    0,
      nb_mis_a_jour: 0,
      nb_rejetes:    nbRejetes,
      duree_ms:      Date.now() - debut,
    };
  }

  // ── 3. Upsert par magasin (transaction séparée) ───────────
  const compteurs = { inseres: 0, mis_a_jour: 0, erreurs: 0 };

  // Grouper par magasin pour les transactions
  const parMagasin = {};
  for (const p of produitsPropres) {
    if (!parMagasin[p.magasin]) parMagasin[p.magasin] = [];
    parMagasin[p.magasin].push(p);
  }

  for (const [magasin, produits] of Object.entries(parMagasin)) {
    const debutMag = Date.now();
    let ins = 0, upd = 0, err = 0;

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      for (const p of produits) {
        try {
          const action = await upsertProduit(p, client);
          if (action === 'inserted') ins++;
          else upd++;
        } catch (upsertErr) {
          err++;
          console.warn(`  ⚠️  Erreur upsert "${p.nom}" : ${upsertErr.message}`);
        }
      }

      await client.query('COMMIT');
      console.log(`  💾 ${magasin} : ${ins} insérés, ${upd} mis à jour, ${err} erreurs`);

    } catch (txErr) {
      await client.query('ROLLBACK');
      console.error(`  ❌ Transaction ${magasin} annulée : ${txErr.message}`);
      err = produits.length;
    } finally {
      client.release();
    }

    compteurs.inseres    += ins;
    compteurs.mis_a_jour += upd;
    compteurs.erreurs    += err;

    // Log du run par magasin
    const statsScraper = scrapeStats?.scrapers.find(s => s.magasin === magasin);
    await logRun(
      magasin,
      err === produits.length ? 'failed' : ins + upd > 0 ? 'success' : 'partial',
      ins + upd,
      err,
      Date.now() - debutMag,
      null
    );
  }

  const dureeTotal = Date.now() - debut;
  const resultat = {
    succes:        true,
    nb_inseres:    compteurs.inseres,
    nb_mis_a_jour: compteurs.mis_a_jour,
    nb_rejetes:    nbRejetes,
    nb_erreurs:    compteurs.erreurs,
    duree_ms:      dureeTotal,
    stats_scrapers: scrapeStats,
  };

  console.log(`\n✅ Catalogue mis à jour en ${(dureeTotal / 1000).toFixed(1)}s`);
  console.log(`   Insérés: ${compteurs.inseres} | Mis à jour: ${compteurs.mis_a_jour} | Rejetés: ${nbRejetes}`);

  return resultat;
}

/**
 * Récupère les derniers runs depuis catalogue_runs.
 * Utile pour le dashboard d'admin.
 */
async function getRunHistory(limit = 20) {
  const { rows } = await db.query(
    `SELECT * FROM catalogue_runs
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

/**
 * Supprime les produits scrapés plus anciens que N jours.
 * À appeler périodiquement pour garder le catalogue frais.
 */
async function purgerAnciensProduits(joursMax = 30) {
  const { rowCount } = await db.query(
    `DELETE FROM produits
     WHERE source = 'scraper'
       AND scraped_at < NOW() - INTERVAL '${joursMax} days'`
  );
  console.log(`🧹 Purge : ${rowCount} produits scrapés supprimés (> ${joursMax}j)`);
  return rowCount;
}

module.exports = {
  updateCatalog,
  getRunHistory,
  purgerAnciensProduits,
  nettoyerProduit,   // exporté pour les tests
};
