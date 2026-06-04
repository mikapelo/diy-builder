'use client';

/**
 * ProjectActions.jsx — Pivot DIY / Pro
 *
 * Triggers modal :
 *   'dossier' — envoi PDF par email (email seul)
 *   'artisan' — formulaire complet (nom, tél, cp, message) → ArtisanLeadModal
 */

import Link from 'next/link';
import { trackDevisClick } from '@/hooks/useAnalytics.js';

const DIY_INCLUDES = [
  { icon: 'picture_as_pdf', label: 'PDF 4 pages (plans + coupes)' },
  { icon: 'inventory_2',    label: 'Liste de matériaux complète' },
  { icon: 'payments',       label: 'Comparatif prix 4 enseignes' },
];

const PRO_INCLUDES = [
  { icon: 'picture_as_pdf', label: 'Votre projet calculé transmis' },
  { icon: 'description',    label: 'Dossier PDF inclus' },
  { icon: 'verified_user',  label: 'Sans engagement' },
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

        </div>

        {/* ── Carte B : Pro ── */}
        <div className="pa-pivot-card pa-pivot-card--pro">
          <div className="pa-pivot-card-badge">Recommandé</div>
          <div className="pa-pivot-card-header">
            <span className="pa-pivot-card-icon material-symbols-outlined">handyman</span>
            <div>
              <h3 className="pa-pivot-card-title">Confier la réalisation à un professionnel</h3>
              <p className="pa-pivot-card-sub">On recueille votre demande</p>
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
            onClick={() => {
              trackDevisClick({ module: projectType });
              onOpenSaveModal('artisan');
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>send</span>
            Demander un devis gratuit
          </button>

          <p className="pa-pivot-rgpd">
            En envoyant ce formulaire, vous acceptez d&rsquo;être recontacté au sujet de votre projet.
            Si vous choisissez l&rsquo;option professionnel, vos informations peuvent être transmises
            à un partenaire de mise en relation travaux ou à un professionnel compatible avec votre
            demande. Vous pouvez demander la suppression de vos données à tout moment via{' '}
            <Link href="/contact">notre page contact</Link>. Voir aussi notre{' '}
            <Link href="/politique-confidentialite">politique de confidentialité</Link>.
          </p>
        </div>

      </div>

      <p className="pa-pivot-reassurance">
        Gratuit et sans engagement — vos coordonnées restent confidentielles
      </p>
    </div>
  );
}
