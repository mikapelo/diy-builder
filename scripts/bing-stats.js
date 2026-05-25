#!/usr/bin/env node
/**
 * scripts/bing-stats.js — Lecture API Bing Webmaster Tools pour DIY Builder
 *
 * Auth : simple API key (différent de GSC qui demande OAuth complet).
 * Aucune dépendance npm — uniquement fetch natif Node.js.
 *
 * Setup :
 *   1. https://www.bing.com/webmasters → ⚙ Paramètres → Accès API → Générer une clé
 *   2. Ajouter dans frontend/.env.local :
 *        BING_API_KEY=...
 *        BING_SITE_URL=https://diy-builder.fr/   (apex, sans www, fin par /)
 *      (BING_SITE_URL est optionnel — auto-détecté via GetUserSites sinon)
 *
 * Usage :
 *   node scripts/bing-stats.js                       # aide
 *   node scripts/bing-stats.js sites                 # propriétés accessibles
 *   node scripts/bing-stats.js performance [28d|7d]  # clics + impressions/jour
 *   node scripts/bing-stats.js queries [28d]         # top requêtes
 *   node scripts/bing-stats.js pages [28d]           # top pages
 *   node scripts/bing-stats.js crawl                 # stats crawl + erreurs
 *   node scripts/bing-stats.js sitemaps              # sitemaps soumis + statut
 *   node scripts/bing-stats.js inspect /guides/cabanon  # info indexation URL
 *   node scripts/bing-stats.js submit /guides/xxx    # soumettre URL pour crawl
 *
 * Quota indexation Bing : 10 000 URLs/jour (vs 10/jour Google).
 *
 * Doc API : https://learn.microsoft.com/en-us/bingwebmaster/getting-access
 */

const fs   = require('fs');
const path = require('path');

// ─── Chargement .env.local ─────────────────────────────────────────
const envPath = path.join(__dirname, '..', 'frontend', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('✗ .env.local introuvable à ' + envPath);
  process.exit(1);
}
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

if (!env.BING_API_KEY) {
  console.error('✗ BING_API_KEY manquante dans .env.local');
  console.error('  Générer sur https://www.bing.com/webmasters → Paramètres → Accès API');
  process.exit(1);
}

const API_KEY  = env.BING_API_KEY;
const API_BASE = 'https://ssl.bing.com/webmaster/api.svc/json';

// ─── Helpers ───────────────────────────────────────────────────────
function fmt(v, w) { return String(v).padStart(w); }
function dateNDaysAgo(n) {
  const d = new Date(Date.now() - n * 24 * 3600 * 1000);
  return d.toISOString().split('T')[0];
}
function parseDays(arg, fb = 28) {
  const m = (arg || '').match(/^(\d+)d$/);
  return m ? parseInt(m[1], 10) : fb;
}

async function bing(endpoint, params = {}, method = 'GET', body = null) {
  const qs = new URLSearchParams({ apikey: API_KEY, ...params }).toString();
  const url = `${API_BASE}/${endpoint}?${qs}`;
  const opts = {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} sur ${endpoint} : ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.d ?? data; // l'API Bing wrap dans .d
}

// ─── Auto-détection siteUrl ───────────────────────────────────────
let SITE_URL = env.BING_SITE_URL || null;

async function resolveSiteUrl() {
  if (SITE_URL) {
    // Vérifier que cette URL est bien dans la liste
    const sites = await bing('GetUserSites');
    const match = sites.find(s => s.Url === SITE_URL || s.Url === SITE_URL + (SITE_URL.endsWith('/') ? '' : '/'));
    if (match) return match.Url;
    // Fallback : prendre le premier diy-builder
    const fb = sites.find(s => /diy-builder/i.test(s.Url));
    if (fb) {
      console.warn(`  ⚠ BING_SITE_URL="${SITE_URL}" introuvable. Auto-correction vers "${fb.Url}"`);
      return fb.Url;
    }
    return sites[0]?.Url;
  }
  const sites = await bing('GetUserSites');
  const diy = sites.find(s => /diy-builder/i.test(s.Url));
  return diy?.Url || sites[0]?.Url;
}

// ─── Commandes ────────────────────────────────────────────────────
async function cmdSites() {
  const sites = await bing('GetUserSites');
  console.log('=== Propriétés Bing accessibles ===');
  sites.forEach(s => {
    console.log(`  ${s.IsVerified ? '✅' : '❌'}  ${s.Url}`);
  });
}

