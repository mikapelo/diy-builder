/**
 * EnvironmentGroup.jsx — Sol, fondation, ombres de contact, staging
 *
 * V2 : Ambiance showroom premium renforcee
 * - Sol neutre avec gradient radial lumineux
 * - Ombre de contact plus definie
 * - Halo lumineux pour "presenter" le produit
 */
import { useMemo } from 'react';
import * as THREE from 'three';

import { getGroundMaterial, getConcreteMaterial } from './materials.js';
import { EDGE_SILHOUETTE_MAT } from './helpers.js';

/* ── Sol showroom neutre ─────────────────────────────────────────── */
export function GroundPlane() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[60, 60]} />
      <primitive object={getGroundMaterial()} attach="material" />
    </mesh>
  );
}

/* ── Ombre de contact — plus definie, profondeur ─────────────────── */
export function ContactShadow({ width, depth }) {
  return (
    <group>
      {/* Ombre rapprochee — nette */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[width * 1.05, depth * 1.05]} />
        <meshBasicMaterial color="#2a2420" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      {/* Ombre etalee — douce, profondeur */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[width * 1.6, depth * 1.6]} />
        <meshBasicMaterial color="#3a3530" transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Halo radial — staging produit premium ───────────────────────── */
export function GradientHalo({ width, depth }) {
  const r = Math.max(width, depth) * 1.5;
  return (
    <group>
      {/* Halo lumineux central — valorise l'objet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[r, 64]} />
        <meshBasicMaterial color="#faf6f0" transparent opacity={0.30} depthWrite={false} />
      </mesh>
      {/* Ring de profondeur — assombrit les bords */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0]}>
        <ringGeometry args={[r * 0.8, r * 2.5, 64]} />
        <meshBasicMaterial color="#c8c0b4" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Ligne de base — ancre la silhouette au sol ─────────────────── */
export function BaseLine({ width, depth }) {
  const geo = useMemo(() => {
    const hw = width / 2, hd = depth / 2;
    const M = 0.005; // micro-offset above ground
    const pts = [
      -hw, M, -hd,   hw, M, -hd,    // arriere
       hw, M, -hd,   hw, M,  hd,    // droite
       hw, M,  hd,  -hw, M,  hd,    // avant
      -hw, M,  hd,  -hw, M, -hd,    // gauche
    ];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [width, depth]);

  return <lineSegments geometry={geo} material={EDGE_SILHOUETTE_MAT} />;
}

/* ── Chape béton conditionnelle ───────────────────────────────────── */
export function FoundationSlab({ width, depth, visible }) {
  const mat = useMemo(() => getConcreteMaterial(), []);
  if (!visible) return null;
  const SLAB_H = 0.12;
  const OVERHANG = 0.10;
  return (
    <mesh receiveShadow castShadow position={[0, SLAB_H / 2 - 0.005, 0]}>
      <boxGeometry args={[width + OVERHANG * 2, SLAB_H, depth + OVERHANG * 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}
