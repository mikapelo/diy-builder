/**
 * backend/scrapers/base.js
 * ═══════════════════════════════════════════════════════════════
 * Client HTTP partagé par tous les scrapers.
 *
 * RÉALITÉ TECHNIQUE — À LIRE AVANT DE DEPLOYER
 * ─────────────────────────────────────────────
 * Leroy Merlin, Castorama et Brico Dépôt utilisent :
 *   - Cloudflare Anti-Bot (challenge JS)
 *   - Rendering côté client (React / Next.js)
 *   - Rate limiting agressif
 *   - Vérification TLS fingerprint
 *
 * Un client axios/cheerio sera bloqué sur ces sites en production.
 * Ce module expose une architecture COMPLÈTE et CORRECTE qui :
 *   1. Fonctionne dès maintenant sur tout site HTML statique
 *   2. Gère proprement les blocages (ScraperBlockedError)
 *   3. Permet une migration future vers Playwright / ScrapingBee
 *      sans modifier le code appelant
 *   4. Ne casse jamais l'API — le fallback BDD statique prend le relais
 *
 * ALTERNATIVES LÉGALES RECOMMANDÉES
 * ──────────────────────────────────
 * • ScrapingBee / Oxylabs / Bright Data — proxies rotatifs + rendering JS
 * • Playwright en mode headless (voir flag USE_PLAYWRIGHT dans .env)
 * • APIs partenaires / flux XML si disponibles
 * • Maintenance manuelle du catalogue (scripts/seed*.js)
 * ═══════════════════════════════════════════════════════════════
 */

const axios = require('axios');

// ── User-Agents réalistes ──────────────────────────────────────
// Rotation pour réduire la détection (efficacité limitée contre CF)
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
];

// ── Codes d'erreur métier ──────────────────────────────────────
class ScraperError extends Error {
  constructor(message, code, magasin) {
    super(message);
    this.name   = 'ScraperError';
    this.code   = code;   // 'BLOCKED' | 'PARSE_ERROR' | 'NETWORK' | 'EMPTY'
    this.magasin = magasin;
  }
}

class ScraperBlockedError extends ScraperError {
  constructor(magasin, url, statusCode) {
    super(
      `Accès bloqué (${statusCode || 'CF'}) — ${magasin} utilise une protection anti-bot. ` +
      `Utiliser ScrapingBee/Playwright pour contourner.`,
      'BLOCKED',
      magasin
    );
    this.url        = url;
    this.statusCode = statusCode;
  }
}

// ── Délai aléatoire pour la politesse ─────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const jitter = (base, variance = 0.3) =>
  base + Math.floor(Math.random() * base * variance);

// ── Client HTTP configuré ──────────────────────────────────────
function creerClient(options = {}) {
  const timeout = parseInt(process.env.SCRAPER_TIMEOUT_MS || '15000');

  const instance = axios.create({
    timeout,
    maxRedirects: 5,
    validateStatus: (s) => s < 500, // On gère 4xx manuellement
    headers: {
      'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection':      'keep-alive',
      'Cache-Control':   'no-cache',
      'Pragma':          'no-cache',
      'DNT':             '1',
      ...options.headers,
    },
  });

  // Intercepteur — rotation User-Agent + log
  instance.interceptors.request.use((config) => {
    config.headers['User-Agent'] = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    return config;
  });

  return instance;
}

// ── Fetch avec retry exponentiel ──────────────────────────────
async function fetchAvecRetry(url, magasin, options = {}) {
  const client    = creerClient(options);
  const maxRetry  = parseInt(process.env.SCRAPER_MAX_RETRY || '3');
  const delaiBase = parseInt(process.env.SCRAPER_DELAY_MS  || '2000');

  let derniereErreur;

  for (let tentative = 1; tentative <= maxRetry; tentative++) {
    try {
      if (tentative > 1) {
        const delai = jitter(delaiBase * (tentative - 1));
        console.log(`  ↻ Retry ${tentative}/${maxRetry} pour ${magasin} (attente ${delai}ms)…`);
        await sleep(delai);
      }

      const resp = await client.get(url);

      // ── Détection des blocages ──────────────────────────
      if (resp.status === 403 || resp.status === 429) {
        throw new ScraperBlockedError(magasin, url, resp.status);
      }

      if (resp.status === 503) {
        // Peut être un challenge Cloudflare temporaire
        const html = resp.data || '';
        if (html.includes('cf-browser-verification') || html.includes('Just a moment')) {
          throw new ScraperBlockedError(magasin, url, 'CF_CHALLENGE');
        }
        throw new ScraperBlockedError(magasin, url, 503);
      }

      if (resp.status !== 200) {
        throw new ScraperError(
          `HTTP ${resp.status} sur ${url}`,
          'NETWORK',
          magasin
        );
      }

      // ── Vérification contenu vide ───────────────────────
      if (!resp.data || String(resp.data).length < 500) {
        throw new ScraperError(
          `Réponse trop courte (${String(resp.data || '').length} octets) — probablement bloqué`,
          'EMPTY',
          magasin
        );
      }

      return resp.data;

    } catch (err) {
      derniereErreur = err;

      // Ne pas retenter sur un blocage — inutile
      if (err instanceof ScraperBlockedError) {
        throw err;
      }

      if (err.code === 'ECONNABORTED') {
        console.warn(`  ⏱ Timeout (tentative ${tentative}) sur ${url}`);
      } else if (!err.response) {
        console.warn(`  🌐 Erreur réseau (tentative ${tentative}) : ${err.message}`);
      }
    }
  }

  throw derniereErreur || new ScraperError(`Échec après ${maxRetry} tentatives`, 'NETWORK', magasin);
}

