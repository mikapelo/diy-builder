/**
 * canvasCapture.js — Capture 3D du canvas Three.js pour l'export PDF
 *
 * Responsabilités :
 *   - Projection 3D→2D
 *   - Lignes de cotes projetées sur canvas
 *   - Preset caméra export
 *   - Double capture assembled/detailed + composite gradient
 *   - Post-traitement N&B contrasté
 *
 * Consomme le bridge d'export (camera, gl, scene, controls, setSceneMode, setShowHuman)
 * via la fonction getBridge passée en paramètre.
 *
 * Bug 1 fix : la silhouette d'échelle (showHuman) est désactivée pendant la capture
 * pour ne pas apparaître dans le PDF, puis restaurée à la valeur initiale.
 */
import { Vector3 } from 'three';

/* ── Helpers ──────────────────────────────────────────────────────── */
const nextFrame = () => new Promise(r => requestAnimationFrame(r));

/**
 * Projette un point 3D (monde) → 2D (pixels canvas).
 */
function proj3D(x, y, z, camera, cw, ch) {
  const v = new Vector3(x, y, z).project(camera);
  return { x: (v.x * 0.5 + 0.5) * cw, y: (-v.y * 0.5 + 0.5) * ch };
}

/* ── Style des cotes ─────────────────────────────────────────────── */
const DIM_COLOR   = '#2a2a30';
const DIM_LW      = 1.4;
const TICK        = 6;          // longueur tick en px
const LABEL_FONT  = 'bold 13px Inter, Helvetica, sans-serif';
const LABEL_SMALL = '11px Inter, Helvetica, sans-serif';

/**
 * Dessine une ligne de cote entre deux points projetés.
 */
function drawDimLine(ctx, a, b, label, offset, opts = {}) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 8) return;
  const nx = -dy / len, ny = dx / len;
  const off = offset;

  const a2 = { x: a.x + nx * off, y: a.y + ny * off };
  const b2 = { x: b.x + nx * off, y: b.y + ny * off };

  ctx.save();
  ctx.strokeStyle = opts.color ?? DIM_COLOR;
  ctx.lineWidth = opts.lw ?? DIM_LW;
  ctx.setLineDash([]);

  // Extensions lines
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y); ctx.lineTo(a2.x + nx * 3, a2.y + ny * 3);
  ctx.moveTo(b.x, b.y); ctx.lineTo(b2.x + nx * 3, b2.y + ny * 3);
  ctx.stroke();

  // Dimension line
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y);
  ctx.stroke();

  // Ticks
  const tdx = dx / len * TICK / 2, tdy = dy / len * TICK / 2;
  ctx.beginPath();
  ctx.moveTo(a2.x - tdx, a2.y - tdy); ctx.lineTo(a2.x + tdx, a2.y + tdy);
  ctx.moveTo(b2.x - tdx, b2.y - tdy); ctx.lineTo(b2.x + tdx, b2.y + tdy);
  ctx.stroke();

  // Label
  ctx.globalAlpha = 1;
  const cx = (a2.x + b2.x) / 2, cy = (a2.y + b2.y) / 2;
  ctx.font = opts.font ?? LABEL_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const metrics = ctx.measureText(label);
  const pad = 3;
  ctx.fillStyle = 'rgba(245,243,240,0.82)';
  ctx.fillRect(cx - metrics.width / 2 - pad, cy - 8, metrics.width + pad * 2, 16);
  ctx.fillStyle = opts.color ?? DIM_COLOR;
  ctx.fillText(label, cx, cy);

  ctx.restore();
}

/**
 * Dessine les cotes 3D projetées sur le canvas 2D.
 */
