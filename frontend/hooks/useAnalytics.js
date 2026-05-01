'use client';

/**
 * useAnalytics — Hook Umami custom events
 *
 * Safe : window.umami peut ne pas exister en dev/SSR/adblocker.
 * L'API custom events Umami se déclenche via :
 *   window.umami?.track('nom-event', { key: value })
 *
 * Exports :
 *   trackEvent(name, props)       — fonction générique
 *   trackOutboundClick(props)     — event 1 : outbound-click
 *   trackPDFExport(props)         — event 2 : pdf-export
 *   trackDevisClick(props)        — event 3 : devis-click
 *   trackModuleSelected(props)    — event 4 : module-selected
 *   trackSimulationStart(props)   — event 5 : simulation-start
 *   trackViewModeChange(props)    — event 6 : view-mode-change
 *   trackAffiliateClick(props)    — event 7 : affiliate-click
 *   trackLeadSubmitted(props)     — event 8 : lead-submitted
 */

/**
 * Fonction générique — safe côté SSR et si Plausible n'est pas chargé.
 *
 * @param {string} name  — Nom de l'event Plausible
 * @param {object} props — Propriétés custom (key/value)
 */
export function trackEvent(name, props = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.umami?.track !== 'function') return;
  window.umami.track(name, props);
}

/** Event 1 — outbound-click : clic "Voir l'offre" dans BudgetComparator
 *  @param {{ store: string, project: string, url?: string }} props */
export function trackOutboundClick({ store, project, url = '' }) {
  trackEvent('outbound-click', { store, project, url });
}

/** Event 2 — pdf-export : génération PDF via usePDFExport
 *  @param {{ module: string }} props */
export function trackPDFExport({ module }) {
  trackEvent('pdf-export', { module });
}

/** Event 3 — devis-click : clic "Demander une mise en relation"
 *  @param {{ module: string }} props */
export function trackDevisClick({ module }) {
  trackEvent('devis-click', { module });
}

/** Event 4 — module-selected : changement de module dans ProjectSwitch
 *  @param {{ module: string }} props */
export function trackModuleSelected({ module }) {
  trackEvent('module-selected', { module });
}

/** Event 5 — simulation-start : premier rendu actif du simulateur
 *  À appeler une seule fois par session grâce à sessionStorage.
 *  @param {{ module: string, width: number, depth: number }} props */
export function trackSimulationStart({ module, width, depth }) {
  if (typeof window === 'undefined') return;
  const key = `sim_started_${module}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  trackEvent('simulation-start', { module, width: String(width), depth: String(depth) });
}

/** Event 6 — view-mode-change : changement de mode 3D
 *  @param {{ module: string, mode: string }} props */
export function trackViewModeChange({ module, mode }) {
  trackEvent('view-mode-change', { module, mode });
}

/** Event 7 — affiliate-click : clic vers une enseigne (granularité affiliation)
 *  @param {{ store: string, project: string }} props */
export function trackAffiliateClick({ store, project }) {
  trackEvent('affiliate-click', { store, project });
}

/** Event 8 — lead-submitted : formulaire lead artisan soumis avec succès
 *  @param {{ module: string }} props */
export function trackLeadSubmitted({ module }) {
  trackEvent('lead-submitted', { module });
}