async function cmdPerformance(days) {
  const siteUrl = await resolveSiteUrl();
  const data = await bing('GetRankAndTrafficStats', { siteUrl });
  // L'endpoint renvoie les stats par jour (jusqu'à 26 semaines en arrière)
  if (!Array.isArray(data) || data.length === 0) {
    console.log('=== Performance Bing ===');
    console.log('  (aucune donnée)');
    return;
  }
  // Filtrer sur les N derniers jours
  const cutoff = Date.now() - days * 24 * 3600 * 1000;
  const filtered = data.filter(d => {
    // Date format /Date(timestamp)/
    const ts = parseInt((d.Date || '').match(/\d+/)?.[0] || 0);
    return ts >= cutoff;
  });

  let clicks = 0, impressions = 0;
  filtered.forEach(d => {
    clicks += d.Clicks || 0;
    impressions += d.Impressions || 0;
  });
  const ctr = impressions ? (clicks / impressions * 100) : 0;

  console.log(`=== Performance Bing ${days} derniers jours (site ${siteUrl}) ===`);
  console.log(`  Clics       : ${clicks}`);
  console.log(`  Impressions : ${impressions}`);
  console.log(`  CTR         : ${ctr.toFixed(2)} %`);
  console.log(`  Période     : ${filtered.length} jours de données`);
}

async function cmdDaily(days) {
  const siteUrl = await resolveSiteUrl();
  const data = await bing('GetRankAndTrafficStats', { siteUrl });
  const cutoff = Date.now() - days * 24 * 3600 * 1000;
  const filtered = (data || []).filter(d => {
    const ts = parseInt((d.Date || '').match(/\d+/)?.[0] || 0);
    return ts >= cutoff;
  }).sort((a, b) => {
    const ta = parseInt((a.Date || '').match(/\d+/)?.[0] || 0);
    const tb = parseInt((b.Date || '').match(/\d+/)?.[0] || 0);
    return ta - tb;
  });

  console.log(`=== Série journalière Bing ${days} derniers jours ===`);
  console.log('  date        clics  imp     CTR');
  filtered.forEach(d => {
    const ts = parseInt((d.Date || '').match(/\d+/)?.[0] || 0);
    const date = new Date(ts).toISOString().split('T')[0];
    const c = d.Clicks || 0, i = d.Impressions || 0;
    const ctr = i ? (c / i * 100).toFixed(1) + '%' : '0%';
    console.log(`  ${date}  ${fmt(c, 5)}  ${fmt(i, 6)}  ${fmt(ctr, 6)}`);
  });
}

async function cmdQueries(days) {
  const siteUrl = await resolveSiteUrl();
  const data = await bing('GetQueryStats', { siteUrl });
  if (!Array.isArray(data) || data.length === 0) {
    console.log('=== Top requêtes Bing ===');
    console.log('  (aucune donnée — propriété trop récente ou pas encore d\'impressions)');
    return;
  }
  // Trier par clics décroissants
  const sorted = data.sort((a, b) => (b.Clicks || 0) - (a.Clicks || 0)).slice(0, 20);
  console.log(`=== Top 20 requêtes Bing (cumul ${days} derniers jours dispo) ===`);
  console.log('  clics  imp    pos    requête');
  sorted.forEach(r => {
    console.log(
      `  ${fmt(r.Clicks || 0, 5)}  ${fmt(r.Impressions || 0, 5)}  ${fmt((r.Position || 0).toFixed(1), 5)}  ${r.Query}`
    );
  });
}

async function cmdPages(days) {
  const siteUrl = await resolveSiteUrl();
  const data = await bing('GetPageStats', { siteUrl });
  if (!Array.isArray(data) || data.length === 0) {
    console.log('=== Top pages Bing ===');
    console.log('  (aucune donnée)');
    return;
  }
  const sorted = data.sort((a, b) => (b.Clicks || 0) - (a.Clicks || 0)).slice(0, 20);
  console.log(`=== Top 20 pages Bing (cumul ${days} derniers jours dispo) ===`);
  console.log('  clics  imp    pos    page');
  sorted.forEach(p => {
    const page = (p.Page || '').replace(/^https?:\/\/[^/]+/, '');
    console.log(
      `  ${fmt(p.Clicks || 0, 5)}  ${fmt(p.Impressions || 0, 5)}  ${fmt((p.AvgImpressionPosition || 0).toFixed(1), 5)}  ${page || '/'}`
    );
  });
}

async function cmdCrawl() {
  const siteUrl = await resolveSiteUrl();
  const data = await bing('GetCrawlStats', { siteUrl });
  if (!Array.isArray(data) || data.length === 0) {
    console.log('=== Stats crawl Bing ===');
    console.log('  (aucune donnée)');
    return;
  }
  // Stats totales sur la période disponible
  let total = 0, indexed = 0, errors = 0;
  data.forEach(d => {
    total   += d.CrawledPages       || 0;
    indexed += d.InIndex            || 0;
    errors  += (d.Anchor          || 0)
             + (d.ContentType     || 0)
             + (d.HttpError       || 0)
             + (d.InboundLinks    || 0)
             + (d.MalwareInfected || 0)
             + (d.Robots          || 0);
  });
  console.log(`=== Stats crawl Bing (site ${siteUrl}) ===`);
  console.log(`  Pages crawlées  : ${total}`);
  console.log(`  En index        : ${indexed}`);
  console.log(`  Erreurs cumulées: ${errors}`);
  console.log(`  Jours de data   : ${data.length}`);
}

