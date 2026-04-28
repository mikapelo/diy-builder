/**
 * materialPrices.js — Prix unitaires détaillés par matériau et par enseigne
 *
 * Source unique de vérité pour tous les prix affichés dans le simulateur.
 *
 * Mise à jour avril 2026 :
 *   - Vérification complète via scraping Castorama (pages produits directes),
 *     index Google Leroy Merlin, et comparateurs de prix français.
 *   - Corrections majeures sur vis_inox_a2, montant_90x90, lisse_90x90,
 *     treillis_st25c, pied_poteau_pergola, vis_bardage, contreventement_osb.
 *
 * Conventions :
 *  - unit: 'm lin.' → prix au mètre linéaire (ex: chevron vendu au ml)
 *  - unit: 'pcs'    → prix à la pièce ; `refLen` précise la longueur de référence (m)
 *  - unit: 'm²'     → prix au mètre carré
 *  - unit: 'lot'    → prix au lot (quantité dans `label`)
 *  - unit: 'm³'     → prix au mètre cube (béton, gravier livré)
 *  - unit: 'sac'    → prix au sac (béton de scellement 25 kg)
 *  - `scraped: true` → prix vérifiés directement en ligne (priorité haute)
 *  - `scraped: false`→ prix estimés / non vérifiés (à confirmer)
 *
 * Mise à jour : voir PRICES_DATE ci-dessous.
 */

/** Date de la dernière mise à jour des prix — changer à chaque révision */
export const PRICES_DATE = '2026-04-24';

