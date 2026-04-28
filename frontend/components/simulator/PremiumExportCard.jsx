'use client';

/**
 * PremiumExportCard.jsx — Carte dossier projet enrichi
 *
 * Préfigure un export plus complet que le PDF standard :
 * synthèse, budget, comparaison, plans — dans un document partageable.
 *
 * Déclenche la modale de capture email au clic (trigger='dossier').
 * Ne crée pas de logique moteur — pure surcouche UX.
 */

const DOSSIER_FEATURES = [
  { icon: 'ph-duotone ph-file-text',  label: 'Synthèse projet complète' },
  { icon: 'ph-duotone ph-package',    label: 'Liste de matériaux détaillée' },
  { icon: 'ph-duotone ph-currency-eur', label: 'Budget comparatif par enseigne' },
  { icon: 'ph-duotone ph-share-network', label: 'Format partageable par email' },
];

export default function PremiumExportCard({ onClick }) {
  return (
    <div
      className="premium-export-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Recevoir le dossier projet complet par email"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #C9971E, 0 8px 24px rgba(201, 151, 30, 0.12)'; }}
      onBlur={(e)  => { e.currentTarget.style.boxShadow = ''; }}
      style={{ cursor: 'pointer', transition: 'box-shadow 0.18s ease, transform 0.18s ease' }}
    >
      <div className="premium-export-header">
        <div className="premium-export-icon-wrap">
          <i className="ph-duotone ph-folder-notch" aria-hidden="true" />
        </div>
        <div className="premium-export-meta">
          <h3 className="premium-export-title">Dossier projet complet</h3>
          <p className="premium-export-desc">
            Recevez une synthèse complète de votre projet par email
          </p>
        </div>
        <span
          className="premium-export-badge"
          style={{
            background: '#EAF3EC',
            color: '#2B5D3A',
            border: '1px solid #C8E0CF',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: 999,
          }}
        >
          Gratuit
        </span>
      </div>

      <div className="premium-export-features">
        {DOSSIER_FEATURES.map(f => (
          <div key={f.label} className="premium-export-feature">
            <i className={`${f.icon} premium-export-feature-icon`} aria-hidden="true" />
            <span className="premium-export-feature-label">{f.label}</span>
          </div>
        ))}
      </div>

      <div className="premium-export-cta-zone">
        <span className="btn-primary" style={{ width: '100%' }}>
          <i className="ph-bold ph-envelope-simple" aria-hidden="true" />
          Recevoir le dossier
        </span>
      </div>
    </div>
  );
}
