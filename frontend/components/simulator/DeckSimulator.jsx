'use client';

/**
 * DeckSimulator.jsx — Assembleur mince du simulateur
 *
 * Phase B refactor : la logique est répartie dans :
 *   - ViewerRouter.jsx      → routage 3D par projectType
 *   - TunnelSections.jsx    → blocs résultats verticaux
 *   - useScrollTunnel.js    → scroll reveal + soft-snap
 *   - usePDFExport.js       → génération PDF
 *   - useDeckSimulatorState → state centralisé (width, depth, height, viewMode…)
 *
 * DeckSimulator orchestre les données (engine + foundation) et assemble le layout.
 */

import { useRef, useMemo, useState, useCallback } from 'react';
import ViewerRouter      from './ViewerRouter';
import DeckControls      from './DeckControls';
import TunnelSections    from './TunnelSections';
import SaveProjectModal  from './SaveProjectModal';
import ArtisanLeadModal  from './ArtisanLeadModal';
import { BOARD_WIDTH, BOARD_GAP, BOARD_LEN } from '@/lib/deckConstants.js';
import { useProjectEngine } from '@/core/useProjectEngine.js';
import { calcFoundation } from '@/lib/foundation/foundationCalculator';
import { useDeckSimulatorState } from '@/core/useDeckSimulatorState.js';
import { STUD_SPACING, CORNER_ZONE, SECTION } from '@/lib/cabanonConstants.js';
import { ExportBridgeProvider, useExportBridge } from './shared/ExportContext';
import { usePDFExport } from '@/hooks/usePDFExport';
import { useSimulatorUrl } from '@/hooks/useSimulatorUrl';

const isTerasse = (t) => t === 'terrasse';
const isPergola = (t) => t === 'pergola';
const isCloture = (t) => t === 'cloture';

/* ── Presets fenêtre ── */
const WINDOW_PRESETS = {
  none:      { label: 'Pas de fenêtre',   width: 0,    height: 0    },
  '60x60':   { label: '60 × 60 cm',      width: 0.60, height: 0.60 },
  '80x100':  { label: '80 × 100 cm',     width: 0.80, height: 1.00 },
  '100x120': { label: '100 × 120 cm',    width: 1.00, height: 1.20 },
};

function computeWindowU(wallWidth, doorU, doorW, winW) {
  const afterDoor = doorU + doorW + SECTION * 3;
  const snapped = Math.ceil(afterDoor / STUD_SPACING) * STUD_SPACING;
  const maxU = wallWidth - winW - CORNER_ZONE;
  return Math.min(snapped, maxU);
}

