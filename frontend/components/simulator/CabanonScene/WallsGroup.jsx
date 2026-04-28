/**
 * WallsGroup.jsx — Murs, bardage, ouvertures du cabanon
 *
 * Composants : CladdingGroup, OpeningsAssembled, DoorRealistic,
 *              WindowRealistic, WallsMesh (legacy, conservé)
 */
import { useMemo } from 'react';
import * as THREE from 'three';

import { wallDef } from '@/modules/cabanon/engine';
import { SECTION as SEC } from '@/lib/cabanonConstants.js';
import { EdgedBox, EDGE_CLAD_MAT, EDGE_FRAME_MAT } from './helpers.js';
import { getWoodMaterial, WOOD, NON_WOOD, CLAD_VARIANTS } from './materials.js';

/* ── Constantes bardage ────────────────────────────────────────────── */
const PLANK_H     = 0.10;
const PLANK_GAP   = 0.012;
const PLANK_STEP  = PLANK_H + PLANK_GAP;
const PLANK_THICK = 0.018;
const CLAD_OFF    = 0.055;
const PLANK_RELIEF = 0.003;
const OPEN_OFF    = 0.07;

/* ── Constantes coupe bardage — pose parquet à joints décalés ────── */
const PLANK_LEN_NOM = 2.8;
const PLANK_CUT_GAP = 0.008;

/* ── V3.1 — Abouts / coupes de lames ─────────────────────────────── *
 * Materiau distinct pour les faces gauche/droite (bois de bout).
 * Couleur ajustable ici pour comparaison rapide :
 *   Brun chaud fonce : '#3a2818'  (version 1 — elegante)
 *   Quasi-noir chaud : '#241810'  (version 2 — plus contrastee)       */
const ENDGRAIN_COLOR = '#3a2818';
const ENDGRAIN_ROUGHNESS = 0.92;

let _endGrainMatCache = null;
function getEndGrainMaterial() {
  if (_endGrainMatCache) return _endGrainMatCache;
  _endGrainMatCache = new THREE.MeshStandardMaterial({
    color: ENDGRAIN_COLOR,
    roughness: ENDGRAIN_ROUGHNESS,
    metalness: 0.01,
    envMapIntensity: 0.2,
  });
  return _endGrainMatCache;
}

/** Pseudo-random déterministe */
function seededRand(seed) {
  let x = Math.sin(seed * 9137.17 + 7.31) * 43758.5453;
  return x - Math.floor(x);
}

/** Découpe un segment [from, to] en pose demi-lame credible.
 *  Motif : rangees paires = lames pleines depuis la rive gauche,
 *          rangees impaires = decalage d'une demi-lame.
 *  Minimum de coupe : 0.40m (pas de micro-chute absurde).
 *  wallRowIdx = index de rangee local au mur (pas global).          */
const MIN_CUT_LEN = 0.40;

function splitPlank(from, to, wallRowIdx) {
  const len = to - from;
  if (len <= PLANK_LEN_NOM + 0.10) return [{ from, to }];

  const out = [];
  // Demi-lame offset pour rangees impaires
  const offset = (wallRowIdx % 2 === 1) ? PLANK_LEN_NOM * 0.5 : 0;
  let prev = from;
  let cutAt = from + (offset > 0 ? offset : PLANK_LEN_NOM);

  while (cutAt < to - MIN_CUT_LEN) {
    out.push({ from: prev, to: cutAt });
    prev = cutAt + PLANK_CUT_GAP;
    cutAt = prev + PLANK_LEN_NOM;
  }
  // Derniere piece — fusionner si trop courte
  if (to - prev > 0.05) {
    if (to - prev < MIN_CUT_LEN && out.length > 0) {
      // Fusionner avec la precedente
      const last = out[out.length - 1];
      last.to = to;
    } else {
      out.push({ from: prev, to });
    }
  }
  return out;
}

/* ── Lame de bardage avec abouts sombres ─────────────────────────── *
 * Multi-material BoxGeometry : faces ±X = bois de bout (sombre),
 * faces ±Y et ±Z = bois de face (texture standard).
 * BoxGeometry groups: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z, 5=-Z          */
