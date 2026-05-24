import Link from 'next/link';

/**
 * CTALead — bloc de capture de leads pour les pages éditoriales.
 *
 * Pas un formulaire en soi — un teaser qui ramène au simulateur, où le
 * formulaire complet (ArtisanLeadModal) est branché. Le visiteur calcule
 * son projet, puis peut demander à être recontacté.
 *
 * Props :
 *   projectHref  — URL du simulateur cible (par défaut '/' pour les pages
 *                  sans projet identifié comme /guides ou /faq).
 *   projectLabel — fragment de phrase intégré au libellé du bouton
 *                  ("Calculer ma terrasse", "Calculer mon cabanon"…).
 *
 * Réutilise la classe `content-cta-box` partagée par les guides — aucun
 * CSS nouveau, intégration drop-in.
 */
export default function CTALead({ projectHref = '/', projectLabel = 'mon projet' }) {
  return (
    <div className="content-cta-box">
      <p className="content-cta-box-label">Faire faire</p>
      <p className="content-cta-box-title">Vous préférez confier la réalisation ?</p>
      <p className="content-cta-box-desc">
        Calculez votre projet en quelques minutes — vous pourrez ensuite
        être recontacté(e) pour étude par un professionnel.
      </p>
      <Link href={projectHref} className="btn-primary">
        Calculer {projectLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      </Link>
    </div>
  );
}
