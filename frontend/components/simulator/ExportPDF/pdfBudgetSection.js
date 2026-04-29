/**
 * pdfBudgetSection.js — Helpers partages pour le rendu budget dans les PDF
 *
 * Responsabilites :
 *   - drawStoreCards()    : 3 cartes comparatif enseignes (meilleur prix badge)
 *   - drawBOMTable()      : tableau BOM avec colonnes prix unitaire + sous-total
 *   - drawBudgetTotal()   : bloc recapitulatif totaux + disclaimer
 *   - drawCategorySubtotals() : ligne sous-totaux par categorie
 *
 * REGLE STRICTE : ce fichier ne fait AUCUN calcul de prix.
 * Il recoit des tableaux pre-calcules (budgetByStore) et les met en forme.
 * Aucun import de materialPrices.js ou costCalculator.js ici.
 *
 * Conventions typographiques jsPDF WinAnsiEncoding :
 *   - Pas de caracteres hors Latin-1 (pas de checkmark, pas de em-dash, pas de delta)
 *   - EUR symbol : "EUR" en texte (pas le symbole unicode)
 */

import { sectionTitle } from '@/lib/pdf/pdfDrawing.js';
import { fmtPrice, fmtPriceCompact } from '@/lib/pdf/pdfHelpers.js';

/* ════════════════════════════════════════════════════════════
   Palette warm parchemin — cohérente avec cartouche + pageTitle
   (cf. lib/pdf/pdfDrawing.js & cabanon P5)
════════════════════════════════════════════════════════════ */
const WARM = {
  black:           [17, 18, 20],     // texte principal, noir chaud branding
  gold:            [201, 151, 30],   // accent or #C9971E
  goldDark:        [160, 119, 23],   // or fonce — meilleur prix, TOTAL
  parchemin:       [243, 242, 238],  // fill header/colonnes
  parcheminAlt:    [249, 247, 242],  // alt rows
  parcheminGold:   [250, 243, 220],  // fill card "meilleur prix"
  warmGray:        [102, 98, 90],    // texte secondaire (unite, P.U. manquant)
  warmGrayLight:   [145, 139, 130],  // captions, disclaimer, sous-texte
  warmBorder:      [215, 210, 200],  // bordures cartes + traits separateurs
  warmBorderSoft:  [225, 220, 210],  // bordure card non-best
  mutedGray:       [170, 165, 155],  // texte "-" (P.U. manquant)
};

/* ════════════════════════════════════════════════════════════
   drawStoreCards — 3 cartes comparatif enseignes
════════════════════════════════════════════════════════════ */

/**
 * @param {jsPDF}  doc
 * @param {number} y             Ordonnee haute
 * @param {Array}  budgetByStore [{ store: { id, name }, total, matTotal?, fallback? }]
 *                               Deja trie par total croissant.
 * @param {object} [opts]        { slabTotal, area }
 * @returns {number} Nouvelle ordonnee y apres les cartes
 */