function CladdingPlank({ args, faceMat, position, rotation }) {
  const endMat = useMemo(() => getEndGrainMaterial(), []);
  const geo = useMemo(() => new THREE.BoxGeometry(...args), [args[0], args[1], args[2]]);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(geo, 15), [geo]);
  const materials = useMemo(() => [endMat, endMat, faceMat, faceMat, faceMat, faceMat], [endMat, faceMat]);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} material={materials} castShadow />
      <lineSegments geometry={edgeGeo} material={EDGE_CLAD_MAT} />
    </group>
  );
}

/* ── Bardage horizontal — lames bois avec relief ───────────────────── */
export function CladdingGroup({ width, depth, height, slope, openings, wallFilter }) {
  const mats = useMemo(() =>
    CLAD_VARIANTS.map(v => getWoodMaterial(v.key, v.base, v.grain, v.density, v.roughness)),
  []);

  const planks = useMemo(() => {
    const out = [];
    const walls = wallFilter ?? [0, 1, 2, 3];
    let plankIdx = 0;
    for (const wallId of walls) {
      const def   = wallDef(wallId, width, depth, height, slope);
      const wLen  = def.len;
      const wOps  = openings.filter(o => o.wall === wallId);
      const hMax  = (wallId === 1) ? height + slope
                  : (wallId === 3) ? height
                  : height + slope;

      let wallRow = 0;
      for (let v = PLANK_STEP / 2; v < hMax; v += PLANK_STEP) {
        let uMin = 0, uMax = wLen;

        if (v > height && (wallId === 0 || wallId === 2)) {
          const frac = (v - height) / slope;
          if (frac >= 1) continue;
          if (wallId === 0) uMin = wLen * frac + SEC;
          else              uMax = wLen * (1 - frac) - SEC;
        }
        if (wallId === 1 && v > height + slope) continue;
        if (wallId === 3 && v > height) continue;

        // Materiau deterministe par mur + rangee locale
        const rowMatIdx = Math.floor(seededRand(wallRow * 7 + wallId * 31) * mats.length);

        let segs = [{ from: uMin, to: uMax }];
        for (const o of wOps) {
          if (v + PLANK_H / 2 <= o.v || v - PLANK_H / 2 >= o.v + o.height) continue;
          const next = [];
          for (const s of segs) {
            if (s.to <= o.u || s.from >= o.u + o.width) { next.push(s); continue; }
            if (s.from < o.u)          next.push({ from: s.from, to: o.u });
            if (s.to > o.u + o.width)  next.push({ from: o.u + o.width, to: s.to });
          }
          segs = next;
        }

        for (const seg of segs) {
          // wallRow = index local → motif de coupe coherent par mur
          const cuts = splitPlank(seg.from, seg.to, wallRow);
          for (const cut of cuts) {
            const len = cut.to - cut.from;
            if (len < 0.05) continue;
            const relief = (wallRow % 2 === 0) ? PLANK_RELIEF : 0;
            const { position, rotY } = def.toWorld((cut.from + cut.to) / 2, v, CLAD_OFF + relief);
            out.push({ position, rotY, len, idx: plankIdx, matIdx: rowMatIdx });
            plankIdx++;
          }
        }
        wallRow++;
      }
    }
    return out;
  }, [width, depth, height, slope, openings, wallFilter]);

  return (
    <group>
      {planks.map((p, i) => (
        <CladdingPlank key={i} position={p.position} rotation={[0, p.rotY, 0]}
          args={[p.len, PLANK_H, PLANK_THICK]}
          faceMat={mats[p.matIdx]} />
      ))}
    </group>
  );
}

