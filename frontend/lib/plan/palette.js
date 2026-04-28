/**
 * palette.js — Palette matériaux partagée pour les vues techniques PDF
 *
 * Chaque famille de matériau a une teinte constante inter-modules.
 * Les couleurs sont des tableaux RGB [r, g, b] utilisables directement
 * dans jsPDF (setFillColor, setDrawColor) et dans les primitives (fill, stroke).
 *
 * Référence : CHARTE_GRAPHIQUE_PDF.md §2.2
 */

/* ── Palette matériaux normalisée ─────────────────────────────────── */
export const MAT = {
  /** Ossature principale : montants, poteaux */
  ossature:    { fill: [175, 198, 225], stroke: [55, 82, 120] },

  /** Lisses basses/hautes, rails horizontaux */
  lisse:       { fill: [235, 215, 170], stroke: [110, 82, 40] },

  /** Sablières, longerons porteurs */
  sabliere:    { fill: [228, 208, 165], stroke: [120, 90, 45] },

  /** Chevrons, solives, lambourdes */
  chevron:     { fill: [228, 195, 135], stroke: [155, 110, 50] },

  /** Bardage, lames, habillage */
  bardage:     { fill: [225, 200, 162], stroke: [155, 120, 72] },

  /** Couverture (bac acier, membrane) */
  couverture:  { fill: [75, 82, 100],   stroke: [40, 45, 60] },

  /** Panneaux OSB, voliges */
  osb:         { fill: [242, 235, 218], stroke: [145, 125, 85] },

  /** Sol, terrain naturel */
  sol:         { fill: [222, 215, 200], stroke: [160, 148, 128] },

  /** Béton (dalle, plots) */
  beton:       { fill: [195, 195, 200], stroke: [140, 140, 150] },

  /** Ouverture porte */
  porte:       { fill: [245, 240, 232], stroke: [155, 88, 28] },

  /** Ouverture fenêtre */
  fenetre:     { fill: [230, 240, 255], stroke: [45, 88, 155] },

  /** Contour général */
  contour:     { stroke: [30, 30, 50] },

  /** Lignes de cotation */
  dim:         { stroke: [50, 50, 50] },
};

/* ── Constantes graphiques de fond de plan ────────────────────────── */

/** Fond de zone de dessin (rectangle arrondi) */
export const PLAN_BG = [250, 252, 255];

/** Grille technique (5 mm) */
export const GRID_COLOR = [228, 230, 238];
export const GRID_LW = 0.08;

/* ── Couleurs de layout PDF (tableaux, cartouche, sections) ──────── */
export const PDF = {
  /** En-tête de tableau — bleu foncé */
  TABLE_HEADER_BG:   [30, 45, 75],
  TABLE_HEADER_TEXT:  [255, 255, 255],
  TABLE_BORDER:      [200, 215, 235],
  TABLE_ROW_EVEN:    [245, 248, 253],
  TABLE_ROW_ODD:     [255, 255, 255],
  TABLE_TEXT:        [25, 35, 50],

  /** Cartouche */
  CARTOUCHE_BG:      [240, 242, 246],
  CARTOUCHE_BORDER:  [195, 200, 210],
  CARTOUCHE_BRAND:   [106, 112, 128],
  CARTOUCHE_TITLE:   [42, 48, 64],
  CARTOUCHE_PAGE:    [138, 144, 160],
  CARTOUCHE_SUB:     [154, 159, 176],
  CARTOUCHE_NOTE:    [170, 176, 184],

  /** Titres de section */
  SECTION_TITLE:     [18, 32, 62],
  SECTION_UNDERLINE: [56, 132, 232],
  PAGE_TITLE:        [15, 25, 35],
  PAGE_SUBTITLE:     [108, 120, 135],
  PAGE_RULE:         [200, 210, 220],

  /** Notes techniques */
  NOTE_BG:           [246, 247, 249],
  NOTE_BORDER:       [216, 220, 226],
  NOTE_TEXT:         [106, 112, 128],

  /** Budget */
  BEST_PRICE:        [22, 62, 148],
  BADGE_GREEN:       [34, 140, 34],
};
