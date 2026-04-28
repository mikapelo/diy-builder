'use client';
/**
 * DalleViewer.jsx — Viewer dalle béton multi-modes
 *
 * Deux modes :
 *   'assembled' → vue de dessus : dalle finie, joints visibles
 *   'coupe'     → vue en coupe : dalle transparente + forme drainante visible
 *
 * Importé dynamiquement via le simulateur dalle (ssr: false).
 * Pattern inspiré de PergolaViewer.jsx.
 */
import { useState, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import DalleScene from './DalleScene';
import { useSetExportBridge } from './shared/ExportContext';

const MODES = [
  { key: 'assembled', label: 'Vue dessus' },
  { key: 'coupe', label: 'Coupe' },
];

function ExportBridge({ setSceneMode }) {
  const { camera, gl, scene, controls } = useThree();
  const setBridge = useSetExportBridge();
  useEffect(() => {
    setBridge({ camera, gl, scene, controls, setSceneMode });
    return () => setBridge(null);
  }, [camera, gl, scene, controls, setSceneMode, setBridge]);
  return null;
}

export default function DalleViewer({ structure, onModeChange }) {
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
  const { width, depth, epaisseur } = geometry.dimensions;

  const diag = Math.sqrt(width * width + depth * depth);
  const camDist = Math.max(diag * 1.2, 4);
  /* En mode 'assembled' : caméra légèrement haute pour voir les joints.
     En mode 'coupe' : caméra plus basse pour voir l'épaisseur + forme. */
  const camPosAssembled = [camDist * 0.45, Math.max(diag * 0.8, 3.5), camDist * 0.45];
  /* Coupe : angle plus bas que l'assemblé pour voir le treillis horizontal
     dans le béton semi-transparent. */
  const camPosCoupe = [camDist * 0.7, Math.max(diag * 0.5, 1.5), camDist * 0.55];
  const camPos = sceneMode === 'coupe' ? camPosCoupe : camPosAssembled;

  const sceneKey = `dalle-${width}-${depth}-${epaisseur}-${structure.usage}`;
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
          <div className="deck-stat-value">{Math.round(structure.epaisseur * 100)}</div>
          <div className="deck-stat-label">cm épaiss.</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.volumeBeton}</div>
          <div className="deck-stat-label">m³ béton</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.jointCount}</div>
          <div className="deck-stat-label">joints</div>
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
            camera={{ position: camPos, fov: 38, near: 0.05, far: 1000 }}
            shadows
            gl={{
              antialias: true,
              preserveDrawingBuffer: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
            }}
            dpr={[1, 2]}
            aria-label={`Visualisation 3D interactive de la dalle — ${width}m × ${depth}m`}
            role="img"
          >
            <color attach="background" args={['#f5f1eb']} />
            <fog attach="fog" args={['#efebe4', Math.max(20, diag * 2), Math.max(70, diag * 6)]} />
            <ExportBridge setSceneMode={setSceneMode} />
            <DalleScene key={sceneKey} geometry={geometry} sceneMode={sceneMode} showHuman={showHuman} />
            <OrbitControls
              enablePan={false}
              enableZoom
              enableRotate
              minDistance={1}
              maxDistance={Math.max(25, diag * 3)}
              minPolarAngle={Math.PI * 5 / 180}
              maxPolarAngle={Math.PI * 88 / 180}
              target={[0, 0, 0]}
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

        {/* Légende */}
        {sceneMode === 'coupe' ? (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C8C8C0', color: '#333' }}>Dalle béton</span>
            <span className="deck-legend-item" style={{ background: '#D4C4A0', color: '#333' }}>Forme drainante</span>
            <span className="deck-legend-item" style={{ background: '#78818C', color: '#fff' }}>Treillis ST25</span>
            <span className="deck-legend-item" style={{ background: '#B8956A', color: '#fff' }}>Coffrage</span>
            <span className="deck-legend-item" style={{ background: '#808080', color: '#fff' }}>Joints</span>
          </div>
        ) : (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C8C8C0', color: '#333' }}>Dalle béton</span>
            <span className="deck-legend-item" style={{ background: '#B8956A', color: '#fff' }}>Coffrage</span>
            <span className="deck-legend-item" style={{ background: '#808080', color: '#fff' }}>Joints</span>
          </div>
        )}

        <p className="deck-viewer-hint" style={{ fontSize: 12, color: '#66625A' }}>
          Glissez pour tourner&ensp;·&ensp;Molette pour zoomer&ensp;·&ensp;Shift + glisser pour déplacer
        </p>
      </div>
    </div>
  );
}
