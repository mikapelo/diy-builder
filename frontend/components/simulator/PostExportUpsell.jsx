'use client';

/**
 * PostExportUpsell.jsx — Étape proposée juste après le téléchargement du dossier
 *
 * Le flux PDF se terminait en cul-de-sac : la modale d'email se fermait, le
 * fichier partait, et plus rien. Or c'est la surface la plus fréquentée du
 * funnel — 28 exports contre 9 clics devis sur 28 jours (audit du 25/08) — et
 * la personne qui vient de télécharger un dossier chiffré est la mieux
 * qualifiée du site : elle a donné son email et a un projet dimensionné.
 *
 * Format volontairement déclenché par une action de l'utilisateur : aucun
 * risque d'interstitiel intempestif au sens des consignes Google, sur un site
 * dont tout le trafic est organique.
 *
 * Props :
 *   open        — boolean
 *   onDecline   — () => void   (« Non merci » : mémorisé pour la session)
 *   onAccept    — () => void   (ouvre ArtisanLeadModal, email pré-rempli)
 *   projectType — string
 *   dims        — { width, depth, area }
 */

import { useEffect, useRef } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';

const PROJECT_LABELS = {
  terrasse: 'Terrasse bois',
  cabanon:  'Cabanon ossature bois',
  pergola:  'Pergola bois',
  cloture:  'Clôture bois',
};

export default function PostExportUpsell({ open, onDecline, onAccept, projectType, dims }) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onDecline(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onDecline]);

  if (!open) return null;

  const label   = PROJECT_LABELS[projectType] ?? 'Projet bois';
  const dimsStr = dims ? `${dims.width} m × ${dims.depth} m` : '';

  return (
    <div className="modal-overlay" onClick={onDecline}>
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Dossier téléchargé"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onDecline} aria-label="Fermer">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <div className="artisan-modal-header-icon" style={{ background: '#EAF3EC', color: '#2B5D3A' }}>
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <h3 className="modal-title">Dossier téléchargé</h3>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle, #e5e2d8)', margin: '18px 0 0', paddingTop: 18 }}>
          <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: 'var(--text-1, #1a1c1b)' }}>
            Vous préférez le faire réaliser&nbsp;?
          </h4>
          <p className="modal-subtitle" style={{ margin: '0 0 14px', textAlign: 'left' }}>
            Votre dossier chiffré part avec la demande. Pas de nouvelle saisie&nbsp;:
            on garde l&apos;adresse que vous venez d&apos;indiquer.
          </p>

          {dimsStr && (
            <div className="modal-project-chip" style={{ marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>straighten</span>
              {label} — {dimsStr}
            </div>
          )}

          <button
            type="button"
            className="modal-btn modal-btn--primary"
            style={{ width: '100%' }}
            onClick={onAccept}
            autoFocus
          >
            Demander un devis gratuit
          </button>

          {/* Refus neutre, jamais culpabilisant — et mémorisé pour la session */}
          <button
            type="button"
            onClick={onDecline}
            style={{
              display: 'block', width: '100%', margin: '10px 0 0',
              background: 'none', border: 'none', cursor: 'pointer',
              font: 'inherit', fontSize: 13, color: 'var(--text-4, #9c9188)',
              textDecoration: 'underline', textUnderlineOffset: 3, padding: 6,
            }}
          >
            Non merci
          </button>
        </div>
      </div>
    </div>
  );
}
