/**
 * cloturePDF.js - Generation PDF pour le module Cloture V2
 *
 * Layout :
 *   Page 1 : titre, dimensions, BOM structure, quincaillerie, notes
 *   Page 2 : Estimation budgetaire (comparatif enseignes + BOM detaillee)
 *   Page 3 : Elevation technique (primitives)
 *
 * Recoit du moteur :
 *   - dims: { width (longueur ml), depth (hauteur m), area (surface m²) }
 *   - materials: { structure + pieces bois + quincaillerie + geometry }
 *
 * Ne contient aucun calcul de prix - recoit budgetByStore pre-calcule.
 */
import { cartouche, drawNoteTechnique, pageTitle, sectionTitle, drawGrid, drawLegendBox, drawScaleBar, drawBudgetUnavailable, drawCoverHeader, draw3DBlock } from '@/lib/pdf/pdfDrawing.js';
import { PAGE } from '@/lib/pdf/pdfHelpers.js';
import { buildClotureElevation } from '@/lib/plan/buildClotureElevation.js';
import { renderPDFLayers } from '@/lib/plan/renderPDF.js';
import { MAT, PLAN_BG } from '@/lib/plan/palette.js';
import { drawBudgetPage } from './pdfBudgetSection.js';

const TOTAL_PAGES = 4;

/**
 * @param {jsPDF} doc       Instance jsPDF deja creee
 * @param {object} params   { dims, materials, projectConfig, budgetByStore, bestPrice, snapshot }
 */
