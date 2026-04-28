'use client';

/**
 * SaveProjectModal.jsx — Modale sauvegarde projet
 *
 * Fonctionnalité pas encore disponible.
 * Affiche un message honnête au lieu d'un faux succès.
 *
 * Props :
 *   open        — boolean
 *   onClose     — () => void
 *   projectType — string
 *   dims        — { width, depth, area }
 *   trigger     — 'save' | 'dossier' (non utilisé pour l'instant)
 *   onArtisanUpsell — () => void (non utilisé pour l'instant)
 */

import { useEffect, useRef } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';

export default function SaveProjectModal({ open, onClose, projectType, dims, trigger = 'save', onArtisanUpsell }) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Sauvegarde projet — bientôt disponible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="modal-header">
          <div className="modal-header-icon">
            <span className="material-symbols-outlined">bookmark</span>
          </div>
          <h3 className="modal-title">Bientôt disponible</h3>
          <p className="modal-subtitle">
            La sauvegarde de projets sera disponible prochainement.
          </p>
        </div>

        <p style={{ padding: '0 0 16px', fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary, #555)' }}>
          En attendant, tu peux exporter ton plan en PDF pour le garder et
          le partager facilement.
        </p>

        <button className="modal-btn modal-btn--outline" onClick={onClose} autoFocus>
          Fermer
        </button>
      </div>
    </div>
  );
}
