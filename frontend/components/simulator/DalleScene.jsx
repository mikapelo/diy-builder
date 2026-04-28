'use client';
/**
 * DalleScene.jsx — Scène Three.js pour une dalle béton
 *
 * Visualise :
 *   - Dalle principale : box `(width × epaisseur × depth)` centrée sur origine
 *   - Coffrage : 4 planches bois debout à la périphérie de la dalle
 *   - Treillis soudé : LineSegments enrobés dans la moitié basse (mode coupe)
 *   - Joints de fractionnement : LineSegments lus depuis geometry.joints
 *   - Forme drainante : box sous la dalle (visible en mode 'coupe')
 *   - Sol de référence : plan gris clair
 *
 * Convention d'axes 3D :
 *   X = largeur
 *   Z = profondeur (Three.js)  — correspond à Z de l'engine (profondeur)
 *   Y = épaisseur verticale (Y=0 = milieu dalle)
 *
 * Engine → Three.js : les coords engine (x, z) avec origine (0, 0) au coin
 * sont converties vers (x - width/2, ..., z - depth/2) pour centrer la scène.
 *
 * Modes :
 *   'assembled' → dalle opaque + coffrage + joints ; treillis et forme masqués
 *   'coupe'     → dalle semi-transparente + coffrage + treillis + forme + joints
 */
import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import SceneSetup from './shared/SceneSetup.jsx';
import { FORME_THICKNESS, TREILLIS_MESH } from '@/lib/dalleConstants.js';
import { HumanReference } from './HumanReference.jsx';

// ── Couleurs ────────────────────────────────────────────────────────
const COLOR_DALLE = '#C8C8C0';
const COLOR_FORME = '#D4C4A0';
const COLOR_JOINT = '#808080';
const COLOR_GROUND = '#E8E4DC';
const COLOR_COFFRAGE = '#B8956A';
const COLOR_TREILLIS = '#78818C';

// ── Coffrage ────────────────────────────────────────────────────────
// Banches bois debout placées contre les 4 chants de la dalle.
const COFFRAGE_THICKNESS = 0.025; // épaisseur planche (m)

// ── Treillis ─────────────────────────────────────────────────────────
// Enrobage inférieur DTU 13.3 §5.4 : mini 3 cm en dallage courant.
// On place le treillis à 4 cm au-dessus de la sous-face → moitié basse.
const TREILLIS_ENROBAGE = 0.04;

/* ── BufferGeometry pour les joints ──────────────────────────────────
 * Transforme `geometry.joints` (segments x1/z1/x2/z2) en BufferGeometry
 * LineSegments. Les joints sont placés juste au-dessus de la face sup
 * de la dalle pour éviter le z-fighting.
 */
