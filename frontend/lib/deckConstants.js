/**
 * deckConstants.js — Constantes physiques et réglementaires DTU 51.4
 *
 * Source unique de vérité pour DeckScene.jsx et TechnicalPlan.jsx.
 * Toute modification ici se répercute automatiquement sur les deux composants.
 */

/* ── Sections des lames (m) ─────────────────────────────── */
export const BOARD_THICK    = 0.028;  // 28 mm épaisseur lame
export const BOARD_WIDTH    = 0.145;  // 145 mm largeur lame
export const BOARD_GAP      = 0.003;  // 3 mm joint latéral entre lames
export const BOARD_LEN      = 3.0;    // longueur standard lame
export const CUT_GAP        = 0.005;  // 5 mm espace bout-à-bout aux coupes
export const BOARD_OVERHANG = 0.012;  // 12 mm débord des lames (DTU 51.4)

/* ── Sections des lambourdes (m) ────────────────────────── */
export const JOIST_W   = 0.060;  // 60 mm largeur lambourde — DTU 51.4 §5.5.3.6.1 : lame ≥ 145 mm → 2 vis → lambourde ≥ 60 mm
export const JOIST_H   = 0.070;  // 70 mm hauteur lambourde
export const JOIST_LEN = 3.0;    // longueur standard lambourde

/* ── Plots béton (m) ────────────────────────────────────── */
export const PAD_SIZE = 0.200;  // 200 mm côté plot
export const PAD_H    = 0.060;  // 60 mm hauteur plot (> 45 mm min. ventilation DTU)

/* ── Bande bitume d'interposition (m) ───────────────────── */
export const BANDE_THICK = 0.003;  // 3 mm épaisseur bande bitume

/* ── Entraxes DTU 51.4 (m) ──────────────────────────────── */
export const JOIST_ENTRAXE = 0.40;  // 40 cm entre axes lambourdes — [2026-03] DTU-like: entraxe max 45×70 sur plots 200×200
export const PAD_ENTRAXE   = 0.60;  // 60 cm entre axes plots      — [2026-03] DTU-like: portée max lambourde 60 cm
export const ENTR_SPACING  = 1.50;  // 1.5 m entre rangées d'entretoises

/* ── Limites de sécurité (prévient surcharge WebGL / SVG) ── */
export const MAX_JOIST_COUNT = 25;  // max lambourdes
export const MAX_PAD_ROWS    = 15;  // max rangées de plots
export const MAX_BOARD_ROWS  = 60;  // max rangées de lames

/* ── Positions Y des couches structurelles (m) ──────────── */
export const Y_PAD   = PAD_H / 2;
export const Y_JOIST = PAD_H + JOIST_H / 2;
export const Y_BOARD = PAD_H + JOIST_H + BOARD_THICK / 2;

/* ── Vue éclatée — amplitude des décalages Y (m) ───────── */
export const EXPLODE_BOARDS = 0.70;
export const EXPLODE_JOISTS = 0.32;

/* ── Pente structurelle (rad) — DTU 51.4 : 1.5 % ─────────
   tan(θ) ≈ 0.015  →  θ ≈ 0.86°                           */
export const SLOPE_RAD = 0.015;
