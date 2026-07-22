#!/usr/bin/env node
/**
 * scripts/weekly-digest.js — Digest de croissance hebdomadaire (DIY Builder)
 *
 * Orchestre les scripts de monitoring existants (GSC, Bing, Umami, Awin site-aware,
 * liveness liens affiliés), calcule les deltas semaine/semaine à partir d'un historique
 * versionné, détecte des opportunités SEO/monétisation par règles, écrit un digest
 * markdown dans .claude/tracking/ et l'envoie par e-mail si RESEND_API_KEY est présent.
 *
 * LOCAL uniquement (a besoin des creds de frontend/.env.local + gcloud ADC pour GSC).
 *
 * Usage :
 *   node scripts/weekly-digest.js            # écrit le digest + historise + e-mail si possible
 *   node scripts/weekly-digest.js --stdout   # imprime, n'écrit ni n'historise ni n'envoie
 *   node scripts/weekly-digest.js --no-email  # écrit + historise mais n'envoie pas
 *
 * Node ≥ 18. Sans dépendance npm.
 */

const fs   = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const TRACK_DIR = path.join(ROOT, '.claude', 'tracking');
const HISTORY = path.join(TRACK_DIR, 'history.jsonl');
const EMAIL_TO = 'sans.mikael33000@gmail.com';
const EMAIL_FROM = 'DIY Builder <contact@diy-builder.fr>';

// ─── .env.local (pour RESEND_API_KEY) ───────────────────────────────
function loadEnv() {
  const p = path.join(ROOT, 'frontend', '.env.local');
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(fs.readFileSync(p, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; }));
}

