/**
 * backend/scrapers/scrapingbee-client.js
 * ═══════════════════════════════════════════════════════════════
 * Client ScrapingBee — utilisé pour Leroy Merlin et Brico Dépôt.
 *
 * LM et BD utilisent DataDome (protection TLS + comportementale)
 * que Playwright seul ne peut pas contourner. ScrapingBee fournit
 * des proxies résidentiels avec empreinte TLS réelle.
 *
 * CRÉDITS (tier gratuit = 1 000 crédits/mois) :
 *   render_js=true       →  5 crédits/page  (standard proxy)
 *   premium_proxy=true   → 25 crédits/page  (si DataDome persiste)
 *
 *   36 requêtes LM × 5  = 180 crédits
 *   36 requêtes BD × 5  = 180 crédits
 *   ─────────────────────────────────
 *   Total run complet    = 360 crédits  → ~2,7 runs/mois gratuits
 *
 * ACTIVATION :
 *   Ajouter dans backend/.env :
 *     SCRAPINGBEE_API_KEY=votre_clé_api
 *
 * API REFERENCE : https://www.scrapingbee.com/documentation/
 * ═══════════════════════════════════════════════════════════════
 */

const axios = require('axios');

const SB_ENDPOINT = 'https://app.scrapingbee.com/api/v1/';

/**
 * Compte le coût en crédits estimé pour les logs.
 * render_js=true + premium_proxy=false = 5 crédits
 * render_js=true + premium_proxy=true  = 25 crédits
 */
function coutCredits(premiumProxy) {
  return premiumProxy ? 25 : 5;
}

/**
 * Récupère le HTML d'une URL via l'API ScrapingBee.
 *
 * @param {string}  url         — URL cible
 * @param {string}  magasin     — Nom de l'enseigne (pour les logs)
 * @param {Object}  opts
 * @param {string}  [opts.waitSelector]    — CSS selector à attendre avant de retourner
 * @param {number}  [opts.timeout=30000]   — timeout total (ms)
 * @param {boolean} [opts.premiumProxy]    — activer les proxies premium (25 crédits)
 * @returns {Promise<string>} HTML rendu
 */
async function fetchWithScrapingBee(url, magasin, opts = {}) {
  const apiKey = process.env.SCRAPINGBEE_API_KEY;
  if (!apiKey) {
    throw new Error('SCRAPINGBEE_API_KEY manquant dans .env');
  }

  const {
    waitSelector = null,
    timeout      = 30000,
    premiumProxy = false,
  } = opts;

  const params = {
    api_key:          apiKey,
    url,
    render_js:        'true',
    premium_proxy:    String(premiumProxy),
    country_code:     'fr',         // IP française — nécessaire pour LM/BD
    block_ads:        'true',
    wait:             '10000',      // 10s pour le JS + DataDome challenge
    json_response:    'false',      // retourner HTML brut, pas du JSON
    timeout:          String(Math.min(timeout, 30000)),
  };

  // wait_for : seulement si sélecteur simple (sans virgule).
  // ScrapingBee ne supporte pas les groupes de sélecteurs (foo, bar)
  // et retourne 500 si le sélecteur est complexe ou jamais trouvé.
  if (waitSelector && !waitSelector.includes(',')) {
    params.wait_for = waitSelector;
  }

  const credits = coutCredits(premiumProxy);
  console.log(`  🐝 ScrapingBee [${credits} crédits] — ${magasin}: ${new URL(url).pathname}`);

  try {
    const resp = await axios.get(SB_ENDPOINT, {
      params,
      timeout: timeout + 10000, // marge réseau sur le timeout ScrapingBee
      // ScrapingBee retourne le HTML directement (text/html)
      responseType: 'text',
      maxRedirects: 5,
      validateStatus: (s) => s < 500,
    });

    // ── Gestion des erreurs ScrapingBee ─────────────────────
    if (resp.status === 401) {
      throw new Error('Clé API ScrapingBee invalide (401)');
    }
    if (resp.status === 402) {
      throw new Error('Crédits ScrapingBee épuisés (402) — voir scrapingbee.com/billing');
    }
    if (resp.status === 429) {
      throw new Error('Rate limit ScrapingBee (429) — attendre avant de réessayer');
    }
    if (resp.status >= 400) {
      throw new Error(`ScrapingBee erreur ${resp.status} sur ${url}`);
    }

    const html = typeof resp.data === 'string' ? resp.data : String(resp.data);

    if (!html || html.length < 500) {
      throw new Error(`Page trop courte (${html.length} octets) via ScrapingBee pour ${magasin}`);
    }

    // ── Détecter si DataDome a quand même bloqué ──────────────
    // DataDome retourne parfois un captcha même via proxies standard.
    // Dans ce cas, relancer avec premium_proxy=true si ce n'est pas déjà fait.
    const hasDataDome = html.includes('datadome') || html.includes('captcha-delivery.com');
    if (hasDataDome && !premiumProxy) {
      console.warn(`  ⚠️  DataDome détecté via proxy standard — retry premium_proxy=true (25 crédits)`);
      return fetchWithScrapingBee(url, magasin, { ...opts, premiumProxy: true });
    }
    if (hasDataDome && premiumProxy) {
      throw new Error(`DataDome persistant malgré premium_proxy — ${magasin} bloqué`);
    }

    return html;

  } catch (err) {
    // Propager les erreurs axios avec un message clair
    if (err.response) {
      throw new Error(`ScrapingBee HTTP ${err.response.status} pour ${magasin}`);
    }
    throw err;
  }
}

/**
 * Vérifie le solde de crédits restants et le logge.
 * Utile à appeler en début de run pour anticiper les dépassements.
 */
async function verifierCredits() {
  const apiKey = process.env.SCRAPINGBEE_API_KEY;
  if (!apiKey) return null;

  try {
    const resp = await axios.get('https://app.scrapingbee.com/api/v1/usage', {
      params:  { api_key: apiKey },
      timeout: 10000,
    });
    const { max_api_credit, used_api_credit } = resp.data || {};
    const restants = (max_api_credit || 0) - (used_api_credit || 0);
    console.log(`  🐝 ScrapingBee — ${restants} crédits restants (${used_api_credit}/${max_api_credit} utilisés)`);
    return restants;
  } catch {
    return null; // Non bloquant
  }
}

module.exports = { fetchWithScrapingBee, verifierCredits };
