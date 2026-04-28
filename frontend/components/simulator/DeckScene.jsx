'use client';
/**
 * DeckScene.jsx — Simulateur terrasse 3D
 *
 * DIY Builder Rendering Standard v1 applique :
 *   - Eclairage studio via StandardLighting
 *   - Environnement showroom via StandardEnvironment
 *   - Materiaux proceduraux via shared/materials.js
 *   - Edges hierarchises via shared/edges.js
 *
 * ORIENTATION DTU 51.4 :
 *   X = LARGEUR, Z = PROFONDEUR, Y = HAUTEUR
 *
 * CONTRAINTE : deckEngine.js, deckConstants.js, deckGeometry.js intouches.
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import {
  BOARD_THICK, BOARD_WIDTH,
  JOIST_W, JOIST_H,
  PAD_SIZE, PAD_H,
  BANDE_THICK,
  Y_PAD, Y_JOIST, Y_BOARD,
  EXPLODE_BOARDS, EXPLODE_JOISTS,
  SLOPE_RAD,
  PAD_ENTRAXE, MAX_PAD_ROWS,
} from '@/lib/deckConstants.js';
import {
  POST_SECTION as GC_POST_SECTION,
  RAIL_SECTION_W as GC_RAIL_W,
  RAIL_SECTION_H as GC_RAIL_H,
  BALUSTER_SECTION as GC_BALUSTER_SECTION,
} from '@/lib/gardeCorpsConstants.js';

import { generateDeck } from '@/lib/deckEngine.js';
import { staggerEntretoises } from '@/lib/deckStagger.js';

import SceneSetup from './shared/SceneSetup.jsx';
import { getWoodMaterial, getWoodMaterialFlat, getConcreteMaterial } from './shared/materials.js';
import { EDGE_SILHOUETTE_MAT, EDGE_STRUCT_MAT, EDGE_CLAD_MAT } from './shared/edges.js';
import { CC } from './shared/colorCode.js';
import { HumanReference } from './HumanReference.jsx';

/* ══════════════════════════════════════════════════════════════════════
   PALETTE TERRASSE — identite propre, hierarchie claire
   ══════════════════════════════════════════════════════════════════════
   Lames     = HERO (surface principale, riche, grain dense)
   Lambourdes = structure recessive (clair mat, faible grain)
   Plots     = ancrage beton
   Bande     = accent sombre
   ══════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════
   5 variantes LAMES V7 — palette walnut riche, harmonisée cabanon
   ══════════════════════════════════════════════════════════════════════
   Aligné sur CabanonScene/materials.js :
   - Pas de tint lavé — couleur base directe, texture brille naturellement
   - normalScale 0.3 (via shared/materials) — relief doux, pas plastique
   - envMapIntensity 0.6 — sheen satin premium
   - 5 variantes (comme le bardage cabanon) pour richesse visuelle
   - Roughness 0.72-0.82 = fini huilé extérieur naturel
   ══════════════════════════════════════════════════════════════════════ */
const BOARD_VARIANTS = [
  { key: 'deck-v8-0', base: '#b07840', grain: '#5c3418', density: 26, roughness: 0.78, env: 0.15 },
  { key: 'deck-v8-1', base: '#a47038', grain: '#4e2c14', density: 24, roughness: 0.80, env: 0.15 },
  { key: 'deck-v8-2', base: '#b88248', grain: '#644020', density: 28, roughness: 0.77, env: 0.15 },
  { key: 'deck-v8-3', base: '#9c6834', grain: '#482810', density: 23, roughness: 0.82, env: 0.15 },
  { key: 'deck-v8-4', base: '#ac7840', grain: '#58361c', density: 25, roughness: 0.79, env: 0.15 },
];

