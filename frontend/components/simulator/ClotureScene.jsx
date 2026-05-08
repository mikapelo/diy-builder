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
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getWoodMaterial, getGroundMaterial, getConcreteMaterial } from './shared/materials.js';
import { CC } from './shared/colorCode.js';
import SceneSetup from './shared/SceneSetup.jsx';
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

/* ── InstancedMesh helpers (audit perf Sprint 3+) ─────────────────── */
const _tmpObj = new THREE.Object3D();

function InstancedPosts({ posts, cx, geometry, material }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    posts.forEach((p, i) => {
      _tmpObj.position.set(p.x - cx, p.height / 2, 0);
      _tmpObj.scale.set(1, p.height, 1);
      _tmpObj.rotation.set(0, 0, 0);
      _tmpObj.updateMatrix();
      ref.current.setMatrixAt(i, _tmpObj.matrix);
    });
    ref.current.count = posts.length;
    ref.current.instanceMatrix.needsUpdate = true;
  }, [posts, cx]);
  return (
    <instancedMesh ref={ref} args={[geometry, material, posts.length]} castShadow receiveShadow />
  );
}

function InstancedRails({ rails, cx, railH, exploded, geometry, material }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    rails.forEach((r, i) => {
      const isTop = r.type === 'top';
      const animOffset = exploded ? (isTop ? EXPLODE_RAILS_TOP : EXPLODE_RAILS_BOTTOM) : 0;
      _tmpObj.position.set((r.x1 + r.x2) / 2 - cx, r.y + railH / 2 + animOffset, 0);
      _tmpObj.scale.set(r.x2 - r.x1, 1, 1);
      _tmpObj.rotation.set(0, 0, 0);
      _tmpObj.updateMatrix();
      ref.current.setMatrixAt(i, _tmpObj.matrix);
    });
    ref.current.count = rails.length;
    ref.current.instanceMatrix.needsUpdate = true;
  }, [rails, cx, railH, exploded]);
  return (
    <instancedMesh ref={ref} args={[geometry, material, rails.length]} castShadow receiveShadow />
  );
}

function InstancedBoards({ boards, cx, boardW, boardH, postSection, geometry, material }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    boards.forEach((b, i) => {
      _tmpObj.position.set(
        b.x + boardW / 2 - cx,
        b.y + b.height / 2,
        postSection / 2 + boardH / 2,
      );
      _tmpObj.scale.set(1, b.height, 1);
      _tmpObj.rotation.set(0, 0, 0);
      _tmpObj.updateMatrix();
      ref.current.setMatrixAt(i, _tmpObj.matrix);
    });
    ref.current.count = boards.length;
    ref.current.instanceMatrix.needsUpdate = true;
  }, [boards, cx, boardW, boardH, postSection]);
  return (
    <instancedMesh ref={ref} args={[geometry, material, boards.length]} castShadow receiveShadow />
  );
}

export default function ClotureScene({ geometry, sceneMode = 'assembled', foundationType = 'ground', detailed = false, showHuman = false }) {
  const exploded = sceneMode === 'exploded';
  const { dimensions, posts, rails, boards } = geometry;
  const { width, height, postSection, railW, railH, boardW, boardH } = dimensions;

  // Centre de la scène
  const cx = width / 2;
  const cy = height / 2;

  // Ref pour animation
  const boardGrp = useRef();

  useFrame((_, dt) => {
    const t = Math.min(1, 5 * dt);
    if (boardGrp.current) {
      const target = exploded ? EXPLODE_BOARDS : 0;
      boardGrp.current.position.z = THREE.MathUtils.lerp(boardGrp.current.position.z, target, t);
    }
  });

  // Géométries unitaires mémoïsées
  const postGeo = useMemo(() => new THREE.BoxGeometry(postSection, 1, postSection), [postSection]);
  const railGeo = useMemo(() => new THREE.BoxGeometry(1, railH, railW), [railH, railW]);
  const boardGeo = useMemo(() => new THREE.BoxGeometry(boardW, 1, boardH), [boardW, boardH]);

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

      {/* ── Poteaux (InstancedMesh — audit perf Sprint 3+) ── */}
      <InstancedPosts
        posts={posts}
        cx={cx}
        geometry={postGeo}
        material={woodPostMat}
      />

      {/* ── Rails (InstancedMesh, animOffset par type top/bottom) ── */}
      <InstancedRails
        rails={rails}
        cx={cx}
        railH={railH}
        exploded={exploded}
        geometry={railGeo}
        material={woodRailMat}
      />

      {/* ── Lames (InstancedMesh, animées via group ref pour explode) ── */}
      <group ref={boardGrp}>
        <InstancedBoards
          boards={boards}
          cx={cx}
          boardW={boardW}
          boardH={boardH}
          postSection={postSection}
          geometry={boardGeo}
          material={woodBoardMat}
        />
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
