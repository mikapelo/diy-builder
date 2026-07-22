'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArtisanLeadModal from '@/components/simulator/ArtisanLeadModal';
import { trackDevisClick } from '@/hooks/useAnalytics.js';

/**
 * CTALead — bloc de capture de leads pour les pages éditoriales.
 *
 * Deux chemins :
 *   • « Demander un devis gratuit » → ouvre ArtisanLeadModal DIRECTEMENT sur le
 *     guide (type projet déduit de projectHref) — capture sans détour simulateur,
 *     branche enfin devis-click + artisan-modal-open sur le trafic guides.
 *   • « Calculer {projectLabel} » → lien vers le simulateur (intention DIY).
 *
 * Si projectHref ne mappe aucun simulateur (ex. "/" ou un autre guide), on
 * retombe sur le simple lien historique — rétro-compatible, aucun appel à changer.
 *
 * Props :
 *   projectHref  — URL du simulateur cible (défaut '/').
 *   projectLabel — fragment intégré au libellé ("ma clôture", "ma terrasse"…).
 */

/* projectHref → type projet pour ArtisanLeadModal (null si pas de simulateur). */
const HREF_TO_TYPE = {
  '/calculateur': 'terrasse',
  '/cloture': 'cloture',
  '/pergola': 'pergola',
  '/cabanon': 'cabanon',
};

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function CTALead({ projectHref = '/', projectLabel = 'mon projet' }) {
  const [open, setOpen] = useState(false);
  const projectType = HREF_TO_TYPE[projectHref] || null;

  // Pas de simulateur identifié → comportement historique (simple lien).
  if (!projectType) {
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
          <ArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="content-cta-box">
        <p className="content-cta-box-label">Faire faire</p>
        <p className="content-cta-box-title">Vous préférez confier la réalisation ?</p>
        <p className="content-cta-box-desc">
          Recevez un devis gratuit et sans engagement pour votre projet —
          ou calculez-le vous-même.
        </p>
        <div className="content-cta-box-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => { trackDevisClick({ module: projectType }); setOpen(true); }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" />
            </svg>
            Demander un devis gratuit
          </button>
          <Link href={projectHref} className="content-cta-box-alt">
            ou calculer {projectLabel}
            <ArrowRight />
          </Link>
        </div>
      </div>
      <ArtisanLeadModal
        open={open}
        onClose={() => setOpen(false)}
        projectType={projectType}
        dims={null}
      />
    </>
  );
}
