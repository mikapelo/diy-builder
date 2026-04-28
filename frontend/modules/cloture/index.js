/**
 * index.js — Interface publique du module Clôture
 *
 * Exporte le moteur de calcul et la config depuis leurs sources
 * respectives. Point d'entrée unique pour le registre et les
 * consommateurs génériques.
 */
export { generateCloture }  from './engine.js';
export { clotureConfig as config } from './config.js';
