/**
 * pergolaPDF.js - Generation PDF pour le module Pergola V2
 *
 * Layout :
 *   Page 1 : titre, dimensions, BOM principal (structure + braces + quincaillerie), note durabilite
 *   Page 2 : Estimation budgetaire (comparatif enseignes + BOM detaillee)
 *   Page 3 : Vue de dessus (primitives)
 *   Page 4 : Vue d'elevation / facade (primitives)
 *
 * Sources documentaires citees dans le PDF :
 *   - Guide COBEI (FCBA/CODIFAB, 2022) pour les bonnes pratiques durabilite
 *   - Pas de norme DTU specifique aux pergolas
 *
 * Ne contient aucun calcul de prix - recoit budgetByStore pre-calcule.
 */
import { cartouche, drawNoteTechnique, pageTitle, sectionTitle, drawGrid, drawLegendBox, drawScaleBar, drawBudgetUnavailable, drawCoverHeader, draw3DBlock } from '@/lib/pdf/pdfDrawing.js';
import { PAGE } from '@/lib/pdf/pdfHelpers.js';
import { buildPergolaTopView } from '@/lib/plan/buildPergolaTopView.js';
import { buildPergolaFacadeView } from '@/lib/plan/buildPergolaFacadeView.js';
import { renderPDFLayers } from '@/lib/plan/renderPDF.js';
import { MAT, PLAN_BG } from '@/lib/plan/palette.js';
import { drawBudgetPage } from './pdfBudgetSection.js';

const TOTAL_PAGES = 5;

/**
 * @param {jsPDF} doc       Instance jsPDF deja creee
 * @param {object} params   { dims, materials, projectConfig, budgetByStore, bestPrice, snapshot }
 */
