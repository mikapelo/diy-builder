/**
 * materials.js — Textures procédurales et palettes matériaux
 *
 * Toutes les textures Canvas 2D → Three.js du module cabanon :
 * - Sol (herbe/terre)
 * - Bois (grain réaliste par famille)
 * - Toit (bac acier à nervures)
 * - Béton (chape)
 *
 * Les caches module-level évitent la re-création à chaque render.
 */
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════
   TEXTURE SOL — terrain herbe/terre
   ══════════════════════════════════════════════════════════════════════ */
let _groundMatCache = null;
export function getGroundMaterial() {
  if (_groundMatCache) return _groundMatCache;
  const w = 512, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Sol neutre showroom — beige chaud avec grain subtil
  ctx.fillStyle = '#e2ddd5';
  ctx.fillRect(0, 0, w, h);

  // Micro-variation de surface — subtile texture mate
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 2 + Math.random() * 6;
    ctx.globalAlpha = 0.02 + Math.random() * 0.04;
    ctx.fillStyle = Math.random() > 0.5 ? '#d8d2c8' : '#e8e2d8';
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.5, r, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);

  _groundMatCache = new THREE.MeshStandardMaterial({
    map: tex,
    color: '#ddd8d0', roughness: 0.95, metalness: 0, envMapIntensity: 0.2,
  });
  return _groundMatCache;
}

/* ══════════════════════════════════════════════════════════════════════
   TEXTURES BOIS — grain réaliste par famille
   ══════════════════════════════════════════════════════════════════════ */
