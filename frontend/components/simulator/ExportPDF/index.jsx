'use client';
/**
 * ExportPDF/index.jsx — Point d'entree de l'export PDF
 * Email-gating : 1ère visite → modal → localStorage → téléchargement.
 * Visites suivantes : téléchargement direct (email en localStorage).
 *
 * Responsabilites :
 *   - Composant React (bouton + state)
 *   - Orchestration generatePDF : branche par module
 *   - Calcul centralise de budgetByStore via costCalculator (source unique de prix)
 *   - Fallback vers l'ancien systeme rate/m2 si le calcul detaille echoue
 *
 * Delegue a :
 *   - canvasCapture.js      -> capture 3D pour le PDF cabanon
 *   - cabanonPDF.js         -> layout PDF complet du cabanon
 *   - terrassePDF.js        -> layout PDF complet de la terrasse
 *   - pergolaPDF.js         -> layout PDF complet de la pergola
 *   - cloturePDF.js         -> layout PDF complet de la cloture
 *   - pdfBudgetSection.js   -> helpers partages de rendu budget
 *
 * REGLE : costCalculator est importe ICI et nulle part ailleurs cote PDF.
 * Les fichiers xxxPDF.js recoivent des donnees pre-calculees.
 */
import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import EmailGateModal from '@/components/ui/EmailGateModal';

import { STORES as STORES_ALL }                                from '@/lib/materialPrices.js';
import { calculateDetailedCost, calculateTotalCost, groupByCategory } from '@/lib/costCalculator.js';

import { useExportBridge }     from '../shared/ExportContext';
import { generateCabanonPDF }  from './cabanonPDF.js';
import { capture3DForExport, captureCanvasSnapshot }  from './canvasCapture.js';
import { generateTerrassePDF } from './terrassePDF.js';
import { generatePergolaPDF }  from './pergolaPDF.js';
import { generateCloturePDF }  from './cloturePDF.js';

/* ────────────────────────────────────────────────────────────
   computeBudgetByStore — source unique de prix pour le PDF
   Retourne un tableau trie par total croissant.
──────────────────────────────────────────────────────────── */
function computeBudgetByStore(materials, projectType, slabTotal) {
  try {
    const result = STORES_ALL.map(store => {
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
      console.warn('[ExportPDF] Detailed pricing failed, falling back to rate/m2:', err.message);
    }
    return null; // signal fallback
  }
}

/* ── Fallback rate/m2 (simplifié, source unique materialPrices) ── */
function fallbackBudgetByStore(area, slabTotal) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[ExportPDF] Using fallback rate/m² — PDF budget may be approximate.');
  }
  return STORES_ALL.map(s => ({
    store: { id: s.id, name: s.name },
    lines: [],
    matTotal: Math.round(area * s.rate),
    total: Math.round(area * s.rate + slabTotal),
    categories: {},
    fallback: true,
    partial: false,
  })).sort((a, b) => a.total - b.total);
}

/* ════════════════════════════════════════════════════════════ */

export default function ExportPDF({ dims, materials, foundationType, projectType = 'terrasse', projectConfig }) {
  const { width, depth, area } = dims;
  const { slab } = materials;

  const getBridge = useExportBridge();
  const [status, setStatus] = useState('idle');
  const [showModal, setShowModal] = useState(false);

  const isSlab = foundationType === 'slab';
  const slabTotal = isSlab ? (slab?.totalPrice ?? 0) : 0;

  /* ── Notification silencieuse lead (email déjà connu) ── */
  const notifyLead = useCallback((email) => {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, projectType, dims }),
    }).catch(() => {});
  }, [projectType, dims]);

  /* ── Clic bouton : vérifie localStorage avant génération ── */
  function handleClick() {
    const savedEmail = typeof window !== 'undefined'
      ? localStorage.getItem('diy_lead_email')
      : null;

    if (savedEmail) {
      notifyLead(savedEmail);
      generatePDF();
    } else {
      setShowModal(true);
    }
  }

  /* ── Callback modal : email validé → génération ── */
  function handleModalConfirm(email) {
    setShowModal(false);
    generatePDF();
  }

  async function generatePDF() {
    setStatus('generating');

    try {
      const doc = new jsPDF();

      /* ── Calcul centralise du budget (source unique) ── */
      const budgetByStore = computeBudgetByStore(materials, projectType, slabTotal)
        ?? fallbackBudgetByStore(area, slabTotal);
      const bestPrice = budgetByStore[0]?.total ?? 0;

      /* ── Branche cabanon ── */
      if (projectType === 'cabanon') {
        const snapshot = await capture3DForExport(materials, getBridge);
        await generateCabanonPDF(doc, {
          dims, materials, projectConfig, foundationType, slab, snapshot,
          budgetByStore, bestPrice,
        });
        doc.save(`cabanon-${dims.width}x${dims.depth}.pdf`);
        setStatus('done');
        setTimeout(() => setStatus('idle'), 2500);
        return;
      }

      /* ── Capture 3D générique (terrasse, pergola, clôture) ── */
      const snapshot = await captureCanvasSnapshot(getBridge);

      /* ── Branche pergola ── */
      if (projectType === 'pergola') {
        generatePergolaPDF(doc, {
          dims, materials, projectConfig,
          budgetByStore, bestPrice, snapshot,
        });
        doc.save(`pergola-${width}x${depth}m.pdf`);
        setStatus('done');
        setTimeout(() => setStatus('idle'), 2500);
        return;
      }

      /* ── Branche cloture ── */
      if (projectType === 'cloture') {
        generateCloturePDF(doc, {
          dims, materials, projectConfig,
          budgetByStore, bestPrice, snapshot,
        });
        doc.save(`cloture-${width}x${depth}m.pdf`);
        setStatus('done');
        setTimeout(() => setStatus('idle'), 2500);
        return;
      }

      /* ── Branche terrasse ── */
      generateTerrassePDF(doc, {
        dims, materials, foundationType, projectConfig,
        budgetByStore, bestPrice, snapshot,
      });

      doc.save(`terrasse-${width}x${depth}m.pdf`);
    } finally {
      setStatus('idle');
    }
  }

  const generating = status === 'generating';

  return (
    <>
      {showModal && (
        <EmailGateModal
          projectType={projectType}
          dims={dims}
          onConfirm={handleModalConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
      <button
        className="download-pdf"
        onClick={handleClick}
        disabled={generating}
        style={generating ? { opacity: 0.75, cursor: 'wait' } : undefined}
      >
        <span className="download-pdf-icon">{generating ? '\u23F3' : '\u2713'}</span>
        {generating ? 'Generation en cours...' : 'Telecharger la liste PDF'}
      </button>
    </>
  );
}
