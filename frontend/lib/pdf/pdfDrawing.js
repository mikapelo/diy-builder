/**
 * pdfDrawing.js — Fonctions de dessin jsPDF partagées pour les devis DIY Builder
 *
 * Contient :
 *   - Primitives de mise en page : footer, cartouche, pageTitle, sectionTitle, drawTable
 *   - drawNoteTechnique : bloc notes techniques
 *   - drawGrid, drawLegendBox : helpers graphiques
 *
 * Les orchestrateurs PDF par module sont dans ExportPDF/ :
 *   - terrassePDF.js, pergolaPDF.js, cloturePDF.js, cabanonPDF.js
 *
 * NE PAS modifier les fonctions de calcul — seul le dessin est ici.
 */
import { LW, PAGE, FONTS } from './pdfHelpers.js';
import { PDF } from '@/lib/plan/palette.js';

/* ── Pied de page standard ──
   Affiché uniquement sur la première et la dernière page */
export function footer(doc, pageNum, total) {
  if (pageNum !== 1 && pageNum !== total) return;
  doc.setDrawColor(218, 218, 218);
  doc.setLineWidth(0.15);
  doc.line(20, 284, 190, 284);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(195, 195, 195);
  doc.text('Document technique généré automatiquement — DIY Builder', 105, 289, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`${pageNum} / ${total}`, 190, 289, { align: 'right' });
}

/* ── Cartouche enrichi (toutes pages, tous modules) ──
   Bande horizontale h=14mm en bas de chaque page A4.
   Remplace footer() pour les nouvelles pages. */
export function cartouche(doc, {
  pageNum,
  totalPages,
  viewTitle = '',
  projectTitle = '',
  scale = null,
  date = new Date(),
}) {
  const Y0 = PAGE.CARTOUCHE_Y;
  const H  = PAGE.CARTOUCHE_H;

  /* Fond — noir chaud cohérent V6 */
  doc.setFillColor(17, 18, 20);
  doc.rect(0, Y0, PAGE.WIDTH, H, 'F');

  /* Trait or au-dessus */
  doc.setFillColor(201, 151, 30);
  doc.rect(0, Y0, PAGE.WIDTH, 0.8, 'F');

  /* ── Ligne 1 ── */
  doc.setFontSize(FONTS.SMALL);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(201, 151, 30);
  doc.text('DIY BUILDER', 8, Y0 + 4.5);

  doc.setFontSize(FONTS.BODY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(243, 242, 238);
  doc.text(viewTitle, 105, Y0 + 4.5, { align: 'center' });

  doc.setFontSize(FONTS.SMALL);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(145, 139, 130);
  doc.text(`Page ${pageNum} / ${totalPages}`, 202, Y0 + 4.5, { align: 'right' });

  /* ── Ligne 2 ── */
  doc.setFontSize(FONTS.TINY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(145, 139, 130);
  if (projectTitle) {
    doc.text(projectTitle, 8, Y0 + 9);
  }

  /* Échelle au centre */
  if (scale) {
    doc.text(`Échelle ${scale}`, 105, Y0 + 9, { align: 'center' });
  }

  /* Date à droite */
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  doc.text(dateStr, 202, Y0 + 9, { align: 'right' });

  /* ── Ligne 3 — mention non contractuel ── */
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(102, 98, 90);
  doc.text('Document de pré-dimensionnement — non contractuel', 105, Y0 + 12.8, { align: 'center' });
}

/* ── Bloc notes techniques (dernière page de chaque module) ──
   Encadré gris clair avec texte 7pt italic.

   DOCTRINE LAYOUT :
   La note technique est un élément optionnel de confort. Elle est affichée
   uniquement si l'espace disponible au-dessus du cartouche (Y0=276) est
   suffisant pour contenir le bloc entier + une marge de sécurité de 2 mm.
   En cas de manque d'espace (BOM longue, section dalle béton, etc.), la
   note est omise silencieusement pour préserver la lisibilité de la BOM
   et du cartouche, qui sont prioritaires.

   @param {jsPDF}    doc
   @param {number}   y        Ordonnée haute du bloc
   @param {string[]} lines    Lignes de texte (chaque entrée = 1 ligne)
   @param {object}   [opts]   { title }
   @returns {boolean} true si le bloc a été dessiné, false si omis */
export function drawNoteTechnique(doc, y, lines, opts = {}) {
  const mx = PAGE.MARGIN_X;
  const maxW = PAGE.CONTENT_W;
  const lineH = 5;                    // interligne
  const padTop = 5;
  const padBottom = 4;
  const titleH = opts.title ? 7 : 0;
  const boxH = padTop + titleH + lines.length * lineH + padBottom;

  /* Garde défensive : pas assez de place → on n'affiche rien */
  if (y + boxH + PAGE.NOTE_CARTOUCHE_GAP > PAGE.CARTOUCHE_Y) return false;

  /* Fond encadré */
  doc.setFillColor(...PDF.NOTE_BG);
  doc.setDrawColor(...PDF.NOTE_BORDER);
  doc.setLineWidth(0.25);
  doc.roundedRect(mx, y, maxW, boxH, 1.5, 1.5, 'FD');

  let curY = y + padTop;

  /* Titre optionnel */
  if (opts.title) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF.NOTE_TEXT);
    doc.text(opts.title, mx + 4, curY + 3);
    curY += titleH;
  }

  /* Lignes */
  doc.setFontSize(FONTS.NOTE);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...PDF.NOTE_TEXT);
  for (const line of lines) {
    doc.text(line, mx + 4, curY + 3);
    curY += lineH;
  }
  return true;
}

