/**
 * engine.js — Moteur de calcul du module Cabanon
 *
 * Calculs basés sur cabanon_synthese.pdf (règles simplifiées DTU-like) :
 *   - Ossature bois, montants entraxe 60 cm
 *   - Lisses basses et hautes sur périmètre
 *   - Toiture mono-pente (coef 1.10)
 *   - Bardage en m² de surface murale
 *   - Contreventement + voliges inclus
 *
 * NE PAS modifier deckEngine, deckConstants ou foundationCalculator.
 */

import {
  STUD_SPACING, ROOF_COEF, DEFAULT_HEIGHT, SECTION, CORNER_ZONE,
  LINTEL_H, SILL_H, BASTAING_W, BASTAING_H, SLOPE_RATIO,
  ROOF_ENTRETOISE_SPACING, OSB_PANEL_AREA,
} from '@/lib/cabanonConstants.js';

/* ── Utilitaires ──────────────────────────────────────────────────────── */

/** Interpolation linéaire */
function lerp(a, b, t) { return a + (b - a) * t; }

/** Arrondi à 3 décimales */
function r3(v) { return +v.toFixed(3); }

/**
 * Convertit un axe-angle (normalisé) en angles d'Euler XYZ.
 * Équivalent à THREE.Euler().setFromQuaternion(q, 'XYZ') — sans import Three.js.
 */
function axisAngleToEulerXYZ(ax, ay, az, angle) {
  const s = Math.sin(angle / 2), c = Math.cos(angle / 2);
  const qx = ax * s, qy = ay * s, qz = az * s, qw = c;
  return {
    rx: Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy)),
    ry: Math.asin(Math.max(-1, Math.min(1, 2 * (qw * qy - qx * qz)))),
    rz: Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz)),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * wallStudH — hauteur structurelle d'un montant à la position locale u
 *
 * Toiture mono-pente : le côté x=width est plus haut de `slope` mètres.
 * Chaque montant doit s'élever jusqu'à la sablière inclinée.
 *
 *   Wall 0 (façade)  : u ∈ [0, width]   → gx = u
 *   Wall 1 (droite)  : gx = width       → hauteur uniforme = height + slope
 *   Wall 2 (arrière) : u ∈ [0, width]   → gx = width - u (inversé)
 *   Wall 3 (gauche)  : gx = 0           → hauteur uniforme = height
 * ──────────────────────────────────────────────────────────────────────── */
function wallStudH(wallId, u, width, height, slope) {
  const gx = wallId === 0 ? u
           : wallId === 1 ? width
           : wallId === 2 ? width - u
           :                0;           // wall 3
  return r3(height + (gx / width) * slope);
}

/**
 * Génère les positions des montants le long d'un segment mur.
 * Conservé pour compatibilité (utilisé par geometry.studs — SVG, BOM).
 */
function generateStudsForWall(start, end, h) {
  const dx = end[0] - start[0], dy = end[1] - start[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  const count = Math.ceil(len / STUD_SPACING);
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = count === 0 ? 0 : i / count;
    return { x: r3(lerp(start[0], end[0], t)), y: r3(lerp(start[1], end[1], t)), z: 0, height: h };
  });
}

/* ── Convention des murs ────────────────────────────────────────────────
 *
 * wallDef(wallId, width, depth) — retourne les fonctions de conversion
 * entre coordonnées locales (u le long du mur, v en hauteur) et
 * coordonnées globales (engine x,y) ou 3D (Three.js x,y,z).
 *
 * Convention :
 *   Wall 0 — façade avant (y=0)   : u=0 à gauche, u=width  à droite
 *   Wall 1 — droite (x=width)     : u=0 en avant, u=depth  en arrière
 *   Wall 2 — arrière (y=depth)    : u=0 côté droit extérieur, u=width côté gauche
 *   Wall 3 — gauche (x=0)         : u=0 en arrière, u=depth en avant
 *
 * toGlobal(u)           → { x, y }              coordonnées moteur (plan au sol)
 * toWorld(u, v, offset) → { position, rotY }     Three.js — offset = poussée vers l'extérieur
 * ──────────────────────────────────────────────────────────────────────── */
/**
 * wallDef(wallId, width, depth, height?, slope?)
 *
 * Retourne les fonctions de conversion et utilitaires pour un mur donné.
 * Les paramètres `height` et `slope` sont optionnels — utilisés par `studHeight(u)`
 * pour la hauteur correcte sous la sablière inclinée de la mono-pente.
 *
 * toGlobal(u)           → { x, y }              coordonnées moteur (plan au sol)
 * toWorld(u, v, offset) → { position, rotY }     Three.js
 * studHeight(u)         → number                 hauteur structurelle à la position u
 */
