'use client';
/**
 * BardageScene.jsx — Scène Three.js pour un mur bardé
 *
 * Visualise une surface bardée verticale de `width × height` :
 *   - Lames (InstancedMesh si > 10) posées en pureau sur toute la largeur
 *   - Tasseaux verticaux (ossature secondaire), rendus en mode 'detailed'
 *   - Panneau support / OSB à l'arrière, rendu en mode 'coupe'
 *   - Sol de référence en gris clair
 *
 * Convention d'axes 3D :
 *   X = largeur du mur (centré sur 0)
 *   Y = hauteur (0 = bas du mur)
 *   Z = profondeur (0 = face visible, Z<0 = côté tasseaux)
 *
 * Le mur est centré sur l'origine (0, height/2, 0) et face à +Z.
 *
 * Modes :
 *   'assembled' → lames pleinement opaques, tasseaux masqués
 *   'detailed'  → lames légèrement transparentes, tasseaux visibles derrière
 *   'coupe'     → 3 couches séparées en Z : lames (avant), tasseaux (milieu),
 *                 panneau support OSB (arrière). Écartement COUPE_Z_GAP.
 */
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import SceneSetup from './shared/SceneSetup.jsx';
import { HumanReference } from './HumanReference.jsx';

// ── Couleurs ────────────────────────────────────────────────────────
const COLOR_LAME = '#C8A882';
const COLOR_TASSEAU = '#A0785A';
const COLOR_PANEL = '#8B9196';
const COLOR_GROUND = '#E8E4DC';

// ── Constantes mode "Coupe" ─────────────────────────────────────────
/* Écartement entre couches en mode coupe : 40 cm, lisible mais pas démesuré. */
const COUPE_Z_GAP = 0.40;
/* Épaisseur du panneau support / OSB — 15 mm (valeur standard). */
const PANEL_THICKNESS = 0.015;

// ── Helpers ─────────────────────────────────────────────────────────

/** Cache matériel pour éviter recréations à chaque render. */
function useLameMaterial(detailed) {
  return useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: COLOR_LAME,
      roughness: 0.78,
      metalness: 0.02,
      transparent: detailed,
      opacity: detailed ? 0.75 : 1,
    });
    return m;
  }, [detailed]);
}

function useTasseauMaterial() {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_TASSEAU,
        roughness: 0.82,
        metalness: 0.02,
      }),
    [],
  );
}

/** Matériau panneau support OSB — gris mat, non métallique. */
function usePanelMaterial() {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR_PANEL,
        roughness: 0.75,
        metalness: 0,
      }),
    [],
  );
}

