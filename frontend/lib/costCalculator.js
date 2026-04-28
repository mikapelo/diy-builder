/**
 * costCalculator.js — Calcul détaillé des coûts par matériau
 *
 * Mappe les données BOM retournées par chaque engine (cabanon, terrasse, pergola, cloture)
 * vers les matériaux de materialPrices.js, puis calcule le coût total par enseigne.
 *
 * Retourne un tableau : [{ materialId, label, quantity, unit, unitPrice, subtotal }]
 *
 * ── Patch stabilisation P0/P1 (2026-04-07) ──────────────────────────────
 * P0 : corrige count×prix_ml → count×longueur×prix_ml pour matériaux vendus au ml.
 *      Corrige contreventement cabanon : surface approximée au lieu du nombre de diagonales.
 * P1 : ancrage clôture → matériau dédié (ancrage_poteau_cloture).
 *      Guards NaN/null sur unitPrice et quantity.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { MATERIAL_PRICES, getUnitPrice } from './materialPrices.js';
import { formatLength } from './formatters.js';

/* ── Constantes importées pour l'approximation contreventement ────────
 * On importe UNIQUEMENT des constantes de config (pas le moteur).
 * Surface approximée d'un panneau de contreventement :
 *   panelArea ≈ STUD_SPACING × hauteur_mur
 * Nombre de panneaux = contreventement / 2 (2 diagonales par mur,
 * mais chaque panneau couvre ~1 travée de coin).
 * ──────────────────────────────────────────────────────────────────── */
import { STUD_SPACING, DEFAULT_HEIGHT } from '@/lib/cabanonConstants.js';

/**
 * Majoration coupe/chute bois — 10% conservateur (DTU recommande 10-15%)
 * Appliquée à tous les matériaux bois (vendus en ml, m², ou pcs).
 * Représente les pertes de coupe, chutes, et erreurs en chantier.
 *
 * SEULE SOURCE DE WASTE — Les engines retournent des quantités brutes
 * (sans majoration). Ce facteur est la seule majoration appliquée.
 * Majoration totale = exactement 10%.
 */
const WOOD_WASTE_FACTOR = 1.10;

/**
 * Matériaux bois éligibles à la majoration déchet/coupe.
 * Exclus : quincaillerie, béton, film, treillis, bande bitume.
 */
const WOOD_MATERIAL_IDS = new Set([
  // Cabanon
  'montant_45x90', 'lisse_45x90', 'montant_90x90', 'lisse_90x90',
  'chevron_60x80', 'bastaing_63x150', 'entretoise_toiture',
  'bardage_pin', 'volige_18mm',
  // contreventement_osb exlu : panneaux OSB achetés en format fixe 122×244,
  // l'arrondi au panneau entier (osbPanels = Math.ceil) couvre déjà les chutes.
  // Appliquer WOOD_WASTE_FACTOR serait un double-compte.
  // Terrasse
  'lame_terrasse', 'lambourde_60x70',
  // Pergola
  'poteau_pergola_100', 'poutre_pergola_150', 'traverse_pergola_80',
  // Clôture
  'poteau_cloture_90', 'lisse_cloture_45x90', 'lame_cloture',
  // Garde-corps
  'poteau_gc_70', 'lisse_gc_60x40', 'balustre_gc_40',
  // Bardage
  'lame_bardage_140', 'tasseau_bardage_27',
]);

/**
 * safeLine — Crée une ligne BOM avec guards contre NaN/null.
 * La majoration déchet (WOOD_WASTE_FACTOR) est appliquée plus tard,
 * à la fin de calculateDetailedCost, lors du calcul des subtotals.
 *
 * @param {object} fields — champs de la ligne ({ materialId, label, quantity, unit, unitPrice, category })
 * @returns {object|null} — la ligne complète, ou null si unitPrice est null/undefined
 */
