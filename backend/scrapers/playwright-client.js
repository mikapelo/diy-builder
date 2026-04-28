/**
 * backend/scrapers/playwright-client.js
 * ═══════════════════════════════════════════════════════════════
 * Client Playwright partagé par tous les scrapers.
 *
 * Activé via USE_PLAYWRIGHT=true dans .env
 *
 * AVANTAGES vs axios/cheerio :
 *   - Exécute le JS de la page → Angular/React/Next.js rendus
 *   - Passe les challenges Cloudflare JS (pas le CAPTCHA image)
 *   - Peut attendre un sélecteur CSS avant d'extraire le HTML
 *
 * LIMITES :
 *   - Plus lent (2-6s/page vs 300ms en axios)
 *   - Consomme plus de RAM (~150 Mo pour le navigateur)
 *   - Ne passe pas les CAPTCHA visuels (hCaptcha, reCAPTCHA v2)
 *   - Peut être bloqué par TLS fingerprinting avancé (Cloudflare Enterprise)
 *
 * STEALTH (playwright-extra + puppeteer-extra-plugin-stealth) :
 *   Patche +20 vecteurs de fingerprinting côté JS :
 *     navigator.webdriver, chrome.*,  plugins, mimeTypes, permissions API,
 *     WebGL vendor/renderer, hairline feature, user-agent data, etc.
 *   Efficace contre Cloudflare standard (LM, BD).
 *   Limites : ne masque pas le JA3/TLS fingerprint réseau (Cloudflare Enterprise).
 *
 * UTILISATION :
 *   const { fetchWithPlaywright, closeBrowser } = require('./playwright-client');
 *   const html = await fetchWithPlaywright(url, 'Castorama', {
 *     waitSelector: '.c-product-card',
 *     timeout: 15000,
 *   });
 *   await closeBrowser(); // appeler une fois à la fin du run
 * ═══════════════════════════════════════════════════════════════
 */

// playwright-extra + stealth — contourne les protections Cloudflare JS & fingerprint
const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
chromium.use(StealthPlugin());

// ── Singleton navigateur ──────────────────────────────────────
let _browser = null;

async function getBrowser() {
  if (!_browser) {
    _browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--window-size=1280,900',
      ],
    });
  }
  return _browser;
}

async function closeBrowser() {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}

// ── Headers réalistes ─────────────────────────────────────────
const EXTRA_HEADERS = {
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'DNT':             '1',
};

// ── Cookies de consentement RGPD par enseigne ─────────────────
// Injectés avant navigation pour éviter la bannière TrustArc / Didomi.
function getCookiesConsentement(hostname) {
  const cookies = [];

  // TrustArc (utilisé par Castorama, Brico Dépôt)
  if (/castorama|bricodepot/.test(hostname)) {
    cookies.push(
      { name: 'notice_gdpr_prefs',  value: '0,1,2:', domain: `.${hostname}`, path: '/' },
      { name: 'notice_behavior',    value: 'expressed,eu', domain: `.${hostname}`, path: '/' },
      { name: 'notice_preferences', value: '2:', domain: `.${hostname}`, path: '/' },
    );
  }

  // Didomi (utilisé par Leroy Merlin)
  if (/leroymerlin/.test(hostname)) {
    // Didomi stocke le token en JSON encodé base64 — valeur générique acceptant tout
    const didomiPayload = Buffer.from(JSON.stringify({
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      version: 2,
      purposes: { enabled: ['cookies', 'analytics', 'advertising'] },
      vendors:  { enabled: [] },
    })).toString('base64');
    cookies.push(
      { name: 'didomi_token', value: didomiPayload, domain: '.leroymerlin.fr', path: '/' },
      { name: 'euconsent-v2', value: 'GDPR_CONSENT_ALL', domain: '.leroymerlin.fr', path: '/' },
    );
  }

  return cookies;
}

// ── Cliqueur de bannière consentement (fallback) ───────────────
// Si les cookies ne suffisent pas, on clique le bouton "Accepter"
// Textes exacts de boutons "accepter" observés sur les enseignes FR
const CONSENT_BUTTON_TEXTS = [
  'Accepter et continuer',   // Castorama (TrustArc in-page)
  'Tout accepter',
  'Accepter tout',
  'Accepter et fermer',
  "J'accepte",
  'Accept all',
  'Accepter',
];

const CONSENT_CSS_SELECTORS = [
  '#truste-consent-button',
  '.trustarc-agree-btn',
  'button[id*="accept"]',
  'button[class*="accept-all"]',
  '.didomi-btn-agree',
  '#didomi-notice-agree-button',
];

async function fermerBanniereConsentement(page) {
  // 1. Essayer les sélecteurs CSS classiques
  for (const sel of CONSENT_CSS_SELECTORS) {
    try {
      const btn = await page.$(sel);
      if (btn && await btn.isVisible()) {
        await btn.click({ timeout: 3000 });
        await page.waitForTimeout(1000);
        return true;
      }
    } catch { /* sélecteur absent */ }
  }

  // 2. Essayer par texte (Playwright locator)
  for (const txt of CONSENT_BUTTON_TEXTS) {
    try {
      const loc = page.locator(`button:has-text("${txt}")`).first();
      if (await loc.isVisible({ timeout: 1500 })) {
        await loc.click({ timeout: 3000 });
        await page.waitForTimeout(1000);
        return true;
      }
    } catch { /* texte absent */ }
  }

  return false;
}

