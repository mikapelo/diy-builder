'use client';

/**
 * TimeEstimate.jsx — Estimation du temps + checklist chantier
 *
 * Affiché après BudgetComparator dans le tunnel résultats.
 * Contenu :
 *   - Deux jauges Solo / À deux avec nombre de jours
 *   - Planning week-end indicatif (étapes réparties sur les jours)
 *   - Bouton export checklist PDF (jsPDF, no réseau)
 */

import { useCallback } from 'react';
import { computeProjectTime } from '@/lib/projectTime';
import { usePDFChecklist } from '@/hooks/usePDFChecklist';

const TYPE_LABELS = {
  terrasse: 'terrasse',
  cabanon:  'cabanon',
  pergola:  'pergola',
  cloture:  'clôture',
};

/* ── Jauge Solo / Duo ── */
function TimeCard({ label, days, daysLabel, maxDays }) {
  const pct = Math.min(100, (days / maxDays) * 100);
  return (
    <div className="time-card">
      <div className="time-card-label">{label}</div>
      <div className="time-card-days">{daysLabel}</div>
      <div className="time-bar-track">
        <div className="time-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Planning week-end ── */
function WeekendPlan({ plan }) {
  if (!plan?.length) return null;
  return (
    <div className="weekend-plan">
      <p className="weekend-plan-title">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Planning indicatif
      </p>
      <div className="weekend-slots">
        {plan.map((slot) => (
          <div key={slot.moment} className="weekend-slot">
            <span className="weekend-slot-day">{slot.moment}</span>
            <ul className="weekend-slot-tasks">
              {slot.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Composant principal ── */
export default function TimeEstimate({ projectType, dims }) {
  const { width, depth, height, area } = dims ?? {};
  const time = computeProjectTime(projectType, width ?? 4, depth ?? 3, height);
  const { handleExportChecklist, checklistStatus } = usePDFChecklist();
  const maxDays = Math.max(time.soloDays, 4);

  const onDownload = useCallback(() => {
    handleExportChecklist(projectType, { width, depth, area }, time.weekendPlan);
  }, [projectType, width, depth, area, time.weekendPlan, handleExportChecklist]);

  const label = TYPE_LABELS[projectType] ?? 'projet';

  return (
    <div className="time-estimate-section">

      {/* Header */}
      <div className="time-estimate-header">
        <div className="time-estimate-title-row">
          <i className="ph-duotone ph-clock time-estimate-icon" aria-hidden="true" />
          <h3 className="time-estimate-title">Combien de temps pour cette {label} ?</h3>
        </div>
        <p className="time-estimate-subtitle">
          Estimation basée sur un bricoleur expérimenté, matériaux livrés, outillage prêt.
        </p>
      </div>

      {/* Jauges */}
      <div className="time-cards">
        <TimeCard
          label="Seul"
          days={time.soloDays}
          daysLabel={time.soloLabel}
          maxDays={maxDays}
        />
        <div className="time-cards-sep" aria-hidden="true">ou</div>
        <TimeCard
          label="À deux"
          days={time.duoDays}
          daysLabel={time.duoLabel}
          maxDays={maxDays}
        />
      </div>

      {/* CTA checklist */}
      <div className="time-checklist-cta">
        <div className="time-checklist-copy">
          <strong>Checklist chantier complète</strong>
          <span>Toutes les étapes avec cases à cocher — prêt à imprimer</span>
        </div>
        <button
          className="time-checklist-btn"
          onClick={onDownload}
          disabled={checklistStatus === 'generating'}
          aria-label="Télécharger la checklist PDF"
        >
          {checklistStatus === 'generating' ? (
            <>
              <span className="time-btn-spinner" aria-hidden="true" />
              Génération…
            </>
          ) : checklistStatus === 'done' ? (
            <>✓ Téléchargé</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Checklist PDF
            </>
          )}
        </button>
      </div>

    </div>
  );
}