async function cmdSitemaps() {
  const siteUrl = await resolveSiteUrl();
  const data = await bing('GetFeeds', { siteUrl });
  console.log(`=== Sitemaps soumis Bing (site ${siteUrl}) ===`);
  if (!Array.isArray(data) || data.length === 0) {
    console.log('  (aucun sitemap soumis)');
    return;
  }
  data.forEach(f => {
    console.log(`  ${f.Url}`);
    console.log(`    soumis le        : ${f.LastSubmitted || '-'}`);
    console.log(`    dernier crawl    : ${f.LastCrawled || '-'}`);
    console.log(`    URLs découvertes : ${f.UrlCount ?? '-'}`);
    console.log(`    statut           : ${f.Status || '-'}`);
    console.log('');
  });
}

async function cmdInspect(urlArg) {
  if (!urlArg) { console.error('Usage : inspect <url>'); process.exit(1); }
  const siteUrl = await resolveSiteUrl();
  const fullUrl = urlArg.startsWith('http')
    ? urlArg
    : (siteUrl.replace(/\/$/, '') + (urlArg.startsWith('/') ? urlArg : '/' + urlArg));
  const data = await bing('GetUrlInfo', { siteUrl, url: fullUrl });
  console.log(`=== Info indexation : ${fullUrl} ===`);
  if (data && Object.keys(data).length) {
    console.log('  Clics 30j     :', data.Clicks ?? '-');
    console.log('  Impressions   :', data.Impressions ?? '-');
    console.log('  Document URL  :', data.DocumentUrl || '-');
    console.log('  Dernier crawl :', data.LastCrawledDate || '-');
    console.log('  Anchor count  :', data.AnchorCount ?? '-');
    console.log('  Inlink count  :', data.InlinkCount ?? '-');
    console.log('  Total chiffres:', JSON.stringify(data).slice(0, 400));
  } else {
    console.log('  (URL inconnue de Bing — pas encore crawlée)');
  }
}

async function cmdSubmit(urlArg) {
  if (!urlArg) { console.error('Usage : submit <url>'); process.exit(1); }
  const siteUrl = await resolveSiteUrl();
  const fullUrl = urlArg.startsWith('http')
    ? urlArg
    : (siteUrl.replace(/\/$/, '') + (urlArg.startsWith('/') ? urlArg : '/' + urlArg));
  await bing('SubmitUrl', { siteUrl }, 'POST', { siteUrl, url: fullUrl });
  console.log(`✅ URL soumise à Bing pour crawl prioritaire : ${fullUrl}`);
  console.log('  Quota indexation Bing : 10 000 URLs/jour');
}

function help() {
  console.log('Usage :');
  console.log('  node scripts/bing-stats.js sites');
  console.log('  node scripts/bing-stats.js performance [28d|7d]');
  console.log('  node scripts/bing-stats.js daily       [28d]');
  console.log('  node scripts/bing-stats.js queries     [28d]');
  console.log('  node scripts/bing-stats.js pages       [28d]');
  console.log('  node scripts/bing-stats.js crawl');
  console.log('  node scripts/bing-stats.js sitemaps');
  console.log('  node scripts/bing-stats.js inspect     /guides/cabanon');
  console.log('  node scripts/bing-stats.js submit      /guides/xxx');
  console.log('');
  console.log('Propriété configurée : ' + (SITE_URL || '(auto via GetUserSites)'));
}

// ─── Main ──────────────────────────────────────────────────────────
(async () => {
  const [, , cmd, ...args] = process.argv;
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') return help();

  switch (cmd) {
    case 'sites':       return cmdSites();
    case 'performance': return cmdPerformance(parseDays(args[0]));
    case 'daily':       return cmdDaily(parseDays(args[0], 14));
    case 'queries':     return cmdQueries(parseDays(args[0]));
    case 'pages':       return cmdPages(parseDays(args[0]));
    case 'crawl':       return cmdCrawl();
    case 'sitemaps':    return cmdSitemaps();
    case 'inspect':     return cmdInspect(args[0]);
    case 'submit':      return cmdSubmit(args[0]);
    default:
      console.error('Commande inconnue : ' + cmd);
      help();
      process.exit(1);
  }
})().catch(e => {
  console.error('✗ ' + e.message);
  process.exit(1);
});
