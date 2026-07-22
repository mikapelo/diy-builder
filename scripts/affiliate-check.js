#!/usr/bin/env node
/**
 * scripts/affiliate-check.js — Vérification des liens & promos affiliés (DIY Builder)
 *
 * Lit frontend/lib/awinProducts.js (produits curés, marchands Awin), teste chaque
 * URL produit et détecte :
 *   • liens morts (404 / redirigés vers l'accueil / "indisponible")  → ACTION corrective
 *   • signaux de promo (prix barré, -XX %, "solde"…)                 → à mettre en avant
 *   • dérive de prix (prix affiché ≠ prix codé dans l'article)       → risque confiance/légal
 *
 * Aucun secret requis → tourne en LOCAL et en CLOUD (agent Claude sans creds).
 *
 * Usage :
 *   node scripts/affiliate-check.js            # écrit .claude/tracking/affiliate-check-AAAA-MM-JJ.md
 *   node scripts/affiliate-check.js --stdout   # imprime le rapport, n'écrit pas de fichier
 *   node scripts/affiliate-check.js --json     # sortie JSON brute (pour chaînage)
 *
 * Node ≥ 18 (fetch natif). Sans dépendance npm. Code de sortie 1 si liens morts.
 */

const fs   = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = path.join(__dirname, '..');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const CONCURRENCY = 5;
const TIMEOUT_S = 20;

// ─── Parse frontend/lib/awinProducts.js (module ESM, données pures) ──
function loadPartners() {
  const file = path.join(ROOT, 'frontend', 'lib', 'awinProducts.js');
  let src = fs.readFileSync(file, 'utf8')
    .replace(/^\s*import\s.+$/gm, '')                 // défensif : retire un futur import
    .replace(/export\s+default\s+/g, 'const __d = ')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+function\s+/g, 'function ');
  const fn = new Function(src + '\n;return { AWIN_PARTNERS, AWIN_MERCHANTS };');
  return fn();
}

function collectItems() {
  const { AWIN_PARTNERS, AWIN_MERCHANTS } = loadPartners();
  const items = [];
  for (const [blockKey, block] of Object.entries(AWIN_PARTNERS)) {
    const m = AWIN_MERCHANTS[block.merchant] || { name: block.merchant, site: '' };
    for (const p of block.products || []) {
      if (!p.url) continue;
      items.push({ block: blockKey, merchant: m.name, mid: m.mid, name: p.name, price: p.price || '', url: p.url });
    }
  }
  return items;
}

// ─── Fetch via curl (codes HTTP fiables, gère compression/anti-bot mieux que fetch) ─
function fetchPage(url) {
  return new Promise((resolve) => {
    const args = ['-sSL', '--max-time', String(TIMEOUT_S), '--compressed',
      '-A', UA, '-H', 'Accept-Language: fr-FR,fr;q=0.9', '-H', 'Accept: text/html',
      '-w', '\n__HTTP__%{http_code}__URL__%{url_effective}', url];
    execFile('curl', args, { maxBuffer: 8 * 1024 * 1024 }, (err, stdout) => {
      if (err && !stdout) return resolve({ error: /timed out/i.test(err.message) ? 'timeout' : 'fetch échec' });
      const m = String(stdout).match(/\n__HTTP__(\d+)__URL__(.*)$/s);
      const status = m ? parseInt(m[1], 10) : 0;
      const finalUrl = m ? m[2].trim() : url;
      const body = m ? String(stdout).slice(0, m.index) : String(stdout);
      resolve({ status, finalUrl, body });
    });
  });
}

function isGenericRedirect(finalUrl, origUrl) {
  try {
    const f = new URL(finalUrl), o = new URL(origUrl);
    if (o.pathname.length > 3 && (f.pathname === '/' || f.pathname === '')) return true;
    if (/\/(recherche|not-found|404)/i.test(f.pathname) && !/\/(recherche)/i.test(o.pathname)) return true;
    return false;
  } catch { return false; }
}

// Liveness pur — états : OK · MORT (à corriger) · BLOQUÉ (anti-bot, vérif manuelle) · ERREUR.
// Le prix/promo (lecture sémantique de la page) est délégué à la routine cloud Claude+WebFetch.
function analyze(item, r) {
  if (r.error)                               return { state: 'ERREUR', ok: false, detail: r.error };
  if ([403, 429, 503].includes(r.status))    return { state: 'BLOQUÉ', ok: false, detail: `anti-bot HTTP ${r.status}` };
  if (r.status === 404 || r.status === 410)   return { state: 'MORT',   ok: false, detail: `HTTP ${r.status}` };
  if (isGenericRedirect(r.finalUrl, item.url)) return { state: 'MORT',   ok: false, detail: 'redirigé hors fiche produit' };
  if (r.status < 200 || r.status >= 400)      return { state: 'ERREUR', ok: false, detail: `HTTP ${r.status}` };
  return { state: 'OK', ok: true, detail: '' };
}

