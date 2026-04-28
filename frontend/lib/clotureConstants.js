/**
 * clotureConstants.js — Constantes du module Clôture V1
 *
 * Clôture bois droite : poteaux réguliers, 2 rails (lisses), lames verticales
 *
 * Convention d'axes :
 *   X = longueur clôture (direction linéaire)
 *   Z = profondeur (non utilisé, toujours 0)
 *   Y = hauteur (vertical)
 */

// ── Sections bois (m) ───────────────────────────────────────────
export const POST_SECTION = 0.09;       // Poteau 90×90 mm
export const POST_DEPTH = 0.09;         // Épaisseur poteau
export const RAIL_W = 0.07;             // Largeur rail (lisse) 70 mm
export const RAIL_H = 0.025;            // Hauteur rail (section 70×25 mm)
export const BOARD_W = 0.12;            // Largeur lame 120 mm
export const BOARD_H = 0.015;           // Épaisseur lame 15 mm

// ── Dimensions de la clôture (m) ────────────────────────────────
export const DEFAULT_HEIGHT = 1.50;     // Hauteur clôture par défaut (m)
export const POST_SPACING = 2.00;       // Entraxe poteaux (m)
export const BOARD_GAP = 0.02;          // Espace entre lames (m)

// ── Insets des rails (m) ────────────────────────────────────────
export const RAIL_INSET_TOP = 0.10;     // Distance haut clôture → rail haut (m)
export const RAIL_INSET_BOTTOM = 0.10;  // Distance bas clôture → rail bas (m)

// ── Ancrage poteau (m) ──────────────────────────────────────────
/** Profondeur d'ancrage minimale (m) — règle empirique chantier : ≥ 1/3 hauteur hors-sol.
 *  Pour DEFAULT_HEIGHT = 1.50 m → min recommandé = 0.50 m (DTU 31.1 pratique).
 *  L'engine applique max(FOOT_EMBED, clotureHeight / 3) pour s'adapter à la hauteur. */
export const FOOT_EMBED = 0.50;         // Profondeur ancrage poteau dans le sol (m)

/** Clearance minimum bois de bout bas depuis le sol (m) — DTU 31.1 §5.10.4.2.
 *  Poteaux directement dans le sol → classe d'emploi 4 → bois traité UC4 obligatoire. */
export const FOOT_CLEARANCE_MIN = 0.15;

// ── Quincaillerie (pièces) ──────────────────────────────────────
export const VIS_PER_BOARD = 4;         // Vis par lame (2 par rail)
export const VIS_PER_RAIL_POST = 2;     // Vis par intersection rail/poteau

// ── Béton de scellement ─────────────────────────────────────────
// 1 sac 25 kg par poteau — pratique standard chantier clôture (FOOT_EMBED = 0.50m)
export const CONCRETE_BAGS_PER_POST = 1; // sac(s) 25 kg par poteau