// ── Cloudflare challenge detection & bypass ───────────────────

/**
 * Détecte une page Cloudflare JS challenge (pas un CAPTCHA visuel).
 * CF injecte un script `var dd={rt:'i'/'c'/'f',...}` avec des tailles
 * de page très petites (< 3 Ko) avant de rediriger vers la vraie page.
 */
function estPageCFChallenge(html) {
  if (!html || html.length > 5000) return false;
  return html.includes('var dd=') || html.includes("'cf-challenge'") ||
         html.includes('cf-chl-') || html.includes('cf_clearance');
}

/**
 * Attend que Cloudflare résolve son JS challenge et redirige vers la
 * vraie page. Trois stratégies successives :
 *  1. Attend que le body.innerText soit substantiel (> 1 000 chars)
 *  2. Attend une navigation (redirect CF → vraie page)
 *  3. Fallback : attend 8s supplémentaires et reprend le HTML
 */
async function attendreApresCFChallenge(page, timeout) {
  const cfTimeout = Math.min(timeout, 25000);

  // Stratégie 1 : waitForFunction — le body grossit quand CF passe
  try {
    await page.waitForFunction(
      () => document.body && document.body.innerText.length > 1000,
      { timeout: cfTimeout }
    );
    return await page.content();
  } catch { /* body reste petit */ }

  // Stratégie 2 : waitForNavigation — CF fait un redirect HTTP
  try {
    await page.waitForNavigation({
      waitUntil: 'domcontentloaded',
      timeout:   Math.min(cfTimeout, 15000),
    });
    await page.waitForTimeout(3000); // laisser la SPA se rendre
    return await page.content();
  } catch { /* pas de navigation */ }

  // Stratégie 3 : attente brute + dernier contenu disponible
  await page.waitForTimeout(8000);
  return await page.content();
}

/**
 * Charge une URL avec Playwright et retourne le HTML rendu.
 *
 * @param {string}  url       — URL à charger
 * @param {string}  magasin   — Nom de l'enseigne (pour les logs)
 * @param {Object}  opts
 * @param {string}  [opts.waitSelector]  — sélecteur CSS à attendre (défaut: networkidle)
 * @param {number}  [opts.timeout=20000] — timeout total (ms)
 * @param {number}  [opts.extraWaitMs=0] — pause après chargement (pour animations)
 * @returns {Promise<string>} HTML de la page après rendu JS
 */
async function fetchWithPlaywright(url, magasin, opts = {}) {
  const {
    waitSelector = null,
    timeout      = parseInt(process.env.SCRAPER_TIMEOUT_MS || '20000'),
    extraWaitMs  = 2500,  // 2.5s — suffisant pour la plupart des SPAs
  } = opts;

  const browser = await getBrowser();

  // Injecter les cookies de consentement RGPD avant navigation
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  const consentCookies = getCookiesConsentement(hostname);

  const context = await browser.newContext({
    viewport:          { width: 1280, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    extraHTTPHeaders: EXTRA_HEADERS,
    locale:           'fr-FR',
  });

  if (consentCookies.length > 0) {
    await context.addCookies(consentCookies);
  }

  const page = await context.newPage();

  try {
    // Note : navigator.webdriver, plugins, chrome.runtime, etc. sont patchés
    // automatiquement par puppeteer-extra-plugin-stealth — pas besoin d'addInitScript.

    // Navigation principale — domcontentloaded pour que le JS commence
    // à s'exécuter immédiatement. On attend ensuite avec extraWaitMs.
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout,
    });

    // Pause pour laisser la SPA (Angular/React/Next.js) se rendre
    // 2.5s est suffisant sur Castorama (données JSON-LD disponibles)
    // Valeur configurable via l'option extraWaitMs
    await page.waitForTimeout(extraWaitMs);

    // ── Cloudflare JS challenge handler ──────────────────────
    // LM et BD utilisent CF JS challenge (var dd={rt:'i'} puis rt:'c').
    // Le browser doit exécuter le script, recevoir un cookie cf_clearance,
    // puis être redirigé vers la vraie page. On attend ce redirect.
    let html = await page.content();
    if (estPageCFChallenge(html)) {
      console.log(`    ⏳ ${magasin} — CF challenge détecté, attente redirect…`);
      html = await attendreApresCFChallenge(page, timeout);
    }

    // Fermer la bannière de consentement si elle s'affiche malgré les cookies
    const consentCliqued = await fermerBanniereConsentement(page);

    // Après clic sur consentement : re-attente du sélecteur produit
    // La SPA recharge le contenu dès que le consentement est accepté
    if (waitSelector) {
      try {
        await page.waitForSelector(waitSelector, {
          timeout: Math.min(timeout, 15000),
          state:   'attached',
        });
        html = await page.content();
      } catch {
        // Sélecteur absent — on prend le HTML disponible
      }
    } else {
      try {
        await page.waitForLoadState('networkidle', {
          timeout: Math.min(timeout, consentCliqued ? 12000 : 10000),
        });
        html = await page.content();
      } catch {
        // Acceptable sur des sites avec polling
      }
    }

    if (!html || html.length < 500) {
      throw new Error(`Page trop courte (${html?.length ?? 0} octets) pour ${magasin}`);
    }

    return html;

  } finally {
    await page.close();
    await context.close();
  }
}

module.exports = { fetchWithPlaywright, closeBrowser, getBrowser };
