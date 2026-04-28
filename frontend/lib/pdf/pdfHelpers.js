/**
 * pdfHelpers.js — Utilitaires indépendants pour la génération PDF
 *
 * Fonctions pures (math + jsPDF drawing helpers).
 * Aucun import React, aucun état.
 */
import { BOARD_LEN, JOIST_LEN } from '@/lib/deckConstants.js';

/* ── Hiérarchie de traits (mm) — ISO 128 simplifié ─────────────────── */
export const LW = {
  FORT:     0.50,  // contours principaux, arêtes visibles
  MOYEN:    0.35,  // éléments structurels secondaires
  FIN:      0.20,  // lignes de cote, extension, légende
  TRES_FIN: 0.10,  // grille de fond, hachures
  CADRE:    0.30,  // cadre de cartouche, séparateurs
};

/* ── Composition verticale des pages PDF (A4 portrait, mm) ────────────
   DOCTRINE LAYOUT :
   Chaque page est composée de haut en bas :
     1. En-tête / titre de section
     2. Contenu principal (BOM, plan technique, coupe…)
     3. Note technique optionnelle (drawNoteTechnique) — omise si
        pas assez de place ; la BOM et le cartouche sont prioritaires
     4. Cartouche fixe (bande pleine largeur en bas de page)

   Les constantes ci-dessous sont les invariants partagés par tous
   les modules. Les positions dynamiques (y BOM, y note) varient
   selon le contenu mais doivent toujours respecter la contrainte :
     bottom(note) + PAGE.NOTE_CARTOUCHE_GAP ≤ PAGE.CARTOUCHE_Y       */
export const PAGE = {
  /* ── Zone utile ── */
  WIDTH:               210,     // largeur A4
  HEIGHT:              297,     // hauteur A4
  MARGIN_X:             20,     // marge gauche / droite contenu
  CONTENT_W:           170,     // largeur utile (210 - 2×20)

  /* ── Cartouche (invariant, tous modules) ── */
  CARTOUCHE_Y:         276,     // ordonnée haute du cartouche
  CARTOUCHE_H:          14,     // hauteur du cartouche

  /* ── Sécurité note → cartouche ── */
  NOTE_CARTOUCHE_GAP:    2,     // marge minimale entre bas de note et cartouche (mm)

  /* ── En-tête BOM (modules pergola / clôture / cabanon) ── */
  HEADER_TITLE_Y:       24,     // baseline du titre principal
  HEADER_SEP_Y:         30,     // filet séparateur sous titre
  HEADER_DIMS_Y0:       40,     // première ligne de dimensions
  HEADER_DIMS_STEP:      8,     // interligne dimensions
  BOM_FIRST_SECTION_Y:  72,     // titre de la première section BOM

  /* ── BOM rows (pergola / clôture, layout fixe) ── */
  BOM_ROW_H:            11,     // hauteur d'une ligne BOM simple
  BOM_FIRST_ROW_Y:      87,     // première ligne de données BOM
};

/* ── Formatage longueur (français) ── */
export function fmtLen(m) {
  const r = Math.round(m * 100) / 100;
  if (r === Math.floor(r)) return `${r} m`;
  return `${r.toFixed(2).replace('.', ',')} m`;
}

/* ── Formatage prix (format français : 1 234,56 €) ── */
export function fmtPrice(v) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(v || 0));
}

/* ── Formatage surface (toujours m² avec accent) ── */
export function fmtArea(v) {
  return `${parseFloat(v || 0).toFixed(2)} m²`;
}

/* ── Constantes typographiques PDF ── */
export const FONTS = {
  TITLE: 15,
  SECTION: 11,
  BODY: 8.5,
  SMALL: 7,
  TINY: 6.5,
  NOTE: 7,
  DISCLAIMER: 7,
};

/* ── Segments d'une rangée de lames ── */
export function boardRowSegs(w, isOdd) {
  const segs = [];
  let x = 0;
  if (isOdd) { segs.push(Math.min(BOARD_LEN / 2, w)); x += BOARD_LEN / 2; }
  while (x < w - 0.001) {
    segs.push(Math.min(BOARD_LEN, w - x));
    x += BOARD_LEN;
  }
  return segs.map(v => Math.round(v * 100) / 100);
}

/* ── Segments d'une colonne de lambourdes ── */
export function joistColSegs(d, isOdd) {
  const firstAt = isOdd ? JOIST_LEN / 2 : JOIST_LEN;
  const segs    = [];
  let z = 0;
  segs.push(Math.min(firstAt, d));
  z += firstAt;
  while (z < d - 0.001) {
    segs.push(Math.min(JOIST_LEN, d - z));
    z += JOIST_LEN;
  }
  return segs.map(v => Math.round(v * 100) / 100);
}

/* ── Flèche de cote horizontale ── */
export function hArrow(doc, x1, x2, y, label, fontSize = 6) {
  doc.setLineWidth(0.25);
  doc.setDrawColor(50, 50, 50);
  doc.line(x1, y, x2, y);
  doc.line(x1, y - 1.5, x1, y + 1.5);
  doc.line(x2, y - 1.5, x2, y + 1.5);
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(label, (x1 + x2) / 2, y - 1.8, { align: 'center' });
}

/* ── Flèche de cote verticale ── */
export function vArrow(doc, x, y1, y2, label, fontSize = 6) {
  doc.setLineWidth(0.25);
  doc.setDrawColor(50, 50, 50);
  doc.line(x, y1, x, y2);
  doc.line(x - 1.5, y1, x + 1.5, y1);
  doc.line(x - 1.5, y2, x + 1.5, y2);
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(label, x - 2, (y1 + y2) / 2 + 1.5, { align: 'right' });
}
