'use client';

/**
 * ViewerRouter.jsx — Routage dynamique des viewers 3D
 *
 * Charge le bon viewer (Deck, Cabanon, Pergola, Clôture) selon le projectType.
 * Tous les viewers sont chargés via next/dynamic avec ssr: false.
 *
 * Extrait de DeckSimulator.jsx (Phase B — décomposition orchestrateur).
 */

import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CubeLoader from '@/components/ui/CubeLoader';

/* ── Loading placeholder — CubeLoader dans le cadre viewer ── */
function ViewerLoading() {
  return (
    <div className="deck-preview" style={{ position: 'relative', overflow: 'hidden' }}>
      <CubeLoader />
    </div>
  );
}

/* ── Delayed import — minimum 2s loader display ── */
const MIN_LOADER_MS = 2000;
function delayedImport(importFn) {
  return () => Promise.all([
    importFn(),
    new Promise((r) => setTimeout(r, MIN_LOADER_MS)),
  ]).then(([mod]) => mod);
}

/* ── Dynamic imports ── */
const DeckViewer = dynamic(delayedImport(() => import('./DeckViewer')), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

const CabanonViewer = dynamic(delayedImport(() => import('./CabanonViewer')), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

const PergolaViewer = dynamic(delayedImport(() => import('./PergolaViewer')), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

const ClotureViewer = dynamic(delayedImport(() => import('./ClotureViewer')), {
  ssr: false,
  loading: () => <ViewerLoading />,
});

/**
 * @param {object} props
 * @param {string}  props.projectType — 'terrasse' | 'cabanon' | 'pergola' | 'cloture'
 * @param {object}  props.structure — données engine
 * @param {string}  props.foundationType — 'ground' | 'slab'
 * @param {string}  props.viewMode — mode de vue (terrasse uniquement)
 * @param {function} props.setViewMode
 * @param {object}  props.canvasWrapRef
 * @param {number}  props.width, props.depth, props.area, props.boards, props.joists, props.pads
 * @param {object}  props.gardeCorps — { enabled, height } — terrasse uniquement
 */
export default function ViewerRouter({
  projectType,
  structure,
  foundationType,
  width, depth, area, boards, joists, pads,
  viewMode, setViewMode, canvasWrapRef,
  gardeCorps,
}) {
  return (
    <ErrorBoundary>
      {projectType === 'terrasse' ? (
        <DeckViewer
          width={width}
          depth={depth}
          area={area}
          boards={boards}
          joists={joists}
          pads={pads}
          viewMode={viewMode}
          setViewMode={setViewMode}
          canvasWrapRef={canvasWrapRef}
          foundationType={foundationType}
          gardeCorps={gardeCorps}
        />
      ) : projectType === 'pergola' ? (
        <PergolaViewer structure={structure} foundationType={foundationType} />
      ) : projectType === 'cloture' ? (
        <ClotureViewer structure={structure} foundationType={foundationType} />
      ) : (
        <CabanonViewer structure={structure} foundationType={foundationType} />
      )}
    </ErrorBoundary>
  );
}
