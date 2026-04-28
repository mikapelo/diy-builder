'use client';

/**
 * SaveProjectModal.jsx — Modale de sauvegarde / capture email
 *
 * Déclenchée après création de valeur (post-simulation).
 * Capture email douce — pas de wording startup agressif.
 * Prête à brancher sur un backend futur (API endpoint placeholder).
 *
 * Props :
 *   open        — boolean
 *   onClose     — () => void
 *   projectType — string
 *   dims        — { width, depth, area }
 *   trigger     — 'save' | 'dossier' (contexte d'ouverture)
 */

import { useState, useEffect, useCallback, useRef, useId } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';

const TRIGGER_COPY = {
  save: {
    title: 'Conserver votre projet',
    subtitle: 'Recevez un récapitulatif complet par email pour le retrouver facilement.',
    cta: 'Recevoir mon projet',
    successTitle: 'Projet envoyé',
    successDesc: 'Vérifiez votre boîte de réception dans quelques instants.',
  },
  dossier: {
    title: 'Recevoir le dossier projet',
    subtitle: 'Recevez votre PDF 4 pages, liste de matériaux et comparatif prix directement par email.',
    cta: 'Recevoir le dossier',
    successTitle: 'Dossier envoyé',
    successDesc: 'Votre dossier projet arrive dans votre boîte mail.',
  },
  artisan: {
    title: 'Trouver un artisan local',
    subtitle: 'Recevez votre dossier complet et soyez mis en relation avec un artisan qualifié de votre région.',
    cta: 'Envoyer ma demande',
    successTitle: 'Demande envoyée',
    successDesc: 'Vous recevrez votre dossier PDF et serez contacté par un artisan sous 48h.',
  },
};

const PROJECT_NAMES = {
  terrasse: 'Terrasse bois',
  cabanon: 'Cabanon ossature bois',
  pergola: 'Pergola bois',
  cloture: 'Clôture bois',
};

export default function SaveProjectModal({ open, onClose, projectType, dims, trigger = 'save', onArtisanUpsell }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [consent, setConsent] = useState(false);

  const copy = TRIGGER_COPY[trigger] || TRIGGER_COPY.save;
  const projectName = PROJECT_NAMES[projectType] || 'Projet';

  // A11y : focus trap + restitution focus au declencheur
  const panelRef = useRef(null);
  const emailId = useId();
  const consentId = useId();
  useFocusTrap(open, panelRef);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStatus('idle');
      setEmail('');
      setConsent(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isValidEmail && consent && status === 'idle';

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('sending');

    // ── Placeholder API call ──
    // Replace with real endpoint when backend is available.
    // For now: simulate a short delay then show success.
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Future: POST /api/lead-capture
      // Payload : { email, projectType, dims, trigger, artisanRequested: trigger === 'artisan' }
      // const res = await fetch('/api/lead-capture', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, projectType, dims, trigger, artisanRequested: trigger === 'artisan' }),
      // });
      // if (!res.ok) throw new Error('Network error');

      setStatus('success');
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [canSubmit, email, projectType, dims, trigger]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <span className="material-symbols-outlined">close</span>
        </button>

        {status === 'success' ? (
          /* ── Success state ── */
          <div className="modal-success">
            <div className="modal-success-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h3 className="modal-success-title">{copy.successTitle}</h3>
            <p className="modal-success-desc">{copy.successDesc}</p>

            {/* Upsell artisan — visible uniquement après dossier DIY */}
            {trigger === 'dossier' && onArtisanUpsell && (
              <div className="spm-upsell-block">
                <div className="spm-upsell-header">
                  <span className="material-symbols-outlined spm-upsell-icon">handyman</span>
                  <div>
                    <p className="spm-upsell-title">Et si vous déléguez ?</p>
                    <p className="spm-upsell-sub">Un artisan qualifié reçoit votre dossier et vous rappelle sous 48h.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="spm-upsell-cta"
                  onClick={() => { onClose(); onArtisanUpsell(email); }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>send</span>
                  Trouver un artisan — gratuit
                </button>
              </div>
            )}

            <button className="modal-btn modal-btn--outline" onClick={onClose}>
              Fermer
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="modal-header">
              <div className="modal-header-icon">
                <span className="material-symbols-outlined">
                  {trigger === 'artisan' ? 'handyman' : trigger === 'dossier' ? 'folder_special' : 'bookmark'}
                </span>
              </div>
              <h3 className="modal-title">{copy.title}</h3>
              <p className="modal-subtitle">{copy.subtitle}</p>
            </div>

            {/* Project recap chip */}
            <div className="modal-project-chip">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {projectType === 'terrasse' ? 'deck' : projectType === 'cabanon' ? 'house' : projectType === 'pergola' ? 'balcony' : 'fence'}
              </span>
              <span>{projectName} — {dims.width} × {dims.depth} m</span>
            </div>

            {/* Bloc artisan — visible uniquement pour trigger 'artisan' */}
            {trigger === 'artisan' && (
              <div className="modal-artisan-info">
                <div className="modal-artisan-items">
                  {[
                    { icon: 'verified', label: 'Artisans qualifiés RGE / Qualibat' },
                    { icon: 'schedule', label: 'Devis de pose sous 48h' },
                    { icon: 'description', label: 'Votre dossier PDF transmis à l\'artisan' },
                  ].map(item => (
                    <div key={item.label} className="modal-artisan-item">
                      <span className="material-symbols-outlined modal-artisan-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-field">
                <label className="modal-label" htmlFor={emailId}>
                  Adresse email
                  <span className="modal-label-req" aria-hidden="true">*</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">mail</span>
                  <input
                    id={emailId}
                    type="email"
                    className="modal-input focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                    style={{ '--tw-ring-color': '#C9971E' }}
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => { e.target.style.boxShadow = '0 0 0 2px #C9971E'; e.target.style.borderColor = 'transparent'; }}
                    onBlur={(e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = ''; }}
                    autoFocus
                    autoComplete="email"
                    required
                    aria-required="true"
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              <label className="modal-consent" htmlFor={consentId}>
                <input
                  id={consentId}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={status === 'sending'}
                />
                <span>
                  J'accepte de recevoir ce récapitulatif par email.
                  Aucun spam, aucun partage.
                </span>
              </label>

              <button
                type="submit"
                className="modal-btn modal-btn--primary"
                disabled={!canSubmit || status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <span
                      className="material-symbols-outlined modal-btn-spin"
                      style={{ fontSize: 18, animation: 'dbSpin 1s linear infinite', display: 'inline-block' }}
                    >
                      progress_activity
                    </span>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                    {copy.cta}
                  </>
                )}
              </button>

              {status === 'error' && (
                <p
                  className="modal-error"
                  role="alert"
                  style={{ color: '#7A2E1A', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}

              <style jsx>{`
                @keyframes dbSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              `}</style>
            </form>

            <p className="modal-footer-note">
              Vos données restent confidentielles et ne sont jamais partagées.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