/* ── Porte réaliste — planches verticales + poignée ───────────────── */
function DoorRealistic({ width: dw, height: dh }) {
  const doorWoodMat = useMemo(() =>
    getWoodMaterial('door_panel', '#4a2c16', '#22120a', 30, 0.88), []);

  const PLANK_COUNT = Math.max(3, Math.round(dw / 0.18));
  const plankW = (dw - 0.02) / PLANK_COUNT;
  const GAP = 0.002;

  return (
    <group>
      {Array.from({ length: PLANK_COUNT }).map((_, i) => {
        const x = -dw / 2 + 0.01 + plankW / 2 + i * plankW;
        return (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[plankW - GAP, dh - 0.02, 0.035]} />
            <primitive object={doorWoodMat} attach="material" />
          </mesh>
        );
      })}
      <mesh position={[0, dh * 0.35, 0.019]} castShadow>
        <boxGeometry args={[dw - 0.03, 0.06, 0.012]} />
        <primitive object={doorWoodMat} attach="material" />
      </mesh>
      <mesh position={[0, -dh * 0.35, 0.019]} castShadow>
        <boxGeometry args={[dw - 0.03, 0.06, 0.012]} />
        <primitive object={doorWoodMat} attach="material" />
      </mesh>
      <mesh position={[dw / 2 - 0.08, 0, 0.03]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.85} roughness={0.25} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[dw / 2 - 0.08, 0, 0.022]} castShadow>
        <boxGeometry args={[0.025, 0.10, 0.004]} />
        <meshStandardMaterial color="#7a7a7a" metalness={0.80} roughness={0.30} />
      </mesh>
      <mesh position={[0, -dh / 2 - 0.01, 0.01]} castShadow>
        <boxGeometry args={[dw + 0.04, 0.02, 0.06]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.85} metalness={0.02} />
      </mesh>
    </group>
  );
}

/* ── Fenêtre réaliste — verre physique + croisillons bois ─────────── */
function WindowRealistic({ width: ww, height: wh }) {
  const frameWoodMat = useMemo(() =>
    getWoodMaterial('win_frame', '#46301a', '#221408', 28, 0.82), []);

  const FRAME = 0.035;
  const iw = ww - FRAME * 2;
  const ih = wh - FRAME * 2;
  const MUNTIN = 0.018;

  return (
    <group>
      <mesh>
        <boxGeometry args={[iw, ih, 0.006]} />
        <meshPhysicalMaterial
          color="#e8f4f8" transmission={0.80} roughness={0.05} metalness={0.0}
          ior={1.5} thickness={0.006} transparent opacity={0.4}
          envMapIntensity={2.0} depthWrite={false}
        />
      </mesh>
      <mesh position={[0, wh / 2 - FRAME / 2, 0.004]} castShadow>
        <boxGeometry args={[ww, FRAME, 0.030]} />
        <primitive object={frameWoodMat} attach="material" />
      </mesh>
      <mesh position={[0, -wh / 2 + FRAME / 2, 0.004]} castShadow>
        <boxGeometry args={[ww, FRAME, 0.030]} />
        <primitive object={frameWoodMat} attach="material" />
      </mesh>
      <mesh position={[-ww / 2 + FRAME / 2, 0, 0.004]} castShadow>
        <boxGeometry args={[FRAME, wh, 0.030]} />
        <primitive object={frameWoodMat} attach="material" />
      </mesh>
      <mesh position={[ww / 2 - FRAME / 2, 0, 0.004]} castShadow>
        <boxGeometry args={[FRAME, wh, 0.030]} />
        <primitive object={frameWoodMat} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.006]} castShadow>
        <boxGeometry args={[iw, MUNTIN, 0.020]} />
        <primitive object={frameWoodMat} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.006]} castShadow>
        <boxGeometry args={[MUNTIN, ih, 0.020]} />
        <primitive object={frameWoodMat} attach="material" />
      </mesh>
      <mesh position={[0, -wh / 2 - 0.015, 0.015]} castShadow>
        <boxGeometry args={[ww + 0.06, 0.025, 0.06]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.85} metalness={0.02} />
      </mesh>
    </group>
  );
}

/* ── Constantes dormant ────────────────────────────────────────────── */
const DORMANT_THICK = 0.04;
const DORMANT_W     = 0.05;
const DORMANT_C     = '#382218';  // V3 : plus fonce, decoupe mieux les ouvertures

