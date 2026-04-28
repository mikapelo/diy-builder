/**
 * StandardLighting.jsx — DIY Builder Rendering Standard v2.1 (SketchUp-like)
 *
 * Eclairage studio technique neutre — inspiré du style SketchUp.
 *
 * Philosophie v2.1 :
 *   - Éclairage technique, non réaliste — netteté visuelle maximale.
 *   - Ambient légèrement élevée (0.40) pour lisibilité de l'ossature.
 *   - Key light neutre (blanc pur) et douce pour éviter les ombres dures.
 *   - Fill light avec tonalité neutre pour équilibre.
 *   - Rim light subtil pour séparation des plans.
 *   - Environment neutre (pas de coucher de soleil riche).
 *   - Parfait pour lecture technique et documentation.
 */
'use client';
import { Environment } from '@react-three/drei';

export default function StandardLighting({ shadowExtent = 8 }) {
  const lightH = Math.max(shadowExtent * 1.8, 10);

  return (
    <>
      {/* Ambient — légèrement relevée pour lisibilité générale */}
      <ambientLight intensity={0.40} color="#f5f5f5" />

      {/* Key light — blanc neutre, doux, supérieur gauche */}
      <directionalLight
        position={[shadowExtent * 0.5, lightH, shadowExtent * 0.4]}
        intensity={1.3}
        color="#ffffff"
      />

      {/* Fill light — neutre, léger bleu pour profondeur */}
      <directionalLight
        position={[-shadowExtent * 0.6, lightH * 0.5, -shadowExtent * 0.4]}
        intensity={0.45}
        color="#e8ecf5"
      />

      {/* Rim light — subtil, accent neutre léger */}
      <directionalLight
        position={[-shadowExtent * 0.4, lightH * 0.6, shadowExtent * 0.7]}
        intensity={0.18}
        color="#f0f0f0"
      />

      {/* Top light — zénithal neutre pour modelage */}
      <directionalLight
        position={[0, lightH * 1.2, 0]}
        intensity={0.20}
        color="#efefef"
      />

      {/* Environment studio — le plus neutre des presets drei */}
      <Environment preset="studio" />
    </>
  );
}
