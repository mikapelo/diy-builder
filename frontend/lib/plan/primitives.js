/**
 * primitives.js — Types standardisés pour le rendu technique multi-vues
 *
 * Chaque primitive est un objet JS immutable décrivant un élément graphique
 * indépendamment du moteur de rendu (SVG React ou jsPDF).
 *
 * Les primitives sont organisées en couches (layers) ordonnées.
 * Le renderer itère les couches dans l'ordre et dessine chaque primitive.
 */

/* ── Couches ordonnées (back → front) ─────────────────────────────── */
export const LAYERS = [
  'background',
  'contours',
  'roof',
  'structurePrimary',
  'structureSecondary',
  'openings',
  'framings',
  'outline',
  'dimensions',
  'labels',
  'legend',
];

/* ── Factory helpers — chaque fonction retourne un objet primitive ── */

/** Trait simple */
export function line(layer, x1, y1, x2, y2, opts = {}) {
  return { type: 'line', layer, x1, y1, x2, y2, ...opts };
}

/** Rectangle (optionnel : remplissage) */
export function rect(layer, x, y, w, h, opts = {}) {
  return { type: 'rect', layer, x, y, w, h, ...opts };
}

/** Polygone fermé (points : [[x,y], ...]) */
export function polygon(layer, points, opts = {}) {
  return { type: 'polygon', layer, points, ...opts };
}

/** Polyligne ouverte (points : [[x,y], ...]) */
export function polyline(layer, points, opts = {}) {
  return { type: 'polyline', layer, points, ...opts };
}

/** Texte positionné */
export function text(layer, x, y, content, opts = {}) {
  return { type: 'text', layer, x, y, content, ...opts };
}

/**
 * Cotation (dimension line) — horizontale ou verticale
 * @param {'h'|'v'} dir  Direction de la cote
 * @param {number} a     Coordonnée début (x pour h, y pour v)
 * @param {number} b     Coordonnée fin
 * @param {number} pos   Position perpendiculaire (y pour h, x pour v)
 * @param {string} label Texte de la cote
 */
export function dimension(layer, dir, a, b, pos, label, opts = {}) {
  return { type: 'dimension', layer, dir, a, b, pos, label, ...opts };
}

/** Cercle (centre + rayon, optionnel : remplissage) */
export function circle(layer, cx, cy, r, opts = {}) {
  return { type: 'circle', layer, cx, cy, r, ...opts };
}

/** Élément de légende (carré de couleur + label texte) */
export function legendItem(x, y, color, label, opts = {}) {
  return { type: 'legendItem', layer: 'legend', x, y, color, label, ...opts };
}

/* ── Container de couches ──────────────────────────────────────────── */

/** Crée un objet layers vide (une liste par couche) */
export function createLayers() {
  const layers = {};
  for (const name of LAYERS) layers[name] = [];
  return layers;
}

/** Ajoute une primitive dans la bonne couche */
export function addPrimitive(layers, primitive) {
  const list = layers[primitive.layer];
  if (list) list.push(primitive);
  return layers;
}

/** Ajoute un tableau de primitives */
export function addPrimitives(layers, primitives) {
  for (const p of primitives) addPrimitive(layers, p);
  return layers;
}

/** Retourne toutes les primitives aplaties dans l'ordre des couches */
export function flattenLayers(layers) {
  const out = [];
  for (const name of LAYERS) {
    const list = layers[name];
    if (list) out.push(...list);
  }
  return out;
}
