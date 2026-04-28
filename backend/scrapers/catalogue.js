/**
 * backend/scrapers/catalogue.js
 * ═══════════════════════════════════════════════════════════════
 * Catalogue centralisé — SOURCE UNIQUE pour les requêtes scraper.
 *
 * Chaque entrée correspond à un material ID de materialPrices.js.
 * Les 3 scrapers (LM, Casto, BD) importent ce fichier pour
 * construire leurs REQUETES — aucun doublon de configuration.
 *
 * Champs :
 *   id        — identifiant matériau (= materialPrices.js id)
 *   categorie — slug catégorie retourné dans le produit scrapé
 *   terme     — terme de recherche générique (base)
 *   termeLM   — override Leroy Merlin (optionnel)
 *   termeCasto— override Castorama (optionnel)
 *   termeBD   — override Brico Dépôt (optionnel)
 *   stores    — restreindre aux enseignes pertinentes (default: all)
 *               ex: ['leroymerlin','castorama','bricodepot']
 * ═══════════════════════════════════════════════════════════════
 */

/** @type {Array<{
 *   id: string,
 *   categorie: string,
 *   terme: string,
 *   termeLM?: string,
 *   termeCasto?: string,
 *   termeBD?: string,
 *   termeMM?: string,
 *   stores?: string[],
 * }>} */
