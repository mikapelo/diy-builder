/**
 * helpers.js — Utilitaires partagés pour le rendu 3D du cabanon
 *
 * V3 : Système d'arêtes hiérarchisé 3 niveaux
 *   - SILHOUETTE : contours principaux (toit, base, angles majeurs)
 *   - STRUCT     : ossature, cadres, séparations moyennes
 *   - CLAD       : lames bardage, détails matière
 *   - STRUCT_DETAIL : ossature en mode détaillé (plus visible)
 */
import { useMemo } from 'react';
import * as THREE from 'three';

/* ── Matériaux d'arêtes — 3 niveaux hiérarchiques ────────────────── */

/** Niveau 1 — Silhouette : contours majeurs, toit, base */
export const EDGE_SILHOUETTE_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#3a3028'),
  transparent: true,
  opacity: 0.40,
  depthWrite: false,
});

/** Niveau 2 — Structure : ossature, cadres (mode assembled) */
export const EDGE_STRUCT_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#5a5040'),
  transparent: true,
  opacity: 0.25,
  depthWrite: false,
});

/** Niveau 2b — Structure detail : ossature (mode détaillé, plus visible) */
export const EDGE_STRUCT_DETAIL_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#4a4035'),
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
});

/** Niveau 3 — Bardage : lames, détails matière */
export const EDGE_CLAD_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#6a5a48'),
  transparent: true,
  opacity: 0.15,
  depthWrite: false,
});

/** Niveau cadres ouvertures — plus fort que struct */
export const EDGE_FRAME_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#3a2818'),
  transparent: true,
  opacity: 0.38,
  depthWrite: false,
});

/* Alias par défaut = structure */
export const EDGE_MAT = EDGE_STRUCT_MAT;

/** Composant mesh + edges automatiques — edgeMat paramétrable */
export function EdgedBox({ args, material, position, rotation, castShadow = true, edgeMat }) {
  const geo = useMemo(() => new THREE.BoxGeometry(...args), [args[0], args[1], args[2]]);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(geo, 15), [geo]);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} material={material} castShadow={castShadow} />
      <lineSegments geometry={edgeGeo} material={edgeMat ?? EDGE_STRUCT_MAT} />
    </group>
  );
}
