#!/usr/bin/env node
/**
 * scripts/awin-stats.js — Lecture API Awin Publisher pour DIY Builder
 *
 * Auth : token OAuth2 (Bearer). Account Awin > API credentials.
 * Aucune dépendance npm — uniquement fetch natif Node.js (≥ 18).
 *
 * Setup :
 *   1. https://ui.awin.com → Account > API credentials → générer un token
 *   2. Ajouter dans frontend/.env.local :
 *        AWIN_API_TOKEN=...
 *      (AWIN_PUBLISHER_ID optionnel — auto-détecté via /accounts sinon)
 *
 * Usage :
 *   node scripts/awin-stats.js                          # aide
 *   node scripts/awin-stats.js accounts                 # compte(s) accessibles
 *   node scripts/awin-stats.js programmes [joined|pending|rejected]  # marchands (déf. joined)
 *   node scripts/awin-stats.js commission <mid>         # groupes de commission d'un marchand
 *   node scripts/awin-stats.js transactions [30d]       # transactions récentes (commission)
 *   node scripts/awin-stats.js performance [30d]        # clics + conversions + € par marchand
 *
 * Quota API Awin : 100 requêtes / minute (publisher).
 * Doc : https://wiki.awin.com/index.php/Publisher_API
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

if (!env.AWIN_API_TOKEN) {
  console.error('✗ AWIN_API_TOKEN manquant dans frontend/.env.local');
  console.error('  Générer sur https://ui.awin.com → Account > API credentials');
  process.exit(1);
}

const TOKEN    = env.AWIN_API_TOKEN;
const API_BASE = 'https://api.awin.com';

// Marchands intégrés au site (lib/awinProducts.js) — mis en évidence dans `programmes`.
const OURS = { '19184': 'Aosom', '109434': 'Plots discount', '57469': 'Woodstore24' };

// ─── Helpers ───────────────────────────────────────────────────────
const pad  = (v, w) => String(v).padEnd(w);
const padL = (v, w) => String(v).padStart(w);
const eur  = (v) => (v == null ? '—' : Number(v).toFixed(2) + ' €');

function dateNDaysAgo(n) {
  return new Date(Date.now() - n * 24 * 3600 * 1000).toISOString().split('T')[0];
}
function parseDays(arg, fb = 30) {
  const m = (arg || '').match(/^(\d+)d$/);
  return m ? parseInt(m[1], 10) : fb;
}

async function awin(endpoint, params = {}) {
  const qs  = new URLSearchParams(params).toString();
  const url = `${API_BASE}${endpoint}${qs ? '?' + qs : ''}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} sur ${endpoint} : ${text.slice(0, 300)}`);
  }
  return res.json();
}

// publisherId : env explicite, sinon premier compte publisher de /accounts.
let PUBLISHER_ID = env.AWIN_PUBLISHER_ID || null;
async function resolvePublisherId() {
  if (PUBLISHER_ID) return PUBLISHER_ID;
  const data = await awin('/accounts', { type: 'publisher' });
  const acc  = (data.accounts || []).find(a => a.accountType === 'publisher');
  if (!acc) throw new Error('Aucun compte publisher trouvé sur ce token.');
  PUBLISHER_ID = String(acc.accountId);
  return PUBLISHER_ID;
}

// ─── Commandes ─────────────────────────────────────────────────────
async function cmdAccounts() {
  const data = await awin('/accounts');
  console.log(`userId : ${data.userId}`);
  for (const a of data.accounts || []) {
    console.log(`  ${padL(a.accountId, 8)}  ${pad(a.accountType, 10)}  ${a.accountName}  (${a.userRole})`);
  }
}

async function cmdProgrammes(rel = 'joined') {
  const pid  = await resolvePublisherId();
  const list = await awin(`/publishers/${pid}/programmes`, { relationship: rel });
  console.log(`\nMarchands (${rel}) — éditeur ${pid} : ${list.length}\n`);
  console.log(`  ${pad('mid', 8)} ${pad('marchand', 34)} ${pad('région', 8)} statut`);
  console.log('  ' + '─'.repeat(64));
  for (const p of list) {
    const mid  = String(p.id);
    const mine = OURS[mid] ? ' ◀ intégré' : '';
    const reg  = p.primaryRegion?.countryCode || '—';
    console.log(`  ${pad(mid, 8)} ${pad((p.name || '').slice(0, 33), 34)} ${pad(reg, 8)} ${p.status || rel}${mine}`);
  }
  const integrated = list.filter(p => OURS[String(p.id)]).map(p => p.id);
  console.log(`\n  Intégrés présents ici : ${integrated.length ? integrated.join(', ') : 'aucun'}`);
}

async function cmdCommission(mid) {
  if (!mid) { console.error('✗ usage : commission <mid>'); process.exit(1); }
  const pid  = await resolvePublisherId();
  const data = await awin(`/publishers/${pid}/programmedetails`, { advertiserId: mid });
  const info = data.programmeInfo || {};
  const kpi  = data.kpi || {};
  console.log(`\n${info.name || mid} (mid ${mid}) — ${info.currencyCode || ''} · ${info.membershipStatus || ''} · lien ${info.linkStatus || '—'}`);
  const ranges = (data.commissionRange || []).map(c =>
    c.type === 'percentage'
      ? `${c.min === c.max ? c.min : c.min + '–' + c.max} %`
      : `${eur(c.min)}${c.min !== c.max ? '–' + eur(c.max) : ''}`
  );
  console.log(`  commission : ${ranges.join(', ') || '—'}`);
  console.log(`  validation : ${kpi.validationDays != null ? kpi.validationDays + ' j' : '—'}   `
    + `EPC : ${kpi.epc != null ? eur(kpi.epc) : '—'}   `
    + `conversion : ${kpi.conversionRate != null ? kpi.conversionRate + ' %' : '—'}   `
    + `approbation : ${kpi.approvalPercentage != null ? kpi.approvalPercentage + ' %' : '—'}`);
}

async function cmdTransactions(arg) {
  const pid = await resolvePublisherId();
  const days = parseDays(arg, 30);
  const params = {
    startDate: `${dateNDaysAgo(days)}T00:00:00`,
    endDate:   `${dateNDaysAgo(0)}T23:59:59`,
    timezone:  'Europe/Paris',
    dateType:  'transaction',
  };
  const list = await awin(`/publishers/${pid}/transactions/`, params);
  console.log(`\nTransactions (${days} j) : ${list.length}`);
  let pend = 0, conf = 0;
  for (const t of list) {
    const c = Number(t.commissionAmount?.amount ?? t.commissionAmount ?? 0);
    if (t.commissionStatus === 'confirmed') conf += c; else pend += c;
    console.log(`  ${pad(t.transactionDate?.slice(0, 10) || '', 11)} mid ${pad(t.advertiserId, 7)} ${pad(t.commissionStatus, 10)} ${eur(c)}`);
  }
  console.log(`\n  Confirmé : ${eur(conf)}   En attente : ${eur(pend)}`);
}

async function cmdPerformance(arg) {
  const pid    = await resolvePublisherId();
  const days   = parseDays(arg, 30);
  const region = env.AWIN_REGION || 'FR';
  const list = await awin(`/publishers/${pid}/reports/advertiser`, {
    startDate: dateNDaysAgo(days), endDate: dateNDaysAgo(0), region, timezone: 'Europe/Paris',
  });
  console.log(`\nPerformance (${days} j, région ${region}) — éditeur ${pid}\n`);
  if (!list.length) {
    console.log('  (aucun clic ni conversion sur la période — intégration récente)');
    return;
  }
  console.log(`  ${pad('marchand', 24)} ${padL('clics', 7)} ${padL('ventes', 7)} ${padL('confirmé', 12)} ${padL('attente', 12)}`);
  console.log('  ' + '─'.repeat(66));
  let tc = 0;
  for (const r of list) {
    tc += r.clicks || 0;
    console.log(`  ${pad((r.advertiserName || r.advertiserId).slice(0, 23), 24)} ${padL(r.clicks || 0, 7)} ${padL((r.pendingNo || 0) + (r.confirmedNo || 0), 7)} ${padL(eur(r.confirmedValue), 12)} ${padL(eur(r.pendingValue), 12)}`);
  }
  console.log(`\n  Total clics : ${tc}`);
}

function help() {
  console.log(`awin-stats — API Awin Publisher (DIY Builder)

  node scripts/awin-stats.js accounts
  node scripts/awin-stats.js programmes [joined|pending|rejected]
  node scripts/awin-stats.js commission <mid>
  node scripts/awin-stats.js transactions [30d]
  node scripts/awin-stats.js performance [30d]
`);
}

// ─── Dispatch ──────────────────────────────────────────────────────
(async () => {
  const [cmd, arg] = process.argv.slice(2);
  try {
    switch (cmd) {
      case 'accounts':     await cmdAccounts(); break;
      case 'programmes':   await cmdProgrammes(arg); break;
      case 'commission':   await cmdCommission(arg); break;
      case 'transactions': await cmdTransactions(arg); break;
      case 'performance':  await cmdPerformance(arg); break;
      default:             help();
    }
  } catch (e) {
    console.error('✗ ' + e.message);
    process.exit(1);
  }
})();
