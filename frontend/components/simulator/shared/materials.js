/**
 * materials.js — DIY Builder Rendering Standard v1
 *
 * Factory de materiaux proceduraux partagee entre tous les simulateurs.
 * Textures Canvas 2D avec grain bois, sol showroom, beton.
 *
 * Caches module-level — chaque texture n'est cree qu'une seule fois.
 */
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════
   TEXTURE BOIS — grain procedural
   ══════════════════════════════════════════════════════════════════════ */

function createWoodCanvas(base, grain, density = 20, w = 256, h = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Base — fond uni
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // Variations radiales douces (fond)
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

  // Veinage principal — naturel, pas trop lourd
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

  // Veinage clair complementaire (reflets entre les veines)
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

  // Noeuds discrets
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

  // Sillons de grain — identiques au cabanon (40 veines, prononcés)
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

/* ── Cache module-level ── */
const _woodMatCache = new Map();

/**
 * Cree ou retourne un materiau bois avec texture procedurale + normal map.
 *
 * @param {string} key           — cle de cache unique (ex: 'terrasse-boards')
 * @param {string} base          — couleur de base (#hex)
 * @param {string} grain         — couleur des veines (#hex)
 * @param {number} density       — densite du veinage (10-30)
 * @param {number} roughness     — rugosite (0-1)
 * @param {number} envMapIntensity — intensite des reflexions env (defaut 0.6)
 */
/**
 * Cree ou retourne un materiau bois avec texture procedurale + normal map.
 * Harmonise avec CabanonScene/materials.js : normalScale 0.3, base directe.
 *
 * @param {string} key           — cle de cache unique
 * @param {string} base          — couleur de base (#hex)
 * @param {string} grain         — couleur des veines (#hex)
 * @param {number} density       — densite du veinage (10-30)
 * @param {number} roughness     — rugosite (0-1)
 * @param {number} envMapIntensity — intensite des reflexions env (defaut 0.6)
 */
export function getWoodMaterial(key, base, grain, density, roughness, envMapIntensity = 0.6) {
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
    map: tex,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.3, 0.3),
    color: base,
    roughness,
    metalness: 0.02,
    envMapIntensity,
  });
  _woodMatCache.set(key, mat);
  return mat;
}

/**
 * Variante pour surfaces HORIZONTALES (lames terrasse, plancher).
 * PAS de normal map → élimine l'ombre triangulaire causée par la réflexion
 * du preset "studio" sur la face supérieure (qui pointe vers le plafond HDR).
 * envMapIntensity très bas : la texture procédurale seule fournit le grain.
 */
export function getWoodMaterialFlat(key, base, grain, density, roughness, envMapIntensity = 0.15) {
  if (_woodMatCache.has(key)) return _woodMatCache.get(key);

  const canvas = createWoodCanvas(base, grain, density);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: base,
    roughness,
    metalness: 0.01,
    envMapIntensity,
  });
  _woodMatCache.set(key, mat);
  return mat;
}

/* ══════════════════════════════════════════════════════════════════════
   TEXTURE SOL — showroom neutre
   ══════════════════════════════════════════════════════════════════════ */
let _groundMatCache = null;

export function getGroundMaterial() {
  if (_groundMatCache) return _groundMatCache;
  const w = 512, h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e2ddd5';
  ctx.fillRect(0, 0, w, h);

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
   TEXTURE BETON — plots, dalle — v1.1 premium
   ══════════════════════════════════════════════════════════════════════ */
let _concreteMatCache = null;
let _concreteNormalCache = null;

function createConcreteCanvas(w = 512, h = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Base gris chaud
  ctx.fillStyle = '#bab6b0';
  ctx.fillRect(0, 0, w, h);

  // Variation douce de fond — grandes taches
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 20 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, Math.random() > 0.5 ? '#c4c0ba' : '#a8a49e');
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.06 + Math.random() * 0.08;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Granulats fins — texture beton
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 0.5 + Math.random() * 3;
    ctx.globalAlpha = 0.04 + Math.random() * 0.06;
    ctx.fillStyle = Math.random() > 0.5 ? '#9a968e' : '#c8c4bc';
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.2, r, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Micro-fissures subtiles
  for (let i = 0; i < 5; i++) {
    ctx.globalAlpha = 0.03 + Math.random() * 0.04;
    ctx.strokeStyle = '#706860';
    ctx.lineWidth = 0.2 + Math.random() * 0.3;
    ctx.beginPath();
    let cx = Math.random() * w, cy = Math.random() * h;
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 4; s++) {
      cx += (Math.random() - 0.5) * 20;
      cy += (Math.random() - 0.5) * 20;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Pores — petits points sombres typiques du beton
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.globalAlpha = 0.05 + Math.random() * 0.08;
    ctx.fillStyle = '#7a7670';
    ctx.beginPath();
    ctx.arc(x, y, 0.3 + Math.random() * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  return canvas;
}

function createConcreteNormalCanvas(w = 512, h = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, w, h);

  // Perturbations de surface — granulats
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 2 + Math.random() * 8;
    ctx.globalAlpha = 0.08 + Math.random() * 0.10;
    const nx = 128 + (Math.random() - 0.5) * 60;
    const ny = 128 + (Math.random() - 0.5) * 60;
    ctx.fillStyle = `rgb(${nx|0}, ${ny|0}, 255)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  return canvas;
}

export function getConcreteMaterial() {
  if (_concreteMatCache) return _concreteMatCache;

  const canvas = createConcreteCanvas();
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);

  const normalCanvas = createConcreteNormalCanvas();
  const normalTex = new THREE.CanvasTexture(normalCanvas);
  normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;
  normalTex.repeat.set(2, 2);

  _concreteMatCache = new THREE.MeshStandardMaterial({
    map: tex,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.45, 0.45),
    color: '#b5b0a8',
    roughness: 0.85,
    metalness: 0.0,
    envMapIntensity: 0.35,
  });
  return _concreteMatCache;
}
