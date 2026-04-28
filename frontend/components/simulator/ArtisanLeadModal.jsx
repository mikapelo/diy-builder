'use client';

/**
 * ArtisanLeadModal.jsx — Modale de demande de mise en relation artisan
 *
 * Phase 1 — Champs enrichis :
 *   name     (obligatoire) — prénom + nom, personnalise le lead côté artisan
 *   timeline (select)      — délai souhaité, permet à l'artisan de prioriser
 *   budget   (select)      — fourchette budget global, pré-sélectionné selon dims.area
 *   bom      (prop)        — payload BOM complet transmis à l'API (non visible utilisateur)
 *
 * Props :
 *   open        — boolean
 *   onClose     — () => void
 *   projectType — string
 *   dims        — { width, depth, area }
 *   bom         — object  (matériaux calculés par l'engine)
 */

import { useState, useEffect, useCallback, useMemo, useRef, useId } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';

const PROJECT_NAMES = {
  terrasse: { label: 'Terrasse bois',         icon: 'deck' },
  cabanon:  { label: 'Cabanon ossature bois', icon: 'house' },
  pergola:  { label: 'Pergola bois',          icon: 'balcony' },
  cloture:  { label: 'Clôture bois',          icon: 'fence' },
};

const TIMELINE_OPTIONS = [
  { value: '',         label: '— Choisir —' },
  { value: 'urgent',   label: 'Dès que possible' },
  { value: '1-3mois',  label: 'Dans 1 à 3 mois' },
  { value: '3-6mois',  label: 'Dans 3 à 6 mois' },
  { value: 'flexible', label: 'Pas de date précise' },
];

const BUDGET_OPTIONS = [
  { value: '',       label: '— Choisir —' },
  { value: '<2k',    label: 'Moins de 2 000 €' },
  { value: '2k-5k',  label: '2 000 – 5 000 €' },
  { value: '5k-10k', label: '5 000 – 10 000 €' },
  { value: '>10k',   label: 'Plus de 10 000 €' },
];

function guessBudget(area) {
  if (!area) return '';
  if (area < 10)  return '<2k';
  if (area < 25)  return '2k-5k';
  if (area < 50)  return '5k-10k';
  return '>10k';
}

