/**
 * gardeCorpsConstants.js — Constantes du module Garde-corps V1
 *
 * Extension optionnelle du simulateur Terrasse. Calcule les quantitatifs
 * d'un garde-corps bois (poteaux + lisses haute/basse + balustres verticaux)
 * à partir du périmètre de la terrasse.
 *
 * Sources :
 *   - NF DTU 36.3 P3 (septembre 2014) — Escaliers en bois et garde-corps associés
 *     Annexe C : Escaliers et garde-corps extérieurs — règles de conception
 *     complémentaires (classe d'emploi 3b en extérieur non abrité, 3a abrité).
 *   - NF EN 1991-1-1 / NA (Eurocode 1) — charges d'exploitation garde-corps
 *   - Code de la construction et de l'habitation, article R111-15 :
 *     hauteur mini 1.00 m pour tout dénivelé ≥ 1.00 m.
 *   - Décret 95-949 (sécurité enfants) : espacement libre entre éléments
 *     verticaux ≤ 110 mm pour empêcher le passage d'une tête d'enfant.
 *
 * Convention d'axes (cohérente avec la terrasse) :
 *   X = direction principale du linéaire
 *   Z = transverse
 *   Y = hauteur (vertical)
 */

// ── Règles DTU / réglementaires ─────────────────────────────────

/** Entraxe maxi entre poteaux (m) — NF DTU 36.3 P3 §C.2 + pratique chantier :
 *  1.20 m garantit la tenue aux efforts horizontaux réglementaires (Eurocode 1)
 *  pour une section poteau 70×70 mm en bois résineux UC3b. */
export const MAX_POST_SPACING = 1.20;

/** Espacement libre maxi entre balustres (m) — Décret 95-949 (sécurité enfants) :
 *  passage libre ≤ 110 mm dans toute zone située entre 0.45 m et 1.00 m du sol.
 *  Valeur appliquée à toute la hauteur par sécurité. */
export const MAX_BALUSTER_GAP = 0.11;

/** Hauteur mini garde-corps (m) — CCH R111-15 :
 *  ≥ 1.00 m dès que le dénivelé protégé est ≥ 1.00 m (terrasses surélevées). */
export const MIN_HEIGHT_TERRACE = 1.00;

/** Hauteur mini garde-corps (m) pour un dénivelé < 1.00 m —
 *  pratique : 0.80 m suffit (non obligatoire mais recommandé). */
export const MIN_HEIGHT_LOW = 0.80;

// ── Sections bois (m) ───────────────────────────────────────────

/** Section poteau 70×70 mm — NF DTU 36.3 P3 §C.1 :
 *  section rectangulaire admissible pour UC3b en résineux traité. */
export const POST_SECTION = 0.07;

/** Largeur lisse 60 mm — NF DTU 36.3 P3 §C.2 figure C.2 :
 *  main courante avec forme bombée supérieure possible. */
export const RAIL_SECTION_W = 0.06;

/** Hauteur (épaisseur) lisse 40 mm — NF DTU 36.3 P3 §C.2 :
 *  cohérente avec section 60×40 usuelle. */
export const RAIL_SECTION_H = 0.04;

/** Section balustre 40×40 mm — NF DTU 36.3 P3 §C.2 figure C.3 :
 *  section carrée standard pour barreaudage vertical. */
export const BALUSTER_SECTION = 0.04;

// ── Durabilité bois ─────────────────────────────────────────────

/** Classe d'emploi UC3b — NF DTU 36.3 P3 §C.1 / FD P 20-651 :
 *  extérieur abrité conception drainante. Pour extérieur non abrité,
 *  choisir UC4 via les prix matériaux (responsabilité costCalculator). */
export const WOOD_CLASS = 'UC3b';

// ── Ancrage ─────────────────────────────────────────────────────

/** Longueur d'ancrage minimale du poteau dans la structure de terrasse (m) —
 *  pratique chantier : platine + vis tire-fond M12 sur au moins 100 mm
 *  pour garantir la reprise du moment horizontal réglementaire. */
export const POST_EMBED = 0.10;

// NOTE : le waste factor (pertes coupe/chutes) est géré par costCalculator.js.
// Aucun export WASTE_FACTOR ici — l'engine retourne des quantités brutes.
