/**
 * modules/cloture/engine.js — Moteur de calcul Clôture V1
 *
 * Clôture bois droite : poteaux réguliers (2m d'entraxe), 2 rails horizontaux
 * (haut et bas), lames verticales entre les rails.
 *
 * Convention d'axes :
 *   X = longueur clôture (direction linéaire)
 *   Z = profondeur (non utilisé, toujours 0)
 *   Y = hauteur (vertical)
 *
 * NE CONTIENT PAS de Three.js — moteur pur.
 */

import {
  POST_SECTION,
  POST_DEPTH,
  DEFAULT_HEIGHT,
  POST_SPACING,
  RAIL_W,
  RAIL_H,
  BOARD_W,
  BOARD_H,
  BOARD_GAP,
  RAIL_INSET_TOP,
  RAIL_INSET_BOTTOM,
  FOOT_EMBED,
  VIS_PER_BOARD,
  VIS_PER_RAIL_POST,
  CONCRETE_BAGS_PER_POST,
} from '@/lib/clotureConstants.js';

/** Profondeur d'ancrage effective — DTU 31.1 pratique : ≥ 1/3 hauteur hors-sol.
 *  Garantit que même pour des hauteurs inférieures à 1.50m on respecte la règle 1/3. */
function effectiveFootEmbed(clotureHeight) {
  return Math.max(FOOT_EMBED, clotureHeight / 3);
}

/**
 * Génère la structure complète d'une clôture bois.
 *
 * @param {number}  width           Longueur totale de la clôture en mètres (X)
 * @param {number}  depth           Hauteur de la clôture en mètres (Y)
 *                                  (nommé "depth" pour compatibilité useProjectEngine)
 * @param {object}  [options={}]    Options supplémentaires
 * @returns {object}                Structure complète : quantitatifs + geometry
 */
