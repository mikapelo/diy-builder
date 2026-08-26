'use client';

/**
 * LeadSourceTracker — capture la provenance de la session dans le layout racine.
 *
 * Ne rend rien. Doit tourner au PREMIER chargement de page : c'est le seul
 * moment où `document.referrer` désigne encore la vraie source externe. Monté
 * dans le layout, il couvre toutes les pages sans les toucher une par une.
 */

import { useEffect } from 'react';
import { captureEntry } from '@/lib/leadSource';

export default function LeadSourceTracker() {
  useEffect(() => { captureEntry(); }, []);
  return null;
}
