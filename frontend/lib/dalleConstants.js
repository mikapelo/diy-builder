/**
 * dalleConstants.js — Constantes du module Dalle béton V1
 *
 * Source : NF DTU 13.3 P1-1 (décembre 2021)
 *   - Travaux de dallages — conception, calcul et exécution
 *   - Dallages en béton à base de liants hydrauliques (intérieurs et extérieurs)
 *
 * Périmètre : dalle désolidarisée non armée ou treillis ST25, usage domestique
 * (cour, allée, abri voiture, parking léger). Hors maisons individuelles strict
 * sens DTU 13.3-P1.1 §1 mais applicable aux ouvrages extérieurs domestiques.
 *
 * Convention d'axes :
 *   X = largeur (m)
 *   Z = profondeur (m)
 *   Y = vertical (épaisseur dalle)
 */

// ── Épaisseurs (m) — DTU 13.3 §5 "Dimensionnement" ──────────────
export const EPAISSEUR_PIETONNE  = 0.10;  // dalle piétonne / usage domestique léger
export const EPAISSEUR_VEHICULE  = 0.12;  // dalle véhicule léger (< 3,5 t)
export const EPAISSEUR_PL        = 0.20;  // dalle poids lourds / charges concentrées

// ── Pente drainage — DTU 13.3 §5 (extérieurs) ───────────────────
export const PENTE_MIN           = 0.01;  // 1 cm/m minimum pour évacuation eaux

// ── Joints de fractionnement — DTU 13.3 §6 "Joints" ─────────────
// Surface maximale entre joints pour maîtriser la fissuration de retrait.
// Valeurs conservatrices issues des recommandations §6 (dallages extérieurs).
export const JOINT_AREA_PIETON   = 25;    // m² max entre joints — usage piéton
export const JOINT_AREA_VEHICULE = 40;    // m² max entre joints — usage véhicule

// ── Couche de forme — DTU 13.3 §7 "Exécution" ───────────────────
export const FORME_THICKNESS     = 0.10;  // épaisseur forme gravillons 0/31.5 (m)

// ── Béton — DTU 13.3 §5.3 "Caractéristiques du béton" ───────────
export const BETON_C25_30        = 'C25/30'; // classe de résistance minimale
export const SAC_BETON_KG        = 35;       // masse sac béton prêt-à-gâcher (kg)
export const SAC_BETON_VOLUME    = 0.017;    // volume béton rendu par sac 35 kg (m³)

// ── Treillis soudé — DTU 13.3 §5.4 "Armatures" ──────────────────
export const TREILLIS_MESH       = 0.15;  // maille ST25 — 150×150 mm
export const TREILLIS_OVERLAP    = 0.20;  // recouvrement min panneaux (m)

// ── Seuils fonctionnels ─────────────────────────────────────────
// Au-delà, on bascule du sac prêt-à-gâcher vers la livraison toupie (camion).
export const TOUPIE_VOLUME_THRESHOLD = 3;    // m³ — bascule vers camion toupie
export const TREILLIS_SURFACE_THRESHOLD = 10; // m² — treillis recommandé par défaut
export const TREILLIS_OVERLAP_FACTOR    = 1.15; // 15% majoration surface achat treillis

// NOTE : le waste factor (pertes béton/coupe treillis) est géré par
// costCalculator.js uniquement. Aucun export WASTE_FACTOR ici.