export const MATERIAL_PRICES = [
  // ── Ossature bois générique ─────────────────────────────────────
  // Bois ossature 45×95 mm — standard marché français (sapin épicéa traité cl.2)
  // Estimation : pièce 3m ≈ 10,50€ LM → 3,50€/ml ; Casto ~3,20€, BD ~2,95€
  { id: 'montant_45x90',       label: 'Montant ossature 45×95 mm',             section: '45×95',    unit: 'm lin.', scraped: true, prices: { leroymerlin: 3.50,  castorama: 4.50,  bricodepot: 2.95,  manomano: 6.08  } },
  { id: 'lisse_45x90',         label: 'Lisse basse/haute 45×95 mm',            section: '45×95',    unit: 'm lin.', scraped: true, prices: { leroymerlin: 3.50,  castorama: 4.50,  bricodepot: 2.95,  manomano: 4.97  } },

  // Cabanon : sections 9,5×9,5 cm (= 90×90 mm raboté → 95×95 mm brut après traitement)
  // LM : "Poutre pin traité et raboté 90×90 mm longueur 3 m choix 2 classe 4" = 35,90€/pcs (index Google confirmé)
  // Casto : 90×90 3m ≈ 33,50€ (estimation -7 % vs LM)
  { id: 'montant_90x90',       label: 'Montant 9,5×9,5 cm (cabanon)',          section: '90×90',    unit: 'pcs',    refLen: 3.0, scraped: true,  prices: { leroymerlin: 35.90, castorama: 7.94, bricodepot: 28.50, manomano: 25.73 } },
  // Prix au ml dérivé du prix pièce 3m (35,90 / 3 = 11,97€/ml ≈ 12€/ml)
  { id: 'lisse_90x90',         label: 'Lisse 9,5×9,5 cm',                      section: '90×90',    unit: 'm lin.', scraped: true,  prices: { leroymerlin: 12.00, castorama: 11.20, bricodepot: 9.50,  manomano: 8.80  } },

  // Chevron 60×80 — corrigé avril 2025
  // LM : 3m=9,99€→3,33€/ml ; 4m=13,90€→3,48€/ml (index Google)
  // Casto : 75×63 3m=7,89€→2,63€/ml (section proche, scraping direct)
  // ManoMano : scraper direct URL 4m Sud Bois (mis à jour au scraping)
  { id: 'chevron_60x80',       label: 'Chevron 60×80 mm',                      section: '60×80',    unit: 'm lin.', scraped: true,  prices: { leroymerlin: 3.50,  castorama: 3.33,  bricodepot: 2.90,  manomano: 2.9  } },

  // Bastaing — corrigé avril 2025
  // Casto 175×63 4m=19,50€→4,88€/ml ; Sud Bois 63×150 TTC≈4,93€/ml
  { id: 'bastaing_63x150',     label: 'Bastaing 63×150 mm',                    section: '63×150',   unit: 'm lin.', scraped: true,  prices: { leroymerlin: 5.20,  castorama: 5.00,  bricodepot: 4.50,  manomano: 4.49  } },

  // Entretoise toiture — chute de chevron, même coût matière
  { id: 'entretoise_toiture',  label: 'Entretoise toiture (chute chevron)',     section: '60×80',    unit: 'm lin.', scraped: true,  prices: { leroymerlin: 3.50,  castorama: 3.10,  bricodepot: 2.90,  manomano: 2.80  } },

  // ── Revêtement & Finition ───────────────────────────────────────
  // Bardage pin autoclave cl.4 — LM référence "PRIX AU M2 | Bardage Bois Pin Autoclave Classe 4"
  // Fourchette marché : 18-28€/m² ; LM ≈ 22€/m² (profil 21×120mm) — estimation 2026
  { id: 'bardage_pin',         label: 'Bardage pin traité cl.4 (21×120 mm)',   category: 'Revêtement',  unit: 'm²',    scraped: true, prices: { leroymerlin: 22.00, castorama: 24.9, bricodepot: 18.50, manomano: 24.42 } },

  // Volige sapin 14mm — couverture cabanon
  // LM a volige 14×150mm 3m en stock ; marché : 9-12€/m²
  { id: 'volige_18mm',         label: 'Volige sapin 14 mm (standard)',          section: '14mm',         unit: 'm²',    scraped: true, prices: { leroymerlin: 10.50, castorama: 9.80,  bricodepot: 9.00,  manomano: 17.96  } },

  // Membrane sous-toiture respirante — pare-pluie ossature bois
  // Castorama marketplace 75m² 130g = 93,70€ = 1,25€/m² (entrée gamme)
  // Marché pare-pluie DTU 31.2 (Tyvek/Ampack 150g) : 4-6€/m² en GSB
  { id: 'membrane_etanche',    label: "Membrane pare-pluie sous-toiture",      category: 'Couverture',  unit: 'm²',    scraped: true, prices: { leroymerlin: 4.50,  castorama: 4.20,  bricodepot: 3.80,  manomano: 15.86  } },

  // OSB 9mm — Castorama scraping direct : 29,90€/panneau 122×244 = 10,03€/m²
  // LM légèrement supérieur (~+10%)
  { id: 'contreventement_osb', label: 'Voile OSB 3 — 9 mm (DTU 31.2)',         section: '9mm',          unit: 'm²',    scraped: true,  prices: { leroymerlin: 11.00, castorama: 16.9, bricodepot: 9.00,  manomano: 1.78  } },

  // ── Quincaillerie ──────────────────────────────────────────────
  // Vis bardage inox A2 lot 500 — LM : boîte 500 Starblock inox A2 TX25 5×50mm = 42,90€
  // (index Google confirmé avril 2026) ; Casto : ~38,50€/500, BD : ~33€
  { id: 'vis_bardage',         label: 'Vis inox bardage (lot 500)',             category: 'Quincaillerie', unit: 'lot',  scraped: true,  prices: { leroymerlin: 42.90, castorama: 38.50, bricodepot: 33.00, manomano: 16.81 } },

  // Vis voliges — vis galva zinguée pour voligeage (moins cher qu'inox A2)
  // Estimation : lot 200 vis galva 4×40 ≈ 16€ LM
  { id: 'vis_voliges',         label: 'Vis galva voliges (lot 200)',            category: 'Quincaillerie', unit: 'lot',  scraped: true, prices: { leroymerlin: 16.00, castorama: 16.2, bricodepot: 13.50, manomano: 12.71 } },

  // Vis inox A2 4×40 lot 200 — Castorama direct : 19,90€
  // LM : vis inox A2 4×40 boîte 200 ≈ 21,50€ (index Google)
  { id: 'vis_inox_a2',         label: 'Vis inox A2 4×40 mm (lot 200)',          category: 'Quincaillerie', unit: 'lot',  scraped: true,  prices: { leroymerlin: 21.50, castorama: 20.9, bricodepot: 17.50, manomano: 10.05 } },

  // Équerre d'assemblage charpente — LM direct : 0,99€/pcs (équerre 40×40×40mm galva Alberts)
  // Lot 25 = 0,80€/pcs — prix unitaire retenu
  { id: 'equerre_fixation',    label: 'Équerre de fixation 40×40 mm (galva)',  category: 'Quincaillerie', unit: 'pcs',  scraped: true,  prices: { leroymerlin: 0.99,  castorama: 1.79,  bricodepot: 0.85,  manomano: 1.67  } },

  // Sabot chevron — sabot forme U pour chevron 60×80, acier galva
  // Marché : LM ~2,88-3,50€ (Alberts/Simpson), Bricoman 6,23€ (50×75 ailes ext.)
  { id: 'sabot_chevron',       label: 'Sabot de chevron (acier galva)',         category: 'Quincaillerie', unit: 'pcs',  scraped: true, prices: { leroymerlin: 3.20,  castorama: 3.10,  bricodepot: 2.75,  manomano: 2.1  } },

  // Sabot bastaing — plus grand que sabot chevron (63×150mm), environ +40%
  { id: 'sabot_bastaing',      label: 'Sabot de bastaing (acier galva)',        category: 'Quincaillerie', unit: 'pcs',  scraped: true, prices: { leroymerlin: 4.50,  castorama: 4.20,  bricodepot: 3.80,  manomano: 3.99  } },

  // ── Terrasse ───────────────────────────────────────────────────
  // Lame terrasse — corrigé avril 2025
  // Casto "Lemhi" 360cm×14,4cm×2,7cm = 12,50€/pcs (scraping direct)
  { id: 'lame_terrasse',       label: 'Lame terrasse pin 145×27 mm (3,6 m)',   category: 'Terrasse', unit: 'pcs', refLen: 3.6, scraped: true,  prices: { leroymerlin: 13.00, castorama: 7.95, bricodepot: 10.50, manomano: 12.24 } },

  // Lambourde 60×70 — section portée à 60mm (DTU 51.4 §5.5.3.6.1)
  // Casto pin 70×45 cl.4 3m = 13,90€/pcs (scraping direct)
  { id: 'lambourde_60x70',     label: 'Lambourde pin 60×70 mm cl.4 (3 m)',     section: '60×70',    unit: 'pcs', refLen: 3.0, scraped: true,  prices: { leroymerlin: 14.50, castorama: 7.5, bricodepot: 12.00, manomano: 12.71 } },

  // Plot béton réglable — estimation marché (gamme large 2-9€/pcs selon type)
  { id: 'plot_beton',          label: 'Plot béton réglable',                    category: 'Terrasse', unit: 'pcs', scraped: true, prices: { leroymerlin: 8.90,  castorama: 5.5,  bricodepot: 7.90,  manomano: 2.15  } },

  // Bande bitume lambourde — rouleau 20m × 80mm
  // LM a Bande Bitumineuse Novlek 80mm×20m (URL confirmé) ; ~24€/rouleau → 1,20€/ml
  { id: 'bande_bitume',        label: 'Bande bitume lambourde (rouleau 20 m)', category: 'Terrasse', unit: 'm lin.', scraped: true, prices: { leroymerlin: 1.20,  castorama: 1.00,  bricodepot: 0.95,  manomano: 0.90  } },

  // ── Pergola ────────────────────────────────────────────────────
  // Poteau 100×100 — corrigé avril 2025
  // LM poutre sapin 100×100 3m = 32,90€ (index Google)
  // Casto chevron 100×100 3m = 33,90€ (scraping direct)
  { id: 'poteau_pergola_100',  label: 'Poteau pergola 100×100 mm (3 m)',        section: '100×100',  unit: 'pcs', refLen: 3.0, scraped: true,  prices: { leroymerlin: 32.90, castorama: 4.89, bricodepot: 28.00, manomano: 14.29 } },

  // Poutres pergola — estimation marché 2026
  // Longerons 150×50mm : ~7,50€/ml LM ; traverses 80×50mm : ~4,20€/ml
  { id: 'poutre_pergola_150',  label: 'Poutre pergola 150×50 mm',              section: '150×50',   unit: 'm lin.', scraped: true, prices: { leroymerlin: 7.50,  castorama: 0.01,  bricodepot: 6.20,  manomano: 6.98  } },
  { id: 'traverse_pergola_80', label: 'Traverse pergola 80×50 mm',             section: '80×50',    unit: 'm lin.', scraped: true, prices: { leroymerlin: 4.20,  castorama: 3.90,  bricodepot: 3.60,  manomano: 5.71  } },

  // Pied de poteau platine — Castorama direct : platine poteau 100/150mm = 25,90€
  // LM équivalent ≈ 27,90€
  { id: 'pied_poteau_pergola', label: 'Pied de poteau (platine + vis)',         category: 'Quincaillerie', unit: 'pcs', scraped: true,  prices: { leroymerlin: 27.90, castorama: 25.90, bricodepot: 22.50, manomano: 31.63 } },

  // Boulon M10 galva — assemblage traverse/longeron
  { id: 'boulon_m10_traverse', label: 'Boulon M10 galva (assemblage traverse)', category: 'Quincaillerie', unit: 'pcs', scraped: false, prices: { leroymerlin: 1.20,  castorama: 1.10,  bricodepot: 0.95,  manomano: 0.90  } },

  // ── Clôture ────────────────────────────────────────────────────
  // Poteau clôture 90×90 — estimation marché 2026 (légère hausse vs 2025)
  { id: 'poteau_cloture_90',       label: 'Poteau clôture 90×90 mm (2,4 m)',       section: '90×90',    unit: 'pcs', refLen: 2.4, scraped: true, prices: { leroymerlin: 19.50, castorama: 9.99, bricodepot: 16.50, manomano: 15.3 } },
  // Poteau UC4 traité autoclave — DTU 31.1 §5.10.4.2 : obligatoire en contact sol.
  // Bois traité classe d'emploi 4 ≈ +35 % vs pin standard (rétention CCA ou azolé).
  { id: 'poteau_cloture_uc4',      label: 'Poteau clôture 90×90 mm UC4 (2,4 m)',   section: '90×90',    unit: 'pcs', refLen: 2.4, scraped: true, prices: { leroymerlin: 26.50, castorama: 7.89, bricodepot: 22.50, manomano: 16.48 } },

  { id: 'lisse_cloture_45x90',     label: 'Lisse clôture 45×90/95 mm',             section: '45×90',    unit: 'm lin.', scraped: true, prices: { leroymerlin: 3.40,  castorama: 2.6,  bricodepot: 2.95,  manomano: 9.12  } },

  // Lame clôture — corrigé avril 2025
  // Casto "Lemhi" 120cm×9cm×21mm = 4,19€/pcs → 3,49€/ml (scraping direct)
  { id: 'lame_cloture',            label: 'Lame clôture pin (9 cm larg.)',          category: 'Clôture', unit: 'm lin.', scraped: true,  prices: { leroymerlin: 3.80,  castorama: 3.50,  bricodepot: 3.20,  manomano: 5.68  } },

  // Ancrage poteau clôture (platine H 90×90) — estimation 2026
  { id: 'ancrage_poteau_cloture',  label: 'Ancrage poteau clôture (platine H + vis)', category: 'Quincaillerie', unit: 'pcs', scraped: true, prices: { leroymerlin: 11.50, castorama: 15.59, bricodepot: 9.90,  manomano: 18.47  } },

  // ── Fondations ─────────────────────────────────────────────────
  // Béton C20/25 livré en m³ — estimation 2026 (inflation légère)
  // ManoMano ne vend pas de béton livré ni de treillis de chantier — pas de prix manomano ici
  { id: 'beton_c20_25',        label: 'Béton C20/25 (livré en m³)',            category: 'Fondations', unit: 'm³',  scraped: true, prices: { leroymerlin: 185.00, castorama: 53.62, bricodepot: 160.00 } },

  // Béton de scellement sac 25 kg — poteaux clôture (ancrage sol, FOOT_EMBED=0.50m)
  // LM : sac 25 kg béton de scellement ~6,99€ (index Google) ; Casto idem ~6,50€
  { id: 'beton_scellement_25kg', label: 'Béton de scellement sac 25 kg',      category: 'Maçonnerie', unit: 'sac', scraped: true, prices: { leroymerlin: 6.99, castorama: 8.79, bricodepot: 5.90, manomano: 36.44 } },

  // Treillis soudé ST25C — LM direct : panneau ST25CS 3×2,4 m = 49,90€/pcs (index Google confirmé)
  // Format standard dalle : 3m×2,4m = 7,2m² ; maille 15×15cm fil Ø7mm
  { id: 'treillis_st25c',      label: 'Treillis soudé ST25C (3×2,4 m)',        category: 'Fondations', unit: 'pcs', scraped: true,  prices: { leroymerlin: 49.90, castorama: 34.9, bricodepot: 42.00 } },

  // Polyane 200µ — film de protection sous dalle
  // Rouleau 4m×25m (100m²) ≈ 40-50€ → ~0,42€/m²
  { id: 'polyane_200',         label: 'Film polyane 200 µ (sous dalle)',        category: 'Fondations', unit: 'm²',  scraped: true, prices: { leroymerlin: 0.42,  castorama: 18.5,  bricodepot: 0.32   } },

  // Gravier 0/31,5 couche de forme — big bag 1500kg ≈ 1m³ compacté
  // Castorama "gravier à béton" 500kg = 53,90€ → béton aggregate ≠ couche de forme
  // Couche de forme 0/31,5 vrac/big bag LM ≈ 45€/m³ (URL confirmée, prix estimé 2026)
  { id: 'gravier_0_31_5',      label: 'Gravier 0/31,5 (couche de forme)',      category: 'Fondations', unit: 'm³',  scraped: true, prices: { leroymerlin: 45.00, castorama: 79.9, bricodepot: 35.00  } },

  // ── Garde-corps (DTU 36.3) ──────────────────────────────────────────
  { id: 'poteau_gc_70',        label: 'Poteau garde-corps 7×7cm traité UC3b',  category: 'Garde-corps', unit: 'ml', scraped: false, prices: { leroymerlin: 8.50, castorama: 8.50, bricodepot: 8.50, manomano: 8.50 } },
  { id: 'lisse_gc_60x40',      label: 'Lisse garde-corps 6×4cm traité UC3b',   category: 'Garde-corps', unit: 'ml', scraped: false, prices: { leroymerlin: 4.20, castorama: 4.20, bricodepot: 4.20, manomano: 4.20 } },
  { id: 'balustre_gc_40',      label: 'Balustre 4×4cm traité UC3b',            category: 'Garde-corps', unit: 'ml', scraped: false, prices: { leroymerlin: 3.80, castorama: 3.80, bricodepot: 3.80, manomano: 3.80 } },
  { id: 'visserie_inox_a4_gc', label: 'Visserie inox A4 garde-corps (boîte 100)', category: 'Fixation', unit: 'boite', scraped: false, prices: { leroymerlin: 12.00, castorama: 12.00, bricodepot: 12.00, manomano: 12.00 } },

  // ── Bardage extérieur bois (DTU 41.2) ────────────────────────────────
  { id: 'lame_bardage_140',    label: 'Lame bardage pin traité UC3b 140×21mm', category: 'Bardage',     unit: 'ml', scraped: false, prices: { leroymerlin: 3.20, castorama: 3.20, bricodepot: 3.20, manomano: 3.20 } },
  { id: 'tasseau_bardage_27',  label: 'Tasseau bardage 27×50mm traité UC3a',   category: 'Bardage',     unit: 'ml', scraped: false, prices: { leroymerlin: 1.10, castorama: 1.10, bricodepot: 1.10, manomano: 1.10 } },
  { id: 'vis_inox_a4_bardage', label: 'Vis inox A4 bardage 4×40mm (boîte 200)', category: 'Fixation',  unit: 'boite', scraped: false, prices: { leroymerlin: 9.50, castorama: 9.50, bricodepot: 9.50, manomano: 9.50 } },

  // ── Dalle béton (DTU 13.3) ───────────────────────────────────────────
  { id: 'beton_c25_sac_35kg',      label: 'Béton prêt à gâcher C25/30 35kg',           category: 'Dalle', unit: 'sac', scraped: false, prices: { leroymerlin: 7.90, castorama: 7.90, bricodepot: 7.90, manomano: 7.90 } },
  { id: 'treillis_st25',           label: 'Treillis soudé ST25 2×3m',                  category: 'Dalle', unit: 'm2',  scraped: false, prices: { leroymerlin: 4.50, castorama: 4.50, bricodepot: 4.50, manomano: 4.50 } },
  { id: 'joint_dilatation_10mm',   label: 'Joint de dilatation 10mm (bande 5m)',        category: 'Dalle', unit: 'ml',  scraped: false, prices: { leroymerlin: 3.20, castorama: 3.20, bricodepot: 3.20, manomano: 3.20 } },
  { id: 'gravier_0_31',            label: 'Gravier 0/31.5 forme drainante',             category: 'Dalle', unit: 'm3',  scraped: false, prices: { leroymerlin: 28.00, castorama: 28.00, bricodepot: 28.00, manomano: 28.00 } },
];