// ── Normalisation du prix ──────────────────────────────────────
// Convertit "12,90 €", "12.90", "12,90€", "€12.90" → 12.90
function normaliserPrix(texte) {
  if (!texte) return null;
  const str = String(texte)
    .replace(/[€$\s\u00A0]/g, '')  // supprimer €, espaces, nbsp
    .replace(/,/g, '.')             // virgule → point
    .replace(/[^\d.]/g, '');       // garder uniquement chiffres et point
  const prix = parseFloat(str);
  return isNaN(prix) || prix <= 0 || prix > 9999 ? null : prix;
}

// ── Extraction de la longueur depuis le titre ──────────────────
// Ex: "Lame terrasse pin 2,4m" → 2400 (mm)
// Ex: "Lambourde 40x60x4000" → 4000 (mm)
// Ex: "Vis 5x60mm" → 60 (mm)
function extraireLongueur(texte) {
  if (!texte) return null;
  const str = String(texte);

  // Patterns par ordre de priorité
  const patterns = [
    // "4000mm", "2400mm", "4000 mm"
    { re: /(\d[\d\s]*)\s*mm\b/i,       facteur: 1      },
    // "2.4m", "3m", "4 m", "2,4m"
    { re: /(\d[\d,.]?\d*)\s*m(?:ètre|etre)?\b/i, facteur: 1000 },
    // "240cm", "400 cm"
    { re: /(\d+)\s*cm\b/i,             facteur: 10     },
    // Titre avec dimensions "40x60x4000" (dernière valeur = longueur)
    { re: /\d+\s*[xX×]\s*\d+\s*[xX×]\s*(\d{3,4})/,  facteur: 1 },
    // "L.2400", "L=2400"
    { re: /[Ll][.=]?\s*(\d{3,4})\b/,  facteur: 1      },
  ];

  for (const { re, facteur } of patterns) {
    const m = str.match(re);
    if (m) {
      const valeur = parseFloat(m[1].replace(',', '.').replace(/\s/g, ''));
      const mm     = Math.round(valeur * facteur);
      // Plage raisonnable : 400 mm à 8000 mm
      if (mm >= 400 && mm <= 8000) return mm;
    }
  }
  return null;
}

