/**
 * pergolaConstants.js — Constantes du module Pergola V1
 *
 * Sources :
 *   - Guide COBEI §3.1 (FCBA/CODIFAB, 2022)
 *   - BILP Pergola — Projet G (mélèze, 6×4×2.5 m)
 *   - docs/pergola-design-rules.md
 *
 * Catégorie : product_preset (pas de norme DTU spécifique aux pergolas)
 *
 * Convention d'axes :
 *   X = largeur (longerons courent en X)
 *   Z = profondeur (chevrons courent en Z)
 *   Y = hauteur (vertical)
 */

// ── Sections (m) ────────────────────────────────────────────────
export const POST_SECTION   = 0.10;   // Poteau 100×100 mm (BILP Projet G)
export const BEAM_W         = 0.05;   // Longeron largeur 50 mm
export const BEAM_H         = 0.15;   // Longeron hauteur 150 mm
export const RAFTER_W       = 0.05;   // Chevron largeur 50 mm
export const RAFTER_H       = 0.08;   // Chevron hauteur 80 mm (portées ≤ 3.5 m)

// ── Sections chevrons variables selon la profondeur (portée) ────
// Au-delà de 3.5 m de portée, la section 50×80 est marginale en flèche L/300
export const RAFTER_SECTIONS = [
  { maxDepth: 3.5,      w: 0.050, h: 0.080 }, // 50×80 mm — portées ≤ 3.5 m
  { maxDepth: Infinity,  w: 0.050, h: 0.100 }, // 50×100 mm — portées > 3.5 m
];

// ── Espacement (m) ──────────────────────────────────────────────
export const RAFTER_SPACING = 0.60;   // Entraxe chevrons (best_practice COBEI + BILP)
export const MAX_POST_SPAN  = 3.50;   // Portée libre max entre poteaux (m) — Guide COBEI §3.1

// ── Dimensions par défaut (m) ───────────────────────────────────
export const DEFAULT_HEIGHT = 2.30;   // Hauteur poteau sol→longeron (product_preset)
export const OVERHANG       = 0.15;   // Porte-à-faux chevron de chaque côté (best_practice COBEI §3.1)
/** Distance min pied de poteau → sol (m) — DTU 31.1 §5.10.4.2 :
 *  ≥ 150 mm depuis sol naturel, OU ≥ 100 mm depuis nu supérieur plot béton.
 *  La valeur 150 mm couvre les deux cas (sol naturel et plot béton).
 *  COBEI §3.3.4.4 recommande la même valeur pour poteaux sur platines. */
export const FOOT_CLEARANCE = 0.15;

// ── Sections variables selon la portée (m) ──────────────────────
// Sélection dynamique de la section de longeron basée sur la portée réelle
export const BEAM_SECTIONS = [
  { maxSpan: 3.0,     w: 0.050, h: 0.150 }, // 50×150 mm — portées ≤ 3m
  { maxSpan: 4.5,     w: 0.063, h: 0.175 }, // 63×175 mm — portées 3m–4.5m
  { maxSpan: Infinity, w: 0.075, h: 0.200 }, // 75×200 mm — portées > 4.5m
];

// ── Jambes de force (contreventement diagonal) ─────────────────
// Supports angulaires poteau→longeron, 1 par côté par poteau (2 par poteau)
// Références : plans professionnels standard, COBEI §3.1 bonnes pratiques
export const BRACE_SECTION    = 0.075;  // Section carrée 75×75 mm (standard commerce bois raboté)
export const BRACE_DROP       = 0.60;   // Descente verticale depuis le longeron (m)
export const BRACE_RUN        = 0.50;   // Course horizontale le long du longeron (m)
export const VIS_PER_BRACE    = 4;      // Vis/boulons par jambe de force (2 par extrémité)

// ── Débord longerons ────────────────────────────────────────────
export const BEAM_OVERHANG    = 0.20;   // Débord longeron au-delà des poteaux extrêmes (m)

// ── Quincaillerie ───────────────────────────────────────────────
export const VIS_PER_RAFTER_BEAM = 2; // Vis D6×90 par intersection chevron/longeron (COBEI §3.1.4)
export const VIS_PER_POST_BEAM   = 4; // Vis/boulons par assemblage poteau/longeron
export const ANCHORS_PER_POST    = 1; // Pied de poteau (platine) par poteau
export const BOULONS_PER_TRAVERSE = 2; // Boulons M10 par assemblage traverse/longeron

// NOTE : le waste factor (10%) est géré par costCalculator.js uniquement.
// Aucun export WASTE_FACTOR ici — supprimé le 2026-04-12.
