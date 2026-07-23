/**
 * listeBOM.js — Helper de transformation BOM pour la page /liste
 *
 * Extrait depuis app/liste/page.jsx pour pouvoir être testé en isolation
 * (audit Sprint 3 — gap couverture).
 *
 * Fournit `callEngine(project, w, d)` qui :
 *   - pour terrasse : transforme le retour brut de generateDeck en BOM utilisable
 *   - pour les autres modules : appelle l'engine directement
 *
 * Le calcul des entretoises et boards utilise les constantes commerciales
 * (ENTR_SPACING=1.5m, LAME_COMMERCIAL_LEN=3.6m), distinctes des constantes
 * géométriques (BOARD_LEN=3.0m pour les coupes 3D).
 */

import { generateCabanon } from '@/modules/cabanon/engine';
import { generatePergola } from '@/modules/pergola/engine';
import { generateCloture } from '@/modules/cloture/engine';
import { generateDeck }    from '@/lib/deckEngine';
import { BOARD_WIDTH, BOARD_GAP, ENTR_SPACING } from '@/lib/deckConstants';

// Longueur commerciale lame terrasse (m) — LM/Casto vendent 3,6m, BD 4,2m.
export const LAME_COMMERCIAL_LEN = 3.6;

export function callEngine(project, w, d) {
  switch (project) {
    case 'terrasse': {
      const raw = generateDeck(w, d);
      const joistCount = raw.joistCount ?? 0;
      const pads = raw.totalPads ?? 0;
      const dblJoistCount = new Set(raw.doubleJoistSegs?.map(s => +s.xPos.toFixed(6)) ?? []).size;
      const allJoistCount = joistCount + dblJoistCount;
      const boardRows = Math.floor(d / (BOARD_WIDTH + BOARD_GAP)) + 1;
      // Quantités brutes — la majoration coupe/chute (×1,10) est appliquée une
      // seule fois par costCalculator (WOOD_WASTE_FACTOR). Doit rester identique
      // au calcul de DeckSimulator : pas de ×1,05 en dur (double-compte).
      const boards = Math.ceil(boardRows * w / LAME_COMMERCIAL_LEN);
      const screws = boardRows * allJoistCount * 2;
      const cbPositions = Math.floor(w / ENTR_SPACING);
      const entretoises = cbPositions * Math.max(joistCount - 1, 0);
      const bande = Math.ceil(allJoistCount * d);
      return { boards, joists: allJoistCount, pads, screws, entretoises, bande };
    }
    case 'cabanon': return generateCabanon(w, d, {});
    case 'pergola': return generatePergola(w, d, {});
    case 'cloture': return generateCloture(w, d, {});
    default:        return null;
  }
}
