'use client';
/**
 * PergolaScene.jsx — Scène Three.js pour la pergola V2
 *
 * Visual upgrade v2 :
 *   - Matériaux bois procéduraux avec textures réalistes (grain, normalMap)
 *   - Éclairage premium 4 directionnelles + environment map
 *   - Jambes de force diagonales (contreventement poteau→longeron)
 *   - Longerons avec débord au-delà des poteaux
 *   - Animation éclatée fluide (lerp amélioré)
 *
 * Rendu :
 *   - N poteaux dynamiques (bois clair, chunky, base solide)
 *   - 2 longerons en X avec débord (bois moyen, poutres maîtresses)
 *   - 2 traverses en Z (bois moyen, sur longerons)
 *   - N chevrons en Z avec porte-à-faux (bois sombre, léger)
 *   - 2N jambes de force diagonales (bois moyen-sombre, contreventement)
 *
 * Modes : assembled / exploded
 *
 * Convention : X=largeur, Z=profondeur, Y=hauteur
 * Le centre de la scène est à (width/2, 0, depth/2).
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getWoodMaterial, getConcreteMaterial } from './shared/materials.js';
import { CC } from './shared/colorCode.js';
import SceneSetup from './shared/SceneSetup.jsx';
import { EDGE_SILHOUETTE_MAT, EDGE_STRUCT_MAT } from './shared/edges.js';
import { HumanReference } from './HumanReference.jsx';

const EXPLODE_RAFTERS = 0.6;  // Y offset en mode éclaté
const EXPLODE_BEAMS   = 0.3;

// Cache des matériaux bois texturés
let WOOD_POST_MAT   = null;
let WOOD_BEAM_MAT   = null;
let WOOD_RAFTER_MAT = null;
let WOOD_BRACE_MAT  = null;

function getWoodPostMaterial() {
  if (!WOOD_POST_MAT) {
    WOOD_POST_MAT = getWoodMaterial(
      'pergola-posts',
      '#c8b090',     // base clair
      '#b08070',     // grain moyen
      16,            // densité veinage
      0.78,          // roughness
      0.5            // envMapIntensity
    );
  }
  return WOOD_POST_MAT;
}

function getWoodBeamMaterial() {
  if (!WOOD_BEAM_MAT) {
    WOOD_BEAM_MAT = getWoodMaterial(
      'pergola-beams',
      '#b09070',     // base moyen
      '#986656',     // grain plus foncé
      18,
      0.75,
      0.55
    );
  }
  return WOOD_BEAM_MAT;
}

function getWoodRafterMaterial() {
  if (!WOOD_RAFTER_MAT) {
    WOOD_RAFTER_MAT = getWoodMaterial(
      'pergola-rafters',
      '#9a7856',     // base sombre
      '#7a5a3a',     // grain très sombre
      20,
      0.72,
      0.45
    );
  }
  return WOOD_RAFTER_MAT;
}

function getWoodBraceMaterial() {
  if (!WOOD_BRACE_MAT) {
    WOOD_BRACE_MAT = getWoodMaterial(
      'pergola-braces',
      '#a08060',     // base moyen-sombre
      '#8a6a4a',     // grain sombre
      22,
      0.76,
      0.50
    );
  }
  return WOOD_BRACE_MAT;
}

/**
 * Groupe de jambes de force — rendu via meshes individuels
 * avec rotation Euler (pas de quaternion, R3F-safe).
 *
 * Deux plans possibles :
 *   plane='X' → diagonale dans le plan XY (le long du longeron)
 *   plane='Z' → diagonale dans le plan ZY (le long de la traverse)
 *
 * La box Three.js est alignée Y par défaut. On pivote :
 *   - plane='X' : rotation Z pour incliner dans le plan XY
 *   - plane='Z' : rotation X pour incliner dans le plan ZY
 */
