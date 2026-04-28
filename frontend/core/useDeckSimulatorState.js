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
 * Usage :
 *   const { width, depth, setWidth, ... } = useDeckSimulatorState();
 */
import { useState, useEffect } from 'react';
import { readSimulatorUrlParams } from '@/hooks/useSimulatorUrl';

/* ── Valeurs par défaut — identiques SSR et client initial ── */
const DEFAULT_W = 5.5;
const DEFAULT_D = 3.5;
const DEFAULT_H = 2.3;

export function useDeckSimulatorState() {
  const [width,          setWidth]          = useState(DEFAULT_W);
  const [depth,          setDepth]          = useState(DEFAULT_D);
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
