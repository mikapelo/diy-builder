#!/usr/bin/env node
/**
 * scripts/gsc-stats.js — Lecture API Google Search Console pour DIY Builder
 *
 * Auth : 2 modes supportés (auto-détectés)
 *   1. Application Default Credentials (utilisateur OAuth via gcloud CLI)
 *      → `gcloud auth application-default login --scopes='...webmasters.readonly,...cloud-platform'`
 *      → crédentials stockés dans ~/.config/gcloud/application_default_credentials.json
 *      → mode recommandé : pas besoin d'autoriser un service account dans GSC UI
 *
 *   2. Service Account (fallback historique)
 *      → fichier `.gsc-service-account.json` à la racine du projet
 *      → l'email du SA doit être ajouté comme user dans Search Console UI
 *        (bloqué par Google depuis 2023 — préférer le mode 1)
 *
 * Aucune dépendance npm — uniquement crypto natif Node.js.
 *
 * Usage :
 *   node scripts/gsc-stats.js                       # aide
 *   node scripts/gsc-stats.js sites                 # liste les propriétés accessibles
 *   node scripts/gsc-stats.js performance [28d|7d]  # totaux clics/imp/CTR/pos
 *   node scripts/gsc-stats.js queries [28d]         # top 20 requêtes
 *   node scripts/gsc-stats.js pages [28d]           # top 20 pages
 *   node scripts/gsc-stats.js daily [28d]           # série journalière
 *   node scripts/gsc-stats.js inspect /guides/cabanon  # état indexation URL
 *   node scripts/gsc-stats.js sitemaps              # sitemaps soumis + statut
 *   node scripts/gsc-stats.js countries [28d]       # top pays
 *   node scripts/gsc-stats.js devices [28d]         # mobile vs desktop
 *
 * Variables d'env optionnelles :
 *   GSC_SERVICE_ACCOUNT_JSON  chemin custom vers le JSON
 *   GSC_SITE_URL              propriété à interroger
 *                             (défaut : sc-domain:diy-builder.fr)
 */

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─── Configuration ─────────────────────────────────────────────────
const SA_KEY_PATH = process.env.GSC_SERVICE_ACCOUNT_JSON
  || path.join(__dirname, '..', '.gsc-service-account.json');
const ADC_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.join(process.env.HOME || '', '.config', 'gcloud', 'application_default_credentials.json');

// Propriété Search Console — deux formats possibles :
//   - 'sc-domain:diy-builder.fr'         (propriété domaine, recommandé)
//   - 'https://www.diy-builder.fr/'      (propriété préfixe URL)
const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:diy-builder.fr';

// ─── Détection automatique du mode d'auth ────────────────────────
// Priorité : ADC (OAuth utilisateur) > Service Account
let authMode = null;
let creds = null;

if (fs.existsSync(ADC_PATH)) {
  const adc = JSON.parse(fs.readFileSync(ADC_PATH, 'utf8'));
  if (adc.refresh_token && adc.client_id && adc.client_secret) {
    authMode = 'adc';
    creds = adc;
  }
}

if (!authMode && fs.existsSync(SA_KEY_PATH)) {
  const sa = JSON.parse(fs.readFileSync(SA_KEY_PATH, 'utf8'));
  if (sa.private_key && sa.client_email) {
    authMode = 'sa';
    creds = sa;
  }
}

if (!authMode) {
  console.error('✗ Aucun credential trouvé.');
  console.error('');
  console.error('  Option 1 (recommandée) — OAuth utilisateur via gcloud CLI :');
  console.error('    gcloud auth application-default login \\');
  console.error('      --scopes=\'https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform\'');
  console.error('');
  console.error('  Option 2 (fallback) — Service Account JSON :');
  console.error('    Placer la clé à ' + SA_KEY_PATH);
  console.error('    + autoriser l\'email du SA dans Search Console');
  process.exit(1);
}

// ─── Helpers ───────────────────────────────────────────────────────
function base64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function dateNDaysAgo(n) {
  const d = new Date(Date.now() - n * 24 * 3600 * 1000);
  return d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

function parseDays(arg, fallback = 28) {
  const m = (arg || '').match(/^(\d+)d$/);
  return m ? parseInt(m[1], 10) : fallback;
}

function fmt(n, w) {
  return String(n).padStart(w);
}

// ─── Auth → access_token (selon le mode détecté) ─────────────────
async function getAccessToken() {
  if (authMode === 'adc') {
    // OAuth user : échange refresh_token contre access_token
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'refresh_token',
        refresh_token: creds.refresh_token,
        client_id:     creds.client_id,
        client_secret: creds.client_secret,
      }),
    });
    const data = await res.json();
    if (!data.access_token) {
      throw new Error('Auth ADC échouée : ' + JSON.stringify(data));
    }
    return data.access_token;
  }

  // mode 'sa' : JWT signé RS256
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss:   creds.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  }));
  const signingInput = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = base64url(signer.sign(creds.private_key));
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Auth SA échouée : ' + JSON.stringify(data));
  }
  return data.access_token;
}