/* ── Titre de page — bandeau compact V6 ── */
export function pageTitle(doc, title, subtitle) {
  const W = PAGE.WIDTH;
  const BAND = 18;

  /* Fond noir chaud */
  doc.setFillColor(17, 18, 20);
  doc.rect(0, 0, W, BAND, 'F');

  /* Trait or en bas du bandeau */
  doc.setFillColor(201, 151, 30);
  doc.rect(0, BAND, W, 1.5, 'F');

  /* Marque */
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(201, 151, 30);
  doc.text('DIY BUILDER', 20, 7);

  /* Titre */
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(243, 242, 238);
  doc.text(title, 20, 14.5);

  if (subtitle) {
    /* Sous-titre sous le bandeau */
    doc.setFontSize(FONTS.BODY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF.PAGE_SUBTITLE);
    doc.text(subtitle, 20, BAND + 9);
    return BAND + 16;
  }
  return BAND + 8;
}

/* ── Titre de section (11pt bold + underline or) ── */
export function sectionTitle(doc, label, y) {
  doc.setFontSize(FONTS.SECTION);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 18, 20);
  doc.text(label, 20, y);
  doc.setDrawColor(201, 151, 30);
  doc.setLineWidth(0.5);
  doc.line(20, y + 3, 80, y + 3);
  return y + 9;
}

/* ── Tableau générique ──
   colAligns : tableau optionnel d'alignements ('left'|'center'|'right') par colonne */
export function drawTable(doc, headers, rows, x, y, colWidths, rowH = 8, colAligns = null) {
  const tableW = colWidths.reduce((a, b) => a + b, 0);

  function colAlign(i, count) {
    if (colAligns) return colAligns[Math.min(i, colAligns.length - 1)] ?? 'left';
    return i === count - 1 ? 'right' : 'left';
  }
  function colTx(align, cx, cw) {
    if (align === 'right')  return cx + cw - 2;
    if (align === 'center') return cx + cw / 2;
    return cx + 3;
  }

  doc.setFillColor(...PDF.TABLE_HEADER_BG);
  doc.rect(x, y, tableW, rowH, 'F');
  doc.setFontSize(FONTS.BODY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF.TABLE_HEADER_TEXT);
  let cx = x;
  headers.forEach((h, i) => {
    const align = colAlign(i, headers.length);
    doc.text(h, colTx(align, cx, colWidths[i]), y + rowH * 0.65, { align });
    cx += colWidths[i];
  });

  rows.forEach((row, ri) => {
    const ry = y + rowH * (ri + 1);
    doc.setFillColor(...(ri % 2 === 0 ? PDF.TABLE_ROW_EVEN : PDF.TABLE_ROW_ODD));
    doc.rect(x, ry, tableW, rowH, 'F');
    doc.setFontSize(FONTS.BODY);
    doc.setTextColor(...PDF.TABLE_TEXT);
    let cx2 = x;
    row.forEach((cell, ci) => {
      const align = colAlign(ci, row.length);
      doc.setFont('helvetica', ci === 0 ? 'bold' : 'normal');
      doc.text(String(cell), colTx(align, cx2, colWidths[ci]), ry + rowH * 0.65, { align });
      cx2 += colWidths[ci];
    });
  });

  doc.setDrawColor(...PDF.TABLE_BORDER);
  doc.setLineWidth(0.25);
  const totalH = rowH * (rows.length + 1);
  doc.rect(x, y, tableW, totalH, 'S');
  for (let r = 1; r <= rows.length; r++) {
    doc.line(x, y + rowH * r, x + tableW, y + rowH * r);
  }
  let vx = x;
  colWidths.slice(0, -1).forEach(cw => {
    vx += cw;
    doc.line(vx, y, vx, y + totalH);
  });

  return y + totalH;
}