function createWoodCanvas(base, grain, density = 20, w = 256, h = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 6; i++) {
    const x0 = Math.random() * w;
    const y0 = Math.random() * h;
    const grad = ctx.createRadialGradient(x0, y0, 0, x0, y0, 30 + Math.random() * 40);
    grad.addColorStop(0, grain);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.04 + Math.random() * 0.06;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.strokeStyle = grain;
  for (let i = 0; i < density; i++) {
    const yBase = (h / density) * i + Math.random() * (h / density);
    ctx.lineWidth = 0.4 + Math.random() * 1.2;
    ctx.globalAlpha = 0.18 + Math.random() * 0.32;
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    let drift = 0;
    for (let x = 0; x < w; x += 4) {
      drift += (Math.random() - 0.5) * 0.8;
      drift *= 0.95;
      ctx.lineTo(x, yBase + drift);
    }
    ctx.stroke();
  }

  for (let i = 0; i < density * 0.3; i++) {
    const yBase = Math.random() * h;
    ctx.lineWidth = 0.2 + Math.random() * 0.3;
    ctx.globalAlpha = 0.03 + Math.random() * 0.05;
    ctx.strokeStyle = base;
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    for (let x = 0; x < w; x += 6) {
      ctx.lineTo(x, yBase + (Math.random() - 0.5) * 1.0);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = grain;
  ctx.globalAlpha = 1;

  const knots = 1 + Math.floor(Math.random() * 2);
  for (let k = 0; k < knots; k++) {
    const kx = 30 + Math.random() * (w - 60);
    const ky = 8 + Math.random() * (h - 16);
    const kr = 2 + Math.random() * 3.5;
    for (let ring = 0; ring < 3; ring++) {
      ctx.globalAlpha = 0.08 + ring * 0.04;
      ctx.strokeStyle = grain;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.ellipse(kx, ky, kr * (1.8 - ring * 0.3), kr * (1.3 - ring * 0.2), Math.random() * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = grain;
    ctx.globalAlpha = 0.10;
    ctx.beginPath();
    ctx.ellipse(kx, ky, kr * 0.6, kr * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      ctx.globalAlpha = 0.03;
      ctx.beginPath();
      ctx.moveTo(kx + Math.cos(angle) * kr, ky + Math.sin(angle) * kr * 0.5);
      ctx.lineTo(kx + Math.cos(angle) * (kr + 6 + Math.random() * 8), ky + Math.sin(angle) * (kr * 0.5 + 1));
      ctx.lineWidth = 0.3;
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
  return canvas;
}

function createWoodNormalCanvas(w = 256, h = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, w, h);
  // Primary grain grooves — more pronounced
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * h;
    ctx.globalAlpha = 0.10 + Math.random() * 0.14;
    const r = 128 + (Math.random() > 0.5 ? 30 : -30);
    ctx.strokeStyle = `rgb(${r}, 128, 255)`;
    ctx.lineWidth = 0.6 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    let drift = 0;
    for (let x = 0; x < w; x += 4) {
      drift += (Math.random() - 0.5) * 0.5;
      drift *= 0.9;
      ctx.lineTo(x, y + drift);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return canvas;
}

const _woodMatCache = new Map();

export function getWoodMaterial(key, base, grain, density, roughness) {
  if (_woodMatCache.has(key)) return _woodMatCache.get(key);
  const canvas = createWoodCanvas(base, grain, density);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);

  const normalCanvas = createWoodNormalCanvas();
  const normalTex = new THREE.CanvasTexture(normalCanvas);
  normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;
  normalTex.repeat.set(1, 1);

  const mat = new THREE.MeshStandardMaterial({
    map: tex, normalMap: normalTex,
    normalScale: new THREE.Vector2(0.3, 0.3),
    color: base, roughness, metalness: 0.02, envMapIntensity: 0.6,
  });
  _woodMatCache.set(key, mat);
  return mat;
}

/* ── Familles bois — palette V2 "maquette premium sculptée" ──────── *
 * Hierarchie franche :
 *   ossature = clair, mat, sobre → recule visuellement
 *   bardage  = dense, riche, chaud → surface principale valorisée
 *   toiture  = sombre, satinée → ancre la silhouette                */
export const WOOD = {
  studs:       { base: '#ccc2b0', grain: '#948878', density: 14, roughness: 0.88 },  // clair mat — recule
  lisses:      { base: '#a88050', grain: '#5e3c20', density: 18, roughness: 0.80 },  // ton bardage — rives visibles comme finition bois
  chevrons:    { base: '#c48850', grain: '#7a4c28', density: 18, roughness: 0.72 },  // miel chaud vif
  framing:     { base: '#a88868', grain: '#5e4838', density: 20, roughness: 0.78 },  // warm distinct
  bracing:     { base: '#c0a048', grain: '#887020', density: 11, roughness: 0.76 },  // dore lisible
  cladding:    { base: '#b07840', grain: '#5c3418', density: 26, roughness: 0.78 },  // walnut riche & dense
  claddingAlt: { base: '#a47038', grain: '#4e2c14', density: 24, roughness: 0.80 },  // variante plus profonde
  voliges:     { base: '#bca078', grain: '#7a6248', density: 16, roughness: 0.80 },
  bastaing:    { base: '#a88058', grain: '#6e5030', density: 16, roughness: 0.76 },
};

/* ── Mode détaillé — couleurs primaires distinctes par famille ──── */
const _colorCodeCache = {};
function getColorCodeMat(hex) {
  if (_colorCodeCache[hex]) return _colorCodeCache[hex];
  const mat = new THREE.MeshStandardMaterial({
    color: hex, roughness: 0.55, metalness: 0.05, envMapIntensity: 0.4,
  });
  _colorCodeCache[hex] = mat;
  return mat;
}
export const COLOR_CODE = {
  studs:    { hex: '#2196F3', label: 'Montants',           get mat() { return getColorCodeMat('#2196F3'); } },
  lisses:   { hex: '#E53935', label: 'Lisses',             get mat() { return getColorCodeMat('#E53935'); } },
  chevrons: { hex: '#FF9800', label: 'Chevrons',           get mat() { return getColorCodeMat('#FF9800'); } },
  framing:  { hex: '#9C27B0', label: 'Linteaux / Seuils',  get mat() { return getColorCodeMat('#9C27B0'); } },
  bracing:  { hex: '#4CAF50', label: 'Contreventement',    get mat() { return getColorCodeMat('#4CAF50'); } },
  voliges:  { hex: '#FFEB3B', label: 'Voliges',            get mat() { return getColorCodeMat('#FFEB3B'); } },
  bastaing: { hex: '#00BCD4', label: 'Bastaings',          get mat() { return getColorCodeMat('#00BCD4'); } },
};

export const NON_WOOD = {
  roof:   '#302824',      // brun-noir chaud — ancre la silhouette
  door:   '#3a2218',      // brun fonce profond
  window: '#93c5fd',
  walls:  '#e7dcc7',
};

/* ── Variantes bardage V2 — walnut riche, ecarts plus marques ──── */
export const CLAD_VARIANTS = [
  { key: 'clad0', base: '#b07840', grain: '#5c3418', density: 26, roughness: 0.78 },
  { key: 'clad1', base: '#a47038', grain: '#4e2c14', density: 24, roughness: 0.80 },
  { key: 'clad2', base: '#b88248', grain: '#644020', density: 28, roughness: 0.77 },
  { key: 'clad3', base: '#9c6834', grain: '#482810', density: 23, roughness: 0.82 },
  { key: 'clad4', base: '#ac7840', grain: '#58361c', density: 25, roughness: 0.79 },
];

/* ══════════════════════════════════════════════════════════════════════
   TEXTURE TOIT — bac acier à nervures
   ══════════════════════════════════════════════════════════════════════ */
function createRoofColorCanvas() {
  const w = 256, h = 16;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Base sombre — brun-noir chaud, ancre la silhouette
  ctx.fillStyle = '#1e1a16';
  ctx.fillRect(0, 0, w, h);

  const nervCount = 10;
  const nw = w / nervCount;
  for (let i = 0; i < nervCount; i++) {
    const x0 = i * nw;
    // Creux — le plus sombre
    ctx.fillStyle = '#1e1a16';
    ctx.fillRect(x0, 0, nw * 0.55, h);
    // Flanc montant
    ctx.fillStyle = '#28221e';
    ctx.fillRect(x0 + nw * 0.55, 0, nw * 0.10, h);
    // Nervure haute — plus claire, capte la lumiere
    ctx.fillStyle = '#38302a';
    ctx.fillRect(x0 + nw * 0.65, 0, nw * 0.22, h);
    // Flanc descendant
    ctx.fillStyle = '#28221e';
    ctx.fillRect(x0 + nw * 0.87, 0, nw * 0.13, h);
  }

  // Reflet speculaire satin sur nervures hautes
  ctx.globalAlpha = 0.20;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < nervCount; i++) {
    ctx.fillRect(i * nw + nw * 0.70, 0, nw * 0.14, h);
  }
  ctx.globalAlpha = 1;

  return canvas;
}

function createRoofNormalCanvas() {
  const w = 256, h = 16;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, w, h);

  const nervCount = 10;
  const nw = w / nervCount;
  for (let i = 0; i < nervCount; i++) {
    const x0 = i * nw;
    ctx.fillStyle = 'rgb(200, 128, 255)';
    ctx.fillRect(x0 + nw * 0.50, 0, nw * 0.10, h);
    ctx.fillStyle = 'rgb(56, 128, 255)';
    ctx.fillRect(x0 + nw * 0.85, 0, nw * 0.15, h);
  }

  return canvas;
}

const _roofMatCache = { top: null };
export function getRoofTopMaterial() {
  if (_roofMatCache.top) return _roofMatCache.top;
  const colorTex = new THREE.CanvasTexture(createRoofColorCanvas());
  colorTex.wrapS = colorTex.wrapT = THREE.RepeatWrapping;
  const normalTex = new THREE.CanvasTexture(createRoofNormalCanvas());
  normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;

  _roofMatCache.top = new THREE.MeshStandardMaterial({
    map: colorTex, normalMap: normalTex,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughness: 0.48, metalness: 0.30, envMapIntensity: 0.7, color: '#ffffff',
  });
  return _roofMatCache.top;
}

/* ══════════════════════════════════════════════════════════════════════
   TEXTURE BÉTON — chape / dalle
   ══════════════════════════════════════════════════════════════════════ */
let _concreteMatCache = null;
export function getConcreteMaterial() {
  if (_concreteMatCache) return _concreteMatCache;
  const w = 256, h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b0aca6';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 600; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 1 + Math.random() * 6;
    ctx.globalAlpha = 0.03 + Math.random() * 0.06;
    ctx.fillStyle = Math.random() > 0.5 ? '#9a968e' : '#c0bbb4';
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.5, r, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 8; i++) {
    ctx.globalAlpha = 0.04 + Math.random() * 0.06;
    ctx.strokeStyle = '#787068';
    ctx.lineWidth = 0.3 + Math.random() * 0.5;
    ctx.beginPath();
    let cx = Math.random() * w, cy = Math.random() * h;
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 5; s++) {
      cx += (Math.random() - 0.5) * 30;
      cy += (Math.random() - 0.5) * 30;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.globalAlpha = 0.03 + Math.random() * 0.04;
    ctx.fillStyle = Math.random() > 0.6 ? '#8a847c' : '#c8c4bc';
    ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
  }

  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);

  _concreteMatCache = new THREE.MeshStandardMaterial({
    map: tex, color: '#b8b4ae', roughness: 0.88, metalness: 0.02, envMapIntensity: 0.3,
  });
  return _concreteMatCache;
}
