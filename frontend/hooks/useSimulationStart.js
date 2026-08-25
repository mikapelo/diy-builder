'use client';

/**
 * useSimulationStart — émet `simulation-start` au premier réglage de dimensions.
 *
 * ⚠️ Deux corrections apportées le 2026-08-25 (audit CTA devis) :
 *
 * 1. **Couverture.** L'événement n'était posé que dans `CabanonViewer`, avec
 *    `module: 'cabanon'` en dur. Terrasse, pergola et clôture n'en émettaient
 *    aucun — `/pergola` a produit 18 exports PDF pour 0 simulation comptée sur
 *    28 jours. Le ratio « simulations → devis » divisait donc un numérateur
 *    tous modules par un dénominateur cabanon.
 *
 * 2. **Définition.** Il partait au montage, dès que la géométrie était prête —
 *    soit l'équivalent d'une vue de page, déjà mesurée par ailleurs. Il part
 *    maintenant au **premier changement de dimension**, ce qui mesure un
 *    engagement réel. Rupture de série assumée et datée : les relevés
 *    antérieurs au 25/08/2026 ne sont pas comparables aux suivants.
 *
 * L'unicité par onglet est assurée en aval par `trackSimulationStart`, qui
 * porte son propre verrou `sessionStorage` par module. Le `firedRef` ci-dessous
 * évite seulement de le rappeler à chaque mouvement de curseur.
 */

import { useEffect, useRef } from 'react';
import { trackSimulationStart } from '@/hooks/useAnalytics.js';

export default function useSimulationStart(projectType, width, depth) {
  const moduleRef  = useRef(null);
  const initialRef = useRef(null);
  const firedRef   = useRef(false);

  useEffect(() => {
    if (!projectType || !(width > 0) || !(depth > 0)) return;

    // Changement de module → nouvelle mesure
    if (moduleRef.current !== projectType) {
      moduleRef.current  = projectType;
      initialRef.current = null;
      firedRef.current   = false;
    }

    const dims = `${width}x${depth}`;

    // Premier passage : on mémorise le point de départ, sans rien émettre
    if (initialRef.current === null) {
      initialRef.current = dims;
      return;
    }
    if (firedRef.current || dims === initialRef.current) return;

    firedRef.current = true;
    trackSimulationStart({ module: projectType, width, depth });
  }, [projectType, width, depth]);
}
