'use client';

/**
 * usePDFChecklist.js — Génération PDF checklist chantier par module
 *
 * Produit un PDF A4 téléchargeable avec :
 *   - En-tête (titre projet + dimensions + date)
 *   - Planning week-end indicatif
 *   - Étapes numérotées avec cases à cocher
 *   - Pied de page avec URL
 *
 * Pas de dépendance à l'export 3D — fonctionne en standalone.
 */

import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { CHECKLISTS } from '@/lib/projectTime';

const BRAND_DARK   = '#111214';
const BRAND_GOLD   = '#C9971E';
const BRAND_LIGHT  = '#F9F6F0';
const BRAND_BORDER = '#e5e2d8';
const TEXT_MUTED   = '#6b5f4f';

const MODULE_LABELS = {
  terrasse: 'Terrasse bois',
  cabanon:  'Cabanon ossature bois',
  pergola:  'Pergola bois',
  cloture:  'Clôture bois',
};

/* ── Helpers de dessin ── */

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function setColor(doc, hex) {
  const [r, g, b] = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

function setFill(doc, hex) {
  const [r, g, b] = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

function setStroke(doc, hex) {
  const [r, g, b] = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

function drawCheckbox(doc, x, y, size = 3.5) {
  setStroke(doc, BRAND_BORDER);
  doc.setLineWidth(0.3);
  doc.rect(x, y, size, size);
}

/* ── Sections ── */

function drawHeader(doc, projectType, dims, pageWidth) {
  const label = MODULE_LABELS[projectType] ?? 'Projet DIY';

  setFill(doc, BRAND_DARK);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, '#FFFFFF');
  doc.text('DIY Builder', 15, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, BRAND_GOLD);
  doc.text('diy-builder.fr', 15, 20);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  setColor(doc, '#FFFFFF');
  doc.text(`Checklist chantier — ${label}`, pageWidth / 2, 13, { align: 'center' });

  const dimText = dims.width && dims.depth
    ? `${dims.width} × ${dims.depth} m${dims.area ? `  ·  ${dims.area} m²` : ''}`
    : '';
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, '#aaaaaa');
  if (dimText) doc.text(dimText, pageWidth / 2, 21, { align: 'center' });

  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Imprimé le ${today}`, pageWidth - 15, 21, { align: 'right' });

  return 40;
}

function drawWeekendPlan(doc, weekendPlan, startY, pageWidth) {
  if (!weekendPlan?.length) return startY;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, BRAND_DARK);
  doc.text('Planning week-end indicatif', 15, startY);
  startY += 7;

  const colW = (pageWidth - 30) / weekendPlan.length;
  weekendPlan.forEach((slot, i) => {
    const x = 15 + i * colW;

    setFill(doc, BRAND_LIGHT);
    setStroke(doc, BRAND_BORDER);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, startY, colW - 4, 22, 2, 2, 'FD');

    setColor(doc, BRAND_GOLD);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(slot.moment.toUpperCase(), x + (colW - 4) / 2, startY + 6, { align: 'center' });

    setColor(doc, TEXT_MUTED);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    slot.tasks.forEach((task, j) => {
      const y = startY + 12 + j * 4.5;
      if (y < startY + 21) {
        doc.text(`• ${task}`, x + 4, y, { maxWidth: colW - 10 });
      }
    });
  });

  return startY + 30;
}

function drawStage(doc, stage, stageIndex, startY, pageWidth) {
  const margin = 15;
  const contentW = pageWidth - margin * 2;

  // En-tête étape
  setFill(doc, BRAND_GOLD);
  doc.roundedRect(margin, startY, contentW, 8, 1.5, 1.5, 'F');

  setColor(doc, '#FFFFFF');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Étape ${stageIndex + 1} — ${stage.title}`, margin + 4, startY + 5.5);

  startY += 11;

  // Items
  stage.items.forEach((item) => {
    if (startY > 270) return; // garde-fou bas de page

    drawCheckbox(doc, margin + 2, startY - 2.5);

    setColor(doc, BRAND_DARK);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(item, contentW - 14);
    doc.text(lines, margin + 9, startY);

    startY += lines.length * 4.5 + 2;
  });

  return startY + 4;
}

function drawFooter(doc, pageWidth, pageHeight) {
  setFill(doc, BRAND_LIGHT);
  doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

  setColor(doc, TEXT_MUTED);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('DIY Builder — diy-builder.fr', 15, pageHeight - 5);
  doc.text('Estimation indicative, non contractuelle. Consultez un professionnel pour les ouvrages structurels.', pageWidth / 2, pageHeight - 5, { align: 'center' });
  doc.text(`Page 1`, pageWidth - 15, pageHeight - 5, { align: 'right' });
}

/* ── Hook principal ── */

export function usePDFChecklist() {
  const [checklistStatus, setChecklistStatus] = useState('idle');

  const handleExportChecklist = useCallback(async (projectType, dims, weekendPlan) => {
    setChecklistStatus('generating');

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth  = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const stages = CHECKLISTS[projectType] ?? [];

      let y = drawHeader(doc, projectType, dims, pageWidth);

      y = drawWeekendPlan(doc, weekendPlan, y, pageWidth);

      // Trait séparateur
      setStroke(doc, BRAND_BORDER);
      doc.setLineWidth(0.3);
      doc.line(15, y, pageWidth - 15, y);
      y += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      setColor(doc, BRAND_DARK);
      doc.text('Checklist étape par étape', 15, y);
      y += 8;

      stages.forEach((stage, i) => {
        y = drawStage(doc, stage, i, y, pageWidth);
      });

      drawFooter(doc, pageWidth, pageHeight);

      const label = MODULE_LABELS[projectType]?.toLowerCase().replace(/\s+/g, '-') ?? 'projet';
      doc.save(`checklist-${label}-${dims.width ?? 0}x${dims.depth ?? 0}m.pdf`);

      setChecklistStatus('done');
      setTimeout(() => setChecklistStatus('idle'), 2500);
    } catch {
      setChecklistStatus('idle');
    }
  }, []);

  return { handleExportChecklist, checklistStatus };
}