export default function DeckScene({ width, depth, viewMode = 'assembled', foundationType = 'ground', gardeCorpsStructure = null, showHuman = false }) {

  const exploded    = viewMode === 'exploded';
  const isStructure = viewMode === 'structure';
  const isCutaway   = viewMode === 'cutaway';
  const showBoards  = !isStructure;
  const showDimLines = isStructure || exploded || isCutaway;

  /* ── Moteur DTU 51.4 (intouche) ── */
  const {
    joistCount,
    totalPads,
    boardSegs,
    joistSegs,
    joistJoints,
    doubleJoistSegs,
    entretoiseSegs,
    padPositions,
  } = useMemo(() => generateDeck(width, depth), [width, depth]);

  /* ── Refs groupes (animation Y) ── */
  const boardsGrp = useRef();
  const joistsGrp = useRef();
  const padsGrp   = useRef();

  /* ── Répartition lames V7 — 5 variantes, scramble pseudo-aléatoire ──
     Hash Knuth sur l'index de rangée → distribution irrégulière mais
     déterministe sur 5 variantes (comme le bardage cabanon). */
  const NUM_VARIANTS = BOARD_VARIANTS.length;
  const boardBuckets = useMemo(() => {
    const buckets = Array.from({ length: NUM_VARIANTS }, () => []);
    const zValues = [...new Set(boardSegs.map(s => s.zCenter.toFixed(6)))];
    const zToRow = new Map();
    zValues.forEach((z, i) => zToRow.set(z, i));
    const scramble = (idx) => {
      const h = ((idx * 2654435761) >>> 0) % NUM_VARIANTS;
      return h;
    };
    boardSegs.forEach(seg => {
      const rowIdx = zToRow.get(seg.zCenter.toFixed(6)) ?? 0;
      buckets[scramble(rowIdx)].push(seg);
    });
    return buckets;
  }, [boardSegs]);

  /* ── Plots sous doubles lambourdes (positions de coupe) ──
     Stratégie en 3 étapes :
     1. Grouper les positions X par paires proches (xL + xR d'un même cut,
        distants de JOIST_W ≈ 4.5 cm) → UN plot au milieu (= xCut).
        Les pièces isolées (Cas A : côté gauche couvert par un joist régulier)
        conservent leur position individuelle.
     2. Générer un plot par position groupée, sur la même grille Z que les plots
        réguliers.
     3. Supprimer les candidats dont le centre tombe à moins de PAD_SIZE/2 (10 cm)
        d'un plot régulier en X : le plot 200 mm déjà en place couvre la zone,
        la double lambourde partage ce plot. */
  const dblJoistPadPositions = useMemo(() => {
    if (!doubleJoistSegs.length) return [];

    /* Positions X uniques, triées */
    const rawXs = [...new Set(doubleJoistSegs.map(s => +s.xPos.toFixed(6)))].sort((a, b) => a - b);

    /* Grouper les paires xL/xR → midpoint ; pièces isolées → telles quelles */
    const groupedXs = [];
    let i = 0;
    while (i < rawXs.length) {
      if (i + 1 < rawXs.length && rawXs[i + 1] - rawXs[i] < JOIST_W * 2.5) {
        groupedXs.push((rawXs[i] + rawXs[i + 1]) / 2);
        i += 2;
      } else {
        groupedXs.push(rawXs[i]);
        i += 1;
      }
    }

    /* Grille Z identique aux plots réguliers */
    const pRows   = Math.min(Math.floor(depth / PAD_ENTRAXE) + 1, MAX_PAD_ROWS);
    const rowSpan = Math.max(pRows - 1, 1);
    const candidates = [];
    groupedXs.forEach(x => {
      for (let r = 0; r < pRows; r++) {
        candidates.push({ x, z: -depth / 2 + (r / rowSpan) * depth });
      }
    });

    /* Supprimer si un plot régulier voisin (< PAD_SIZE/2 en X) couvre déjà la zone */
    return candidates.filter(c =>
      !padPositions.some(p =>
        Math.abs(p.x - c.x) < PAD_SIZE / 2 && Math.abs(p.z - c.z) < PAD_ENTRAXE / 2,
      ),
    );
  }, [doubleJoistSegs, depth, padPositions]);

  /* ── Refs InstancedMesh — 5 pour lames (variantes V7) ── */
  const boardsMesh0      = useRef();
  const boardsMesh1      = useRef();
  const boardsMesh2      = useRef();
  const boardsMesh3      = useRef();
  const boardsMesh4      = useRef();
  const joistsMesh       = useRef();
  const jointsMesh       = useRef();
  const doubleJoistsMesh = useRef();
  const entretoisesMesh  = useRef();
  const bandesMesh       = useRef();
  const padsMesh         = useRef();
  const dblJoistPadsMesh = useRef();
  const dblJoistPadsEdgeMesh = useRef();

  /* ── Refs InstancedMesh edges — 5 pour lames V7 ── */
  const boardsEdgeMesh0 = useRef();
  const boardsEdgeMesh1 = useRef();
  const boardsEdgeMesh2 = useRef();
  const boardsEdgeMesh3 = useRef();
  const boardsEdgeMesh4 = useRef();
  const joistsEdgeMesh  = useRef();
  const padsEdgeMesh    = useRef();

  /* ── Geometries unitaires (instanciees) ──
     boardUnitGeo : 8 segments en X pour éliminer le seam triangulaire
     des normal maps sur la face supérieure (2 triangles/quad = diagonale visible).
     Subdiviser casse la couture en 16 triangles → ombrage lisse. ── */
  const boardUnitGeo      = useMemo(() => new THREE.BoxGeometry(1, BOARD_THICK, BOARD_WIDTH, 8, 1, 1), []);
  const joistUnitGeo      = useMemo(() => new THREE.BoxGeometry(JOIST_W, JOIST_H, 1, 1, 1, 4), []);
  const jointMarkerGeo    = useMemo(() => new THREE.BoxGeometry(JOIST_W * 1.3, JOIST_H * 1.2, 0.005), []);
  const entretoiseUnitGeo = useMemo(() => new THREE.BoxGeometry(1, JOIST_H, JOIST_W, 4, 1, 1), []);
  const padGeo            = useMemo(() => new THREE.BoxGeometry(PAD_SIZE, PAD_H, PAD_SIZE), []);
  const bandeUnitGeo      = useMemo(() => new THREE.BoxGeometry(JOIST_W, BANDE_THICK, 1), []);

  /* ── Geometries edges (pour InstancedMesh) ──
     Angle seuil 80° : ne garde que les arêtes de contour (pas les subdivisions internes). */
  const boardEdgeGeo = useMemo(() => new THREE.EdgesGeometry(boardUnitGeo, 80), [boardUnitGeo]);
  const joistEdgeGeo = useMemo(() => new THREE.EdgesGeometry(joistUnitGeo, 15), [joistUnitGeo]);
  const padEdgeGeo   = useMemo(() => new THREE.EdgesGeometry(padGeo, 15), [padGeo]);

  /* ── Materiaux premium (proceduraux, caches) ──
     polygonOffset sur TOUS les fill materials : pousse les faces légèrement
     en arrière dans le depth buffer. Les edges (LineBasicMaterial, depthWrite:false)
     gagnent ainsi TOUJOURS le depth test → zéro Z-fighting/clipping. ── */
  /* Lames = surfaces horizontales → getWoodMaterialFlat (pas de normal map,
     envMapIntensity bas) pour éliminer l'ombre triangulaire du preset studio. */
  const boardMats = useMemo(() =>
    BOARD_VARIANTS.map(v => {
      const mat = getWoodMaterialFlat(v.key, v.base, v.grain, v.density, v.roughness, v.env);
      mat.polygonOffset = true;
      mat.polygonOffsetFactor = 1;
      mat.polygonOffsetUnits = 1;
      return mat;
    }),
    []
  );
  /* boardMats[0..4] utilisés par les 5 InstancedMesh variantes */

  const _joistWood       = useMemo(() => {
    const m = getWoodMaterial('deck-joist-v7', '#ccc2b0', '#948878', 14, 0.88, 0.6);
    m.polygonOffset = true; m.polygonOffsetFactor = 1; m.polygonOffsetUnits = 1;
    return m;
  }, []);
  const _doubleJoistWood = useMemo(() => {
    const m = getWoodMaterial('deck-djoist-v7', '#b09878', '#6e5e48', 16, 0.80, 0.6);
    m.polygonOffset = true; m.polygonOffsetFactor = 1; m.polygonOffsetUnits = 1;
    return m;
  }, []);
  const _entretoiseWood  = useMemo(() => {
    const m = getWoodMaterial('deck-entret-v7', '#b8a688', '#7a6850', 14, 0.80, 0.6);
    m.polygonOffset = true; m.polygonOffsetFactor = 1; m.polygonOffsetUnits = 1;
    return m;
  }, []);
  const _padConcrete = useMemo(() => {
    const base = getConcreteMaterial();
    const m = base.clone();
    m.polygonOffset = true; m.polygonOffsetFactor = 1; m.polygonOffsetUnits = 1;
    return m;
  }, []);
  /* Matériaux par défaut — toujours bois, le swap couleur se fait via useEffect */
  const joistMat       = _joistWood;
  const doubleJoistMat = _doubleJoistWood;
  const entretoiseMat  = _entretoiseWood;
  const padMat         = _padConcrete;
  const bandeMat       = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1614', roughness: 0.95, metalness: 0, envMapIntensity: 0,
  }), []);
  const jointMat       = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3a2a18', roughness: 0.90, metalness: 0, envMapIntensity: 0.1,
  }), []);

  /* ── Matrices lames V7 — 5 buckets, chacun avec son matériau ── */
  const boardMeshRefs = [boardsMesh0, boardsMesh1, boardsMesh2, boardsMesh3, boardsMesh4];
  const boardEdgeRefs = [boardsEdgeMesh0, boardsEdgeMesh1, boardsEdgeMesh2, boardsEdgeMesh3, boardsEdgeMesh4];

  /* En mode assemblé : cacher la moitié arrière des lames (z > 0) pour montrer la structure.
     En mode cutaway/éclaté : toutes les lames visibles (surélevées). */
  const hideHalfBoards = isCutaway;
  useEffect(() => {
    const dummy = new THREE.Object3D();
    boardBuckets.forEach((bucket, vi) => {
      const mesh = boardMeshRefs[vi].current;
      const edgeMesh = boardEdgeRefs[vi].current;
      if (!mesh) return;
      bucket.forEach((seg, i) => {
        const hidden = hideHalfBoards && seg.zCenter > 0;
        if (hidden) {
          dummy.position.set(0, -100, 0);
          dummy.scale.set(0, 0, 0);
        } else {
          dummy.position.set(seg.xCenter, 0, seg.zCenter);
          dummy.scale.set(seg.segLen, 1, 1);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        if (edgeMesh) edgeMesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (edgeMesh) edgeMesh.instanceMatrix.needsUpdate = true;
    });
  }, [boardBuckets, hideHalfBoards]);

  /* ── Matrices : lambourdes ── */
  useEffect(() => {
    const mesh = joistsMesh.current;
    const edgeMesh = joistsEdgeMesh.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    joistSegs.forEach((seg, i) => {
      dummy.position.set(seg.xPos, 0, seg.zCenter);
      dummy.scale.set(1, 1, seg.segLen);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (edgeMesh) edgeMesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (edgeMesh) edgeMesh.instanceMatrix.needsUpdate = true;
  }, [joistSegs]);

  /* ── Matrices : marqueurs de jonction ── */
  useEffect(() => {
    const mesh = jointsMesh.current;
    if (!mesh || joistJoints.length === 0) return;
    const dummy = new THREE.Object3D();
    joistJoints.forEach((j, i) => {
      dummy.position.set(j.xPos, 0, j.zAbs);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [joistJoints]);

  /* ── Matrices : doubles lambourdes ── */
  useEffect(() => {
    const mesh = doubleJoistsMesh.current;
    if (!mesh || doubleJoistSegs.length === 0) return;
    const dummy = new THREE.Object3D();
    doubleJoistSegs.forEach((seg, i) => {
      dummy.position.set(seg.xPos, 0, seg.zCenter);
      dummy.scale.set(1, 1, seg.segLen);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [doubleJoistSegs]);

  /* ── Matrices : bandes bitume ── */
  useEffect(() => {
    const mesh = bandesMesh.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    joistSegs.forEach((seg, i) => {
      /* +0.0005 : décale légèrement la bande au-dessus de la face du joist
         pour éviter le Z-fighting (faces coplanaires = artefacts noirs). */
      dummy.position.set(seg.xPos, JOIST_H / 2 + BANDE_THICK / 2 + 0.0005, seg.zCenter);
      dummy.scale.set(1, 1, seg.segLen);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [joistSegs]);

  /* ── X positions des lambourdes doublées (pour le clipping des entretoises) ── */
  const dblJoistXPositions = useMemo(
    () => [...new Set(doubleJoistSegs.map(s => +s.xPos.toFixed(6)))],
    [doubleJoistSegs],
  );

  /* ── Découpage des entretoises aux lambourdes doublées ──
     Chaque lambourde doublée à xPos occupe [xPos − JOIST_W/2, xPos + JOIST_W/2].
     L'entretoise brute (issue du moteur) s'appuie sur les lambourdes SIMPLES :
     elle traverse les lambourdes doublées intercalées. Ce useMemo découpe chaque
     segment en sous-segments qui s'arrêtent aux faces des lambourdes doublées. */
  const clippedEntretoises = useMemo(() => {
    if (!entretoiseSegs.length || !dblJoistXPositions.length) return entretoiseSegs;
    const result = [];
    entretoiseSegs.forEach(e => {
      const eLeft  = e.xCenter - e.segLen / 2;
      const eRight = e.xCenter + e.segLen / 2;
      const blockers = dblJoistXPositions
        .map(xP => ({ left: xP - JOIST_W / 2, right: xP + JOIST_W / 2 }))
        .filter(b => b.left < eRight - 0.005 && b.right > eLeft + 0.005)
        .sort((a, b) => a.left - b.left);
      if (blockers.length === 0) { result.push(e); return; }
      let cursor = eLeft;
      for (const b of blockers) {
        if (b.left > cursor + 0.005) {
          const len = b.left - cursor;
          result.push({ xCenter: cursor + len / 2, zPos: e.zPos, segLen: len });
        }
        cursor = b.right;
      }
      if (eRight > cursor + 0.005) {
        const len = eRight - cursor;
        result.push({ xCenter: cursor + len / 2, zPos: e.zPos, segLen: len });
      }
    });
    return result;
  }, [entretoiseSegs, dblJoistXPositions]);

  /* ── Entretoises en quinconce (décalage DTU : clouage en bout possible) ── */
  const staggeredEntretoises = useMemo(
    () => staggerEntretoises(clippedEntretoises, JOIST_W),
    [clippedEntretoises],
  );

  /* ── Matrices : entretoises ── */
  useEffect(() => {
    const mesh = entretoisesMesh.current;
    if (!mesh || staggeredEntretoises.length === 0) return;
    const dummy = new THREE.Object3D();
    staggeredEntretoises.forEach((e, i) => {
      dummy.position.set(e.xCenter, 0, e.zPos);
      dummy.scale.set(e.segLen, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [staggeredEntretoises]);

  /* ── Matrices : plots sous doubles lambourdes ── */
  useEffect(() => {
    const mesh = dblJoistPadsMesh.current;
    const edgeMesh = dblJoistPadsEdgeMesh.current;
    if (!mesh || !dblJoistPadPositions.length) return;
    const dummy = new THREE.Object3D();
    dblJoistPadPositions.forEach((p, i) => {
      dummy.position.set(p.x, 0, p.z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (edgeMesh) edgeMesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (edgeMesh) edgeMesh.instanceMatrix.needsUpdate = true;
  }, [dblJoistPadPositions]);

  /* ── Matrices : plots ── */
  useEffect(() => {
    const mesh = padsMesh.current;
    const edgeMesh = padsEdgeMesh.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    padPositions.forEach((p, i) => {
      dummy.position.set(p.x, 0, p.z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (edgeMesh) edgeMesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (edgeMesh) edgeMesh.instanceMatrix.needsUpdate = true;
  }, [padPositions]);

  /* ── Animation Y (vue eclatee / assemblee) ── */
  useFrame((_, dt) => {
    if (!boardsGrp.current || !joistsGrp.current || !padsGrp.current) return;
    const t       = Math.min(1, 5.5 * dt);
    const targetB = Y_BOARD + ((exploded || isCutaway) ? EXPLODE_BOARDS : 0);
    const targetJ = Y_JOIST + ((exploded || isCutaway) ? EXPLODE_JOISTS : 0);
    boardsGrp.current.position.y = THREE.MathUtils.lerp(boardsGrp.current.position.y, targetB, t);
    joistsGrp.current.position.y = THREE.MathUtils.lerp(joistsGrp.current.position.y, targetJ, t);
    padsGrp.current.position.y   = THREE.MathUtils.lerp(padsGrp.current.position.y,   Y_PAD,   t);
  });

  /* Code couleur — swap materials quand le mode change (pas dans useFrame) */
  const useColorCode = isStructure || isCutaway;
  useEffect(() => {
    boardMeshRefs.forEach((ref, vi) => {
      if (ref.current) ref.current.material = useColorCode ? CC.decking.mat : boardMats[vi];
    });
    if (joistsMesh.current)       joistsMesh.current.material       = useColorCode ? CC.joists.mat  : _joistWood;
    if (doubleJoistsMesh.current) doubleJoistsMesh.current.material = useColorCode ? CC.joists.mat  : _doubleJoistWood;
    if (entretoisesMesh.current)  entretoisesMesh.current.material  = useColorCode ? CC.nogging.mat : _entretoiseWood;
    if (padsMesh.current)         padsMesh.current.material         = useColorCode ? CC.pads.mat    : _padConcrete;
  }, [useColorCode]);

  return (
    <>
      {/* ── Éclairage et environnement SketchUp-like unifié ── */}
      <SceneSetup width={width} depth={depth} />

      {/* ── Chape béton conditionnelle ── */}
      {foundationType === 'slab' && (
        <mesh receiveShadow castShadow position={[0, 0.06 - 0.005, 0]}>
          <boxGeometry args={[width + 0.20, 0.12, depth + 0.20]} />
          <primitive object={getConcreteMaterial()} attach="material" />
        </mesh>
      )}

      {/* ── Structure inclinee 1.5 % (pente DTU 51.4) ── */}
      {/* Surélévation sur chape : la construction vient se poser dessus */}
      <group position={[0, foundationType === 'slab' ? 0.12 : 0, 0]}>
      <group rotation={[SLOPE_RAD, 0, 0]}>

        {/* ── Plots ── */}
        <group ref={padsGrp} position={[0, Y_PAD, 0]}>
          {/* Plots : ni castShadow (ombres petites et sales sur shadow map large)
               ni receiveShadow (artefacts sur petits volumes beton) */}
          <instancedMesh
            key={`pads-${totalPads}`}
            ref={padsMesh}
            args={[padGeo, padMat, Math.max(totalPads, 1)]}
            frustumCulled={false}
          />
          {/* Edges plots — silhouette, toujours visibles */}
          <instancedMesh
            key={`pads-edge-${totalPads}`}
            ref={padsEdgeMesh}
            args={[padEdgeGeo, EDGE_SILHOUETTE_MAT, Math.max(totalPads, 1)]}
            frustumCulled={false}
          />

          {/* Plots sous doubles lambourdes (coupes de lames) */}
          {dblJoistPadPositions.length > 0 && (
            <>
              <instancedMesh
                key={`dbl-pads-${dblJoistPadPositions.length}-${depth}`}
                ref={dblJoistPadsMesh}
                args={[padGeo, padMat, dblJoistPadPositions.length]}
                frustumCulled={false}
              />
              <instancedMesh
                key={`dbl-pads-edge-${dblJoistPadPositions.length}-${depth}`}
                ref={dblJoistPadsEdgeMesh}
                args={[padEdgeGeo, EDGE_SILHOUETTE_MAT, dblJoistPadPositions.length]}
                frustumCulled={false}
              />
            </>
          )}
        </group>

        {/* ── Lambourdes + doubles + bandes + jonctions + entretoises ── */}
        <group ref={joistsGrp} position={[0, Y_JOIST, 0]}>

          {/* Lambourdes simples — pas de castShadow (ContactShadows gère l'ancrage) */}
          <instancedMesh
            key={`joistsegs-${joistSegs.length}-${width}-${depth}`}
            ref={joistsMesh}
            args={[joistUnitGeo, joistMat, Math.max(joistSegs.length, 1)]}
            frustumCulled={false}
          />

          {/* Edges lambourdes — struct, visibles en structure/exploded */}
          <instancedMesh
            key={`joists-edge-${joistSegs.length}-${width}-${depth}`}
            ref={joistsEdgeMesh}
            args={[joistEdgeGeo, EDGE_STRUCT_MAT, Math.max(joistSegs.length, 1)]}
            frustumCulled={false}
            visible={isStructure || exploded || isCutaway}
          />

          {/* Doubles lambourdes */}
          {doubleJoistSegs.length > 0 && (
            <instancedMesh
              key={`dbl-${doubleJoistSegs.length}-${width}-${depth}`}
              ref={doubleJoistsMesh}
              args={[joistUnitGeo, doubleJoistMat, doubleJoistSegs.length]}
              frustumCulled={false}
            />
          )}

          {/* Bandes bitume */}
          <instancedMesh
            key={`bandes-${joistSegs.length}-${width}-${depth}`}
            ref={bandesMesh}
            args={[bandeUnitGeo, bandeMat, Math.max(joistSegs.length, 1)]}
            frustumCulled={false}
          />

          {/* Marqueurs de jonction */}
          {joistJoints.length > 0 && (
            <instancedMesh
              key={`joints-${joistJoints.length}-${depth}`}
              ref={jointsMesh}
              args={[jointMarkerGeo, jointMat, joistJoints.length]}
              frustumCulled={false}
            />
          )}

          {/* Entretoises */}
          {staggeredEntretoises.length > 0 && (
            <instancedMesh
              key={`entret-${staggeredEntretoises.length}-${width}-${depth}`}
              ref={entretoisesMesh}
              args={[entretoiseUnitGeo, entretoiseMat, staggeredEntretoises.length]}
              frustumCulled={false}
            />
          )}

        </group>

        {/* ── V7 : Lames — 5 variantes walnut, harmonisées cabanon ──
             Rendu aligné CabanonScene : normalScale 0.3, couleur base directe,
             envMapIntensity 0.6, roughness 0.72-0.82 (fini huilé extérieur).
             ── */}
        <group ref={boardsGrp} position={[0, Y_BOARD, 0]} visible={showBoards}>
          {boardBuckets.map((bucket, vi) => (
            <group key={`board-var-${vi}`}>
              <instancedMesh
                key={`boards-${vi}-${bucket.length}-${width}-${depth}`}
                ref={boardMeshRefs[vi]}
                args={[boardUnitGeo, boardMats[vi], Math.max(bucket.length, 1)]}
                frustumCulled={false}
              />
              <instancedMesh
                key={`boards-edge-${vi}-${bucket.length}-${width}-${depth}`}
                ref={boardEdgeRefs[vi]}
                args={[boardEdgeGeo, EDGE_CLAD_MAT, Math.max(bucket.length, 1)]}
                frustumCulled={false}
              />
            </group>
          ))}
        </group>

        {/* ── Garde-corps — visible si activé, posé sur la surface lames ── */}
        <GardeCorpsGroup
          structure={gardeCorpsStructure}
          width={width}
          depth={depth}
        />

      </group>{/* /slope */}
      </group>{/* /slab-lift */}

      {/* ── Lignes de cotes — hors pente, uniquement en mode technique ── */}
      {showDimLines && <DimensionLines width={width} depth={depth} />}

      {/* ── Silhouette humaine 1.75 m — repère d'échelle ──
           Pose les pieds au sol (y=0), à l'extérieur avant-droit du deck.
           Hors du group pente pour rester droite même si la terrasse
           est inclinée 1.5 %. */}
      <HumanReference
        position={[width / 2 + 0.6, 0, depth / 2 + 0.6]}
        visible={showHuman}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   Lignes de cotes techniques — couleur adoucie
───────────────────────────────────────────── */
function DimensionLines({ width, depth }) {
  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#8a7a68', linewidth: 1, transparent: true, opacity: 0.6 }),
    []
  );

  const geoW = useMemo(() => {
    const y = -0.005, z = -depth / 2 - 0.40;
    const g = new THREE.BufferGeometry();
    g.setFromPoints([
      new THREE.Vector3(-width / 2, y, z),
      new THREE.Vector3( width / 2, y, z),
      new THREE.Vector3(-width / 2, y, z - 0.09),
      new THREE.Vector3(-width / 2, y, z + 0.09),
      new THREE.Vector3( width / 2, y, z - 0.09),
      new THREE.Vector3( width / 2, y, z + 0.09),
    ]);
    return g;
  }, [width, depth]);

  const geoD = useMemo(() => {
    const y = -0.005, x = -width / 2 - 0.40;
    const g = new THREE.BufferGeometry();
    g.setFromPoints([
      new THREE.Vector3(x, y, -depth / 2),
      new THREE.Vector3(x, y,  depth / 2),
      new THREE.Vector3(x - 0.09, y, -depth / 2),
      new THREE.Vector3(x + 0.09, y, -depth / 2),
      new THREE.Vector3(x - 0.09, y,  depth / 2),
      new THREE.Vector3(x + 0.09, y,  depth / 2),
    ]);
    return g;
  }, [width, depth]);

  return (
    <>
      <lineSegments geometry={geoW} material={lineMat} />
      <lineSegments geometry={geoD} material={lineMat} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Garde-corps — poteaux + lisses haute/basse + balustres
   ─────────────────────────────────────────────────────────────
   Le moteur `generateGardeCorps` retourne des quantitatifs et une
   geometry linéaire (sides concaténés en X). Ici on re-place les
   pièces en 3D sur les 4 bords de la terrasse (rectangle centré
   sur l'origine), Y = 0 correspondant à la surface des lames.

   Les pièces sont posées au-dessus de Y_BOARD + BOARD_THICK/2
   (top des lames). NF DTU 36.3 P3 §C.2 :
   - POST_SECTION 70×70 mm
   - RAIL 60×40 mm (haute + basse)
   - BALUSTER 40×40 mm (espacement libre ≤ 110 mm)
───────────────────────────────────────────────────────────── */
function GardeCorpsGroup({ structure, width, depth }) {
  const enabled = !!structure;
  const height = structure?.height ?? 1.0;
  const balustreLen = structure?.balustreLength ?? (height - 2 * GC_RAIL_H);
  const balustreSpacing = structure?.balustreSpacing ?? 0.11;
  const selectedSides = structure?.sides ?? ['avant', 'gauche'];

  const showAvant   = selectedSides.includes('avant');
  const showArriere = selectedSides.includes('arrière');
  const showGauche  = selectedSides.includes('gauche');
  const showDroite  = selectedSides.includes('droite');

  /* Hauteur de base du garde-corps = top des lames (Y local du groupe slope) */
  const yBase = Y_BOARD + BOARD_THICK / 2;

  /* Matériaux bois — ton chaud cohérent avec la palette terrasse */
  const postMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B6914', roughness: 0.85, metalness: 0, envMapIntensity: 0.4,
  }), []);
  const railMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#A0785A', roughness: 0.80, metalness: 0, envMapIntensity: 0.4,
  }), []);
  const balusterMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#9A6E3C', roughness: 0.82, metalness: 0, envMapIntensity: 0.4,
  }), []);

  /* Géométries unitaires */
  const postGeo = useMemo(
    () => new THREE.BoxGeometry(GC_POST_SECTION, height, GC_POST_SECTION),
    [height],
  );
  const balusterGeo = useMemo(
    () => new THREE.BoxGeometry(GC_BALUSTER_SECTION, balustreLen, GC_BALUSTER_SECTION),
    [balustreLen],
  );

  /* Calcul des pièces par côté — 4 bords d'un rectangle centré sur l'origine.
     Chaque côté : axis = 'x' (avant/arrière) ou 'z' (gauche/droite),
                   length = longueur du côté,
                   u = position transverse fixe (z pour avant/arrière, x pour gauche/droite).
     show : booléen lié au sélecteur de côtés (visible={} sur le groupe). */
  const sides = useMemo(() => ([
    { key: 'front',  axis: 'x', length: width,  u: -depth / 2, show: showAvant   },
    { key: 'back',   axis: 'x', length: width,  u:  depth / 2, show: showArriere },
    { key: 'left',   axis: 'z', length: depth,  u: -width / 2, show: showGauche  },
    { key: 'right',  axis: 'z', length: depth,  u:  width / 2, show: showDroite  },
  ]), [width, depth, showAvant, showArriere, showGauche, showDroite]);

  /* Pour chaque côté : positions poteaux + balustres + extents lisses */
  const sideData = useMemo(() => {
    const MAX_POST_SPACING = 1.20;
    return sides.map(s => {
      const intervals = Math.max(1, Math.ceil(s.length / MAX_POST_SPACING));
      const spacing = s.length / intervals;
      const start = -s.length / 2;
      const postCoords = [];
      for (let i = 0; i <= intervals; i++) postCoords.push(+(start + i * spacing).toFixed(4));

      /* Balustres entre chaque paire de poteaux — espacement ≤ balustreSpacing */
      const balusters = [];
      for (let i = 0; i < postCoords.length - 1; i++) {
        const bayStart = postCoords[i] + GC_POST_SECTION / 2;
        const bayEnd   = postCoords[i + 1] - GC_POST_SECTION / 2;
        const usable   = Math.max(0, bayEnd - bayStart);
        if (usable <= 0) continue;
        const nInt = Math.max(2, Math.ceil(usable / balustreSpacing));
        const step = usable / nInt;
        for (let j = 1; j < nInt; j++) balusters.push(+(bayStart + j * step).toFixed(4));
      }

      return { ...s, postCoords, balusters };
    });
  }, [sides, balustreSpacing]);

  return (
    <group visible={enabled}>
      {sideData.map(s => (
        <GardeCorpsSide
          key={s.key}
          side={s}
          visible={s.show}
          height={height}
          yBase={yBase}
          balustreLen={balustreLen}
          postGeo={postGeo}
          balusterGeo={balusterGeo}
          postMat={postMat}
          railMat={railMat}
          balusterMat={balusterMat}
        />
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   GardeCorpsSide — rendu d'un seul côté du garde-corps.
   Utilise visible={bool} (règle R3F) pour masquer sans démonter.
───────────────────────────────────────────────────────────── */
function GardeCorpsSide({ side, visible, height, yBase, balustreLen, postGeo, balusterGeo, postMat, railMat, balusterMat }) {
  const postsMesh     = useRef();
  const balustersMesh = useRef();

  const totalPosts     = side.postCoords.length;
  const totalBalusters = side.balusters.length;

  /* Matrices : poteaux */
  useEffect(() => {
    const mesh = postsMesh.current;
    if (!mesh || totalPosts === 0) return;
    const dummy = new THREE.Object3D();
    side.postCoords.forEach((coord, i) => {
      if (side.axis === 'x') {
        dummy.position.set(coord, yBase + height / 2, side.u);
      } else {
        dummy.position.set(side.u, yBase + height / 2, coord);
      }
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [side, yBase, height, totalPosts]);

  /* Matrices : balustres */
  useEffect(() => {
    const mesh = balustersMesh.current;
    if (!mesh || totalBalusters === 0) return;
    const dummy = new THREE.Object3D();
    const yCenter = yBase + GC_RAIL_H + balustreLen / 2;
    side.balusters.forEach((coord, i) => {
      if (side.axis === 'x') {
        dummy.position.set(coord, yCenter, side.u);
      } else {
        dummy.position.set(side.u, yCenter, coord);
      }
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [side, yBase, balustreLen, totalBalusters]);

  const yLow  = yBase + GC_RAIL_H / 2;
  const yHigh = yBase + height - GC_RAIL_H / 2;
  const isX   = side.axis === 'x';
  const railSize    = isX ? [side.length, GC_RAIL_H, GC_RAIL_W] : [GC_RAIL_W, GC_RAIL_H, side.length];
  const railPosLow  = isX ? [0, yLow,  side.u] : [side.u, yLow,  0];
  const railPosHigh = isX ? [0, yHigh, side.u] : [side.u, yHigh, 0];

  return (
    <group visible={visible}>
      <instancedMesh
        key={`gc-posts-${side.key}-${totalPosts}`}
        ref={postsMesh}
        args={[postGeo, postMat, Math.max(totalPosts, 1)]}
        frustumCulled={false}
      />
      {totalBalusters > 0 && (
        <instancedMesh
          key={`gc-bal-${side.key}-${totalBalusters}`}
          ref={balustersMesh}
          args={[balusterGeo, balusterMat, Math.max(totalBalusters, 1)]}
          frustumCulled={false}
        />
      )}
      <mesh position={railPosLow}>
        <boxGeometry args={railSize} />
        <primitive object={railMat} attach="material" />
      </mesh>
      <mesh position={railPosHigh}>
        <boxGeometry args={railSize} />
        <primitive object={railMat} attach="material" />
      </mesh>
    </group>
  );
}
