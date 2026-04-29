/**
 * terrassePDF.js - Generation du PDF terrasse (6 pages)
 *
 * Layout harmonise avec cabanon / pergola / cloture :
 *   Page 1 : Vue de synthese 3D (cover)
 *   Page 2 : Nomenclature materiaux (BOM + decoupes)
 *   Page 3 : Estimation budgetaire (comparatif enseignes)
 *   Page 4 : Fondation + notes techniques
 *   Page 5 : Plan technique vue de dessus
 *   Page 6 : Coupe transversale
 *
 * Ne contient aucune logique metier - uniquement du layout jsPDF.
 * Ne contient aucun calcul de prix - recoit budgetByStore pre-calcule.
 * Les donnees arrivent deja calculees depuis l'orchestrateur.
 */
import { BOARD_LEN, JOIST_LEN }    from '@/lib/deckConstants.js';
import { FOUNDATION_PRICES }        from '@/lib/foundation/foundationCalculator';
import { generateDeck }             from '@/lib/deckEngine.js';

import { boardRowSegs, joistColSegs, fmtLen, fmtPrice } from '@/lib/pdf/pdfHelpers.js';
import {
  cartouche, drawNoteTechnique, pageTitle, sectionTitle, drawTable,
  drawGrid, drawLegendBox, drawScaleBar, drawCutLine, drawBudgetUnavailable,
  drawCoverHeader, draw3DBlock,
} from '@/lib/pdf/pdfDrawing.js';

import { buildTerrasseTopView }     from '@/lib/plan/buildTerrasseTopView.js';
import { buildTerrasseSectionView } from '@/lib/plan/buildTerrasseSectionView.js';
import { renderPDFLayers }          from '@/lib/plan/renderPDF.js';
import { MAT, PLAN_BG }             from '@/lib/plan/palette.js';
import { drawStoreCards, drawBOMTable, drawBudgetTotal } from './pdfBudgetSection.js';

/**
 * Genere le PDF terrasse complet (4 pages).
 *
 * @param {jsPDF} doc  Instance jsPDF
 * @param {object} params  Donnees necessaires au layout
 * @param {object} params.dims  { width, depth, area }
 * @param {object} params.materials  { boards, joists, pads, screws, entretoises, bande, slab }
 * @param {string} params.foundationType  'pads' | 'slab'
 * @param {object} params.projectConfig  { pdfTitle, ... }
 * @param {Array}  params.budgetByStore  Tableau pre-calcule [{store,total,matTotal,lines,categories}]
 * @param {number} params.bestPrice      Meilleur prix total
 */
