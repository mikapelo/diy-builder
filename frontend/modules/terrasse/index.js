/**
 * index.js — Interface publique du module Terrasse
 *
 * Re-exporte les briques de calcul depuis leur emplacement actuel
 * dans /lib/. Les fichiers sources NE SONT PAS déplacés — cette
 * couche est uniquement une façade modulaire.
 *
 * Consommateurs internes (DeckViewer, TechnicalPlan, ExportPDF…)
 * continuent d'importer depuis @/lib/ directement.
 * Seuls les composants génériques (useProjectEngine, projectRegistry)
 * passent par cette interface.
 */
export { generateDeck, DTU } from '@/lib/deckEngine.js';
export * from '@/lib/deckConstants.js';
export { terrasseConfig as config } from './config.js';
