'use client';

import React from 'react';

const COLORS = {
  background: '#f7f9fb',
  primary: '#2d3a45',
  secondary: '#5a6d7e',
  dimensionLine: '#3a4a5a',
  dimensionText: '#1d2a35',
  labels: '#7a8d9e',
};

const SCALE = 90;
const PAD_L = 80;
const PAD_R = 120;
const PAD_T = 50;
const PAD_B = 70;

export default function PergolaSketch({ geometry }) {
  if (!geometry || !geometry.dimensions) {
    return <svg width={600} height={400} viewBox="0 0 600 400" />;
  }

  const {
    width, depth, height,
    postSection = 0.15,
    beamW = 0.19,
    rafterW = 0.05,
  } = geometry.dimensions;

  const posts = geometry.posts || [];
  const beamsLong = geometry.beamsLong || [];
  const beamsShort = geometry.beamsShort || [];
  const rafters = geometry.rafters || [];

  const drawWidth = width * SCALE;
  const drawDepth = depth * SCALE;
  const svgWidth = drawWidth + PAD_L + PAD_R;
  const svgHeight = drawDepth + PAD_T + PAD_B;
  const originX = PAD_L;
  const originY = PAD_T;

  const toX = (x) => originX + x * SCALE;
  const toZ = (z) => originY + z * SCALE;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{ border: '1px solid #ddd', borderRadius: 4, background: '#fff', maxHeight: 500 }}
    >
      {/* Titre */}
      <text x={svgWidth / 2} y={30} textAnchor="middle"
        fontSize={16} fontFamily="Inter, system-ui, sans-serif" fontWeight={600} fill={COLORS.primary}>
        Plan Pergola — Vue de Dessus
      </text>

      {/* Fond zone plan */}
      <rect x={originX} y={originY} width={drawWidth} height={drawDepth}
        fill={COLORS.background} stroke={COLORS.primary} strokeWidth={2} />

      {/* Longerons (X) */}
      {beamsLong.map((b, i) => {
        const cx = (b.x1 + b.x2) / 2;
        const w = b.x2 - b.x1;
        return (
          <rect key={`blong-${i}`}
            x={toX(cx - w / 2)} y={toZ(b.z - beamW / 2)}
            width={w * SCALE} height={beamW * SCALE}
            fill="rgba(102,153,102,.2)" stroke={COLORS.secondary} strokeWidth={2} />
        );
      })}

      {/* Traverses (Z) */}
      {beamsShort.map((b, i) => {
        const cz = (b.z1 + b.z2) / 2;
        const h = b.z2 - b.z1;
        return (
          <rect key={`bshort-${i}`}
            x={toX(b.x - beamW / 2)} y={toZ(cz - h / 2)}
            width={beamW * SCALE} height={h * SCALE}
            fill="rgba(102,153,102,.2)" stroke={COLORS.secondary} strokeWidth={2} />
        );
      })}

      {/* Chevrons (Z) */}
      {rafters.map((r, i) => {
        const cz = (r.z1 + r.z2) / 2;
        const h = r.z2 - r.z1;
        return (
          <rect key={`raft-${i}`}
            x={toX(r.x - rafterW / 2)} y={toZ(cz - h / 2)}
            width={rafterW * SCALE} height={h * SCALE}
            fill="rgba(180,180,200,.3)" stroke={COLORS.secondary} strokeWidth={1} />
        );
      })}

      {/* Poteaux (carrés pleins) */}
      {posts.map((p, i) => (
        <rect key={`post-${i}`}
          x={toX(p.x - postSection / 2)} y={toZ(p.z - postSection / 2)}
          width={postSection * SCALE} height={postSection * SCALE}
          fill="rgba(139,101,65,.35)" stroke={COLORS.primary} strokeWidth={2} />
      ))}

      {/* Labels poteaux */}
      {posts.map((p, i) => (
        <text key={`plbl-${i}`}
          x={toX(p.x)} y={toZ(p.z) - 16}
          textAnchor="middle" fontSize={10} fontFamily="Inter, sans-serif" fill={COLORS.primary}>
          poteau
        </text>
      ))}

      {/* Cote largeur (bas) */}
      <g>
        <line x1={originX} y1={originY + drawDepth + 25}
          x2={originX + drawWidth} y2={originY + drawDepth + 25}
          stroke={COLORS.dimensionLine} strokeWidth={1} />
        <line x1={originX} y1={originY + drawDepth + 20}
          x2={originX} y2={originY + drawDepth + 30}
          stroke={COLORS.dimensionLine} strokeWidth={1} />
        <line x1={originX + drawWidth} y1={originY + drawDepth + 20}
          x2={originX + drawWidth} y2={originY + drawDepth + 30}
          stroke={COLORS.dimensionLine} strokeWidth={1} />
        <text x={originX + drawWidth / 2} y={originY + drawDepth + 45}
          textAnchor="middle" fontSize={12} fontFamily="Inter, sans-serif" fontWeight={500} fill={COLORS.dimensionText}>
          {width.toFixed(2)} m
        </text>
      </g>

      {/* Cote profondeur (gauche) */}
      <g>
        <line x1={originX - 35} y1={originY}
          x2={originX - 35} y2={originY + drawDepth}
          stroke={COLORS.dimensionLine} strokeWidth={1} />
        <line x1={originX - 40} y1={originY}
          x2={originX - 30} y2={originY}
          stroke={COLORS.dimensionLine} strokeWidth={1} />
        <line x1={originX - 40} y1={originY + drawDepth}
          x2={originX - 30} y2={originY + drawDepth}
          stroke={COLORS.dimensionLine} strokeWidth={1} />
        <text x={originX - 45} y={originY + drawDepth / 2}
          textAnchor="middle" fontSize={12} fontFamily="Inter, sans-serif" fontWeight={500} fill={COLORS.dimensionText}
          transform={`rotate(-90, ${originX - 45}, ${originY + drawDepth / 2})`}>
          {depth.toFixed(2)} m
        </text>
      </g>

      {/* Hauteur (badge coin haut-droit) */}
      <g>
        <rect x={originX + drawWidth - 90} y={originY + 8}
          width={82} height={22} rx={3}
          fill={COLORS.background} stroke={COLORS.dimensionLine} strokeWidth={1} />
        <text x={originX + drawWidth - 49} y={originY + 24}
          textAnchor="middle" fontSize={11} fontFamily="Inter, sans-serif" fontWeight={500} fill={COLORS.dimensionText}>
          H: {height.toFixed(2)} m
        </text>
      </g>

      {/* Légende (dans le viewBox, en bas à droite) */}
      <g transform={`translate(${originX + drawWidth + 12}, ${originY})`}>
        <text x={0} y={10} fontSize={10} fontFamily="Inter, sans-serif" fontWeight={600} fill={COLORS.primary}>
          Légende
        </text>
        {[
          { color: 'rgba(139,101,65,.35)', stroke: COLORS.primary, label: 'Poteaux' },
          { color: 'rgba(102,153,102,.2)', stroke: COLORS.secondary, label: 'Longerons' },
          { color: 'rgba(180,180,200,.3)', stroke: COLORS.secondary, label: 'Chevrons' },
        ].map((item, i) => (
          <g key={`leg-${i}`} transform={`translate(0, ${20 + i * 18})`}>
            <rect width={10} height={10} fill={item.color} stroke={item.stroke} strokeWidth={1} />
            <text x={16} y={9} fontSize={10} fontFamily="Inter, sans-serif" fill={COLORS.primary}>{item.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
