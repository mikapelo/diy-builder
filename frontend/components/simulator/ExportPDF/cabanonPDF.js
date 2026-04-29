/**
 * cabanonPDF.js — Generation PDF pour le module Cabanon
 *
 * Layout (harmonise avec terrasse / pergola / cloture : plans EN DERNIER) :
 *   Page 1 : Vue de synthese 3D (capture + annotations)
 *   Page 2 : Nomenclature materiaux (BOM) enrichie avec prix
 *   Page 3 : Estimation budgetaire (comparatif enseignes)
 *   Page 4 : Vue de dessus (primitives)
 *   Page 5 : Vue de facade / elevation (primitives)
 *   Page 6 : Coupe transversale (primitives)
 *
 * Migre depuis pdfDrawing.js (P4 cabanon).
 * Ne contient aucune logique metier — uniquement du layout jsPDF.
 * Ne contient aucun calcul de prix — recoit budgetByStore pre-calcule.
 */
import {
  cartouche, drawNoteTechnique, pageTitle, sectionTitle,
  drawGrid, drawLegendBox, drawScaleBar, drawCutLine, drawBudgetUnavailable,
  drawCoverHeader, draw3DBlock,
} from '@/lib/pdf/pdfDrawing.js';
import { PAGE, fmtPrice, fmtLen } from '@/lib/pdf/pdfHelpers.js';
import { buildFacadeView }   from '@/lib/plan/buildFacadeView.js';
import { buildSectionView }  from '@/lib/plan/buildSectionView.js';
import { buildTopView }      from '@/lib/plan/buildTopView.js';
import { renderPDFLayers }   from '@/lib/plan/renderPDF.js';
import { MAT, PLAN_BG }      from '@/lib/plan/palette.js';
import { drawStoreCards, drawBOMTable, drawBudgetTotal, drawBudgetPage } from './pdfBudgetSection.js';

const TOTAL = 6;

