/**
 * colorCode.js — Palette couleurs primaires partagée pour mode détaillé
 *
 * Utilisée par tous les modules (cabanon, pergola, clôture, terrasse)
 * pour afficher un code couleur lisible et distinctif en mode technique.
 *
 * Chaque famille a : hex (CSS), mat (Three.js MeshStandardMaterial cached).
 */
import * as THREE from 'three';

const _cache = {};
function getMat(hex) {
  if (_cache[hex]) return _cache[hex];
  const mat = new THREE.MeshStandardMaterial({
    color: hex, roughness: 0.55, metalness: 0.05, envMapIntensity: 0.4,
  });
  mat.polygonOffset = true;
  mat.polygonOffsetFactor = 1;
  mat.polygonOffsetUnits = 1;
  _cache[hex] = mat;
  return mat;
}

/* ── Palette universelle — couleurs primaires, aucune couleur proche ── */
export const CC = {
  posts:    { hex: '#2196F3', label: 'Poteaux',       get mat() { return getMat('#2196F3'); } },
  studs:    { hex: '#2196F3', label: 'Montants',       get mat() { return getMat('#2196F3'); } },
  lisses:   { hex: '#E53935', label: 'Lisses',         get mat() { return getMat('#E53935'); } },
  rails:    { hex: '#E53935', label: 'Rails',          get mat() { return getMat('#E53935'); } },
  beams:    { hex: '#FF9800', label: 'Poutres',        get mat() { return getMat('#FF9800'); } },
  chevrons: { hex: '#FF9800', label: 'Chevrons',       get mat() { return getMat('#FF9800'); } },
  rafters:  { hex: '#E53935', label: 'Chevrons',       get mat() { return getMat('#E53935'); } },
  framing:  { hex: '#9C27B0', label: 'Linteaux',       get mat() { return getMat('#9C27B0'); } },
  bracing:  { hex: '#4CAF50', label: 'Contreventement', get mat() { return getMat('#4CAF50'); } },
  braces:   { hex: '#4CAF50', label: 'Jambes de force', get mat() { return getMat('#4CAF50'); } },
  boards:   { hex: '#FF9800', label: 'Lames',          get mat() { return getMat('#FF9800'); } },
  voliges:  { hex: '#FFEB3B', label: 'Voliges',        get mat() { return getMat('#FFEB3B'); } },
  bastaing: { hex: '#00BCD4', label: 'Bastaings',      get mat() { return getMat('#00BCD4'); } },
  joists:   { hex: '#E53935', label: 'Lambourdes',     get mat() { return getMat('#E53935'); } },
  pads:     { hex: '#9E9E9E', label: 'Plots béton',    get mat() { return getMat('#9E9E9E'); } },
  decking:  { hex: '#FF9800', label: 'Lames terrasse', get mat() { return getMat('#FF9800'); } },
  nogging:  { hex: '#00BCD4', label: 'Entretoises',    get mat() { return getMat('#00BCD4'); } },
};
