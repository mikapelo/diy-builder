'use client';
/**
 * CabanonScene/index.jsx — Orchestrateur de la scène 3D cabanon
 *
 * V10 : transitions animées entre modes (opacity lerp) + annotations 3D
 *
 * Délègue le rendu à :
 *   - StructureGroup.jsx  → montants, lisses, framings, contreventement
 *   - RoofGroup.jsx       → chevrons, voliges, bastaings, tôle
 *   - WallsGroup.jsx      → bardage, ouvertures, murs legacy
 *   - EnvironmentGroup.jsx → sol, fondation, ombres
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE  from 'three';

import { SECTION as SEC } from '@/lib/cabanonConstants.js';
import { NON_WOOD }       from './materials.js';
import SceneSetup from '../shared/SceneSetup.jsx';

import { StudsGroup, FramingsGroup, LissesGroup, BracingGroup } from './StructureGroup.jsx';
import { ChevronsGroup, RoofEntretoisesGroup, RoofMesh } from './RoofGroup.jsx';
import { CladdingGroup, OpeningsAssembled, WallsMesh, BackingPanels, CornerTrims, RiveTrims } from './WallsGroup.jsx';
import { FoundationSlab } from './EnvironmentGroup.jsx';
import { HumanReference } from '../HumanReference.jsx';

/* ── Lerp helper — smooth transitions ── */
const LERP_SPEED = 0.07;

/* ── Traverse un group et set opacity sur tous les matériaux ── */
function setGroupOpacity(group, opacity) {
  if (!group) return;
  group.traverse(child => {
    if (child.material) {
      const mat = child.material;
      if (opacity < 0.99) {
        mat.transparent = true;
        mat.opacity = opacity;
        mat.depthWrite = opacity > 0.1;
      } else {
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
      }
    }
  });
}