export function generateTerrassePDF(doc, { dims, materials, foundationType, projectConfig, budgetByStore, bestPrice, snapshot }) {
  const { width, depth, area } = dims;
  const { boards, joists, pads, screws, entretoises, bande, slab } = materials;
  const isSlab = foundationType === 'slab';
  const TOTAL = 6;
  const terTitle = `${projectConfig?.pdfTitle ?? 'Terrasse bois'} ${width}×${depth} m`;

  const poseLabel = isSlab
    ? `Pose sur dalle béton - ${slab?.thicknessCm ?? 12} cm`
    : 'Pose sur plots réglables (sol naturel)';

  /* ══════════════════════════════════════════════
     PAGE 1 - En-tête + Vue 3D
  ══════════════════════════════════════════════ */

  let y = drawCoverHeader(doc, {
    title: projectConfig?.pdfTitle ?? 'Projet Terrasse Bois',
    subtitle: `${width} m × ${depth} m  ·  Surface : ${area} m²  ·  Structure DTU 51.4`,
    detail: `Type de pose : ${poseLabel}`,
    badges: [
      { label: 'Largeur', value: `${width} m` },
      { label: 'Profondeur', value: `${depth} m` },
      { label: 'Surface', value: `${area} m²` },
      { label: 'Fondation', value: isSlab ? 'Dalle' : 'Plots' },
    ],
  });

  y = sectionTitle(doc, 'Vue de synthese 3D', y);
  draw3DBlock(doc, y, snapshot,
    `${width} m × ${depth} m  ·  ${area} m²  ·  ${poseLabel}`,
  );

  cartouche(doc, { pageNum: 1, totalPages: TOTAL, viewTitle: 'Vue de synthese', projectTitle: terTitle });

  /* ══════════════════════════════════════════════
     PAGE 2 - Nomenclature materiaux + Plan de decoupe
  ══════════════════════════════════════════════ */
  doc.addPage();

  y = pageTitle(doc, 'Nomenclature materiaux',
    `${width} m × ${depth} m - ${poseLabel}`);

  /* ── Section : Liste de matériaux ── */
  y = sectionTitle(doc, 'Liste de materiaux', y);

  const matRows = [
    ['Lames 145×28 mm',        `${boards} pcs`,   'Pin traité classe 4 - longueur 3 m'],
    ['Lambourdes 45×70 mm',    `${joists} pcs`,   'Longueur 3 m'],
    ['Plots réglables',        `${pads} plots`,   '200×200×60 mm - béton'],
    ['Vis inox A2',            `${screws} vis`,   'Ø 5×60 mm - 2 vis / appui'],
    ['Bande bitume',           `${bande} ml`,     'Interposition lambourde / plot'],
    ...(entretoises > 0
      ? [['Entretoises 45×70 mm', `${entretoises} pcs`, 'Entre lambourdes']]
      : []),
  ];

  y = drawTable(
    doc,
    ['Élément', 'Quantité', 'Détail / Section'],
    matRows,
    20, y,
    [65, 30, 75],
    8,
  ) + 8;

  /* ── Section : Plan de découpe ── */
  const hasBoardCuts = width > BOARD_LEN;
  const hasJoistCuts = depth > JOIST_LEN;

  if (hasBoardCuts || hasJoistCuts) {
    y = sectionTitle(doc, 'Plan de decoupe', y);

    const cutRows = [];
    if (hasBoardCuts) {
      const evenSegs = boardRowSegs(width, false);
      const oddSegs  = boardRowSegs(width, true);
      cutRows.push(['Lames - rangées paires',   evenSegs.map(fmtLen).join(' + '), `${evenSegs.length} tronçon(s)`]);
      cutRows.push(['Lames - rangées impaires', oddSegs.map(fmtLen).join(' + '),  `${oddSegs.length} tronçon(s)`]);
    }
    if (hasJoistCuts) {
      const evenJSegs = joistColSegs(depth, false);
      const oddJSegs  = joistColSegs(depth, true);
      cutRows.push(['Lambourdes - colonnes paires',   evenJSegs.map(fmtLen).join(' + '), `${evenJSegs.length} tronçon(s)`]);
      cutRows.push(['Lambourdes - colonnes impaires', oddJSegs.map(fmtLen).join(' + '),  `${oddJSegs.length} tronçon(s)`]);
    }

    y = drawTable(
      doc,
      ['Élément', 'Longueurs à débiter', 'Nb tronçons'],
      cutRows,
      20, y,
      [58, 80, 32],
      8,
    ) + 8;
  }

  cartouche(doc, { pageNum: 2, totalPages: TOTAL, viewTitle: 'Nomenclature materiaux', projectTitle: terTitle });

  /* ══════════════════════════════════════════════
     PAGE 3 - Estimation budgetaire (comparatif enseignes)
  ══════════════════════════════════════════════ */
  doc.addPage();

  y = pageTitle(doc, 'Estimation budgetaire',
    `Comparatif 4 enseignes - ${width} m × ${depth} m`);

  if (budgetByStore && budgetByStore.length > 0) {
    y = sectionTitle(doc, 'Comparatif budget par enseigne', y);
    y = drawStoreCards(doc, y, budgetByStore, { area });
    y += 4;

    /* Detail BOM du meilleur prix (cohérent avec cabanon / pergola / cloture) */
    const bestEntry = budgetByStore[0];
    if (bestEntry?.categories && Object.keys(bestEntry.categories).length > 0 && !bestEntry.fallback) {
      y = sectionTitle(doc, `Detail - ${bestEntry.store.name} (meilleur prix)`, y);
      y = drawBOMTable(doc, y, bestEntry.categories, { showPrices: true });
    }

    /* Detail des couts (terrasse + fondation si dalle) */
    const slabTotal = isSlab ? (slab?.totalPrice ?? 0) : 0;
    if (bestEntry) {
      y = drawBudgetTotal(doc, y, bestEntry, { slabTotal });
    }
  } else {
    drawBudgetUnavailable(doc, y + 5);
  }

  cartouche(doc, { pageNum: 3, totalPages: TOTAL, viewTitle: 'Estimation budgetaire', projectTitle: terTitle });

  /* ══════════════════════════════════════════════
     PAGE 4 - Fondation + Notes techniques
  ══════════════════════════════════════════════ */
  doc.addPage();
  y = pageTitle(
    doc,
    'Fondation - Dalle béton (DTU)',
    isSlab
      ? `Dalle béton ${slab?.thicknessCm ?? 12} cm · Volume à commander : ${slab?.betonVolume ?? 0} m³ · Coût fondation : ${fmtPrice(slab?.totalPrice ?? 0)}`
      : 'Pose directe sur plots réglables - aucune dalle béton requise',
  );

  y = sectionTitle(doc, 'Fondation', y);

  if (isSlab) {
    const thick = slab?.thicknessCm  ?? 12;
    const vol   = slab?.betonVolume  ?? 0;

    const INFO_H = 31;
    doc.setFillColor(243, 244, 247);
    doc.setDrawColor(165, 175, 195);
    doc.setLineWidth(0.4);
    doc.roundedRect(20, y, 170, INFO_H, 2, 2, 'FD');

    doc.setFillColor(110, 120, 140);
    doc.rect(20, y, 5, INFO_H, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 30, 55);
    doc.text('Fondation - Dalle béton', 28, y + 9);

    doc.setDrawColor(185, 195, 215);
    doc.setLineWidth(0.25);
    doc.line(28, y + 12, 186, y + 12);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 58, 82);
    doc.text(`Épaisseur : ${thick} cm`, 28, y + 20);
    doc.text(`Volume à commander : ${vol} m³ (marge 8 % incluse)`, 105, y + 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 62, 148);
    doc.text(`Total fondation : ${fmtPrice(slab?.totalPrice ?? 0)}`, 186, y + 28, { align: 'right' });

    y += INFO_H + 5;

    const foundRows = [
      ['Béton C20/25 - marge chantier', `${slab?.betonVolume    ?? '-'} m³`,      `${FOUNDATION_PRICES.BETON_M3} €/m³`,          fmtPrice(slab?.betonPrice)],
      ['Treillis soudé ST25C (2,4×1,2 m)', `${slab?.treillisPanels ?? '-'} pann.`, `${FOUNDATION_PRICES.TREILLIS_PANEL} €/pann.`, fmtPrice(slab?.treillisPrice)],
      ['Cales support treillis',        `${slab?.calesQty       ?? '-'} pcs`,     `${FOUNDATION_PRICES.CALES_UNIT} €/pce`,       fmtPrice(slab?.calesPrice)],
      ['Film polyane 200 µ',            `${slab?.polyaneArea    ?? '-'} m²`,      `${FOUNDATION_PRICES.POLYANE_M2} €/m²`,        fmtPrice(slab?.polyanePrice)],
      ['Gravier compacté 0/31.5',        `${slab?.gravierVolume  ?? '-'} m³`,      `${FOUNDATION_PRICES.GRAVIER_M3} €/m³`,        fmtPrice(slab?.gravierPrice)],
      ['Coffrage périphérique',         `${slab?.coffrageLinear ?? '-'} ml`,      `${FOUNDATION_PRICES.COFFRAGE_ML} €/ml`,       fmtPrice(slab?.coffragePrice)],
      ...(slab?.jointsActive
        ? [['Joints de fractionnement', `${slab?.jointsLinear ?? '-'} ml`,        `${FOUNDATION_PRICES.JOINTS_ML} €/ml`,         fmtPrice(slab?.jointsPrice)]]
        : []),
    ];
    y = drawTable(
      doc,
      ['Matériau', 'Quantité', 'Prix unitaire', 'Total'],
      foundRows,
      20, y,
      [62, 34, 36, 38],
      8.5,
      ['left', 'center', 'right', 'right'],
    ) + 5;

    if (slab?.jointsActive) {
      doc.setFillColor(255, 252, 232);
      doc.setDrawColor(195, 165, 55);
      doc.setLineWidth(0.3);
      doc.roundedRect(20, y, 170, 12, 1, 1, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(105, 78, 15);
      doc.text(
        'Joints de fractionnement nécessaires pour limiter les fissurations (surface > 15 m²)',
        25, y + 8,
      );
      y += 17;
    }

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(130, 140, 158);
    doc.text(
      'Les quantités incluent une marge chantier pour pertes et ajustements.',
      22, y,
    );
    y += 10;

  } else {
    doc.setFillColor(240, 248, 240);
    doc.setDrawColor(140, 190, 150);
    doc.setLineWidth(0.35);
    doc.roundedRect(20, y, 170, 13, 2, 2, 'FD');

    doc.setFillColor(60, 160, 90);
    doc.rect(20, y, 4, 13, 'F');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 80, 45);
    doc.text('Pose directe sur plots réglables - aucune dalle requise', 27, y + 9);

    y += 22;
  }

  /* ── Section : Notes techniques ── */
  y += 6;
  y = sectionTitle(doc, 'Notes techniques', y);

  doc.setFillColor(247, 250, 255);
  doc.setDrawColor(200, 218, 245);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, y, 170, 30, 2, 2, 'FD');

  const techNotes = [
    '• Pente de 1,5 % minimum dans le sens de l\'écoulement (DTU 51.4 §5.3)',
    '• Serrage des vis à fond puis desserrage d\'un quart de tour pour la dilatation',
    '• Laisser 3 mm de jeu entre les lames - utiliser des cales d\'espacement',
    '• Bande bitume obligatoire entre plot et lambourde pour isoler l\'humidité',
  ];

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 45, 75);
  techNotes.forEach((note, i) => {
    doc.text(note, 24, y + 7 + i * 6.5);
  });

  cartouche(doc, { pageNum: 4, totalPages: TOTAL, viewTitle: 'Fondation et notes', projectTitle: terTitle });

  /* ══════════════════════════════════════════════
     PAGE 5 - Plan technique vue de dessus (primitives)
  ══════════════════════════════════════════════ */
  doc.addPage();

  const y3 = pageTitle(doc, 'Plan de structure - Vue de dessus',
    `${width} m × ${depth} m · Surface ${area} m² · Implantation porteuse DTU 51.4`);

  const margin3 = 25, drawW3 = 160, drawH3 = 155;
  const topY3 = y3 + 10;
  const boxX3 = margin3 - 5, boxY3 = topY3 - 3, boxW3 = drawW3 + 10, boxH3 = drawH3 + 10;

  doc.setFillColor(...PLAN_BG);
  doc.roundedRect(boxX3, boxY3, boxW3, boxH3, 2, 2, 'F');
  drawGrid(doc, boxX3, boxY3, boxW3, boxH3);

  const deckData = generateDeck(width, depth);
  const { layers: topLayers } = buildTerrasseTopView(deckData, { width, depth },
    { ox: margin3, oy: topY3, drawW: drawW3, drawH: drawH3 });
  renderPDFLayers(doc, topLayers);

  drawLegendBox(doc, boxX3 + boxW3 - 50, boxY3 + boxH3 - 52, [
    { label: 'Plots',         color: MAT.beton.stroke,    fill: MAT.beton.fill },
    { label: 'Lambourdes',    color: MAT.chevron.stroke,  fill: MAT.chevron.fill },
    { label: 'Dbl. lambourdes', color: [60, 40, 15],      fill: [100, 75, 40] },
    { label: 'Entretoises',   color: MAT.lisse.stroke,    fill: MAT.lisse.fill },
    { label: 'Lames (fond)',  color: [210, 200, 185] },
  ]);

  /* Barre d'échelle — 1 m réel */
  const sbLen3 = drawW3 / Math.max(width, depth);
  drawScaleBar(doc, boxX3 + 4, boxY3 + boxH3 - 8, 1, sbLen3);

  /* Trait de coupe A-A (renvoi vers la coupe transversale P4) */
  const cutX3 = margin3 + drawW3 * 0.5;
  drawCutLine(doc, cutX3, boxY3 + 2, cutX3, boxY3 + boxH3 - 2, 'A');

  cartouche(doc, { pageNum: 5, totalPages: TOTAL, viewTitle: 'Vue de dessus', projectTitle: terTitle, scale: '~1:50' });

  /* ══════════════════════════════════════════════
     PAGE 6 - Coupe transversale (primitives)
  ══════════════════════════════════════════════ */
  doc.addPage();

  const y4 = pageTitle(doc, 'Plan de coupe transversale',
    'Assemblage DTU 51.4 - Vue en coupe perpendiculaire aux lames');

  const sectionOy = y4 + 10;
  const { layers: sectionLayers } = buildTerrasseSectionView(
    { width, joistCount: joists, foundationType, thicknessCm: slab?.thicknessCm ?? 12 },
    { ox: 82, oy: sectionOy, drawW: 160, drawH: 140 },
  );
  renderPDFLayers(doc, sectionLayers);

  /* Barre d'échelle — 10 cm réel (vue détail ~1:4) */
  drawScaleBar(doc, 25, 230, 0.1, 25);

  drawNoteTechnique(doc, 240, [
    'Conforme DTU 51.4 (dec. 2018). Jeu entre lames : 5 a 8 mm.',
    'Ventilation sous structure >= 50 mm. Pente d\'evacuation 1,5 %.',
  ], { title: 'Notes techniques' });

  cartouche(doc, { pageNum: 6, totalPages: TOTAL, viewTitle: 'Coupe transversale', projectTitle: terTitle, scale: '~1:4' });
}
