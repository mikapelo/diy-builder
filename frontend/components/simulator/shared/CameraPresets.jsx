'use client';
/**
 * CameraPresets.jsx — Boutons de vue prédéfinie pour les viewers 3D
 *
 * Composant en DEUX parties :
 *   1. <CameraAnimator> (dans le Canvas) — anime la caméra via useFrame
 *   2. <CameraPresetButtons> (hors Canvas) — boutons UI
 *
 * Presets : Face / Dessus / 3/4 Hero
 * Animation : lerp position + target sur 40 frames (~700ms)
 */
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Calcule les positions caméra pour chaque preset
 * @param {number} w - largeur
 * @param {number} d - profondeur
 * @param {number} h - hauteur
 */
export function getPresets(w, d, h) {
  const diag = Math.sqrt(w * w + d * d);
  const dist = Math.max(diag * 0.9, 3.5);
  return {
    hero:  { pos: [w * 1.15, h * 1.4, d * 1.65],    target: [0, h * 0.35, 0] },
    face:  { pos: [0, h * 0.5, dist * 1.8],          target: [0, h * 0.35, 0] },
    top:   { pos: [0, Math.max(dist * 1.6, h * 4), 0.01], target: [0, 0, 0] },
    side:  { pos: [dist * 1.8, h * 0.5, 0],          target: [0, h * 0.35, 0] },
  };
}

/**
 * CameraAnimator — monte dans le <Canvas>, anime la caméra vers le preset cible.
 * @prop {string|null} preset — clé du preset actif (null = pas d'animation)
 * @prop {object} presets — résultat de getPresets()
 * @prop {function} onDone — callback quand l'animation termine
 */
export function CameraAnimator({ preset, presets, onDone }) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const animating = useRef(false);
  const progress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const controls = camera.parent?.parent?.__r3f?.root?.getState()?.controls;
    if (controls) controlsRef.current = controls;
  }, [camera]);

  useEffect(() => {
    if (!preset || !presets[preset]) return;
    const p = presets[preset];
    startPos.current.copy(camera.position);
    endPos.current.set(...p.pos);
    if (controlsRef.current) {
      startTarget.current.copy(controlsRef.current.target);
    } else {
      startTarget.current.set(0, 0, 0);
    }
    endTarget.current.set(...p.target);
    progress.current = 0;
    animating.current = true;
  }, [preset]);

  useFrame(() => {
    if (!animating.current) return;
    progress.current += 0.035;
    const t = Math.min(progress.current, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    camera.position.lerpVectors(startPos.current, endPos.current, ease);
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startTarget.current, endTarget.current, ease);
      controlsRef.current.update();
    }
    camera.lookAt(
      THREE.MathUtils.lerp(startTarget.current.x, endTarget.current.x, ease),
      THREE.MathUtils.lerp(startTarget.current.y, endTarget.current.y, ease),
      THREE.MathUtils.lerp(startTarget.current.z, endTarget.current.z, ease),
    );

    if (t >= 1) {
      animating.current = false;
      if (onDone) onDone();
    }
  });

  return null;
}

/**
 * CameraAnimatorSimple — version qui lit directement les controls via useThree
 * (plus fiable car OrbitControls avec makeDefault est dans le store)
 */
export function CameraAnimatorSimple({ preset, presets, onDone }) {
  const { camera, controls } = useThree();
  const animRef = useRef({ active: false, t: 0, sp: new THREE.Vector3(), ep: new THREE.Vector3(), st: new THREE.Vector3(), et: new THREE.Vector3() });

  useEffect(() => {
    if (!preset || !presets[preset] || !controls) return;
    const a = animRef.current;
    const p = presets[preset];
    a.sp.copy(camera.position);
    a.ep.set(...p.pos);
    a.st.copy(controls.target);
    a.et.set(...p.target);
    a.t = 0;
    a.active = true;
  }, [preset]);

  useFrame(() => {
    const a = animRef.current;
    if (!a.active || !controls) return;
    a.t = Math.min(a.t + 0.04, 1);
    const ease = 1 - Math.pow(1 - a.t, 3);
    camera.position.lerpVectors(a.sp, a.ep, ease);
    controls.target.lerpVectors(a.st, a.et, ease);
    controls.update();
    if (a.t >= 1) {
      a.active = false;
      if (onDone) onDone();
    }
  });

  return null;
}

const PRESET_BTNS = [
  { key: 'hero',  label: '3/4',    icon: '◈' },
  { key: 'face',  label: 'Face',   icon: '□' },
  { key: 'top',   label: 'Dessus', icon: '◻' },
  { key: 'side',  label: 'Côté',   icon: '▯' },
];

/**
 * CameraPresetButtons — boutons UI (hors Canvas)
 */
export function CameraPresetButtons({ activePreset, onSelect }) {
  return (
    <div className="cam-presets">
      {PRESET_BTNS.map(p => (
        <button
          key={p.key}
          className={`cam-preset-btn${activePreset === p.key ? ' active' : ''}`}
          onClick={() => onSelect(p.key)}
          title={`Vue ${p.label}`}
        >
          <span className="cam-preset-icon">{p.icon}</span>
          <span className="cam-preset-label">{p.label}</span>
        </button>
      ))}
    </div>
  );
}