export function generateCloture(width, depth, options = {}) {
  // Hauteur effective = depth (le paramètre depth est la hauteur en m pour cette clôture)
  const clotureHeight = depth;

  // ── Poteaux ────────────────────────────────────────────────────
  // Calcul du nombre de poteaux : on utilise ceil pour garantir que
  // l'espacement réel ne dépasse jamais POST_SPACING (sécurité structurelle)
  const intervals = Math.max(1, Math.ceil(width / POST_SPACING));
  const postCount = intervals + 1;
  const actualSpacing = width / intervals;

  // DTU 31.1 pratique : profondeur ≥ max(FOOT_EMBED, 1/3 hauteur hors-sol)
  const footEmbed = effectiveFootEmbed(clotureHeight);
  const postLength = clotureHeight + footEmbed;

  // ── Rails ──────────────────────────────────────────────────────
  // 2 rails (haut et bas) par travée (espace entre 2 poteaux)
  // Nombre de travées = postCount - 1
  const traveeCount = Math.max(1, postCount - 1);
  const railCount = 2 * traveeCount;
  // Longueur nette du rail = entre les faces intérieures des poteaux
  const railLength = +(actualSpacing - POST_SECTION).toFixed(3);

  // ── Lames verticales ───────────────────────────────────────────
  // Hauteur utile d'une lame = distance entre les deux rails
  const boardLength = +(clotureHeight - RAIL_INSET_TOP - RAIL_INSET_BOTTOM).toFixed(3);

  // Pour chaque travée, on estime le nombre de lames
  // Largeur disponible = espace entre faces intérieures des poteaux
  const usableSpanWidth = actualSpacing - POST_SECTION;
  const boardsPerSpan = Math.floor(usableSpanWidth / (BOARD_W + BOARD_GAP));
  const boardCount = Math.max(1, boardsPerSpan) * traveeCount;

  // Espacement réel des lames dans chaque travée (centré)
  const boardSpanWidth = BOARD_W + BOARD_GAP;

  // ── Surface et linéaire ────────────────────────────────────────
  const surface = +(width * clotureHeight).toFixed(2);
  const linearMeters = +width.toFixed(3);

  // ── BOM — Pièces bois ──────────────────────────────────────────
  const bom_posts = postCount;
  const bom_rails = railCount;
  const bom_boards = boardCount;

  // ── BOM — Quincaillerie ───────────────────────────────────────
  // Vis lames : chaque lame a VIS_PER_BOARD vis (2 par rail = 4 total)
  const visLames = boardCount * VIS_PER_BOARD;

  // Vis rails : chaque rail a 2 extrémités, chacune avec VIS_PER_RAIL_POST vis
  // Total : railCount * 2 * VIS_PER_RAIL_POST
  const visRails = railCount * 2 * VIS_PER_RAIL_POST;

  // Ancrages poteaux : 1 par poteau
  const ancrages = postCount;

  // Béton de scellement : CONCRETE_BAGS_PER_POST sac(s) 25 kg par poteau
  // Correction [audit] : poste absent du BOM — client ne pouvait pas budgéter le scellement
  const concreteBags = postCount * CONCRETE_BAGS_PER_POST;

  // ── Geometry object pour RENDER ────────────────────────────────
  // Poteaux : liste des positions X
  const posts = [];
  for (let i = 0; i < postCount; i++) {
    posts.push({
      x: +(i * actualSpacing).toFixed(3),
      height: clotureHeight,
    });
  }

  // Rails : haut et bas pour chaque travée
  // Les rails s'arrêtent aux faces intérieures des poteaux (pas centre-à-centre)
  const halfPost = POST_SECTION / 2;
  const rails = [];
  for (let i = 0; i < traveeCount; i++) {
    const x1 = +(i * actualSpacing + halfPost).toFixed(3);
    const x2 = +((i + 1) * actualSpacing - halfPost).toFixed(3);

    // Rail haut
    rails.push({
      x1,
      x2,
      y: clotureHeight - RAIL_INSET_TOP,
      type: 'top',
    });

    // Rail bas
    rails.push({
      x1,
      x2,
      y: RAIL_INSET_BOTTOM,
      type: 'bottom',
    });
  }

  // Lames : liste des positions X pour chaque travée
  // Les lames sont centrées dans l'espace utile entre faces intérieures des poteaux
  const boards = [];
  for (let spanIdx = 0; spanIdx < traveeCount; spanIdx++) {
    const spanX1 = spanIdx * actualSpacing;         // centre poteau gauche
    const innerX1 = spanX1 + halfPost;              // face intérieure gauche
    const innerX2 = (spanIdx + 1) * actualSpacing - halfPost; // face intérieure droite
    const usable = innerX2 - innerX1;               // largeur utile

    // Nombre de lames réelles dans cette travée
    const boardsInSpan = Math.floor(usable / boardSpanWidth);
    const finalBoardCount = Math.max(1, boardsInSpan);

    // Espacement réel des lames pour cette travée
    let boardActualGap = BOARD_GAP;
    if (finalBoardCount > 1) {
      boardActualGap = (usable - finalBoardCount * BOARD_W) / (finalBoardCount - 1);
    }

    // Centrer les lames dans l'espace utile
    const totalLamesWidth = finalBoardCount * BOARD_W + (finalBoardCount - 1) * boardActualGap;
    const offsetX = (usable - totalLamesWidth) / 2;

    for (let j = 0; j < finalBoardCount; j++) {
      const boardX = innerX1 + offsetX + j * (BOARD_W + boardActualGap);
      boards.push({
        x: +(boardX).toFixed(3),
        y: RAIL_INSET_BOTTOM,
        height: boardLength,
        span: spanIdx,
      });
    }
  }

  // Geometry structure complète
  const geometry = {
    dimensions: {
      width: +width.toFixed(3),
      height: clotureHeight,
      postSection: POST_SECTION,
      postSpacing: +actualSpacing.toFixed(3),
      railW: RAIL_W,
      railH: RAIL_H,
      boardW: BOARD_W,
      boardH: BOARD_H,
      boardGap: BOARD_GAP,
      footEmbed,
    },
    posts,
    rails,
    boards,
  };

  return {
    // ── Quantitatifs de base ───────────────────────────
    surface,
    linearMeters,
    postCount,
    railCount,
    boardCount,
    postLength,
    railLength,
    boardLength,

    // ── BOM — Pièces bois ──────────────────────────────
    posts: bom_posts,
    rails: bom_rails,
    boards: bom_boards,

    // ── BOM — Quincaillerie ────────────────────────────
    visLames,
    visRails,
    ancrages,

    // ── BOM — Béton de scellement ──────────────────────
    concreteBags,

    // ── Durabilité — DTU 31.1 §5.10.4.2 ───────────────
    // Poteaux en contact direct avec le sol → classe d'emploi 4.
    // Obligation : bois traité UC4 (autoclave) ou naturellement durable (acacia, robinier).
    postTreatment: 'UC4',
    footEmbed: +footEmbed.toFixed(3),

    // ── Geometry ───────────────────────────────────────
    geometry,
  };
}
