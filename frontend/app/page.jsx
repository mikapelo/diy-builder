/**
 * app/page.jsx
 * ─────────────────────────────────────────────────────────────
 * Point d'entrée de la route "/" — App Router Next.js.
 *
 * Pattern : server component enveloppe → client component (HomeClient).
 * Le Suspense boundary est requis par Next.js 14 pour useSearchParams.
 *
 * Logique métier inchangée :
 *   - useCalculTerrasse() → aucune modification
 *   - API /api/calcul-terrasse → aucune modification
 *   - Partage URL via searchParams préservé
 * ─────────────────────────────────────────────────────────────
 */

import { Suspense } from 'react';
import HomeClient   from './HomeClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg,#B8D9F8 0%,#DCF0FF 35%,#FFFFFF 100%)' }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />
            <p className="text-sm font-medium" style={{ color: '#3D5A6B' }}>Chargement…</p>
          </div>
        </div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