/* ── Groupe Lames — InstancedMesh ──────────────────────────────────── */
function LamesGroup({ lames, width, height, pose, lameVisible, lameThickness, material, zOffset = 0 }) {
  const meshRef = useRef();

  const baseGeo = useMemo(
    () => new THREE.BoxGeometry(1, 1, 1),
    [],
  );

  useEffect(() => {
    return () => {
      baseGeo.dispose();
    };
  }, [baseGeo]);

  useEffect(() => {
    if (!meshRef.current || !lames?.length) return;
    const m = new THREE.Matrix4();
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();

    lames.forEach((lame, i) => {
      if (pose === 'vertical') {
        /* Pose verticale : lames parallèles à Y (hauteur complète), largeur = lameVisible.
         * Chaque lame est centrée en x = lame.x1 (origine engine = bord gauche). */
        p.set(lame.x1 - width / 2 + lameVisible / 2, height / 2, zOffset);
        s.set(lameVisible, height, lameThickness);
      } else {
        /* Pose horizontale : lames parallèles à X (largeur complète), hauteur = lameVisible.
         * Chaque lame est centrée en y = lame.y (origine engine = bas du mur). */
        p.set(0, lame.y + lameVisible / 2, zOffset);
        s.set(width, lameVisible, lameThickness);
      }
      q.identity();
      m.compose(p, q, s);
      meshRef.current.setMatrixAt(i, m);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [lames, width, height, pose, lameVisible, lameThickness, zOffset]);

  if (!lames?.length) return null;
  return (
    <instancedMesh
      ref={meshRef}
      args={[baseGeo, material, lames.length]}
      castShadow
      receiveShadow
    />
  );
}

/* ── Groupe Tasseaux — InstancedMesh ───────────────────────────────── */
function TasseauxGroup({ tasseaux, width, height, pose, section, material, visible, zOffset }) {
  const meshRef = useRef();

  const baseGeo = useMemo(
    () => new THREE.BoxGeometry(1, 1, 1),
    [],
  );

  useEffect(() => {
    return () => {
      baseGeo.dispose();
    };
  }, [baseGeo]);

  useEffect(() => {
    if (!meshRef.current || !tasseaux?.length) return;
    const m = new THREE.Matrix4();
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();

    /* Position Z des tasseaux — pilotée par zOffset (mode coupe : -COUPE_Z_GAP,
     * modes classiques : -section/2 pour rester derrière les lames). */
    const zBack = zOffset;

    tasseaux.forEach((t, i) => {
      if (pose === 'vertical') {
        /* Pose verticale : tasseaux horizontaux, à hauteur y, traversent toute la largeur */
        p.set(0, t.y1, zBack);
        s.set(width, section, section);
      } else {
        /* Pose horizontale : tasseaux verticaux à position x, traversent toute la hauteur */
        p.set(t.x - width / 2, height / 2, zBack);
        s.set(section, height, section);
      }
      q.identity();
      m.compose(p, q, s);
      meshRef.current.setMatrixAt(i, m);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [tasseaux, width, height, pose, section, zOffset]);

  if (!tasseaux?.length) return null;
  return (
    <instancedMesh
      ref={meshRef}
      args={[baseGeo, material, tasseaux.length]}
      visible={visible}
      castShadow
      receiveShadow
    />
  );
}

/* ── Panneau support OSB — visible uniquement en mode 'coupe' ───────── */
function PanelSupport({ width, height, zOffset, material, visible }) {
  return (
    <mesh position={[0, height / 2, zOffset]} visible={visible} castShadow receiveShadow>
      <boxGeometry args={[width, height, PANEL_THICKNESS]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ── Scène principale ──────────────────────────────────────────────── */
export default function BardageScene({ geometry, sceneMode = 'assembled', showHuman = true }) {
  const detailed = sceneMode === 'detailed';
  const coupe = sceneMode === 'coupe';
  const { dimensions, lames, tasseaux, pose } = geometry;
  const {
    width,
    height,
    lameVisible,
    lameThickness,
    tasseauSection,
  } = dimensions;

  const lameMat = useLameMaterial(detailed);
  const tasseauMat = useTasseauMaterial();
  const panelMat = usePanelMaterial();

  /* Offsets Z par couche :
   *   - Lames      : toujours en 0 (face visible).
   *   - Tasseaux   : -tasseauSection/2 en modes classiques, -COUPE_Z_GAP en coupe.
   *   - Panneau    : -COUPE_Z_GAP * 2 (uniquement affiché en coupe).
   */
  const lameZ = 0;
  const tasseauZ = coupe ? -COUPE_Z_GAP : -tasseauSection / 2;
  const panelZ = -COUPE_Z_GAP * 2;

  /* Cleanup : dispose des matériaux créés manuellement */
  useEffect(() => {
    return () => {
      lameMat.dispose();
    };
  }, [lameMat]);

  useEffect(() => {
    return () => {
      tasseauMat.dispose();
    };
  }, [tasseauMat]);

  useEffect(() => {
    return () => {
      panelMat.dispose();
    };
  }, [panelMat]);

  return (
    <>
      {/* Éclairage et environnement standard */}
      <SceneSetup width={Math.max(width, 2)} depth={Math.max(width, 2)} />

      {/* Sol de référence (en plus de StandardEnvironment, pour rester visible) */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[Math.max(width * 2, 4), Math.max(width * 2, 4)]} />
        <meshStandardMaterial color={COLOR_GROUND} roughness={0.9} metalness={0} />
      </mesh>

      {/* Lames */}
      <LamesGroup
        lames={lames}
        width={width}
        height={height}
        pose={pose}
        lameVisible={lameVisible}
        lameThickness={lameThickness}
        material={lameMat}
        zOffset={lameZ}
      />

      {/* Tasseaux — visibles en mode 'detailed' ou 'coupe'.
          `visible` préserve la ref useFrame contrairement à un render conditionnel. */}
      <TasseauxGroup
        tasseaux={tasseaux}
        width={width}
        height={height}
        pose={pose}
        section={tasseauSection}
        material={tasseauMat}
        visible={detailed || coupe}
        zOffset={tasseauZ}
      />

      {/* Panneau support / OSB — visible uniquement en mode 'coupe', couche arrière. */}
      <PanelSupport
        width={width}
        height={height}
        zOffset={panelZ}
        material={panelMat}
        visible={coupe}
      />

      {/* ── Silhouette humaine 1.75 m — repère d'échelle ──
           Devant le mur bardé, à droite. Mur à Z=0, face visible vers +Z. */}
      <HumanReference
        position={[width / 2 + 0.5, 0, 0.8]}
        visible={showHuman}
      />
    </>
  );
}
