/**
 * /api/go — Redirecteur affilié avec UTM
 *
 * Params GET :
 *   store   : identifiant enseigne (leroymerlin | castorama | bricodepot | manomano)
 *   project : identifiant module (terrasse | cabanon | pergola | cloture | …)
 *   q       : terme de recherche optionnel (encodé par le client)
 *             Si absent, utilise PROJECT_QUERIES[project] comme terme par défaut.
 *
 * TODO: brancher les liens affiliés Awin/Affilae ici une fois les comptes validés.
 *       Remplacer les URLs directes ci-dessous par les URLs de tracking affilié
 *       (ex: https://www.awin1.com/cread.php?awinmid=XXXX&awinaffid=YYYY&p=URL_ENCODÉE)
 */

import { NextResponse } from 'next/server';

/**
 * Termes de recherche par défaut pour chaque module — ciblés sur le matériau principal.
 * Utilisés quand le client n'envoie pas de paramètre `q` (clic depuis les store cards).
 * Pour les liens par article (page /liste), le client envoie son propre `q`.
 */
const PROJECT_QUERIES = {
  terrasse: 'lame terrasse bois pin traité classe 4',
  cabanon:  'bois ossature abri de jardin montant 90x90',
  pergola:  'poteau pergola bois 100x100 traité',
  cloture:  'lame clôture bois pin traité',
};

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
      return `https://www.google.com/search?q=${q}+bois+bricolage`;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const store   = searchParams.get('store')   ?? '';
  const project = searchParams.get('project') ?? 'diy';
  const rawQ    = searchParams.get('q');

  // Si pas de `q` fourni par le client, utilise le terme par défaut du module
  const q = rawQ || encodeURIComponent(PROJECT_QUERIES[project] ?? 'matériaux bois construction');

  console.log(`[/api/go] store=${store} project=${project} q=${q}`);

  const destination = buildStoreUrl(store, q, project);

  return NextResponse.redirect(destination, { status: 301 });
}