// ── Catégorisation automatique du produit ─────────────────────
// Utilisée en fallback quand la requête n'a pas de catégorie explicite.
// Les requêtes issues du catalogue ont toujours une catégorie forcée.
function categoriserProduit(titre) {
  const t = (titre || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Terrasse
  if (/(lame|planche).*(terras|deck)/i.test(t) || /terras.*(lame|planche)/i.test(t))
    return 'lame_terrasse';
  if (/lambourde|lamborde/i.test(t))
    return 'lambourde';
  if (/plot.*(beton|reglable)/i.test(t) || /beton.*plot/i.test(t))
    return 'plot_beton';
  if (/bande.*(bitume|bitumineus)/i.test(t) || /bitume.*lambourde/i.test(t))
    return 'bande_bitume';

  // Ossature / Charpente
  if (/chevron/i.test(t))
    return 'chevron';
  if (/bastaing/i.test(t))
    return 'bastaing';
  if (/montant.*(ossature|bois)/i.test(t) || /ossature.*(montant|bois)/i.test(t))
    return 'montant_ossature';
  if (/lisse.*(basse|haute|ossature)/i.test(t))
    return 'lisse_ossature';
  if (/poutre.*(pin|sapin|epicea|chene).*90.?x.?90/i.test(t))
    return 'montant_cabanon';

  // Revêtement
  if (/bardage.*(pin|bois)/i.test(t) || /bois.*bardage/i.test(t))
    return 'bardage';
  if (/volige/i.test(t))
    return 'volige';
  if (/osb/i.test(t))
    return 'osb';
  if (/pare.?pluie|membrane.*toiture|sous.?toiture/i.test(t))
    return 'membrane';

  // Quincaillerie
  if (/vis.*(bardage)/i.test(t) || /bardage.*vis/i.test(t))
    return 'vis_bardage';
  if (/vis.*(inox|a2)/i.test(t) && /4.?x.?40/i.test(t))
    return 'vis_inox';
  if (/vis.*(galva|zingu)/i.test(t))
    return 'vis_voliges';
  if (/vis.*(inox|terrasse|bois|deck)/i.test(t) || /(inox|terrasse).*(vis)/i.test(t))
    return 'vis_inox';
  if (/equerre.*(fixation|assemblage)/i.test(t) || /fixation.*equerre/i.test(t))
    return 'equerre';
  if (/sabot.*(chevron|joist)/i.test(t))
    return 'sabot_chevron';
  if (/sabot.*(bastaing|solive)/i.test(t))
    return 'sabot_bastaing';
  if (/boulon.*m10/i.test(t))
    return 'boulon';
  if (/pied.*(poteau|pot)/i.test(t) || /platine.*poteau/i.test(t))
    return 'pied_poteau';
  if (/ancrage.*(poteau|cloture)/i.test(t) || /platine.*h.*poteau/i.test(t))
    return 'ancrage_poteau';

  // Pergola
  if (/poteau.*(100.?x.?100|pergola)/i.test(t) || /pergola.*poteau/i.test(t))
    return 'poteau_pergola';
  if (/poutre.*(150.?x.?50|pergola)/i.test(t))
    return 'poutre_pergola';
  if (/traverse.*(pergola|80.?x.?50)/i.test(t) || /pergola.*traverse/i.test(t))
    return 'traverse_pergola';

  // Clôture
  if (/poteau.*(cloture|closture|uc4)/i.test(t))
    return 'poteau_cloture';
  if (/lame.*(cloture|closture)/i.test(t) || /(cloture|closture).*lame/i.test(t))
    return 'lame_cloture';
  if (/lisse.*(cloture|closture)/i.test(t) || /rail.*(cloture)/i.test(t))
    return 'lisse_cloture';

  // Fondations
  if (/treillis.*(soude|st25)/i.test(t) || /st25c/i.test(t))
    return 'treillis';
  if (/beton.*(scellement|sac)/i.test(t) || /scellement.*beton/i.test(t))
    return 'beton_scellement';
  if (/beton.*(c20|dalle|livre)/i.test(t))
    return 'beton';
  if (/polyane|film.*sous.*dalle/i.test(t))
    return 'polyane';
  if (/gravier.*(couche|forme|0.?31)/i.test(t))
    return 'gravier';

  return null; // non catégorisable
}

// ── Validation d'un produit normalisé ─────────────────────────
function validerProduit(p) {
  return (
    p &&
    typeof p.nom      === 'string' && p.nom.length > 3 &&
    typeof p.prix     === 'number' && p.prix > 0 &&
    typeof p.magasin  === 'string' &&
    typeof p.url      === 'string' &&
    p.categorie !== null
  );
}

// ── Routeur fetch unifié ───────────────────────────────────────
// Stratégie par enseigne :
//   Castorama   → Playwright (USE_PLAYWRIGHT=true) ou axios
//   LM + BD     → ScrapingBee si SCRAPINGBEE_API_KEY présent
//                  sinon Playwright si USE_PLAYWRIGHT=true
//                  sinon axios (sera bloqué — DataDome)
async function fetchPage(url, magasin, options = {}) {
  const usePW  = (process.env.USE_PLAYWRIGHT   || '').toLowerCase() === 'true';
  const sbKey  =  process.env.SCRAPINGBEE_API_KEY;
  const useSB  = !!sbKey && (magasin === 'Leroy Merlin' || magasin === 'Brico Dépôt');

  if (useSB) {
    const { fetchWithScrapingBee } = require('./scrapingbee-client');
    return fetchWithScrapingBee(url, magasin, options);
  }

  if (usePW) {
    const { fetchWithPlaywright } = require('./playwright-client');
    return fetchWithPlaywright(url, magasin, options);
  }

  return fetchAvecRetry(url, magasin, options);
}

module.exports = {
  fetchAvecRetry,
  fetchPage,
  normaliserPrix,
  extraireLongueur,
  categoriserProduit,
  validerProduit,
  ScraperError,
  ScraperBlockedError,
  sleep,
  jitter,
};
