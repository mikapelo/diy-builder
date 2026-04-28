/**
 * renderPDF.js — Renderer jsPDF générique pour primitives standardisées
 *
 * Itère les couches dans l'ordre LAYERS et dessine chaque primitive
 * sur le document jsPDF fourni.
 *
 * Compatible avec toutes les vues (façade, dessus, coupe, oblique)
 * car il ne connaît que les primitives, pas la projection.
 */
import { LAYERS, flattenLayers } from './primitives.js';
import { LW } from '@/lib/pdf/pdfHelpers.js';

/* ── Épaisseur par défaut selon la couche — ISO 128 simplifié ── */
const LAYER_LW = {
  background:         LW.TRES_FIN,
  contours:           LW.FORT,
  roof:               LW.MOYEN,
  structurePrimary:   LW.MOYEN,
  structureSecondary: LW.FIN,
  openings:           LW.MOYEN,
  framings:           LW.MOYEN,
  outline:            LW.FORT,
  dimensions:         LW.FIN,
  labels:             LW.FIN,
  legend:             LW.FIN,
};

/**
 * Dessine toutes les primitives sur un document jsPDF.
 * @param {jsPDF}  doc     Document jsPDF courant
 * @param {object} layers  Objet { contours: [], roof: [], ... } issu d'un builder
 */
export function renderPDFLayers(doc, layers) {
  const primitives = flattenLayers(layers);
  for (const p of primitives) {
    drawPrimitive(doc, p);
  }
}

/* ── Dispatch par type ─────────────────────────────────────────────── */

function drawPrimitive(doc, p) {
  switch (p.type) {
    case 'line':      return drawLine(doc, p);
    case 'rect':      return drawRect(doc, p);
    case 'circle':    return drawCircle(doc, p);
    case 'polygon':   return drawPolygon(doc, p);
    case 'polyline':  return drawPolyline(doc, p);
    case 'text':      return drawText(doc, p);
    case 'dimension': return drawDimension(doc, p);
    case 'legendItem': return drawLegendItem(doc, p);
  }
}

/* ── Renderers individuels ─────────────────────────────────────────── */

function applyStroke(doc, p) {
  const s = p.stroke ?? [0, 0, 0];
  doc.setDrawColor(...s);
  doc.setLineWidth(p.lineWidth ?? LAYER_LW[p.layer] ?? LW.MOYEN);
  if (p.dash) {
    doc.setLineDashPattern(p.dash, 0);
  } else {
    doc.setLineDashPattern([], 0);
  }
}

function drawLine(doc, p) {
  applyStroke(doc, p);
  doc.line(p.x1, p.y1, p.x2, p.y2);
  if (p.dash) doc.setLineDashPattern([], 0);
}

function drawCircle(doc, p) {
  applyStroke(doc, p);
  if (p.fill) {
    doc.setFillColor(...p.fill);
    doc.circle(p.cx, p.cy, p.r, 'FD');
  } else {
    doc.circle(p.cx, p.cy, p.r, 'S');
  }
}

function drawRect(doc, p) {
  applyStroke(doc, p);
  if (p.fill) {
    doc.setFillColor(...p.fill);
    doc.rect(p.x, p.y, p.w, p.h, 'FD');
  } else {
    doc.rect(p.x, p.y, p.w, p.h, 'S');
  }
}

function drawPolygon(doc, p) {
  if (!p.points || p.points.length < 3) return;
  applyStroke(doc, p);
  // jsPDF ne supporte pas polygon natif → on utilise lines()
  // IMPORTANT : jsPDF.lines() attend des deltas relatifs au point PRÉCÉDENT,
  // pas au premier point. Chaque segment est un déplacement depuis le dernier sommet.
  const [first, ...rest] = p.points;
  const segs = [];
  let prev = first;
  for (const pt of rest) {
    segs.push([pt[0] - prev[0], pt[1] - prev[1]]);
    prev = pt;
  }
  if (p.fill) {
    doc.setFillColor(...p.fill);
    doc.lines(segs, first[0], first[1], [1, 1], 'FD', true);
  } else {
    doc.lines(segs, first[0], first[1], [1, 1], 'S', true);
  }
}

