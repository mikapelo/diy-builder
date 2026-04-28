/**
 * backend/services/optimisationMateriaux.js — v3
 * ─────────────────────────────────────────────────────────────
 * Service d'optimisation des matériaux.
 *
 * CHANGEMENTS v3
 * ──────────────
 * • Intègre optimiserDecoupe() pour les lames et les lambourdes.
 * • Le calcul naïf `ceil(surface / surface_lame)` est remplacé par
 *   l'algorithme de découpe optimale (minimisation des pertes).
 * • La réponse inclut désormais un champ `optimisation_decoupe`
 *   avec le détail des pièces et la perte estimée.
 * ─────────────────────────────────────────────────────────────
 */

const db = require('../database/db');
const { optimiserDecoupe }               = require('./optimisationDecoupe');
const { construireComparateurParMagasin } = require('./comparateurService');

// Longueurs commerciales disponibles en magasin (mètres)
const LONGUEURS_LAMES_DISPO      = [2.4, 3.0, 4.0];
const LONGUEURS_LAMBOURDES_DISPO = [2.4, 3.0, 4.0];

// ═══════════════════════════════════════════════════════════════
// FONCTION PRINCIPALE
// ═══════════════════════════════════════════════════════════════

/**
 * Sélectionne, optimise les produits et calcule les prix pour un calcul de terrasse.
 * @param {Object} calcul — résultat de calculerTerrasse()
 */
