'use client';
import { useMemo, useState } from 'react';

import {
  BOARD_WIDTH, BOARD_LEN,
  JOIST_W,
  PAD_SIZE,
} from '@/lib/deckConstants.js';
import { staggerEntretoises } from '@/lib/deckStagger.js';

import { generateDeck } from '@/lib/deckEngine.js';

/* ═══════════════════════════════════════════════════════════
   PLAN TECHNIQUE — vue de dessus (SVG responsive)
   Géométrie calculée par les mêmes fonctions que DeckScene.
   NE PAS modifier la logique de calcul existante.
═══════════════════════════════════════════════════════════ */
export default function TechnicalPlan({ width, depth }) {

  /* ── Moteur DTU 51.4 ── */
  const {
    joistCount,
    plotRows,
    nbRangees,
    traveeLen,
    boardSegs,
    boardRows,
    joistSegs,
    joistJoints,
    joistXPositions,
    joistJointZs,
    cutXPositions,
    doubleJoistSegs,
    entretoiseSegs,
    padPositions,
  } = useMemo(() => generateDeck(width, depth), [width, depth]);

  /* ── Positions X uniques des lambourdes doublées (issues du moteur) ──
     Le plan dessine les paires là où l'engine en génère, pas à chaque
     coupe : lorsque le snap DTU déplace une régulière sous la coupe, aucune
     paire n'est nécessaire → le plan doit refléter la 3D et la réalité. */
  const doubleJoistXs = useMemo(
    () => [...new Set(doubleJoistSegs.map(s => +s.xPos.toFixed(6)))],
    [doubleJoistSegs],
  );

  /* ── Légende interactive ── */
  const [vis, setVis] = useState({ boards: true, joists: true, pads: true, entr: true, cuts: true });
  const toggle = k => setVis(v => ({ ...v, [k]: !v[k] }));

  const staggeredEntretoises = useMemo(
    () => staggerEntretoises(entretoiseSegs, JOIST_W),
    [entretoiseSegs],
  );

  const legendItems = [
    { k: 'boards', label: 'Lames',       col: '#d8b083', solid: true  },
    { k: 'joists', label: 'Lambourdes',  col: '#6b4f32', solid: true  },
    { k: 'pads',   label: 'Plots',       col: '#2b2b2b', solid: true  },
    { k: 'entr',   label: 'Entretoises', col: '#7A4A1E', solid: true  },
    { k: 'cuts',   label: 'Jonctions',   col: '#7a4f2a', solid: false },
  ];

  /* ── Système de coordonnées SVG ── */
  const ML = 70;          // marge gauche  (cote profondeur)
  const MR = 90;          // marge droite  (cote entraxe plots)
  const MT = 52;          // marge haut    (cote entraxe lambourdes)
  const MB = 52;          // marge bas     (cote largeur)
  const PW = 580;         // largeur du plan en unités viewBox
  const s  = PW / width;  // échelle : unités viewBox par mètre
  const PH = depth * s;   // hauteur du plan
  const VW = PW + ML + MR;
  const VH = PH + MT + MB;

  /* Convertisseurs monde → SVG */
  const sx = wx => ML + (wx + width / 2) * s;
  const sz = wz => MT + (wz + depth / 2) * s;
  const sw = w  => w * s;

  /* Taille minimale des lambourdes (lisibilité) */
  const jw  = Math.max(sw(JOIST_W), 2);
  /* Rayon des plots (entre 4 et 9 px) */
  const padR = Math.min(Math.max(sw(PAD_SIZE / 2), 4), 9);

  /* Entraxes annotés */
  const joistEntrCm = joistCount > 1 ? Math.round(width / (joistCount - 1) * 100) : 0;
  const padEntrCm   = plotRows  > 1  ? Math.round(depth / (plotRows  - 1) * 100) : 0;

  /* ── Helpers flèches de cote ── */
  const Dim = {
    hLine(x1, x2, y, col = '#5a6d7e') {
      return <g>
        <line x1={x1} y1={y} x2={x2} y2={y} stroke={col} strokeWidth="1.2" />
        <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke={col} strokeWidth="1.2" />
        <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke={col} strokeWidth="1.2" />
        <polygon points={`${x1+10},${y-3} ${x1+2},${y} ${x1+10},${y+3}`} fill={col} />
        <polygon points={`${x2-10},${y-3} ${x2-2},${y} ${x2-10},${y+3}`} fill={col} />
      </g>;
    },
    vLine(x, y1, y2, col = '#5a6d7e') {
      return <g>
        <line x1={x} y1={y1} x2={x} y2={y2} stroke={col} strokeWidth="1.2" />
        <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} stroke={col} strokeWidth="1.2" />
        <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} stroke={col} strokeWidth="1.2" />
        <polygon points={`${x-3},${y1+10} ${x},${y1+2} ${x+3},${y1+10}`} fill={col} />
        <polygon points={`${x-3},${y2-10} ${x},${y2-2} ${x+3},${y2-10}`} fill={col} />
      </g>;
    },
    hLabel(x, y, label, col = '#5a6d7e') {
      return <text x={x} y={y} textAnchor="middle" fill={col}
        fontSize="11" fontWeight="700" fontFamily="monospace">{label}</text>;
    },
    vLabel(x, y, label, col = '#5a6d7e') {
      return <text x={x} y={y} textAnchor="middle" fill={col}
        fontSize="11" fontWeight="700" fontFamily="monospace"
        transform={`rotate(-90,${x},${y})`}>{label}</text>;
    },
  };

  return (
    <div className="tp-wrap">

      {/* ── En-tête ── */}
      <div className="tp-head">
        <span className="tp-title">Plan technique — vue de dessus</span>
        <span className="tp-badge">DTU 51.4</span>
      </div>

      {/* ── Légende interactive ── */}
      <div className="tp-legend">
        {legendItems.map(({ k, label, col, solid }) => (
          <button
            key={k}
            className={`tp-leg${vis[k] ? ' on' : ''}`}
            onClick={() => toggle(k)}
            aria-pressed={vis[k]}
          >
            <span
              className="tp-leg-sw"
              style={{
                background: solid ? col : 'transparent',
                border: solid ? `2px solid ${col}` : `2px dashed ${col}`,
                opacity: vis[k] ? 1 : 0.3,
              }}
            />
            {label}
          </button>
        ))}
      </div>

      {/* ── Plan SVG ── */}
      <div className="tp-svg-box">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          style={{ display: 'block', maxHeight: '520px' }}
          aria-label="Plan technique vue de dessus"
        >
          {/* ── Defs ── */}
          <defs>
            <clipPath id="tp-clip">
              <rect x={ML} y={MT} width={PW} height={PH} />
            </clipPath>
            <pattern id="tp-joist-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke="#5B3A1B" strokeWidth="1.5" opacity="0.5" />
            </pattern>
          </defs>

          {/* ── Fond SVG — palette projet SOFT GREIGE ── */}
          <rect width={VW} height={VH} fill="#f5f1eb" />

          {/* ── Zone plan (fond sol) ── */}
          <rect x={ML} y={MT} width={PW} height={PH} fill="#ede9e0" />

          {/* ── COUCHE CLIPPÉE : éléments structuraux ── */}
          <g clipPath="url(#tp-clip)">

            {/* === LAMES (fond, en-dessous) === */}
            {vis.boards && boardRows.map((row) => {
              const bTop = sz(row.zCenter - BOARD_WIDTH / 2);
              const bH   = Math.max(sw(BOARD_WIDTH), 2.5);
              return (
                <g key={`row-${row.zCenter}`}>
                  {row.segs.map((seg, si) => (
                    <rect
                      key={si}
                      x={sx(seg.xCenter - seg.segLen / 2)}
                      y={bTop}
                      width={sw(seg.segLen)}
                      height={bH}
                      fill="#c8a862"
                      stroke="rgba(0,0,0,0.10)"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Lignes de fil du bois */}
                  {bH > 7 && row.segs.map((seg, si) => {
                    const nLines = Math.max(1, Math.floor(bH / 5) - 1);
                    return Array.from({ length: nLines }, (_, gi) => (
                      <line
                        key={`g-${si}-${gi}`}
                        x1={sx(seg.xCenter - seg.segLen / 2) + 1}
                        y1={bTop + (bH / (nLines + 1)) * (gi + 1)}
                        x2={sx(seg.xCenter + seg.segLen / 2) - 1}
                        y2={bTop + (bH / (nLines + 1)) * (gi + 1)}
                        stroke="rgba(160,100,40,0.18)"
                        strokeWidth="0.6"
                      />
                    ));
                  })}
                </g>
              );
            })}

            {/* === LAMBOURDES régulières (au-dessus des lames) === */}
            {vis.joists && joistXPositions.map(xPos => (
              <g key={`j-${xPos}`}>
                <rect
                  x={sx(xPos) - jw / 2} y={MT}
                  width={jw} height={PH}
                  fill="url(#tp-joist-hatch)"
                  stroke="#6b4f32" strokeWidth="0.8"
                />
                <rect
                  x={sx(xPos) - jw / 2} y={MT}
                  width={jw} height={PH}
                  fill="rgba(107,79,50,0.25)"
                />
              </g>
            ))}

            {/* === LAMBOURDES DOUBLÉES — issues du moteur, jamais inventées ===
                 Le moteur pose une paire autour de xCut (± JOIST_W/2) uniquement
                 pour les coupes NON snappées. Quand le snap a déplacé une
                 régulière sous la coupe, aucune paire n'est nécessaire :
                 la régulière, visible ci-dessus, fait l'appui. */}
            {vis.joists && doubleJoistXs.map(xPos => (
              <rect
                key={`dbl-${xPos}`}
                x={sx(xPos) - jw / 2} y={MT}
                width={jw} height={PH}
                fill="rgba(61,37,16,0.45)"
                stroke="#3d2510" strokeWidth="0.8"
              />
            ))}

            {/* === JONCTIONS LAMES — tirets verticaux === */}
            {vis.cuts && cutXPositions.map(xCut => (
              <line
                key={`bcut-${xCut}`}
                x1={sx(xCut)} y1={MT}
                x2={sx(xCut)} y2={MT + PH}
                stroke="#9a5f30"
                strokeWidth="1"
                strokeDasharray="5,3"
                opacity="0.85"
              />
            ))}

            {/* === JONCTIONS LAMBOURDES — tirets horizontaux === */}
            {vis.cuts && joistJointZs.map(zAbs => (
              <line
                key={`jcut-${zAbs}`}
                x1={ML} y1={sz(zAbs)}
                x2={ML + PW} y2={sz(zAbs)}
                stroke="#5a3a20"
                strokeWidth="1"
                strokeDasharray="6,4"
                opacity="0.55"
              />
            ))}

            {/* === ENTRETOISES en quinconce (décalage DTU — clouage en bout) === */}
            {vis.entr && staggeredEntretoises.map((e, i) => (
              <rect
                key={i}
                x={sx(e.xCenter - e.segLen / 2)}
                y={sz(e.zPos) - jw / 2}
                width={sw(e.segLen)}
                height={Math.max(jw, 2)}
                fill="rgba(122,74,30,0.70)"
                stroke="#7A4A1E"
                strokeWidth="0.8"
              />
            ))}

            {/* === PLOTS — cercles noirs (z-index max) === */}
            {vis.pads && padPositions.map((p, i) => (
              <g key={i}>
                <circle cx={sx(p.x)} cy={sz(p.z)} r={padR + 2} fill="white" opacity="0.7" />
                <circle
                  cx={sx(p.x)} cy={sz(p.z)} r={padR}
                  fill="#2b2b2b"
                  stroke="#666" strokeWidth="1"
                />
              </g>
            ))}

          </g>{/* /clip */}

          {/* Bordure plan (au-dessus de tout) */}
          <rect
            x={ML} y={MT} width={PW} height={PH}
            fill="none"
            stroke="#8a7b6a" strokeWidth="2"
          />

          {/* ═══════════════════════════════════════
              COTES TECHNIQUES
          ═══════════════════════════════════════ */}

          {/* COTE LARGEUR — dessous */}
          {Dim.hLine(ML, ML + PW, MT + PH + 26)}
          {Dim.hLabel(ML + PW / 2, MT + PH + 42, `${width.toFixed(2)} m`)}
          <line x1={ML}      y1={MT + PH}      x2={ML}      y2={MT + PH + 33} stroke="#5a6d7e" strokeWidth="0.7" strokeDasharray="3,2" opacity="0.5" />
          <line x1={ML + PW} y1={MT + PH}      x2={ML + PW} y2={MT + PH + 33} stroke="#5a6d7e" strokeWidth="0.7" strokeDasharray="3,2" opacity="0.5" />

          {/* COTE PROFONDEUR — gauche */}
          {Dim.vLine(ML - 26, MT, MT + PH)}
          {Dim.vLabel(ML - 44, MT + PH / 2, `${depth.toFixed(2)} m`)}
          <line x1={ML}      y1={MT}      x2={ML - 33} y2={MT}      stroke="#5a6d7e" strokeWidth="0.7" strokeDasharray="3,2" opacity="0.5" />
          <line x1={ML}      y1={MT + PH} x2={ML - 33} y2={MT + PH} stroke="#5a6d7e" strokeWidth="0.7" strokeDasharray="3,2" opacity="0.5" />

          {/* COTE ENTRAXE LAMBOURDES — dessus, premier intervalle */}
          {joistCount >= 2 && (() => {
            const x0   = sx(-width / 2);
            const x1   = sx(-width / 2 + width / (joistCount - 1));
            const arrY = MT - 16;
            const col  = '#B07030';
            return (
              <g>
                <line x1={x0} y1={arrY} x2={x1} y2={arrY} stroke={col} strokeWidth="1" />
                <line x1={x0} y1={arrY - 5} x2={x0} y2={arrY + 5} stroke={col} strokeWidth="1" />
                <line x1={x1} y1={arrY - 5} x2={x1} y2={arrY + 5} stroke={col} strokeWidth="1" />
                <polygon points={`${x0+9},${arrY-3} ${x0+2},${arrY} ${x0+9},${arrY+3}`} fill={col} />
                <polygon points={`${x1-9},${arrY-3} ${x1-2},${arrY} ${x1-9},${arrY+3}`} fill={col} />
                <rect x={(x0+x1)/2-26} y={arrY-14} width={52} height={12} fill="#F8F6F1" rx="2" />
                <text
                  x={(x0 + x1) / 2} y={arrY - 4}
                  textAnchor="middle" fill={col}
                  fontSize="9" fontWeight="700" fontFamily="monospace"
                >e={joistEntrCm} cm</text>
                <line x1={x0} y1={MT} x2={x0} y2={arrY + 6} stroke={col} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.5" />
                <line x1={x1} y1={MT} x2={x1} y2={arrY + 6} stroke={col} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.5" />
              </g>
            );
          })()}

          {/* COTE ENTRAXE PLOTS — droite, premier intervalle */}
          {plotRows >= 2 && (() => {
            const z0   = sz(-depth / 2);
            const z1   = sz(-depth / 2 + depth / (plotRows - 1));
            const arrX = ML + PW + 24;
            const col  = '#208040';
            return (
              <g>
                <line x1={arrX} y1={z0} x2={arrX} y2={z1} stroke={col} strokeWidth="1" />
                <line x1={arrX - 5} y1={z0} x2={arrX + 5} y2={z0} stroke={col} strokeWidth="1" />
                <line x1={arrX - 5} y1={z1} x2={arrX + 5} y2={z1} stroke={col} strokeWidth="1" />
                <polygon points={`${arrX-3},${z0+9} ${arrX},${z0+2} ${arrX+3},${z0+9}`} fill={col} />
                <polygon points={`${arrX-3},${z1-9} ${arrX},${z1-2} ${arrX+3},${z1-9}`} fill={col} />
                <rect x={arrX + 6} y={(z0+z1)/2-7} width={50} height={12} fill="#F8F6F1" rx="2" />
                <text
                  x={arrX + 10} y={(z0 + z1) / 2 + 3}
                  fill={col} fontSize="9" fontWeight="700" fontFamily="monospace"
                >e={padEntrCm} cm</text>
                <line x1={ML + PW} y1={z0} x2={arrX + 6} y2={z0} stroke={col} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.5" />
                <line x1={ML + PW} y1={z1} x2={arrX + 6} y2={z1} stroke={col} strokeWidth="0.6" strokeDasharray="3,2" opacity="0.5" />
              </g>
            );
          })()}

        </svg>
      </div>

      {/* ── Informations texte ── */}
      <div className="tp-info">
        <span>Lames 145×28 — débit en {width > BOARD_LEN ? `${BOARD_LEN} m` : 'longueur'}</span>
        <span className="tp-info-sep">·</span>
        <span>Lambourdes 45×70 — e=40 cm</span>
        <span className="tp-info-sep">·</span>
        <span>Plots 200×200 — e=60 cm</span>
        <span className="tp-info-sep">·</span>
        <span>
          Entretoises {nbRangees} rangée{nbRangees > 1 ? 's' : ''} / travées ~{traveeLen} cm — quinconce
        </span>
      </div>

    </div>
  );
}
