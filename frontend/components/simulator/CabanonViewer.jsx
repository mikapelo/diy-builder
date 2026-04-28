'use client';
/**
 * CabanonViewer.jsx — Viewer cabanon multi-modes
 *
 * Un seul state `sceneMode` pilote tout :
 *   'assembled'  → vue principale : cabanon fini (bardage + ouvertures + toit)
 *   'detailed'   → vue technique : ossature colorée par famille structurelle
 *   'plan'       → vue de façade SVG (CabanonSketch)
 *   ('exploded' et 'structure' conservés en interne, retirés de l'UI)
 *
 * Importe dynamiquement via DeckSimulator (ssr: false).
 * NE PAS modifier les calculs.
 */
import { useState, useEffect, useCallback } from 'react';
import { Canvas, useThree }   from '@react-three/fiber';
import { OrbitControls }      from '@react-three/drei';
import * as THREE              from 'three';
import CabanonScene           from './CabanonScene';
import CabanonSketch          from './CabanonSketch';
import { useSetExportBridge } from './shared/ExportContext';
import { CameraAnimatorSimple, CameraPresetButtons, getPresets } from './shared/CameraPresets';

/**
 * ExportBridge — enregistre le store Three.js dans ExportContext
 * Permet à ExportPDF de capturer le canvas avec une caméra preset.
 * Composant placé à l'intérieur du <Canvas>.
 * Reçoit `setSceneMode` en prop pour permettre la bascule temporaire.
 */
function ExportBridge({ setSceneMode }) {
  const { camera, gl, scene, controls } = useThree();
  const setBridge = useSetExportBridge();
  useEffect(() => {
    setBridge({ camera, gl, scene, controls, setSceneMode });
    return () => setBridge(null);
  }, [camera, gl, scene, controls, setSceneMode, setBridge]);
  return null;
}

const MODES = [
  { key: 'assembled', label: 'Assemblée' },
  { key: 'detailed',  label: 'Détaillée' },
  { key: 'plan',      label: 'Plan' },
];

/* ── Tab styles now via CSS classes: .mode-tabs / .mode-tab ── */

