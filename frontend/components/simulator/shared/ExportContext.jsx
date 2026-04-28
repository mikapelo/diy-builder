'use client';
/**
 * ExportContext — React Context remplaçant window.__r3fExport
 *
 * Fournit un canal propre entre le <Canvas> Three.js (producteur)
 * et ExportPDF (consommateur) sans variable globale.
 *
 * Données transitant :
 *   { camera, gl, scene, controls, setSceneMode, setShowHuman }
 *
 * Usage :
 *   <ExportBridgeProvider>
 *     <CabanonViewer ... />   ← appelle useSetExportBridge()
 *     <ExportPDF ... />       ← appelle useExportBridge()
 *   </ExportBridgeProvider>
 */
import { createContext, useContext, useCallback, useRef } from 'react';

const ExportBridgeCtx = createContext(null);

/**
 * Provider — stocke le bridge dans un ref (pas de re-render au set).
 * Expose deux fonctions stables : set et get.
 */
export function ExportBridgeProvider({ children }) {
  const bridgeRef = useRef(null);

  const setBridge = useCallback((value) => {
    bridgeRef.current = value;
  }, []);

  const getBridge = useCallback(() => bridgeRef.current, []);

  return (
    <ExportBridgeCtx.Provider value={{ setBridge, getBridge }}>
      {children}
    </ExportBridgeCtx.Provider>
  );
}

/**
 * Hook producteur — appelé depuis un composant à l'intérieur du <Canvas>.
 * Retourne setBridge(value) pour enregistrer { camera, gl, scene, controls, setSceneMode, setShowHuman }.
 */
export function useSetExportBridge() {
  const ctx = useContext(ExportBridgeCtx);
  if (!ctx) throw new Error('useSetExportBridge must be used within <ExportBridgeProvider>');
  return ctx.setBridge;
}

/**
 * Hook consommateur — appelé depuis ExportPDF ou tout composant qui lit le bridge.
 * Retourne getBridge() → { camera, gl, scene, controls, setSceneMode, setShowHuman } | null.
 */
export function useExportBridge() {
  const ctx = useContext(ExportBridgeCtx);
  if (!ctx) throw new Error('useExportBridge must be used within <ExportBridgeProvider>');
  return ctx.getBridge;
}