export function drawStoreCards(doc, y, budgetByStore, opts = {}) {
  const { area = 0 } = opts;
  const bestTotal = budgetByStore[0]?.total ?? 0;

  /* Layout dynamique calibré sur la zone utile A4 (170 mm de x=20 a x=190).
     Avec 4 enseignes : (170 - 3*4) / 4 = 39.5 mm/carte.
     Avec 3 enseignes : (170 - 2*4) / 3 = 54 mm/carte. */
  const N = budgetByStore.length || 1;
  const cardGap = 4;
  const usableW = 170; // PAGE.CONTENT_W
  const cardW   = (usableW - cardGap * (N - 1)) / N;
  const cardH   = 22;
  /* fontSize total : 11pt pour tenir "12 345 EUR" en bold dans 39.5 mm
     (mesure jsPDF helvetica bold ~25 mm a 11pt — large marge). */
  const totalFontSize = N >= 4 ? 11 : 13;
  const nameFontSize  = N >= 4 ? 8   : 8.5;

  budgetByStore.forEach((entry, i) => {
    const cx = 20 + i * (cardW + cardGap);
    const isBest = entry.total === bestTotal && i === 0;

    if (isBest) {
      doc.setFillColor(...WARM.parcheminGold);
      doc.setDrawColor(...WARM.gold);
    } else {
      doc.setFillColor(...WARM.parcheminAlt);
      doc.setDrawColor(...WARM.warmBorderSoft);
    }
    doc.setLineWidth(isBest ? 0.8 : 0.4);
    doc.roundedRect(cx, y, cardW, cardH, 2, 2, 'FD');

    /* Nom enseigne */
    doc.setFontSize(nameFontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...(isBest ? WARM.goldDark : WARM.black));
    doc.text(entry.store.name, cx + 4, y + 7);

    /* Total — format compact (entiers ≥1000€) pour tenir dans la cellule. */
    doc.setFontSize(totalFontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...(isBest ? WARM.goldDark : WARM.black));
    doc.text(fmtPriceCompact(entry.total), cx + cardW - 3, y + 16, { align: 'right' });

    /* Badge meilleur prix */
    if (isBest) {
      doc.setFontSize(N >= 4 ? 6.5 : 7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WARM.goldDark);
      doc.text('* Meilleur prix', cx + 4, y + 21);
    }
  });

  y += cardH + 4;

  /* Sous-texte */
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...WARM.warmGrayLight);
  const areaStr = area > 0 ? `${area} m²` : 'votre projet';
  doc.text(`Estimation basee sur ${areaStr} - Tarifs indicatifs (fournitures)`, 20, y);
  y += 6;

  /* Mention fallback si applicable */
  if (budgetByStore[0]?.fallback) {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...WARM.goldDark);
    doc.text('* Estimation simplifiee (taux au m²) - detail par materiau non disponible', 20, y);
    y += 5;
  }

  return y;
}

/* ════════════════════════════════════════════════════════════
   drawBOMTable — Tableau BOM avec colonnes prix
════════════════════════════════════════════════════════════ */

/**
 * @param {jsPDF}  doc
 * @param {number} y              Ordonnee haute
 * @param {object} categories     { [catName]: [{ label, quantity, unit, unitPrice, subtotal }] }
 *                                 Resultat de groupByCategory(), prix de l'enseigne la moins chere.
 * @param {object} [opts]         { showPrices: true }
 * @returns {number} Nouvelle ordonnee y
 */
export function drawBOMTable(doc, y, categories, opts = {}) {
  const { showPrices = true } = opts;

  const catNames = Object.keys(categories);

  for (const catName of catNames) {
    const lines = categories[catName];
    if (!lines || lines.length === 0) continue;

    /* ── Titre de categorie ── */
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WARM.black);
    doc.text(catName, 23, y + 4);
    y += 7;

    /* ── En-tete colonnes ── */
    doc.setFillColor(...WARM.parchemin);
    doc.rect(20, y, 170, 6.5, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WARM.black);
    doc.text('Designation', 23, y + 4.5);
    doc.text('Qte', 100, y + 4.5, { align: 'right' });
    doc.text('Unite', 108, y + 4.5);
    if (showPrices) {
      doc.text('P.U.', 145, y + 4.5, { align: 'right' });
      doc.text('Sous-total', 186, y + 4.5, { align: 'right' });
    }
    y += 7.5;

    /* ── Lignes materiaux ── */
    lines.forEach((line, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(...WARM.parcheminAlt);
        doc.rect(20, y - 1, 170, 6, 'F');
      }
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...WARM.black);
      doc.text(String(line.label ?? ''), 23, y + 3);

      doc.setFont('helvetica', 'bold');
      const qtyStr = typeof line.quantity === 'number'
        ? (Number.isInteger(line.quantity) ? String(line.quantity) : line.quantity.toFixed(2))
        : String(line.quantity ?? '-');
      doc.text(qtyStr, 100, y + 3, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...WARM.warmGray);
      doc.text(String(line.unit ?? ''), 108, y + 3);

      if (showPrices) {
        if (line.unitPrice != null) {
          doc.text(fmtPrice(line.unitPrice), 145, y + 3, { align: 'right' });
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...WARM.black);
          doc.text(fmtPrice(line.subtotal ?? 0), 186, y + 3, { align: 'right' });
        } else {
          doc.setTextColor(...WARM.mutedGray);
          doc.text('-', 145, y + 3, { align: 'right' });
          doc.text('-', 186, y + 3, { align: 'right' });
        }
      }
      y += 6;
    });

    /* ── Sous-total categorie ── */
    if (showPrices) {
      const catSubtotal = lines.reduce((sum, l) => sum + (l.subtotal ?? 0), 0);
      doc.setDrawColor(...WARM.warmBorder);
      doc.setLineWidth(0.2);
      doc.line(130, y, 190, y);
      y += 1;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WARM.black);
      doc.text(`${catName} :`, 130, y + 3);
      doc.text(fmtPrice(catSubtotal), 186, y + 3, { align: 'right' });
      y += 6;
    }

    y += 3;
  }

  return y;
}