// ─── Quota project (requis en mode ADC utilisateur) ──────────────
// Le projet Cloud sur lequel imputer les quotas d'appels API.
// L'API Search Console est gratuite mais Google exige tout de même
// la désignation d'un projet pour les credentials de type "authorized_user".
const QUOTA_PROJECT = process.env.GSC_QUOTA_PROJECT
  || (authMode === 'sa' ? creds.project_id : 'diy-builder-gsc');

// ─── Wrapper API ───────────────────────────────────────────────────
async function gsc(token, path, body) {
  const url = 'https://searchconsole.googleapis.com/' + path;
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (authMode === 'adc') {
    headers['X-Goog-User-Project'] = QUOTA_PROJECT;
  }
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} : ${text.slice(0, 400)}`);
  }
  return res.json();
}

// ─── Search Analytics queries ─────────────────────────────────────
async function searchAnalytics(token, opts) {
  const siteParam = encodeURIComponent(SITE_URL);
  return gsc(token, `webmasters/v3/sites/${siteParam}/searchAnalytics/query`, {
    startDate: opts.startDate,
    endDate:   opts.endDate,
    dimensions: opts.dimensions || [],
    rowLimit:  opts.rowLimit || 20,
    ...(opts.dimensionFilterGroups ? { dimensionFilterGroups: opts.dimensionFilterGroups } : {}),
  });
}

// ─── Commandes ────────────────────────────────────────────────────
async function cmdSites(token) {
  const data = await gsc(token, 'webmasters/v3/sites');
  console.log('=== Propriétés accessibles ===');
  (data.siteEntry || []).forEach(s => {
    console.log(`  [${s.permissionLevel.padEnd(18)}]  ${s.siteUrl}`);
  });
}

async function cmdPerformance(token, days) {
  const data = await searchAnalytics(token, {
    startDate: dateNDaysAgo(days),
    endDate:   dateNDaysAgo(1),
    rowLimit:  1,
  });
  console.log(`=== Performance ${days} derniers jours (${dateNDaysAgo(days)} → ${dateNDaysAgo(1)}) ===`);
  if (data.rows && data.rows.length) {
    const r = data.rows[0];
    console.log(`  Clics       : ${r.clicks}`);
    console.log(`  Impressions : ${r.impressions}`);
    console.log(`  CTR         : ${(r.ctr * 100).toFixed(2)} %`);
    console.log(`  Position    : ${r.position.toFixed(1)} (moyenne)`);
  } else {
    console.log('  (aucune donnée — site très récent ou pas encore indexé)');
  }
}

async function cmdQueries(token, days) {
  const data = await searchAnalytics(token, {
    startDate:  dateNDaysAgo(days),
    endDate:    dateNDaysAgo(1),
    dimensions: ['query'],
    rowLimit:   20,
  });
  console.log(`=== Top 20 requêtes ${days} derniers jours ===`);
  console.log('  clics  imp    CTR     pos    requête');
  (data.rows || []).forEach(r => {
    console.log(
      '  ' + fmt(r.clicks, 5) +
      '  ' + fmt(r.impressions, 5) +
      '  ' + fmt((r.ctr * 100).toFixed(1) + '%', 6) +
      '  ' + fmt(r.position.toFixed(1), 5) +
      '  ' + r.keys[0]
    );
  });
}

async function cmdPages(token, days) {
  const data = await searchAnalytics(token, {
    startDate:  dateNDaysAgo(days),
    endDate:    dateNDaysAgo(1),
    dimensions: ['page'],
    rowLimit:   20,
  });
  console.log(`=== Top 20 pages ${days} derniers jours ===`);
  console.log('  clics  imp    CTR     pos    page');
  (data.rows || []).forEach(r => {
    const page = r.keys[0].replace('https://www.diy-builder.fr', '');
    console.log(
      '  ' + fmt(r.clicks, 5) +
      '  ' + fmt(r.impressions, 5) +
      '  ' + fmt((r.ctr * 100).toFixed(1) + '%', 6) +
      '  ' + fmt(r.position.toFixed(1), 5) +
      '  ' + (page || '/')
    );
  });
}

async function cmdDaily(token, days) {
  const data = await searchAnalytics(token, {
    startDate:  dateNDaysAgo(days),
    endDate:    dateNDaysAgo(1),
    dimensions: ['date'],
    rowLimit:   days,
  });
  console.log(`=== Série journalière ${days} derniers jours ===`);
  console.log('  date        clics  imp    CTR     pos');
  (data.rows || []).forEach(r => {
    console.log(
      '  ' + r.keys[0] +
      '  ' + fmt(r.clicks, 5) +
      '  ' + fmt(r.impressions, 5) +
      '  ' + fmt((r.ctr * 100).toFixed(1) + '%', 6) +
      '  ' + fmt(r.position.toFixed(1), 5)
    );
  });
}

async function cmdCountries(token, days) {
  const data = await searchAnalytics(token, {
    startDate:  dateNDaysAgo(days),
    endDate:    dateNDaysAgo(1),
    dimensions: ['country'],
    rowLimit:   10,
  });
  console.log(`=== Top 10 pays ${days} derniers jours ===`);
  (data.rows || []).forEach(r => {
    console.log('  ' + fmt(r.clicks, 5) + ' clics  ' + r.keys[0].toUpperCase());
  });
}

async function cmdDevices(token, days) {
  const data = await searchAnalytics(token, {
    startDate:  dateNDaysAgo(days),
    endDate:    dateNDaysAgo(1),
    dimensions: ['device'],
    rowLimit:   10,
  });
  console.log(`=== Devices ${days} derniers jours ===`);
  (data.rows || []).forEach(r => {
    console.log('  ' + fmt(r.clicks, 5) + ' clics  ' + r.keys[0]);
  });
}

async function cmdInspect(token, urlArg) {
  if (!urlArg) {
    console.error('Usage : node scripts/gsc-stats.js inspect <url-ou-chemin>');
    process.exit(1);
  }
  const fullUrl = urlArg.startsWith('http')
    ? urlArg
    : 'https://www.diy-builder.fr' + (urlArg.startsWith('/') ? urlArg : '/' + urlArg);

  const data = await gsc(token, 'v1/urlInspection/index:inspect', {
    inspectionUrl: fullUrl,
    siteUrl:       SITE_URL,
  });

  const idx = data.inspectionResult?.indexStatusResult;
  console.log('=== État indexation : ' + fullUrl + ' ===');
  if (idx) {
    console.log('  Verdict          : ' + idx.verdict);
    console.log('  Couverture       : ' + idx.coverageState);
    console.log('  Crawl statut     : ' + idx.crawledAs);
    console.log('  Dernière crawl   : ' + idx.lastCrawlTime);
    console.log('  Robots.txt       : ' + idx.robotsTxtState);
    console.log('  Indexabilité     : ' + idx.indexingState);
    console.log('  Page indexée     : ' + (idx.googleCanonical || '(none)'));
    console.log('  Canonical user   : ' + (idx.userCanonical || '(none)'));
    if (idx.referringUrls?.length) {
      console.log('  Liens entrants   : ' + idx.referringUrls.length);
    }
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

async function cmdSitemaps(token) {
  const siteParam = encodeURIComponent(SITE_URL);
  const data = await gsc(token, `webmasters/v3/sites/${siteParam}/sitemaps`);
  console.log('=== Sitemaps soumis ===');
  (data.sitemap || []).forEach(s => {
    console.log('  ' + s.path);
    console.log('    soumis le   : ' + s.lastSubmitted);
    console.log('    dernier scan : ' + s.lastDownloaded);
    console.log('    erreurs      : ' + (s.errors || 0));
    console.log('    avertiss.    : ' + (s.warnings || 0));
    if (s.contents) {
      s.contents.forEach(c => {
        console.log('    ' + c.type + ' : ' + c.submitted + ' soumis, ' + (c.indexed || '?') + ' indexées');
      });
    }
    console.log('');
  });
}

function help() {
  console.log('Usage :');
  console.log('  node scripts/gsc-stats.js sites');
  console.log('  node scripts/gsc-stats.js performance [28d|7d]');
  console.log('  node scripts/gsc-stats.js queries     [28d]');
  console.log('  node scripts/gsc-stats.js pages       [28d]');
  console.log('  node scripts/gsc-stats.js daily       [28d]');
  console.log('  node scripts/gsc-stats.js countries   [28d]');
  console.log('  node scripts/gsc-stats.js devices     [28d]');
  console.log('  node scripts/gsc-stats.js inspect     /guides/cabanon');
  console.log('  node scripts/gsc-stats.js sitemaps');
  console.log('');
  console.log('Propriété interrogée : ' + SITE_URL);
  console.log('Mode auth            : ' + (authMode === 'adc' ? 'OAuth utilisateur (gcloud ADC)' : 'Service Account'));
  console.log('Credentials          : ' + (authMode === 'adc' ? ADC_PATH : SA_KEY_PATH));
}

// ─── Main ──────────────────────────────────────────────────────────
(async () => {
  const [, , cmd, ...args] = process.argv;

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    return help();
  }

  const token = await getAccessToken();

  switch (cmd) {
    case 'sites':       return cmdSites(token);
    case 'performance': return cmdPerformance(token, parseDays(args[0]));
    case 'queries':     return cmdQueries(token, parseDays(args[0]));
    case 'pages':       return cmdPages(token, parseDays(args[0]));
    case 'daily':       return cmdDaily(token, parseDays(args[0], 14));
    case 'countries':   return cmdCountries(token, parseDays(args[0]));
    case 'devices':     return cmdDevices(token, parseDays(args[0]));
    case 'inspect':     return cmdInspect(token, args[0]);
    case 'sitemaps':    return cmdSitemaps(token);
    default:
      console.error('Commande inconnue : ' + cmd);
      help();
      process.exit(1);
  }
})().catch(e => {
  console.error('✗ ' + e.message);
  process.exit(1);
});
