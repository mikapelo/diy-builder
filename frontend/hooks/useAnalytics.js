/**
 * useAnalytics.js — Tracking privacy-first via Plausible
 *
 * Plausible est CNIL-exempt par design :
 *   - Aucun cookie déposé
 *   - Aucune donnée personnelle collectée
 *   - IP anonymisée côté serveur Plausible
 *   → Pas de bannière de consentement requise
 *
 * Configuration requise :
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=diy-builder.fr  (dans .env.local)
 *
 * Si la variable n'est pas définie → toutes les fonctions sont no-op (dev safe).
 *
 * Usage :
 *   const { trackEvent } = useAnalytics();
 *   trackEvent('PDF Export', { props: { module: 'cabanon' } });
 */

'use client';

import { useCallback } from 'react';

/**
 * Envoie un événement custom à Plausible.
 * La fonction window.plausible est injectée par le script Plausible.
 */
function sendEvent(name, options) {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  window.plausible(name, options);
}

/** Événements typés — source de vérité pour tous les modules */
export const AnalyticsEvents = {
  // Simulateur
  SIMULATOR_OPEN:    'Simulator Open',
  PDF_EXPORT:        'PDF Export',
  URL_SHARE:         'URL Share',
  DIMENSION_CHANGE:  'Dimension Change',

  // Monétisation
  ARTISAN_MODAL_OPEN:   'Artisan Modal Open',
  ARTISAN_FORM_SUBMIT:  'Artisan Form Submit',
  SAVE_PROJECT_OPEN:    'Save Project Open',

  // Outils & affiliation
  TOOL_CLICK_AMAZON:   'Tool Click Amazon',
  TOOL_CLICK_LM:       'Tool Click LM',
  STORE_CTA_CLICK:     'Store CTA Click',

  // Navigation
  GUIDE_LINK_CLICK:    'Guide Link Click',
  MODULE_SWITCH:       'Module Switch',
};

/**
 * Hook principal — retourne trackEvent et helpers nommés.
 */
export function useAnalytics() {
  const trackEvent = useCallback((eventName, options) => {
    sendEvent(eventName, options);
  }, []);

  const trackPDFExport = useCallback((projectType) => {
    sendEvent(AnalyticsEvents.PDF_EXPORT, { props: { module: projectType } });
  }, []);

  const trackArtisanModalOpen = useCallback((projectType) => {
    sendEvent(AnalyticsEvents.ARTISAN_MODAL_OPEN, { props: { module: projectType } });
  }, []);

  const trackURLShare = useCallback((projectType) => {
    sendEvent(AnalyticsEvents.URL_SHARE, { props: { module: projectType } });
  }, []);

  const trackToolClick = useCallback((store, toolName, projectType) => {
    const event = store === 'amazon'
      ? AnalyticsEvents.TOOL_CLICK_AMAZON
      : AnalyticsEvents.TOOL_CLICK_LM;
    sendEvent(event, { props: { tool: toolName, module: projectType } });
  }, []);

  const trackModuleSwitch = useCallback((from, to) => {
    sendEvent(AnalyticsEvents.MODULE_SWITCH, { props: { from, to } });
  }, []);

  return {
    trackEvent,
    trackPDFExport,
    trackArtisanModalOpen,
    trackURLShare,
    trackToolClick,
    trackModuleSwitch,
  };
}
