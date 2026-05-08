/**
 * /api/go — Redirecteur affilié avec UTM
 *
 * Params GET :
 *   store   : identifiant enseigne (leroymerlin | castorama | brico-depot | manomano)
 *   project : identifiant module (terrasse | cabanon | pergola | cloture | …)
 *   q       : terme de recherche (déjà encodé par le client)
 *
 * TODO: brancher les liens affiliés Awin/Affilae ici une fois les comptes validés.
 *       Remplacer les URLs directes ci-dessous par les URLs de tracking affilié
 *       (ex: https://www.awin1.com/cread.php?awinmid=XXXX&awinaffid=YYYY&p=URL_ENCODÉE)
 */

import { NextResponse } from 'next/server';

/** Construit l'URL enseigne avec UTM à partir du store ID, du terme et du projet */
function buildStoreUrl(storeId, q, project) {
  const utmSuffix = `utm_source=diy-builder&utm_medium=referral&utm_campaign=${encodeURIComponent(project)}`;

  switch (storeId) {
    case 'leroymerlin':
      return `https://www.leroymerlin.fr/recherche/${q}?${utmSuffix}`;

    case 'castorama':
      return `https://www.castorama.fr/recherche/${q}?${utmSuffix}`;

    case 'bricodepot':
    case 'brico-depot':
      return `https://www.brico-depot.fr/recherche/resultats?q=${q}&${utmSuffix}`;

    case 'manomano':
      return `https://www.manomano.fr/search/${q}?${utmSuffix}`;

    default:
      // Fallback Google Search si l'enseigne n'est pas reconnue
      return `https://www.google.com/search?q=${q}`;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const store   = searchParams.get('store')   ?? '';
  const project = searchParams.get('project') ?? 'diy';
  const q       = searchParams.get('q')       ?? '';

  // Log du clic — sera remplacé par Plausible (event: outbound-click)
  console.log(`[/api/go] store=${store} project=${project} q=${q}`);

  const destination = buildStoreUrl(store, q, project);

  return NextResponse.redirect(destination, { status: 301 });
}
