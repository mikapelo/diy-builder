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
 *   trackArtisanModalOpen(props)  — event 9 : artisan-modal-open
 *   trackArtisanModalAbandon(props) — event 10 : artisan-modal-abandon
 *   trackAwinClick(props)         — event 11 : awin-click
 *   trackPDFExportFailed(props)   — event 12 : pdf-export-failed
 *   trackUpsellShown(props)       — event 13 : upsell-shown
 *   trackUpsellDeclined(props)    — event 14 : upsell-declined
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

/** Event 2 — pdf-export : dossier PDF effectivement téléchargé.
 *
 *  **Changement de définition, 2026-08-26** : l'événement partait au tout début
 *  de `handleExportPDF`, avant le `try` — il comptait donc les TENTATIVES. Or la
 *  proposition post-téléchargement ne s'affiche que sur `pdfStatus === 'done'` :
 *  s'en servir comme dénominateur de son taux d'acceptation surestimait le
 *  nombre de propositions affichées. Il part maintenant après la génération
 *  réussie. Rupture de série assumée : avant/après le 26/08/2026 ne sont pas
 *  comparables (l'écart est celui des échecs, mesuré par `pdf-export-failed`).
 *  @param {{ module: string }} props */
export function trackPDFExport({ module }) {
  trackEvent('pdf-export', { module });
}

/** Event 12 — pdf-export-failed : la génération a échoué, aucun fichier livré.
 *  Sans lui, un export qui casse ferait simplement disparaître `pdf-export` des
 *  relevés, sans rien dire de la cause. Volume attendu : quasi nul.
 *  @param {{ module: string }} props */
export function trackPDFExportFailed({ module }) {
  trackEvent('pdf-export-failed', { module });
}

/** Event 3 — devis-click : clic sur un CTA « Demander un devis gratuit »
 *  `placement` répond à « quelle surface produit les demandes ? » sans passer
 *  par une analyse d'URL : 'simulateur' (bloc pivot des résultats), 'guide'
 *  (CTALead en article), 'accueil' (section artisan), 'post-pdf' (proposition
 *  qui suit le téléchargement du dossier). Dimension introduite le 2026-08-25 :
 *  les relevés antérieurs n'en portent aucune.
 *  @param {{ module: string, placement?: string }} props */
export function trackDevisClick({ module, placement = 'bloc' }) {
  trackEvent('devis-click', { module, placement });
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

/** Event 9 — artisan-modal-open : modal ArtisanLeadModal ouvert (= CTA Pro cliqué + modal monté)
 *  À comparer à 'devis-click' pour détecter le drop entre clic CTA et affichage modal.
 *
 *  Réponse au 2026-08-25, sur 28 jours : **aucun drop** — 9 et 9, page pour page.
 *  Le couple reste en place comme détecteur de régression (un CTA qui n'ouvrirait
 *  plus la modale se verrait aussitôt), mais les deux ne forment PAS une étape de
 *  tunnel : les compter comme « 9 clics → 9 ouvertures = 100 % » compte deux fois
 *  le même geste. Le tunnel réel est : vue → devis-click → lead-submitted.
 *  @param {{ module: string }} props */
export function trackArtisanModalOpen({ module }) {
  trackEvent('artisan-modal-open', { module });
}

/** Event 10 — artisan-modal-abandon : modal fermé sans submit succès
 *  stage indique à quelle étape l'utilisateur a abandonné.
 *  @param {{ module: string, stage: 'idle' | 'submitting' | 'error' }} props */
export function trackArtisanModalAbandon({ module, stage }) {
  trackEvent('artisan-modal-abandon', { module, stage });
}

/** Event 11 — awin-click : clic vers un produit partenaire Awin (Aosom, Plots discount)
 *  @param {{ merchant: string, module: string, product?: string }} props */
export function trackAwinClick({ merchant, module, product = '', placement = 'block' }) {
  trackEvent('awin-click', { merchant, module, product, placement });
}

/* ── Proposition de devis qui suit le téléchargement du dossier ──
 *
 * Livrée le 25/08/2026 sans instrument sur ses deux issues : on voyait les
 * acceptations (`devis-click` avec `placement: 'post-pdf'`) mais ni les
 * affichages ni les refus. Son taux d'acceptation n'était donc pas calculable —
 * seulement encadrable par le nombre d'exports, qui comptait alors les
 * tentatives. Le trio ci-dessous ferme la mesure :
 *
 *     upsell-shown  =  upsell-declined  +  devis-click[placement=post-pdf]  +  sorties sans choix
 */

/** Event 13 — upsell-shown : la proposition est affichée après un export réussi.
 *  Dénominateur du taux d'acceptation.
 *  @param {{ module: string }} props */
export function trackUpsellShown({ module }) {
  trackEvent('upsell-shown', { module });
}

/** Event 14 — upsell-declined : « Non merci », croix, Échap ou clic sur le fond.
 *  Les quatre passent par `onDecline`, donc un seul point de mesure suffit.
 *  @param {{ module: string }} props */
export function trackUpsellDeclined({ module }) {
  trackEvent('upsell-declined', { module });
}