/* ════════════════════════════════════════════════════════════
   LEGACY TERRASSE (drawTechnicalPlan2D + drawCoupePage) SUPPRIMÉ
   Migré vers primitives :
   - lib/plan/buildTerrasseTopView.js
   - lib/plan/buildTerrasseSectionView.js
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   PLAN DÉTAILLÉ CABANON — vue de façade via système de primitives
════════════════════════════════════════════════════════════ */
/* ── Quadrillé technique — fond léger pour pages techniques ── */
export function drawGrid(doc, x, y, w, h, step = 5) {
  doc.setDrawColor(228, 230, 238);
  doc.setLineWidth(0.08);
  for (let gx = x; gx <= x + w + 0.1; gx += step) doc.line(gx, y, gx, y + h);
  for (let gy = y; gy <= y + h + 0.1; gy += step) doc.line(x, gy, x + w, gy);
}

/**
 * Dessine un trait de coupe ISO 128 sur une vue de dessus.
 * Ligne trait-point-trait avec labels "A" aux extrémités + triangles directionnels.
 *
 * @param {jsPDF}  doc
 * @param {number} x1, y1   Début du trait (mm)
 * @param {number} x2, y2   Fin du trait (mm)
 * @param {string} label     Label de la coupe (ex: "A")
 * @param {string} dir       Direction des flèches : 'down' (par défaut) ou 'up'
 */
export function drawCutLine(doc, x1, y1, x2, y2, label = 'A', dir = 'down') {
  const stroke = [180, 40, 40];
  doc.setDrawColor(...stroke);
  doc.setLineWidth(0.4);
  doc.setLineDashPattern([4, 1, 1, 1], 0);
  doc.line(x1, y1, x2, y2);
  doc.setLineDashPattern([], 0);

  /* Triangles directionnels aux extrémités */
  const tri = 2.5;
  const sign = dir === 'up' ? -1 : 1;

  doc.setFillColor(...stroke);
  // Triangle début (using lines with closed path)
  doc.lines(
    [[tri * 0.6, sign * tri], [-tri * 1.2, 0]],
    x1 - tri * 0.6, y1 - sign * tri, [1, 1], 'F', true
  );
  // Triangle fin
  doc.lines(
    [[tri * 0.6, -sign * tri], [-tri * 1.2, 0]],
    x2 - tri * 0.6, y2 + sign * tri, [1, 1], 'F', true
  );

  /* Labels "A" aux extrémités */
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...stroke);
  doc.text(label, x1 + 2, y1 - sign * tri - 1);
  doc.text(label, x2 + 2, y2 + sign * tri + 3);
}

/**
 * Dessine une barre d'échelle graphique (scale bar) sur un plan technique.
 *
 * @param {jsPDF}  doc
 * @param {number} x          Position x gauche (mm)
 * @param {number} y          Position y (mm)
 * @param {number} realMeters Longueur réelle représentée (ex: 1 pour "1 m")
 * @param {number} barLenMM   Longueur de la barre sur le PDF (mm)
 */
export function drawScaleBar(doc, x, y, realMeters, barLenMM) {
  /* ── Adaptive: skip mid-label when bar too narrow ── */
  const compact = barLenMM < 22;
  const segCount = compact ? 2 : 4;
  const segW     = barLenMM / segCount;

  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.25);

  for (let i = 0; i < segCount; i++) {
    const sx = x + i * segW;
    if (i % 2 === 0) {
      doc.setFillColor(60, 60, 60);
      doc.rect(sx, y, segW, 1.5, 'FD');
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(sx, y, segW, 1.5, 'FD');
    }
  }

  /* Ticks aux extrémités + milieu */
  doc.setLineWidth(0.2);
  doc.line(x, y - 0.5, x, y + 2);
  doc.line(x + barLenMM, y - 0.5, x + barLenMM, y + 2);
  if (!compact) {
    doc.line(x + barLenMM / 2, y - 0.3, x + barLenMM / 2, y + 1.8);
  }

  /* ── Smart label formatting: cm for <1 m, clean decimals ── */
  const fmtLen = (m) => {
    if (m < 0.01) return `${Math.round(m * 1000)} mm`;
    if (m < 1)    return `${Math.round(m * 100)} cm`;
    const v = +m.toFixed(2);
    return v === Math.round(v) ? `${Math.round(v)} m` : `${v} m`;
  };

  /* Labels */
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('0', x, y + 4);
  if (!compact) {
    doc.text(fmtLen(realMeters / 2), x + barLenMM / 2, y + 4, { align: 'center' });
  }
  doc.text(fmtLen(realMeters), x + barLenMM, y + 4, { align: 'right' });
}

