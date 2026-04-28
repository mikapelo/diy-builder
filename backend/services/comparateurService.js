/**
 * backend/services/comparateurService.js
 * ═══════════════════════════════════════════════════════════════
 * Service de comparaison de prix inter-magasins.
 *
 * PROBLÈME RÉSOLU
 * ───────────────
 * L'ancien comparateur faisait :
 *   choisirProduit(categorie)           → UN produit pour TOUS les magasins
 *   recupererPrix(produit.id)           → prix de CE produit dans chaque magasin
 *   calculerComparateur(materiaux)      → somme des prix × quantités
 *
 * Limites :
 *   ✗ Ignorait la longueur commerciale (cherchait le produit le moins cher,
 *     pas celui le plus proche de la longueur requise)
 *   ✗ Même produit pour tous les magasins (Castorama peut avoir un
 *     meilleur produit de 3 m que Leroy Merlin)
 *   ✗ Pas de détail produit par magasin dans la réponse API
 *
 * NOUVELLE LOGIQUE
 * ─────────────────
 * Pour chaque matériau, on trouve LE MEILLEUR produit PAR MAGASIN :
 *   1. Filtrer par catégorie + type de bois (ILIKE sur le nom)
 *   2. Parmi les candidats, choisir la longueur la plus proche (mm)
 *   3. À longueur égale, prendre le prix le plus bas
 *   → Résultat : un produit possiblement différent par magasin
 *
 * REQUÊTE SQL CLEF
 * ─────────────────
 * DISTINCT ON (m.id) avec ORDER BY (m.id, delta_longueur ASC, prix ASC)
 * → une seule ligne par magasin, en une seule requête par matériau
 * → N requêtes pour N matériaux (typiquement 3–5), pas de N×M
 *
 * UNITÉS
 * ──────
 * • piece.longueur (service découpe) : mètres    (ex: 3.0)
 * • produits.longueur (PostgreSQL)   : millimètres (ex: 3000)
 * • Conversion dans ce service : longueur_m × 1000 = longueur_mm
 *
 * RÉTROCOMPATIBILITÉ
 * ──────────────────
 * Ce service retourne aussi `totaux`, `meilleur_prix`, `economie_possible`
 * pour que le controller puisse alimenter le champ `detail` existant
 * sans aucune modification frontend.
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

const db = require('../database/db');

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

/** Catégories pour lesquelles le type de bois doit être filtré */
const CATEGORIES_AVEC_TYPE_BOIS = new Set(['lame_terrasse', 'lambourde']);

/** Catégories pour lesquelles la longueur est pertinente */
const CATEGORIES_AVEC_LONGUEUR  = new Set(['lame_terrasse', 'lambourde']);

// ═══════════════════════════════════════════════════════════════
// REQUÊTE SQL PRINCIPALE
// ═══════════════════════════════════════════════════════════════

/**
 * Trouve le meilleur produit correspondant PAR MAGASIN pour un matériau.
 *
 * Critères (dans l'ordre) :
 *   1. categorie   — correspondance exacte
 *   2. type_bois   — ILIKE sur le nom du produit (ex: '%pin%')
 *   3. longueur    — ABS(produit.longueur_mm - cible_mm) minimal
 *   4. prix        — le moins cher à longueur égale
 *
 * @param {string}      categorie      — 'lame_terrasse' | 'lambourde' | 'vis'
 * @param {number|null} longueur_m     — longueur cible en mètres (null pour vis)
 * @param {string|null} type_bois      — 'pin' | 'douglas' | 'ipe' | null
 * @returns {Promise<Array<{
 *   magasin_id:          number,
 *   magasin:             string,
 *   produit_id:          number,
 *   produit_nom:         string,
 *   produit_longueur_mm: string|null,
 *   produit_largeur_mm:  string|null,
 *   unite:               string,
 *   prix_unitaire:       string,
 *   url:                 string|null,
 *   delta_longueur:      string,
 * }>>}
 */
