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
import { PAGE, fmtLen } from '@/lib/pdf/pdfHelpers.js';
import { buildClotureElevation } from '@/lib/plan/buildClotureElevation.js';
import { renderPDFLayers } from '@/lib/plan/renderPDF.js';
import { MAT, PLAN_BG } from '@/lib/plan/palette.js';
import { drawBudgetPage } from './pdfBudgetSection.js';

const TOTAL_PAGES = 5;

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
    { label: `Poteaux 90x90 mm${isUC4 ? ' UC4' : ''} (${fmtLen(materials.postLength)})`, qty: `${materials.posts} pcs` },
    { label: `Rails 70x25 mm (${fmtLen(materials.railLength)})`,            qty: `${materials.rails} pcs` },
    { label: `Lames 120x15 mm (${fmtLen(materials.boardLength)})`,          qty: `${materials.boards} pcs` },
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
    `Comparatif 4 enseignes - ${width} ml x h${depth} m`);

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

  /* ═══════════════════════════════════════════════════════════
     PAGE 5 - Outils recommandés
  ═══════════════════════════════════════════════════════════ */
  doc.addPage();

  const yTools = pageTitle(doc, 'Outils recommandes pour votre projet',
    'Liens Amazon — achat direct avec livraison rapide');

  const tools = [
    { label: 'Tariere electrique', search: 'tariere electrique poteau cloture' },
    { label: 'Niveau a bulle', search: 'niveau bulle chantier' },
    { label: 'Fil a plomb', search: 'fil a plomb chantier' },
    { label: 'Massette', search: 'massette maillet chantier' },
    { label: 'Pince coupante', search: 'pince coupante grillage' },
    { label: 'Visseuse', search: 'visseuse bois cloture' },
    { label: 'Vis inox', search: 'vis inox cloture bois' },
    { label: 'Saturateur bois', search: 'saturateur bois cloture exterieur' },
  ];

  const colW = 88;
  const rowH = 22;
  const startX = 15;
  let ty = yTools + 8;

  tools.forEach((tool, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (colW + 9);
    const y = ty + row * rowH;
    const url = `https://www.amazon.fr/s?k=${encodeURIComponent(tool.search)}&tag=diybuilder01-21`;

    doc.setFillColor(252, 250, 245);
    doc.setDrawColor(229, 226, 216);
    doc.roundedRect(x, y, colW, rowH - 3, 3, 3, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(255, 153, 0);
    doc.text('amazon', x + 3, y + 5);

    doc.setFontSize(9);
    doc.setTextColor(26, 28, 27);
    doc.setFont('helvetica', 'bold');
    doc.text(tool.label, x + 3, y + 11);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(201, 151, 30);
    doc.textWithLink('Voir sur Amazon →', x + 3, y + 16, { url });
    doc.setTextColor(26, 28, 27);
  });

  doc.setFontSize(7);
  doc.setTextColor(156, 145, 136);
  doc.text(
    'Liens affilies Amazon — DIY Builder percoit une commission sans surcout pour vous.',
    105, 270, { align: 'center' },
  );

  cartouche(doc, { pageNum: TOTAL_PAGES, totalPages: TOTAL_PAGES, viewTitle: 'Outils recommandes', projectTitle: cloTitle });
}