export function generateCloturePDF(doc, { dims, materials, projectConfig, budgetByStore, snapshot }) {
  const { width, depth, area } = dims;
  const geometry = materials.geometry;
  const cloTitle = `${projectConfig?.pdfTitle ?? 'Cloture bois'} ${width} ml x h${depth} m`;

  const MX = PAGE.MARGIN_X;
  const RX = PAGE.WIDTH - MX;

  /* ═══════════════════════════════════════════════════════════
     PAGE 1 - En-tête + Vue 3D
  ═══════════════════════════════════════════════════════════ */

  let y = drawCoverHeader(doc, {
    title: projectConfig?.pdfTitle || 'Projet Cloture Bois',
    subtitle: `Longueur ${width} m  ·  Hauteur ${depth} m  ·  Surface ${area} m²`,
    badges: [
      { label: 'Longueur', value: `${width} m` },
      { label: 'Hauteur', value: `${depth} m` },
      { label: 'Surface', value: `${area} m²` },
    ],
  });

  y = sectionTitle(doc, 'Vue de synthese 3D', y);
  draw3DBlock(doc, y, snapshot,
    `Longueur ${width} m  ·  Hauteur ${depth} m  ·  ${area} m²`,
  );

  cartouche(doc, {
    pageNum: 1, totalPages: TOTAL_PAGES,
    viewTitle: 'Vue de synthese',
    projectTitle: cloTitle,
  });

  /* ═══════════════════════════════════════════════════════════
     PAGE 2 - BOM (nomenclature materiaux)
  ═══════════════════════════════════════════════════════════ */
  doc.addPage();

  y = pageTitle(doc, 'Nomenclature materiaux',
    `${width} ml x h${depth} m - Surface ${area} m²`);

  /* ── Materiaux - Structure bois ── */
  y = sectionTitle(doc, 'Structure bois', y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 50, 60);

  const rowH = 9;
  const isUC4 = materials.postTreatment === 'UC4';
  const footEmbedCm = Math.round((materials.footEmbed ?? 0.50) * 100);
  const struct = [
    { label: `Poteaux 90x90 mm${isUC4 ? ' UC4' : ''} (${materials.postLength} m)`, qty: `${materials.posts} pcs` },
    { label: `Rails 70x25 mm (${materials.railLength} m)`,            qty: `${materials.rails} pcs` },
    { label: `Lames 120x15 mm (${materials.boardLength} m)`,          qty: `${materials.boards} pcs` },
  ];

  struct.forEach((m, i) => {
    const ry = y + i * rowH;
    doc.text(m.label, MX + 4, ry);
    doc.setFont('helvetica', 'bold');
    doc.text(m.qty, RX - 2, ry, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  });
  y += struct.length * rowH + 4;

  /* ── Materiaux - Quincaillerie ── */
  y = sectionTitle(doc, 'Quincaillerie', y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 50, 60);

  const quincaillerie = [
    { label: 'Vis lames',          qty: `${materials.visLames} pcs` },
    { label: 'Vis rails',          qty: `${materials.visRails} pcs` },
    { label: 'Ancrages poteaux',   qty: `${materials.ancrages} pcs` },
  ];

  quincaillerie.forEach((m, i) => {
    const ry = y + i * rowH;
    doc.text(m.label, MX + 4, ry);
    doc.setFont('helvetica', 'bold');
    doc.text(m.qty, RX - 2, ry, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  });
  y += quincaillerie.length * rowH + 8;

  /* ── Notes techniques DTU 31.1 ── */
  drawNoteTechnique(doc, y, [
    `Scellement poteaux : ${footEmbedCm} cm min. (>= 1/3 hauteur hors-sol) — DTU 31.1 §5.10.4.2.`,
    `Poteaux en contact sol : bois traite UC4 autoclave obligatoire — DTU 31.1 §5.10.4.2.`,
    'Jeu entre lames : 10-15 mm (ventilation et reprise hygrometrique du bois).',
  ], { title: 'Notes techniques DTU 31.1' });

  cartouche(doc, {
    pageNum: 2, totalPages: TOTAL_PAGES,
    viewTitle: 'Nomenclature materiaux',
    projectTitle: cloTitle,
  });

  /* ═══════════════════════════════════════════════════════════
     PAGE 3 - Estimation budgetaire
  ═══════════════════════════════════════════════════════════ */
  doc.addPage();

  const y0p3 = pageTitle(doc, 'Estimation budgetaire',
    `Comparatif 3 enseignes - ${width} ml x h${depth} m`);

  if (budgetByStore && budgetByStore.length > 0) {
    drawBudgetPage(doc, budgetByStore, { area, startY: y0p3 + 5 });
  } else {
    drawBudgetUnavailable(doc, y0p3 + 5);
  }

  cartouche(doc, {
    pageNum: 3, totalPages: TOTAL_PAGES,
    viewTitle: 'Estimation budgetaire',
    projectTitle: cloTitle,
  });

  /* ═══════════════════════════════════════════════════════════
     PAGE 4 - Elevation technique (primitives)
  ═══════════════════════════════════════════════════════════ */
  if (geometry) {
    doc.addPage();

    const y0p3 = pageTitle(doc, 'Plan technique - Elevation',
      `Longueur ${width} m - Hauteur ${depth} m - Entraxe poteaux ${geometry.dimensions.postSpacing} m`);

    const margin = 25, drawW = 160, drawH = 155;
    const topY = y0p3 + 8;
    const oy = topY + drawH - 5;
    const boxX = margin - 5, boxY = topY - 3, boxW = drawW + 10, boxH = drawH + 10;

    doc.setFillColor(...PLAN_BG);
    doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
    drawGrid(doc, boxX, boxY, boxW, boxH);

    const { layers } = buildClotureElevation(geometry,
      { ox: margin, oy, drawW, drawH });
    renderPDFLayers(doc, layers);

    /* Legende */
    drawLegendBox(doc, boxX + boxW - 46, boxY + boxH - 36, [
      { label: 'Poteaux',  color: MAT.ossature.stroke, fill: MAT.ossature.fill },
      { label: 'Rails',    color: MAT.lisse.stroke,    fill: MAT.lisse.fill },
      { label: 'Lames',    color: MAT.bardage.stroke,  fill: MAT.bardage.fill },
    ]);

    /* Barre d'échelle — 1 m réel */
    const sbLen = drawW / width;
    drawScaleBar(doc, boxX + 4, boxY + boxH - 8, 1, sbLen);

    cartouche(doc, {
      pageNum: 4, totalPages: TOTAL_PAGES,
      viewTitle: 'Elevation',
      projectTitle: cloTitle,
    });
  }
}
