'use client';
import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE        from 'three';
import DeckScene         from './DeckScene';
import TechnicalPlan     from './TechnicalPlan';
import useIsMobile       from '@/hooks/useIsMobile';
import { CameraAnimatorSimple, CameraPresetButtons, getPresets } from './shared/CameraPresets';
import ExportBridge      from './shared/ExportBridge';

const VIEW_MODES = [
  { key: 'assembled', label: 'Assemblée' },
  { key: 'detailed',  label: 'Détaillée' },
  { key: 'plan',      label: 'Plan' },
];

/* viewMode et setViewMode sont remontés dans DeckSimulator.
   canvasWrapRef (prop ordinaire, pas forwardRef) permet à
   ExportPDF de capturer le canvas directement. */
export default function DeckViewer({
  width, depth, area, boards, joists, pads,
  viewMode, setViewMode, canvasWrapRef, foundationType = 'ground',
}) {
  const sceneKey  = `scene-${width}-${depth}`;
  const [showHuman, setShowHuman] = useState(false);
  const isPlan    = viewMode === 'plan';
  const activeMode = VIEW_MODES.find(m => m.key === viewMode);

  /* ── A1 : Caméra hero premium ──
     Vue 3/4 rasante qui met en valeur la surface des lames.
     Angle bas (Y faible) → effet hero/produit, pas technique.
     Léger décentrage X pour rompre la symétrie. */
  /* Viewport mobile : recule la caméra + élargit le FOV (modèle moins zoomé) */
  const isMobile = useIsMobile(640);
  const camMul   = isMobile ? 1.55 : 1;
  const camFov   = isMobile ? 50 : 38;

  const diag    = Math.sqrt(width * width + depth * depth);
  const camDist = Math.max(diag * 0.75, 3.5);
  const camPos  = [camDist * 0.85 * camMul, camDist * 0.45 * camMul, camDist * 0.75 * camMul];

  /* ── A2 : Fog dynamique — ne coupe jamais la structure ── */
  const fogNear = Math.max(camDist * 1.2, 8);
  const fogFar  = Math.max(camDist * 5, 40);
  /* Mapping mode → DeckScene :
     'detailed' → 'structure' (DeckScene montre la structure interne)
     'plan' → 'assembled' (canvas reste monté en arrière-plan) */
  const scene3DMode = isPlan ? 'assembled' : viewMode === 'detailed' ? 'cutaway' : viewMode;

  const [camPreset, setCamPreset] = useState('hero');
  const presets = getPresets(width, depth, 0.15);
  const handlePreset = useCallback((key) => setCamPreset(key), []);

  return (
    <div className="deck-preview">

      {/* ── Stats ── */}
      <div className="deck-stats">
        <div className="deck-stat">
          <div className="deck-stat-value">{area}</div>
          <div className="deck-stat-label">m²</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{boards}</div>
          <div className="deck-stat-label">lames</div>
        </div>
        <div className="deck-stat">
          <div className="deck-stat-value">{joists}</div>
          <div className="deck-stat-label">lambourdes</div>
        </div>
      </div>

      {/* ── Viewer 3D ── */}
      <div className="deck-schematic">
        <div className="deck-schema-header">
          <p className="deck-schema-label">
            {isPlan
              ? 'Vue de dessus — plan technique'
              : `Configurateur 3D — ${activeMode?.label}`}
          </p>

          {/* ── Tabs de mode + presets caméra ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="mode-tabs" role="tablist" aria-label="Mode de visualisation">
              {VIEW_MODES.map(m => (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  className={`mode-tab${viewMode === m.key ? ' active' : ''}`}
                  onClick={() => setViewMode(m.key)}
                  title={m.label}
                  aria-selected={viewMode === m.key}
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

        {/* ── Canvas Three.js + overlay Plan technique ── */}
        <div className="deck-canvas-wrap" ref={canvasWrapRef}>

          {/* Canvas 3D : toujours monté pour ExportPDF, masqué en mode plan */}
          <div style={{ position: 'absolute', inset: 0, visibility: isPlan ? 'hidden' : 'visible' }}>
            <Canvas
              camera={{ position: camPos, fov: camFov }}
              gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
              dpr={[1, 2]}
              aria-label={`Visualisation 3D interactive de la terrasse — ${width}m × ${depth}m`}
              role="img"
            >
              <ExportBridge setSceneMode={setViewMode} showHuman={showHuman} setShowHuman={setShowHuman} />
              <color attach="background" args={['#f5f1eb']} />
              <fog attach="fog" args={['#efebe4', fogNear, fogFar]} />

              <DeckScene
                key={sceneKey}
                width={width}
                depth={depth}
                viewMode={scene3DMode}
                foundationType={foundationType}
                showHuman={showHuman}
              />
              <CameraAnimatorSimple preset={camPreset} presets={presets} onDone={() => {}} />

              {/* A3 : damping fluide + maxDistance adaptative */}
              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                enableDamping
                dampingFactor={0.05}
                minDistance={1.5}
                maxDistance={Math.max(35, diag * 2.5)}
                minPolarAngle={Math.PI * 10 / 180}
                maxPolarAngle={Math.PI * 80 / 180}
                target={[0, 0.15, 0]}
                makeDefault
              />
            </Canvas>
          </div>

          {/* Plan technique : overlay scrollable */}
          {isPlan && (
            <div className="tp-overlay">
              <TechnicalPlan width={width} depth={depth} />
            </div>
          )}

        </div>

        {/* Légende — code couleur en mode structure, palette projet sinon */}
        {viewMode === 'detailed' ? (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#FF9800', color: '#fff' }}>Lames</span>
            <span className="deck-legend-item" style={{ background: '#E53935', color: '#fff' }}>Lambourdes</span>
            <span className="deck-legend-item" style={{ background: '#00BCD4', color: '#fff' }}>Entretoises</span>
            <span className="deck-legend-item" style={{ background: '#9E9E9E', color: '#fff' }}>Plots</span>
          </div>
        ) : (
          <div className="deck-legend">
            <span className="deck-legend-item" style={{ background: '#C9971E', color: '#fff' }}>Lames (3 essences)</span>
            <span className="deck-legend-item" style={{ background: '#8B7355', color: '#fff' }}>Lambourdes</span>
            <span className="deck-legend-item" style={{ background: '#4A7FBF', color: '#fff' }}>Plots béton</span>
          </div>
        )}

        {/* ── Cotes visuelles ── */}
        <div className="deck-dimensions">
          <span className="deck-dim-item">
            <span className="deck-dim-arrow">←→</span>
            Largeur : <strong>{width} m</strong>
          </span>
          <span className="deck-dim-sep">·</span>
          <span className="deck-dim-item">
            <span className="deck-dim-arrow">↕</span>
            Profondeur : <strong>{depth} m</strong>
          </span>
          <span className="deck-dim-sep">·</span>
          <span className="deck-dim-item">
            Entraxe lambourdes : <strong>40 cm</strong>
          </span>
        </div>

        <p className="deck-viewer-hint" style={{ fontSize: 12, color: '#66625A' }}>
          {isPlan
            ? 'Vue de dessus technique — cotations en temps réel'
            : 'Glissez pour tourner\u2003·\u2003Molette pour zoomer\u2003·\u2003Shift + glisser pour déplacer'}
        </p>
      </div>
    </div>
  );
}