export default function ArtisanLeadModal({ open, onClose, projectType, dims, bom, initialEmail = '' }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [zipCode, setZipCode] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget]   = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error

  const project = PROJECT_NAMES[projectType] || { label: 'Projet', icon: 'build' };

  // A11y : focus trap + ids uniques pour labels htmlFor
  const panelRef = useRef(null);
  useFocusTrap(open, panelRef);
  const nameId     = useId();
  const emailId    = useId();
  const phoneId    = useId();
  const zipId      = useId();
  const timelineId = useId();
  const budgetId   = useId();
  const messageId  = useId();
  const consentId  = useId();

  // Reset à l'ouverture — pré-remplir budget depuis dims.area + email depuis upsell
  useEffect(() => {
    if (open) {
      setName('');
      setEmail(initialEmail || '');
      setPhone('');
      setZipCode('');
      setTimeline('');
      setBudget(guessBudget(dims?.area));
      setMessage('');
      setConsent(false);
      setStatus('idle');
    }
  }, [open, dims?.area, initialEmail]);

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = name.trim().length > 1 && isValidEmail && consent && status === 'idle';

  // Payload complet transmis à l'API (artisan reçoit le BOM en plus des coordonnées)
  const payload = useMemo(() => ({
    name, email, phone, zipCode, timeline, budget, message,
    projectType,
    dims,
    bom: bom ?? null,
    submittedAt: new Date().toISOString(),
  }), [name, email, phone, zipCode, timeline, budget, message, projectType, dims, bom]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('sending');
    try {
      // Placeholder — remplacer par POST /api/artisan-lead (Phase 2 backend)
      await new Promise(resolve => setTimeout(resolve, 1400));
      // const res = await fetch('/api/artisan-lead', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error('Network error');
      setStatus('success');
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [canSubmit, payload]);

  const focusStyle  = { boxShadow: '0 0 0 2px #C9971E', borderColor: 'transparent' };
  const blurStyle   = { boxShadow: '', borderColor: '' };
  const inputEvents = {
    onFocus: (e) => Object.assign(e.target.style, focusStyle),
    onBlur:  (e) => Object.assign(e.target.style, blurStyle),
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal-panel artisan-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Demande de mise en relation artisan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <span className="material-symbols-outlined">close</span>
        </button>

        {status === 'success' ? (
          /* ── État succès ── */
          <div className="modal-success">
            <div
              className="artisan-success-icon"
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#EAF3EC', border: '1px solid #C8E0CF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#2B5D3A' }}>task_alt</span>
            </div>
            <h3 className="modal-success-title">Demande envoyée</h3>
            <p className="modal-success-desc">
              Votre projet et vos coordonnées ont été transmis.
              Un professionnel qualifié de votre secteur vous contactera prochainement.
            </p>
            <button className="modal-btn modal-btn--outline" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          /* ── État formulaire ── */
          <>
            <div className="modal-header">
              <div className="artisan-modal-header-icon">
                <span className="material-symbols-outlined">engineering</span>
              </div>
              <h3 className="modal-title">Demander une mise en relation</h3>
              <p className="modal-subtitle">
                Un artisan qualifié reçoit votre simulation complète et vous rappelle.
              </p>
            </div>

            {/* Récap projet */}
            <div className="modal-project-chip">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{project.icon}</span>
              <span>{project.label} — {dims.width} × {dims.depth} m</span>
            </div>

            {/* Bandeau BOM inclus */}
            <div className="modal-bom-banner">
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#2B5D3A' }}>receipt_long</span>
              <span>Votre simulation est jointe&nbsp;: dimensions, liste matériaux, budget estimé</span>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>

              {/* Prénom + Nom — obligatoire */}
              <div className="modal-field">
                <label className="modal-label" htmlFor={nameId}>
                  Prénom et nom
                  <span className="modal-label-req" aria-hidden="true">*</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">person</span>
                  <input
                    id={nameId}
                    type="text"
                    className="modal-input"
                    {...inputEvents}
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    autoComplete="name"
                    required
                    aria-required="true"
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Email — obligatoire */}
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
                    className="modal-input"
                    {...inputEvents}
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    aria-required="true"
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Téléphone — recommandé */}
              <div className="modal-field">
                <label className="modal-label" htmlFor={phoneId}>
                  Téléphone
                  <span className="modal-label-hint modal-label-hint--recommended">Recommandé</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">phone</span>
                  <input
                    id={phoneId}
                    type="tel"
                    className="modal-input"
                    {...inputEvents}
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Code postal — recommandé pour matching géographique */}
              <div className="modal-field">
                <label className="modal-label" htmlFor={zipId}>
                  Code postal
                  <span className="modal-label-hint modal-label-hint--recommended">Pour votre secteur</span>
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">location_on</span>
                  <input
                    id={zipId}
                    type="text"
                    className="modal-input"
                    {...inputEvents}
                    placeholder="75001"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={5}
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Ligne budget + délai côte à côte */}
              <div className="modal-row-two">
                {/* Délai souhaité */}
                <div className="modal-field">
                  <label className="modal-label" htmlFor={timelineId}>
                    Délai souhaité
                    <span className="modal-label-hint">(facultatif)</span>
                  </label>
                  <div className="modal-input-wrap modal-input-wrap--select">
                    <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">schedule</span>
                    <select
                      id={timelineId}
                      className="modal-input modal-select"
                      {...inputEvents}
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      disabled={status === 'sending'}
                    >
                      {TIMELINE_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget estimé */}
                <div className="modal-field">
                  <label className="modal-label" htmlFor={budgetId}>
                    Budget estimé
                    <span className="modal-label-hint">(facultatif)</span>
                  </label>
                  <div className="modal-input-wrap modal-input-wrap--select">
                    <span className="modal-input-icon material-symbols-outlined" aria-hidden="true">payments</span>
                    <select
                      id={budgetId}
                      className="modal-input modal-select"
                      {...inputEvents}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      disabled={status === 'sending'}
                    >
                      {BUDGET_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Message libre — facultatif */}
              <div className="modal-field">
                <label className="modal-label" htmlFor={messageId}>
                  Votre besoin
                  <span className="modal-label-hint">(facultatif)</span>
                </label>
                <div className="modal-input-wrap artisan-textarea-wrap">
                  <span className="modal-input-icon material-symbols-outlined" aria-hidden="true" style={{ alignSelf: 'flex-start', marginTop: 2 }}>chat</span>
                  <textarea
                    id={messageId}
                    className="modal-input artisan-textarea"
                    {...inputEvents}
                    placeholder="Précisez votre projet, contraintes, accès chantier…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Consentement */}
              <label className="modal-consent" htmlFor={consentId}>
                <input
                  id={consentId}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={status === 'sending'}
                />
                <span>
                  J&apos;accepte d&apos;être recontacté par un professionnel qualifié
                  au sujet de ce projet. Aucun démarchage commercial.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="modal-btn modal-btn--primary"
                disabled={!canSubmit || status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <span
                      className="material-symbols-outlined modal-btn-spin"
                      style={{ fontSize: 18, animation: 'alSpin 1s linear infinite', display: 'inline-block' }}
                    >
                      progress_activity
                    </span>
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                    Envoyer ma demande
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
                @keyframes alSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              `}</style>
            </form>

            <p className="modal-footer-note">
              Vos coordonnées restent confidentielles. Aucune donnée n&apos;est partagée
              sans votre accord explicite.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
