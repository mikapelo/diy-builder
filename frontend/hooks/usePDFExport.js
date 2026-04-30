'use client';

/**
 * usePDFExport — hook de génération PDF par type de projet
 *
 * Extrait de DeckSimulator.jsx (Phase B — décomposition orchestrateur).
 *
 * Encapsule : jsPDF, capture canvas, branchement par projectType, gestion statut.
 *
 * @param {object} params
 * @param {string}  params.projectType
 * @param {object}  params.dims — { width, depth, area }
 * @param {object}  params.materials — BOM data
 * @param {object}  params.config — project config (label, pdfTitle, etc.)
 * @param {string}  params.foundationType
 * @param {object}  params.slab — foundation data (or null)
 * @param {function} params.getBridge — useExportBridge() ref getter
 *
 * @returns {{ handleExportPDF: () => Promise<void>, pdfStatus: string }}
 */

import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { trackPDFExport } from '@/hooks/useAnalytics.js';
import { STORES } from '@/lib/materialPrices.js';
import { calculateDetailedCost, calculateTotalCost, groupByCategory } from '@/lib/costCalculator.js';
import { capture3DForExport, captureCanvasSnapshot } from '@/components/simulator/ExportPDF/canvasCapture.js';
import { generateCabanonPDF }  from '@/components/simulator/ExportPDF/cabanonPDF.js';
import { generateTerrassePDF } from '@/components/simulator/ExportPDF/terrassePDF.js';
import { generatePergolaPDF }  from '@/components/simulator/ExportPDF/pergolaPDF.js';
import { generateCloturePDF }  from '@/components/simulator/ExportPDF/cloturePDF.js';

/* ────────────────────────────────────────────────────────────
   computeBudgetByStore — source unique de prix pour le PDF
   Retourne un tableau trie par total croissant.
   Centralise le calcul detaille pour les 4 modules afin que
   l'encadre "Estimation budgetaire non disponible" ne s'affiche
   que si le calcul echoue reellement.
──────────────────────────────────────────────────────────── */
function computeBudgetByStore(materials, projectType, slabTotal) {
  try {
    const result = STORES.map(store => {
      const lines = calculateDetailedCost(materials, store.id, projectType);
      const matTotal = calculateTotalCost(lines);
      const categories = groupByCategory(lines);
      return {
        store: { id: store.id, name: store.name },
        lines,
        matTotal,
        total: Math.round((matTotal + slabTotal) * 100) / 100,
        categories,
        fallback: false,
      };
    });

    /* Validation : au moins une enseigne avec des lignes */
    const hasLines = result.some(e => e.lines.length > 0);
    if (!hasLines) throw new Error('No detailed lines produced');

    /* Marquer les lignes sans prix unitaire */
    result.forEach(entry => {
      entry.partial = entry.lines.some(l => l.unitPrice == null);
    });

    result.sort((a, b) => a.total - b.total);
    return result;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[usePDFExport] Detailed pricing failed, falling back to rate/m2:', err.message);
    }
    return null;
  }
}

/* ── Fallback rate/m² (taux STORES) ───────────────────────── */
function fallbackBudgetByStore(area, slabTotal) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[usePDFExport] Using fallback rate/m² — PDF budget may be approximate.');
  }
  return STORES.map(s => ({
    store: { id: s.id, name: s.name },
    lines: [],
    matTotal: Math.round(area * s.rate),
    total: Math.round(area * s.rate + slabTotal),
    categories: {},
    fallback: true,
    partial: false,
  })).sort((a, b) => a.total - b.total);
}

export function usePDFExport({ projectType, dims, materials, config, foundationType, slab, getBridge }) {
  const [pdfStatus, setPdfStatus] = useState('idle');

  const handleExportPDF = useCallback(async () => {
    setPdfStatus('generating');
    trackPDFExport({ module: projectType });
    try {
      const doc = new jsPDF();
      const isSlab = foundationType === 'slab';
      const slabTotal = isSlab ? (slab?.totalPrice ?? 0) : 0;

      /* ── Calcul centralise du budget (source unique) ──
         Calcule pour TOUS les modules (cabanon, terrasse, pergola, cloture).
         Si le calcul detaille echoue, on tombe sur le rate/m² (fallback marque
         dans budgetByStore[0].fallback = true). */
      const budgetByStore = computeBudgetByStore(materials, projectType, slabTotal)
        ?? fallbackBudgetByStore(dims.area, slabTotal);
      const bestPrice = budgetByStore[0]?.total ?? 0;

      if (projectType === 'cabanon') {
        const snapshot = await capture3DForExport(materials, getBridge);
        await generateCabanonPDF(doc, {
          dims, materials, projectConfig: config, foundationType, slab, snapshot,
          budgetByStore, bestPrice,
        });
        doc.save(`cabanon-${dims.width}x${dims.depth}.pdf`);
      } else if (projectType === 'pergola') {
        const snapshot = await captureCanvasSnapshot(getBridge);
        generatePergolaPDF(doc, {
          dims, materials, projectConfig: config, snapshot,
          budgetByStore, bestPrice,
        });
        doc.save(`pergola-${dims.width}x${dims.depth}m.pdf`);
      } else if (projectType === 'cloture') {
        const snapshot = await captureCanvasSnapshot(getBridge);
        generateCloturePDF(doc, {
          dims, materials, projectConfig: config, snapshot,
          budgetByStore, bestPrice,
        });
        doc.save(`cloture-${dims.width}x${dims.depth}m.pdf`);
      } else {
        const snapshot = await captureCanvasSnapshot(getBridge);
        generateTerrassePDF(doc, {
          dims, materials, foundationType, projectConfig: config, snapshot,
          budgetByStore, bestPrice,
        });
        doc.save(`terrasse-${dims.width}x${dims.depth}m.pdf`);
      }
      setPdfStatus('done');
      setTimeout(() => setPdfStatus('idle'), 2500);
    } catch (e) {
      console.error('[usePDFExport] PDF generation error:', e);
      setPdfStatus('idle');
    }
  }, [projectType, dims, materials, config, foundationType, slab, getBridge]);

  return { handleExportPDF, pdfStatus };
}