function drawDimensionOverlay(ctx, camera, w, d, h, slope, cw, ch) {
  const hw = w / 2, hd = d / 2;
  const hH = h + slope;

  const bfl = proj3D(-hw, 0,  hd, camera, cw, ch);
  const bfr = proj3D( hw, 0,  hd, camera, cw, ch);
  const bbr = proj3D( hw, 0, -hd, camera, cw, ch);
  const tfl = proj3D(-hw, h,   hd, camera, cw, ch);
  const tfr = proj3D( hw, hH,  hd, camera, cw, ch);
  const tbr = proj3D( hw, hH, -hd, camera, cw, ch);

  drawDimLine(ctx, bfl, bfr, `${w.toFixed(2)} m`, 28);
  drawDimLine(ctx, bfr, bbr, `${d.toFixed(2)} m`, 28);
  drawDimLine(ctx, bfl, tfl, `${h.toFixed(2)} m`, -28);
  drawDimLine(ctx, bfr, tfr, `${hH.toFixed(2)} m`, 22, { font: LABEL_SMALL });

  const roofMid = {
    x: (tfr.x + tbr.x) / 2,
    y: (tfr.y + tbr.y) / 2 - 12,
  };
  const pct = (slope / w * 100).toFixed(1);
  ctx.save();
  ctx.font = '11px Inter, Helvetica, sans-serif';
  ctx.fillStyle = 'rgba(35,35,42,0.7)';
  ctx.textAlign = 'center';
  const pm = ctx.measureText(`Pente ${pct}%`);
  ctx.fillStyle = 'rgba(245,243,240,0.75)';
  ctx.fillRect(roofMid.x - pm.width / 2 - 4, roofMid.y - 8, pm.width + 8, 16);
  ctx.fillStyle = 'rgba(35,35,42,0.72)';
  ctx.fillText(`Pente ${pct}%`, roofMid.x, roofMid.y);
  ctx.restore();
}

/**
 * Post-traitement : désaturation warm contrastée.
 */
function processImageTechnical(srcDataURL) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const cvs = document.createElement('canvas');
      cvs.width = img.width;
      cvs.height = img.height;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
      const px = imgData.data;

      const sat      = 0.05;
      const warmR = 3, warmG = 1, warmB = -2;
      const contrast = 1.40;
      const midpoint = 125;
      const gamma    = 0.92;

      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        let lum = 0.299 * r + 0.587 * g + 0.114 * b;
        lum = midpoint + (lum - midpoint) * contrast;
        lum = Math.max(0, Math.min(255, lum));
        lum = 255 * Math.pow(lum / 255, 1 / gamma);
        lum = Math.max(0, Math.min(255, lum));
        px[i]     = Math.min(255, Math.max(0, Math.round(lum + (r - lum) * sat + warmR)));
        px[i + 1] = Math.min(255, Math.max(0, Math.round(lum + (g - lum) * sat + warmG)));
        px[i + 2] = Math.min(255, Math.max(0, Math.round(lum + (b - lum) * sat + warmB)));
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(cvs.toDataURL('image/jpeg', 0.93));
    };
    img.onerror = () => resolve(srcDataURL);
    img.src = srcDataURL;
  });
}

/**
 * Applique le preset caméra export 3/4 face.
 */
function applyCameraPreset(camera, controls, w, d, h) {
  const dist = Math.max(w, d) * 2.2;
  camera.position.set(dist * 0.85, h * 1.8, dist * 0.75);
  camera.fov = 32;
  camera.updateProjectionMatrix();
  const tgt = { x: 0, y: h * 0.38, z: 0 };
  camera.lookAt(tgt.x, tgt.y, tgt.z);
  if (controls) {
    controls.target.set(tgt.x, tgt.y, tgt.z);
    controls.update();
  }
}

/**
 * Composite deux captures via un masque gradient diagonal.
 */
function compositeHybrid(canvasA, canvasB) {
  const cw = canvasA.width, ch = canvasA.height;
  const out = document.createElement('canvas');
  out.width = cw;
  out.height = ch;
  const ctx = out.getContext('2d');

  ctx.drawImage(canvasA, 0, 0);

  const maskCvs = document.createElement('canvas');
  maskCvs.width = cw;
  maskCvs.height = ch;
  const mctx = maskCvs.getContext('2d');

  mctx.drawImage(canvasB, 0, 0);

  mctx.globalCompositeOperation = 'destination-in';
  const grad = mctx.createLinearGradient(0, ch, cw * 0.55, ch * 0.25);
  grad.addColorStop(0,    'rgba(0,0,0,0.55)');
  grad.addColorStop(0.25, 'rgba(0,0,0,0.35)');
  grad.addColorStop(0.50, 'rgba(0,0,0,0.10)');
  grad.addColorStop(1,    'rgba(0,0,0,0)');
  mctx.fillStyle = grad;
  mctx.fillRect(0, 0, cw, ch);

  ctx.drawImage(maskCvs, 0, 0);

  return out;
}

/**
 * Capture le canvas Three.js pour la page 1 du PDF — double capture.
 *
 * @param {object} materials  Données matériaux (avec geometry pour le cabanon)
 * @param {function} getBridge  Fonction retournant le bridge d'export (depuis ExportContext)
 * @returns {Promise<string|null>}  Data URL JPEG de l'image composite, ou null si pas de canvas
 */