/* ════════════════════════════════════════════════════════════
   drawBudgetTotal — Bloc total + fondation optionnelle + disclaimer
════════════════════════════════════════════════════════════ */

/**
 * @param {jsPDF}  doc
 * @param {number} y              Ordonnee haute
 * @param {object} bestEntry      { store, total, matTotal, lines, categories }
 * @param {object} [opts]         { slabTotal, showDetail: true }
 * @returns {number} Nouvelle ordonnee y
 */
export function drawBudgetTotal(doc, y, bestEntry, opts = {}) {
  const { slabTotal = 0, showDetail = true } = opts;
  const matTotal = bestEntry.matTotal ?? bestEntry.total ?? 0;
  const grandTotal = matTotal + slabTotal;

  const boxH = slabTotal > 0 ? 32 : 20;

  doc.setFillColor(...WARM.parcheminAlt);
  doc.setDrawColor(...WARM.warmBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, y, 170, boxH, 2, 2, 'FD');

  /* Bande verticale or */
  doc.setFillColor(...WARM.gold);
  doc.rect(20, y, 4, boxH, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WARM.black);
  doc.text(`Budget estimatif - ${bestEntry.store.name}`, 28, y + 7);

  if (slabTotal > 0 && showDetail) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...WARM.black);
    doc.text('Materiaux :', 28, y + 14);
    doc.text(fmtPrice(matTotal), 186, y + 14, { align: 'right' });

    doc.text('Dalle beton :', 28, y + 20);
    doc.text(fmtPrice(slabTotal), 186, y + 20, { align: 'right' });

    doc.setDrawColor(...WARM.warmBorder);
    doc.setLineWidth(0.2);
    doc.line(100, y + 22.5, 186, y + 22.5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WARM.goldDark);
    doc.text('TOTAL :', 28, y + 29);
    doc.text(fmtPrice(grandTotal), 186, y + 29, { align: 'right' });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WARM.goldDark);
    doc.text('TOTAL MATERIAUX :', 28, y + 15);
    doc.text(fmtPrice(matTotal), 186, y + 15, { align: 'right' });
  }

  y += boxH + 5;

  /* Disclaimer */
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...WARM.warmGrayLight);
  doc.text('Estimation indicative. Prix constates 2025. Hors pose, livraison et outillage.', 20, y);
  y += 4;

  return y;
}

/* ════════════════════════════════════════════════════════════
   drawBudgetPage — Page budget complete (cartes + BOM + total)
   Utilisable par tous les modules comme page dediee.
════════════════════════════════════════════════════════════ */

/**
 * @param {jsPDF}  doc
 * @param {Array}  budgetByStore  [{ store, total, matTotal, lines, categories }]
 *                                 Trie par total croissant.
 * @param {object} [opts]         { area, slabTotal, projectType }
 * @returns {number} Ordonnee finale
 */
export function drawBudgetPage(doc, budgetByStore, opts = {}) {
  const { area = 0, slabTotal = 0, startY = 48 } = opts;

  if (!budgetByStore || budgetByStore.length === 0) return startY + 2;

  let y = sectionTitle(doc, 'Comparatif budget par enseigne', startY);

  /* Cartes enseignes */
  y = drawStoreCards(doc, y, budgetByStore, { area });

  y += 4;

  /* BOM detaillee du meilleur prix */
  const bestEntry = budgetByStore[0];
  if (bestEntry.categories && Object.keys(bestEntry.categories).length > 0) {
    y = sectionTitle(doc, `Detail - ${bestEntry.store.name} (meilleur prix)`, y);
    y = drawBOMTable(doc, y, bestEntry.categories, { showPrices: true });
  }

  /* Total */
  y = drawBudgetTotal(doc, y, bestEntry, { slabTotal });

  return y;
}
