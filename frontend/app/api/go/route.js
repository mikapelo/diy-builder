/**
 * /api/go — Redirecteur affilié avec UTM
 *
 * Params GET :
 *   store   : identifiant enseigne (leroymerlin | castorama | bricodepot | manomano)
 *   project : identifiant module (terrasse | cabanon | pergola | cloture | …)
 *   q       : terme de recherche optionnel (encodé par le client)
 *             Si absent, utilise PROJECT_QUERIES[project] comme terme par défaut.
 *
 * Note: aucun programme d'affiliation actif sur ces 4 enseignes (Awin/Affilae
 *       refusés, pas de programme direct négocié à date). Le redirecteur sert
 *       uniquement au suivi UTM pour mesurer le trafic comparatif → enseignes.
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

/** Construit l'URL enseigne avec UTM à partir du store ID, du terme et du projet
 *  Exporté pour tests unitaires (audit Sprint 3). */
export function buildStoreUrl(storeId, q, project) {
  const utmSuffix = `utm_source=diy-builder&utm_medium=referral&utm_campaign=${encodeURIComponent(project)}`;

  switch (storeId) {
    // LM : formulaire action="/search", param "q"
    case 'leroymerlin':
      return `https://www.leroymerlin.fr/search?q=${q}&${utmSuffix}`;

    // Castorama : formulaire action="/search", param "term"
    case 'castorama':
      return `https://www.castorama.fr/search?term=${q}&${utmSuffix}`;

    // Brico Dépôt : domaine bricodepot.fr (sans tiret), search JS-driven → page accueil
    case 'bricodepot':
    case 'brico-depot':
      return `https://www.bricodepot.fr/?${utmSuffix}`;

    // ManoMano : param "q" (endpoint /search?q=)
    case 'manomano':
      return `https://www.manomano.fr/search?q=${q}&${utmSuffix}`;

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

  const destination = buildStoreUrl(store, q, project);

  return NextResponse.redirect(destination, { status: 301 });
}
