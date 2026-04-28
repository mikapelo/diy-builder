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
import { STORES } from '@/lib/materialPrices.js';
import { calculateDetailedCost, calculateTotalCost } from '@/lib/costCalculator.js';
import { capture3DForExport, captureCanvasSnapshot } from '@/components/simulator/ExportPDF/canvasCapture.js';
import { generateCabanonPDF }  from '@/components/simulator/ExportPDF/cabanonPDF.js';
import { generateTerrassePDF } from '@/components/simulator/ExportPDF/terrassePDF.js';
import { generatePergolaPDF }  from '@/components/simulator/ExportPDF/pergolaPDF.js';
import { generateCloturePDF }  from '@/components/simulator/ExportPDF/cloturePDF.js';

export function usePDFExport({ projectType, dims, materials, config, foundationType, slab, getBridge }) {
  const [pdfStatus, setPdfStatus] = useState('idle');

  const handleExportPDF = useCallback(async () => {
    setPdfStatus('generating');
    try {
      const doc = new jsPDF();
      const isSlab = foundationType === 'slab';

      if (projectType === 'cabanon') {
        const snapshot = await capture3DForExport(materials, getBridge);
        await generateCabanonPDF(doc, { dims, materials, projectConfig: config, foundationType, slab, snapshot });
        doc.save(`cabanon-${dims.width}x${dims.depth}.pdf`);
      } else if (projectType === 'pergola') {
        const snapshot = await captureCanvasSnapshot(getBridge);
        generatePergolaPDF(doc, { dims, materials, projectConfig: config, snapshot });
        doc.save(`pergola-${dims.width}x${dims.depth}m.pdf`);
      } else if (projectType === 'cloture') {
        const snapshot = await captureCanvasSnapshot(getBridge);
        generateCloturePDF(doc, { dims, materials, projectConfig: config, snapshot });
        doc.save(`cloture-${dims.width}x${dims.depth}m.pdf`);
      } else {
        const snapshot = await captureCanvasSnapshot(getBridge);
        const slabTotal = isSlab ? (slab?.totalPrice ?? 0) : 0;
        // Calcul détaillé par enseigne via costCalculator (waste factor + BOM ligne à ligne)
        // Remplace l'ancienne formule area×rate qui ignorait le BOM réel
        const prices = STORES.map(s => {
          const detail = calculateDetailedCost(materials, s.id, 'terrasse');
          const deckTotal = Math.round(calculateTotalCost(detail));
          return { ...s, deckTotal, total: Math.round(deckTotal + slabTotal) };
        });
        const best = Math.min(...prices.map(p => p.total));
        generateTerrassePDF(doc, { dims, materials, foundationType, projectConfig: config, prices, best, snapshot });
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
