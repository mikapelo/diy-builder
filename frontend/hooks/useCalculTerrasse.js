/**
 * hooks/useCalculTerrasse.js
 * ─────────────────────────────────────────────────────────────
 * Hook React — encapsule l'état et les effets du calculateur terrasse.
 * L'appel HTTP est délégué à services/api.js (séparation des responsabilités).
 *
 * Logique métier inchangée.
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { calculerTerrasseAPI } from '../services/api';

export function useCalculTerrasse() {
  const [resultat, setResultat] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  async function calculer({ largeur, longueur, type_bois }) {
    setLoading(true);
    setError(null);
    setResultat(null);
    try {
      const data = await calculerTerrasseAPI({ largeur, longueur, type_bois });
      setResultat(data);
    } catch (err) {
      setError(err.message || 'Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResultat(null);
    setError(null);
  }

  return { calculer, resultat, loading, error, reset };
}
