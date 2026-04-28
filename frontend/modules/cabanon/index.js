/**
 * index.js — Interface publique du module Cabanon
 *
 * Exporte le moteur de calcul et la config depuis leurs sources
 * respectives. Point d'entrée unique pour le registre et les
 * consommateurs génériques.
 */
export { generateCabanon }  from './engine.js';
export { cabanonConfig as config } from './config.js';
