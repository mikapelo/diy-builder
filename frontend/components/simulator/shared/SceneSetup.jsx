'use client';
/**
 * SceneSetup.jsx — DIY Builder Rendering Standard v2.1 (SketchUp-like)
 *
 * Composant unifié encapsulant :
 *   - Éclairage studio technique neutre
 *   - Environnement showroom clean
 *   - Sol, ombres, baseline
 *   - Gradient halo subtil
 *
 * Réutilisable dans toutes les scènes (cabanon, terrasse, pergola, clôture).
 * Props :
 *   width, depth — emprise du projet
 *   foundationType — pour les panneaux de fondation (cabanon only)
 */
import StandardLighting from './StandardLighting.jsx';
import StandardEnvironment from './StandardEnvironment.jsx';

export default function SceneSetup({ width, depth, foundationType = 'ground' }) {
  return (
    <>
      {/* ── Éclairage technique neutre SketchUp-like ── */}
      <StandardLighting shadowExtent={Math.max(width, depth)} />

      {/* ── Environnement : sol + ombres + halo ── */}
      <StandardEnvironment width={width} depth={depth} foundationType={foundationType} />
    </>
  );
}

/**
 * Sous-composants exportés pour usage granulaire si besoin
 */
export { StandardLighting, StandardEnvironment };
