/**
 * leadSource.js — Provenance d'une demande de devis (source unique)
 *
 * Deux informations, deux durées de vie :
 *
 *   • `placement` — QUEL bouton a produit la demande. Connu au moment du clic,
 *     passé en prop jusqu'à la modale. Valeurs identiques à la dimension
 *     `placement` de l'événement Umami `devis-click` : les deux mesurent la même
 *     chose et doivent rester comparables.
 *
 *   • `entry` — D'OÙ vient la session. Capturé au tout premier chargement de
 *     page et gardé en sessionStorage, parce qu'au moment où le formulaire part
 *     `document.referrer` ne vaut plus rien : la personne a navigué en interne
 *     entre-temps. C'est exactement ce qui a rendu le lead du 26/08/2026 non
 *     attribuable sans un recoupement manuel de session dans Umami.
 *
 * Vie privée : on garde le DOMAINE du référent, jamais l'URL complète. Des
 * paramètres de campagne, on garde les `utm_*` (marquage publicitaire assumé,
 * choisi par l'annonceur) mais seulement le NOM des identifiants de clic
 * (`fbclid`, `gclid`…), pas leur valeur — un identifiant de clic est propre à
 * une personne, son nom seul suffit à dire « lien publicitaire ».
 */

/** Emplacements possibles d'un CTA devis — miroir de `trackDevisClick`. */
export const LEAD_PLACEMENTS = ['simulateur', 'guide', 'accueil', 'post-pdf'];

/** Valeur retenue quand l'appelant n'a rien fourni ou fournit un inconnu. */
export const PLACEMENT_UNKNOWN = 'inconnu';

/** Clé sessionStorage — l'entrée de session survit aux navigations internes. */
const ENTRY_KEY = 'diy_lead_entry';

/** Paramètres de campagne conservés avec leur valeur. */
const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

/** Identifiants de clic : on ne garde que le nom, jamais la valeur. */
const CLICK_ID_KEYS = ['fbclid', 'gclid', 'msclkid', 'ttclid'];

/* Bornes de stockage — un champ non borné venant du client n'entre pas en base. */
const MAX_REFERRER = 100;
const MAX_LANDING  = 200;
const MAX_CAMPAIGN = 160;

/** Whitelist du placement. Tout ce qui n'est pas connu devient `inconnu`. */
export function normalizePlacement(value) {
  return LEAD_PLACEMENTS.includes(value) ? value : PLACEMENT_UNKNOWN;
}

/**
 * Domaine du référent, sans `www.`. Chaîne vide si absent, illisible, ou
 * interne — une navigation depuis nos propres pages n'est pas une provenance.
 */
function referrerDomain(referrer, currentHost) {
  if (!referrer) return '';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    const self = String(currentHost ?? '').replace(/^www\./, '');
    return host === self ? '' : host;
  } catch {
    return '';
  }
}

/** Marquage de campagne compact, lisible dans un tableau. */
function campaignFrom(search) {
  const params = new URLSearchParams(search);
  const parts = [];
  for (const key of CAMPAIGN_KEYS) {
    const v = params.get(key);
    if (v) parts.push(`${key}=${v.slice(0, 40)}`);
  }
  for (const key of CLICK_ID_KEYS) {
    if (params.has(key)) parts.push(key);
  }
  return parts.join(';').slice(0, MAX_CAMPAIGN);
}

/**
 * Enregistre la provenance de la session, une seule fois.
 * Idempotent : rappelé sur chaque page, il ne réécrit jamais la première.
 * Rien ne remonte au serveur ici — la donnée n'est lue qu'à l'envoi d'un lead.
 */
export function captureEntry() {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(ENTRY_KEY)) return;
    const entry = {
      referrer: referrerDomain(document.referrer, window.location.hostname).slice(0, MAX_REFERRER),
      landing:  String(window.location.pathname).slice(0, MAX_LANDING),
      campaign: campaignFrom(window.location.search),
    };
    sessionStorage.setItem(ENTRY_KEY, JSON.stringify(entry));
  } catch {
    /* Navigation privée ou stockage bloqué : on se passe de la provenance. */
  }
}

/** Provenance de la session, ou `null` si elle n'a pas pu être capturée. */
export function readEntry() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ENTRY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Nettoyage côté serveur. Le client peut envoyer n'importe quoi : on ne stocke
 * que des champs connus, bornés, et un placement de la whitelist.
 */
export function sanitizeLeadSource({ placement, entry } = {}) {
  const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
  const e = entry && typeof entry === 'object' ? entry : {};
  return {
    placement: normalizePlacement(placement),
    referrer:  str(e.referrer, MAX_REFERRER),
    landing:   str(e.landing, MAX_LANDING),
    campaign:  str(e.campaign, MAX_CAMPAIGN),
  };
}

/** Libellé court d'une provenance, pour le tableau et l'export. */
export function formatSource(source) {
  if (!source) return '—';
  const canal = source.referrer || 'direct';
  return source.campaign ? `${canal} (${source.campaign})` : canal;
}