// ─── Exécute un script de stats, renvoie son stdout (ou '' si échec) ──
function run(script, args) {
  try {
    return execFileSync('node', [path.join('scripts', script), ...args], { cwd: ROOT, encoding: 'utf8', timeout: 120000, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    return (e.stdout || '') + `\n[echec ${script} ${args.join(' ')}]`;
  }
}

const num = (txt, re) => { const m = txt.match(re); return m ? parseFloat(m[1].replace(',', '.')) : null; };
const int = (txt, re) => { const m = txt.match(re); return m ? parseInt(m[1], 10) : null; };

// Parse les lignes de tableau GSC "clics imp CTR% pos label"
function parseRows(txt) {
  const rows = [];
  for (const line of txt.split('\n')) {
    const m = line.match(/^\s*(\d+)\s+(\d+)\s+([\d.]+)%\s+([\d.]+)\s+(.+?)\s*$/);
    if (m) rows.push({ clics: +m[1], imp: +m[2], ctr: +m[3], pos: +m[4], label: m[5].trim() });
  }
  return rows;
}
// Parse les événements Umami "  34  module-selected"
function parseEvents(txt) {
  const ev = {};
  for (const line of txt.split('\n')) { const m = line.match(/^\s*(\d+)\s+([a-z0-9-]+)\s*$/i); if (m) ev[m[2]] = +m[1]; }
  return ev;
}

// ─── Collecte ───────────────────────────────────────────────────────
function collect() {
  const gsc7  = run('gsc-stats.js', ['performance', '7d']);
  const gsc28 = run('gsc-stats.js', ['performance', '28d']);
  const gscQ  = run('gsc-stats.js', ['queries', '28d']);
  const gscP  = run('gsc-stats.js', ['pages', '28d']);
  const um7   = run('umami-stats.js', ['stats', '7d']);
  const umEv  = run('umami-stats.js', ['events', '28d']);
  const awin  = run('awin-stats.js', ['performance', '30d']);   // site-aware : DIY Builder seul
  const bing  = run('bing-stats.js', ['performance', '7d']);
  const aff   = run('affiliate-check.js', ['--stdout']);

  const events = parseEvents(umEv);
  return {
    date: new Date().toISOString().slice(0, 10),
    gsc7:  { clics: int(gsc7, /Clics\s*:\s*(\d+)/), imp: int(gsc7, /Impressions\s*:\s*(\d+)/), ctr: num(gsc7, /CTR\s*:\s*([\d.]+)/), pos: num(gsc7, /Position\s*:\s*([\d.]+)/) },
    gsc28: { clics: int(gsc28, /Clics\s*:\s*(\d+)/), imp: int(gsc28, /Impressions\s*:\s*(\d+)/), ctr: num(gsc28, /CTR\s*:\s*([\d.]+)/), pos: num(gsc28, /Position\s*:\s*([\d.]+)/) },
    umami7: { visiteurs: int(um7, /Visiteurs\s*:\s*(\d+)/), vues: int(um7, /Pages vues\s*:\s*(\d+)/), sessions: int(um7, /Sessions\s*:\s*(\d+)/), rebond: num(um7, /rebond\s*:\s*([\d.]+)/i) },
    bing7: { clics: int(bing, /Clics\s*:\s*(\d+)/), imp: int(bing, /Impressions\s*:\s*(\d+)/) },
    awinClics: int(awin, /Total\s*:\s*(\d+)\s*clics/),
    events,
    _raw: { gscQ, gscP, awin, aff },
  };
}

// ─── Deltas ─────────────────────────────────────────────────────────
function delta(cur, prev) {
  if (cur == null || prev == null) return '';
  const d = +(cur - prev).toFixed(cur % 1 || prev % 1 ? 1 : 0);
  if (d === 0) return ' (=)';
  const sign = d > 0 ? '+' : '';
  return ` (${sign}${d})`;
}

// ─── Opportunités (règles) ──────────────────────────────────────────
function opportunities(snap) {
  const out = [];
  const queries = parseRows(snap._raw.gscQ);
  const pages   = parseRows(snap._raw.gscP);

  // Striking distance : requêtes pos 8–20, imp ≥ 20 → un petit push peut faire gagner des rangs.
  const striking = queries.filter(q => q.pos >= 8 && q.pos <= 20 && q.imp >= 20)
    .sort((a, b) => b.imp - a.imp).slice(0, 6);
  if (striking.length) out.push({ t: '🎯 Requêtes en approche (pos 8–20, impressions réelles) — à pousser',
    rows: striking.map(q => `\`${q.label}\` — pos ${q.pos}, ${q.imp} imp, ${q.clics} clic(s)`) });

  // CTR faible sur pages à fortes impressions → retravailler title/meta.
  const lowCtr = pages.filter(p => p.imp >= 300 && p.ctr < 2.5)
    .sort((a, b) => b.imp - a.imp).slice(0, 5);
  if (lowCtr.length) out.push({ t: '✍️ Pages à fort volume mais CTR faible — retravailler title/meta',
    rows: lowCtr.map(p => `${p.label} — ${p.imp} imp, CTR ${p.ctr}%, pos ${p.pos}`) });

  // Funnel artisan : 0 interaction = signal CRO fort.
  const funnel = (snap.events['devis-click'] || 0) + (snap.events['artisan-modal-open'] || 0) + (snap.events['lead-submitted'] || 0);
  if (funnel === 0) out.push({ t: '🚨 Funnel artisan : 0 interaction sur 28 j',
    rows: ['Aucun `devis-click` / `artisan-modal-open` / `lead-submitted`. Le lead pro est le plus haut levier de valeur — problème d\'exposition/CRO, pas de tracking.'] });

  // Monétisation : marchands intégrés sans clic → bloc peut-être invisible/cassé.
  const awinTxt = snap._raw.awin;
  for (const m of ['Aosom', 'Woodstore', 'Plots', 'Deuba']) {
    if (!new RegExp(m, 'i').test(awinTxt)) out.push({ t: `🔌 Marchand « ${m} » : 0 clic Awin sur 30 j`, rows: ['Vérifier que le bloc affilié est bien rendu et visible sur les pages concernées.'] });
  }
  return out;
}

// ─── Digest markdown ────────────────────────────────────────────────
function buildDigest(snap, prev) {
  const L = [];
  const p = prev || {};
  L.push(`# 📊 Digest de croissance — ${snap.date}`);
  L.push('');
  L.push(prev ? `Comparaison vs semaine du ${p.date}.` : '_Première mesure — pas encore de comparaison (baseline)._');
  L.push('');

  L.push('## SEO (Google Search Console)');
  L.push('');
  L.push(`- **7 j** : ${snap.gsc7.clics} clics${delta(snap.gsc7.clics, p.gsc7?.clics)} · ${snap.gsc7.imp} imp · CTR ${snap.gsc7.ctr}% · pos ${snap.gsc7.pos}`);
  L.push(`- **28 j** : ${snap.gsc28.clics} clics${delta(snap.gsc28.clics, p.gsc28?.clics)} · ${snap.gsc28.imp} imp · CTR ${snap.gsc28.ctr}% · pos ${snap.gsc28.pos}`);
  L.push(`- **Bing 7 j** : ${snap.bing7.clics} clics · ${snap.bing7.imp} imp`);
  L.push('');

  L.push('## Trafic (Umami)');
  L.push('');
  L.push(`- **7 j** : ${snap.umami7.visiteurs} visiteurs${delta(snap.umami7.visiteurs, p.umami7?.visiteurs)} · ${snap.umami7.vues} vues · rebond ${snap.umami7.rebond}%${delta(snap.umami7.rebond, p.umami7?.rebond)}`);
  L.push('');

  L.push('## Monétisation');
  L.push('');
  L.push(`- **Awin (DIY Builder seul, 30 j)** : ${snap.awinClics ?? '—'} clics · ventes affiliées : voir routine cloud`);
  const ev = snap.events;
  L.push(`- **Engagement 28 j** : ${ev['awin-click'] || 0} awin-click · ${ev['affiliate-click'] || 0} affiliate-click (Amazon) · ${ev['pdf-export'] || 0} export PDF · ${ev['simulation-start'] || 0} simulations`);
  L.push(`- **Funnel artisan 28 j** : ${(ev['artisan-modal-open'] || 0)} ouverture(s) modale · ${(ev['lead-submitted'] || 0)} lead(s)`);
  L.push('');

  const opps = opportunities(snap);
  if (opps.length) {
    L.push('## 💡 Opportunités & alertes (propositions — aucune action auto)');
    L.push('');
    for (const o of opps) { L.push(`### ${o.t}`); L.push(''); for (const r of o.rows) L.push(`- ${r}`); L.push(''); }
  }

  // Liens affiliés : reprise du récap liveness.
  const affSummary = (snap._raw.aff.match(/\*\*.*produits testés.*/) || [''])[0];
  L.push('## Liens affiliés (liveness)');
  L.push('');
  L.push(affSummary ? affSummary.replace(/\*\*/g, '') : '_check indisponible_');
  L.push('_Détail liens morts/bloqués : `.claude/tracking/affiliate-check-*.md`. Prix & promos : routine cloud hebdo._');
  L.push('');
  return L.join('\n');
}

// ─── E-mail via Resend ──────────────────────────────────────────────
async function sendEmail(env, subject, markdown) {
  if (!env.RESEND_API_KEY) return { sent: false, reason: 'RESEND_API_KEY absent de .env.local' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: EMAIL_FROM, to: EMAIL_TO, subject, text: markdown,
        html: `<pre style="font:13px/1.5 ui-monospace,Menlo,monospace;white-space:pre-wrap">${markdown.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre>` }),
    });
    if (!res.ok) return { sent: false, reason: `Resend ${res.status}: ${(await res.text()).slice(0, 120)}` };
    return { sent: true };
  } catch (e) { return { sent: false, reason: e.message }; }
}

