/* ═══════════════════════════════════════════════════════════════
   Calculateur de dalle béton — SOURCE UNIQUE DE VÉRITÉ
   Référence : bonnes pratiques construction (DTU 20.1 simplifié)

   Cette fonction est la SEULE source autorisée pour les calculs
   de fondation. UI, liste matériaux et PDF l'utilisent telle quelle.
   Aucun recalcul ne doit exister ailleurs.
═══════════════════════════════════════════════════════════════ */

/** Prix unitaires (€) — ajuster ici pour toutes les vues */
export const FOUNDATION_PRICES = {
  BETON_M3:       130,    // béton prêt à l'emploi C20/25 livré (€/m³)
  TREILLIS_PANEL:  18,    // panneau treillis ST25C — 2,4×1,2 m (€/panneau)
  CALES_UNIT:       0.25, // cale plastique support treillis (€/pièce)
  POLYANE_M2:       0.40, // film polyane 200 µ (€/m²)
  GRAVIER_M3:      28,    // gravier couche de forme compactée (€/m³)
  COFFRAGE_ML:      6,    // coffrage périphérique bois (€/ml)
  JOINTS_ML:        3.50, // profilé joint de fractionnement PVC (€/ml)
};

/** Dimensions standard d'un panneau de treillis ST25C */
export const TREILLIS_PANEL_W    = 2.4;   // m
export const TREILLIS_PANEL_L    = 1.2;   // m
export const TREILLIS_PANEL_AREA = TREILLIS_PANEL_W * TREILLIS_PANEL_L; // 2,88 m²

/** Paramètres de calcul */
export const BETON_MARGIN          = 1.08; // +8 % marge pertes chantier
export const GRAVIER_MARGIN        = 1.10; // +10 % marge compactage
export const CALES_PER_M2          = 4;    // 4 cales support par m²
export const JOINTS_MAX_SPAN       = 4;    // entraxe max joints (m)
export const JOINTS_AREA_THRESHOLD = 15;   // surface seuil déclenchant les joints (m²)

/* ── Limites acceptées pour les inputs ─────────────────────── */
const DIM_MIN       = 0.5;   // largeur / profondeur min (m)
const DIM_MAX       = 30;    // largeur / profondeur max (m)
const THICKNESS_MIN = 6;     // épaisseur dalle min (cm)
const THICKNESS_MAX = 30;    // épaisseur dalle max (cm)

/**
 * Retourne une valeur numérique sécurisée dans [min, max].
 * Protège contre NaN, undefined, Infinity.
 */
function clamp(v, min, max, fallback) {
  const n = parseFloat(v);
  if (!isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/**
 * Calcule l'ensemble des matériaux et des prix d'une dalle béton.
 *
 * @param {number} width       Largeur de la terrasse (m)
 * @param {number} depth       Profondeur de la terrasse (m)
 * @param {number} thicknessCm Épaisseur de la dalle (cm)
 * @returns {object}           foundationData — données complètes
 */
export function calcFoundation(width, depth, thicknessCm) {
  /* ── Garde : inputs sanitisés avant tout calcul ─────────── */
  const w    = clamp(width,       DIM_MIN,       DIM_MAX,       1);
  const d    = clamp(depth,       DIM_MIN,       DIM_MAX,       1);
  const tcm  = clamp(thicknessCm, THICKNESS_MIN, THICKNESS_MAX, 12);

  const area       = +(w * d).toFixed(2);
  const thicknessM = tcm / 100;

  /* ── A. Béton C20/25 — volume net + marge chantier 8 % ──────── */
  const betonVolumeNet = +(area * thicknessM).toFixed(3);
  const betonVolume    = +(betonVolumeNet * BETON_MARGIN).toFixed(3);
  const betonPrice     = +(betonVolume * FOUNDATION_PRICES.BETON_M3).toFixed(2);

  /* ── B. Treillis soudé ST25C — 10 % recouvrement entre panneaux */
  const treillisArea   = +(area * 1.10).toFixed(2);
  const treillisPanels = Math.ceil(treillisArea / TREILLIS_PANEL_AREA);
  const treillisPrice  = +(treillisPanels * FOUNDATION_PRICES.TREILLIS_PANEL).toFixed(2);

  /* ── C. Cales support treillis — 4 par m² ───────────────────── */
  const calesQty   = Math.ceil(area * CALES_PER_M2);
  const calesPrice = +(calesQty * FOUNDATION_PRICES.CALES_UNIT).toFixed(2);

  /* ── D. Film polyane 200 µ — +10 % pour jonctions ───────────── */
  const polyaneArea  = +(area * 1.10).toFixed(2);
  const polyanePrice = +(polyaneArea * FOUNDATION_PRICES.POLYANE_M2).toFixed(2);

  /* ── E. Gravier — couche de forme compactée 10 cm + 10 % marge  */
  const gravierVolume = +(area * 0.10 * GRAVIER_MARGIN).toFixed(3);
  const gravierPrice  = +(gravierVolume * FOUNDATION_PRICES.GRAVIER_M3).toFixed(2);

  /* ── F. Coffrage bois — périmètre de la dalle ────────────────── */
  const coffrageLinear = +(2 * (w + d)).toFixed(2);
  const coffragePrice  = +(coffrageLinear * FOUNDATION_PRICES.COFFRAGE_ML).toFixed(2);

  /* ── G. Joints de fractionnement — si surface > 15 m² ───────── */
  /* Règle : 1 joint intérieur tous les 4 m dans chaque direction   */
  const needsJoints = area > JOINTS_AREA_THRESHOLD;
  const jointsX     = needsJoints ? Math.max(0, Math.ceil(w / JOINTS_MAX_SPAN) - 1) : 0;
  const jointsY     = needsJoints ? Math.max(0, Math.ceil(d / JOINTS_MAX_SPAN) - 1) : 0;
  const jointsLinear = +(jointsX * d + jointsY * w).toFixed(2);
  const jointsActive = jointsLinear > 0;
  const jointsPrice  = +(jointsLinear * FOUNDATION_PRICES.JOINTS_ML).toFixed(2);

  /* ── Total fondation ─────────────────────────────────────────── */
  const totalPrice = +(
    betonPrice + treillisPrice + calesPrice + polyanePrice +
    gravierPrice + coffragePrice + jointsPrice
  ).toFixed(2);

  return {
    thicknessCm: tcm,   // valeur sanitisée (identique à l'input si valide)
    area,
    /* Béton */    betonVolumeNet, betonVolume,    betonPrice,
    /* Treillis */ treillisArea,   treillisPanels, treillisPrice,
    /* Cales */    calesQty,       calesPrice,
    /* Polyane */  polyaneArea,    polyanePrice,
    /* Gravier */  gravierVolume,  gravierPrice,
    /* Coffrage */ coffrageLinear, coffragePrice,
    /* Joints */   jointsActive,   jointsLinear,   jointsPrice,
    /* Total */    totalPrice,
  };
}
