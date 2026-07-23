/**
 * useDeckSimulatorState.js — Hook centralisant l'état du simulateur
 *
 * Extrait de DeckSimulator.jsx pour réduire la taille du composant
 * et faciliter les tests unitaires des états.
 *
 * Les valeurs initiales w, d, h sont toujours les defaults au premier rendu
 * (garantit la cohérence SSR ↔ hydratation client : pas de mismatch de texte).
 * Après l'hydratation, un useEffect unique lit les paramètres URL et met
 * à jour le state si des valeurs sont présentes (bookmark / partage).
 *
 * Le BOM et le budget ne sont jamais encodés — intentionnellement.
 *
 * Les dimensions initiales viennent de PROJECT_DEFAULTS (par module) : un trio
 * global envoyait la clôture à 3,50 m de haut, au-dessus de sa borne UI (2,20 m)
 * et du plafond légal courant, et le cabanon à 5,50 m de large pour un max de 5 m.
 *
 * Usage :
 *   const { width, depth, setWidth, ... } = useDeckSimulatorState('cloture');
 */
import { useState, useEffect } from 'react';
import { readSimulatorUrlParams } from '@/hooks/useSimulatorUrl';
import { PROJECT_DEFAULTS } from '@/lib/seoSchemas.js';

/* ── Hauteur : commune cabanon/pergola, seuls modules à l'exposer ── */
const DEFAULT_H = 2.3;

/**
 * @param {string} projectType — fixe pour la durée de vie de la page
 *   (une route = un module), donc lu une seule fois à l'initialisation.
 */
export function useDeckSimulatorState(projectType = 'terrasse') {
  const defaults = PROJECT_DEFAULTS[projectType] ?? PROJECT_DEFAULTS.terrasse;

  const [width,          setWidth]          = useState(defaults.w);
  const [depth,          setDepth]          = useState(defaults.d);
  const [height,         setHeight]         = useState(DEFAULT_H);
  const [viewMode,       setViewMode]       = useState('assembled');
  const [foundationType, setFoundationType] = useState('ground'); // 'ground' | 'slab'
  const [slabThickness,  setSlabThickness]  = useState(12);       // cm

  /* ── Sync URL → state après hydratation (jamais pendant le SSR) ──
     window.location.search n'est accessible que côté client.
     Le useEffect s'exécute après la réconciliation, évitant tout
     mismatch entre le HTML serveur et le rendu client initial. */
  useEffect(() => {
    const { w, d, h } = readSimulatorUrlParams();
    if (w !== null) setWidth(w);
    if (d !== null) setDepth(d);
    if (h !== null) setHeight(h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    width,          setWidth,
    depth,          setDepth,
    height,         setHeight,
    viewMode,       setViewMode,
    foundationType, setFoundationType,
    slabThickness,  setSlabThickness,
  };
}
