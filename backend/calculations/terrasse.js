/**
 * backend/calculations/terrasse.js
 * ─────────────────────────────────────────────────────────────
 * Moteur de calcul v2 — formules basées sur les surfaces réelles.
 * Aucune dépendance externe : 100 % testable en isolation.
 *
 * Formules :
 *   surface_terrasse = largeur × longueur
 *   surface_lame     = LARGEUR_LAME × LONGUEUR_LAME_STD
 *   nb_lames         = ceil(surface_terrasse / surface_lame)
 *   nb_lambourdes    = ceil(largeur / ENTRAXE) + 1   (+ lambourde de rive)
 *   nb_vis           = nb_lambourdes × nb_lames × VIS_PAR_FIXATION
 *   nb_boites_vis    = ceil(nb_vis / VIS_PAR_BOITE)
 *   → appliquer +10% marge sur toutes les quantités
 * ─────────────────────────────────────────────────────────────
 */

// ── Constantes de construction ────────────────────────────────
const ENTRAXE_LAMBOURDES  = 0.40;   // m — espacement entre lambourdes
const LARGEUR_LAME        = 0.145;  // m — 145 mm, lame terrasse standard
const LONGUEUR_LAME_STD   = 2.40;   // m — longueur commerciale standard
const VIS_PAR_FIXATION    = 2;      // vis par croisement lame/lambourde
const VIS_PAR_BOITE       = 200;    // vis dans une boîte standard
const MARGE_SECURITE      = 0.10;   // +10 %

const TYPES_BOIS_VALIDES  = ['pin', 'douglas', 'ipe'];

/**
 * Calcule toutes les quantités de matériaux pour une terrasse bois.
 *
 * @param {number} largeur    — largeur de la terrasse en mètres
 * @param {number} longueur   — longueur de la terrasse en mètres
 * @param {string} type_bois  — 'pin' | 'douglas' | 'ipe'
 * @returns {CalculResult}
 *
 * @throws {Error} si les paramètres sont invalides
 */
function calculerTerrasse(largeur, longueur, type_bois) {
  // ── Validation ────────────────────────────────────────────
  valider(largeur, longueur, type_bois);

  const l  = parseFloat(largeur);
  const lo = parseFloat(longueur);
  const tb = type_bois.trim().toLowerCase();

  // ── Calculs de base (sans marge) ─────────────────────────
  const surface_terrasse = l * lo;
  const surface_lame     = LARGEUR_LAME * LONGUEUR_LAME_STD;

  const nb_lames_base      = Math.ceil(surface_terrasse / surface_lame);
  const nb_lambourdes_base = Math.ceil(l / ENTRAXE_LAMBOURDES) + 1;
  const nb_vis_base        = nb_lambourdes_base * nb_lames_base * VIS_PAR_FIXATION;
  const nb_boites_base     = Math.ceil(nb_vis_base / VIS_PAR_BOITE);

  // ── Application de la marge de sécurité ──────────────────
  const appliquerMarge = (n) => Math.ceil(n * (1 + MARGE_SECURITE));

  const nb_lames      = appliquerMarge(nb_lames_base);
  const nb_lambourdes = appliquerMarge(nb_lambourdes_base);
  const nb_boites_vis = appliquerMarge(nb_boites_base);

  return {
    // Données projet
    surface_terrasse: parseFloat(surface_terrasse.toFixed(2)),
    largeur:  l,
    longueur: lo,
    type_bois: tb,

    // Quantités finales (avec marge)
    nb_lames,
    nb_lambourdes,
    nb_boites_vis,

    // Quantités brutes (sans marge) — utiles pour les tests et l'affichage
    _base: {
      nb_lames:      nb_lames_base,
      nb_lambourdes: nb_lambourdes_base,
      nb_vis:        nb_vis_base,
      nb_boites_vis: nb_boites_base,
    },

    // Matériaux structurés pour le service de prix
    materiaux: [
      {
        nom:       'Lames de terrasse',
        categorie: 'lame_terrasse',
        quantite:  nb_lames,
        unite:     'unité',
        type_bois: tb,
      },
      {
        nom:       'Lambourdes',
        categorie: 'lambourde',
        quantite:  nb_lambourdes,
        unite:     'unité',
        type_bois: tb,
      },
      {
        nom:       'Vis inox',
        categorie: 'vis',
        quantite:  nb_boites_vis,
        unite:     'boite de 200',
        type_bois: null, // les vis ne dépendent pas du bois
      },
    ],

    // Paramètres utilisés (transparence)
    parametres: {
      entraxe_lambourdes: `${ENTRAXE_LAMBOURDES * 100} cm`,
      largeur_lame:       `${LARGEUR_LAME * 100} cm`,
      longueur_lame_std:  `${LONGUEUR_LAME_STD} m`,
      vis_par_fixation:   VIS_PAR_FIXATION,
      vis_par_boite:      VIS_PAR_BOITE,
      marge_securite:     `${MARGE_SECURITE * 100} %`,
    },

    // Données de visualisation SVG
    plan: {
      nb_lambourdes_affichage: nb_lambourdes_base,
      entraxe: ENTRAXE_LAMBOURDES,
    },
  };
}

/**
 * Valide les entrées utilisateur.
 * @throws {Error} avec un message lisible
 */
function valider(largeur, longueur, type_bois) {
  if (largeur === undefined || largeur === null || largeur === '')
    throw new Error('La largeur est requise.');
  if (isNaN(Number(largeur)) || Number(largeur) <= 0)
    throw new Error('La largeur doit être un nombre positif.');
  if (Number(largeur) > 100)
    throw new Error('La largeur ne peut pas dépasser 100 m.');

  if (longueur === undefined || longueur === null || longueur === '')
    throw new Error('La longueur est requise.');
  if (isNaN(Number(longueur)) || Number(longueur) <= 0)
    throw new Error('La longueur doit être un nombre positif.');
  if (Number(longueur) > 100)
    throw new Error('La longueur ne peut pas dépasser 100 m.');

  if (!type_bois || !TYPES_BOIS_VALIDES.includes(String(type_bois).trim().toLowerCase()))
    throw new Error(`type_bois invalide. Valeurs acceptées : ${TYPES_BOIS_VALIDES.join(', ')}.`);
}

module.exports = {
  calculerTerrasse,
  // Export des constantes pour les tests
  CONSTANTES: {
    ENTRAXE_LAMBOURDES,
    LARGEUR_LAME,
    LONGUEUR_LAME_STD,
    VIS_PAR_FIXATION,
    VIS_PAR_BOITE,
    MARGE_SECURITE,
  },
};
