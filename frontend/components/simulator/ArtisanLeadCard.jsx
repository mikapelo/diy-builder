'use client';

/**
 * ArtisanLeadCard.jsx — Bloc F : teaser mise en relation artisan
 *
 * Explique clairement :
 *   1. Ce qu'on demande dans le formulaire (nom, tél, code postal, contraintes)
 *   2. Ce qui se passe après la soumission (processus en 3 étapes)
 */

/* Ce qu'on demandera dans le formulaire */
const FORM_FIELDS = [
  { icon: 'ph-duotone ph-user', label: 'Nom, email, téléphone' },
  { icon: 'ph-duotone ph-map-pin', label: 'Code postal (secteur artisan)' },
  { icon: 'ph-duotone ph-chat-text', label: 'Contraintes, accès chantier, délai' },
];

/* Ce qui se passe après l'envoi */
const NEXT_STEPS = [
  { num: '1', label: 'Votre simulation est transmise à un artisan local qualifié' },
  { num: '2', label: 'Il vous contacte sous 24 – 48 h pour affiner le chiffrage' },
  { num: '3', label: 'Vous recevez un devis adapté à votre configuration exacte' },
];

export default function ArtisanLeadCard({ onRequestContact }) {
  return (
    <div className="artisan-lead-card">

      {/* En-tête */}
      <div className="artisan-lead-header">
        <div className="artisan-lead-icon-wrap">
          <i className="ph-duotone ph-hard-hat" aria-hidden="true" />
        </div>
        <div className="artisan-lead-meta">
          <h2 className="artisan-lead-title">Faire valider ou chiffrer ce projet</h2>
          <p className="artisan-lead-desc">
            Votre simulation est prête. Transmettez-la à un artisan local
            pour validation technique et devis personnalisé.
          </p>
        </div>
      </div>

      {/* Ce qu'on vous demandera */}
      <div className="artisan-lead-form-preview">
        <p className="artisan-lead-form-preview-label">Ce que le formulaire demande :</p>
        <div className="artisan-lead-form-fields">
          {FORM_FIELDS.map(f => (
            <span key={f.label} className="artisan-lead-form-field">
              <i className={`${f.icon}`} aria-hidden="true" />
              {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Ce qui se passe ensuite */}
      <div className="artisan-lead-steps">
        <p className="artisan-lead-steps-label">Ce qui se passe ensuite :</p>
        <div className="artisan-lead-steps-list">
          {NEXT_STEPS.map(s => (
            <div key={s.num} className="artisan-lead-step">
              <span className="artisan-lead-step-num">{s.num}</span>
              <span className="artisan-lead-step-text">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="artisan-lead-cta-zone">
        <button
          type="button"
          className="btn-primary"
          onClick={onRequestContact}
          style={{ width: '100%' }}
        >
          <i className="ph-bold ph-paper-plane-tilt" aria-hidden="true" />
          Envoyer ma demande
        </button>
        <p className="artisan-lead-reassurance">
          Gratuit et sans engagement — aucun démarchage commercial
        </p>
      </div>
    </div>
  );
}
