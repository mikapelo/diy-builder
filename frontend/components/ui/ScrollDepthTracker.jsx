'use client';

/**
 * ScrollDepthTracker — monte useScrollDepth dans le layout racine.
 *
 * Ne rend rien. Le hook se restreint lui-même aux pages /guides/ : le monter
 * globalement évite de toucher les 23 fichiers de guides un par un.
 */

import useScrollDepth from '@/hooks/useScrollDepth';

export default function ScrollDepthTracker() {
  useScrollDepth();
  return null;
}
