/**
 * useProjectEngine.js — Hook générique de calcul de structure
 *
 * Reçoit un type de projet, les dimensions et des options
 * supplémentaires, retourne les données structurelles calculées
 * par le moteur du module correspondant.
 *
 * Usage :
 *   const { structure, config } = useProjectEngine('terrasse', width, depth);
 *   const { structure, config } = useProjectEngine('cabanon', width, depth, { height: 2.3 });
 *   // structure → données brutes du moteur du module
 *   // config    → label, pdfTitle, unit, icon…
 */
'use client';
import { useMemo } from 'react';
import { getProject } from './projectRegistry.js';

/**
 * @param {string} projectType       Identifiant du projet (ex: 'terrasse', 'cabanon')
 * @param {number} width             Largeur en mètres
 * @param {number} depth             Profondeur en mètres
 * @param {object} [options={}]      Paramètres supplémentaires selon le module
 *                                   Ex: { height: 2.3 } pour cabanon
 * @returns {{ structure: object, config: object }}
 */
export function useProjectEngine(projectType, width, depth, options = {}) {
  const { engine, config } = getProject(projectType);

  const structure = useMemo(
    () => engine(width, depth, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [engine, width, depth, JSON.stringify(options)],
  );

  return { structure, config };
}
