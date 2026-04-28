/**
 * deckStagger.js — Décalage en quinconce des entretoises DTU 51.4
 *
 * PRINCIPE CONSTRUCTIF :
 *   Les entretoises posées entre lambourdes doivent être décalées (quinconce)
 *   pour permettre le clouage en bout depuis la face extérieure de chaque lambourde.
 *   Sans décalage, il est impossible de clouer les deux côtés d'une entretoise
 *   alignée (on ne peut clouer que d'un seul côté).
 *
 *   Offset = JOIST_W = 45 mm (une largeur de lambourde) — permet de passer
 *   librement la pointe de cloueur des deux côtés.
 *
 * UTILISATION :
 *   import { staggerEntretoises } from '@/lib/deckStagger.js';
 *   const staggered = staggerEntretoises(entretoiseSegs, JOIST_W);
 *
 * @param {Array<{xCenter:number, zPos:number, segLen:number}>} segs
 *   Segments d'entretoises issus du moteur (zPos identique par rangée)
 * @param {number} joistW  Largeur de la lambourde en mètres (ex: 0.045)
 * @returns {Array<{xCenter:number, zPos:number, segLen:number}>}
 *   Mêmes segments avec zPos alternés : pair → zPos, impair → zPos + joistW
 */
export function staggerEntretoises(segs, joistW) {
  if (!segs || segs.length === 0) return segs;

  /* Regrouper par rangée (même zPos) */
  const rows = new Map();
  segs.forEach(e => {
    const key = e.zPos.toFixed(6);
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push(e);
  });

  /* Appliquer le décalage : index pair → zPos, index impair → zPos + joistW */
  const result = [];
  rows.forEach(rowSegs => {
    rowSegs.forEach((e, i) => {
      result.push({ ...e, zPos: e.zPos + (i % 2 === 1 ? joistW : 0) });
    });
  });

  return result;
}
