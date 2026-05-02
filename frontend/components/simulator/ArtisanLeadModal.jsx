'use client';

/**
 * ArtisanLeadModal.jsx — Mise en relation artisan
 *
 * Formulaire : nom, téléphone (requis), code postal (requis), email, message.
 * Soumission → POST /api/artisan-lead → email Resend vers l'owner.
 *
 * Props :
 *   open         — boolean
 *   onClose      — () => void
 *   projectType  — string
 *   dims         — { width, depth, area }
 *   initialEmail — string (pré-remplit le champ email)
 */

import { useState, useEffect, useRef } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';
import { trackLeadSubmitted } from '@/hooks/useAnalytics.js';

const PROJECT_LABELS = {
  terrasse: 'Terrasse bois',
  cabanon:  'Cabanon ossature bois',
  pergola:  'Pergola bois',
  cloture:  'Clôture bois',
};

const INITIAL = { name: '', phone: '', zipCode: '', email: '', message: '' };

export default function ArtisanLeadModal({ open, onClose, projectType, dims, initialEmail = '' }) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  const [form,    setForm]    = useState({ ...INITIAL, email: initialEmail });
  const [status,  setStatus]  = useState('idle');   // idle | submitting | success | error
  const [errors,  setErrors]  = useState({});

  // Réinitialiser quand on ouvre
  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL, email: initialEmail });
      setStatus('idle');
      setErrors({});
    }
  }, [open, initialEmail]);

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.phone.trim() || form.phone.trim().length < 8) e.phone = 'Numéro requis';
    if (!form.zipCode.trim() || form.zipCode.trim().length < 4) e.zipCode = 'Code postal requis';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('submitting');
    setErrors({});
    try {
      const res = await fetch('/api/artisan-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectType, dims }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      trackLeadSubmitted({ module: projectType });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (!open) return null;

  const label    = PROJECT_LABELS[projectType] ?? 'Projet bois';
  const dimsStr  = dims ? `${dims.width} m × ${dims.depth} m` : '';
  const isLoading = status === 'submitting';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal-panel artisan-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mise en relation artisan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <span className="material-symbols-outlined">close</span>
        </button>

        {status === 'success' ? (
          /* ── État succès ── */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="artisan-modal-header-icon" style={{ background: '#EAF3EC', color: '#2B5D3A' }}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h3 className="modal-title">Demande envoyée !</h3>
            <p className="modal-subtitle" style={{ marginBottom: 24 }}>
              Nous reviendrons vers vous rapidement avec un artisan qualifié dans votre zone.
            </p>
            <button className="modal-btn modal-btn--primary" onClick={onClose} autoFocus>
              Fermer
            </button>
          </div>
        ) : (
          /* ── Formulaire ── */
          <>
            <div className="modal-header">
              <div className="artisan-modal-header-icon">
                <span className="material-symbols-outlined">engineering</span>
              </div>
              <h3 className="modal-title">Trouver un artisan</h3>
              <p className="modal-subtitle">
                Recevez des devis d&apos;artisans qualifiés dans votre zone.
              </p>
            </div>

            {/* Chip projet + dimensions */}
            {dimsStr && (
              <div className="modal-project-chip">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>straighten</span>
                {label} — {dimsStr}
              </div>
            )}

            {/* Bannière BOM inclus */}
            <div className="modal-bom-banner">
              <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0 }}>inventory_2</span>
              <span>
                L&apos;artisan recevra la <strong>liste de matériaux calculée</strong> et le budget estimé.
                Moins de temps perdu, devis plus précis.
              </span>
            </div>

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              {/* Nom */}
              <div className="modal-field">
                <label className="modal-label" htmlFor="alm-name">
                  Prénom et nom
                  <span className="modal-label-hint">(optionnel)</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined">person</span>
                  <input
                    id="alm-name"
                    className="modal-input"
                    type="text"
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={set('name')}
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="modal-field">
                <label className="modal-label" htmlFor="alm-phone">
                  Téléphone
                  <span className="modal-label-req">*</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined">call</span>
                  <input
                    id="alm-phone"
                    className={`modal-input${errors.phone ? ' modal-input--error' : ''}`}
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={form.phone}
                    onChange={set('phone')}
                    disabled={isLoading}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>
                {errors.phone && <span className="modal-error">{errors.phone}</span>}
              </div>

              {/* Code postal */}
              <div className="modal-field">
                <label className="modal-label" htmlFor="alm-zip">
                  Code postal
                  <span className="modal-label-req">*</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined">location_on</span>
                  <input
                    id="alm-zip"
                    className={`modal-input${errors.zipCode ? ' modal-input--error' : ''}`}
                    type="text"
                    placeholder="75000"
                    value={form.zipCode}
                    onChange={set('zipCode')}
                    disabled={isLoading}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={5}
                  />
                </div>
                {errors.zipCode && <span className="modal-error">{errors.zipCode}</span>}
              </div>

              {/* Email */}
              <div className="modal-field">
                <label className="modal-label" htmlFor="alm-email">
                  Email
                  <span className="modal-label-hint">(pour recevoir une confirmation)</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined">mail</span>
                  <input
                    id="alm-email"
                    className={`modal-input${errors.email ? ' modal-input--error' : ''}`}
                    type="email"
                    placeholder="jean@exemple.fr"
                    value={form.email}
                    onChange={set('email')}
                    disabled={isLoading}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
                {errors.email && <span className="modal-error">{errors.email}</span>}
              </div>

              {/* Message */}
              <div className="modal-field">
                <label className="modal-label" htmlFor="alm-message">
                  Précisions
                  <span className="modal-label-hint">(délai, type de sol, accès…)</span>
                </label>
                <textarea
                  id="alm-message"
                  className="modal-input"
                  placeholder="Ex : Terrasse en bois exotique, dalle béton existante, travaux souhaités en juin."
                  value={form.message}
                  onChange={set('message')}
                  disabled={isLoading}
                  rows={3}
                  style={{ resize: 'vertical', minHeight: 72, paddingLeft: 14 }}
                />
              </div>

              {status === 'error' && (
                <p style={{ fontSize: 13, color: '#d9534f', margin: '4px 0 0' }}>
                  Une erreur est survenue. Réessayez ou contactez-nous directement.
                </p>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  className="modal-btn modal-btn--outline"
                  onClick={onClose}
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="modal-btn modal-btn--primary"
                  disabled={isLoading}
                  style={{ flex: 2 }}
                >
                  {isLoading ? 'Envoi en cours…' : 'Envoyer ma demande'}
                </button>
              </div>

              <p style={{ fontSize: 11, color: 'var(--text-4, #9c9188)', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.5 }}>
                Vos coordonnées sont transmises uniquement à l&apos;artisan sélectionné. Aucun démarchage commercial.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