/* ── Inner component (needs ExportBridge context) ── */
function SimulatorContent({ projectType }) {
  const {
    width, setWidth, depth, setDepth,
    height, setHeight, viewMode, setViewMode,
    foundationType, setFoundationType,
    slabThickness, setSlabThickness,
  } = useDeckSimulatorState();

  const canvasWrapRef = useRef(null);
  const [windowPreset, setWindowPreset] = useState('60x60');

  // Sync URL ↔ dimensions (bookmark / partage entre proches)
  // h uniquement pour les modules avec hauteur configurable
  const hasHeight = !isTerasse(projectType) && !isCloture(projectType);
  useSimulatorUrl(width, depth, hasHeight ? height : undefined);

  /* ── Garde-corps (terrasse) ── */
  const [gardeCorps, setGardeCorps] = useState({ enabled: false, height: 1.0, sides: ['avant', 'gauche'] });
  const handleGardeCorpsChange = useCallback((updates) => {
    setGardeCorps(prev => ({ ...prev, ...updates }));
  }, []);

  /* ── Modales ── */
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalTrigger, setSaveModalTrigger] = useState('save');
  const [artisanModalOpen, setArtisanModalOpen] = useState(false);
  const [artisanInitialEmail, setArtisanInitialEmail] = useState('');

  /* 'artisan' → formulaire complet (nom, tél, cp, message)
     autres triggers → email seul via SaveProjectModal */
  const handleOpenSaveModal = useCallback((trigger) => {
    if (trigger === 'artisan') {
      setArtisanInitialEmail('');
      setArtisanModalOpen(true);
    } else {
      setSaveModalTrigger(trigger);
      setSaveModalOpen(true);
    }
  }, []);

  /* Upsell : l'utilisateur a reçu le dossier DIY et veut maintenant un artisan */
  const handleArtisanUpsell = useCallback((email) => {
    setArtisanInitialEmail(email || '');
    setSaveModalOpen(false);
    setArtisanModalOpen(true);
  }, []);

  /* ── Openings dynamiques (cabanon) ── */
  const openings = useMemo(() => {
    const r3 = (v) => Math.round(v * 1000) / 1000;
    const doorU = r3(width * 0.15);
    const arr = [{ wall: 0, u: doorU, v: 0, width: 0.9, height: 2.0, type: 'door' }];
    const preset = WINDOW_PRESETS[windowPreset];
    if (preset && preset.width > 0) {
      const winU = computeWindowU(width, doorU, 0.9, preset.width);
      const doorEnd = doorU + 0.9 + SECTION * 2;
      if (winU >= doorEnd && winU + preset.width <= width - CORNER_ZONE) {
        arr.push({ wall: 0, u: r3(winU), v: 1.0, width: preset.width, height: preset.height, type: 'window' });
      }
    }
    return arr;
  }, [width, windowPreset]);

  /* ── Engine ── */
  const engineOptions = useMemo(() => {
    if (isTerasse(projectType)) return {};
    if (isPergola(projectType)) return { height };
    if (isCloture(projectType)) return {};
    return { height, openings };
  }, [projectType, height, openings]);

  const { structure, config } = useProjectEngine(projectType, width, depth, engineOptions);

  /* ── Données dérivées (terrasse) ── */
  const area      = +(width * depth).toFixed(2);
  const joistCount  = structure.joistCount ?? 0;
  const pads        = structure.totalPads  ?? 0;

  /* Doubles lambourdes — positions X uniques (Cas A = 1 pièce, Cas B = 2 pièces par coupe).
     Ajouté au décompte matériaux : bande bitume + vis + affichage BOM.
     Entretoises inchangées : elles s'appuient sur les régulières uniquement. */
  const dblJoistCount = useMemo(
    () => new Set(structure.doubleJoistSegs?.map(s => +s.xPos.toFixed(6)) ?? []).size,
    [structure.doubleJoistSegs],
  );
  const allJoistCount = joistCount + dblJoistCount;

  // Rangées de lames : nombre de passes sur la largeur depth
  const boardRows   = Math.floor(depth / (BOARD_WIDTH + BOARD_GAP)) + 1;
  // Lames commerciales (BOARD_LEN = 3 m) : rangées × largeur × 5% chutes, arrondi au-dessus
  // Remplace l'ancienne formule area×2.7 qui produisait des "lames de 1m" imaginaires (+16% d'erreur)
  const boards = isTerasse(projectType) ? Math.ceil(boardRows * width * 1.05 / BOARD_LEN) : 0;
  const screws      = isTerasse(projectType) ? boardRows * allJoistCount * 2 : 0;
  const cbPositions = depth > 3 ? Math.floor(depth / 1.8) : 0;
  const entretoises = isTerasse(projectType) ? cbPositions * Math.max(joistCount - 1, 0) : 0;
  const bandeMl     = isTerasse(projectType) ? Math.ceil(allJoistCount * depth * 1.05) : 0;

  /* ── Dalle ── */
  const slab = useMemo(
    () => foundationType === 'slab' ? calcFoundation(width, depth, slabThickness) : null,
    [width, depth, slabThickness, foundationType],
  );

  const dims = { width, depth, area };
  const materials = isTerasse(projectType)
    ? { boards, joists: allJoistCount, pads, screws, entretoises, bande: bandeMl, slab }
    : { ...structure, slab };

  /* ── PDF ── */
  const getBridge = useExportBridge();
  const { handleExportPDF, pdfStatus } = usePDFExport({
    projectType, dims, materials, config, foundationType, slab, getBridge,
  });

  const slabTotal = slab?.totalPrice ?? 0;

  return (
    <div className="simulator-layout">

      {/* ═══ ZONE HAUTE : Viewer + Contrôles ═══ */}
      <div className="simulator-top">
        <ViewerRouter
          projectType={projectType}
          structure={structure}
          foundationType={foundationType}
          width={width} depth={depth} area={area}
          boards={boards} joists={joistCount} pads={pads}
          viewMode={viewMode} setViewMode={setViewMode}
          canvasWrapRef={canvasWrapRef}
          gardeCorps={gardeCorps}
        />

        <div className="simulator-panel">
          <DeckControls
            width={width} depth={depth} area={area}
            setWidth={setWidth} setDepth={setDepth}
            foundationType={foundationType} setFoundationType={setFoundationType}
            slabThickness={slabThickness} setSlabThickness={setSlabThickness}
            slab={slab}
            showHeight={!isTerasse(projectType) && !isCloture(projectType)}
            height={height} setHeight={setHeight}
            showWindow={!isTerasse(projectType) && !isPergola(projectType) && !isCloture(projectType)}
            windowPreset={windowPreset} setWindowPreset={setWindowPreset}
            windowPresets={WINDOW_PRESETS}
            projectType={projectType}
            liveStats={materials}
            gardeCorps={gardeCorps}
            onGardeCorpsChange={handleGardeCorpsChange}
          />
        </div>
      </div>

      {/* ═══ TUNNEL RÉSULTATS ═══ */}
      <TunnelSections
        projectType={projectType}
        dims={dims}
        materials={materials}
        area={area}
        slabTotal={slabTotal}
        onOpenSaveModal={handleOpenSaveModal}
        onExportPDF={handleExportPDF}
        pdfStatus={pdfStatus}
      />

      {/* ═══ MODALES ═══ */}
      <SaveProjectModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        projectType={projectType}
        dims={dims}
        trigger={saveModalTrigger}
        onArtisanUpsell={handleArtisanUpsell}
      />
      <ArtisanLeadModal
        open={artisanModalOpen}
        onClose={() => setArtisanModalOpen(false)}
        projectType={projectType}
        dims={dims}
        bom={materials}
        initialEmail={artisanInitialEmail}
      />
    </div>
  );
}

export default function DeckSimulator({ projectType = 'terrasse' }) {
  return (
    <ExportBridgeProvider>
      <SimulatorContent projectType={projectType} />
    </ExportBridgeProvider>
  );
}