export function generatePergolaPDF(doc, { dims, materials, projectConfig, budgetByStore, snapshot }) {
  const { width, depth } = dims;
  const surface = +(width * depth).toFixed(2);
  const geometry = materials.geometry;
  const perTitle = `${projectConfig?.pdfTitle ?? 'Pergola bois'} ${width}x${depth} m`;

  const MX = PAGE.MARGIN_X;
  const RX = PAGE.WIDTH - MX;

  /* ═══════════════════════════════════════════════════════════
     PAGE 1 - En-tête + Vue 3D
  ═══════════════════════════════════════════════════════════ */

  let y = drawCoverHeader(doc, {
    title: projectConfig?.pdfTitle || 'Projet Pergola Bois',
    subtitle: `${width} m x ${depth} m  ·  Surface couverte : ${surface} m²`,
    detail: `Hauteur poteaux : ${materials.postLength} m (dont pied deporte)`,
    badges: [
      { label: 'Largeur', value: `${width} m` },
      { label: 'Profondeur', value: `${depth} m` },
      { label: 'Surface', value: `${surface} m²` },
      { label: 'Hauteur', value: `${materials.postLength} m` },
    ],
  });

  y = sectionTitle(doc, 'Vue de synthese 3D', y);
  draw3DBlock(doc, y, snapshot,
    `${width} m x ${depth} m  ·  ${surface} m²  ·  Hauteur poteaux ${materials.postLength} m`,
  );

  cartouche(doc, {
    pageNum: 1, totalPages: TOTAL_PAGES,
    viewTitle: 'Vue de synthese',
    projectTitle: perTitle,
  });

  /* ═══════════════════════════════════════════════════════════
     PAGE 2 - BOM (nomenclature materiaux)
  ═══════════════════════════════════════════════════════════ */
  doc.addPage();

  y = pageTitle(doc, 'Nomenclature materiaux',
    `${width} m x ${depth} m - Surface ${surface} m²`);

  /* ── Materiaux - Structure ── */
  y = sectionTitle(doc, 'Structure bois', y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 50, 60);

  // Sections dynamiques depuis geometry (varient selon portée)
  const beamWmm = geometry ? Math.round(geometry.dimensions.beamW * 1000) : 50;
  const beamHmm = geometry ? Math.round(geometry.dimensions.beamH * 1000) : 150;

  const struct = [
    { label: `Poteaux 100x100 mm (${materials.postLength} m)`,                       qty: `${materials.posts} pcs` },
    { label: `Longerons ${beamHmm}x${beamWmm} mm (${materials.beamLongLength} m)`,   qty: `${materials.beamsLong} pcs` },
    { label: `Traverses ${beamHmm}x${beamWmm} mm (${materials.beamShortLength} m)`,  qty: `${materials.beamsShort} pcs` },
    { label: `Chevrons 80x50 mm (${materials.rafterLength} m)`,                       qty: `${materials.rafters} pcs` },
    { label: `Jambes de force 70x70 mm (${materials.braceLength} m)`,                 qty: `${materials.braces ?? 0} pcs` },
  ];

  const rowH = 9;
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
    { label: 'Vis assemblage chevrons D6x90',  qty: `${materials.visChevrons} pcs` },
    { label: 'Vis/boulons assemblage poteaux', qty: `${materials.visPoteaux} pcs` },
    { label: 'Vis/boulons jambes de force',    qty: `${materials.visBraces ?? 0} pcs` },
    { label: 'Boulons M10 traverses',         qty: `${materials.boulonsTraverses ?? 0} pcs` },
    { label: 'Pieds de poteau (platine)',      qty: `${materials.ancragePoteaux} pcs` },
  ];

  quincaillerie.forEach((m, i) => {
    const ry = y + i * rowH;
    doc.text(m.label, MX + 4, ry);
    doc.setFont('helvetica', 'bold');
    doc.text(m.qty, RX - 2, ry, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  });
  y += quincaillerie.length * rowH + 8;

  /* ── Note durabilite ── */
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  doc.text('Note durabilite (source : Guide COBEI, FCBA/CODIFAB 2022) :', MX, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('- Elements horizontaux : proteger en face superieure.', MX + 4, y + 8);
  doc.text('- Classe d\'emploi : 3.2 min. Essence : meleze, douglas ou pin CL4.', MX + 4, y + 14);
  doc.text('- Pied de poteau / sol : >= 150 mm (platine surelevee).', MX + 4, y + 20);
  y += 28;

  /* ── Notes techniques ── */
  drawNoteTechnique(doc, y, [
    'Ref. guide COBEI (FCBA/CODIFAB). Classe d\'emploi : 3.2 min.',
    'Seuils reglementaires : < 5 m² aucune demarche, 5-20 m² declaration prealable, > 20 m² permis de construire.',
  ], { title: 'Notes techniques' });

  cartouche(doc, {
    pageNum: 2, totalPages: TOTAL_PAGES,
    viewTitle: 'Nomenclature materiaux',
    projectTitle: perTitle,
  });

  /* ═══════════════════════════════════════════════════════════
     PAGE 3 - Estimation budgetaire
  ═══════════════════════════════════════════════════════════ */
  doc.addPage();

  const y0p3budget = pageTitle(doc, 'Estimation budgetaire',
    `Comparatif 3 enseignes - ${width} m x ${depth} m`);

  if (budgetByStore && budgetByStore.length > 0) {
    drawBudgetPage(doc, budgetByStore, { area: surface, startY: y0p3budget + 5 });
  } else {
    drawBudgetUnavailable(doc, y0p3budget + 5);
  }

  cartouche(doc, {
    pageNum: 3, totalPages: TOTAL_PAGES,
    viewTitle: 'Estimation budgetaire',
    projectTitle: perTitle,
  });

  /* ═══════════════════════════════════════════════════════════
     PAGE 4 - Vue de dessus (primitives)
  ═══════════════════════════════════════════════════════════ */
  if (geometry) {
    doc.addPage();

    const y0p3 = pageTitle(doc, 'Plan technique - Vue de dessus',
      `${width} m x ${depth} m - Surface ${surface} m²`);

    const margin = 25, drawW = 160, drawH = 155;
    const topY = y0p3 + 10;
    const boxX = margin - 5, boxY = topY - 3, boxW = drawW + 10, boxH = drawH + 10;

    doc.setFillColor(...PLAN_BG);
    doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
    drawGrid(doc, boxX, boxY, boxW, boxH);

    const { layers: topLayers } = buildPergolaTopView(geometry,
      { ox: margin, oy: topY, drawW, drawH });
    renderPDFLayers(doc, topLayers);

    /* Legende */
    drawLegendBox(doc, boxX + boxW - 46, boxY + boxH - 50, [
      { label: 'Poteaux',       color: MAT.ossature.stroke,  fill: MAT.ossature.fill },
      { label: 'Longerons',     color: MAT.sabliere.stroke,  fill: MAT.sabliere.fill },
      { label: 'Traverses',     color: MAT.sabliere.stroke,  fill: MAT.sabliere.fill },
      { label: 'Chevrons',      color: MAT.chevron.stroke },
      { label: 'J. de force',   color: MAT.ossature.stroke },
    ]);

    /* Barre d'échelle — 1 m réel */
    const sbLenP3 = drawW / Math.max(width, depth);
    drawScaleBar(doc, boxX + 4, boxY + boxH - 8, 1, sbLenP3);

    cartouche(doc, {
      pageNum: 4, totalPages: TOTAL_PAGES,
      viewTitle: 'Vue de dessus',
      projectTitle: perTitle,
    });

    /* ═══════════════════════════════════════════════════════════
       PAGE 5 - Elevation / facade (primitives)
    ═══════════════════════════════════════════════════════════ */
    doc.addPage();

    const y0p4 = pageTitle(doc, 'Plan technique - Elevation',
      `Largeur ${width} m - Hauteur poteaux ${geometry.dimensions.height} m`);

    const topY4 = y0p4 + 8;
    const drawH4 = 160;
    const oy4 = topY4 + drawH4 - 5;
    const boxX4 = margin - 5, boxY4 = topY4 - 3, boxW4 = drawW + 10, boxH4 = drawH4 + 10;

    doc.setFillColor(...PLAN_BG);
    doc.roundedRect(boxX4, boxY4, boxW4, boxH4, 2, 2, 'F');
    drawGrid(doc, boxX4, boxY4, boxW4, boxH4);

    const { layers: facadeLayers } = buildPergolaFacadeView(geometry,
      { ox: margin, oy: oy4, drawW, drawH: drawH4 });
    renderPDFLayers(doc, facadeLayers);

    /* Legende */
    drawLegendBox(doc, boxX4 + boxW4 - 46, boxY4 + boxH4 - 48, [
      { label: 'Poteaux',       color: MAT.ossature.stroke,  fill: MAT.ossature.fill },
      { label: 'Longerons',     color: MAT.sabliere.stroke,  fill: MAT.sabliere.fill },
      { label: 'Traverses',     color: MAT.sabliere.stroke,  fill: MAT.sabliere.fill },
      { label: 'Chevrons',      color: MAT.chevron.stroke,   fill: MAT.chevron.fill },
      { label: 'J. de force',   color: MAT.ossature.stroke },
    ]);

    /* Barre d'échelle — 1 m réel */
    const sbLenP4 = drawW / width;
    drawScaleBar(doc, boxX4 + 4, boxY4 + boxH4 - 8, 1, sbLenP4);

    cartouche(doc, {
      pageNum: 5, totalPages: TOTAL_PAGES,
      viewTitle: 'Elevation',
      projectTitle: perTitle,
    });
  }
}