/* ── Ouvertures assemblées — porte + fenêtre avec dormant ─────────── */
export function OpeningsAssembled({ openings, width, depth, doorColor }) {
  if (!openings?.length) return null;
  return (
    <group>
      {openings.map((o, i) => {
        const def = wallDef(o.wall, width, depth);
        const { position, rotY } = def.toWorld(
          o.u + o.width / 2, o.v + o.height / 2, OPEN_OFF,
        );
        const ow = o.width  + SEC * 2;
        const oh = o.height + SEC;

        if (o.type === 'door') {
          return (
            <group key={i} position={position} rotation={[0, rotY, 0]}>
              <DoorRealistic width={o.width} height={o.height} />
              <mesh position={[0, o.height / 2, 0]} castShadow>
                <boxGeometry args={[o.width + DORMANT_W * 2, DORMANT_W, DORMANT_THICK]} />
                <meshStandardMaterial color={DORMANT_C} roughness={0.8} metalness={0.02} />
              </mesh>
              <mesh position={[-o.width / 2 - DORMANT_W / 2, 0, 0]} castShadow>
                <boxGeometry args={[DORMANT_W, o.height + DORMANT_W, DORMANT_THICK]} />
                <meshStandardMaterial color={DORMANT_C} roughness={0.8} metalness={0.02} />
              </mesh>
              <mesh position={[o.width / 2 + DORMANT_W / 2, 0, 0]} castShadow>
                <boxGeometry args={[DORMANT_W, o.height + DORMANT_W, DORMANT_THICK]} />
                <meshStandardMaterial color={DORMANT_C} roughness={0.8} metalness={0.02} />
              </mesh>
              <mesh position={[0, 0, -0.03]} castShadow>
                <boxGeometry args={[ow, oh, 0.02]} />
                <meshStandardMaterial color={'#2a1a10'} roughness={0.9} metalness={0.01} />
              </mesh>
            </group>
          );
        }

        return (
          <group key={i} position={position} rotation={[0, rotY, 0]}>
            <mesh position={[0, 0, -0.02]}>
              <boxGeometry args={[ow, oh, 0.02]} />
              <meshStandardMaterial color={'#2a1a10'} roughness={0.9} metalness={0.01} />
            </mesh>
            <mesh position={[0, o.height / 2 + DORMANT_W / 2, 0]} castShadow>
              <boxGeometry args={[o.width + DORMANT_W * 2, DORMANT_W, DORMANT_THICK]} />
              <meshStandardMaterial color={DORMANT_C} roughness={0.8} metalness={0.02} />
            </mesh>
            <mesh position={[0, -o.height / 2 - DORMANT_W / 2, 0]} castShadow>
              <boxGeometry args={[o.width + DORMANT_W * 2, DORMANT_W, DORMANT_THICK]} />
              <meshStandardMaterial color={DORMANT_C} roughness={0.8} metalness={0.02} />
            </mesh>
            <mesh position={[-o.width / 2 - DORMANT_W / 2, 0, 0]} castShadow>
              <boxGeometry args={[DORMANT_W, o.height + DORMANT_W * 2, DORMANT_THICK]} />
              <meshStandardMaterial color={DORMANT_C} roughness={0.8} metalness={0.02} />
            </mesh>
            <mesh position={[o.width / 2 + DORMANT_W / 2, 0, 0]} castShadow>
              <boxGeometry args={[DORMANT_W, o.height + DORMANT_W * 2, DORMANT_THICK]} />
              <meshStandardMaterial color={DORMANT_C} roughness={0.8} metalness={0.02} />
            </mesh>
            <WindowRealistic width={o.width} height={o.height} />
          </group>
        );
      })}
    </group>
  );
}

/* ── V3.4 — Rives de finition (base + haute) ─────────────────────── *
 * Baguettes horizontales en rive basse et rive haute de chaque mur.
 * Ferment visuellement l'enveloppe bardee.
 * Teinte bois coordonnee bardage, ton moyen-fonce.                  */
const RIVE_H     = 0.06;   // hauteur 6cm
const RIVE_THICK = 0.025;  // epaisseur 2.5cm
const RIVE_COLOR = '#a88050';  // ton bardage — coordonne aux lisses

/** Rives de finition — positionnement direct en coordonnees monde
 *  (meme approche que CornerTrims qui fonctionne).
 *  Rive basse = au sol sur chaque mur.
 *  Rive haute = en haut des murs lateraux (1 et 3).                  */
