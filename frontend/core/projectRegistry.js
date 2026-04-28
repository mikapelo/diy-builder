/**
 * projectRegistry.js — Registre central des projets disponibles
 *
 * Chaque entrée associe un identifiant de projet à :
 *   - engine   : fonction de calcul principale (width, depth, options) → structureData
 *   - config   : métadonnées d'affichage (label, pdfTitle, unit, icon…)
 *
 * Pour ajouter un nouveau projet (ex: pergola) :
 *   1. Créer /modules/pergola/config.js, engine.js et index.js
 *   2. Ajouter l'entrée ici — aucun autre fichier générique à modifier.
 */
import { generateDeck }    from '@/lib/deckEngine.js';
import { terrasseConfig }  from '@/modules/terrasse/config.js';
import { generateCabanon } from '@/modules/cabanon/engine.js';
import { cabanonConfig }   from '@/modules/cabanon/config.js';
import { generatePergola } from '@/modules/pergola/engine.js';
import { pergolaConfig }   from '@/modules/pergola/config.js';
import { generateCloture } from '@/modules/cloture/engine.js';
import { clotureConfig }   from '@/modules/cloture/config.js';
export const PROJECTS = {
  terrasse: {
    engine: generateDeck,
    config: terrasseConfig,
  },
  cabanon: {
    engine: generateCabanon,
    config: cabanonConfig,
  },
  pergola: {
    engine: generatePergola,
    config: pergolaConfig,
  },
  cloture: {
    engine: generateCloture,
    config: clotureConfig,
  },
};

/**
 * Retourne la config d'un projet ou celle de la terrasse par défaut.
 * @param {string} projectType
 * @returns {{ engine: Function, config: object }}
 */
export function getProject(projectType) {
  return PROJECTS[projectType] ?? PROJECTS.terrasse;
}
