'use client';

/**
 * ExportBridge — composant partagé pour les 4 viewers 3D.
 *
 * Publie {camera, gl, scene, controls, setSceneMode, showHuman, setShowHuman}
 * via useSetExportBridge() pour qu'ExportPDF capture des vues standardisées
 * sans silhouette humaine. Doit être monté à l'intérieur de <Canvas>.
 *
 * Audit Sprint 3 : déduplique 4 copies identiques (Cabanon/Pergola/Cloture/Deck).
 */

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSetExportBridge } from './ExportContext';

export default function ExportBridge({ setSceneMode, showHuman, setShowHuman }) {
  const { camera, gl, scene, controls } = useThree();
  const setBridge = useSetExportBridge();
  useEffect(() => {
    setBridge({ camera, gl, scene, controls, setSceneMode, showHuman, setShowHuman });
    return () => setBridge(null);
  }, [camera, gl, scene, controls, setSceneMode, showHuman, setShowHuman, setBridge]);
  return null;
}
