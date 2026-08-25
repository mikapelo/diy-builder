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
 *     guide (type projet déduit de projectHref) — capture sans détour simulateur.
 *   • « Calculer {projectLabel} » → lien vers le simulateur (intention DIY).
 *
 * Quand projectHref ne mappe aucun simulateur (« / » ou un autre guide), la
 * modale s'ouvre quand même, sans type de projet — `ArtisanLeadModal` retombe
 * sur « Projet bois » et l'API neutralise le champ. Jusqu'au 25/08/2026 ces
 * pages-là n'affichaient qu'un lien : `/guides`, `/guides/soi-meme-ou-pro` et
 * `/guides/comparer-devis-travaux` n'avaient donc AUCUN CTA devis fonctionnel,
 * alors que ce sont les pages à plus forte intention « confier à un pro ».
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
  // Sans simulateur associé, le lien secondaire renvoie à l'accueil qui les liste
  const altHref = projectType ? projectHref : '/';
  /* Même libellé que dans ArtisanLeadModal : les deux événements servent de
     détecteur de décrochage clic → modale, ils doivent rester comparables. */
  const trackModule = projectType ?? 'generique';

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
            onClick={() => { trackDevisClick({ module: trackModule }); setOpen(true); }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" />
            </svg>
            Demander un devis gratuit
          </button>
          <Link href={altHref} className="content-cta-box-alt">
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