function useJointsGeometry(joints, width, depth, yJoint) {
  return useMemo(() => {
    if (!joints?.length) return null;
    // 2 points par segment × 3 coords
    const positions = new Float32Array(joints.length * 2 * 3);
    for (let i = 0; i < joints.length; i++) {
      const j = joints[i];
      const baseIdx = i * 6;
      // Point 1
      positions[baseIdx + 0] = j.x1 - width / 2;
      positions[baseIdx + 1] = yJoint;
      positions[baseIdx + 2] = j.z1 - depth / 2;
      // Point 2
      positions[baseIdx + 3] = j.x2 - width / 2;
      positions[baseIdx + 4] = yJoint;
      positions[baseIdx + 5] = j.z2 - depth / 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [joints, width, depth, yJoint]);
}

/* ── BufferGeometry pour le treillis soudé ───────────────────────────
 * Grille régulière de pas TREILLIS_MESH (= 0.15 m) dans le plan XZ.
 * Les lignes parcourent toute la dalle, ancrées à partir des bords.
 * Rendu en LineSegments → chaque ligne = 2 points.
 */
function useTreillisGeometry(width, depth, yTreillis) {
  return useMemo(() => {
    if (!(width > 0) || !(depth > 0)) return null;

    // Lignes parallèles à Z (couchées dans l'axe Z) : une à chaque pas en X
    const xs = [];
    for (let x = 0; x <= width + 1e-6; x += TREILLIS_MESH) xs.push(x);
    // Lignes parallèles à X (couchées dans l'axe X) : une à chaque pas en Z
    const zs = [];
    for (let z = 0; z <= depth + 1e-6; z += TREILLIS_MESH) zs.push(z);

    const segments = xs.length + zs.length;
    const positions = new Float32Array(segments * 2 * 3);
    let idx = 0;
    for (const x of xs) {
      positions[idx++] = x - width / 2;
      positions[idx++] = yTreillis;
      positions[idx++] = -depth / 2;
      positions[idx++] = x - width / 2;
      positions[idx++] = yTreillis;
      positions[idx++] = depth / 2;
    }
    for (const z of zs) {
      positions[idx++] = -width / 2;
      positions[idx++] = yTreillis;
      positions[idx++] = z - depth / 2;
      positions[idx++] = width / 2;
      positions[idx++] = yTreillis;
      positions[idx++] = z - depth / 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [width, depth, yTreillis]);
}

export default function DalleScene({ geometry, sceneMode = 'assembled', showHuman = true }) {
  const coupe = sceneMode === 'coupe';
  const { dimensions, joints } = geometry;
  const { width, depth, epaisseur } = dimensions;

  /* La dalle est centrée sur l'origine en X/Z, et son milieu en Y = 0.
   * → face supérieure à y = +epaisseur/2, face inférieure à y = -epaisseur/2 */
  const yJoint = epaisseur / 2 + 0.002;
  // Treillis dans la moitié basse du béton (enrobage 4 cm depuis la sous-face).
  const yTreillis = -epaisseur / 2 + TREILLIS_ENROBAGE;

  const jointsGeo = useJointsGeometry(joints, width, depth, yJoint);
  const treillisGeo = useTreillisGeometry(width, depth, yTreillis);

  const dalleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_DALLE,
        roughness: 0.85,
        metalness: 0.02,
        transparent: coupe,
        opacity: coupe ? 0.55 : 1,
      }),
    [coupe],
  );

  const formeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_FORME,
        roughness: 0.95,
        metalness: 0,
      }),
    [],
  );

  const jointMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: COLOR_JOINT, linewidth: 1 }),
    [],
  );

  // Matériau bois partagé entre les 4 planches de coffrage.
  const coffrageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_COFFRAGE,
        roughness: 0.72,
        metalness: 0,
      }),
    [],
  );

  const treillisMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: COLOR_TREILLIS, linewidth: 1 }),
    [],
  );

  /* Cleanup des ressources créées manuellement */
  useEffect(() => () => dalleMat.dispose(), [dalleMat]);
  useEffect(() => () => formeMat.dispose(), [formeMat]);
  useEffect(() => () => jointMat.dispose(), [jointMat]);
  useEffect(() => () => coffrageMat.dispose(), [coffrageMat]);
  useEffect(() => () => treillisMat.dispose(), [treillisMat]);
  useEffect(() => {
    return () => {
      if (jointsGeo) jointsGeo.dispose();
    };
  }, [jointsGeo]);
  useEffect(() => {
    return () => {
      if (treillisGeo) treillisGeo.dispose();
    };
  }, [treillisGeo]);

  /* Position Y de la forme drainante : centre sous la dalle.
     Face sup forme = face inf dalle (y = -epaisseur/2).
     Centre forme = -epaisseur/2 - FORME_THICKNESS/2. */
  const yForme = -epaisseur / 2 - FORME_THICKNESS / 2;
  /* Sol de référence : sous la forme drainante. */
  const yGround = yForme - FORME_THICKNESS / 2 - 0.01;

  /* Dimensions/positions des 4 planches de coffrage.
     - Planches G/D : longues dans l'axe Z, collées contre les chants X
     - Planches Av/Ar : longues dans l'axe X, avec retour sur les G/D
       (d'où width + 2 × COFFRAGE_THICKNESS). */
  const coffrageOffset = width / 2 + COFFRAGE_THICKNESS / 2;
  const coffrageOffsetDepth = depth / 2 + COFFRAGE_THICKNESS / 2;
  const coffrageAvArDepth = width + 2 * COFFRAGE_THICKNESS;

  return (
    <>
      {/* Éclairage et environnement standard */}
      <SceneSetup width={width} depth={depth} />

      {/* Sol de référence — sous tout l'ouvrage */}
      <mesh position={[0, yGround, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[Math.max(width * 2.5, 5), Math.max(depth * 2.5, 5)]} />
        <meshStandardMaterial color={COLOR_GROUND} roughness={0.95} metalness={0} />
      </mesh>

      {/* Forme drainante — visible seulement en coupe.
          `visible` plutôt que rendu conditionnel pour préserver les refs. */}
      <mesh
        position={[0, yForme, 0]}
        visible={coupe}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, FORME_THICKNESS, depth]} />
        <primitive object={formeMat} attach="material" />
      </mesh>

      {/* Dalle principale — centrée sur l'origine */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, epaisseur, depth]} />
        <primitive object={dalleMat} attach="material" />
      </mesh>

      {/* ── Coffrage — 4 banches bois toujours visibles ────────────── */}
      <group>
        {/* Gauche (x négatif) */}
        <mesh position={[-coffrageOffset, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[COFFRAGE_THICKNESS, epaisseur, depth]} />
          <primitive object={coffrageMat} attach="material" />
        </mesh>
        {/* Droite (x positif) */}
        <mesh position={[coffrageOffset, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[COFFRAGE_THICKNESS, epaisseur, depth]} />
          <primitive object={coffrageMat} attach="material" />
        </mesh>
        {/* Avant (z négatif) */}
        <mesh position={[0, 0, -coffrageOffsetDepth]} castShadow receiveShadow>
          <boxGeometry args={[coffrageAvArDepth, epaisseur, COFFRAGE_THICKNESS]} />
          <primitive object={coffrageMat} attach="material" />
        </mesh>
        {/* Arrière (z positif) */}
        <mesh position={[0, 0, coffrageOffsetDepth]} castShadow receiveShadow>
          <boxGeometry args={[coffrageAvArDepth, epaisseur, COFFRAGE_THICKNESS]} />
          <primitive object={coffrageMat} attach="material" />
        </mesh>
      </group>

      {/* Treillis soudé — visible seulement en coupe (dalle transparente) */}
      {treillisGeo && (
        <lineSegments visible={coupe}>
          <primitive object={treillisGeo} attach="geometry" />
          <primitive object={treillisMat} attach="material" />
        </lineSegments>
      )}

      {/* Joints de fractionnement — LineSegments juste au-dessus de la dalle */}
      {jointsGeo && (
        <lineSegments>
          <primitive object={jointsGeo} attach="geometry" />
          <primitive object={jointMat} attach="material" />
        </lineSegments>
      )}

      {/* ── Silhouette humaine 1.75 m — repère d'échelle ──
           Posée sur la face supérieure de la dalle (y = +epaisseur/2),
           côté avant-droit. */}
      <HumanReference
        position={[width / 2 - 0.4, epaisseur / 2, depth / 2 - 0.4]}
        visible={showHuman}
      />
    </>
  );
}
