'use client';

/**
 * TunnelSections.jsx — Blocs résultats empilés verticalement
 *
 * 7 sections : Résumé → Matériaux → Budget → Temps → Outils → Actions → Lead artisan
 *
 * Extrait de DeckSimulator.jsx (Phase B — décomposition orchestrateur).
 */

import { useRef } from 'react';
import Link             from 'next/link';
import ProjectSummary   from './ProjectSummary';
import MaterialsList    from './MaterialsList';
import BudgetComparator from './BudgetComparator';
import TimeEstimate     from './TimeEstimate';
import ProjectTools     from './ProjectTools';
import ProjectActions   from './ProjectActions';
import { useScrollTunnel } from '@/hooks/useScrollTunnel';

const GUIDE_LINKS = {
  terrasse: { href: '/guides/terrasse', label: 'Guide complet : construire une terrasse bois',  desc: 'Choix du bois, calcul des lambourdes, étapes de pose, budget détaillé.' },
  cabanon:  { href: '/guides/cabanon',  label: 'Guide complet : construire un cabanon bois',    desc: 'Ossature DTU, montants, toiture mono-pente, réglementation.' },
  pergola:  { href: '/guides/pergola',  label: 'Guide complet : construire une pergola bois',   desc: 'Sections de bois, ancrage des poteaux, étapes de montage.' },
  cloture:  { href: '/guides/cloture',  label: 'Guide complet : poser une clôture bois',        desc: 'Poteaux, rails, lames, hauteurs réglementaires, budget.' },
};

export default function TunnelSections({
  projectType,
  dims,
  materials,
  area,
  slabTotal,
  onOpenSaveModal,
  onExportPDF,
  pdfStatus,
}) {
  const tunnelRef = useRef(null);
  useScrollTunnel(tunnelRef);

  return (
    <div className="sim-tunnel" ref={tunnelRef}>

      {/* 1. Résumé projet */}
      <section className="sim-tunnel-section">
        <ProjectSummary
          projectType={projectType}
          dims={dims}
          materials={materials}
        />
      </section>

      {/* 2. Matériaux */}
      <section className="sim-tunnel-section">
        <MaterialsList materials={materials} projectType={projectType} />
      </section>

      {/* 3. Budget & comparatif */}
      <section className="sim-tunnel-section">
        <BudgetComparator
          area={area}
          slabTotal={slabTotal}
          materials={materials}
          projectType={projectType}
        />
      </section>

      {/* 3.2 Temps de réalisation + checklist PDF */}
      <section className="sim-tunnel-section">
        <TimeEstimate
          projectType={projectType}
          dims={{ ...dims, height: materials?.height }}
        />
      </section>

      {/* 3.5 Outils recommandés (affiliation) */}
      <section className="sim-tunnel-section">
        <ProjectTools projectType={projectType} />
      </section>

      {/* 4. Pivot DIY / Pro — point de conversion */}
      <section className="sim-tunnel-section sim-tunnel-climax">
        <ProjectActions
          projectType={projectType}
          onOpenSaveModal={onOpenSaveModal}
          onExportPDF={onExportPDF}
          pdfStatus={pdfStatus}
        />
      </section>

      {/* 6. Guide contextuel — lien SEO vers le guide du module */}
      {GUIDE_LINKS[projectType] && (
        <section className="sim-tunnel-section">
          <div className="result-block guide-link-block">
            <div className="guide-link-body">
              <p className="guide-link-eyebrow">Aller plus loin</p>
              <p className="guide-link-title">{GUIDE_LINKS[projectType].label}</p>
              <p className="guide-link-desc">{GUIDE_LINKS[projectType].desc}</p>
            </div>
            <Link href={GUIDE_LINKS[projectType].href} className="guide-link-cta">
              Lire le guide
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
