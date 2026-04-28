'use client';

import { SECTION as SEC } from '@/lib/cabanonConstants.js';

/**
 * CabanonSketch.jsx — Vue technique oblique SVG (plan enrichi v2)
 *
 * Projection cabinet oblique (30°, ratio 0.5) :
 *   - Façade visible de face (X = largeur, Y = hauteur)
 *   - Profondeur projetée en fuite à 30° vers la droite/haut
 *   - Toiture mono-pente complète avec chevrons
 *   - Structure complète : montants (structuralStuds), lisses, linteaux, encadrements
 *   - Cotations 3 axes avec flèches triangulaires
 *
 * Consomme structure.geometry (produit par generateCabanon).
 * Rendu pur SVG React, zéro dépendance externe.
 */
export default function CabanonSketch({ geometry }) {
  if (!geometry) return null;

  const { dimensions, structuralStuds, framings, openings, chevrons, roofEntretoises } = geometry;
  const { width, depth, height, slope } = dimensions;

  /* ── Projection oblique (cabinet) ─────────────────────────────────── */
  const SCALE   = 90;
  const FUITE_A = Math.PI / 6;
  const FUITE_R = 0.5;
  const fX      = Math.cos(FUITE_A) * FUITE_R * SCALE;
  const fY      = Math.sin(FUITE_A) * FUITE_R * SCALE;

  const PAD_L = 80;
  const PAD_R = 80;
  const PAD_T = 40;
  const PAD_B = 60;

  const maxH  = height + slope;
  const VB_W  = PAD_L + width * SCALE + depth * fX / SCALE * SCALE + PAD_R;
  const VB_H  = PAD_T + maxH * SCALE + depth * fY / SCALE * SCALE + PAD_B;

  const ox = PAD_L;
  const oy = PAD_T + maxH * SCALE + depth * fY / SCALE * SCALE;

  const px = (x, z = 0) => ox + x * SCALE + z * fX;
  const py = (y, z = 0) => oy - y * SCALE - z * fY;

  /* ── Palette technique ────────────────────────────────────────────── */
  const C = {
    bg:       '#f7f9fb',
    ground:   '#e8edf2',
    fill:     '#eef2f6',
    side:     '#dce3ea',
    roofTop:  '#c8d0d8',
    roofSide: '#b0bbc6',
    primary:  '#2d3a45',
    second:   '#5a6d7e',
    studMain: '#4a6070',       // montants structurels (king, coin) — plus foncé
    studReg:  '#9aaab8',       // montants réguliers — plus visible
    studJack: '#6a8090',       // jack studs
    lisse:    '#3a5060',       // lisses — très renforcé
    framing:  '#4a6575',       // linteaux — plus contrasté
    chevron:  '#5a7585',       // chevrons — plus visible
    entretoise: '#7a9095',   // entretoises toiture — discret
    dim:      '#3a4a5a',       // lignes de cote — plus contrasté
    dimTxt:   '#1d2a35',       // texte cote — plus noir
    dimTick:  '#4a5a6a',
    dimArrow: '#3a4a5a',
    label:    '#7a8d9e',
    doorFill: '#d8e4d8',
    doorStk:  '#3a6b3e',
    winFill:  'rgba(185,215,245,0.5)',
    winStk:   '#5a7a90',
  };
  const FONT = 'Inter, system-ui, sans-serif';

  /* ── Helpers géométriques ─────────────────────────────────────────── */
  const pt = (x, y, z = 0) => `${px(x, z).toFixed(1)},${py(y, z).toFixed(1)}`;
  const ln = (x1, y1, z1, x2, y2, z2) => ({
    x1: px(x1, z1), y1: py(y1, z1), x2: px(x2, z2), y2: py(y2, z2),
  });

  /* ── Points clés ──────────────────────────────────────────────────── */
  const F = { bl: [0,0,0], br: [width,0,0], tl: [0,height,0], tr: [width,height+slope,0] };
  const B = { bl: [0,0,depth], br: [width,0,depth], tl: [0,height,depth], tr: [width,height+slope,depth] };

  /* ── Polygones principaux ─────────────────────────────────────────── */
  const facadePts = [pt(...F.bl), pt(...F.br), pt(...F.tr), pt(...F.tl)].join(' ');
  const sidePts   = [pt(...F.br), pt(...B.br), pt(...B.tr), pt(...F.tr)].join(' ');
  const roofPts   = [pt(...F.tl), pt(...F.tr), pt(...B.tr), pt(...B.tl)].join(' ');

  const RT = 0.06;
  const roofEdgePts = [pt(0,height,0), pt(0,height-RT,0), pt(width,height+slope-RT,0), pt(width,height+slope,0)].join(' ');
  const roofSidePts = [pt(width,height+slope,0), pt(width,height+slope-RT,0), pt(width,height+slope-RT,depth), pt(width,height+slope,depth)].join(' ');

  /* ── Montants façade (structuralStuds, y proche de 0, sans jack studs) ── */
  const facadeStuds = (structuralStuds || []).filter(s =>
    Math.abs(s.y) < SEC * 2 && s.type !== 'jack'
  );

  /* Classification des montants par proximité aux ouvertures */
  const wallOps = (openings || []).filter(o => o.wall === 0);
  const isKing = (x) => wallOps.some(o =>
    Math.abs(x - o.u) < SEC * 1.5 || Math.abs(x - (o.u + o.width)) < SEC * 1.5
  );
  const isCorner = (x) => x < SEC * 2 || x > width - SEC * 2;

  /* ── Ouvertures façade ────────────────────────────────────────────── */
  const door = openings?.find(o => o.type === 'door' && o.wall === 0);
  const win  = openings?.find(o => o.type === 'window' && o.wall === 0);

  /* ── Framings (linteaux + seuils, wall 0) ─────────────────────────── */
  const facadeFramings = (framings || []).filter(f => f.wall === 0);

  /* ── Chevrons ─────────────────────────────────────────────────────── */
  const chevronsData = (chevrons || []).filter(c => c.y <= depth);

  /* ── Flèche cotation (triangle rempli) ────────────────────────────── */
  const ARR = 5; // taille flèche
  const TK  = 6;

  /* Flèche horizontale : direction = 'left' | 'right' */
  const hArrow = (cx, cy, dir) => {
    const d = dir === 'right' ? 1 : -1;
    return `M${cx},${cy} L${cx - d * ARR},${cy - ARR * 0.6} L${cx - d * ARR},${cy + ARR * 0.6} Z`;
  };
  /* Flèche verticale : direction = 'up' | 'down' */
  const vArrow = (cx, cy, dir) => {
    const d = dir === 'up' ? -1 : 1;
    return `M${cx},${cy} L${cx - ARR * 0.6},${cy + d * ARR} L${cx + ARR * 0.6},${cy + d * ARR} Z`;
  };

  return (
    <div className="deck-preview cabanon-sketch-wrap">
      <svg
        viewBox={`0 0 ${VB_W.toFixed(0)} ${VB_H.toFixed(0)}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-label={`Plan technique — cabanon ${width}×${depth}×${height} m`}
      >
        {/* ── Fond ── */}
        <rect x="0" y="0" width={VB_W} height={VB_H} fill={C.bg} />

        {/* ── Zone sol ── */}
        <polygon
          points={[pt(0,0,0), pt(width,0,0), pt(width,0,depth), pt(0,0,depth)].join(' ')}
          fill={C.ground} stroke="none" opacity="0.5"
        />

        {/* ── Titre ── */}
        <text x={VB_W / 2} y={PAD_T - 16} textAnchor="middle" fontSize="11" fill={C.primary}
          fontFamily={FONT} letterSpacing="2.5" fontWeight="600">
          PLAN TECHNIQUE
        </text>

        {/* ═══════════════════════════════════════════════════════════════ *
         *  COUCHE 1 — Remplissages                                       *
         * ═══════════════════════════════════════════════════════════════ */}
        <polygon points={sidePts} fill={C.side} stroke="none" />
        <polygon points={facadePts} fill={C.fill} stroke="none" />
        <polygon points={roofPts} fill={C.roofTop} stroke="none" />
        <polygon points={roofEdgePts} fill={C.roofSide} stroke="none" />
        <polygon points={roofSidePts} fill={C.roofSide} stroke="none" />

        {/* ═══════════════════════════════════════════════════════════════ *
         *  COUCHE 2 — Structure                                          *
         * ═══════════════════════════════════════════════════════════════ */}

        {/* ── Montants façade — différenciés ── */}
        {facadeStuds.map((s, i) => {
          const x = s.x;
          const h = s.height;
          const base = s.zBase || 0;
          const king = isKing(x);
          const corner = isCorner(x);
          const color = (king || corner) ? C.studMain : C.studReg;
          const sw = (king || corner) ? 1.6 : 0.8;
          return <line key={`s${i}`} {...ln(x, base, 0, x, h, 0)} stroke={color} strokeWidth={sw} />;
        })}

        {/* ── Linteaux + seuils (framings) — double trait ── */}
        {facadeFramings.map((f, i) => (
          <g key={`f${i}`}>
            <line {...ln(f.u, f.v, 0, f.u + f.w, f.v, 0)} stroke={C.framing} strokeWidth="2.2" />
            <line {...ln(f.u, f.v + f.hh, 0, f.u + f.w, f.v + f.hh, 0)} stroke={C.framing} strokeWidth="1.2" />
          </g>
        ))}

        {/* ── Lisses basses — trait fort ── */}
        <line {...ln(0, 0, 0, width, 0, 0)} stroke={C.lisse} strokeWidth="2.5" />
        <line {...ln(0, 0, depth, width, 0, depth)} stroke={C.lisse} strokeWidth="1" strokeDasharray="4 2" />

        {/* ── Lisses hautes — pente, trait fort ── */}
        <line {...ln(0, height, 0, width, height + slope, 0)} stroke={C.lisse} strokeWidth="2.5" />
        <line {...ln(0, height, depth, width, height + slope, depth)} stroke={C.lisse} strokeWidth="1" strokeDasharray="4 2" />

        {/* ── Lisses latérales (côté droit visible) ── */}
        <line {...ln(width, 0, 0, width, 0, depth)} stroke={C.lisse} strokeWidth="1.4" />
        <line {...ln(width, height + slope, 0, width, height + slope, depth)} stroke={C.lisse} strokeWidth="1.4" strokeDasharray="4 2" />

        {/* ── Chevrons toit (avec débord, trait renforcé) ── */}
        {chevronsData.map((c, i) => {
          const z = c.y;
          return <line key={`ch${i}`} {...ln(-0.20, height, z, width + 0.20, height + slope, z)}
            stroke={C.chevron} strokeWidth="0.9" />;
        })}

        {/* ── Entretoises toiture (entre chevrons, en quinconce) ── */}
        {(roofEntretoises || []).map((e, i) => {
          const roofY = height + (e.x / width) * slope;
          const z1 = e.yCenter - e.segLen / 2;
          const z2 = e.yCenter + e.segLen / 2;
          return <line key={`re${i}`} {...ln(e.x, roofY, z1, e.x, roofY, z2)}
            stroke={C.entretoise} strokeWidth="0.6" />;
        })}

        {/* ── Porte ── */}
        {door && (() => {
          const dx = door.u, dw = door.width, dh = door.height;
          return (
            <g>
              <polygon
                points={[pt(dx,0,0), pt(dx+dw,0,0), pt(dx+dw,dh,0), pt(dx,dh,0)].join(' ')}
                fill={C.doorFill} stroke={C.doorStk} strokeWidth="1.8" strokeLinejoin="round"
              />
              <line {...ln(dx, dh*0.6, 0, dx+dw, dh*0.6, 0)} stroke={C.doorStk} strokeWidth="0.7" />
              <circle cx={px(dx + dw*0.82, 0)} cy={py(dh*0.45, 0)} r="2.5" fill={C.doorStk} />
              {/* Seuil renforcé */}
              <line {...ln(dx - 0.02, 0, 0, dx + dw + 0.02, 0, 0)} stroke={C.doorStk} strokeWidth="2.5" />
            </g>
          );
        })()}

        {/* ── Fenêtre ── */}
        {win && (() => {
          const wx = win.u, wy = win.v, ww = win.width, wh = win.height;
          return (
            <g>
              <polygon
                points={[pt(wx,wy,0), pt(wx+ww,wy,0), pt(wx+ww,wy+wh,0), pt(wx,wy+wh,0)].join(' ')}
                fill={C.winFill} stroke={C.winStk} strokeWidth="1.6" strokeLinejoin="round"
              />
              {/* Double cadre intérieur */}
              <polygon
                points={[
                  `${px(wx,0)+3},${py(wy+wh,0)+3}`,
                  `${px(wx+ww,0)-3},${py(wy+wh,0)+3}`,
                  `${px(wx+ww,0)-3},${py(wy,0)-3}`,
                  `${px(wx,0)+3},${py(wy,0)-3}`,
                ].join(' ')}
                fill="none" stroke={C.winStk} strokeWidth="0.5"
              />
              <line {...ln(wx+ww/2, wy, 0, wx+ww/2, wy+wh, 0)} stroke={C.winStk} strokeWidth="0.8" />
              <line {...ln(wx, wy+wh/2, 0, wx+ww, wy+wh/2, 0)} stroke={C.winStk} strokeWidth="0.8" />
              {/* Appui fenêtre */}
              <line {...ln(wx-0.03, wy, 0, wx+ww+0.03, wy, 0)} stroke={C.winStk} strokeWidth="2" />
            </g>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════════════ *
         *  COUCHE 3 — Contours principaux                                *
         * ═══════════════════════════════════════════════════════════════ */}
        <polygon points={facadePts} fill="none" stroke={C.primary} strokeWidth="2.8" strokeLinejoin="round" />
        <polygon points={sidePts} fill="none" stroke={C.primary} strokeWidth="2" strokeLinejoin="round" />
        <polygon points={roofPts} fill="none" stroke={C.primary} strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points={roofEdgePts} fill="none" stroke={C.primary} strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points={roofSidePts} fill="none" stroke={C.primary} strokeWidth="1.8" strokeLinejoin="round" />

        {/* Arêtes arrière (sol) */}
        <line {...ln(0, 0, depth, width, 0, depth)} stroke={C.second} strokeWidth="1" strokeDasharray="6 3" />
        <line {...ln(0, 0, 0, 0, 0, depth)} stroke={C.second} strokeWidth="1" strokeDasharray="6 3" />

        {/* ═══════════════════════════════════════════════════════════════ *
         *  COUCHE 4 — Cotations avec flèches                             *
         * ═══════════════════════════════════════════════════════════════ */}

        {/* ── Largeur ── */}
        {(() => {
          const cy = py(0, 0) + 26;
          const x1 = px(0, 0), x2 = px(width, 0);
          return (
            <g>
              {/* Lignes de rappel */}
              <line x1={x1} y1={py(0,0)+4} x2={x1} y2={cy+2} stroke={C.dimTick} strokeWidth="0.5" />
              <line x1={x2} y1={py(0,0)+4} x2={x2} y2={cy+2} stroke={C.dimTick} strokeWidth="0.5" />
              {/* Ligne de cote */}
              <line x1={x1+ARR} y1={cy} x2={x2-ARR} y2={cy} stroke={C.dim} strokeWidth="0.9" />
              {/* Flèches */}
              <path d={hArrow(x1, cy, 'right')} fill={C.dimArrow} />
              <path d={hArrow(x2, cy, 'left')} fill={C.dimArrow} />
              <text x={(x1+x2)/2} y={cy+14} textAnchor="middle" fontSize="11" fill={C.dimTxt} fontFamily={FONT} fontWeight="600">
                {width.toFixed(2)} m
              </text>
            </g>
          );
        })()}

        {/* ── Hauteur basse ── */}
        {(() => {
          const cx = px(0, 0) - 24;
          const y1 = py(0, 0), y2 = py(height, 0);
          const mid = (y1 + y2) / 2;
          return (
            <g>
              <line x1={px(0,0)-4} y1={y1} x2={cx-2} y2={y1} stroke={C.dimTick} strokeWidth="0.5" />
              <line x1={px(0,0)-4} y1={y2} x2={cx-2} y2={y2} stroke={C.dimTick} strokeWidth="0.5" />
              <line x1={cx} y1={y1-ARR} x2={cx} y2={y2+ARR} stroke={C.dim} strokeWidth="0.9" />
              <path d={vArrow(cx, y1, 'down')} fill={C.dimArrow} />
              <path d={vArrow(cx, y2, 'up')} fill={C.dimArrow} />
              <text x={cx} y={mid} textAnchor="middle" fontSize="10" fill={C.dimTxt} fontFamily={FONT} fontWeight="600"
                transform={`rotate(-90, ${cx}, ${mid})`}>
                {height.toFixed(2)} m
              </text>
            </g>
          );
        })()}

        {/* ── Hauteur haute ── */}
        {(() => {
          const cx = px(0, 0) - 52;
          const y1 = py(0, 0), y2 = py(maxH, 0);
          const mid = (y1 + y2) / 2;
          return (
            <g>
              <line x1={px(0,0)-4} y1={y2} x2={cx-2} y2={y2} stroke={C.dimTick} strokeWidth="0.5" />
              <line x1={cx} y1={y1-ARR} x2={cx} y2={y2+ARR} stroke={C.dim} strokeWidth="0.9" />
              <path d={vArrow(cx, y1, 'down')} fill={C.dimArrow} />
              <path d={vArrow(cx, y2, 'up')} fill={C.dimArrow} />
              <text x={cx} y={mid} textAnchor="middle" fontSize="10" fill={C.dimTxt} fontFamily={FONT} fontWeight="600"
                transform={`rotate(-90, ${cx}, ${mid})`}>
                {maxH.toFixed(2)} m
              </text>
            </g>
          );
        })()}

        {/* ── Profondeur (en fuite) ── */}
        {(() => {
          const off = 20;
          const x1 = px(width, 0) + off, y1v = py(0, 0) + off * 0.5;
          const x2 = px(width, depth) + off, y2v = py(0, depth) + off * 0.5;
          const mx = (x1+x2)/2, my = (y1v+y2v)/2;
          const ang = Math.atan2(y2v - y1v, x2 - x1);
          const angDeg = ang * (180 / Math.PI);
          const cosA = Math.cos(ang), sinA = Math.sin(ang);
          // Flèches obliques
          const arr1 = `M${x1},${y1v} L${x1+cosA*ARR+sinA*ARR*0.6},${y1v+sinA*ARR-cosA*ARR*0.6} L${x1+cosA*ARR-sinA*ARR*0.6},${y1v+sinA*ARR+cosA*ARR*0.6} Z`;
          const arr2 = `M${x2},${y2v} L${x2-cosA*ARR+sinA*ARR*0.6},${y2v-sinA*ARR-cosA*ARR*0.6} L${x2-cosA*ARR-sinA*ARR*0.6},${y2v-sinA*ARR+cosA*ARR*0.6} Z`;
          return (
            <g>
              {/* Lignes de rappel */}
              <line x1={px(width,0)+4} y1={py(0,0)+2} x2={x1+2} y2={y1v+1} stroke={C.dimTick} strokeWidth="0.5" />
              <line x1={px(width,depth)+4} y1={py(0,depth)+2} x2={x2+2} y2={y2v+1} stroke={C.dimTick} strokeWidth="0.5" />
              <line x1={x1} y1={y1v} x2={x2} y2={y2v} stroke={C.dim} strokeWidth="0.9" />
              <path d={arr1} fill={C.dimArrow} />
              <path d={arr2} fill={C.dimArrow} />
              <text x={mx+10} y={my-7} textAnchor="middle" fontSize="10" fill={C.dimTxt} fontFamily={FONT} fontWeight="600"
                transform={`rotate(${angDeg}, ${mx+10}, ${my-7})`}>
                {depth.toFixed(2)} m
              </text>
            </g>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════════════ *
         *  COUCHE 5 — Cotations détaillées (ouvertures, structure, toit)  *
         * ═══════════════════════════════════════════════════════════════ */}

        {/* ── Cotations porte ── */}
        {door && (() => {
          const dx = door.u, dw = door.width, dh = door.height;
          const baseY = py(0, 0);
          // Distance bord gauche → porte (cote intérieure haute)
          const iy = py(dh, 0) - 8;
          return (
            <g opacity="0.85">
              {/* Distance bord gauche */}
              {dx > 0.1 && <>
                <line x1={px(0,0)} y1={iy} x2={px(dx,0)} y2={iy} stroke={C.dim} strokeWidth="0.6" />
                <line x1={px(0,0)} y1={iy-3} x2={px(0,0)} y2={iy+3} stroke={C.dim} strokeWidth="0.6" />
                <line x1={px(dx,0)} y1={iy-3} x2={px(dx,0)} y2={iy+3} stroke={C.dim} strokeWidth="0.6" />
                <text x={(px(0,0)+px(dx,0))/2} y={iy-3} textAnchor="middle" fontSize="7.5" fill={C.dimTxt} fontFamily={FONT} fontWeight="500">
                  {dx.toFixed(2)}
                </text>
              </>}
              {/* Largeur porte (sous la porte) */}
              <line x1={px(dx,0)} y1={baseY+10} x2={px(dx+dw,0)} y2={baseY+10} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(dx,0)} y1={baseY+7} x2={px(dx,0)} y2={baseY+13} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(dx+dw,0)} y1={baseY+7} x2={px(dx+dw,0)} y2={baseY+13} stroke={C.dim} strokeWidth="0.6" />
              <text x={(px(dx,0)+px(dx+dw,0))/2} y={baseY+21} textAnchor="middle" fontSize="7.5" fill={C.dimTxt} fontFamily={FONT} fontWeight="500">
                {dw.toFixed(2)}
              </text>
              {/* Hauteur porte (côté droit de la porte) */}
              <line x1={px(dx+dw,0)+6} y1={baseY} x2={px(dx+dw,0)+6} y2={py(dh,0)} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(dx+dw,0)+3} y1={baseY} x2={px(dx+dw,0)+9} y2={baseY} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(dx+dw,0)+3} y1={py(dh,0)} x2={px(dx+dw,0)+9} y2={py(dh,0)} stroke={C.dim} strokeWidth="0.6" />
              <text x={px(dx+dw,0)+10} y={(baseY+py(dh,0))/2+3} textAnchor="start" fontSize="7.5" fill={C.dimTxt} fontFamily={FONT} fontWeight="500">
                h{dh.toFixed(2)}
              </text>
            </g>
          );
        })()}

        {/* ── Cotations fenêtre ── */}
        {win && (() => {
          const wx = win.u, wy = win.v, ww = win.width, wh = win.height;
          return (
            <g opacity="0.85">
              {/* Position horizontale (distance bord gauche) */}
              <line x1={px(0,0)} y1={py(wy+wh,0)-8} x2={px(wx,0)} y2={py(wy+wh,0)-8} stroke={C.dim} strokeWidth="0.5" strokeDasharray="2 2" />
              <text x={(px(0,0)+px(wx,0))/2} y={py(wy+wh,0)-11} textAnchor="middle" fontSize="7" fill={C.label} fontFamily={FONT} fontWeight="500">
                {wx.toFixed(2)}
              </text>
              {/* Largeur fenêtre (sous la fenêtre) */}
              <line x1={px(wx,0)} y1={py(wy,0)+8} x2={px(wx+ww,0)} y2={py(wy,0)+8} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(wx,0)} y1={py(wy,0)+5} x2={px(wx,0)} y2={py(wy,0)+11} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(wx+ww,0)} y1={py(wy,0)+5} x2={px(wx+ww,0)} y2={py(wy,0)+11} stroke={C.dim} strokeWidth="0.6" />
              <text x={(px(wx,0)+px(wx+ww,0))/2} y={py(wy,0)+19} textAnchor="middle" fontSize="7.5" fill={C.dimTxt} fontFamily={FONT} fontWeight="500">
                {ww.toFixed(2)}
              </text>
              {/* Allège (hauteur sol → bas fenêtre) — côté droit */}
              <line x1={px(wx+ww,0)+6} y1={py(0,0)} x2={px(wx+ww,0)+6} y2={py(wy,0)} stroke={C.dim} strokeWidth="0.5" strokeDasharray="2 1.5" />
              <line x1={px(wx+ww,0)+3} y1={py(0,0)} x2={px(wx+ww,0)+9} y2={py(0,0)} stroke={C.dim} strokeWidth="0.5" />
              <line x1={px(wx+ww,0)+3} y1={py(wy,0)} x2={px(wx+ww,0)+9} y2={py(wy,0)} stroke={C.dim} strokeWidth="0.5" />
              <text x={px(wx+ww,0)+12} y={(py(0,0)+py(wy,0))/2+3} textAnchor="start" fontSize="7" fill={C.label} fontFamily={FONT} fontWeight="500">
                allège {wy.toFixed(2)}
              </text>
              {/* Hauteur fenêtre — côté gauche */}
              <line x1={px(wx,0)-6} y1={py(wy,0)} x2={px(wx,0)-6} y2={py(wy+wh,0)} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(wx,0)-9} y1={py(wy,0)} x2={px(wx,0)-3} y2={py(wy,0)} stroke={C.dim} strokeWidth="0.6" />
              <line x1={px(wx,0)-9} y1={py(wy+wh,0)} x2={px(wx,0)-3} y2={py(wy+wh,0)} stroke={C.dim} strokeWidth="0.6" />
              <text x={px(wx,0)-10} y={(py(wy,0)+py(wy+wh,0))/2+3} textAnchor="end" fontSize="7.5" fill={C.dimTxt} fontFamily={FONT} fontWeight="500">
                {wh.toFixed(2)}
              </text>
            </g>
          );
        })()}

        {/* ── Entraxe montants — annotation ── */}
        {(() => {
          const ey = py(0, 0) + 40;
          const sorted = [...facadeStuds].sort((a, b) => a.x - b.x);
          // Trouver le premier entraxe régulier (≈0.60)
          for (let i = 0; i < sorted.length - 1; i++) {
            const gap = sorted[i + 1].x - sorted[i].x;
            if (gap > 0.45 && gap < 0.75) {
              const x1 = px(sorted[i].x, 0), x2 = px(sorted[i + 1].x, 0);
              return (
                <g opacity="0.7">
                  <line x1={x1} y1={ey} x2={x2} y2={ey} stroke={C.dim} strokeWidth="0.5" />
                  <line x1={x1} y1={ey-3} x2={x1} y2={ey+3} stroke={C.dim} strokeWidth="0.5" />
                  <line x1={x2} y1={ey-3} x2={x2} y2={ey+3} stroke={C.dim} strokeWidth="0.5" />
                  <text x={(x1+x2)/2} y={ey+11} textAnchor="middle" fontSize="7" fill={C.label} fontFamily={FONT} fontWeight="500">
                    entraxe {gap.toFixed(2)}
                  </text>
                </g>
              );
            }
          }
          return null;
        })()}

        {/* ── Pente + rampant — annotations toit ── */}
        {(() => {
          const slopePct = ((slope / width) * 100).toFixed(0);
          const rampant = Math.sqrt(width * width + slope * slope);
          const mx = width * 0.5, mz = depth * 0.5;
          const my = height + (mx / width) * slope;
          return (
            <g>
              <text x={px(mx, mz)} y={py(my, mz) - 30} textAnchor="middle" fontSize="9.5" fill={C.label} fontFamily={FONT} fontWeight="600" letterSpacing="0.5">
                pente {slopePct}%
              </text>
              <text x={px(mx, mz)} y={py(my, mz) - 14} textAnchor="middle" fontSize="8" fill={C.label} fontFamily={FONT} fontWeight="500">
                rampant {rampant.toFixed(2)} m
              </text>
            </g>
          );
        })()}

        {/* ── Débord toit — annotation façade ── */}
        {(() => {
          const DEBORD = 0.20;
          const lx = px(-DEBORD, 0), rx = px(0, 0);
          const dy = py(height, 0) - 14;
          return (
            <g opacity="0.65">
              <line x1={lx} y1={dy} x2={rx} y2={dy} stroke={C.dim} strokeWidth="0.5" />
              <line x1={lx} y1={dy-2.5} x2={lx} y2={dy+2.5} stroke={C.dim} strokeWidth="0.5" />
              <line x1={rx} y1={dy-2.5} x2={rx} y2={dy+2.5} stroke={C.dim} strokeWidth="0.5" />
              <text x={(lx+rx)/2} y={dy-3} textAnchor="middle" fontSize="6.5" fill={C.label} fontFamily={FONT} fontWeight="500">
                {(DEBORD * 100).toFixed(0)} cm
              </text>
            </g>
          );
        })()}

        {/* ── Cartouche ── */}
        <g transform={`translate(${VB_W - PAD_R + 4}, ${VB_H - 16})`}>
          <text x="0" y="0" textAnchor="start" fontSize="9" fill={C.label} fontFamily={FONT} fontWeight="500" letterSpacing="0.5">
            {width.toFixed(1)} × {depth.toFixed(1)} × h{height.toFixed(1)} m
          </text>
        </g>

      </svg>
    </div>
  );
}
