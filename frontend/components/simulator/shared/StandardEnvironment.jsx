/**
 * StandardEnvironment.jsx — DIY Builder Rendering Standard v1
 *
 * Environnement showroom : sol neutre, ombres de contact, halo staging, baseline.
 *
 * Props :
 *   width, depth — emprise du projet (pour dimensionner ombres et halo)
 */
'use client';
import { useMemo } from 'react';
import * as THREE from 'three';

import { getGroundMaterial } from './materials.js';
import { EDGE_SILHOUETTE_MAT } from './edges.js';

/* ── Sol showroom neutre ── */
export function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <primitive object={getGroundMaterial()} attach="material" />
    </mesh>
  );
}

/* ── Ombre de contact 3 couches — v1.1 ──
   Renforce pour compenser l'absence de receiveShadow sur la terrasse.
   L'ancrage au sol passe par ces ombres douces plutot que shadow map. */
export function ContactShadow({ width, depth }) {
  return (
    <group>
      {/* Contact serrée — ligne de base nette sous la terrasse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[width * 1.02, depth * 1.02]} />
        <meshBasicMaterial color="#1a1814" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      {/* Proche — douceur */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0025, 0]}>
        <planeGeometry args={[width * 1.15, depth * 1.15]} />
        <meshBasicMaterial color="#2a2420" transparent opacity={0.10} depthWrite={false} />
      </mesh>
      {/* Etalee — profondeur et ancrage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[width * 1.7, depth * 1.7]} />
        <meshBasicMaterial color="#3a3530" transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Halo radial — staging produit ── */
export function GradientHalo({ width, depth }) {
  const r = Math.max(width, depth) * 1.5;
  return (
    <group>
      {/* Lumineux central */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[r, 64]} />
        <meshBasicMaterial color="#faf6f0" transparent opacity={0.30} depthWrite={false} />
      </mesh>
      {/* Ring de profondeur */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0]}>
        <ringGeometry args={[r * 0.8, r * 2.5, 64]} />
        <meshBasicMaterial color="#c8c0b4" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Baseline — ancre la silhouette au sol ── */
export function BaseLine({ width, depth }) {
  const geo = useMemo(() => {
    const hw = width / 2, hd = depth / 2;
    const M = 0.005;
    const pts = [
      -hw, M, -hd,   hw, M, -hd,
       hw, M, -hd,   hw, M,  hd,
       hw, M,  hd,  -hw, M,  hd,
      -hw, M,  hd,  -hw, M, -hd,
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [width, depth]);

  return <lineSegments geometry={geo} material={EDGE_SILHOUETTE_MAT} />;
}

/* ── Composant composite — tout l'environnement d'un coup ── */
export default function StandardEnvironment({ width, depth, foundationType = 'ground' }) {
  return (
    <>
      <GroundPlane />
      <ContactShadow width={width} depth={depth} />
      <GradientHalo width={width} depth={depth} />
      <BaseLine width={width} depth={depth} />
    </>
  );
}