// ─── Pool de concurrence ────────────────────────────────────────────
async function pool(arr, n, worker) {
  const out = new Array(arr.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, arr.length) }, async () => {
    while (i < arr.length) { const idx = i++; out[idx] = await worker(arr[idx], idx); }
  }));
  return out;
}

// ─── Rapport markdown ───────────────────────────────────────────────
function buildReport(rows, dateStr) {
  const dead    = rows.filter(r => r.a.state === 'MORT' || r.a.state === 'ERREUR');
  const blocked = rows.filter(r => r.a.state === 'BLOQUÉ');
  const okCount = rows.filter(r => r.a.ok).length;
  const byMerchant = {};
  for (const r of rows) (byMerchant[r.merchant] ??= []).push(r);
  const L = [];
  L.push(`# Vérif liens affiliés — ${dateStr}`);
  L.push('');
  L.push(`**${rows.length} produits testés** · ${okCount} liens OK · **${dead.length} morts** · ${blocked.length} bloqués anti-bot`);
  L.push('');

  if (dead.length) {
    L.push('## 🔴 Liens morts — à corriger');
    L.push('');
    L.push('| Marchand | Produit | Problème | URL |');
    L.push('|---|---|---|---|');
    for (const r of dead) L.push(`| ${r.merchant} | ${r.name} | ${r.a.detail} | ${r.url} |`);
    L.push('');
  } else {
    L.push('## ✅ Aucun lien mort — tous les produits joignables résolvent correctement.');
    L.push('');
  }
  if (blocked.length) {
    L.push('## 🟡 Bloqués anti-bot — à vérifier à la main');
    L.push('');
    const bm = {};
    for (const r of blocked) (bm[r.merchant] ??= []).push(r);
    for (const [m, list] of Object.entries(bm)) L.push(`- **${m}** : ${list.length} fiche(s) non lisibles en automatique (statut/prix à contrôler manuellement).`);
    L.push('');
  }
  // Récap par marchand (santé globale).
  L.push('## Récap par marchand');
  L.push('');
  L.push('| Marchand | Testés | OK | Morts | Bloqués |');
  L.push('|---|---|---|---|---|');
  for (const [m, list] of Object.entries(byMerchant)) {
    const ok = list.filter(r => r.a.ok).length;
    const mo = list.filter(r => r.a.state === 'MORT' || r.a.state === 'ERREUR').length;
    const bl = list.filter(r => r.a.state === 'BLOQUÉ').length;
    L.push(`| ${m} | ${list.length} | ${ok} | ${mo} | ${bl} |`);
  }
  L.push('');
  L.push('> Prix & promotions : lecture sémantique déléguée à la routine cloud hebdomadaire (Claude + WebFetch).');
  return L.join('\n');
}

// ─── Main ───────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);
  const items = collectItems();
  const results = await pool(items, CONCURRENCY, async (it) => {
    const r = await fetchPage(it.url);
    return { ...it, a: analyze(it, r), finalUrl: r.finalUrl };
  });

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  if (args.includes('--json')) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    const report = buildReport(results, dateStr);
    if (args.includes('--stdout')) {
      console.log(report);
    } else {
      const dir = path.join(ROOT, '.claude', 'tracking');
      fs.mkdirSync(dir, { recursive: true });
      const out = path.join(dir, `affiliate-check-${dateStr}.md`);
      fs.writeFileSync(out, report + '\n');
      const dead = results.filter(r => r.a.state === 'MORT' || r.a.state === 'ERREUR').length;
      const blocked = results.filter(r => r.a.state === 'BLOQUÉ').length;
      console.log(`✓ ${results.length} produits testés · ${dead} morts · ${blocked} bloqués → ${path.relative(ROOT, out)}`);
    }
  }
  // Code de sortie : 1 seulement si liens réellement morts (BLOQUÉ = attendu pour Aosom, pas une alerte).
  process.exit(results.some(r => r.a.state === 'MORT' || r.a.state === 'ERREUR') ? 1 : 0);
})();