function safeLine({ materialId, label, quantity, unit, unitPrice, category }) {
  // Guard P1 : si le matériau n'existe pas dans le catalogue, on skip la ligne
  if (unitPrice == null || !isFinite(unitPrice)) return null;
  // Guard P1 : quantité invalide → 0
  const safeQty = (typeof quantity === 'number' && isFinite(quantity)) ? quantity : 0;
  return { materialId, label, quantity: safeQty, unit, unitPrice, category };
}

/**
 * calculateDetailedCost(structure, storeId, projectType)
 *
 * @param {object} structure — données retournées par engine (cabanon, pergola, cloture)
 *                             ou { boards, joists, pads, screws, ... } pour terrasse
 * @param {string} storeId — 'leroymerlin', 'castorama', ou 'bricodepot'
 * @param {string} projectType — 'cabanon', 'terrasse', 'pergola', 'cloture'
 * @returns {array} [{ materialId, label, quantity, unit, unitPrice, subtotal }, ...]
 */
export function calculateDetailedCost(structure, storeId, projectType, priceList = null) {
  if (!structure) return [];

  /**
   * Résout le prix unitaire — utilise `priceList` (live) si fourni,
   * sinon retombe sur le catalogue statique via getUnitPrice.
   */
  const resolvePrice = priceList
    ? (materialId, sid) => {
        const mat = priceList.find(m => m.id === materialId);
        return mat?.prices?.[sid] ?? getUnitPrice(materialId, sid);
      }
    : getUnitPrice;

  const lines = [];

  /** Push avec guard — ignore silencieusement les lignes nulles */
  const push = (fields) => {
    const line = safeLine(fields);
    if (line) lines.push(line);
  };

  if (projectType === 'cabanon') {
    // ── Cabanon : studs, lisses, chevrons, bardage, voliges, contreventement, bastaings, vis, équerres, membrane

    if (structure.studCount > 0) {
      push({
        materialId: 'montant_90x90',
        label: 'Montant 9×9 cm',
        quantity: structure.studCount,
        unit: 'pcs',
        unitPrice: resolvePrice('montant_90x90', storeId),
        category: 'Ossature',
      });
    }

    if (structure.lissesBasses > 0) {
      push({
        materialId: 'lisse_90x90',
        label: 'Lisse basse',
        quantity: structure.lissesBasses,
        unit: 'm lin.',
        unitPrice: resolvePrice('lisse_90x90', storeId),
        category: 'Ossature',
      });
    }

    if (structure.lissesHautes > 0) {
      push({
        materialId: 'lisse_90x90',
        label: 'Sablière haute (1ère)',
        quantity: structure.lissesHautes,
        unit: 'm lin.',
        unitPrice: resolvePrice('lisse_90x90', storeId),
        category: 'Ossature',
      });
    }

    if (structure.lissesHautes2 > 0) {
      push({
        materialId: 'lisse_90x90',
        label: 'Double sablière (2e)',
        quantity: structure.lissesHautes2,
        unit: 'm lin.',
        unitPrice: resolvePrice('lisse_90x90', storeId),
        category: 'Ossature',
      });
    }

    // P0 FIX : chevrons — prix en ml, donc quantity = count × longueur unitaire
    if (structure.chevrons > 0) {
      const chevronLen = structure.chevronLength || 1;
      push({
        materialId: 'chevron_60x80',
        label: `Chevrons 60×80 (${structure.chevrons} × ${formatLength(chevronLen)} m)`,
        quantity: +(structure.chevrons * chevronLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('chevron_60x80', storeId),
        category: 'Toiture',
      });
    }

    // Entretoises de toiture (remplacent bastaings pour petits cabanons)
    if (structure.roofEntretoises > 0) {
      const entretoiseLen = structure.roofEntretoiseLength || 0.5;
      push({
        materialId: 'entretoise_toiture',
        label: `Entretoises toiture (${structure.roofEntretoises} × ${formatLength(entretoiseLen)} m)`,
        quantity: +(structure.roofEntretoises * entretoiseLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('entretoise_toiture', storeId),
        category: 'Toiture',
      });
    }

    // Voile de contreventement OSB 3 — DTU 31.2 §9.2.2
    // Utilise osbSurface (surface nette = wallArea − ouvertures) et osbPanels (nb panneaux 122×244)
    // calculés directement par l'engine depuis la géométrie réelle.
    if (structure.osbSurface > 0) {
      push({
        materialId: 'contreventement_osb',
        label: `Voile OSB 9 mm DTU 31.2 (${structure.osbPanels} pann. 122×244)`,
        quantity: structure.osbSurface,
        unit: 'm²',
        unitPrice: resolvePrice('contreventement_osb', storeId),
        category: 'Ossature',
      });
    }

    if (structure.bardage > 0) {
      push({
        materialId: 'bardage_pin',
        label: 'Bardage bois',
        quantity: structure.bardage,
        unit: 'm²',
        unitPrice: resolvePrice('bardage_pin', storeId),
        category: 'Revêtement',
      });
    }

    /* Voliges supprimées — remplacées par entretoises de toiture pour petits cabanons.
     * La ligne de coût est conservée commentée ici pour référence si besoin. */

    if (structure.membrane > 0) {
      push({
        materialId: 'membrane_etanche',
        label: 'Membrane sous-toiture',
        quantity: structure.membrane,
        unit: 'm²',
        unitPrice: resolvePrice('membrane_etanche', storeId),
        category: 'Toiture',
      });
    }

    if (structure.visBardage > 0) {
      push({
        materialId: 'vis_bardage',
        label: 'Vis de bardage',
        quantity: Math.ceil(structure.visBardage / 500),
        unit: 'lot',
        unitPrice: resolvePrice('vis_bardage', storeId),
        category: 'Quincaillerie',
      });
    }

    if (structure.visEntretoises > 0) {
      push({
        materialId: 'vis_inox_a2',
        label: 'Vis entretoises toiture (lot 200)',
        quantity: Math.ceil(structure.visEntretoises / 200),
        unit: 'lot',
        unitPrice: resolvePrice('vis_inox_a2', storeId),
        category: 'Quincaillerie',
      });
    }

    if (structure.equerres > 0) {
      push({
        materialId: 'equerre_fixation',
        label: 'Équerres de fixation',
        quantity: structure.equerres,
        unit: 'pcs',
        unitPrice: resolvePrice('equerre_fixation', storeId),
        category: 'Quincaillerie',
      });
    }

    // P2 FIX : sabots chevrons — 1 par chevron (fixation sur sablière)
    if (structure.sabotsChevrons > 0) {
      push({
        materialId: 'sabot_chevron',
        label: 'Sabots de chevrons',
        quantity: structure.sabotsChevrons,
        unit: 'pcs',
        unitPrice: resolvePrice('sabot_chevron', storeId),
        category: 'Quincaillerie',
      });
    }

    // P2 FIX : sabots bastaings — 1 par bastaing (fixation sur sablière)
    if (structure.sabotsBastaings > 0) {
      push({
        materialId: 'sabot_bastaing',
        label: 'Sabots de bastaings',
        quantity: structure.sabotsBastaings,
        unit: 'pcs',
        unitPrice: resolvePrice('sabot_bastaing', storeId),
        category: 'Quincaillerie',
      });
    }
  } else if (projectType === 'terrasse') {
    // ── Terrasse : lames, lambourdes, plots, vis, bande
    // Note V1 : boards, screws, bande, entretoises sont calculés côté UI (DeckSimulator),
    // pas par deckEngine. Approximation conservée volontairement.

    if (structure.boards > 0) {
      push({
        materialId: 'lame_terrasse',
        label: 'Lames terrasse 145×28',
        quantity: structure.boards,
        unit: 'pcs',
        unitPrice: resolvePrice('lame_terrasse', storeId),
        category: 'Structure',
      });
    }

    if (structure.joists > 0) {
      push({
        materialId: 'lambourde_60x70',
        label: 'Lambourdes 60×70',
        quantity: structure.joists,
        unit: 'pcs',
        unitPrice: resolvePrice('lambourde_60x70', storeId),
        category: 'Structure',
      });
    }

    if (structure.pads > 0) {
      push({
        materialId: 'plot_beton',
        label: 'Plots béton réglables',
        quantity: structure.pads,
        unit: 'pcs',
        unitPrice: resolvePrice('plot_beton', storeId),
        category: 'Structure',
      });
    }

    if (structure.screws > 0) {
      push({
        materialId: 'vis_inox_a2',
        label: 'Vis inox A2',
        quantity: Math.ceil(structure.screws / 100),
        unit: 'lot',
        unitPrice: resolvePrice('vis_inox_a2', storeId),
        category: 'Fixation',
      });
    }

    if (structure.bande > 0) {
      push({
        materialId: 'bande_bitume',
        label: 'Bande bitume isolante',
        quantity: structure.bande,
        unit: 'm lin.',
        unitPrice: resolvePrice('bande_bitume', storeId),
        category: 'Fixation',
      });
    }

    if (structure.entretoises > 0) {
      push({
        materialId: 'lambourde_60x70',
        label: 'Entretoises 60×70',
        quantity: structure.entretoises,
        unit: 'pcs',
        unitPrice: resolvePrice('lambourde_60x70', storeId),
        category: 'Structure',
      });
    }
  } else if (projectType === 'pergola') {
    // ── Pergola : poteaux, longerons, traverses, chevrons, vis, ancrages

    // P0 FIX : poteaux — prix pcs mais longueur variable, on facture count × postLength en ml
    // Note : le matériau est déclaré en 'pcs' dans materialPrices, donc on garde pcs
    // mais on documente la longueur dans le label. Le prix catalogue (18€) correspond
    // à un poteau ~2.40m standard. Acceptable en V1.
    if (structure.posts > 0) {
      push({
        materialId: 'poteau_pergola_100',
        label: `Poteaux 100×100 (${formatLength(structure.postLength)} m)`,
        quantity: structure.posts,
        unit: 'pcs',
        unitPrice: resolvePrice('poteau_pergola_100', storeId),
        category: 'Structure',
      });
    }

    // P0 FIX : longerons — prix en ml, donc quantity = count × longueur unitaire
    if (structure.beamsLong > 0) {
      const beamLen = structure.beamLongLength || 1;
      push({
        materialId: 'poutre_pergola_150',
        label: `Longerons 150×50 (${structure.beamsLong} × ${formatLength(beamLen)} m)`,
        quantity: +(structure.beamsLong * beamLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('poutre_pergola_150', storeId),
        category: 'Structure',
      });
    }

    // P0 FIX : traverses — prix en ml, donc quantity = count × longueur unitaire
    if (structure.beamsShort > 0) {
      const shortLen = structure.beamShortLength || 1;
      push({
        materialId: 'poutre_pergola_150',
        label: `Traverses 150×50 (${structure.beamsShort} × ${formatLength(shortLen)} m)`,
        quantity: +(structure.beamsShort * shortLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('poutre_pergola_150', storeId),
        category: 'Structure',
      });
    }

    // P0 FIX : chevrons pergola — prix en ml, donc quantity = count × longueur unitaire
    if (structure.rafters > 0) {
      const raftLen = structure.rafterLength || 1;
      push({
        materialId: 'traverse_pergola_80',
        label: `Chevrons 80×50 (${structure.rafters} × ${formatLength(raftLen)} m)`,
        quantity: +(structure.rafters * raftLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('traverse_pergola_80', storeId),
        category: 'Structure',
      });
    }

    if (structure.visChevrons > 0) {
      push({
        materialId: 'vis_inox_a2',
        label: 'Vis assemblage chevrons D6×90',
        quantity: Math.ceil(structure.visChevrons / 100),
        unit: 'lot',
        unitPrice: resolvePrice('vis_inox_a2', storeId),
        category: 'Quincaillerie',
      });
    }

    if (structure.visPoteaux > 0) {
      push({
        materialId: 'vis_inox_a2',
        label: 'Vis/boulons assemblage poteaux',
        quantity: Math.ceil(structure.visPoteaux / 100),
        unit: 'lot',
        unitPrice: resolvePrice('vis_inox_a2', storeId),
        category: 'Quincaillerie',
      });
    }

    if (structure.ancragePoteaux > 0) {
      push({
        materialId: 'pied_poteau_pergola',
        label: 'Pieds de poteau (platine + vis)',
        quantity: structure.ancragePoteaux,
        unit: 'pcs',
        unitPrice: resolvePrice('pied_poteau_pergola', storeId),
        category: 'Quincaillerie',
      });
    }

    // Jambes de force (contreventement diagonal)
    if (structure.braces > 0) {
      const brLen = structure.braceLength || 1;
      push({
        materialId: 'traverse_pergola_80',
        label: `Jambes de force 70×70 (${structure.braces} × ${formatLength(brLen)} m)`,
        quantity: +(structure.braces * brLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('traverse_pergola_80', storeId),
        category: 'Structure',
      });
    }

    if (structure.visBraces > 0) {
      push({
        materialId: 'vis_inox_a2',
        label: 'Vis/boulons jambes de force',
        quantity: Math.ceil(structure.visBraces / 100),
        unit: 'lot',
        unitPrice: resolvePrice('vis_inox_a2', storeId),
        category: 'Quincaillerie',
      });
    }

    // P2 FIX F1.5 : boulons M10 assemblage traverses/longerons
    if (structure.boulonsTraverses > 0) {
      push({
        materialId: 'boulon_m10_traverse',
        label: 'Boulons M10 assemblage traverses',
        quantity: structure.boulonsTraverses,
        unit: 'pcs',
        unitPrice: resolvePrice('boulon_m10_traverse', storeId),
        category: 'Quincaillerie',
      });
    }
  } else if (projectType === 'cloture') {
    // ── Clôture : poteaux, rails, lames, vis, ancrages

    // Poteaux clôture — prix en pcs (longueur standard ~1.90m).
    // Le label documente la longueur réelle.
    if (structure.posts > 0) {
      // Poteaux UC4 obligatoires si contact sol — DTU 31.1 §5.10.4.2
      const isUC4 = structure.postTreatment === 'UC4';
      push({
        materialId: isUC4 ? 'poteau_cloture_uc4' : 'poteau_cloture_90',
        label: `Poteaux 90×90${isUC4 ? ' UC4' : ''} (${formatLength(structure.postLength)} m)`,
        quantity: structure.posts,
        unit: 'pcs',
        unitPrice: resolvePrice(isUC4 ? 'poteau_cloture_uc4' : 'poteau_cloture_90', storeId),
        category: 'Structure',
      });
    }

    // P0 FIX : rails — prix en ml, donc quantity = count × longueur unitaire
    if (structure.rails > 0) {
      const rLen = structure.railLength || 1;
      push({
        materialId: 'lisse_cloture_45x90',
        label: `Rails 70×25 (${structure.rails} × ${formatLength(rLen)} m)`,
        quantity: +(structure.rails * rLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('lisse_cloture_45x90', storeId),
        category: 'Structure',
      });
    }

    // P0 FIX : lames — prix en ml, donc quantity = count × longueur unitaire
    if (structure.boards > 0) {
      const bLen = structure.boardLength || 1;
      push({
        materialId: 'lame_cloture',
        label: `Lames 120×15 (${structure.boards} × ${formatLength(bLen)} m)`,
        quantity: +(structure.boards * bLen).toFixed(2),
        unit: 'm lin.',
        unitPrice: resolvePrice('lame_cloture', storeId),
        category: 'Structure',
      });
    }

    if (structure.visLames > 0) {
      push({
        materialId: 'vis_inox_a2',
        label: 'Vis fixation lames',
        quantity: Math.ceil(structure.visLames / 100),
        unit: 'lot',
        unitPrice: resolvePrice('vis_inox_a2', storeId),
        category: 'Quincaillerie',
      });
    }

    if (structure.visRails > 0) {
      push({
        materialId: 'vis_inox_a2',
        label: 'Vis fixation rails',
        quantity: Math.ceil(structure.visRails / 100),
        unit: 'lot',
        unitPrice: resolvePrice('vis_inox_a2', storeId),
        category: 'Quincaillerie',
      });
    }

    // P1 FIX : ancrages → matériau dédié (ancrage_poteau_cloture) au lieu de equerre_fixation
    if (structure.ancrages > 0) {
      push({
        materialId: 'ancrage_poteau_cloture',
        label: 'Ancrages poteaux (platine H)',
        quantity: structure.ancrages,
        unit: 'pcs',
        unitPrice: resolvePrice('ancrage_poteau_cloture', storeId),
        category: 'Quincaillerie',
      });
    }

    // Béton de scellement poteaux (sacs 25 kg) — 1 sac par poteau ancré au sol
    if (structure.concreteBags > 0) {
      push({
        materialId: 'beton_scellement_25kg',
        label: `Béton de scellement (${structure.concreteBags} sac${structure.concreteBags > 1 ? 's' : ''} 25 kg)`,
        quantity: structure.concreteBags,
        unit: 'sac',
        unitPrice: resolvePrice('beton_scellement_25kg', storeId),
        category: 'Maçonnerie',
      });
    }
  } else if (projectType === 'garde-corps') {
    // ── Garde-corps (DTU 36.3) : poteaux, lisses, balustres, visserie
    const { postCount, postLength, railLength, balustreCount, balustreLength } = structure;

    push({
      materialId: 'poteau_gc_70',
      label: `Poteaux garde-corps (${formatLength(postLength)} m)`,
      quantity: postCount * postLength,
      unit: 'ml',
      unitPrice: resolvePrice('poteau_gc_70', storeId),
      category: 'Structure',
    });

    push({
      materialId: 'lisse_gc_60x40',
      label: 'Lisses (2 × périmètre)',
      quantity: railLength,
      unit: 'ml',
      unitPrice: resolvePrice('lisse_gc_60x40', storeId),
      category: 'Structure',
    });

    push({
      materialId: 'balustre_gc_40',
      label: 'Balustres',
      quantity: balustreCount * balustreLength,
      unit: 'ml',
      unitPrice: resolvePrice('balustre_gc_40', storeId),
      category: 'Structure',
    });

    push({
      materialId: 'visserie_inox_a4_gc',
      label: 'Visserie inox A4',
      quantity: Math.ceil(balustreCount / 20),
      unit: 'boite',
      unitPrice: resolvePrice('visserie_inox_a4_gc', storeId),
      category: 'Fixation',
    });
  } else if (projectType === 'bardage') {
    // ── Bardage extérieur bois (DTU 41.2) : lames, tasseaux, visserie
    const { totalLameLength, totalTasseauLength, visCount } = structure;

    push({
      materialId: 'lame_bardage_140',
      label: 'Lames de bardage',
      quantity: totalLameLength,
      unit: 'ml',
      unitPrice: resolvePrice('lame_bardage_140', storeId),
      category: 'Revêtement',
    });

    push({
      materialId: 'tasseau_bardage_27',
      label: 'Tasseaux',
      quantity: totalTasseauLength,
      unit: 'ml',
      unitPrice: resolvePrice('tasseau_bardage_27', storeId),
      category: 'Structure',
    });

    push({
      materialId: 'vis_inox_a4_bardage',
      label: 'Visserie inox A4',
      quantity: Math.ceil(visCount / 200),
      unit: 'boite',
      unitPrice: resolvePrice('vis_inox_a4_bardage', storeId),
      category: 'Fixation',
    });
  } else if (projectType === 'dalle') {
    // ── Dalle béton (DTU 13.3) : béton, treillis, joints, forme drainante
    const { sacsBeton, needsToupie, volumeBeton, treillisSurface, jointsLinear, volumeForme } = structure;

    if (!needsToupie) {
      push({
        materialId: 'beton_c25_sac_35kg',
        label: 'Béton C25/30 (sacs)',
        quantity: sacsBeton,
        unit: 'sac',
        unitPrice: resolvePrice('beton_c25_sac_35kg', storeId),
        category: 'Béton',
      });
    }

    if (treillisSurface > 0) {
      push({
        materialId: 'treillis_st25',
        label: 'Treillis soudé ST25',
        quantity: Math.ceil(treillisSurface),
        unit: 'm2',
        unitPrice: resolvePrice('treillis_st25', storeId),
        category: 'Armature',
      });
    }

    push({
      materialId: 'joint_dilatation_10mm',
      label: 'Joints de fractionnement',
      quantity: Math.ceil(jointsLinear),
      unit: 'ml',
      unitPrice: resolvePrice('joint_dilatation_10mm', storeId),
      category: 'Accessoire',
    });

    push({
      materialId: 'gravier_0_31',
      label: 'Forme drainante 0/31.5',
      quantity: volumeForme,
      unit: 'm3',
      unitPrice: resolvePrice('gravier_0_31', storeId),
      category: 'Béton',
    });
  }

  // ── Fondations (commune à tous les types) ──
  if (structure.slab) {
    const slab = structure.slab;
    if (slab.betonVolume > 0) {
      push({
        materialId: 'beton_c20_25',
        label: 'Béton C20/25 (livré)',
        quantity: slab.betonVolume,
        unit: 'm³',
        unitPrice: resolvePrice('beton_c20_25', storeId),
        category: 'Fondations',
      });
    }

    if (slab.treillisPanels > 0) {
      push({
        materialId: 'treillis_st25c',
        label: 'Treillis soudé ST25C',
        quantity: slab.treillisPanels,
        unit: 'pcs',
        unitPrice: resolvePrice('treillis_st25c', storeId),
        category: 'Fondations',
      });
    }

    if (slab.polyaneArea > 0) {
      push({
        materialId: 'polyane_200',
        label: 'Film polyane 200 µ',
        quantity: slab.polyaneArea,
        unit: 'm²',
        unitPrice: resolvePrice('polyane_200', storeId),
        category: 'Fondations',
      });
    }

    if (slab.gravierVolume > 0) {
      push({
        materialId: 'gravier_0_31_5',
        label: 'Gravier 0/31.5 (couche de forme)',
        quantity: slab.gravierVolume,
        unit: 'm³',
        unitPrice: resolvePrice('gravier_0_31_5', storeId),
        category: 'Fondations',
      });
    }
  }

  // Compute subtotals — Apply waste factor to wood materials, then compute cost
  return lines.map(line => {
    const qty = WOOD_MATERIAL_IDS.has(line.materialId)
      ? +(line.quantity * WOOD_WASTE_FACTOR).toFixed(2)
      : line.quantity;
    return {
      ...line,
      quantity: qty,
      subtotal: +((line.unitPrice || 0) * qty).toFixed(2),
    };
  });
}

/**
 * calculateTotalCost(detailedLines) — Somme les subtotals
 */
export function calculateTotalCost(detailedLines) {
  return detailedLines.reduce((sum, line) => sum + (line.subtotal || 0), 0);
}

/**
 * groupByCategory(detailedLines) — Regroupe par catégorie
 */
export function groupByCategory(detailedLines) {
  const grouped = {};
  detailedLines.forEach(line => {
    const cat = line.category || 'Autres';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(line);
  });
  return grouped;
}