/**
 * Dessine un encadré légende dans une page PDF technique.
 * @param {jsPDF} doc
 * @param {number} x       Position x de l'encadré (mm)
 * @param {number} y       Position y de l'encadré (mm)
 * @param {Array}  items   [{ label: string, color: [r,g,b], fill?: [r,g,b] }]
 */
export function drawLegendBox(doc, x, y, items) {
  const lineH = 6;
  const boxW  = 42;
  const boxH  = 10 + items.length * lineH;
  const sw    = 3;   // taille du carré de couleur

  /* Fond + bordure */
  doc.setFillColor(250, 251, 253);
  doc.setDrawColor(192, 197, 208);
  doc.setLineWidth(LW.FIN);
  doc.roundedRect(x, y, boxW, boxH, 1.5, 1.5, 'FD');

  /* Titre */
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(64, 80, 106);
  doc.text('Légende', x + 3, y + 5.5);

  /* Séparateur */
  doc.setDrawColor(210, 215, 222);
  doc.setLineWidth(LW.TRES_FIN);
  doc.line(x + 3, y + 7, x + boxW - 3, y + 7);

  /* Items */
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(64, 80, 106);
  items.forEach((item, i) => {
    const iy = y + 9 + i * lineH;
    if (item.fill) {
      doc.setFillColor(...item.fill);
      doc.setDrawColor(...item.color);
      doc.setLineWidth(0.3);
      doc.rect(x + 3, iy, sw, sw, 'FD');
    } else {
      doc.setDrawColor(...item.color);
      doc.setLineWidth(0.6);
      doc.line(x + 3, iy + sw / 2, x + 3 + sw, iy + sw / 2);
    }
    doc.text(item.label, x + 3 + sw + 2, iy + sw - 0.3);
  });
}

/**
 * Encadré premium "budget non disponible" — remplace le texte italic orphelin.
 * Centré horizontalement, visuellement sobre mais volontaire.
 *
 * @param {jsPDF}  doc
 * @param {number} y   Ordonnée haute du bloc
 */
export function drawBudgetUnavailable(doc, y) {
  const mx = 30;
  const bw = 150;
  const bh = 44;

  /* Fond arrondi */
  doc.setFillColor(248, 249, 252);
  doc.setDrawColor(200, 208, 222);
  doc.setLineWidth(0.35);
  doc.roundedRect(mx, y, bw, bh, 3, 3, 'FD');

  /* Barre gauche accent */
  doc.setFillColor(180, 195, 220);
  doc.rect(mx, y, 4, bh, 'F');

  /* Icône "information" — cercle + i */
  const icX = mx + 16;
  const icY = y + bh / 2;
  doc.setDrawColor(140, 160, 195);
  doc.setLineWidth(0.5);
  doc.circle(icX, icY, 5, 'S');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(140, 160, 195);
  doc.text('i', icX, icY + 3.5, { align: 'center' });

  /* Titre */
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 60, 80);
  doc.text('Estimation budgetaire non disponible', mx + 28, y + 15);

  /* Sous-texte */
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 112, 135);
  doc.text('Les tarifs par enseigne n\'ont pas pu etre calcules pour', mx + 28, y + 24);
  doc.text('cette configuration. Verifiez les dimensions ou contactez', mx + 28, y + 30);
  doc.text('le support DIY Builder pour obtenir un devis personnalise.', mx + 28, y + 36);
}

