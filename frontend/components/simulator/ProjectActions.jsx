'use client';

/**
 * ProjectActions.jsx — Pivot DIY / Pro
 *
 * Triggers modal :
 *   'dossier' — envoi PDF par email (email seul)
 *   'artisan' — formulaire complet (nom, tél, cp, message) → ArtisanLeadModal
 */

const DIY_INCLUDES = [
  { icon: 'picture_as_pdf', label: 'PDF 4 pages (plans + coupes)' },
  { icon: 'inventory_2',    label: 'Liste de matériaux complète' },
  { icon: 'payments',       label: 'Comparatif prix 3 enseignes' },
];

const PRO_INCLUDES = [
  { icon: 'picture_as_pdf', label: 'Même dossier PDF transmis à l\'artisan' },
  { icon: 'location_on',    label: 'Artisan qualifié de votre secteur' },
  { icon: 'schedule',       label: 'Contact sous 24 – 48 h, devis sur mesure' },
];

/* Ce que le formulaire artisan demandera */
const PRO_FORM_PREVIEW = [
  'Nom & email',
  'Téléphone',
  'Code postal',
  'Vos contraintes',
];

export default function ProjectActions({ projectType, onOpenSaveModal, onExportPDF, pdfStatus }) {
  const generating = pdfStatus === 'generating';
  return (
    <div className="result-block pa-pivot-block">
      <div className="result-block-header">
        <div>
          <h2 className="result-block-title">Votre projet est chiffré</h2>
          <p className="result-block-subtitle">
            Recevez votre dossier complet — choisissez comment vous voulez avancer.
          </p>
        </div>
      </div>

      <div className="pa-pivot-grid">

        {/* ── Carte A : DIY ── */}
        <div className="pa-pivot-card pa-pivot-card--diy">
          <div className="pa-pivot-card-header">
            <span className="pa-pivot-card-icon material-symbols-outlined">build</span>
            <div>
              <h3 className="pa-pivot-card-title">Je le fais moi-même</h3>
              <p className="pa-pivot-card-sub">Le dossier arrive dans votre boîte mail</p>
            </div>
          </div>

          <ul className="pa-pivot-includes">
            {DIY_INCLUDES.map(item => (
              <li key={item.label} className="pa-pivot-include">
                <span className="material-symbols-outlined pa-pivot-include-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="pa-pivot-cta pa-pivot-cta--diy"
            onClick={() => onOpenSaveModal('dossier')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>mail</span>
            Recevoir le dossier
          </button>

          {onExportPDF && (
            <button
              type="button"
              className="download-pdf"
              onClick={onExportPDF}
              disabled={generating}
              style={{ marginTop: 10, ...(generating ? { opacity: 0.75, cursor: 'wait' } : null) }}
              aria-busy={generating}
            >
              <span className="download-pdf-icon" aria-hidden="true">
                {generating ? '⏳' : '✓'}
              </span>
              {generating ? 'Génération en cours…' : 'Télécharger la liste PDF'}
            </button>
          )}
        </div>

        {/* ── Carte B : Pro ── */}
        <div className="pa-pivot-card pa-pivot-card--pro">
          <div className="pa-pivot-card-badge">Recommandé</div>
          <div className="pa-pivot-card-header">
            <span className="pa-pivot-card-icon material-symbols-outlined">handyman</span>
            <div>
              <h3 className="pa-pivot-card-title">Je le confie à un artisan</h3>
              <p className="pa-pivot-card-sub">Dossier + mise en relation locale</p>
            </div>
          </div>

          <ul className="pa-pivot-includes">
            {PRO_INCLUDES.map(item => (
              <li key={item.label} className="pa-pivot-include">
                <span className="material-symbols-outlined pa-pivot-include-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          {/* Aperçu des champs du formulaire */}
          <div className="pa-pivot-form-preview">
            <span className="pa-pivot-form-preview-label">Le formulaire demande :</span>
            <div className="pa-pivot-form-fields">
              {PRO_FORM_PREVIEW.map(f => (
                <span key={f} className="pa-pivot-form-field">{f}</span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="pa-pivot-cta pa-pivot-cta--pro"
            onClick={() => onOpenSaveModal('artisan')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>send</span>
            Demander une mise en relation
          </button>
        </div>

      </div>

      <p className="pa-pivot-reassurance">
        Gratuit et sans engagement — vos coordonnées restent confidentielles
      </p>
    </div>
  );
}