export function wallDef(wallId, width, depth, height = 0, slope = 0) {
  return [
    {                                                              // Wall 0 — façade (y=0)
      len:        width,
      toGlobal:   u         => ({ x: u,         y: 0       }),
      toWorld:    (u, v=0, off=0) => ({ position: [u - width/2,  v,  depth/2 + off], rotY:  0          }),
      studHeight: u => r3(height + (u         / width) * slope),
    },
    {                                                              // Wall 1 — droite (x=width)
      len:        depth,
      toGlobal:   u         => ({ x: width,     y: u       }),
      toWorld:    (u, v=0, off=0) => ({ position: [ width/2 + off, v,  depth/2 - u], rotY:  Math.PI/2  }),
      studHeight: _u => r3(height + slope),                       // côté haut : hauteur uniforme max
    },
    {                                                              // Wall 2 — arrière (y=depth)
      len:        width,
      toGlobal:   u         => ({ x: width - u, y: depth   }),
      toWorld:    (u, v=0, off=0) => ({ position: [width/2 - u,  v, -depth/2 - off], rotY:  Math.PI    }),
      studHeight: u => r3(height + ((width - u) / width) * slope),
    },
    {                                                              // Wall 3 — gauche (x=0)
      len:        depth,
      toGlobal:   u         => ({ x: 0,         y: depth-u }),
      toWorld:    (u, v=0, off=0) => ({ position: [-width/2 - off, v,  u - depth/2], rotY: -Math.PI/2  }),
      studHeight: _u => r3(height),                               // côté bas : hauteur uniforme min
    },
  ][wallId];
}

/** Borne une ouverture dans les limites du mur (sécurité) */
function clampOpening(o, len) {
  const u = Math.max(0, Math.min(o.u, len - o.width));
  return { ...o, u: r3(u) };
}

/* ────────────────────────────────────────────────────────────────────────
 * buildStructuralStuds — génère TOUS les montants verticaux de l'ossature
 *
 * Retourne un tableau uniforme : [{ x, y, height, zBase }]
 * Tous rendus comme BoxGeometry(SECTION, height, SECTION) en 3D.
 *
 * Contient :
 *   1. Montants d'angle en L (2 par coin × 4 = 8, hardcodés)
 *   2. Montants intermédiaires (entraxe 60cm, excluant coins et ouvertures)
 *   3. King studs (montants de rive, pleine hauteur)
 *   4. Jack studs (montants trimmer, hauteur ouverture)
 *   5. Cripple studs (au-dessus linteaux + sous fenêtre)
 * ──────────────────────────────────────────────────────────────────────── */