function BracesGroup({ braces, cx, cz, section, material }) {
  if (!braces || braces.length === 0) return null;
  return (
    <group>
      {braces.map((br, i) => {
        const dx = br.x2 - br.x1;
        const dy = br.y2 - br.y1;
        const dz = br.z2 - br.z1;
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (length < 0.01) return null;

        const midX = (br.x1 + br.x2) / 2 - cx;
        const midY = (br.y1 + br.y2) / 2;
        const midZ = (br.z1 + br.z2) / 2 - cz;

        let rotX = 0, rotY = 0, rotZ = 0;
        if (br.plane === 'Z') {
          // Diagonale dans le plan ZY — pivoter autour de X
          rotX = Math.atan2(dz, dy);
        } else {
          // Diagonale dans le plan XY — pivoter autour de Z
          rotZ = -Math.atan2(dx, dy);
        }

        return (
          <mesh
            key={`brace-${i}`}
            material={material}
            position={[midX, midY, midZ]}
            rotation={[rotX, rotY, rotZ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[section, length, section]} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function PergolaScene({ geometry, sceneMode = 'assembled', foundationType = 'ground', detailed = false, showHuman = false }) {
  const exploded = sceneMode === 'exploded';
  const { dimensions, posts, beamsLong, beamsShort, rafters, braces = [] } = geometry;
  const {
    width, depth, height, postSection,
    beamW, beamH, rafterW, rafterH,
    braceSection = 0.075,
  } = dimensions;

  // Centre de la scène
  const cx = width / 2;
  const cz = depth / 2;

  // Refs pour animation
  const rafterGrp = useRef();
  const beamGrp   = useRef();

  useFrame((_, dt) => {
    const t = Math.min(1, 5 * dt);
    if (rafterGrp.current) {
      const target = exploded ? EXPLODE_RAFTERS : 0;
      rafterGrp.current.position.y = THREE.MathUtils.lerp(rafterGrp.current.position.y, target, t);
    }
    if (beamGrp.current) {
      const target = exploded ? EXPLODE_BEAMS : 0;
      beamGrp.current.position.y = THREE.MathUtils.lerp(beamGrp.current.position.y, target, t);
    }
  });

  // Géométries unitaires mémoïsées
  const postGeo   = useMemo(() => new THREE.BoxGeometry(postSection, 1, postSection), [postSection]);
  const beamLGeo  = useMemo(() => new THREE.BoxGeometry(1, beamH, beamW), [beamH, beamW]);
  const beamSGeo  = useMemo(() => new THREE.BoxGeometry(beamW, beamH, 1), [beamH, beamW]);
  const rafterGeo = useMemo(() => new THREE.BoxGeometry(rafterW, rafterH, 1), [rafterW, rafterH]);

  // Géométries d'arêtes mémoïsées
  const postEdgeGeo   = useMemo(() => new THREE.EdgesGeometry(postGeo,   15), [postGeo]);
  const beamLEdgeGeo  = useMemo(() => new THREE.EdgesGeometry(beamLGeo,  15), [beamLGeo]);
  const beamSEdgeGeo  = useMemo(() => new THREE.EdgesGeometry(beamSGeo,  15), [beamSGeo]);
  const rafterEdgeGeo = useMemo(() => new THREE.EdgesGeometry(rafterGeo, 15), [rafterGeo]);

  // Matériaux : bois texturé en assemblé, couleurs primaires en détaillé
  const woodPostMat   = detailed ? CC.posts.mat   : getWoodPostMaterial();
  const woodBeamMat   = detailed ? CC.beams.mat   : getWoodBeamMaterial();
  const woodRafterMat = detailed ? CC.rafters.mat  : getWoodRafterMaterial();
  const woodBraceMat  = detailed ? CC.braces.mat  : getWoodBraceMaterial();

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

      {/* ── Construction — surélevée sur chape si nécessaire ── */}
      <group position={[0, foundationType === 'slab' ? 0.12 : 0, 0]}>

        {/* ── Poteaux (bois clair, base solide) ── */}
        {posts.map((p, i) => (
          <group key={`post-${i}`} position={[p.x - cx, p.height / 2, p.z - cz]} scale={[1, p.height, 1]}>
            <mesh geometry={postGeo} material={woodPostMat} castShadow receiveShadow />
            <lineSegments geometry={postEdgeGeo} material={EDGE_SILHOUETTE_MAT} />
          </group>
        ))}

        {/* ── Jambes de force (contreventement diagonal, bois moyen-sombre) ── */}
        <BracesGroup
          braces={braces}
          cx={cx}
          cz={cz}
          section={braceSection}
          material={woodBraceMat}
        />

        {/* ── Longerons + Traverses (animées ensemble, bois moyen) ── */}
        <group ref={beamGrp}>
          {beamsLong.map((b, i) => (
            <group key={`blong-${i}`} position={[(b.x1 + b.x2) / 2 - cx, b.y + beamH / 2, b.z - cz]} scale={[b.x2 - b.x1, 1, 1]}>
              <mesh geometry={beamLGeo} material={woodBeamMat} castShadow receiveShadow />
              <lineSegments geometry={beamLEdgeGeo} material={EDGE_STRUCT_MAT} />
            </group>
          ))}
          {beamsShort.map((b, i) => (
            <group key={`bshort-${i}`} position={[b.x - cx, b.y + beamH / 2, (b.z1 + b.z2) / 2 - cz]} scale={[1, 1, b.z2 - b.z1]}>
              <mesh geometry={beamSGeo} material={woodBeamMat} castShadow receiveShadow />
              <lineSegments geometry={beamSEdgeGeo} material={EDGE_STRUCT_MAT} />
            </group>
          ))}
        </group>

        {/* ── Chevrons (animés séparément, bois sombre, léger) ── */}
        <group ref={rafterGrp}>
          {rafters.map((r, i) => (
            <group key={`rafter-${i}`} position={[r.x - cx, r.y + rafterH / 2, (r.z1 + r.z2) / 2 - cz]} scale={[1, 1, r.z2 - r.z1]}>
              <mesh geometry={rafterGeo} material={woodRafterMat} castShadow receiveShadow />
              <lineSegments geometry={rafterEdgeGeo} material={EDGE_STRUCT_MAT} />
            </group>
          ))}
        </group>

      </group>{/* /slab-lift */}

      {/* ── Silhouette humaine 1.75 m — repère d'échelle ──
           Placée à l'extérieur, angle avant-droit de la pergola.
           Scène centrée sur (0,0,0) → coin = (width/2, 0, depth/2). */}
      <HumanReference
        position={[width / 2 + 0.6, 0, depth / 2 + 0.6]}
        visible={showHuman}
      />
    </>
  );
}