export function RiveTrims({ width, depth, height, slope }) {
  const hw = width / 2;
  const hd = depth / 2;
  const Z_OUT = CLAD_OFF + PLANK_THICK + 0.005;

  // Materiau partage via Three.js (pas JSX — un JSX element ne peut monter qu'une fois)
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: RIVE_COLOR, roughness: 0.78, metalness: 0.02, envMapIntensity: 0.5,
  }), []);

  const rives = [
    // 4 rives basses
    { pos: [0, RIVE_H / 2, hd + Z_OUT],          rot: [0, 0, 0],           args: [width + 0.02, RIVE_H, RIVE_THICK] },
    { pos: [0, RIVE_H / 2, -hd - Z_OUT],         rot: [0, 0, 0],           args: [width + 0.02, RIVE_H, RIVE_THICK] },
    { pos: [hw + Z_OUT, RIVE_H / 2, 0],           rot: [0, Math.PI / 2, 0], args: [depth + 0.02, RIVE_H, RIVE_THICK] },
    { pos: [-hw - Z_OUT, RIVE_H / 2, 0],          rot: [0, Math.PI / 2, 0], args: [depth + 0.02, RIVE_H, RIVE_THICK] },
    // 2 rives hautes laterales
    { pos: [hw + Z_OUT, height + slope - RIVE_H / 2, 0],  rot: [0, Math.PI / 2, 0], args: [depth + 0.02, RIVE_H, RIVE_THICK] },
    { pos: [-hw - Z_OUT, height - RIVE_H / 2, 0],          rot: [0, Math.PI / 2, 0], args: [depth + 0.02, RIVE_H, RIVE_THICK] },
  ];

  return (
    <group>
      {rives.map((r, i) => (
        <mesh key={i} position={r.pos} rotation={r.rot} material={mat} castShadow>
          <boxGeometry args={r.args} />
        </mesh>
      ))}
    </group>
  );
}

/* ── V3.2 — Backing panels derriere le bardage ──────────────────── *
 * Panneaux sombres continus par mur, decoupes autour des ouvertures.
 * Visible uniquement en mode assemble.
 * Ton brun fonce mat — evoque un support OSB sans texture forte.     */
const BACKING_COLOR = '#3a2c20';
const BACKING_THICK = 0.006;
const BACKING_OFF   = 0.015;   // derriere le bardage (CLAD_OFF=0.055)

let _backingMatCache = null;
function getBackingMaterial() {
  if (_backingMatCache) return _backingMatCache;
  // Texture ultra-subtile pour eviter l'aplat mort
  const w = 128, h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = BACKING_COLOR;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    ctx.globalAlpha = 0.03 + Math.random() * 0.04;
    ctx.fillStyle = Math.random() > 0.5 ? '#322418' : '#42342a';
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random());
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  _backingMatCache = new THREE.MeshStandardMaterial({
    map: tex, color: BACKING_COLOR, roughness: 0.92, metalness: 0.01,
    envMapIntensity: 0.15, side: THREE.FrontSide,
  });
  return _backingMatCache;
}

/** Decoupe un rectangle mur en sous-rectangles evitant les ouvertures */
function tileAroundOpenings(wLen, wHeight, ops) {
  if (!ops.length) return [{ u: 0, v: 0, w: wLen, h: wHeight }];

  // Collecter les Y-cuts et X-cuts depuis les ouvertures
  const yCuts = [0, wHeight];
  const rects = [];
  for (const o of ops) {
    yCuts.push(o.v, o.v + o.height);
  }
  const ys = [...new Set(yCuts)].sort((a, b) => a - b);

  for (let yi = 0; yi < ys.length - 1; yi++) {
    const yBot = ys[yi], yTop = ys[yi + 1];
    if (yTop - yBot < 0.01) continue;
    const yMid = (yBot + yTop) / 2;

    // Trouver les ouvertures qui couvrent cette bande Y
    const blocking = ops.filter(o => yMid >= o.v && yMid < o.v + o.height);
    if (!blocking.length) {
      rects.push({ u: 0, v: yBot, w: wLen, h: yTop - yBot });
      continue;
    }
    // Trier les bloqueurs par u
    const sorted = [...blocking].sort((a, b) => a.u - b.u);
    let uStart = 0;
    for (const o of sorted) {
      if (o.u > uStart + 0.01) {
        rects.push({ u: uStart, v: yBot, w: o.u - uStart, h: yTop - yBot });
      }
      uStart = o.u + o.width;
    }
    if (wLen > uStart + 0.01) {
      rects.push({ u: uStart, v: yBot, w: wLen - uStart, h: yTop - yBot });
    }
  }
  return rects;
}

