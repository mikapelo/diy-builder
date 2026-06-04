'use client';

/**
 * ArtisanLeadModal.jsx — Demande de rappel pour la réalisation d'un projet
 *
 * Formulaire : nom, téléphone (requis), code postal (requis), email, message,
 * consentement explicite (requis). Soumission → POST /api/artisan-lead →
 * email Resend vers l'owner. DIY Builder recueille la demande ; aucune donnée
 * n'est transmise à un tiers sans accord explicite.
 *
 * Props :
 *   open         — boolean
 *   onClose      — () => void
 *   projectType  — string
 *   dims         — { width, depth, area }
 *   initialEmail — string (pré-remplit le champ email)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';
import { trackLeadSubmitted, trackArtisanModalOpen, trackArtisanModalAbandon } from '@/hooks/useAnalytics.js';

const PROJECT_LABELS = {
  terrasse: 'Terrasse bois',
  cabanon:  'Cabanon ossature bois',
  pergola:  'Pergola bois',
  cloture:  'Clôture bois',
};

const INITIAL = { name: '', phone: '', zipCode: '', email: '', message: '', consent: false };

export default function ArtisanLeadModal({ open, onClose, projectType, dims, initialEmail = '' }) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  const [form,    setForm]    = useState({ ...INITIAL, email: initialEmail });
  const [status,  setStatus]  = useState('idle');   // idle | submitting | success | error
  const [errors,  setErrors]  = useState({});

  // Réinitialiser quand on ouvre + tracker l'ouverture
  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL, email: initialEmail });
      setStatus('idle');
      setErrors({});
      trackArtisanModalOpen({ module: projectType });
    }
  }, [open, initialEmail, projectType]);

  // Handler de fermeture : tracker l'abandon si pas de submit succès
  const handleClose = useCallback(() => {
    // Capturer le status local : si pas 'success', c'est un abandon
    setStatus((current) => {
      if (current !== 'success') {
        trackArtisanModalAbandon({ module: projectType, stage: current });
      }
      return current;
    });
    onClose();
  }, [projectType, onClose]);

  // Fermer sur Escape (utilise handleClose pour tracker l'abandon)
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleClose]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setConsent = (e) => setForm((f) => ({ ...f, consent: e.target.checked }));

  function validate() {
    const e = {};
    if (!form.phone.trim() || form.phone.trim().length < 8) e.phone = 'Numéro requis';
    if (!form.zipCode.trim() || form.zipCode.trim().length < 4) e.zipCode = 'Code postal requis';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.consent) e.consent = 'Votre accord est nécessaire pour traiter la demande';
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
    <div className="modal-overlay" onClick={handleClose}>
      <div
        ref={panelRef}
        className="modal-panel artisan-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Demander un devis gratuit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer : si succès, ferme proprement (pas d'event abandon) ; sinon track abandon */}
        <button
          className="modal-close"
          onClick={status === 'success' ? onClose : handleClose}
          aria-label="Fermer"
        >
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
              DIY Builder ne réalise pas les travaux et ne garantit pas d&apos;intervention.
              Nous recueillons votre demande et revenons vers vous.
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
              <h3 className="modal-title">Demander un devis gratuit</h3>
              <p className="modal-subtitle">
                Transmettez votre projet calculé pour recevoir un devis, sans engagement.
              </p>
            </div>

            {/* Chip projet + dimensions */}
            {dimsStr && (
              <div className="modal-project-chip">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>straighten</span>
                {label} — {dimsStr}
              </div>
            )}

            {/* Bannière dossier projet */}
            <div className="modal-bom-banner">
              <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0 }}>inventory_2</span>
              <span>
                Votre <strong>dossier projet</strong> (matériaux, budget) accompagne votre demande.
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
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">call</span>
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
                    required
                    aria-required="true"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'alm-phone-err' : undefined}
                  />
                </div>
                {errors.phone && <span id="alm-phone-err" role="alert" className="modal-error">{errors.phone}</span>}
              </div>

              {/* Code postal */}
              <div className="modal-field">
                <label className="modal-label" htmlFor="alm-zip">
                  Code postal
                  <span className="modal-label-req">*</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">location_on</span>
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
                    required
                    aria-required="true"
                    aria-invalid={errors.zipCode ? 'true' : 'false'}
                    aria-describedby={errors.zipCode ? 'alm-zip-err' : undefined}
                  />
                </div>
                {errors.zipCode && <span id="alm-zip-err" role="alert" className="modal-error">{errors.zipCode}</span>}
              </div>

              {/* Email */}
              <div className="modal-field">
                <label className="modal-label" htmlFor="alm-email">
                  Email
                  <span className="modal-label-hint">(pour recevoir une confirmation)</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">mail</span>
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
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'alm-email-err' : undefined}
                  />
                </div>
                {errors.email && <span id="alm-email-err" role="alert" className="modal-error">{errors.email}</span>}
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

              {/* Consentement explicite — non précoché par défaut */}
              <div className="modal-field">
                <label
                  className="modal-consent"
                  htmlFor="alm-consent"
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, lineHeight: 1.5, color: 'var(--text-3, #6b6259)', cursor: 'pointer' }}
                >
                  <input
                    id="alm-consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={setConsent}
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-invalid={errors.consent ? 'true' : 'false'}
                    aria-describedby={errors.consent ? 'alm-consent-err' : undefined}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <span>
                    J&apos;accepte que mes coordonnées et les informations de mon projet
                    soient recueillies par DIY Builder afin d&apos;être recontacté(e) au sujet
                    de sa réalisation. Elles pourront, avec mon accord, être transmises à
                    un partenaire spécialisé.
                  </span>
                </label>
                {errors.consent && (
                  <span id="alm-consent-err" role="alert" className="modal-error">{errors.consent}</span>
                )}
              </div>

              {status === 'error' && (
                <p role="alert" aria-live="assertive" style={{ fontSize: 13, color: '#b91c1c', margin: '4px 0 0' }}>
                  Une erreur est survenue. Réessayez ou contactez-nous directement.
                </p>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  className="modal-btn modal-btn--outline"
                  onClick={handleClose}
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
                Vos coordonnées sont recueillies par DIY Builder et ne sont transmises à aucun
                tiers sans votre accord explicite. Aucun démarchage commercial.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