function buildStructuralStuds(width, depth, h, slope, openingsArr) {
  const H   = SECTION / 2;  // demi-section (0.045 m)
  const out = [];

  /** Hauteur du montant à la position locale u sur le mur wallId */
  const sh = (wallId, u) => wallStudH(wallId, u, width, h, slope);

  /** Ajoute des montants réguliers dans le segment [segStart, segEnd] */
  const addSegment = (segStart, segEnd, toGlobal, wallId) => {
    const first = r3(Math.ceil( (segStart + SECTION) / STUD_SPACING) * STUD_SPACING);
    const last  = r3(Math.floor((segEnd   - SECTION) / STUD_SPACING) * STUD_SPACING);
    for (let p = first; p <= last + 0.001; p = r3(p + STUD_SPACING)) {
      const { x, y } = toGlobal(p);
      out.push({ x, y, height: sh(wallId, p), zBase: 0, type: 'regular' });
    }
  };

  /**
   * Ajoute des cripple studs répartis dans l'ouverture [uStart, uStart+uWidth].
   * topHFn(u) → hauteur supérieure à la position locale u (ou nombre fixe).
   */
  const addCripples = (toGlobal, wallId, uStart, uWidth, zBase, topHFn) => {
    const n = Math.max(1, Math.round(uWidth / STUD_SPACING) - 1);
    for (let i = 0; i < n; i++) {
      const u   = r3(uStart + (uWidth / (n + 1)) * (i + 1));
      const top = typeof topHFn === 'function' ? topHFn(u) : topHFn;
      const cH  = r3(top - zBase);
      if (cH < 0.05) continue;
      const { x, y } = toGlobal(u);
      out.push({ x, y, height: cH, zBase, type: 'cripple' });
    }
  };

  /* ── 1. Montants d'angle en L (4 coins × 2 = 8) ──
   *
   *  Les coins à x≈0  (avant-gauche, arrière-gauche) → hauteur = height
   *  Les coins à x≈width (avant-droit, arrière-droit) → hauteur = height + slope
   *  wallStudH calcule la hauteur exacte à chaque position.
   */
  /* Montants L-corner : 2 pièces 9×9 se touchent sans se pénétrer.
   * Le premier montant est centré à H (demi-section) du bord du mur.
   * Le second est décalé d'une SECTION complète pour être adjacent,
   * pas à H (ce qui causait 45mm de chevauchement 3D → z-fighting). */
  out.push(
    // Avant-gauche (x≈0, y≈0)  — wall 0 u≈0  — backing stud dans le mur 3 (ouest)
    { x: r3(H),               y: r3(H),                   height: sh(0, H),         zBase: 0, type: 'corner' },
    { x: r3(H),               y: r3(H + SECTION),         height: sh(0, H),         zBase: 0, type: 'corner' },
    // Avant-droit (x≈width, y≈0) — wall 0 u≈width — backing stud dans le mur 1 (est)
    { x: r3(width - H),       y: r3(H),                   height: sh(0, width - H), zBase: 0, type: 'corner' },
    { x: r3(width - H),       y: r3(H + SECTION),         height: sh(0, width - H), zBase: 0, type: 'corner' },
    // Arrière-droit (x≈width, y≈depth) — wall 2 u≈0 → gx≈width — backing stud dans le mur 1 (est)
    { x: r3(width - H),       y: r3(depth - H),           height: sh(2, H),         zBase: 0, type: 'corner' },
    { x: r3(width - H),       y: r3(depth - H - SECTION), height: sh(2, H),         zBase: 0, type: 'corner' },
    // Arrière-gauche (x≈0, y≈depth) — wall 2 u≈width → gx≈0 — backing stud dans le mur 3 (ouest)
    { x: r3(H),               y: r3(depth - H),           height: sh(2, width - H), zBase: 0, type: 'corner' },
    { x: r3(H),               y: r3(depth - H - SECTION), height: sh(2, width - H), zBase: 0, type: 'corner' },
  );

  /* ── 2–5. Itération sur les 4 murs ── */
  for (let wallId = 0; wallId < 4; wallId++) {
    const def = wallDef(wallId, width, depth);
    const { len, toGlobal } = def;

    // Ouvertures sur ce mur, triées par u croissant
    const wallOpenings = openingsArr
      .filter(o => o.wall === wallId)
      .sort((a, b) => a.u - b.u);

    /* ── 2. Montants intermédiaires par segments entre ouvertures ──
     * Marge SECTION autour de chaque ouverture pour éviter qu'un montant
     * régulier ne tombe quasi-confondu avec un king stud (doublon visuel). */
    const bounds = [
      CORNER_ZONE,
      ...wallOpenings.flatMap(o => [r3(o.u - SECTION), r3(o.u + o.width + SECTION)]),
      r3(len - CORNER_ZONE),
    ];
    for (let i = 0; i < bounds.length - 1; i += 2) {
      addSegment(bounds[i], bounds[i + 1], toGlobal, wallId);
    }

    /* ── 3. King studs (pleine hauteur réelle du mur, aux bords de l'ouverture) ── */
    for (const o of wallOpenings) {
      const g1 = toGlobal(o.u);
      const g2 = toGlobal(r3(o.u + o.width));
      out.push({ x: g1.x, y: g1.y, height: sh(wallId, o.u),              zBase: 0, type: 'king' });
      out.push({ x: g2.x, y: g2.y, height: sh(wallId, r3(o.u + o.width)), zBase: 0, type: 'king' });
    }

    /* ── 4. Jack studs (trimmer — hauteur ouverture, intérieur des king studs) ──
     * Décalage = SECTION complet (90mm) pour éviter le chevauchement visuel
     * avec les king studs qui ont leur face à ±SECTION/2 du centre.
     * King à u : occupe [u-45mm, u+45mm]
     * Jack à u+SECTION : occupe [u+45mm, u+135mm] — joints, pas superposés. */
    for (const o of wallOpenings) {
      const jackH = o.type === 'door'
        ? r3(o.height - LINTEL_H)
        : r3(o.v + o.height);  // jusqu'à la base du linteau fenêtre
      const g3 = toGlobal(r3(o.u + SECTION));
      const g4 = toGlobal(r3(o.u + o.width - SECTION));
      out.push({ x: g3.x, y: g3.y, height: jackH, zBase: 0, type: 'jack' });
      out.push({ x: g4.x, y: g4.y, height: jackH, zBase: 0, type: 'jack' });
    }

    /* ── 5. Cripple studs (au-dessus linteaux + sous seuil fenêtre) ── */
    for (const o of wallOpenings) {
      const lintelTop = o.type === 'door'
        ? o.height
        : r3(o.v + o.height + LINTEL_H);
      // Au-dessus du linteau : hauteur variable selon position du mur (mono-pente)
      addCripples(toGlobal, wallId, o.u, o.width, lintelTop, u => sh(wallId, u));

      // Sous le seuil de la fenêtre (zBase=0 : posés sur la lisse basse)
      if (o.type === 'window' && o.v > SILL_H + 0.05) {
        addCripples(toGlobal, wallId, o.u, o.width, 0, () => r3(o.v - SILL_H));
      }
    }
  }

  return out;
}

