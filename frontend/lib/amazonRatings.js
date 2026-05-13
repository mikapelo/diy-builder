/**
 * amazonRatings.js — Snapshot daté des notes Amazon par ASIN
 *
 * IMPORTANT — Comment populer ce fichier :
 *
 *   1. Aller dans Associates Central (https://partenaires.amazon.fr) → rapports → produits performants
 *      OU ouvrir manuellement la fiche produit Amazon de chaque ASIN listé dans projectTools.js
 *
 *   2. Pour chaque produit, relever :
 *        - rating  : note moyenne sur 5 (ex: 4.6)
 *        - count   : nombre total d'avis (ex: 12453)
 *
 *   3. Ajouter une entrée dans AMAZON_RATINGS au format :
 *        'B002EX2Y6E': { rating: 4.6, count: 12453 }
 *
 *   4. Mettre à jour SNAPSHOT_DATE à la date de la collecte.
 *
 *   5. Re-faire l'opération tous les 6 mois pour rafraîchir.
 *
 * RÈGLES :
 *   - Si l'ASIN n'est pas dans la map, l'UI affiche un badge générique "★ Voir les avis"
 *     (lien vers la fiche produit) — c'est légal et honnête.
 *   - Si l'ASIN est dans la map, l'UI affiche les étoiles + count + tooltip
 *     "Avis Amazon au {SNAPSHOT_DATE}" pour transparence.
 *   - NE JAMAIS inventer des valeurs : un rating périmé ou faux est une infraction au
 *     droit de la consommation (loyauté de l'information commerciale) ET aux ToS Amazon.
 */

export const SNAPSHOT_DATE = '2026-05-13';

export const AMAZON_RATINGS = {
  // ─── Outils (à remplir progressivement) ───
  // Format : 'ASIN': { rating: 4.X, count: NNNN },
  //
  // 'B07GBJ15VB': { rating: 4.X, count: NNNN }, // Ryobi RCS1600
  // 'B002EX2Y6E': { rating: 4.X, count: NNNN }, // Bosch PKS 55 A
  // 'B012CKR97M': { rating: 4.X, count: NNNN }, // Makita HS7601J
  // 'B016XLYJXS': { rating: 4.X, count: NNNN }, // B+D BDCDD12K
  // 'B007Z187D4': { rating: 4.X, count: NNNN }, // Bosch PSR 18 LI-2
  // 'B099NSD35X': { rating: 4.X, count: NNNN }, // Makita DDF487
  // 'B07NXB6SYD': { rating: 4.X, count: NNNN }, // Bosch Quigo Green
  // 'B0883SMTXL': { rating: 4.X, count: NNNN }, // Bosch GLL 2-15 G
  // 'B07525S65F': { rating: 4.X, count: NNNN }, // Bosch GLL 3-80 CG
  // 'B002A05VQQ': { rating: 4.X, count: NNNN }, // B+D KA198
  // 'B000ARDYXS': { rating: 4.X, count: NNNN }, // Bosch PSS 250 AE
  // 'B00SPB9TXK': { rating: 4.X, count: NNNN }, // Bosch GEX 125-1 AE
  // 'B0001IW9E6': { rating: 4.X, count: NNNN }, // Stanley 1-45-686 équerre
  // 'B00360YS9A': { rating: 4.X, count: NNNN }, // Irwin équerre 300mm
  // 'B002JQVG9W': { rating: 4.X, count: NNNN }, // Shinwa équerre
  // 'B00VIAEPW0': { rating: 4.X, count: NNNN }, // Leman LOTAR052
  // 'B08H8WX8B3': { rating: 4.X, count: NNNN }, // Greencut GD750X-3S
  // 'B073QWDNNH': { rating: 4.X, count: NNNN }, // Greencut GD750X
  // 'B01D9WA47O': { rating: 4.X, count: NNNN }, // B+D BDCHD18
  // 'B010D09RH8': { rating: 4.X, count: NNNN }, // Bosch PSB 18 LI-2
  // 'B099NSX8MN': { rating: 4.X, count: NNNN }, // Makita DHP486
  // 'B008DI1OPQ': { rating: 4.X, count: NNNN }, // Stanley 1-42-315
  // 'B07H1RQQ9Y': { rating: 4.X, count: NNNN }, // Stabila Type 80 AS
  // 'B07H1RR1P5': { rating: 4.X, count: NNNN }, // Stabila Type 80 ASM
  // 'B0001IW702': { rating: 4.X, count: NNNN }, // Stanley 0-47-100 cordeau
  // 'B00FXR1QKS': { rating: 4.X, count: NNNN }, // Tajima CR301JF
  // 'B079VC77MZ': { rating: 4.X, count: NNNN }, // Tajima CR401SD
  //
  // ─── Consommables ASIN'd ───
  // 'B0716C7RB3': { rating: 4.X, count: NNNN }, // Spax vis terrasse
  // 'B072P165FK': { rating: 4.X, count: NNNN }, // Spax 6x100 charpente
  // 'B071YN7LMR': { rating: 4.X, count: NNNN }, // Spax 6x160 charpente
  // 'B074G4G575': { rating: 4.X, count: NNNN }, // Wera Bit-Box TX25
  // 'B076BDDH37': { rating: 4.X, count: NNNN }, // 3M Solus lunettes
  // 'B004HQ9G8K': { rating: 4.X, count: NNNN }, // Owatrol Textrol
  // 'B007B27WE2': { rating: 4.X, count: NNNN }, // Owatrol D1
  // 'B091KXVDD7': { rating: 4.X, count: NNNN }, // Bondex Protection Extrême
};

/**
 * Récupère la note d'un ASIN si renseignée, null sinon.
 */
export function getRating(asin) {
  if (!asin) return null;
  return AMAZON_RATINGS[asin] ?? null;
}
