/**
 * edges.js — DIY Builder Rendering Standard v2 (SketchUp-like)
 *
 * Systeme d'aretes hierarchise 4 niveaux renforcé.
 * Contours plus marqués pour un rendu technique SketchUp.
 *
 * Niveaux :
 *   SILHOUETTE — contours majeurs, plus épais et opaque (0.65)
 *   STRUCT     — ossature en mode assemble, moyen (0.45)
 *   STRUCT_DETAIL — ossature en mode detaille (0.55)
 *   CLAD       — surfaces de finition, lames, details, fin (0.20)
 *   FRAME      — cadres ouvertures, marqué (0.60)
 */
import { useMemo } from 'react';
import * as THREE from 'three';

/* ── Materiaux d'aretes — V2 renforcé ── */

export const EDGE_SILHOUETTE_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#111111'),
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  linewidth: 1.5,
});

export const EDGE_STRUCT_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#1a1a1a'),
  transparent: true,
  opacity: 0.70,
  depthWrite: false,
});

export const EDGE_STRUCT_DETAIL_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#111111'),
  transparent: true,
  opacity: 0.75,
  depthWrite: false,
});

export const EDGE_CLAD_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#333333'),
  transparent: true,
  opacity: 0.30,
  depthWrite: false,
});

export const EDGE_FRAME_MAT = new THREE.LineBasicMaterial({
  color: new THREE.Color('#080808'),
  transparent: true,
  opacity: 0.80,
  depthWrite: false,
});

/* Alias par defaut */
export const EDGE_MAT = EDGE_STRUCT_MAT;

/**
 * EdgedBox — mesh + aretes automatiques
 *
 * @param {[number,number,number]} args — dimensions BoxGeometry
 * @param {THREE.Material} material — materiau du mesh
 * @param {[number,number,number]} position
 * @param {[number,number,number]} rotation
 * @param {boolean} castShadow
 * @param {THREE.LineBasicMaterial} edgeMat — materiau d'aretes (defaut EDGE_STRUCT_MAT)
 */
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