/* ────────────────────────────────────────────────────────────────────────
 * buildFramings — génère les éléments horizontaux d'encadrement
 *
 * Schéma Phase 1 : [{ wall, u, v, w, hh }]
 *   wall = identifiant du mur (0–3)
 *   u    = position centrale le long du mur (coordonnée locale)
 *   v    = hauteur du bord inférieur depuis le sol (m)
 *   w    = largeur totale (inclut les sections des king studs)
 *   hh   = épaisseur verticale (m)
 * ──────────────────────────────────────────────────────────────────────── */
function buildFramings(width, depth, h, openingsArr) {
  const framings = [];
  for (const o of openingsArr) {
    // Linteau (porte ou fenêtre)
    const lintelV = o.type === 'door'
      ? r3(o.height - LINTEL_H)
      : r3(o.v + o.height);
    framings.push({
      wall: o.wall,
      u:    r3(o.u + o.width / 2),
      v:    lintelV,
      w:    r3(o.width + SECTION * 2),
      hh:   LINTEL_H,
    });

    // Seuil / appui (fenêtre uniquement)
    if (o.type === 'window') {
      framings.push({
        wall: o.wall,
        u:    r3(o.u + o.width / 2),
        v:    r3(o.v - SILL_H),
        w:    r3(o.width + SECTION * 2),
        hh:   SILL_H,
      });
    }
  }
  return framings;
}

/* ────────────────────────────────────────────────────────────────────────
 * buildRoofEntretoises — entretoises de toiture entre chevrons (quinconce)
 *
 * DTU 31.1 : entretoises posées entre chevrons pour empêcher le déversement,
 * espacement 40–60 cm le long de la pente (ROOF_ENTRETOISE_SPACING).
 * Posées en quinconce : décalage d'une demi-travée sur les bays impairs
 * pour permettre le clouage en bout depuis la face de chaque chevron.
 *
 * Section identique aux chevrons (≈ SECTION × SECTION).
 * Les entretoises courent perpendiculairement aux chevrons (axe Y/profondeur)
 * sur la longueur d'une travée inter-chevrons moins la section du chevron.
 *
 * Retourne : [{ x, yCenter, segLen, z }]
 *   x       = position en largeur (coordonnée engine)
 *   yCenter = centre de l'entretoise en profondeur (entre 2 chevrons)
 *   segLen  = longueur de l'entretoise (espacement chevrons − section)
 *   z       = hauteur du bas de l'entretoise (= dessus double sablière à x)
 * ──────────────────────────────────────────────────────────────────────── */
function buildRoofEntretoises(width, depth, height, slope) {
  const out = [];
  const plateThk = 2 * SECTION;

  /* Positions Y des chevrons (même logique que geoChevrons) */
  const chevronYs = [];
  for (let i = 0; i <= Math.ceil(depth / STUD_SPACING); i++) {
    const y = r3(i * STUD_SPACING);
    if (y <= depth + 0.001) chevronYs.push(y);
  }
  if (chevronYs.length && Math.abs(chevronYs[chevronYs.length - 1] - depth) > 0.001) {
    chevronYs.push(r3(depth));
  }

  /* Pour chaque travée entre 2 chevrons adjacents */
  for (let bay = 0; bay < chevronYs.length - 1; bay++) {
    const y0 = chevronYs[bay];
    const y1 = chevronYs[bay + 1];
    const yCenter = r3((y0 + y1) / 2);
    const segLen  = r3(y1 - y0 - SECTION);
    if (segLen < 0.05) continue;

    /* Entretoises le long de la pente, en quinconce */
    const count = Math.max(1, Math.floor(width / ROOF_ENTRETOISE_SPACING));
    const staggerOff = (bay % 2 === 1) ? SECTION : 0;

    for (let j = 0; j < count; j++) {
      const x = r3(ROOF_ENTRETOISE_SPACING * (j + 0.5) + staggerOff);
      if (x > width - SECTION / 2) continue;
      if (x < SECTION / 2) continue;

      const z = r3(height + (x / width) * slope + plateThk);
      out.push({ x, yCenter, segLen, z });
    }
  }

  return out;
}