export async function capture3DForExport(materials, getBridge) {
  const canvas = document.querySelector('canvas');
  if (!canvas) return null;

  const bridge = typeof getBridge === 'function' ? getBridge() : null;
  if (!bridge) return canvas.toDataURL('image/jpeg', 0.92);

  const { camera, gl, scene, controls, setSceneMode, showHuman, setShowHuman } = bridge;

  const geo   = materials?.geometry;
  const w     = geo?.dimensions?.width  ?? 4;
  const d     = geo?.dimensions?.depth  ?? 3;
  const h     = geo?.dimensions?.height ?? 2.3;
  const slope = geo?.dimensions?.slope  ?? 0.82;
  const cw    = canvas.width, ch = canvas.height;

  /* ── 1. Sauvegarder ── */
  const savedPos    = camera.position.clone();
  const savedTarget = controls?.target?.clone();
  const savedFov    = camera.fov;
  const savedShowHuman = !!showHuman;

  /* ── 1b. Désactiver la silhouette d'échelle pendant la capture (Bug 1) ── */
  if (savedShowHuman && typeof setShowHuman === 'function') {
    setShowHuman(false);
    await nextFrame(); await nextFrame();
  }

  /* ── 2. Preset caméra ── */
  applyCameraPreset(camera, controls, w, d, h);

  /* ── 3. Capture A — mode assembled ── */
  if (setSceneMode) {
    setSceneMode('assembled');
    await nextFrame(); await nextFrame(); await nextFrame();
  }
  gl.render(scene, camera);
  const cvsA = document.createElement('canvas');
  cvsA.width = cw; cvsA.height = ch;
  cvsA.getContext('2d').drawImage(canvas, 0, 0);

  /* ── 4. Capture B — mode detailed ── */
  if (setSceneMode) {
    setSceneMode('detailed');
    await nextFrame(); await nextFrame(); await nextFrame();
  }
  gl.render(scene, camera);
  const cvsB = document.createElement('canvas');
  cvsB.width = cw; cvsB.height = ch;
  cvsB.getContext('2d').drawImage(canvas, 0, 0);

  /* ── 5. Composite hybride ── */
  const hybrid = compositeHybrid(cvsA, cvsB);

  /* ── 6. Cotes projetées ── */
  const ctx2d = hybrid.getContext('2d');
  drawDimensionOverlay(ctx2d, camera, w, d, h, slope, cw, ch);

  const annotatedDataURL = hybrid.toDataURL('image/jpeg', 0.95);

  /* ── 7. Post-traitement N&B contrasté ── */
  const finalDataURL = await processImageTechnical(annotatedDataURL);

  /* ── 8. Restaurer mode + caméra + silhouette ── */
  if (setSceneMode) setSceneMode('assembled');
  if (savedShowHuman && typeof setShowHuman === 'function') {
    setShowHuman(true);
  }
  camera.position.copy(savedPos);
  camera.fov = savedFov;
  camera.updateProjectionMatrix();
  if (controls && savedTarget) {
    controls.target.copy(savedTarget);
    controls.update();
  }
  await nextFrame();
  gl.render(scene, camera);

  return finalDataURL;
}

/**
 * Capture générique du canvas Three.js pour tout module (terrasse, pergola, clôture).
 * Pas de changement de mode ni de composite — simple capture JPEG de l'état courant.
 *
 * @param {function} [getBridge]  Optionnel — si présent, force un render avant capture
 * @returns {Promise<string|null>}  Data URL JPEG, ou null si pas de canvas
 */
export async function captureCanvasSnapshot(getBridge) {
  const canvas = document.querySelector('canvas');
  if (!canvas) return null;

  const bridge = typeof getBridge === 'function' ? getBridge() : null;

  /* ── Bug 1 fix : désactiver la silhouette d'échelle pendant la capture ── */
  let savedShowHuman = false;
  let setShowHuman = null;
  if (bridge) {
    savedShowHuman = !!bridge.showHuman;
    setShowHuman = bridge.setShowHuman;
    if (savedShowHuman && typeof setShowHuman === 'function') {
      setShowHuman(false);
      await nextFrame(); await nextFrame();
    }
  }

  if (bridge) {
    const { camera, gl, scene } = bridge;
    gl.render(scene, camera);
    await nextFrame();
  }

  const rawDataURL = canvas.toDataURL('image/jpeg', 0.92);

  /* ── Restaurer la silhouette si elle était activée ── */
  if (savedShowHuman && typeof setShowHuman === 'function') {
    setShowHuman(true);
  }

  /* Appliquer le même filtre N&B contrasté que le cabanon */
  return processImageTechnical(rawDataURL);
}