const CATALOGUE = [

  // ── Ossature bois générique ─────────────────────────────────
  {
    id:        'montant_45x90',
    categorie: 'montant_ossature',
    terme:     'montant ossature 45x95 bois sapin',
    termeLM:   'bois ossature 45x95 raboté',
    termeCasto:'montant ossature 45 95 bois',
    termeBD:   'montant ossature 45x95',
    termeMM:   'bois ossature 45x95',
  },
  {
    id:        'lisse_45x90',
    categorie: 'lisse_ossature',
    terme:     'lisse ossature 45x95 bois sapin',
    termeLM:   'bois ossature 45x95 raboté',
    termeCasto:'lisse ossature 45 95 bois',
    termeBD:   'lisse basse haute ossature',
    termeMM:   'lisse ossature bois 45x95',
  },

  // ── Cabanon : sections 90×90 ────────────────────────────────
  {
    id:        'montant_90x90',
    categorie: 'montant_cabanon',
    terme:     'poutre pin raboté 90x90 3m',
    termeLM:   'poutre pin traité raboté 90x90',
    termeCasto:'chevron pin 90x90 3m',
    termeBD:   'poutre bois 90x90 3m',
    termeMM:   'poutre bois 90x90',
  },
  {
    id:        'lisse_90x90',
    categorie: 'lisse_cabanon',
    terme:     'poutre pin raboté 90x90 3m',
    termeLM:   'poutre pin traité raboté 90x90',
    termeCasto:'chevron pin 90x90 3m',
    termeBD:   'poutre bois 90x90 3m',
    termeMM:   'poutre bois 90x90',
  },

  // ── Charpente ────────────────────────────────────────────────
  {
    id:        'chevron_60x80',
    categorie: 'chevron',
    terme:     'chevron bois 63x75 sapin',
    termeLM:   'chevron sapin épicéa 63x75',
    termeCasto:'chevron pin 75x63',
    termeBD:   'chevron bois 60x80',
    termeMM:   'chevron bois sapin 63x75',
  },
  {
    id:        'bastaing_63x150',
    categorie: 'bastaing',
    terme:     'bastaing bois 63x150 sapin',
    termeLM:   'bastaing sapin épicéa 63x150',
    termeCasto:'bastaing bois sapin',
    termeBD:   'bastaing bois 63x150',
    termeMM:   'bastaing bois 63x150',
  },
  {
    id:        'entretoise_toiture',
    categorie: 'chevron',
    terme:     'chevron bois 63x75 sapin',
    termeLM:   'chevron sapin épicéa 63x75',
    termeCasto:'chevron pin 75x63',
    termeBD:   'chevron bois 60x80',
    termeMM:   'chevron bois sapin 63x75',
  },

  // ── Revêtement & Finition ────────────────────────────────────
  {
    id:        'bardage_pin',
    categorie: 'bardage',
    terme:     'bardage pin traité classe 4',
    termeLM:   'bardage pin autoclave classe 4',
    termeCasto:'bardage bois pin',
    termeBD:   'bardage pin traité classe 4',
    termeMM:   'bardage bois pin autoclave',
  },
  {
    id:        'volige_18mm',
    categorie: 'volige',
    terme:     'volige sapin 14mm',
    termeLM:   'volige sapin 14mm 150mm',
    termeCasto:'volige sapin',
    termeBD:   'volige sapin 14mm',
    termeMM:   'volige sapin 14mm',
  },
  {
    id:        'membrane_etanche',
    categorie: 'membrane',
    terme:     'membrane pare-pluie sous-toiture respirante',
    termeLM:   'film pare-pluie sous-toiture',
    termeCasto:'pare-pluie membrane toiture',
    termeBD:   'membrane pare-pluie toiture',
    termeMM:   'pare-pluie sous-toiture',
  },
  {
    id:        'contreventement_osb',
    categorie: 'osb',
    terme:     'panneau OSB 9mm 122x244',
    termeLM:   'panneau OSB 3 9mm',
    termeCasto:'panneau OSB 9mm',
    termeBD:   'OSB 9mm panneau',
    termeMM:   'panneau OSB 3 9mm',
  },

  // ── Quincaillerie ────────────────────────────────────────────
  {
    id:        'vis_bardage',
    categorie: 'vis_bardage',
    terme:     'vis bardage inox a2 lot 500',
    termeLM:   'vis inox a2 bardage 5x50 boite',
    termeCasto:'vis bardage inox a2 lot',
    termeBD:   'vis bardage inox lot 500',
    termeMM:   'vis inox bardage a2 lot',
  },
  {
    id:        'vis_voliges',
    categorie: 'vis_voliges',
    terme:     'vis galva volige 4x40 lot 200',
    termeLM:   'vis zinguée bois 4x40 boite 200',
    termeCasto:'vis galvanisée bois lot 200',
    termeBD:   'vis galva bois 4x40 lot',
    termeMM:   'vis galva bois 4x40 lot',
  },
  {
    id:        'vis_inox_a2',
    categorie: 'vis_inox',
    terme:     'vis inox a2 4x40 lot 200',
    termeLM:   'vis inox a2 4x40 boite 200',
    termeCasto:'vis inox a2 4x40 lot',
    termeBD:   'vis inox a2 bois lot 200',
    termeMM:   'vis inox a2 4x40',
  },
  {
    id:        'equerre_fixation',
    categorie: 'equerre',
    terme:     'équerre fixation charpente galva 40mm',
    termeLM:   'équerre assemblage galvanisée 40x40',
    termeCasto:'équerre de fixation galva bois',
    termeBD:   'équerre fixation bois galva',
    termeMM:   'équerre assemblage charpente galva',
  },
  {
    id:        'sabot_chevron',
    categorie: 'sabot_chevron',
    terme:     'sabot de chevron galva 60x80',
    termeLM:   'sabot chevron galvanisé',
    termeCasto:'sabot de chevron acier',
    termeBD:   'sabot chevron galva',
    termeMM:   'sabot chevron galva',
  },
  {
    id:        'sabot_bastaing',
    categorie: 'sabot_bastaing',
    terme:     'sabot bastaing galva 63x150',
    termeLM:   'sabot bastaing galvanisé',
    termeCasto:'sabot de solive acier galva',
    termeBD:   'sabot bastaing galva',
    termeMM:   'sabot solive bastaing galva',
  },

  // ── Terrasse ─────────────────────────────────────────────────
  {
    id:        'lame_terrasse',
    categorie: 'lame_terrasse',
    terme:     'lame terrasse bois pin 145mm',
    termeLM:   'lame terrasse pin classe 4 145',
    termeCasto:'lame terrasse bois pin',
    termeBD:   'lame terrasse bois 145mm',
    termeMM:   'lame terrasse pin bois',
  },
  {
    id:        'lambourde_45x70',
    categorie: 'lambourde',
    terme:     'lambourde pin 45x70 classe 4',
    termeLM:   'lambourde pin autoclave 45x70',
    termeCasto:'lambourde terrasse pin 70x45',
    termeBD:   'lambourde pin cl.4 45x70',
    termeMM:   'lambourde pin autoclave 45x70',
  },
  {
    id:        'plot_beton',
    categorie: 'plot_beton',
    terme:     'plot béton réglable terrasse bois',
    termeLM:   'plot réglable terrasse bois',
    termeCasto:'plot de terrasse béton',
    termeBD:   'plot terrasse béton réglable',
    termeMM:   'plot réglable terrasse',
  },
  {
    id:        'bande_bitume',
    categorie: 'bande_bitume',
    terme:     'bande bitumineuse lambourde 80mm',
    termeLM:   'bande bitume lambourde 80mm',
    termeCasto:'bande bitumineuse terrasse bois',
    termeBD:   'bande bitume lambourde',
    termeMM:   'bande bitume lambourde',
  },

  // ── Pergola ──────────────────────────────────────────────────
  {
    id:        'poteau_pergola_100',
    categorie: 'poteau_pergola',
    terme:     'poteau bois 100x100 3m pergola',
    termeLM:   'poutre sapin 100x100 3m',
    termeCasto:'chevron pin 100x100 3m',
    termeBD:   'poteau bois 100x100',
    termeMM:   'poteau bois 100x100 pergola',
  },
  {
    id:        'poutre_pergola_150',
    categorie: 'poutre_pergola',
    terme:     'poutre bois 150x50 pergola longeron',
    termeLM:   'bastaing épicéa 150x50',
    termeCasto:'bastaing bois 150x50',
    termeBD:   'poutre bois 150x50',
    termeMM:   'bastaing bois 150x50',
  },
  {
    id:        'traverse_pergola_80',
    categorie: 'traverse_pergola',
    terme:     'chevron bois 80x50 pergola traverse',
    termeLM:   'chevron sapin 75x50',
    termeCasto:'chevron pin 80x50',
    termeBD:   'chevron bois 80x50',
    termeMM:   'chevron bois 75x50',
  },
  {
    id:        'pied_poteau_pergola',
    categorie: 'pied_poteau',
    terme:     'pied de poteau platine 100mm acier',
    termeLM:   'platine pied de poteau 100mm',
    termeCasto:'pied de poteau acier galva 100',
    termeBD:   'pied poteau platine galva',
    termeMM:   'pied de poteau platine galva',
  },
  {
    id:        'boulon_m10_traverse',
    categorie: 'boulon',
    terme:     'boulon M10 galva bois assemblage',
    termeLM:   'boulon carrosserie M10 galva',
    termeCasto:'boulon m10 galvanisé bois',
    termeBD:   'boulon m10 galva',
    termeMM:   'boulon M10 galvanisé',
  },

  // ── Clôture ──────────────────────────────────────────────────
  {
    id:        'poteau_cloture_90',
    categorie: 'poteau_cloture',
    terme:     'poteau cloture bois 90x90 2.4m',
    termeLM:   'poteau bois cloture 90x90',
    termeCasto:'poteau clôture pin 90x90',
    termeBD:   'poteau cloture bois 90x90',
    termeMM:   'poteau clôture bois 90x90',
  },
  {
    id:        'poteau_cloture_uc4',
    categorie: 'poteau_cloture_uc4',
    terme:     'poteau cloture bois traité UC4 90x90',
    termeLM:   'poteau pin autoclave classe 4 UC4 90x90',
    termeCasto:'poteau clôture traité UC4',
    termeBD:   'poteau cloture UC4 traité sol',
    termeMM:   'poteau bois UC4 traité autoclave',
  },
  {
    id:        'lisse_cloture_45x90',
    categorie: 'lisse_cloture',
    terme:     'lisse cloture bois 45x90',
    termeLM:   'rail cloture bois 45x90',
    termeCasto:'lisse clôture bois 45x90',
    termeBD:   'lisse clôture bois 45x90',
    termeMM:   'lisse rail clôture bois',
  },
  {
    id:        'lame_cloture',
    categorie: 'lame_cloture',
    terme:     'lame clôture bois pin 9cm',
    termeLM:   'lame de clôture pin 9cm',
    termeCasto:'lame clôture bois 9cm pin',
    termeBD:   'lame cloture bois 9cm',
    termeMM:   'lame clôture bois pin',
  },
  {
    id:        'ancrage_poteau_cloture',
    categorie: 'ancrage_poteau',
    terme:     'platine ancrage poteau clôture H 90x90',
    termeLM:   'platine H ancrage poteau bois',
    termeCasto:'ancrage de poteau platine H acier',
    termeBD:   'platine H ancrage clôture',
    termeMM:   'platine ancrage poteau H galva',
  },

  // ── Fondations ───────────────────────────────────────────────
  {
    id:        'beton_c20_25',
    categorie: 'beton',
    terme:     'béton livré C20/25 dalle',
    stores:    ['leroymerlin', 'castorama', 'bricodepot'], // pas ManoMano (livraison béton hors catalogue MM)
  },
  {
    id:        'beton_scellement_25kg',
    categorie: 'beton_scellement',
    terme:     'béton de scellement sac 25kg poteau',
    termeLM:   'béton de scellement 25kg sac',
    termeCasto:'béton scellement sac 25kg',
    termeBD:   'béton scellement poteau 25kg',
    termeMM:   'béton scellement 25kg sac',
  },
  {
    id:        'treillis_st25c',
    categorie: 'treillis',
    terme:     'treillis soudé ST25C panneau 3x2.4m',
    termeLM:   'treillis soudé ST25C dalle',
    termeCasto:'treillis soudé ST25C panneau',
    termeBD:   'treillis soude ST25',
    stores:    ['leroymerlin', 'castorama', 'bricodepot'], // pas ManoMano
  },
  {
    id:        'polyane_200',
    categorie: 'polyane',
    terme:     'film polyane 200 microns sous dalle',
    termeLM:   'film polyane 200µ rouleau',
    termeCasto:'polyane 200 microns film',
    termeBD:   'film polyane 200µ sous dalle',
    termeMM:   'film polyane 200 microns',
  },
  {
    id:        'gravier_0_31_5',
    categorie: 'gravier',
    terme:     'gravier 0/31.5 couche de forme big bag',
    stores:    ['leroymerlin', 'castorama', 'bricodepot'], // pas ManoMano
  },
];

module.exports = { CATALOGUE };