/* ────────────────────────────────────────────────────────────────────────
 * buildBracing — contreventement diagonal aux coins de chaque mur
 *
 * Un membre diagonal par panneau de coin (gauche + droit) × 4 murs = 8 total.
 * Le panneau de coin = [SECTION → STUD_SPACING] en coordonnée locale u.
 *
 * @param {number}   width
 * @param {number}   depth
 * @param {number}   h        hauteur sablière basse
 * @param {number}   slope    dénivelé toiture mono-pente
 * @param {Array}    openings ouvertures (wall, u, width) — évite les chevauchements
 *
 * Retourne : [{ wall, u0, v0, u1, v1 }]
 *   wall     = identifiant du mur (0–3)
 *   (u0, v0) = point bas du diagonal (local wall coords)
 *   (u1, v1) = point haut du diagonal
 * ──────────────────────────────────────────────────────────────────────── */
function buildBracing(width, depth, h, slope, openings = []) {
  const braces = [];
  const uSpan  = STUD_SPACING;  // largeur du panneau de contreventement

  // Pré-groupe les ouvertures par mur pour un lookup O(1)
  const openingsByWall = {};
  for (const o of openings) {
    if (!openingsByWall[o.wall]) openingsByWall[o.wall] = [];
    openingsByWall[o.wall].push(o);
  }

  // Vérifie si un contreventement [uMin, uMax] sur wallId chevauche une ouverture
  function conflictsWithOpening(wallId, uMin, uMax) {
    const wallOpenings = openingsByWall[wallId] ?? [];
    return wallOpenings.some(o => {
      const clearL = o.u - SECTION;
      const clearR = o.u + o.width + SECTION;
      return uMax > clearL && uMin < clearR;
    });
  }

  for (let wallId = 0; wallId < 4; wallId++) {
    const def = wallDef(wallId, width, depth);
    const len = def.len;
    // Hauteur réelle du mur au sommet de chaque diagonale (mono-pente)
    const v1L = wallStudH(wallId, uSpan,         width, h, slope);
    const v1R = wallStudH(wallId, len - SECTION, width, h, slope);

    for (const [u0, v0, u1, v1] of [
      [r3(SECTION),     0, r3(uSpan),          v1L],
      [r3(len - uSpan), 0, r3(len - SECTION),  v1R],
    ]) {
      // Ignorer ce contreventement s'il entre en conflit avec une ouverture
      if (conflictsWithOpening(wallId, Math.min(u0, u1), Math.max(u0, u1))) continue;
      // ── Positions 3D précalculées (élimine le useMemo dans BracingGroup) ──
      /* offset = -(SECTION*0.15 + 0.001) ≈ -0.015m : maintient le contreventement
       * entièrement à l'intérieur de l'épaisseur des montants (évite l'effet
       * "qui traverse" côté extérieur). La face avant du bois contrev. affleure
       * à ~1mm de la face extérieure des montants. */
      const bracingOff = -(SECTION * 0.15 + 0.001);
      const { position: [px0, py0, pz0] } = def.toWorld(u0, v0, bracingOff);
      const { position: [px1, py1, pz1] } = def.toWorld(u1, v1, bracingOff);
      const dx = px1 - px0, dy = py1 - py0, dz = pz1 - pz0;
      const len3d = r3(Math.sqrt(dx * dx + dy * dy + dz * dz));
      const cx = r3((px0 + px1) / 2), cy = r3((py0 + py1) / 2), cz = r3((pz0 + pz1) / 2);
      // Rotation : aligne l'axe Y local (longueur du box) sur le vecteur diagonal
      const nx = dz / len3d, nz = -dx / len3d;
      const nLen = Math.sqrt(nx * nx + nz * nz);
      const angle = Math.acos(Math.max(-1, Math.min(1, dy / len3d)));
      const { rx, ry, rz } = nLen > 0.0001
        ? axisAngleToEulerXYZ(nx / nLen, 0, nz / nLen, angle)
        : { rx: 0, ry: 0, rz: 0 };

      braces.push({ wall: wallId, u0, v0, u1, v1, cx, cy, cz, len3d, rx, ry, rz });
    }
  }
  return braces;
}

/* ── Moteur de calcul ─────────────────────────────────────────────────── */