export default function CabanonViewer({ structure, foundationType = 'ground' }) {
  const [sceneMode, setSceneMode] = useState('assembled');
  const [showHint, setShowHint]   = useState(true);
  const [showHuman, setShowHuman] = useState(true);

  /* Auto-dismiss overlay après 4s */
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, [showHint]);

  /* Camera presets — must be before early return (rules-of-hooks) */
  const [camPreset, setCamPreset] = useState('hero');
  const handlePreset = useCallback((key) => setCamPreset(key), []);

  /* Fallback si geometry pas encore prête */
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
  const { width, depth, height } = geometry.dimensions;
  const windowOpening = geometry.openings?.find(o => o.type === 'window');

  const isPlan   = sceneMode === 'plan';
  const camPos   = [width * 1.15, height * 1.4, depth * 1.65];

  const presets = getPresets(width, depth, height);
  /* sceneKey sur CabanonScene (pas Canvas) → pas de flash WebGL */
  const sceneKey = `cabanon-${width}-${depth}-${height}`;

  const activeMode = MODES.find(m => m.key === sceneMode);

  return (
    <div className="deck-preview">

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="deck-stats">
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.surface}</div>
          <div className="deck-stat-label">m²</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.studCount}</div>
          <div className="deck-stat-label">montants</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{structure.perimeter}</div>
          <div className="deck-stat-label">m lin. périm.</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value" style={{ fontSize: windowOpening ? 22 : 18 }}>
            {windowOpening
              ? `${Math.round(windowOpening.width * 100)}×${Math.round(windowOpening.height * 100)}`
              : '—'}
          </div>
          <div className="deck-stat-label">{windowOpening ? 'fenêtre cm' : 'pas de fenêtre'}</div>
        </div>
      </div>

      {/* ── Viewer ────────────────────────────────────────────────── */}
      <div className="deck-schematic">

        {/* En-tête */}
        <div className="deck-schema-header">
          <p className="deck-schema-label">
            {isPlan
              ? 'Vue de façade — plan technique'
              : `Configurateur 3D — ${activeMode?.label}`}
          </p>

          {/* Tabs de mode + presets caméra */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mode-tabs" role="tablist" aria-label="Mode de visualisation">
              {MODES.map(m => (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  className={`mode-tab${sceneMode === m.key ? ' active' : ''}`}
                  onClick={() => setSceneMode(m.key)}
                  title={m.label}
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
          style={{ display: isPlan ? 'none' : undefined, position: 'relative' }}
          onPointerDown={() => showHint && setShowHint(false)}
        >
          <Canvas
            camera={{ position: camPos, fov: 34 }}
            gl={{
              antialias: true,
              preserveDrawingBuffer: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
            }}
            dpr={[1, 1.5]}
            aria-label={`Visualisation 3D interactive du cabanon — ${width}m × ${depth}m`}
            role="img"
          >
            <color attach="background" args={['#f5f1eb']} />
            <fog   attach="fog"        args={['#efebe4', 35, 60]} />
            <ExportBridge setSceneMode={setSceneMode} />
            <CabanonScene key={sceneKey} geometry={geometry} sceneMode={sceneMode} foundationType={foundationType} showHuman={showHuman} />
            <CameraAnimatorSimple preset={camPreset} presets={presets} onDone={() => {}} />
            <OrbitControls
              enablePan={false}
              enableZoom
              enableRotate
              minDistance={2}
              maxDistance={30}
              maxPolarAngle={Math.PI * 75 / 180}
              target={[0, height * 0.45, 0]}
              makeDefault
            />
          </Canvas>

          {/* Overlay d'accroche — disparaît au clic ou après 4s */}
          <div style={{
            position: 'absolute', top: '40%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(4px)',
            padding: '10px 20px', borderRadius: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            fontSize: 13, fontWeight: 500, color: '#111214',
            fontFamily: 'Inter, system-ui, sans-serif',
            pointerEvents: 'none', userSelect: 'none',
            opacity: showHint ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}>
            Glissez pour explorer le cabanon
          </div>
        </div>

        {/* Vue plan SVG */}
        {isPlan && <CabanonSketch geometry={geometry} />}

        {/* Légende en mode assemblé — palette projet */}
        {sceneMode === 'assembled' && (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C9971E', color: '#FFFFFF' }}>Ossature</span>
            <span className="deck-legend-item" style={{ background: '#8B7355', color: '#FFFFFF' }}>Bardage</span>
            <span className="deck-legend-item" style={{ background: '#4A7FBF', color: '#FFFFFF' }}>Toiture</span>
          </div>
        )}
        {/* Légende en mode détaillé — couleurs primaires distinctes */}
        {sceneMode === 'detailed' && (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#2196F3', color: '#fff' }}>Montants</span>
            <span className="deck-legend-item" style={{ background: '#E53935', color: '#fff' }}>Lisses</span>
            <span className="deck-legend-item" style={{ background: '#FF9800', color: '#fff' }}>Chevrons</span>
            <span className="deck-legend-item" style={{ background: '#9C27B0', color: '#fff' }}>Linteaux</span>
            <span className="deck-legend-item" style={{ background: '#4CAF50', color: '#fff' }}>Contrev.</span>
            <span className="deck-legend-item" style={{ background: '#FFEB3B', color: '#333' }}>Voliges</span>
            <span className="deck-legend-item" style={{ background: '#00BCD4', color: '#fff' }}>Bastaings</span>
          </div>
        )}

        {/* Hint */}
        <p className="deck-viewer-hint" style={{ fontSize: 12, color: '#66625A', fontFamily: 'Inter, system-ui, sans-serif' }}>
          {isPlan
            ? 'Vue de façade technique — cotations en temps réel'
            : 'Glissez pour tourner\u2003·\u2003Molette pour zoomer\u2003·\u2003Shift + glisser pour déplacer'}
        </p>

      </div>
    </div>
  );
}