/* ════════════════════════════════════════════════════════════
   PAGE 1 — Vue de synthese (capture 3D reelle + annotations)
════════════════════════════════════════════════════════════ */
function drawCabanonSynthese(doc, geometry, snapshot) {
  const { width, depth, height, slope } = geometry.dimensions;
  const surface = (width * depth).toFixed(2);
  const pente = (slope / width * 100).toFixed(1);
  const angleDeg = (Math.atan2(slope, width) * 180 / Math.PI).toFixed(1);

  let y = drawCoverHeader(doc, {
    title: 'Cabanon ossature bois',
    subtitle: `${width} m x ${depth} m x ${height} m  ·  Surface ${surface} m²  ·  Pente ${pente}%`,
    detail: `Mono-pente (${angleDeg}°)  ·  Ossature 9×9 cm  ·  Bac acier`,
    badges: [
      { label: 'Largeur', value: `${width} m` },
      { label: 'Profondeur', value: `${depth} m` },
      { label: 'Hauteur', value: `${height} m` },
      { label: 'Surface', value: `${surface} m²` },
    ],
  });

  /* ── Section : Vue de synthèse 3D ── */
  y = sectionTitle(doc, 'Vue de synthese 3D', y);

  draw3DBlock(doc, y, snapshot,
    `Pente ${pente}% (${angleDeg}°)  ·  Mono-pente  ·  Ossature 9×9 cm  ·  Bac acier  ·  ${surface} m²`,
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE 2 — Vue de dessus (primitives)
════════════════════════════════════════════════════════════ */
function drawCabanonPlanDessus(doc, geometry) {
  const { width, depth } = geometry.dimensions;

  const y0 = pageTitle(doc, 'Plan technique - Vue de dessus',
    `${width} m x ${depth} m - Surface ${(width * depth).toFixed(2)} m²`);

  const margin = 25, drawW = 160, drawH = 155;
  const topY = y0 + 10;
  const boxX = margin - 5, boxY = topY - 3, boxW = drawW + 10, boxH = drawH + 10;

  doc.setFillColor(...PLAN_BG);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
  drawGrid(doc, boxX, boxY, boxW, boxH);

  const { layers } = buildTopView(geometry,
    { ox: margin, oy: topY, drawW, drawH });
  renderPDFLayers(doc, layers);

  /* ── Legende ── */
  drawLegendBox(doc, boxX + boxW - 46, boxY + boxH - 42, [
    { label: 'Murs',       color: MAT.contour.stroke,   fill: MAT.bardage.fill },
    { label: 'Montants',   color: MAT.ossature.stroke,  fill: MAT.ossature.fill },
    { label: 'Porte',      color: MAT.porte.stroke,     fill: MAT.porte.fill },
    { label: 'Fenetre',    color: MAT.fenetre.stroke,   fill: MAT.fenetre.fill },
    { label: 'Chevrons',   color: MAT.chevron.stroke },
  ]);

  /* Barre d'échelle — 1 m réel */
  const scaleBarLen = drawW / Math.max(width, depth);
  drawScaleBar(doc, boxX + 4, boxY + boxH - 8, 1, scaleBarLen);

  /* Trait de coupe A-A (renvoi vers la coupe transversale P4) */
  const cutX = margin + drawW * 0.5;
  drawCutLine(doc, cutX, boxY + 2, cutX, boxY + boxH - 2, 'A');
}

/* ════════════════════════════════════════════════════════════
   PAGE 3 — Vue de facade / elevation (primitives)
════════════════════════════════════════════════════════════ */
function drawCabanonPlanDetaille(doc, geometry) {
  const { width, depth, height, slope } = geometry.dimensions;

  const y0 = pageTitle(doc, 'Plan technique - Elevation avant',
    `${width} m x ${depth} m - Hauteur ${height} m - Pente ${(slope / width * 100).toFixed(0)}%`);

  const margin = 25, drawW = 160, drawH = 160;
  const topY = y0 + 8;
  const oy = topY + drawH - 5;

  const boxX = margin - 5, boxY = topY - 3, boxW = drawW + 10, boxH = drawH + 10;
  doc.setFillColor(...PLAN_BG);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
  drawGrid(doc, boxX, boxY, boxW, boxH);

  const { layers } = buildFacadeView(geometry, { ox: margin, oy, drawW, drawH });
  renderPDFLayers(doc, layers);

  /* ── Legende ── */
  drawLegendBox(doc, boxX + boxW - 46, boxY + boxH - 48, [
    { label: 'Murs',            color: MAT.contour.stroke,   fill: MAT.bardage.fill },
    { label: 'Montants',        color: MAT.ossature.stroke,  fill: MAT.ossature.fill },
    { label: 'Linteau / seuil', color: MAT.sabliere.stroke,  fill: MAT.sabliere.fill },
    { label: 'Porte',           color: MAT.porte.stroke,     fill: MAT.porte.fill },
    { label: 'Fenetre',         color: MAT.fenetre.stroke,   fill: MAT.fenetre.fill },
    { label: 'Toiture',         color: MAT.contour.stroke },
  ]);

  /* Barre d'échelle — 1 m réel */
  const scaleBarLen3 = drawW / width;
  drawScaleBar(doc, boxX + 4, boxY + boxH - 8, 1, scaleBarLen3);
}

/* ════════════════════════════════════════════════════════════
   PAGE 4 — Coupe transversale (primitives)
════════════════════════════════════════════════════════════ */
function drawCabanonCoupe(doc, geometry) {
  const { width, height, slope } = geometry.dimensions;

  const y0 = pageTitle(doc, 'Coupe transversale - Empilement structurel',
    `Hauteur basse ${height.toFixed(2)} m - Hauteur haute ${(height + slope).toFixed(2)} m - Pente ${(slope / width * 100).toFixed(0)}%`);

  const margin = 22, drawW = 125, drawH = 120;
  const topY = y0 + 8;
  const oy = topY + drawH;
  const boxX = margin - 5, boxY = topY - 3, boxW = 175, boxH = drawH + 10;

  doc.setFillColor(...PLAN_BG);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
  drawGrid(doc, boxX, boxY, boxW, boxH);

  const { layers } = buildSectionView(geometry,
    { ox: margin, oy, drawW, drawH });
  renderPDFLayers(doc, layers);

  /* ── Legende ── */
  drawLegendBox(doc, boxX + boxW - 46, boxY + 4, [
    { label: 'Sol',         color: MAT.sol.stroke,        fill: MAT.sol.fill },
    { label: 'Lisse basse', color: MAT.lisse.stroke,      fill: MAT.lisse.fill },
    { label: 'Montants',    color: MAT.ossature.stroke,   fill: MAT.ossature.fill },
    { label: 'Sabliere',    color: MAT.sabliere.stroke,   fill: MAT.sabliere.fill },
    { label: 'Chevrons',    color: MAT.chevron.stroke,    fill: MAT.chevron.fill },
    { label: 'OSB',         color: MAT.osb.stroke,        fill: MAT.osb.fill },
    { label: 'Couverture',  color: MAT.couverture.stroke, fill: MAT.couverture.fill },
    { label: 'Bardage',     color: MAT.bardage.stroke,    fill: MAT.bardage.fill },
  ]);

  /* Barre d'échelle — 1 m réel */
  const scaleBarLen4 = drawW / width;
  drawScaleBar(doc, boxX + 4, boxY + boxH - 8, 1, scaleBarLen4);
}

/* ════════════════════════════════════════════════════════════
   PAGE 5 — Nomenclature materiaux (BOM) enrichie avec prix
════════════════════════════════════════════════════════════ */
function drawCabanonBOM(doc, { dims, materials, projectConfig, foundationType, slab, budgetByStore }) {
  const { width, depth, area } = dims;
  const hasBudget = budgetByStore && budgetByStore.length > 0 && !budgetByStore[0].fallback;
  const bestEntry = hasBudget ? budgetByStore[0] : null;

  /* ── En-tête standardisé (warm black + gold, cohérent P2-P4) ── */
  let y = pageTitle(doc, 'Nomenclature materiaux',
    `${width} m x ${depth} m - Surface ${area} m² - Hauteur ${materials.height ?? 2.3} m`);

  /* ── Ligne info secondaire : fondation ── */
  const poseLabel = foundationType === 'slab'
    ? `Dalle beton - ${slab?.thicknessCm ?? 12} cm`
    : 'Plots reglables (sol naturel)';
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(102, 98, 90);
  doc.text(`Fondation : ${poseLabel}`, 20, y);
  y += 7;

  /* ── Helper : dessine un groupe de lignes materiaux avec prix ──
     Palette warm parchemin cohérente avec le branding (noir chaud + or).

     Layout colonnes (avec prix) — total 170mm, x ∈ [20, 190] :
       Designation : 23 → 87  (64mm)   left
       Quantite    : 87 → 118 (31mm)   left bold — chiffres moyens
       Detail      : 118 → 152 (34mm)  left light — texte tronqué si besoin
       P.U.        : ends 159          right
       Total       : ends 188          right
     Sans prix : on étire Designation + Detail. */
  function drawMatGroup(title, rows) {
    y = sectionTitle(doc, title, y);

    const X_DESIG  = 23;
    const X_QTY    = 87;
    const X_DETAIL = 118;
    const X_PU     = 159;
    const X_TOTAL  = 188;
    const MAX_DETAIL_W = hasBudget ? 33 : 65;  // mm — coupure soft si trop long

    /* En-tête colonnes */
    doc.setFillColor(243, 242, 238);
    doc.rect(20, y, 170, 6.5, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 18, 20);
    doc.text('Designation', X_DESIG, y + 4.5);
    doc.text('Quantite', X_QTY, y + 4.5);
    doc.text('Detail', X_DETAIL, y + 4.5);
    if (hasBudget) {
      doc.text('P.U.', X_PU, y + 4.5, { align: 'right' });
      doc.text('Total', X_TOTAL, y + 4.5, { align: 'right' });
    }
    y += 8;

    rows.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(249, 247, 242);
        doc.rect(20, y - 1, 170, 6.5, 'F');
      }
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 18, 20);
      /* Désignation : tronquée si dépasse zone allouée */
      const desigMaxW = X_QTY - X_DESIG - 1;
      const desigStr = doc.splitTextToSize(String(row[0] ?? ''), desigMaxW)[0] ?? row[0];
      doc.text(desigStr, X_DESIG, y + 3.5);
      doc.setFont('helvetica', 'bold');
      /* Quantite : tronquée si dépasse la cellule (évite débordement sur Detail) */
      const qtyMaxW = X_DETAIL - X_QTY - 1;
      const qtyStr = doc.splitTextToSize(String(row[1] ?? ''), qtyMaxW)[0] ?? row[1];
      doc.text(qtyStr, X_QTY, y + 3.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 98, 90);
      /* Detail : tronqué soft si dépasse la cellule (évite la superposition) */
      const detailStr = doc.splitTextToSize(String(row[2] ?? ''), MAX_DETAIL_W)[0] ?? row[2];
      doc.text(detailStr, X_DETAIL, y + 3.5);

      /* Prix unitaire + sous-total si disponibles */
      if (hasBudget && row[3] != null) {
        doc.setTextColor(102, 98, 90);
        doc.text(fmtPrice(row[3]), X_PU, y + 3.5, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(17, 18, 20);
        doc.text(fmtPrice(row[4] ?? 0), X_TOTAL, y + 3.5, { align: 'right' });
      }
      y += 6.5;
    });
    y += 4;
  }

  /* ── Helper pour trouver prix dans bestEntry ── */
  function findPrice(materialId) {
    if (!bestEntry) return { pu: null, sub: null };
    const line = bestEntry.lines.find(l => l.materialId === materialId);
    if (!line) return { pu: null, sub: null };
    return { pu: line.unitPrice, sub: line.subtotal };
  }

  const p = (id) => { const r = findPrice(id); return [r.pu, r.sub]; };

  drawMatGroup('Structure bois', [
    ['Montants 90x90 mm',       `${materials.studCount} pcs`,         'Entraxe 60 cm',              ...p('montant_90x90')],
    ['Lisse basse 90x90 mm',    `${materials.lissesBasses} ml`,       'Base des murs',              ...p('lisse_90x90')],
    ['Sabliere haute 90x90 mm', `${materials.lissesHautes} ml`,       'Haut des murs',              ...p('lisse_90x90')],
    ['Double sabliere 90x90 mm',`${materials.lissesHautes2} ml`,      'Au-dessus sabliere',         ...p('lisse_90x90')],
    ['Voile OSB 9 mm DTU 31.2',
      materials.osbSurface != null
        ? `${materials.osbSurface} m²`
        : `${materials.contreventement} diag.`,
      materials.osbSurface != null
        ? `${materials.osbPanels} pann. 122×244`
        : `${Math.ceil(materials.contreventement / 2)} pann.`,
      ...p('contreventement_osb')],
  ]);

  drawMatGroup('Toiture', [
    ['Chevrons 60x80 mm',      `${materials.chevrons} pcs`,          `Long. ${fmtLen(materials.chevronLength)}`,  ...p('chevron_60x80')],
    ['Entretoises toiture',    `${materials.roofEntretoises} pcs`,   `Long. moy. ${fmtLen(materials.roofEntretoiseLength)}`, ...p('entretoise_toiture')],
    ['Membrane sous-toiture',  `${materials.membrane} m²`,           'Pare-pluie',                  ...p('membrane_etanche')],
  ]);

  drawMatGroup('Bardage', [
    ['Bardage bois',           `${materials.bardage} m²`,            'Murs ext.',                   ...p('bardage_pin')],
  ]);

  drawMatGroup('Quincaillerie', [
    ['Vis bardage',            `${materials.visBardage} pcs (${Math.ceil(materials.visBardage / 500)} lots)`, '~25 vis/m2 — lot 500',  ...p('vis_bardage')],
    ['Vis entretoises',        `${materials.visEntretoises} pcs (${Math.ceil(materials.visEntretoises / 100)} lots)`, '4 vis/entretoise — lot 100', ...p('vis_inox_a2')],
    ['Equerres de fixation',   `${materials.equerres} pcs`,          '2/montant',                   ...p('equerre_fixation')],
    ['Sabots de chevrons',     `${materials.sabotsChevrons} pcs`,    '1/chevron',                   ...p('sabot_chevron')],
  ]);

  if (foundationType === 'slab' && slab) {
    y += 6;
    y = sectionTitle(doc, 'Fondation - Dalle beton', y);

    const slabRows = [
      ['Beton C20/25',      `${slab.betonVolume} m3`],
      ['Treillis ST25C',    `${slab.treillisPanels} panneaux`],
      ['Film polyane',      `${slab.polyaneArea} m²`],
      ['Gravier 0/31.5',   `${slab.gravierVolume} m3`],
      ['Coffrage',          `${slab.coffrageLinear} ml`],
    ];
    slabRows.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(249, 247, 242);
        doc.rect(20, y - 1, 170, 7, 'F');
      }
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 18, 20);
      doc.text(row[0], 23, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text(row[1], 110, y + 4);
      y += 7;
    });
  }

  /* Note technique */
  drawNoteTechnique(doc, y + 2, [
    'Entraxe montants 60 cm. Section ossature 90x90 mm. Mono-pente.',
    'Classe d\'emploi bois : 3.2 minimum (murs), 4 (lisse basse).',
    'Quantites bois majorees (+10% coupe/chute) dans le budget.',
  ], { title: 'Notes techniques' });
}

