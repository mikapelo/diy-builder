/**
 * bomAffiliate.js — « Le matériel de votre projet » (bloc affilié aligné-BOM)
 *
 * Contre l'écueil du décalage d'intention (on proposait un produit FINI à une
 * audience venue CONSTRUIRE), ce bloc met en avant les MATÉRIAUX que le chantier
 * demande — ceux que le simulateur chiffre — chez nos partenaires.
 *
 * Chaque ligne = un poste du chantier, lié honnêtement :
 *   - `awin`   : produit curé existant, RÉFÉRENCÉ dans awinProducts.js
 *                ({ block, index }) → aucune URL dupliquée, source unique.
 *   - `amazon` : lien de RECHERCHE Amazon (query) pour les consommables trop
 *                variables pour un ASIN stable (visserie, lasure…) — pattern
 *                déjà établi dans projectTools.js.
 *
 * Icônes : Material Symbols (mêmes que le reste du site).
 * Extensible : ajouter cabanon / cloture sur le même modèle.
 */

export const BOM_AFFILIATE = {
  terrasse: {
    title: 'Le matériel de votre terrasse',
    subtitle:
      'Le matériel pour la poser vous-même — lames, plots, visserie et finition chez nos partenaires. Pas une terrasse toute faite : la vôtre.',
    lines: [
      { icon: 'deck',         label: 'Lames de terrasse',   sub: 'Composite WPC — Woodstore24',            awin: { block: 'terrasse-composite', index: 0 } },
      { icon: 'foundation',   label: 'Plots réglables',      sub: 'Solidor / Jouplast — Plots discount',    awin: { block: 'terrasse', index: 0 } },
      { icon: 'hardware',     label: 'Visserie inox A2',     sub: 'Vis terrasse + embout Torx',             amazon: 'vis terrasse inox A2 torx' },
      { icon: 'format_paint', label: 'Saturateur bois',      sub: 'Finition et protection des lames',       amazon: 'saturateur terrasse bois' },
    ],
  },
  pergola: {
    title: 'Le matériel de votre pergola',
    subtitle:
      'De quoi monter la structure que vous venez de chiffrer — bois, fixations et finition.',
    lines: [
      { icon: 'view_column',  label: 'Poteaux & chevrons bois',      sub: 'Bois traité classe 4',            amazon: 'poteau bois traité classe 4 pergola' },
      { icon: 'hardware',     label: 'Sabots & connecteurs métal',   sub: 'Ancrage de poteau galvanisé',     amazon: 'sabot de poteau galvanisé ancrage' },
      { icon: 'build',        label: 'Visserie structure inox',      sub: 'Tire-fond + vis inox A2',         amazon: 'tire-fond inox A2 bois construction' },
      { icon: 'format_paint', label: 'Lasure / saturateur',          sub: 'Protection bois extérieur',       amazon: 'lasure bois extérieur incolore' },
    ],
  },
};