/**
 * @typedef {Object} Opening
 * @property {0|1|2|3}           wall   — indice du mur (0=façade, 1=droite, 2=arrière, 3=gauche)
 * @property {number}            u      — position (m depuis coin gauche vue extérieure)
 * @property {number}            v      — hauteur du bas de l'ouverture (m)
 * @property {number}            width  — largeur (m)
 * @property {number}            height — hauteur (m)
 * @property {'door'|'window'}   type
 */

/**
 * @param {number} width              Largeur du cabanon (m)
 * @param {number} depth              Profondeur du cabanon (m)
 * @param {object} [options={}]
 * @param {number} [options.height]   Hauteur de la sablière basse (m), défaut 2.3
 * @param {Array}  [options.openings] Tableau d'ouvertures Phase 1 (optionnel)
 *                                    Format : [{ wall, u, v, width, height, type }]
 * @returns {object}                  Données structurelles, matériaux et géométrie
 */
export function generateCabanon(width, depth, options = {}) {
  const { height = DEFAULT_HEIGHT } = options;

  /* ── Ouvertures — défauts façade avant ou override depuis options ── */
  const defaultOpenings = [
    { wall: 0, u: r3(width * 0.15), v: 0,   width: 0.9, height: 2.0, type: 'door'   },
    { wall: 0, u: r3(width * 0.62), v: 1.0, width: 0.6, height: 0.6, type: 'window' },
  ];
  const rawOpenings = options.openings ?? defaultOpenings;

  // Sécurité : borne chaque ouverture dans les limites de son mur
  const openingsArr = rawOpenings.map(o => {
    const def = wallDef(o.wall, width, depth);
    return clampOpening(o, def.len);
  });

  /* ── A. Surfaces et périmètre ── */
  const surface   = +(width * depth).toFixed(2);
  const perimeter = +(2 * (width + depth)).toFixed(2);
  const wallArea  = +(perimeter * height).toFixed(2);      // surface totale murs brute (m²)

  // Surface toiture réelle inclinée (DTU 31.1) : longueur du rampant × profondeur × facteur pertes
  // rampant = √(width² + slope²) où slope = width × SLOPE_RATIO (pente mono-pente ~15°)
  // Correction [audit] : l'ancienne formule (width×depth×ROOF_COEF) ignorait la pente (+/-5% d'erreur)
  const _slopeForRoof = r3(width * SLOPE_RATIO);
  const _chevronLenForRoof = r3(Math.sqrt(width ** 2 + _slopeForRoof ** 2));
  const roofArea  = +(_chevronLenForRoof * depth * ROOF_COEF).toFixed(2);

  /* ── B–C. Matériaux : calculés APRÈS geometry (voir section E ci-dessous) ── */

  /* ── D. Géométrie 3D ──────────────────────────────────────────────────
   *
   * slope       : dénivelé géométrique mono-pente (ROOF_COEF ≠ slope).
   * plateHeight : dessus de la double sablière = height + 2 × SECTION.
   *               C'est la base réelle des chevrons.
   * ── */
  const slope       = r3(width * SLOPE_RATIO);  // pente min 15° (DTU 31.1)
  const plateHeight = r3(height + 2 * SECTION);

  /* Murs — rectangle au sol, sens horaire depuis angle avant-gauche.
   * Wall 1 (droite, x=width) est le côté HAUT de la mono-pente. */
  const geoWalls = [
    { start: [0,     0    ], end: [width, 0    ], height },
    { start: [width, 0    ], end: [width, depth], height: r3(height + slope) },
    { start: [width, depth], end: [0,     depth], height },
    { start: [0,     depth], end: [0,     0    ], height },
  ];

  /* geometry.studs — conservé IDENTIQUE à l'original (SVG + backward compat) */
  const geoStuds = geoWalls.flatMap(w => generateStudsForWall(w.start, w.end, w.height));

  /* geometry.structuralStuds — ossature complète et propre pour le rendu 3D */
  const geoStructuralStuds = buildStructuralStuds(width, depth, height, slope, openingsArr);

  /* geometry.framings — schéma Phase 1 : { wall, u, v, w, hh } */
  const geoFramings = buildFramings(width, depth, height, openingsArr);

  /* geometry.roofEntretoises — entretoises entre chevrons en quinconce */
  const geoRoofEntretoises = buildRoofEntretoises(width, depth, height, slope);

  /* COMPAT : geoBasteings conservé vide (anciennes références) */
  const geoBasteings = [];

  /* geometry.bracing — contreventement diagonal : [{ wall, u0, v0, u1, v1 }]
   * openingsArr transmis pour exclure les panneaux en conflit avec porte/fenêtre */
  const geoBracing = buildBracing(width, depth, height, slope, openingsArr);

  /* Lisses : basses (z=0), hautes (z=w.height), double sablière (z=w.height+SEC)
   * Wall 1 (côté haut) utilisera height+slope depuis geoWalls[1].height.
   * Chaque segment inclut len3d, ang3d, mx3d, mz3d (coordonnées scène précalculées)
   * → LissesGroup n'a plus besoin de recalculer Math.sqrt / Math.atan2. */
  /* L-joint aux angles : les lisses des murs longs (0, 2 — axe X) dépassent
   * de SEC/2 à chaque bout, les lisses des murs courts (1, 3 — axe Y) sont
   * raccourcies de SEC/2 pour éviter le gap de 45 mm aux coins. */
  const wallToLisse = (w, z, wallIdx) => {
    // Direction unitaire du mur
    const dx = w.end[0] - w.start[0];
    const dy = w.end[1] - w.start[1];
    const wallLen = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / wallLen;
    const uy = dy / wallLen;

    // Extension L-joint : murs 0/2 (façade/arrière) dépassent, murs 1/3 raccourcis
    const ext = (wallIdx === 0 || wallIdx === 2) ? SECTION / 2 : -SECTION / 2;

    const s0 = w.start[0] - ux * ext;
    const s1 = w.start[1] - uy * ext;
    const e0 = w.end[0]   + ux * ext;
    const e1 = w.end[1]   + uy * ext;

    const sx = s0 - width / 2, sz = depth / 2 - s1;
    const ex = e0 - width / 2, ez = depth / 2 - e1;
    return {
      start:  [s0, s1, z],
      end:    [e0, e1, z],
      len3d:  Math.sqrt((ex - sx) ** 2 + (ez - sz) ** 2),
      ang3d:  Math.atan2(ez - sz, ex - sx),
      mx3d:   (sx + ex) / 2,
      mz3d:   (sz + ez) / 2,
    };
  };
  const geoLisses = {
    basses:  geoWalls.map((w, i) => wallToLisse(w, 0, i)),
    hautes:  geoWalls.map((w, i) => wallToLisse(w, w.height, i)),
    hautes2: geoWalls.map((w, i) => wallToLisse(w, r3(w.height + SECTION), i)),
  };

  /* Toiture mono-pente — référencée à plateHeight.
   * angle et len sont précalculés pour ChevronsGroup et VoligesGroup. */
  const geoRoof = {
    vertices: [
      [0,     0,     plateHeight        ],
      [width, 0,     plateHeight + slope],
      [width, depth, plateHeight + slope],
      [0,     depth, plateHeight        ],
    ],
    angle: Math.atan2(slope, width),
    len:   Math.sqrt(width ** 2 + slope ** 2),
  };

  /* Chevrons — z1 = plateHeight (base réelle), z2 = plateHeight + slope
   * Filtrés : y <= depth (évite le chevron fantôme au-delà du mur arrière)
   * + chevron terminal ajouté si le dernier régulier ne tombe pas sur depth */
  const geoChevrons = Array.from(
    { length: Math.ceil(depth / STUD_SPACING) + 1 },
    (_, i) => ({ y: r3(i * STUD_SPACING), x1: 0, x2: width, z1: plateHeight, z2: r3(plateHeight + slope) }),
  ).filter(c => c.y <= depth);

  // Ajouter un chevron terminal au droit du mur arrière si nécessaire
  const lastChevron = geoChevrons[geoChevrons.length - 1];
  if (lastChevron && Math.abs(lastChevron.y - depth) > 0.001) {
    geoChevrons.push({ y: r3(depth), x1: 0, x2: width, z1: plateHeight, z2: r3(plateHeight + slope) });
  }

  /* ── E. Matériaux dérivés de la géométrie réelle ─────────────────────
   *
   * Tous les comptages et surfaces exploitent les structures geometry
   * calculées plus haut — aucune approximation périmètre / entraxe.
   * Les champs originaux (studCount, studs, lissesBasses…) sont conservés
   * pour compatibilité arrière (BOM, prix, PDF).
   * ── */

  // Montants : compte exact depuis structuralStuds (coins L, king, jack, cripple)
  const studCount = geoStructuralStuds.length;
  const studs     = studCount;

  // Lisses basses : somme des longueurs réelles des segments
  const lissesBasses = +geoLisses.basses.reduce((s, l) => s + l.len3d, 0).toFixed(2);

  // Lisses hautes : sablière 1 + double sablière (hautes2)
  const lissesHautes  = +geoLisses.hautes.reduce((s, l) => s + l.len3d, 0).toFixed(2);
  const lissesHautes2 = +geoLisses.hautes2.reduce((s, l) => s + l.len3d, 0).toFixed(2);

  // Chevrons : compte exact + longueur rampant unitaire
  const chevrons      = geoChevrons.length;
  const chevronLength = +geoRoof.len.toFixed(3);  // longueur rampant mono-pente (m)

  // Bardage : surface murs moins ouvertures, avec facteur pertes (chutes de découpe)
  // ROOF_COEF = 1.10 appliqué ici aussi (cohérent : bardage a ~10% de chutes aux angles/coupes)
  // Correction [audit] : l'ancienne formule n'appliquait aucun facteur → sous-estimation de 10%
  const openingArea = openingsArr.reduce((s, o) => s + o.width * o.height, 0);
  const bardage     = +Math.max(0, (wallArea - openingArea) * ROOF_COEF).toFixed(2);

  // Voile de contreventement OSB 3 — DTU 31.2 §9.2.2 — voile travaillant
  // Surface nette = surface murs − ouvertures (dormants non comptabilisés).
  // Règle : OSB 3 ≥ 9 mm posé sur toute la surface verticale de l'ossature.
  const osbSurface = +Math.max(0, wallArea - openingArea).toFixed(2);
  const osbPanels  = Math.ceil(osbSurface / OSB_PANEL_AREA);

  // Contreventement : nombre réel de diagonales depuis geoBracing
  const contreventement = geoBracing.length;

  // Entretoises de toiture : remplacent bastaings + voliges pour petits cabanons
  const roofEntretoises      = geoRoofEntretoises.length;
  const roofEntretoiseLength = geoRoofEntretoises.length > 0
    ? +geoRoofEntretoises[0].segLen.toFixed(3) : 0;

  // COMPAT : champs historiques conservés pour ne pas casser les anciens rapports
  const voliges        = roofArea;
  const bastaings      = 0;
  const bastaingLength = 0;

  // Vis de bardage (~25 vis/m²)
  const visBardage = Math.ceil(bardage * 25);

  // Vis d'entretoises de toiture (2 vis par entretoise × 2 côtés)
  const visEntretoises = roofEntretoises * 4;

  // Équerres de fixation montant-lisse (2 par montant : haut + bas)
  const equerres = studCount * 2;

  // Sabots chevrons (1 par chevron — fixation sur sablière)
  const sabotsChevrons = chevrons;

  // Sabots bastaings (0 — remplacés par entretoises clouées)
  const sabotsBastaings = 0;

  // Tire-fonds contreventement (3 par diagonale — fixation aux montants)
  const tireFondsBracing = contreventement * 3;

  // Vis de structure (montant→lisse, linteaux) — ~4 vis par montant
  const visStructure = studCount * 4;

  // Membrane sous-toiture / feutre bitumineux (= roofArea)
  const membrane = roofArea;

  // NOTE : le waste factor (pertes coupe/chutes) est géré par costCalculator.js,
  // pas ici. Les quantités retournées sont brutes (sans majoration).

  return {
    surface, perimeter, wallArea, roofArea, height,
    studCount,
    studs, lissesBasses, lissesHautes, lissesHautes2,
    chevrons, chevronLength,
    bardage, voliges, contreventement,
    osbSurface, osbPanels,
    bastaings, bastaingLength,
    roofEntretoises, roofEntretoiseLength,
    visBardage, visEntretoises, equerres,
    sabotsChevrons, sabotsBastaings, tireFondsBracing, visStructure,
    membrane,
    geometry: {
      dimensions:      { width, depth, height, slope, plateHeight, roofBaseY: plateHeight },
      walls:           geoWalls,
      studs:           geoStuds,           // backward compat (SVG sketch)
      structuralStuds: geoStructuralStuds, // rendu 3D — complet et propre
      framings:        geoFramings,        // schéma Phase 1 : { wall, u, v, w, hh }
      lisses:          geoLisses,
      roof:            geoRoof,
      chevrons:        geoChevrons,
      openings:        openingsArr,        // tableau Phase 1 : [{ wall, u, v, width, height, type }]
      roofEntretoises: geoRoofEntretoises, // entretoises de toiture quinconce : [{ x, yCenter, segLen, z }]
      bastaings:       geoBasteings,       // COMPAT (vide) — remplacé par roofEntretoises
      bracing:         geoBracing,         // contreventement diagonal : [{ wall, u0, v0, u1, v1 }]
    },
  };
}
