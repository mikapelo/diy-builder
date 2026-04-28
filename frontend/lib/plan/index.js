/**
 * lib/plan/index.js — Point d'entrée du système de rendu par primitives
 *
 * Architecture : geometry → buildXxxView() → layers → renderPDF/renderSVG
 */
export { LAYERS, createLayers, flattenLayers } from './primitives.js';
export { fitScale, createProjectionCtx, facadeProjection, topProjection, sectionProjection, obliqueProjection } from './projections.js';
export { buildFacadeView } from './buildFacadeView.js';
export { buildSectionView } from './buildSectionView.js';
export { buildTopView } from './buildTopView.js';
export { buildIsometricView } from './buildIsometricView.js';
export { buildIsometricSummaryView } from './buildIsometricSummaryView.js';
export { renderPDFLayers } from './renderPDF.js';
