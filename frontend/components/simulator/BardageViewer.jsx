'use client';
/**
 * BardageViewer.jsx — Viewer bardage multi-modes
 *
 * Trois modes :
 *   'assembled' → vue 3D : mur bardé fini (lames seules visibles)
 *   'detailed'  → vue technique : lames + tasseaux d'ossature secondaire visibles
 *   'coupe'     → vue en couches éclatées : lames + tasseaux + panneau support
 *                 séparés en profondeur (Z) pour montrer l'assemblage.
 *
 * Importé dynamiquement via le simulateur bardage (ssr: false).
 * Pattern inspiré de PergolaViewer.jsx.
 */
import { useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import BardageScene from './BardageScene';
import { useSetExportBridge } from './shared/ExportContext';

const MODES = [
  { key: 'assembled', label: 'Vue 3D' },
  { key: 'detailed', label: 'Ossature' },
  { key: 'coupe', label: 'Coupe' },
];

/* ExportBridge — publie le store Three au contexte d'export PDF. */
function ExportBridge({ setSceneMode }) {
  const { camera, gl, scene, controls } = useThree();
  const setBridge = useSetExportBridge();
  useEffect(() => {
    setBridge({ camera, gl, scene, controls, setSceneMode });
    return () => setBridge(null);
  }, [camera, gl, scene, controls, setSceneMode, setBridge]);
  return null;
}

export default function BardageViewer({ structure, onModeChange }) {
  const [sceneMode, setSceneMode] = useState('assembled');
  const [showHint, setShowHint] = useState(true);
  const [showHuman, setShowHuman] = useState(true);

  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, [showHint]);

  const handleSetMode = useCallback(
    (m) => {
      setSceneMode(m);
      if (typeof onModeChange === 'function') onModeChange(m);
    },
    [onModeChange],
  );

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

  // Caméra en vue 3/4, distance adaptée à la diagonale
  const diag = Math.sqrt(width * width + height * height);
  const camDist = Math.max(diag * 1.1, 3);
  // Vue 3/4 frontale élargie en mode 'coupe' pour voir les 3 couches dans la profondeur
  const camPosCoupe = [camDist * 0.5, height * 0.7, camDist * 1.2];
  const camPos = sceneMode === 'coupe'
    ? camPosCoupe
    : [camDist * 0.7, height * 0.9, camDist * 0.9];

  // sceneKey sur la Scene (jamais sur le Canvas) pour éviter flash WebGL
  // Inclut le mode pour forcer un remount propre quand on change de vue.
  const sceneKey = `bardage-${width}-${height}-${geometry.pose}-${sceneMode}`;
  const activeMode = MODES.find((m) => m.key === sceneMode);

  return (
    <div className="deck-preview">

      {/* ── Stats ── */}
      <div className="deck-stats">
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.surface}</div>
          <div className="deck-stat-label">m²</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.rowCount}</div>
          <div className="deck-stat-label">rangées</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.tasseauCount}</div>
          <div className="deck-stat-label">tasseaux</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.totalLameLength}</div>
          <div className="deck-stat-label">m lin. lames</div>
        </div>
      </div>

      {/* ── Viewer ── */}
      <div className="deck-schematic">

        <div className="deck-schema-header">
          <p className="deck-schema-label">
            Configurateur 3D — {activeMode?.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mode-tabs" role="tablist" aria-label="Mode de visualisation">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  className={`mode-tab${sceneMode === m.key ? ' active' : ''}`}
                  onClick={() => handleSetMode(m.key)}
                  aria-selected={sceneMode === m.key}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`mode-tab${showHuman ? ' active' : ''}`}
              onClick={() => setShowHuman(v => !v)}
              title="Afficher/masquer la silhouette 1.75 m pour repère d'échelle"
              aria-pressed={showHuman}
            >
              👤 Échelle
            </button>
          </div>
        </div>

        <div
          className="deck-canvas-wrap"
          style={{ position: 'relative' }}
          onPointerDown={() => showHint && setShowHint(false)}
        >
          <Canvas
            camera={{ position: camPos, fov: 38, near: 0.1, far: 1000 }}
            shadows
            gl={{
              antialias: true,
              preserveDrawingBuffer: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
            }}
            dpr={[1, 2]}
            aria-label={`Visualisation 3D interactive du bardage — ${width}m × ${height}m`}
            role="img"
          >
            <color attach="background" args={['#f5f1eb']} />
            <fog attach="fog" args={['#efebe4', Math.max(20, diag * 2), Math.max(70, diag * 6)]} />
            <ExportBridge setSceneMode={setSceneMode} />
            <BardageScene key={sceneKey} geometry={geometry} sceneMode={sceneMode} showHuman={showHuman} />
            <OrbitControls
              enablePan={false}
              enableZoom
              enableRotate
              minDistance={1.5}
              maxDistance={Math.max(25, diag * 3)}
              minPolarAngle={Math.PI * 15 / 180}
              maxPolarAngle={Math.PI * 85 / 180}
              target={[0, height * 0.5, 0]}
              makeDefault
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          <div
            style={{
              position: 'absolute', top: '40%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
              padding: '12px 22px', borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              fontSize: 14, fontWeight: 600, color: '#111214',
              textAlign: 'center',
              pointerEvents: 'none', userSelect: 'none',
              opacity: showHint ? 1 : 0,
              transition: 'opacity 0.6s ease',
              lineHeight: 1.4,
            }}
          >
            <div>Glissez pour explorer</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#66625A', marginTop: 6 }}>
              Mode : <strong>{activeMode?.label}</strong>
            </div>
          </div>
        </div>

        {/* Légende — adaptée au mode courant */}
        {sceneMode === 'coupe' && (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C8A882', color: '#333' }}>Lames</span>
            <span className="deck-legend-item" style={{ background: '#A0785A', color: '#fff' }}>Tasseaux</span>
            <span className="deck-legend-item" style={{ background: '#8B9196', color: '#fff' }}>Panneau support</span>
          </div>
        )}
        {sceneMode === 'detailed' && (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C8A882', color: '#333' }}>Lames</span>
            <span className="deck-legend-item" style={{ background: '#A0785A', color: '#fff' }}>Tasseaux</span>
          </div>
        )}
        {sceneMode === 'assembled' && (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C8A882', color: '#333' }}>Bardage bois</span>
          </div>
        )}

        <p className="deck-viewer-hint" style={{ fontSize: 12, color: '#66625A' }}>
          Glissez pour tourner&ensp;·&ensp;Molette pour zoomer&ensp;·&ensp;Shift + glisser pour déplacer
        </p>
      </div>
    </div>
  );
}