function drawPolyline(doc, p) {
  if (!p.points || p.points.length < 2) return;
  applyStroke(doc, p);
  for (let i = 0; i < p.points.length - 1; i++) {
    doc.line(p.points[i][0], p.points[i][1], p.points[i + 1][0], p.points[i + 1][1]);
  }
}

function drawText(doc, p) {
  const fs = p.fontSize ?? 6;
  const fontStyle = p.fontStyle === 'italic' ? 'italic' : p.fontWeight === 'bold' ? 'bold' : 'normal';
  doc.setFontSize(fs);
  doc.setFont('helvetica', fontStyle);
  const opts = {};
  if (p.align) opts.align = p.align;

  // Fond blanc de protection sous le texte (lisibilité sur fond graphique)
  if (p.bg !== false) {
    const tw = doc.getTextWidth(p.content);
    const th = fs * 0.35;  // approximation hauteur texte en mm
    const pad = 0.6;
    let rx = p.x - pad;
    if (p.align === 'center') rx = p.x - tw / 2 - pad;
    else if (p.align === 'right') rx = p.x - tw - pad;
    const ry = p.y - th - pad;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0);
    doc.rect(rx, ry, tw + pad * 2, th + pad * 2, 'F');
  }

  doc.setTextColor(...(p.color ?? [30, 30, 30]));
  doc.text(p.content, p.x, p.y, opts);
}

function drawDimension(doc, p) {
  const stroke = p.stroke ?? [50, 50, 50];
  const lw = p.lineWidth ?? LW.FIN;
  const fs = p.fontSize ?? 6;
  const tick = 1.5;

  doc.setDrawColor(...stroke);
  doc.setLineWidth(lw);

  if (p.dash) {
    doc.setLineDashPattern(p.dash, 0);
  } else {
    doc.setLineDashPattern([], 0);
  }

  doc.setFontSize(fs);
  doc.setFont('helvetica', 'normal');

  if (p.dir === 'h') {
    // Horizontal : a,b = x coords ; pos = y coord
    doc.line(p.a, p.pos, p.b, p.pos);
    doc.line(p.a, p.pos - tick, p.a, p.pos + tick);
    doc.line(p.b, p.pos - tick, p.b, p.pos + tick);
    // Fond blanc sous le label de cote
    const tw = doc.getTextWidth(p.label);
    const th = fs * 0.35;
    const pad = 0.5;
    const lx = (p.a + p.b) / 2 - tw / 2 - pad;
    const ly = p.pos - 1.8 - th - pad;
    doc.setFillColor(255, 255, 255);
    doc.rect(lx, ly, tw + pad * 2, th + pad * 2, 'F');
    doc.setTextColor(...stroke);
    doc.text(p.label, (p.a + p.b) / 2, p.pos - 1.8, { align: 'center' });
  } else {
    // Vertical : a,b = y coords ; pos = x coord
    doc.line(p.pos, p.a, p.pos, p.b);
    doc.line(p.pos - tick, p.a, p.pos + tick, p.a);
    doc.line(p.pos - tick, p.b, p.pos + tick, p.b);
    // Fond blanc sous le label de cote
    const tw = doc.getTextWidth(p.label);
    const th = fs * 0.35;
    const pad = 0.5;
    const lx = p.pos - 2 - tw - pad;
    const ly = (p.a + p.b) / 2 + 1.5 - th - pad;
    doc.setFillColor(255, 255, 255);
    doc.rect(lx, ly, tw + pad * 2, th + pad * 2, 'F');
    doc.setTextColor(...stroke);
    doc.text(p.label, p.pos - 2, (p.a + p.b) / 2 + 1.5, { align: 'right' });
  }

  if (p.dash) doc.setLineDashPattern([], 0);
}

function drawLegendItem(doc, p) {
  if (p.fill) {
    // Rectangle rempli (linteaux)
    doc.setFillColor(...p.fill);
    doc.setDrawColor(...p.color);
    doc.setLineWidth(p.lineWidth ?? 0.5);
    doc.rect(p.x, p.y - 2, 8, 3, 'FD');
  } else {
    // Trait simple
    doc.setDrawColor(...p.color);
    doc.setLineWidth(p.lineWidth ?? 0.4);
    doc.line(p.x, p.y, p.x + 8, p.y);
  }
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 60);
  doc.text(p.label, p.x + 11, p.y + 0.5);
}