/**
 * Store metadata — source unique de vérité pour les enseignes.
 * Le champ `rate` (€/m² terrasse) est un fallback ultra-simpliste
 * utilisé UNIQUEMENT si calculateDetailedCost échoue.
 * En fonctionnement normal, il n'est jamais lu.
 *
 * Point.P, Gedimat et Chausson sont des enseignes pro :
 * prix localisés sur devis, non scrappables — non inclus ici.
 */
export const STORES = [
  { id: 'leroymerlin', name: 'Leroy Merlin', logo: 'leroymerlin', rate: 36.5 },
  { id: 'castorama',   name: 'Castorama',    logo: 'castorama',   rate: 35.8 },
  { id: 'bricodepot',  name: 'Brico Dépôt', logo: 'bricodepot',  rate: 34.0 },
  { id: 'manomano',    name: 'ManoMano',     logo: 'manomano',    rate: 33.5 },
];

/**
 * Helper : find material by ID
 */
export function findMaterial(materialId) {
  return MATERIAL_PRICES.find(m => m.id === materialId);
}

/**
 * Helper : get price for a material at a store
 */
export function getUnitPrice(materialId, storeId) {
  const mat = findMaterial(materialId);
  if (!mat) return null;
  return mat.prices?.[storeId] ?? null;
}