// ─── Main ───────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);
  const env = loadEnv();
  const snap = collect();

  let prev = null;
  if (fs.existsSync(HISTORY)) {
    const lines = fs.readFileSync(HISTORY, 'utf8').trim().split('\n').filter(Boolean);
    if (lines.length) try { prev = JSON.parse(lines[lines.length - 1]); } catch {}
  }

  const digest = buildDigest(snap, prev);

  if (args.includes('--stdout')) { console.log(digest); process.exit(0); }

  fs.mkdirSync(TRACK_DIR, { recursive: true });
  const out = path.join(TRACK_DIR, `digest-${snap.date}.md`);
  fs.writeFileSync(out, digest + '\n');
  // Historise un snapshot allégé (sans _raw) pour les deltas futurs.
  const { _raw, ...lite } = snap;
  fs.appendFileSync(HISTORY, JSON.stringify(lite) + '\n');

  let mailNote = 'e-mail désactivé (--no-email)';
  if (!args.includes('--no-email')) {
    const r = await sendEmail(env, `📊 Digest DIY Builder — ${snap.date}`, digest);
    mailNote = r.sent ? `e-mail envoyé à ${EMAIL_TO}` : `e-mail NON envoyé (${r.reason})`;
  }
  console.log(`✓ digest → ${path.relative(ROOT, out)} · historique mis à jour · ${mailNote}`);
})();
