/**
 * RoofGroup.jsx — Toiture du cabanon
 *
 * Composants : ChevronsGroup, VoligesGroup, BasteingsGroup, RoofMesh
 */
import { useMemo } from 'react';
import * as THREE from 'three';

import { SECTION as SEC, BASTAING_W, BASTAING_H } from '@/lib/cabanonConstants.js';
import { EdgedBox, EDGE_SILHOUETTE_MAT } from './helpers.js';
import { getWoodMaterial, WOOD, getRoofTopMaterial } from './materials.js';
import { CC } from '../shared/colorCode.js';

/* ── Chevrons ─────────────────────────────────────────────────────── */
const CHEVRON_OVERHANG = 0.20;

export function ChevronsGroup({ chevrons, depth, roofLen, roofAngle, detailed = false }) {
  const renderLen = roofLen + CHEVRON_OVERHANG * 2;

  const woodMat = useMemo(() => {
    const w = WOOD.chevrons;
    return getWoodMaterial('chevrons', w.base, w.grain, w.density, w.roughness);
  }, []);
  const matAlt = useMemo(() => {
    return getWoodMaterial('chevronsAlt', '#b8834c', '#6a4820', 24, 0.73);
  }, []);
  const mat = detailed ? CC.chevrons.mat : woodMat;

  const zRaw = chevrons.map(c => depth / 2 - c.y);
  if (!zRaw.length) return null;
  const zMin = Math.min(...zRaw);
  const zMax = Math.max(...zRaw);
  const zOffset = -(zMin + zMax) / 2;

  return (
    <group>
      {chevrons.map((c, i) => {
        const zPos = depth / 2 - c.y + zOffset;
        if (zPos < -(depth / 2 + 0.10) || zPos > depth / 2 + 0.10) return null;
        // Décaler le chevron vers le haut pour que sa face inférieure
        // repose SUR la sablière (et non que son centre soit sur la ligne de toit)
        const cosA = Math.cos(roofAngle);
        const yCenter = (c.z1 + c.z2) / 2 + (SEC / 2) * cosA;
        return (
          <EdgedBox key={i} position={[0, yCenter, zPos]} rotation={[0, 0, roofAngle]}
            args={[renderLen, SEC, SEC * 0.9]} material={detailed ? mat : (i % 4 === 0 ? matAlt : woodMat)} />
        );
      })}
    </group>
  );
}

/* ── Entretoises de toiture — entre chevrons, en quinconce ──────── */
export function RoofEntretoisesGroup({ roofEntretoises, width, depth, detailed = false }) {
  const woodMat = useMemo(() => {
    const w = WOOD.bastaing;
    return getWoodMaterial('roofEntretoise', w.base, w.grain, w.density, w.roughness);
  }, []);
  const mat = detailed ? CC.bastaing.mat : woodMat;

  if (!roofEntretoises?.length) return null;
  return (
    <group>
      {roofEntretoises.map((e, i) => (
        <EdgedBox key={i}
          position={[e.x - width / 2, e.z + SEC / 2, depth / 2 - e.yCenter]}
          args={[SEC, SEC, e.segLen]}
          material={mat} />
      ))}
    </group>
  );
}

/* ── Toit mono-pente avec épaisseur, UVs et nervures ──────────────── */
export function RoofMesh({ width, depth, roofBaseY, slope }) {
  const THICKNESS = 0.10;
  const OVERHANG  = 0.18;

  const roofTopMat = useMemo(() => getRoofTopMaterial(), []);

  const { topGeo, botGeo } = useMemo(() => {
    const hw = width / 2 + OVERHANG;
    const hd = depth / 2 + OVERHANG;
    /* Le débord prolonge la pente : Δy = OVERHANG × slope / width.
     * Sans ce terme, le toit n'est pas parallèle aux chevrons/sablières. */
    const ovRise = OVERHANG * slope / width;
    const L  = Math.sqrt(width ** 2 + slope ** 2);
    const nx = -slope / L;
    const ny =  width / L;

    const v0 = [-hw + nx * THICKNESS, roofBaseY - ovRise         + ny * THICKNESS, -hd];
    const v1 = [ hw + nx * THICKNESS, roofBaseY + slope + ovRise + ny * THICKNESS, -hd];
    const v2 = [ hw + nx * THICKNESS, roofBaseY + slope + ovRise + ny * THICKNESS,  hd];
    const v3 = [-hw + nx * THICKNESS, roofBaseY - ovRise         + ny * THICKNESS,  hd];
    const topPos = new Float32Array([...v0, ...v2, ...v1, ...v0, ...v3, ...v2]);
    const topUV = new Float32Array([0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1]);
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(topPos, 3));
    tg.setAttribute('uv', new THREE.BufferAttribute(topUV, 2));
    tg.computeVertexNormals();

    const b0 = [-hw, roofBaseY - ovRise,          -hd];
    const b1 = [ hw, roofBaseY + slope + ovRise, -hd];
    const b2 = [ hw, roofBaseY + slope + ovRise,  hd];
    const b3 = [-hw, roofBaseY - ovRise,           hd];
    const botPos = new Float32Array([...b0, ...b2, ...b1, ...b0, ...b3, ...b2]);
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(botPos, 3));
    bg.computeVertexNormals();

    return { topGeo: tg, botGeo: bg };
  }, [width, depth, roofBaseY, slope]);

  // Edge lines — silhouette du toit (peripherie + chant avant)
  const roofEdgeGeo = useMemo(() => {
    const hw = width / 2 + OVERHANG;
    const hd = depth / 2 + OVERHANG;
    const ovRise = OVERHANG * slope / width;
    const L  = Math.sqrt(width ** 2 + slope ** 2);
    const nx = -slope / L, ny = width / L;
    // Top face corners
    const t0 = [-hw + nx * THICKNESS, roofBaseY - ovRise         + ny * THICKNESS, -hd];
    const t1 = [ hw + nx * THICKNESS, roofBaseY + slope + ovRise + ny * THICKNESS, -hd];
    const t2 = [ hw + nx * THICKNESS, roofBaseY + slope + ovRise + ny * THICKNESS,  hd];
    const t3 = [-hw + nx * THICKNESS, roofBaseY - ovRise         + ny * THICKNESS,  hd];
    // Bottom face corners
    const b0 = [-hw, roofBaseY - ovRise,          -hd];
    const b1 = [ hw, roofBaseY + slope + ovRise, -hd];
    const b2 = [ hw, roofBaseY + slope + ovRise,  hd];
    const b3 = [-hw, roofBaseY - ovRise,           hd];
    // Lines: top perimeter + front chant + 4 vertical edges
    const pts = [
      ...t0, ...t1, ...t1, ...t2, ...t2, ...t3, ...t3, ...t0, // top perimeter
      ...b0, ...b1, ...b1, ...b2, ...b2, ...b3, ...b3, ...b0, // bottom perimeter
      ...t0, ...b0, ...t1, ...b1, ...t2, ...b2, ...t3, ...b3, // vertical edges
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [width, depth, roofBaseY, slope]);

  return (
    <>
      <mesh geometry={topGeo} castShadow receiveShadow material={roofTopMat} />
      <mesh geometry={botGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1614" roughness={0.75} metalness={0.05} envMapIntensity={0.2} />
      </mesh>
      {/* Contour silhouette du toit */}
      <lineSegments geometry={roofEdgeGeo} material={EDGE_SILHOUETTE_MAT} />
    </>
  );
}
