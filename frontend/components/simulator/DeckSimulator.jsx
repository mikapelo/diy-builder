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
import EmailGateModal    from '@/components/ui/EmailGateModal';
import { BOARD_WIDTH, BOARD_GAP, ENTR_SPACING } from '@/lib/deckConstants.js';

// Longueur commerciale lame terrasse (m) — LM/Casto vendent 3,6m, BD 4,2m.
// Distinct de BOARD_LEN (3,0m) qui régit les cuts géométriques de deckGeometry.
const LAME_COMMERCIAL_LEN = 3.6;
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
  } = useDeckSimulatorState(projectType);

  const canvasWrapRef = useRef(null);
  const [windowPreset, setWindowPreset] = useState('60x60');

  // Sync URL ↔ dimensions (bookmark / partage entre proches)
  // h uniquement pour les modules avec hauteur configurable
  const hasHeight = !isTerasse(projectType) && !isCloture(projectType);
  useSimulatorUrl(width, depth, hasHeight ? height : undefined);

  /* ── Modales ── */
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalTrigger, setSaveModalTrigger] = useState('save');
  const [artisanModalOpen, setArtisanModalOpen] = useState(false);
  const [artisanInitialEmail, setArtisanInitialEmail] = useState('');
  const [emailGateOpen, setEmailGateOpen] = useState(false);

  /* Ref stable vers handleGatedExportPDF — évite la dépendance circulaire
     handleOpenSaveModal → handleGatedExportPDF (défini après dans le flux hooks) */
  const gatedExportRef = useRef(null);

  /* 'artisan' → formulaire complet (nom, tél, cp, message)
     'dossier' → email-gate PDF
     autres triggers → email seul via SaveProjectModal */
  const handleOpenSaveModal = useCallback((trigger) => {
    if (trigger === 'artisan') {
      setArtisanInitialEmail('');
      setArtisanModalOpen(true);
    } else if (trigger === 'dossier') {
      gatedExportRef.current?.();
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

  /* CA-1 : sur les petites façades, la fenêtre demandée ne tient pas après la
     porte et est écartée silencieusement. On le remonte à l'UI pour ne jamais
     laisser le contrôle « Fenêtre » sélectionné sans effet 3D ni au BOM. */
  const windowDropped = useMemo(() => {
    const requested = (WINDOW_PRESETS[windowPreset]?.width ?? 0) > 0;
    return requested && !openings.some((o) => o.type === 'window');
  }, [openings, windowPreset]);

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
  // Quantités BRUTES (sans majoration). La marge coupe/chute est appliquée une
  // seule fois, par costCalculator (WOOD_WASTE_FACTOR = 1,10 sur les matériaux
  // bois). Un ×1,05 en dur ici recréait un double-compte (1,05 × 1,10 ≈ 1,155)
  // sur le poste lames et désynchronisait le stat viewer du devis.
  // LAME_COMMERCIAL_LEN (3,6 m, unité achetable GSB) ; BOARD_LEN (3,0 m) régit
  // séparément les coupes 3D dans deckGeometry.
  const boards = isTerasse(projectType) ? Math.ceil(boardRows * width / LAME_COMMERCIAL_LEN) : 0;
  const screws      = isTerasse(projectType) ? boardRows * allJoistCount * 2 : 0;
  // Entretoises : portée = width (lambourdes), entraxe ENTR_SPACING — aligné deckGeometry.buildEntretoises
  const cbPositions = Math.floor(width / ENTR_SPACING);
  const entretoises = isTerasse(projectType) ? cbPositions * Math.max(joistCount - 1, 0) : 0;
  // Bande bitume brute (bande_bitume est hors WOOD_MATERIAL_IDS : pas de majoration bois).
  const bandeMl     = isTerasse(projectType) ? Math.ceil(allJoistCount * depth) : 0;

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

  /* ── Email gate PDF ── */
  const handleGatedExportPDF = useCallback(() => {
    setEmailGateOpen(true);
  }, []);
  gatedExportRef.current = handleGatedExportPDF;

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
          boards={boards} joists={allJoistCount} pads={pads}
          viewMode={viewMode} setViewMode={setViewMode}
          canvasWrapRef={canvasWrapRef}
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
            windowDropped={windowDropped}
            projectType={projectType}
            liveStats={materials}
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
        onExportPDF={() => handleExportPDF()}
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
      {emailGateOpen && (
        <EmailGateModal
          projectType={projectType}
          dims={dims}
          defaultEmail={typeof window !== 'undefined' ? (localStorage.getItem('diy_lead_email') ?? '') : ''}
          onConfirm={(email) => {
            setEmailGateOpen(false);
            handleExportPDF(email);
          }}
          onClose={() => setEmailGateOpen(false)}
        />
      )}
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