/* ════════════════════════════════════════════════════════════
   PAGE 6 — Comparatif budget par enseigne
════════════════════════════════════════════════════════════ */
function drawCabanonBudget(doc, { dims, budgetByStore, slab, foundationType }) {
  const isSlab = foundationType === 'slab';
  const slabTotal = isSlab ? (slab?.totalPrice ?? 0) : 0;

  const y0 = pageTitle(doc, 'Estimation budgetaire',
    `Comparatif 4 enseignes - ${dims.width} m x ${dims.depth} m`);

  if (!budgetByStore || budgetByStore.length === 0) {
    drawBudgetUnavailable(doc, y0 + 5);
    return;
  }

  let y = y0;

  /* Cartes comparatif */
  y = drawStoreCards(doc, y, budgetByStore, { area: dims.area });
  y += 4;

  /* BOM detaillee du meilleur prix */
  const bestEntry = budgetByStore[0];
  if (bestEntry.categories && Object.keys(bestEntry.categories).length > 0 && !bestEntry.fallback) {
    y = sectionTitle(doc, `Detail materiaux - ${bestEntry.store.name}`, y);
    y = drawBOMTable(doc, y, bestEntry.categories, { showPrices: true });
  }

  /* Total */
  y = drawBudgetTotal(doc, y, bestEntry, { slabTotal });
}

