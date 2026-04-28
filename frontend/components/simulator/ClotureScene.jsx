'use client';
/**
 * ClotureScene.jsx — Scène Three.js pour la clôture V1
 *
 * Clôture bois droite avec poteaux, rails horizontaux et lames verticales.
 *
 * Rendu :
 *   - Poteaux verticaux (bois clair)
 *   - Rails horizontaux (bois moyen)
 *   - Lames verticales (bois sombre)
 *   - Sol showroom avec ombres de contact 2 couches
 *
 * Modes : assembled / exploded
 *
 * Convention : X=longueur clôture, Y=hauteur, Z=0 (clôture plate)
 * Centre de scène : cx = width / 2, cy = height / 2
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getWoodMaterial, getGroundMaterial, getConcreteMaterial } from './shared/materials.js';
import { CC } from './shared/colorCode.js';
import SceneSetup from './shared/SceneSetup.jsx';
import { EDGE_SILHOUETTE_MAT, EDGE_STRUCT_MAT } from './shared/edges.js';
import { HumanReference } from './HumanReference.jsx';

const EXPLODE_BOARDS = 0.5;   // Z offset lames en mode éclaté
const EXPLODE_RAILS_TOP = 0.3;    // Y offset rails haut
const EXPLODE_RAILS_BOTTOM = -0.2; // Y offset rails bas

// Cache des matériaux bois texturés
let WOOD_POST_MAT = null;
let WOOD_RAIL_MAT = null;
let WOOD_BOARD_MAT = null;

function getWoodPostMaterial() {
  if (!WOOD_POST_MAT) {
    WOOD_POST_MAT = getWoodMaterial(
      'cloture-posts',
      '#c8b090',     // base clair
      '#b08070',     // grain moyen
      16,            // densité veinage
      0.78,          // roughness
      0.5            // envMapIntensity
    );
  }
  return WOOD_POST_MAT;
}

function getWoodRailMaterial() {
  if (!WOOD_RAIL_MAT) {
    WOOD_RAIL_MAT = getWoodMaterial(
      'cloture-rails',
      '#b09070',     // base moyen
      '#986656',     // grain plus foncé
      18,
      0.75,
      0.55
    );
  }
  return WOOD_RAIL_MAT;
}

function getWoodBoardMaterial() {
  if (!WOOD_BOARD_MAT) {
    WOOD_BOARD_MAT = getWoodMaterial(
      'cloture-boards',
      '#9a7856',     // base sombre
      '#7a5a3a',     // grain très sombre
      20,
      0.72,
      0.45
    );
  }
  return WOOD_BOARD_MAT;
}

export default function ClotureScene({ geometry, sceneMode = 'assembled', foundationType = 'ground', detailed = false, showHuman = true }) {
  const exploded = sceneMode === 'exploded';
  const { dimensions, posts, rails, boards } = geometry;
  const { width, height, postSection, railW, railH, boardW, boardH } = dimensions;

  // Centre de la scène
  const cx = width / 2;
  const cy = height / 2;

  // Refs pour animation
  const boardGrp = useRef();
  const railGrp = useRef();

  useFrame((_, dt) => {
    const t = Math.min(1, 5 * dt);
    if (boardGrp.current) {
      const target = exploded ? EXPLODE_BOARDS : 0;
      boardGrp.current.position.z = THREE.MathUtils.lerp(boardGrp.current.position.z, target, t);
    }
    if (railGrp.current) {
      // Pour les rails, il faut gérer top et bottom séparément
      // On va utiliser un offset global pour l'animation des rails
      // Et gérer le décalage par rail dans le rendu
    }
  });

  // Géométries unitaires mémoïsées
  const postGeo = useMemo(() => new THREE.BoxGeometry(postSection, 1, postSection), [postSection]);
  const railGeo = useMemo(() => new THREE.BoxGeometry(1, railH, railW), [railH, railW]);
  const boardGeo = useMemo(() => new THREE.BoxGeometry(boardW, 1, boardH), [boardW, boardH]);

  // Géométries d'arêtes mémoïsées
  const postEdgeGeo = useMemo(() => new THREE.EdgesGeometry(postGeo, 15), [postGeo]);
  const railEdgeGeo = useMemo(() => new THREE.EdgesGeometry(railGeo, 15), [railGeo]);

  // Matériaux : bois texturé en assemblé, couleurs primaires en détaillé
  const woodPostMat  = detailed ? CC.posts.mat  : getWoodPostMaterial();
  const woodRailMat  = detailed ? CC.rails.mat  : getWoodRailMaterial();
  const woodBoardMat = detailed ? CC.boards.mat : getWoodBoardMaterial();
  const groundMat = useMemo(() => getGroundMaterial(), []);

  const gridSize = Math.ceil(Math.max(width, height)) + 4;

  return (
    <>
      {/* ── Éclairage et environnement SketchUp-like unifié ── */}
      <SceneSetup width={width} depth={0.5} />

      {/* ── Poteaux (bois clair, base solide) ── */}
      {posts.map((p, i) => (
        <group key={`post-${i}`} position={[p.x - cx, p.height / 2, 0]} scale={[1, p.height, 1]}>
          <mesh geometry={postGeo} material={woodPostMat} castShadow receiveShadow />
          <lineSegments geometry={postEdgeGeo} material={EDGE_SILHOUETTE_MAT} />
        </group>
      ))}

      {/* ── Rails (bois moyen, animés) ── */}
      <group ref={railGrp}>
        {rails.map((r, i) => {
          const isTop = r.type === 'top';
          const animOffset = exploded ? (isTop ? EXPLODE_RAILS_TOP : EXPLODE_RAILS_BOTTOM) : 0;
          return (
            <group
              key={`rail-${i}`}
              position={[(r.x1 + r.x2) / 2 - cx, r.y + railH / 2 + animOffset, 0]}
              scale={[r.x2 - r.x1, 1, 1]}
            >
              <mesh geometry={railGeo} material={woodRailMat} castShadow receiveShadow />
              <lineSegments geometry={railEdgeGeo} material={EDGE_STRUCT_MAT} />
            </group>
          );
        })}
      </group>

      {/* ── Lames (bois sombre, animées, devant en Z) ── */}
      <group ref={boardGrp}>
        {boards.map((b, i) => (
          <mesh
            key={`board-${i}`}
            geometry={boardGeo}
            material={woodBoardMat}
            position={[
              b.x + boardW / 2 - cx,
              b.y + b.height / 2,
              postSection / 2 + boardH / 2,
            ]}
            scale={[1, b.height, 1]}
            castShadow
            receiveShadow
          />
        ))}
      </group>

      {/* ── Silhouette humaine 1.75 m — repère d'échelle ──
           Placée au bout droit de la clôture, légèrement devant en Z. */}
      <HumanReference
        position={[cx + 0.6, 0, postSection / 2 + 0.4]}
        visible={showHuman}
      />
    </>
  );
}
