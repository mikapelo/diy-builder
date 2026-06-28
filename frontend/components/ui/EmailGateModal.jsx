'use client';
import { useState, useEffect, useRef, useId } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';

/**
 * EmailGateModal — Capture email avant téléchargement PDF
 *
 * Props:
 *   projectType  string   — 'terrasse' | 'cabanon' | 'pergola' | 'cloture'
 *   dims         object   — { width, depth }
 *   onConfirm    fn(email) — appelé après validation
 *   onClose      fn()      — appelé si l'utilisateur ferme sans valider
 */
export default function EmailGateModal({ projectType, dims, onConfirm, onClose, defaultEmail = '' }) {
  const [email, setEmail]   = useState(defaultEmail);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const panelRef = useRef(null);
  const submittedRef = useRef(false);   // garde anti double-soumission (synchrone)
  const titleId = useId();
  const descId = useId();
  const errId = useId();

  // Focus trap WCAG SC 2.4.3 (audit a11y)
  useFocusTrap(true, panelRef);

  // Escape pour fermer (audit a11y)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const PROJECT_LABELS = {
    terrasse: 'Terrasse', cabanon: 'Cabanon',
    pergola: 'Pergola',   cloture: 'Clôture',
  };
  const label = PROJECT_LABELS[projectType] ?? projectType;

  /* Le POST vers /api/leads (avec le PDF en pièce jointe) est effectué UNE seule
     fois par usePDFExport, après génération du PDF. Cette modale se contente de
     valider l'email puis de déléguer via onConfirm. Un POST ici dupliquait le
     lead Redis, l'email de confirmation et la notification owner — et envoyait
     même un premier email sans le PDF (bug double-write). */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse email invalide');
      return;
    }

    if (submittedRef.current) return;   // anti double-soumission (le PDF se génère déjà)
    submittedRef.current = true;
    setLoading(true);

    localStorage.setItem('diy_lead_email', email);
    onConfirm(email);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,28,27,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '24px',
        animation: 'modalFadeIn .2s ease-out',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div ref={panelRef} style={{
        position: 'relative',
        background: 'white',
        borderRadius: '20px',
        padding: '32px 28px',
        maxWidth: '400px', width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,.10)',
        animation: 'modalSlideUp .25s ease-out',
      }}>
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '8px',
            border: 'none', background: '#f4f3f1',
            cursor: 'pointer', fontSize: '18px', color: '#66625a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        {/* Icon */}
        <div aria-hidden="true" style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: '#FFF8E1', border: '1px solid rgba(201,151,30,.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: '26px',
        }}>📋</div>

        {/* Header */}
        <h2 id={titleId} style={{
          textAlign: 'center', fontSize: '19px', fontWeight: 800,
          color: '#111214', fontFamily: 'Manrope, sans-serif',
          letterSpacing: '-0.03em', margin: '0 0 8px',
        }}>
          Recevoir votre devis {label}
        </h2>
        <p id={descId} style={{
          textAlign: 'center', fontSize: '13px', color: '#66625a',
          fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
          margin: '0 0 24px',
        }}>
          Entrez votre email pour télécharger la liste de matériaux
          {dims ? ` (${dims.width} × ${dims.depth} m)` : ''}.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            aria-label="Adresse email"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errId : undefined}
            autoFocus
            required
            style={{
              width: '100%', padding: '12px 14px',
              border: error ? '1.5px solid #b91c1c' : '1.5px solid #e5e2d8',
              borderRadius: '10px', fontSize: '15px',
              fontFamily: 'Inter, sans-serif', color: '#111214',
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color .15s',
            }}
          />
          {error && (
            <p id={errId} role="alert" style={{ fontSize: '12px', color: '#b91c1c', margin: 0, fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px 20px',
              background: loading ? '#d4a84e' : '#C9971E',
              border: '2px solid #A07A14',
              borderRadius: '10px', color: '#1A1200',
              fontSize: '14px', fontWeight: 700,
              fontFamily: 'Manrope, sans-serif',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'background .15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? '⏳ Envoi...' : '⬇️ Télécharger mon devis PDF'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', fontSize: '11px', color: '#6b5f4f',
          fontFamily: 'Inter, sans-serif', margin: '12px 0 0', lineHeight: 1.4,
        }}>
          Pas de spam. Vous recevrez aussi une copie par email.
        </p>
      </div>
    </div>
  );
}