async function trouverProduitsParMagasin(categorie, longueur_m, type_bois) {
  // ── Conversion longueur mètres → mm ───────────────────────────
  const avecLongueur    = CATEGORIES_AVEC_LONGUEUR.has(categorie)  && longueur_m != null;
  const avecTypeBois    = CATEGORIES_AVEC_TYPE_BOIS.has(categorie) && type_bois   != null;

  const longueur_cible_mm = avecLongueur  ? Math.round(longueur_m * 1000) : null;
  const pattern           = avecTypeBois  ? `%${type_bois}%`              : null;

  const sql = `
    SELECT DISTINCT ON (m.id)
      m.id                                              AS magasin_id,
      m.nom                                             AS magasin,
      p.id                                              AS produit_id,
      p.nom                                             AS produit_nom,
      p.longueur                                        AS produit_longueur_mm,
      p.largeur                                         AS produit_largeur_mm,
      p.unite,
      px.prix                                           AS prix_unitaire,
      px.url,
      CASE
        WHEN $2::numeric IS NULL THEN 0
        ELSE ABS(COALESCE(p.longueur, 0) - $2::numeric)
      END                                               AS delta_longueur
    FROM magasins m
    JOIN prix     px ON px.magasin_id = m.id
    JOIN produits p  ON p.id          = px.produit_id
    WHERE p.categorie = $1
      AND ($3::text IS NULL OR p.nom ILIKE $3)
    ORDER BY
      m.id,
      CASE WHEN $2::numeric IS NULL THEN 0
           ELSE ABS(COALESCE(p.longueur, 0) - $2::numeric)
      END ASC,
      px.prix ASC
  `;

  const { rows } = await db.query(sql, [categorie, longueur_cible_mm, pattern]);
  return rows;
}

// ═══════════════════════════════════════════════════════════════
// ASSEMBLAGE DU COMPARATEUR COMPLET
// ═══════════════════════════════════════════════════════════════

/**
 * Construit le comparateur enrichi à partir d'une liste de matériaux.
 *
 * @param {Array<{
 *   nom:        string,
 *   categorie:  string,
 *   quantite:   number,
 *   unite:      string,
 *   longueur_m: number|null,
 *   type_bois:  string|null,
 * }>} materiaux
 *
 * @returns {Promise<{
 *   par_magasin:       Object,   — { "Leroy Merlin": { total, produits } }
 *   totaux:            Object,   — { "Leroy Merlin": 620, ... } (rétrocompat)
 *   meilleur_prix:     string|null,
 *   economie_possible: number,
 *   couverture:        Object,   — { nb_materiaux, nb_avec_correspondance }
 * }>}
 */
