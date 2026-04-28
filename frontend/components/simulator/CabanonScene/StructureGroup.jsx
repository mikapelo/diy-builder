/**
 * StructureGroup.jsx — Ossature structurelle du cabanon
 *
 * Composants : StudsGroup, FramingsGroup, LissesGroup, BracingGroup
 * Lit directement geometry.structuralStuds / framings / lisses / bracing.
 */
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

import { wallDef } from '@/modules/cabanon/engine';
import { SECTION as SEC } from '@/lib/cabanonConstants.js';
import { EdgedBox, EDGE_MAT, EDGE_STRUCT_DETAIL_MAT } from './helpers.js';
import { getWoodMaterial, WOOD } from './materials.js';
import { CC } from '../shared/colorCode.js';

/* ── Montants verticaux — InstancedMesh + Edges ──────────────────── */
export function StudsGroup({ list, width, depth, woodKey = 'studs', detailed = false }) {
  const meshRef = useRef();
  const edgeRef = useRef();
  /* En mode détaillé, masquer les jack studs (trimmers) pour éviter
   * l'effet "double montant" incohérent avec le mode assemblé. */
  const visibleList = useMemo(
    () => (list ?? []).filter(s => !detailed || s.type !== 'jack'),
    [list, detailed],
  );
  const baseGeo = useMemo(() => new THREE.BoxGeometry(SEC, 1, SEC), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(baseGeo, 15), [baseGeo]);
  const woodMat = useMemo(() => {
    const w = WOOD[woodKey];
    return getWoodMaterial(woodKey, w.base, w.grain, w.density, w.roughness);
  }, [woodKey]);
  const mat = detailed ? CC.studs.mat : woodMat;

  useEffect(() => {
    if (!meshRef.current || !visibleList.length) return;
    const m = new THREE.Matrix4();
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    visibleList.forEach((stud, i) => {
      const zb = stud.zBase ?? 0;
      /* Les montants au sol (zBase=0) reposent SUR la lisse basse (épaisseur SEC).
       * Leur base visuelle démarre à SEC et la hauteur est réduite d'autant,
       * évitant la superposition montant/lisse visible en mode détaillé. */
      const base = zb === 0 ? SEC : zb;
      const visH = zb === 0 ? Math.max(stud.height - SEC, 0.01) : stud.height;
      p.set(stud.x - width / 2, base + visH / 2, depth / 2 - stud.y);
      q.identity();
      s.set(1, visH, 1);
      m.compose(p, q, s);
      meshRef.current.setMatrixAt(i, m);
      if (edgeRef.current) edgeRef.current.setMatrixAt(i, m);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (edgeRef.current) edgeRef.current.instanceMatrix.needsUpdate = true;
  }, [visibleList, width, depth, detailed]);

  if (!visibleList.length) return null;
  const count = visibleList.length;
  return (
    <group>
      <instancedMesh ref={meshRef} args={[baseGeo, mat, count]} />
      {!detailed && <instancedMesh ref={edgeRef} args={[edgeGeo, EDGE_MAT, count]} />}
    </group>
  );
}

/* ── Framings horizontaux (linteaux + seuils) ─────────────────────── */
export function FramingsGroup({ framings, width, depth, detailed = false }) {
  const woodMat = useMemo(() => {
    const w = WOOD.framing;
    return getWoodMaterial('framing', w.base, w.grain, w.density, w.roughness);
  }, []);
  const mat = detailed ? CC.framing.mat : woodMat;

  if (!framings?.length) return null;
  return (
    <group>
      {framings.map((f, i) => {
        const def = wallDef(f.wall, width, depth);
        const { position, rotY } = def.toWorld(f.u, f.v + f.hh / 2, 0.005);
        return (
          <EdgedBox key={i} position={position} rotation={[0, rotY, 0]}
            args={[f.w, f.hh, SEC]} material={mat}
            edgeMat={detailed ? EDGE_STRUCT_DETAIL_MAT : undefined} />
        );
      })}
    </group>
  );
}

/* ── Lisses — basses + hautes + double sablière ───────────────────── */
export function LissesGroup({ lisses, dimensions, detailed = false }) {
  const { width, slope } = dimensions;
  const slopeAngle = Math.atan2(slope, width);
  const slopeLen   = Math.sqrt(width * width + slope * slope);

  const woodMat = useMemo(() => {
    const w = WOOD.lisses;
    return getWoodMaterial('lisses', w.base, w.grain, w.density, w.roughness);
  }, []);
  const mat = detailed ? CC.lisses.mat : woodMat;

  const cosA = Math.cos(slopeAngle);
  const sinA = Math.sin(slopeAngle);
  const edgeMat = detailed ? EDGE_STRUCT_DETAIL_MAT : undefined;

  /** Render une lisse. perpOff = offset perpendiculaire au rampant (pour hautes2). */
  const renderLisse = (l, key, isSloped, perpOff = 0) => {
    if (isSloped) {
      /* Longueur inclinée = longueur horizontale (avec L-joint) / cos(pente).
       * Corrige le bug où toutes les lisses inclinées avaient la même longueur
       * (slopeLen = sqrt(w²+s²)) au lieu de tenir compte de l'extension L-joint. */
      const actualSlopeLen = l.len3d / cosA;
      /* Position : centre du rampant + offset SEC/2 vertical pour la 1ère sablière.
       * Pour la double sablière (perpOff > 0), on décale perpendiculairement au
       * rampant au lieu de verticalement, ce qui aligne les deux pièces. */
      const baseY = l.start[2] - perpOff + slope / 2 + SEC / 2;
      const oY = baseY + perpOff * cosA;
      const oX = l.mx3d - perpOff * sinA;
      return (
        <EdgedBox key={key} position={[oX, oY, l.mz3d]}
              rotation={[0, 0, slopeAngle]}
              args={[actualSlopeLen, SEC, SEC]} material={mat} edgeMat={edgeMat} />
      );
    }
    return (
      <EdgedBox key={key} position={[l.mx3d, l.start[2] + SEC / 2, l.mz3d]}
            rotation={[0, -l.ang3d, 0]}
            args={[l.len3d, SEC, SEC]} material={mat} edgeMat={edgeMat} />
    );
  };

  return (
    <group>
      {lisses.basses.map((l, i) => renderLisse(l, `b${i}`, false))}
      {lisses.hautes.map((l, i) => renderLisse(l, `h${i}`, i === 0 || i === 2))}
      {detailed && (lisses.hautes2 ?? []).map((l, i) =>
        renderLisse(l, `h2${i}`, i === 0 || i === 2, i === 0 || i === 2 ? SEC : 0)
      )}
    </group>
  );
}

/* ── Contreventement diagonal ────────────────────────────────────── */
export function BracingGroup({ bracing, visible, detailed = false }) {
  const woodMat = useMemo(() => {
    const w = WOOD.bracing;
    return getWoodMaterial('bracing', w.base, w.grain, w.density, w.roughness);
  }, []);
  const mat = detailed ? CC.bracing.mat : woodMat;

  if (!bracing?.length) return null;
  return (
    <group visible={visible}>
      {bracing.map((b, i) => (
        <EdgedBox key={i} position={[b.cx, b.cy, b.cz]} rotation={[b.rx, b.ry, b.rz]}
          args={[SEC * 0.7, b.len3d, SEC * 0.3]} material={mat} />
      ))}
    </group>
  );
}