export function BackingPanels({ width, depth, height, slope, openings }) {
  const mat = useMemo(() => getBackingMaterial(), []);

  const panels = useMemo(() => {
    const out = [];
    for (let wallId = 0; wallId < 4; wallId++) {
      const def = wallDef(wallId, width, depth, height, slope);
      const wLen = def.len;
      // Backing s'arrete sous la rive haute pour ne pas la noyer
      const riveMargin = RIVE_H * 1.2;
      const wHeight = (wallId === 1) ? height + slope - riveMargin
                    : (wallId === 3) ? height - riveMargin
                    : height; // walls 0/2 : toiture couvre le haut
      const wOps = openings.filter(o => o.wall === wallId);
      const tiles = tileAroundOpenings(wLen, wHeight, wOps);
      for (const t of tiles) {
        const { position, rotY } = def.toWorld(t.u + t.w / 2, t.v + t.h / 2, BACKING_OFF);
        out.push({ position, rotY, w: t.w, h: t.h });
      }
    }
    return out;
  }, [width, depth, height, slope, openings]);

  return (
    <group>
      {panels.map((p, i) => (
        <mesh key={i} position={p.position} rotation={[0, p.rotY, 0]}>
          <boxGeometry args={[p.w, p.h, BACKING_THICK]} />
          <primitive object={mat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* ── V3.3 — Couvre-joints d'angle ─────────────────────────────────── *
 * Baguettes verticales aux 4 coins — ferment la jonction entre
 * les deux faces de bardage. Section carree, ton bardage fonce.
 * Hauteur adaptee a la pente (coins droits plus hauts).             */
const CORNER_SEC  = 0.035;  // section 3.5cm
const CORNER_C    = '#5a4030';  // brun bardage fonce

export function CornerTrims({ width, depth, height, slope }) {
  // 4 coins — chaque coin a une hauteur specifique selon la pente mono-pente
  // Wall 1 (droite) = cote haut (height+slope), Wall 3 (gauche) = cote bas (height)
  const corners = [
    { x: -width / 2, z:  depth / 2, h: height },           // front-left  (wall0 ∩ wall3)
    { x:  width / 2, z:  depth / 2, h: height + slope },   // front-right (wall0 ∩ wall1)
    { x:  width / 2, z: -depth / 2, h: height + slope },   // back-right  (wall2 ∩ wall1)
    { x: -width / 2, z: -depth / 2, h: height },           // back-left   (wall2 ∩ wall3)
  ];
  return (
    <group>
      {corners.map((c, i) => (
        <mesh key={i} position={[c.x, c.h / 2, c.z]} castShadow>
          <boxGeometry args={[CORNER_SEC, c.h, CORNER_SEC]} />
          <meshStandardMaterial color={CORNER_C} roughness={0.82} metalness={0.02} envMapIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Murs legacy (transparent / opaque) — conservé pour fallback ─── */
export function WallsMesh({ width, depth, height, openings, transparent, opacity: opProp, showOpenings }) {
  const op = transparent ? (opProp ?? 0.22) : 1;
  return (
    <>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={NON_WOOD.walls} roughness={0.9} metalness={0.05} envMapIntensity={0.8}
          transparent={transparent} opacity={op} depthWrite={!transparent}
          polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>
      {showOpenings && openings.map((o, i) => {
        const def = wallDef(o.wall, width, depth);
        const { position, rotY } = def.toWorld(o.u + o.width / 2, o.v + o.height / 2, 0.025);
        const isWindow = o.type === 'window';
        return (
          <mesh key={i} castShadow position={position} rotation={[0, rotY, 0]}>
            <boxGeometry args={[o.width, o.height, 0.05]} />
            <meshStandardMaterial
              color={isWindow ? NON_WOOD.window : NON_WOOD.door}
              roughness={isWindow ? 0.1 : 0.8}
              metalness={isWindow ? 0.2 : 0.05}
              envMapIntensity={0.8}
              transparent={isWindow}
              opacity={isWindow ? 0.8 : 1}
              depthWrite={!isWindow}
            />
          </mesh>
        );
      })}
    </>
  );
}
