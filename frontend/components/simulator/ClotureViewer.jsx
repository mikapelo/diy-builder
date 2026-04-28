'use client';
/**
 * ClotureViewer.jsx — Viewer clôture avec modes assemblée / éclatée
 *
 * Structure identique à PergolaViewer :
 *   - Stats en haut (longueur, poteaux, lames)
 *   - Canvas Three.js
 *   - Onglets de mode
 *   - Légende
 */
import { useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ClotureScene from './ClotureScene';
import ClotureSketch from './ClotureSketch';
import { CameraAnimatorSimple, CameraPresetButtons, getPresets } from './shared/CameraPresets';
import { useSetExportBridge } from './shared/ExportContext';

const MODES = [
  { key: 'assembled', label: 'Assemblée' },
  { key: 'detailed',  label: 'Détaillée' },
  { key: 'exploded', label: 'Éclatée' },
  { key: 'plan',     label: 'Plan' },
];

/* ExportBridge — publie camera/gl/scene/controls + setSceneMode + setShowHuman au contexte
   d'export, pour que ExportPDF puisse capturer des vues standardisées sans la silhouette. */
function ExportBridge({ setSceneMode, showHuman, setShowHuman }) {
  const { camera, gl, scene, controls } = useThree();
  const setBridge = useSetExportBridge();
  useEffect(() => {
    setBridge({ camera, gl, scene, controls, setSceneMode, showHuman, setShowHuman });
    return () => setBridge(null);
  }, [camera, gl, scene, controls, setSceneMode, showHuman, setShowHuman, setBridge]);
  return null;
}

export default function ClotureViewer({ structure, foundationType = 'ground' }) {
  const [sceneMode, setSceneMode] = useState('assembled');
  const [showHint, setShowHint] = useState(true);
  const [showHuman, setShowHuman] = useState(false);

  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, [showHint]);

  /* Camera presets — must be before early return (rules-of-hooks) */
  const [camPreset, setCamPreset] = useState('hero');
  const handlePreset = useCallback((key) => setCamPreset(key), []);

  if (!structure?.geometry) {
    return (
      <div className="deck-preview">
        <div className="deck-viewer-skeleton">
          <span className="deck-viewer-skeleton-label">Chargement du modèle…</span>
        </div>
      </div>
    );
  }

  const { geometry } = structure;
  const { width, height } = geometry.dimensions;

  // La scène est centrée sur l'origine (ClotureScene fait p.x - cx)
  // La clôture est longue en X et plate en Z → vue 3/4 face, surélevée
  // FOV 38° étroit → recul suffisant pour couvrir toute la longueur
  // Avec FOV 38° et aspect ~1.5, la couverture horizontale ≈ distance × 1.04
  // Il faut donc distance ≈ width / 1.04 en Z pour voir tout l'objet
  const camZ = Math.max(width * 1.05, 3.5);
  const camPos = [camZ * 0.25, Math.max(height * 1.5, 1.8), camZ];
  const sceneKey = `cloture-${width}-${height}`;
  const isPlan = sceneMode === 'plan';
  const activeMode = MODES.find(m => m.key === sceneMode);

  const presets = getPresets(width, 1, height);

  return (
    <div className="deck-preview">

      {/* ── Stats ── */}
      <div className="deck-stats">
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.linearMeters}</div>
          <div className="deck-stat-label">m lin.</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.postCount}</div>
          <div className="deck-stat-label">poteaux</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.boardCount}</div>
          <div className="deck-stat-label">lames</div>
        </div>
      </div>

      {/* ── Viewer ── */}
      <div className="deck-schematic">

        <div className="deck-schema-header">
          <p className="deck-schema-label">
            {isPlan
              ? 'Vue de façade — plan technique'
              : `Configurateur 3D — ${activeMode?.label}`}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mode-tabs" role="tablist" aria-label="Mode de visualisation">
              {MODES.map(m => (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  className={`mode-tab${sceneMode === m.key ? ' active' : ''}`}
                  onClick={() => setSceneMode(m.key)}
                  aria-selected={sceneMode === m.key}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {!isPlan && <CameraPresetButtons activePreset={camPreset} onSelect={handlePreset} />}
            {!isPlan && (
              <button
                type="button"
                className={`mode-tab${showHuman ? ' active' : ''}`}
                onClick={() => setShowHuman(v => !v)}
                title="Afficher/masquer la silhouette 1.75 m pour repère d'échelle"
                aria-pressed={showHuman}
              >
                👤 Échelle
              </button>
            )}
          </div>
        </div>

        {/* Canvas 3D — reste monté même si plan actif pour préserver le contexte WebGL */}
        <div
          className="deck-canvas-wrap"
          style={{ position: 'relative', display: isPlan ? 'none' : undefined }}
          onPointerDown={() => showHint && setShowHint(false)}
        >
          <Canvas
            camera={{
              position: camPos,
              fov: 38,
              near: 0.1,
              far: 1000,
            }}
            shadows
            gl={{
              antialias: true,
              preserveDrawingBuffer: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.05,
            }}
            dpr={[1, 1.5]}
            aria-label={`Visualisation 3D interactive de la clôture — ${width}m × ${height}m`}
            role="img"
          >
            <ExportBridge setSceneMode={setSceneMode} showHuman={showHuman} setShowHuman={setShowHuman} />
            <color attach="background" args={['#f5f1eb']} />
            <fog attach="fog" args={['#efebe4', Math.max(20, width * 0.8), Math.max(70, width * 3)]} />
            <ClotureScene key={sceneKey} geometry={geometry} sceneMode={sceneMode} foundationType={foundationType} detailed={sceneMode === 'detailed'} showHuman={showHuman} />
            <CameraAnimatorSimple preset={camPreset} presets={presets} onDone={() => {}} />
            <OrbitControls
              enablePan={false}
              enableZoom
              enableRotate
              minDistance={2}
              maxDistance={Math.max(40, width * 2)}
              minPolarAngle={Math.PI * 20 / 180}
              maxPolarAngle={Math.PI * 80 / 180}
              target={[0, height * 0.35, 0]}
              makeDefault
              autoRotate={false}
              dampingFactor={0.05}
              enableDamping
            />
          </Canvas>

          <div style={{
            position: 'absolute', top: '40%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
            padding: '14px 24px', borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            fontSize: 14, fontWeight: 600, color: '#111214',
            textAlign: 'center',
            pointerEvents: 'none', userSelect: 'none',
            opacity: showHint ? 1 : 0,
            transition: 'opacity 0.6s ease',
            lineHeight: 1.4,
          }}>
            <div>Glissez pour explorer la clôture</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#66625A', marginTop: 6 }}>
              Mode : <strong>{MODES.find(m => m.key === sceneMode)?.label}</strong>
            </div>
          </div>
        </div>

        {/* Vue plan SVG */}
        {isPlan && <ClotureSketch geometry={geometry} />}

        {/* Légende — code couleur en mode détaillé, palette projet sinon */}
        {!isPlan && sceneMode === 'detailed' && (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#2196F3', color: '#fff' }}>Poteaux</span>
            <span className="deck-legend-item" style={{ background: '#E53935', color: '#fff' }}>Rails</span>
            <span className="deck-legend-item" style={{ background: '#FF9800', color: '#fff' }}>Lames</span>
          </div>
        )}
        {!isPlan && sceneMode !== 'detailed' && (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C9971E', color: '#fff' }}>Poteaux</span>
            <span className="deck-legend-item" style={{ background: '#8B7355', color: '#fff' }}>Rails</span>
            <span className="deck-legend-item" style={{ background: '#4A7FBF', color: '#fff' }}>Lames</span>
          </div>
        )}

        <p className="deck-viewer-hint" style={{ fontSize: 12, color: '#66625A' }}>
          {isPlan
            ? 'Vue de façade technique — cotations en temps réel'
            : 'Glissez pour tourner\u2003·\u2003Molette pour zoomer\u2003·\u2003Shift + glisser pour déplacer'}
        </p>
      </div>
    </div>
  );
}