async function optimiserMateriaux(calcul) {
  const { materiaux, largeur, longueur, type_bois } = calcul;

  // ── 1. Optimisation des découpes ──────────────────────────
  const decoupe = optimiserDecoupe({
    largeur,
    longueur,
    longueurs_disponibles: LONGUEURS_LAMES_DISPO,
  });

  // ── 2. Construire le catalogue de quantités optimisées ────
  const quantitesOptimisees = construireQuantitesOptimisees(decoupe, calcul);

  // ── 3. Enrichissement avec les prix BDD ──────────────────
  const resultats = [];
  for (const mat of quantitesOptimisees) {
    const produit = await choisirProduit(mat.categorie, mat.type_bois);
    const prix    = produit ? await recupererPrix(produit.id) : {};

    resultats.push({
      nom:       mat.nom,
      categorie: mat.categorie,
      quantite:  mat.quantite,
      unite:     mat.unite,
      detail:    mat.detail || null,
      produit:   produit
        ? { id: produit.id, nom: produit.nom, longueur: produit.longueur, largeur: produit.largeur }
        : null,
      prix_par_magasin: prix,
    });
  }

  // ── 4. Comparateur enrichi par magasin (nouveau service) ─────
  // Recherche le meilleur produit PAR MAGASIN pour chaque matériau
  // en tenant compte de la longueur commerciale (mètres → mm).
  const comparateurEnrichi = await construireComparateurParMagasin(quantitesOptimisees);

  // Comparateur final : nouveau format + rétrocompatibilité
  const comparateur = {
    par_magasin:       comparateurEnrichi.par_magasin,   // nouveau
    totaux:            comparateurEnrichi.totaux,          // rétrocompat
    meilleur_prix:     comparateurEnrichi.meilleur_prix,   // rétrocompat
    economie_possible: comparateurEnrichi.economie_possible, // rétrocompat
    couverture:        comparateurEnrichi.couverture,      // diagnostic
  };

  return {
    materiaux_optimises: resultats,
    comparateur_prix:    comparateur,
    optimisation_decoupe: {
      lames: {
        pieces:           decoupe.lames.pieces,
        perte_estimee:    decoupe.lames.perte_estimee,
        nb_lignes:        decoupe.lames.nb_rangees,
        longueur_achetee: decoupe.lames.longueur_achetee_m,
        longueur_utile:   decoupe.lames.longueur_utile_m,
      },
      lambourdes: {
        pieces:           decoupe.lambourdes.pieces,
        perte_estimee:    decoupe.lambourdes.perte_estimee,
        nb_rangees:       decoupe.lambourdes.nb_rangees,
        longueur_achetee: decoupe.lambourdes.longueur_achetee_m,
        longueur_utile:   decoupe.lambourdes.longueur_utile_m,
      },
      perte_globale: decoupe.perte_globale,
      resume:        decoupe.resume,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUCTION DES QUANTITÉS OPTIMISÉES
// ═══════════════════════════════════════════════════════════════

/**
 * Traduit le résultat d'optimisation de découpe en liste de matériaux.
 * Chaque longueur distincte (2.4/3/4 m) devient un matériau séparé.
 */
function construireQuantitesOptimisees(decoupe, calcul) {
  const resultats   = [];
  const { type_bois } = calcul;

  // Lames — une ligne par longueur utilisée
  for (const piece of decoupe.lames.pieces) {
    resultats.push({
      nom:        `Lame terrasse ${piece.longueur} m`,
      categorie:  'lame_terrasse',
      quantite:   piece.quantite,
      unite:      'unité',
      type_bois,
      longueur_m: piece.longueur,   // ← mètres, pour le matching BDD (longueur_mm = longueur_m × 1000)
      detail:     `${piece.quantite_par_rangee} par rangée × ${decoupe.lames.nb_rangees} rangées`,
    });
  }

  // Lambourdes — une ligne par longueur utilisée
  for (const piece of decoupe.lambourdes.pieces) {
    resultats.push({
      nom:        `Lambourde ${piece.longueur} m`,
      categorie:  'lambourde',
      quantite:   piece.quantite,
      unite:      'unité',
      type_bois,
      longueur_m: piece.longueur,   // ← mètres, pour le matching BDD
      detail:     `${piece.quantite_par_rangee} par rangée × ${decoupe.lambourdes.nb_rangees} rangées`,
    });
  }

  // Vis — inchangées (pas de découpe, longueur_m non pertinente)
  const vis = calcul.materiaux.find(m => m.categorie === 'vis');
  if (vis) {
    resultats.push({ ...vis, longueur_m: null, detail: 'Calcul basé sur lambourdes × lames × 2 vis' });
  }

  return resultats;
}

// ═══════════════════════════════════════════════════════════════
// ACCÈS BASE DE DONNÉES
// ═══════════════════════════════════════════════════════════════

async function choisirProduit(categorie, type_bois) {
  try {
    let query, params;
    if (type_bois && categorie !== 'vis') {
      query  = `SELECT p.*, MIN(px.prix) AS prix_min FROM produits p JOIN prix px ON px.produit_id = p.id WHERE p.categorie = $1 AND p.nom ILIKE $2 GROUP BY p.id ORDER BY prix_min ASC LIMIT 1`;
      params = [categorie, `%${type_bois}%`];
    } else {
      query  = `SELECT p.*, MIN(px.prix) AS prix_min FROM produits p JOIN prix px ON px.produit_id = p.id WHERE p.categorie = $1 GROUP BY p.id ORDER BY prix_min ASC LIMIT 1`;
      params = [categorie];
    }
    const { rows } = await db.query(query, params);
    return rows[0] || null;
  } catch (err) {
    console.warn(`⚠️  Produit non trouvé (${categorie}/${type_bois}) :`, err.message);
    return null;
  }
}

async function recupererPrix(produitId) {
  try {
    const { rows } = await db.query(
      `SELECT m.nom AS magasin, px.prix, px.url FROM prix px JOIN magasins m ON m.id = px.magasin_id WHERE px.produit_id = $1 ORDER BY px.prix ASC`,
      [produitId]
    );
    return rows.reduce((acc, row) => {
      acc[row.magasin] = { prix: parseFloat(row.prix), url: row.url };
      return acc;
    }, {});
  } catch (err) {
    console.warn('⚠️  Erreur récupération prix :', err.message);
    return {};
  }
}

// ═══════════════════════════════════════════════════════════════
// COMPARATEUR
// ═══════════════════════════════════════════════════════════════

function calculerComparateur(materiaux) {
  const totaux = {};
  for (const mat of materiaux) {
    for (const [magasin, data] of Object.entries(mat.prix_par_magasin || {})) {
      if (!totaux[magasin]) totaux[magasin] = 0;
      totaux[magasin] = parseFloat((totaux[magasin] + data.prix * mat.quantite).toFixed(2));
    }
  }
  const entries  = Object.entries(totaux).sort((a, b) => a[1] - b[1]);
  const meilleur = entries[0]?.[0] || null;
  const economie = entries.length > 1
    ? parseFloat((entries[entries.length - 1][1] - entries[0][1]).toFixed(2))
    : 0;
  return { totaux, meilleur_prix: meilleur, economie_possible: economie };
}

// ═══════════════════════════════════════════════════════════════
// FALLBACK SIMULATION
// ═══════════════════════════════════════════════════════════════

function simulerPrix(materiaux, type_bois, largeur, longueur) {
  let decoupeInfo = null;
  if (largeur && longueur) {
    try {
      const d = optimiserDecoupe({ largeur, longueur, longueurs_disponibles: LONGUEURS_LAMES_DISPO });
      decoupeInfo = {
        lames:      { pieces: d.lames.pieces,      perte_estimee: d.lames.perte_estimee,      nb_lignes:  d.lames.nb_rangees      },
        lambourdes: { pieces: d.lambourdes.pieces,  perte_estimee: d.lambourdes.perte_estimee,  nb_rangees: d.lambourdes.nb_rangees },
        perte_globale: d.perte_globale,
        resume:        d.resume,
      };
    } catch (_) { /* silencieux */ }
  }

  const coeff    = { pin: 1.0, douglas: 1.3, ipe: 2.5 }[type_bois] || 1.0;
  const base     = { lame_terrasse: 7.5, lambourde: 9.5, vis: 13.5 };
  const magasins = { 'Leroy Merlin': 1.05, 'Castorama': 1.00, 'Brico Dépôt': 0.95 };

  const materiaux_sim = materiaux.map(mat => {
    const prixBase = base[mat.categorie] || 10;
    const prixMag  = {};
    for (const [mag, c] of Object.entries(magasins))
      prixMag[mag] = { prix: parseFloat((prixBase * coeff * c).toFixed(2)), url: null };
    return { ...mat, produit: null, prix_par_magasin: prixMag };
  });

  return {
    materiaux_optimises:  materiaux_sim,
    comparateur_prix:     calculerComparateur(materiaux_sim),
    optimisation_decoupe: decoupeInfo,
    mode: 'simulation',
  };
}

module.exports = {
  optimiserMateriaux,
  simulerPrix,
  calculerComparateur,
  recupererPrix,
};
