/**
 * index.js — Interface publique du module Garde-corps
 *
 * Re-exporte le moteur de calcul. Pas de config ni de viewer propre :
 * le garde-corps est une extension optionnelle du simulateur Terrasse
 * (et éventuellement d'autres modules à l'avenir).
 */
export { generateGardeCorps } from './engine.js';
