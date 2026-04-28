/**
 * cabanonConstants.js — Constantes structurelles du module Cabanon
 *
 * Source de vérité unique pour les cotes DTU utilisées
 * par l'engine, le rendu 3D, les vues SVG/PDF et les contrôles UI.
 *
 * Références : NF DTU 31.2 P1-1 (mai 2019) — ossature bois voile travaillant
 *              NF DTU 31.1 P1-1 (juin 2017) — toiture mono-pente
 * NE PAS modifier ces valeurs sans justification technique.
 */

/** Entraxe montants (m) — DTU 31.2 §9.2.1 : entraxe max 60 cm (valeur limite) */
export const STUD_SPACING   = 0.60;

/** Majoration toiture mono-pente — facteur matériaux (pertes + recouvrements) */
export const ROOF_COEF      = 1.10;

/** Coefficient géométrique pente mono-pente (dénivelé / largeur)
 *  0.268 → angle ~15° (norme DTU 31.1 : pente min 15° pour toiture bois)
 *  ATTENTION : ROOF_COEF (facteur matériaux) ≠ SLOPE_RATIO (géométrie pure) */
export const SLOPE_RATIO    = 0.268;

/** Hauteur standard cabanon (m) */
export const DEFAULT_HEIGHT = 2.30;

/** Section pièces bois 95×95 mm (m) — DTU 31.2 §9.1.1.2 : largeur min ≥ 95 mm à l'humidité
 *  de service. Validée pour cabanon ≤ 2,60 m de hauteur, entraxe 60 cm, charges modérées
 *  (zone neige 1A/1B, vent régional 1/2). Au-delà, consulter un BET ou utiliser
 *  des montants 45×120 mm (section rectangulaire — nécessiterait une refonte
 *  de la couche geometry). */
export const SECTION        = 0.095;

/** Zone de coin sans montant régulier (m) — couvre les 2 montants L-corner (H + SEC + H = 0.18m) */
export const CORNER_ZONE    = 0.20;

/** Hauteur linteau (m) — DTU 31.2 §9.2.3.1 : "les linteaux doivent faire l'objet
 *  d'une justification mécanique". Valeur forfaitaire 12 cm validée pour portées
 *  ≤ 1.20 m (porte 0.9 m + fenêtre 0.6 m par défaut). Au-delà, calcul EC5 requis. */
export const LINTEL_H       = 0.12;

/** Hauteur seuil / appui (m) — identique à SECTION */
export const SILL_H         = SECTION;

/** Section bastaing — petite dimension (m) ≈ 63 mm */
export const BASTAING_W     = 0.063;

/** Section bastaing — grande dimension verticale (m) ≈ 150 mm */
export const BASTAING_H     = 0.15;

/** Espacement entretoises de toiture entre chevrons (m) — DTU 31.1 : 40 à 60 cm.
 *  Posées en quinconce (décalées d'un bay sur deux) pour permettre le clouage
 *  en bout depuis la face extérieure de chaque chevron. */
export const ROOF_ENTRETOISE_SPACING = 0.60;

// ── Voile de contreventement OSB (DTU 31.2 §9.2.2) ─────────────────────────
/** Épaisseur panneau OSB 3 (m) — DTU 31.2 §9.2.2 : ≥ 9 mm (OSB 3) ou ≥ 7 mm (CP).
 *  L'OSB 3 est le choix standard pour ossature bois en classe de service 2. */
export const OSB_THICKNESS  = 0.009;   // 9 mm

/** Largeur standard panneau OSB (m) — format commercial 122 × 244 cm */
export const OSB_PANEL_W    = 1.22;

/** Hauteur standard panneau OSB (m) — format commercial 122 × 244 cm */
export const OSB_PANEL_H    = 2.44;

/** Surface utile d'un panneau OSB standard (m²) — 1.22 × 2.44 */
export const OSB_PANEL_AREA = +(1.22 * 2.44).toFixed(4); // 2.9768 m²
