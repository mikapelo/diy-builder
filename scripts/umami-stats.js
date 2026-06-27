#!/usr/bin/env node
/**
 * scripts/umami-stats.js — Lecture API Umami SELF-HOSTED pour DIY Builder
 *
 * Contexte : en juin 2026, Umami Cloud a déplacé sa REST API (clé `api_…`)
 * derrière le plan payant. L'API du dashboard de partage est closed-source
 * et refuse l'auth par header hors navigateur (401). → bascule self-host :
 * instance Umami v2 gratuite (Vercel + Postgres Neon), API documentée et stable.
 *
 * Auth self-host (stable, v2) :
 *   POST /api/auth/login {username,password} → { token }
 *   puis header `Authorization: Bearer <token>` sur chaque appel.
 *
 * Setup complet : voir .claude/setup/umami-selfhost.md
 *
 * .env.local (frontend/.env.local) :
 *   UMAMI_SELFHOST_URL=https://umami-diy.vercel.app     (sans / final)
 *   UMAMI_SELFHOST_USER=admin
 *   UMAMI_SELFHOST_PASSWORD=...
 *   UMAMI_SELFHOST_WEBSITE_ID=<uuid du site dans l'instance self-host>
 *
 * Usage :
 *   node scripts/umami-stats.js                  # aide
 *   node scripts/umami-stats.js stats [7d|28d]   # pages vues, visiteurs, sessions, rebond, durée
 *   node scripts/umami-stats.js pages [7d]        # top URLs
 *   node scripts/umami-stats.js referrers [7d]   # top référents
 *   node scripts/umami-stats.js events [7d]      # événements (artisan-modal-open, etc.)
 *   node scripts/umami-stats.js realtime         # visiteurs actifs maintenant
 *
 * Aucune dépendance npm — fetch natif Node.js.
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
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const URL_BASE = (env.UMAMI_SELFHOST_URL || '').replace(/\/$/, '');
const USER     = env.UMAMI_SELFHOST_USER;
const PASSWORD = env.UMAMI_SELFHOST_PASSWORD;
const WEBSITE  = env.UMAMI_SELFHOST_WEBSITE_ID;

if (!URL_BASE || !USER || !PASSWORD || !WEBSITE) {
  console.error('✗ Config self-host incomplète dans frontend/.env.local');
  console.error('  Requis : UMAMI_SELFHOST_URL, UMAMI_SELFHOST_USER, UMAMI_SELFHOST_PASSWORD, UMAMI_SELFHOST_WEBSITE_ID');
  console.error('  Setup  : .claude/setup/umami-selfhost.md');
  process.exit(1);
}

// ─── Helpers ───────────────────────────────────────────────────────
const TZ = 'Europe/Paris';
function dateNDaysAgo(n) { return Date.now() - n * 24 * 3600 * 1000; }
function parseDays(arg, fb = 7) {
  const m = (arg || '').match(/^(\d+)d$/);
  return m ? parseInt(m[1], 10) : fb;
}
function fmt(v, w) { return String(v).padStart(w); }
function secs(ms) {
  const s = Math.round(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}` : `${s}s`;
}

// ─── Auth → token ──────────────────────────────────────────────────
async function login() {
  const res = await fetch(URL_BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USER, password: PASSWORD }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Login échoué (HTTP ${res.status}) : ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  if (!data.token) throw new Error('Login OK mais pas de token : ' + JSON.stringify(data).slice(0, 200));
  return data.token;
}

async function api(token, endpoint, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${URL_BASE}/api/websites/${WEBSITE}/${endpoint}` + (qs ? `?${qs}` : '');
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' } });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API ${res.status} sur ${endpoint} : ${t.slice(0, 200)}`);
  }
  return res.json();
}

// ─── Commandes ─────────────────────────────────────────────────────
async function cmdStats(token, days) {
  const startAt = dateNDaysAgo(days), endAt = Date.now();
  const d = await api(token, 'stats', { startAt, endAt });
  const v = k => (d[k] && typeof d[k] === 'object' ? d[k].value : d[k]) || 0;
  const pv = v('pageviews'), vis = v('visitors'), ses = v('visits') || v('sessions');
  const bounces = v('bounces'), total = v('totaltime');
  const bounceRate = ses ? (bounces / ses * 100) : 0;
  const avg = ses ? secs(total / ses * 1000 / 1) : '0s';
  console.log(`=== Umami ${days} derniers jours (self-host) ===`);
  console.log(`  Pages vues   : ${pv}`);
  console.log(`  Visiteurs    : ${vis}`);
  console.log(`  Sessions     : ${ses}`);
  console.log(`  Taux rebond  : ${bounceRate.toFixed(1)} %`);
  console.log(`  Durée moy.   : ${avg}`);
}

async function cmdMetric(token, days, type, label) {
  const startAt = dateNDaysAgo(days), endAt = Date.now();
  const rows = await api(token, 'metrics', { startAt, endAt, type });
  console.log(`=== ${label} ${days} derniers jours ===`);
  if (!Array.isArray(rows) || !rows.length) { console.log('  (aucune donnée)'); return; }
  rows.slice(0, 20).forEach(r => console.log('  ' + fmt(r.y, 6) + '  ' + (r.x || '(direct)')));
}

async function cmdRealtime(token) {
  const rows = await api(token, 'active');
  const n = Array.isArray(rows) ? (rows[0]?.x ?? rows.length) : (rows?.x ?? 0);
  console.log(`=== Temps réel ===`);
  console.log(`  Visiteurs actifs : ${n}`);
}

function help() {
  console.log('Usage :');
  console.log('  node scripts/umami-stats.js stats     [7d|28d]');
  console.log('  node scripts/umami-stats.js pages     [7d]');
  console.log('  node scripts/umami-stats.js referrers [7d]');
  console.log('  node scripts/umami-stats.js events    [7d]');
  console.log('  node scripts/umami-stats.js realtime');
  console.log('');
  console.log('Instance : ' + URL_BASE);
  console.log('Setup    : .claude/setup/umami-selfhost.md');
}

// ─── Main ──────────────────────────────────────────────────────────
(async () => {
  const [, , cmd, ...args] = process.argv;
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') return help();

  const token = await login();
  switch (cmd) {
    case 'stats':     return cmdStats(token, parseDays(args[0]));
    // Umami v3 : le type metrics est 'path' (l'ancien 'url' renvoie HTTP 400 bad-request)
    case 'pages':     return cmdMetric(token, parseDays(args[0]), 'path', 'Top pages');
    case 'referrers': return cmdMetric(token, parseDays(args[0]), 'referrer', 'Top référents');
    case 'events':    return cmdMetric(token, parseDays(args[0]), 'event', 'Événements');
    case 'realtime':  return cmdRealtime(token);
    default:
      console.error('Commande inconnue : ' + cmd);
      help();
      process.exit(1);
  }
})().catch(e => {
  console.error('✗ ' + e.message);
  process.exit(1);
});
