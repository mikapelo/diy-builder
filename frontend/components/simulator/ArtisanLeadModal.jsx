'use client';

/**
 * ArtisanLeadModal.jsx — Demande de rappel pour la réalisation d'un projet
 *
 * Formulaire : nom, téléphone (requis), code postal (requis), email, message,
 * consentement explicite (requis). Soumission → POST /api/artisan-lead →
 * email Resend vers l'owner + archivage Redis.
 *
 * Le consentement est recueilli AU MOMENT DE LA COLLECTE et porte sur la
 * transmission elle-même : la demande de devis n'a de sens que transmise à un
 * professionnel. Texte et version : @/lib/leadConsent (source unique).
 *
 * Props :
 *   open         — boolean
 *   onClose      — () => void
 *   projectType  — string
 *   dims         — { width, depth, area }
 *   initialEmail — string (pré-remplit le champ email)
 *   placement    — string : d'où vient le clic ('simulateur' | 'guide' |
 *                  'accueil' | 'post-pdf'). Archivé avec le lead, en plus de
 *                  l'événement Umami, pour que l'attribution reste lisible sans
 *                  recoupement manuel de session. Cf @/lib/leadSource.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';
import { trackLeadSubmitted, trackArtisanModalOpen, trackArtisanModalAbandon } from '@/hooks/useAnalytics.js';
import { CONSENT_VERSION, CONSENT_TEXT, CONSENT_GUARANTEE, PARTNERS_URL } from '@/lib/leadConsent';
import { readEntry, normalizePlacement } from '@/lib/leadSource';

const PROJECT_LABELS = {
  terrasse: 'Terrasse bois',
  cabanon:  'Cabanon ossature bois',
  pergola:  'Pergola bois',
  cloture:  'Clôture bois',
};

const INITIAL = { name: '', phone: '', zipCode: '', email: '', message: '', consent: false };

export default function ArtisanLeadModal({ open, onClose, projectType, dims, initialEmail = '', placement }) {
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);

  const [form,    setForm]    = useState({ ...INITIAL, email: initialEmail });
  const [status,  setStatus]  = useState('idle');   // idle | submitting | success | error
  const [errors,  setErrors]  = useState({});

  /* Un seul abandon compté par ouverture — sinon une fermeture suivie d'un
     `pagehide` en produirait deux. */
  const abandonSentRef = useRef(false);
  /* Miroir de `status` lisible depuis un écouteur natif, qui ne voit pas les
     re-rendus React. */
  const statusRef = useRef(status);
  statusRef.current = status;

  /* Les guides sans simulateur associé ouvrent la modale sans type de projet.
     Umami recevrait `undefined` — on nomme ce cas pour pouvoir l'isoler. */
  const trackModule = projectType ?? 'generique';

  // Réinitialiser quand on ouvre + tracker l'ouverture
  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL, email: initialEmail });
      setStatus('idle');
      setErrors({});
      abandonSentRef.current = false;
      trackArtisanModalOpen({ module: trackModule });
    }
  }, [open, initialEmail, trackModule]);

  const sendAbandon = useCallback((stage) => {
    if (abandonSentRef.current || stage === 'success') return;
    abandonSentRef.current = true;
    trackArtisanModalAbandon({ module: trackModule, stage });
  }, [trackModule]);

  // Handler de fermeture : tracker l'abandon si pas de submit succès
  const handleClose = useCallback(() => {
    // Capturer le status local : si pas 'success', c'est un abandon
    setStatus((current) => {
      sendAbandon(current);
      return current;
    });
    onClose();
  }, [sendAbandon, onClose]);

  /* Sortie sans fermer la modale — onglet fermé ou navigation.
     Sans ça, 5 sorties sur 7 restaient invisibles (audit CTA 25/08) : le
     compteur ne partait que sur croix, Échap ou clic sur le fond.
     `pagehide` et non `visibilitychange` : un simple changement d'onglet
     n'est pas un abandon. */
  useEffect(() => {
    if (!open) return;
    const onLeave = () => sendAbandon(statusRef.current);
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, [open, sendAbandon]);

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
    if (!form.consent) e.consent = 'Votre accord est nécessaire pour transmettre votre demande';
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
        // consentVersion : archivé côté serveur comme preuve du texte accepté
        // source : bouton d'origine + provenance de la session (@/lib/leadSource)
        body: JSON.stringify({
          ...form,
          projectType,
          dims,
          consentVersion: CONSENT_VERSION,
          source: { placement: normalizePlacement(placement), entry: readEntry() },
        }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      trackLeadSubmitted({ module: trackModule });
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
                {dims
                  ? 'Transmettez votre projet calculé pour recevoir un devis, sans engagement.'
                  : 'Recevez un devis pour votre projet, sans engagement.'}
              </p>
            </div>

            {/* Chip projet + dimensions */}
            {dimsStr && (
              <div className="modal-project-chip">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>straighten</span>
                {label} — {dimsStr}
              </div>
            )}

            {/* Bannière dossier projet — uniquement s'il existe vraiment.
                Ouverte depuis un guide, la modale n'a aucune dimension : annoncer
                un dossier joint était faux pour l'utilisateur comme pour l'artisan
                qui reçoit le lead (audit CTA du 25/08). */}
            <div className="modal-bom-banner">
              <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0 }}>
                {dims ? 'inventory_2' : 'edit_note'}
              </span>
              <span>
                {dims ? (
                  <>Votre <strong>dossier projet</strong> (matériaux, budget) accompagne votre demande.</>
                ) : (
                  <>Décrivez vos <strong>dimensions et contraintes</strong> ci-dessous&nbsp;: plus la
                  demande est précise, plus le devis le sera.</>
                )}
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
                  <span>{CONSENT_TEXT}</span>
                </label>
                {/* Lien hors du <label> : à l'intérieur, un clic cocherait la case. */}
                <a
                  href={PARTNERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', marginTop: 6, marginLeft: 28,
                    fontSize: 11, color: 'var(--text-3, #6b6259)', textDecoration: 'underline',
                  }}
                >
                  Qui reçoit ma demande&nbsp;?
                </a>
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
                {CONSENT_GUARANTEE}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