async function construireComparateurParMagasin(materiaux) {
  if (!materiaux || materiaux.length === 0) {
    return {
      par_magasin:        {},
      totaux:             {},
      meilleur_prix:      null,
      economie_possible:  0,
      couverture: { nb_materiaux: 0, nb_avec_correspondance: 0 },
    };
  }

  // ── 1. Recherche des correspondances (une requête par matériau) ─
  const correspondances = await _rechercherToutesLesCorrespondances(materiaux);

  // ── 2. Assemblage par magasin ──────────────────────────────────
  const parMagasin = _assemblerParMagasin(correspondances);

  // ── 3. Totaux plats pour rétrocompatibilité ────────────────────
  const totaux = {};
  for (const [mag, data] of Object.entries(parMagasin)) {
    totaux[mag] = data.total;
  }

  // ── 4. Statistiques synthèse ──────────────────────────────────
  const entries           = Object.entries(totaux).sort((a, b) => a[1] - b[1]);
  const meilleur_prix      = entries[0]?.[0]  || null;
  const economie_possible = entries.length > 1
    ? parseFloat((entries[entries.length - 1][1] - entries[0][1]).toFixed(2))
    : 0;

  const nbAvecCorrespondance = correspondances.filter(c => c.rows.length > 0).length;

  return {
    par_magasin:       parMagasin,
    totaux,
    meilleur_prix,
    economie_possible,
    couverture: {
      nb_materiaux:            materiaux.length,
      nb_avec_correspondance:  nbAvecCorrespondance,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// HELPERS PRIVÉS
// ═══════════════════════════════════════════════════════════════

/**
 * Exécute les requêtes de matching pour chaque matériau.
 * Isole les erreurs : un matériau en échec n'interrompt pas les autres.
 */
async function _rechercherToutesLesCorrespondances(materiaux) {
  const resultats = [];

  for (const mat of materiaux) {
    let rows = [];
    try {
      rows = await trouverProduitsParMagasin(
        mat.categorie,
        mat.longueur_m  ?? null,
        mat.type_bois   ?? null,
      );

      if (rows.length === 0) {
        // Tentative de fallback sans filtre type_bois
        if (mat.type_bois && CATEGORIES_AVEC_TYPE_BOIS.has(mat.categorie)) {
          console.warn(
            `⚠️  [Comparateur] Pas de résultat pour "${mat.nom}" (${mat.type_bois}) — ` +
            `tentative sans filtre type bois`
          );
          rows = await trouverProduitsParMagasin(mat.categorie, mat.longueur_m ?? null, null);
        }
      }

      if (rows.length === 0) {
        console.warn(
          `⚠️  [Comparateur] Aucun produit en base pour ` +
          `catégorie="${mat.categorie}" longueur=${mat.longueur_m}m ` +
          `type_bois=${mat.type_bois || 'n/a'}`
        );
      }

    } catch (err) {
      console.warn(
        `⚠️  [Comparateur] Erreur BDD pour "${mat.nom}" : ${err.message}`
      );
    }

    resultats.push({ mat, rows });
  }

  return resultats;
}

/**
 * Assemble le comparateur par magasin depuis les correspondances.
 *
 * Structure de sortie :
 *   {
 *     "Leroy Merlin": {
 *       total: 620.50,
 *       produits: [
 *         {
 *           materiau_nom:        "Lame terrasse 3 m",
 *           materiau_categorie:  "lame_terrasse",
 *           quantite:            42,
 *           unite:               "unité",
 *           produit_id:          2,
 *           produit_nom:         "Lame terrasse douglas naturel",
 *           produit_longueur_mm: 3000,
 *           produit_largeur_mm:  145,
 *           prix_unitaire:       9.20,
 *           sous_total:          386.40,
 *           url:                 "https://...",
 *         },
 *         ...
 *       ]
 *     }
 *   }
 */
function _assemblerParMagasin(correspondances) {
  const parMagasin = {};

  for (const { mat, rows } of correspondances) {
    for (const row of rows) {
      const magasin = row.magasin;

      if (!parMagasin[magasin]) {
        parMagasin[magasin] = { total: 0, produits: [] };
      }

      const prix_unitaire = parseFloat(row.prix_unitaire);
      const sous_total    = parseFloat((prix_unitaire * mat.quantite).toFixed(2));

      parMagasin[magasin].produits.push({
        materiau_nom:        mat.nom,
        materiau_categorie:  mat.categorie,
        quantite:            mat.quantite,
        unite:               mat.unite,
        produit_id:          row.produit_id,
        produit_nom:         row.produit_nom,
        produit_longueur_mm: row.produit_longueur_mm != null
          ? parseFloat(row.produit_longueur_mm) : null,
        produit_largeur_mm: row.produit_largeur_mm != null
          ? parseFloat(row.produit_largeur_mm)  : null,
        prix_unitaire,
        sous_total,
        url: row.url || null,
      });

      parMagasin[magasin].total = parseFloat(
        (parMagasin[magasin].total + sous_total).toFixed(2)
      );
    }
  }

  return parMagasin;
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  construireComparateurParMagasin,
  trouverProduitsParMagasin,       // exporté pour les tests
  _assemblerParMagasin,            // exporté pour les tests
};
