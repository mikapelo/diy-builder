/**
 * bardageConstants.js — Constantes du module Bardage V1
 *
 * Bardage bois extérieur : lames horizontales ou verticales fixées sur
 * une ossature secondaire (tasseaux), avec recouvrement ou emboîtement
 * pour assurer le rejet d'eau.
 *
 * Source : NF DTU 41.2 P1-1 (août 2015) — Revêtements extérieurs en bois
 *
 * Convention d'axes :
 *   X = largeur surface à barder (direction horizontale)
 *   Y = hauteur surface à barder (vertical)
 *   Z = profondeur (épaisseur ossature + lame)
 */

// ── Lames de bardage (m) ────────────────────────────────────────
/** Largeur standard lame 140 mm — DTU 41.2 §7.6.2 (lames courantes ≥ 125 mm largeur utile). */
export const LAME_WIDTH       = 0.140;
/** Épaisseur lame 21 mm — DTU 41.2 §7.6.2.1 (entraxe supports > 40 cm → épaisseur ≥ 18 mm ; retenu 21 mm pour sécurité). */
export const LAME_THICKNESS   = 0.021;

// ── Recouvrement / pureau ───────────────────────────────────────
/** Recouvrement minimum entre lames (m) — DTU 41.2 §7.6.2.3 :
 *  ≥ 10 % largeur hors tout avec minimum de 10 mm pour largeur < 150 mm.
 *  Valeur retenue : 20 mm — conservateur pour lame 140 mm. */
export const RECOUVREMENT     = 0.020;

/** Pureau visible = largeur - recouvrement (m). */
export const LAME_VISIBLE     = LAME_WIDTH - RECOUVREMENT;

// ── Ossature secondaire (tasseaux) ──────────────────────────────
/** Épaisseur tasseau 27 mm — DTU 41.2 §7.6.1.1 (tasseaux 27 mm autorisent
 *  espacement des fixations jusqu'à 65 cm). */
export const TASSEAU_SECTION  = 0.027;

/** Entraxe maximal entre tasseaux verticaux (m) — DTU 41.2 §7.6.1.2.1 :
 *  entraxe des supports limité à 65 cm selon nature/épaisseur lames ;
 *  valeur retenue : 60 cm (sécurité + aligne avec STUD_SPACING ossature bois). */
export const TASSEAU_SPACING  = 0.600;

// ── Classes d'emploi (NF EN 335) ────────────────────────────────
/** Classe d'emploi des lames de bardage extérieur — DTU 41.2 §7.2.2 :
 *  UC3b pour conception drainante avec protection en tête ; standard retenu. */
export const WOOD_CLASS_LAME  = 'UC3b';
/** Classe d'emploi des tasseaux — DTU 41.2 Annexe B :
 *  tasseaux protégés par les lames → UC3a suffit. */
export const WOOD_CLASS_TASS  = 'UC3a';

// ── Fixations (m) ───────────────────────────────────────────────
/** Diamètre vis inox A4 4 mm (m) — DTU 41.2 §7.6.2.4
 *  (fixations acier inoxydable obligatoires pour bardage). */
export const VIS_DIAM         = 0.004;

/** Nombre de vis par lame par tasseau — DTU 41.2 §7.6.2.5 :
 *  deux fixations par appui pour lames > 125 mm de largeur utile. */
export const VIS_PER_LAME     = 2;