/* ═══════════════════════════════════════════════════════════════════════
   drawCoverHeader — En-tête de couverture harmonisé pour tous les modules
   ═══════════════════════════════════════════════════════════════════════
   Produit un bandeau foncé (h=52mm) + barre accent + KPIs synthèse.
   Retourne le Y du début de la zone contenu (sous le bandeau).

   @param {jsPDF}  doc
   @param {object} opts
   @param {string} opts.title      Titre principal (ex: "Projet Terrasse Bois")
   @param {string} opts.subtitle   Ligne sous le titre (ex: "3 m × 4 m · Surface : 12 m²")
   @param {string} [opts.detail]   2e ligne optionnelle (type pose, pente…)
   @param {Array}  [opts.badges]   [{label, value}] — max 4 KPIs affichés en pastilles
   @param {string} [opts.date]     Date formatée (défaut: date du jour fr-FR)
   @returns {number}               Y de début contenu (~64-66)
*/
export function drawCoverHeader(doc, {
  title,
  subtitle,
  detail = null,
  badges = [],
  date = null,
}) {
  const BAND_H = 52;
  const ACCENT_H = 3;
  const W = PAGE.WIDTH;

  /* ── Fond foncé — noir chaud cohérent V6 ── */
  doc.setFillColor(17, 18, 20);
  doc.rect(0, 0, W, BAND_H, 'F');

  /* ── Barre accent or ── */
  doc.setFillColor(201, 151, 30);
  doc.rect(0, BAND_H, W, ACCENT_H, 'F');

  /* ── Marque ── */
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(201, 151, 30);
  doc.text('DIY BUILDER', 20, 11);

  /* ── Date (droite) ── */
  const dateStr = date || new Date().toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(145, 139, 130);
  doc.text(dateStr, W - 20, 11, { align: 'right' });

  /* ── Titre principal ── */
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(243, 242, 238);
  doc.text(title, 20, 25);

  /* ── Sous-titre ── */
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(168, 160, 148);
  doc.text(subtitle, 20, 34);

  /* ── Ligne détail optionnelle ── */
  if (detail) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(145, 139, 130);
    doc.text(detail, 20, 42);
  }

  /* ── Badges KPI (pastilles sous le bandeau) ── */
  let contentY = BAND_H + ACCENT_H + 5;

  if (badges.length > 0) {
    contentY += 2;
    const badgeW = Math.min(40, (W - 40 - (badges.length - 1) * 4) / badges.length);
    const badgeH = 14;
    const totalW = badges.length * badgeW + (badges.length - 1) * 4;
    const startX = (W - totalW) / 2;

    badges.forEach((b, i) => {
      const bx = startX + i * (badgeW + 4);
      const by = contentY;

      /* Fond pastille — parchemin chaud */
      doc.setFillColor(243, 242, 238);
      doc.setDrawColor(221, 219, 214);
      doc.setLineWidth(0.2);
      doc.roundedRect(bx, by, badgeW, badgeH, 2, 2, 'FD');

      /* Valeur */
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 18, 20);
      doc.text(b.value, bx + badgeW / 2, by + 6, { align: 'center' });

      /* Label */
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(102, 98, 90);
      doc.text(b.label, bx + badgeW / 2, by + 11.5, { align: 'center' });
    });

    contentY += badgeH + 6;
  } else {
    contentY += 4;
  }

  return contentY;
}

/* ═══════════════════════════════════════════════════════════════════════
   draw3DBlock — Bloc image 3D standardisé pour la page 1 de tout module
   ═══════════════════════════════════════════════════════════════════════
   Dessine un cadre technique (fond PLAN_BG + grille) avec le snapshot 3D
   ou un placeholder si absent. Retourne le Y après le bloc (sous la légende).

   @param {jsPDF}  doc
   @param {number} y           Y de départ (après sectionTitle)
   @param {string|null} snapshot   Data URL JPEG du canvas 3D
   @param {string} [legend]    Texte légende centré sous le cadre
   @param {object} [opts]      { drawH: 150 } — hauteur du cadre
   @returns {number}           Y après le bloc
*/
export function draw3DBlock(doc, y, snapshot, legend = '', opts = {}) {
  const drawH = opts.drawH ?? 150;
  const margin = 25, drawW = 160;
  const topY = y + 2;
  const boxX = margin - 5, boxY = topY - 3, boxW = drawW + 10, boxH = drawH + 10;

  /* Fond + grille */
  doc.setFillColor(244, 245, 250);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
  drawGrid(doc, boxX, boxY, boxW, boxH);

  /* Image 3D dans le cadre */
  const imgPad = 4;
  const imgX = boxX + imgPad;
  const imgY = boxY + imgPad;
  const imgW = boxW - imgPad * 2;
  const imgH = boxH - imgPad * 2;

  if (snapshot) {
    doc.addImage(snapshot, 'JPEG', imgX, imgY, imgW, imgH);
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 155, 168);
    doc.text('Vue 3D non disponible', imgX + imgW / 2, imgY + imgH / 2, { align: 'center' });
  }

  /* Bordure */
  doc.setDrawColor(195, 200, 212);
  doc.setLineWidth(0.25);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'S');

  /* Légende sous le cadre */
  let endY = boxY + boxH + 3;
  if (legend) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(105, 112, 132);
    doc.text(legend, PAGE.WIDTH / 2, endY + 2, { align: 'center' });
    endY += 8;
  }

  return endY;
}