export default function CabanonScene({ geometry, sceneMode = 'assembled', foundationType = 'ground', showHuman = true }) {
  const { dimensions, openings, structuralStuds, framings, lisses, chevrons, roofEntretoises, bracing, roof } = geometry;
  const { width, depth, height, slope, roofBaseY } = dimensions;
  const roofAngle = roof?.angle ?? Math.atan2(slope, width);
  const roofLen   = roof?.len   ?? Math.sqrt(width ** 2 + slope ** 2);

  const isFinished = sceneMode === 'assembled';
  const isDetailed = sceneMode === 'detailed' || sceneMode === 'exploded';

  /* ═══ TRANSITIONS ANIMÉES ═══
     Chaque groupe a une opacité cible (0 ou 1) selon le mode.
     useFrame lerp l'opacité courante vers la cible chaque frame.
     visible reste toujours true — c'est l'opacité qui anime. */

  /* Refs pour les groupes animés */
  const structureRef  = useRef();  // montants, framings, chevrons, bracing
  const claddingRef   = useRef();  // bardage complet
  const partialCladRef = useRef(); // bardage partiel (1 face)
  const roofMeshRef   = useRef();  // tôle
  const voligesRef    = useRef();  // voliges + bastaings

  /* Refs pour animation exploded */
  const wallGroupRef = useRef();
  const roofGroupRef = useRef();

  /* Valeurs animées courantes (pas du state — mis à jour 60fps) */
  const anim = useRef({
    structureOp:  isFinished ? 0 : 1,
    claddingOp:   isFinished ? 1 : 0,
    partialCladOp: isDetailed ? 1 : 0,
    roofMeshOp:   isFinished ? 1 : 0,
    voligesOp:    isDetailed ? 1 : 0,
    wallY: 0,
    roofY: 0,
  });

  useFrame(() => {
    const a = anim.current;
    const lerp = THREE.MathUtils.lerp;

    /* Cibles d'opacité selon le mode */
    const tStruct   = isFinished ? 0 : 1;
    const tClad     = isFinished ? 1 : 0;
    const tPartial  = isDetailed ? 1 : 0;
    const tRoof     = isFinished ? 1 : 0;
    const tVoliges  = isDetailed ? 1 : 0;

    a.structureOp   = lerp(a.structureOp,   tStruct,  LERP_SPEED);
    a.claddingOp    = lerp(a.claddingOp,    tClad,    LERP_SPEED);
    a.partialCladOp = lerp(a.partialCladOp, tPartial, LERP_SPEED);
    a.roofMeshOp    = lerp(a.roofMeshOp,    tRoof,    LERP_SPEED);
    a.voligesOp     = lerp(a.voligesOp,     tVoliges, LERP_SPEED);

    /* Appliquer opacité + hide si quasi-invisible */
    const apply = (ref, op) => {
      if (!ref.current) return;
      const vis = op > 0.01;
      ref.current.visible = vis;
      if (vis) setGroupOpacity(ref.current, op);
    };
    apply(structureRef,   a.structureOp);
    apply(claddingRef,    a.claddingOp);
    apply(partialCladRef, a.partialCladOp);
    apply(roofMeshRef,    a.roofMeshOp);
    apply(voligesRef,     a.voligesOp);

    /* Animation mode éclaté */
    const tW = sceneMode === 'exploded' ? 0.5 : 0;
    const tR = sceneMode === 'exploded' ? 1.0 : 0;
    a.wallY = lerp(a.wallY, tW, 0.08);
    a.roofY = lerp(a.roofY, tR, 0.08);
    if (wallGroupRef.current) wallGroupRef.current.position.y = a.wallY;
    if (roofGroupRef.current) roofGroupRef.current.position.y = a.roofY;
  });

  return (
    <>

      {/* ── Éclairage et environnement ── */}
      <SceneSetup width={width} depth={depth} foundationType={foundationType} />
      <FoundationSlab width={width} depth={depth} visible={foundationType === 'slab'} />

      {/* ── Construction — surélevée sur chape si nécessaire ── */}
      <group position={[0, foundationType === 'slab' ? 0.12 : 0, 0]}>

        {/* ── Lisses (rives) — toujours visibles ── */}
        <group name="lisses-group">
          <LissesGroup lisses={lisses} dimensions={dimensions} detailed={isDetailed} />
        </group>

        {/* ── Ossature structurelle — fade via opacity lerp ── */}
        <group ref={structureRef} name="structure-group">
          <group name="studs-group">
            <StudsGroup list={structuralStuds} width={width} depth={depth} detailed={isDetailed} />
          </group>
          <group name="framings-group">
            <FramingsGroup framings={framings} width={width} depth={depth} detailed={isDetailed} />
          </group>
          <group name="chevrons-group">
            <ChevronsGroup chevrons={chevrons} depth={depth} roofLen={roofLen} roofAngle={roofAngle} detailed={isDetailed} />
          </group>
          <group name="bracing-group">
            <BracingGroup bracing={bracing} visible={true} detailed={isDetailed} />
          </group>
        </group>

        {/* ── Enveloppe murale ── */}
        <group ref={wallGroupRef}>
          {/* Bardage complet — fade via opacity lerp */}
          <group ref={claddingRef} name="cladding-group">
            <BackingPanels width={width} depth={depth} height={height} slope={slope} openings={openings} />
            <CladdingGroup width={width} depth={depth} height={height} slope={slope} openings={openings} />
            <CornerTrims width={width} depth={depth} height={height} slope={slope} />
            <RiveTrims width={width} depth={depth} height={height} slope={slope} />
            <OpeningsAssembled openings={openings} width={width} depth={depth} doorColor={NON_WOOD.door} />
          </group>
          {/* Bardage partiel (1 face) — detailed mode */}
          <group ref={partialCladRef} name="partial-clad-group">
            <CladdingGroup width={width} depth={depth} height={height} slope={slope} openings={openings} wallFilter={[2]} />
          </group>
        </group>

        {/* ── Toit ── */}
        <group ref={roofGroupRef}>
          <group ref={roofMeshRef} name="roof-group">
            <RoofMesh width={width} depth={depth} roofBaseY={roofBaseY} slope={slope} />
          </group>
          <group ref={voligesRef} name="roof-entretoises-group">
            <RoofEntretoisesGroup roofEntretoises={roofEntretoises} width={width} depth={depth} detailed={isDetailed} />
          </group>
        </group>

      </group>{/* /slab-lift */}

      {/* ── Silhouette humaine 1.75 m — repère d'échelle ──
           Placée à l'extérieur, angle avant-droit du cabanon.
           y=0 (pose au sol, même si le cabanon est surélevé sur chape). */}
      <HumanReference
        position={[width / 2 + 0.6, 0, depth / 2 + 0.6]}
        visible={showHuman}
      />

    </>
  );
}