/* ════════════════════════════════════════════════════════════
   PDF CABANON — 6 pages : 3D -> BOM -> Budget -> dessus -> facade -> coupe
   Ordre harmonise avec terrasse / pergola / cloture : plans EN DERNIER.
════════════════════════════════════════════════════════════ */

/**
 * Genere le PDF cabanon complet (6 pages).
 *
 * @param {jsPDF}  doc       Instance jsPDF
 * @param {object} params    Donnees necessaires au layout
 */
export async function generateCabanonPDF(doc, { dims, materials, projectConfig, foundationType, slab, snapshot, budgetByStore, bestPrice }) {
  const { width, depth, area } = dims;

  const cabTitle = `${projectConfig?.pdfTitle ?? 'Cabanon bois'} ${width}x${depth} m`;

  /* ────────── PAGE 1 — Vue de synthese (capture 3D) ────────── */
  if (materials.geometry) {
    drawCabanonSynthese(doc, materials.geometry, snapshot);
    cartouche(doc, { pageNum: 1, totalPages: TOTAL, viewTitle: 'Vue de synthese 3D', projectTitle: cabTitle });
  }

  /* ────────── PAGE 2 — Materiaux (BOM enrichie) ────────── */
  doc.addPage();
  drawCabanonBOM(doc, { dims, materials, projectConfig, foundationType, slab, budgetByStore });
  cartouche(doc, { pageNum: 2, totalPages: TOTAL, viewTitle: 'Nomenclature materiaux', projectTitle: cabTitle });

  /* ────────── PAGE 3 — Budget comparatif ────────── */
  doc.addPage();
  drawCabanonBudget(doc, { dims, budgetByStore, slab, foundationType });
  cartouche(doc, { pageNum: 3, totalPages: TOTAL, viewTitle: 'Estimation budgetaire', projectTitle: cabTitle });

  if (materials.geometry) {
    /* ────────── PAGE 4 — Vue de dessus ────────── */
    doc.addPage();
    drawCabanonPlanDessus(doc, materials.geometry);
    cartouche(doc, { pageNum: 4, totalPages: TOTAL, viewTitle: 'Vue de dessus', projectTitle: cabTitle, scale: '~1:50' });

    /* ────────── PAGE 5 — Vue de facade (elevation) ────────── */
    doc.addPage();
    drawCabanonPlanDetaille(doc, materials.geometry);
    cartouche(doc, { pageNum: 5, totalPages: TOTAL, viewTitle: 'Elevation avant', projectTitle: cabTitle, scale: '~1:50' });

    /* ────────── PAGE 6 — Coupe transversale ────────── */
    doc.addPage();
    drawCabanonCoupe(doc, materials.geometry);
    cartouche(doc, { pageNum: 6, totalPages: TOTAL, viewTitle: 'Coupe transversale', projectTitle: cabTitle, scale: '~1:20' });
  }
}
