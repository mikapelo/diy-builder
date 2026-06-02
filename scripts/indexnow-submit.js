#!/usr/bin/env node
/**
 * scripts/indexnow-submit.js — Soumission instantanée d'URLs à IndexNow
 *
 * IndexNow est un protocole open de notification de mise à jour d'URL
 * pour les moteurs de recherche. Compatibles : Bing, Yandex, Seznam,
 * Naver. ⚠️ PAS Google (qui a son propre Indexing API, quota 10/jour).
 *
 * Avantage clé : quota Bing 10 000 URLs/jour via IndexNow (vs lecture
 * passive seule via crawl naturel). Particulièrement utile après un
 * gros refactor SEO (ex: fix /liste GSC du 2026-06-01).
 *
 * Auth : pas d'OAuth. Une clé hex (32-128 chars) qui doit aussi être
 * hébergée publiquement à https://<host>/<key>.txt (avec la valeur
 * de la clé en plain text). C'est le "shared secret" prouvant que
 * l'éditeur du site est bien celui qui soumet les URLs.
 *
 * Setup (une fois) :
 *   1. openssl rand -hex 16
 *   2. echo -n "<key>" > frontend/public/<key>.txt
 *   3. Ajouter `INDEXNOW_KEY=<key>` dans frontend/.env.local
 *   4. Pousser sur Vercel (le fichier .txt devient public)
 *   5. Tester : curl https://www.diy-builder.fr/<key>.txt → doit retourner la clé
 *
 * Usage :
 *   node scripts/indexnow-submit.js <url> [url2 ...]
 *     Soumet 1 à 10 URLs (max 10 000/jour côté quota Bing)
 *
 *   node scripts/indexnow-submit.js --sitemap
 *     Lit https://www.diy-builder.fr/sitemap.xml et soumet toutes les URLs
 *
 *   node scripts/indexnow-submit.js --test
 *     Vérifie que la clé est bien servie publiquement
 *
 * Aucune dépendance npm — fetch natif Node.js.
 *
 * Doc : https://www.indexnow.org/documentation
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

if (!env.INDEXNOW_KEY) {
  console.error('✗ INDEXNOW_KEY manquante dans .env.local');
  console.error('  Générer : openssl rand -hex 16');
  console.error('  Puis créer frontend/public/<key>.txt avec la clé en contenu');
  process.exit(1);
}

const KEY  = env.INDEXNOW_KEY;
const HOST = 'www.diy-builder.fr';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

// ─── Helpers ──────────────────────────────────────────────────────
function normalizeUrl(u) {
  if (u.startsWith('http')) return u;
  if (u.startsWith('/')) return `https://${HOST}${u}`;
  return `https://${HOST}/${u}`;
}

async function checkKeyHosted() {
  console.log(`\n→ Vérification que la clé est servie publiquement…`);
  console.log(`  ${KEY_LOCATION}`);
  try {
    const res = await fetch(KEY_LOCATION);
    if (!res.ok) {
      console.error(`✗ HTTP ${res.status} — la clé n'est pas servie publiquement`);
      console.error(`  Vérifier que frontend/public/${KEY}.txt existe et que le site est déployé`);
      return false;
    }
    const body = (await res.text()).trim();
    if (body !== KEY) {
      console.error(`✗ Le contenu du fichier ne matche pas la clé`);
      console.error(`  Attendu : ${KEY}`);
      console.error(`  Reçu    : ${body.slice(0, 60)}...`);
      return false;
    }
    console.log(`✅ Clé servie correctement (${body.length} chars)`);
    return true;
  } catch (e) {
    console.error(`✗ Erreur réseau : ${e.message}`);
    return false;
  }
}

async function submitUrls(urls) {
  if (!urls.length) {
    console.error('✗ Aucune URL à soumettre');
    process.exit(1);
  }
  if (urls.length > 10000) {
    console.error(`✗ Trop d'URLs (${urls.length} > 10 000 quota Bing/jour)`);
    process.exit(1);
  }
  const normalized = urls.map(normalizeUrl);
  console.log(`\n→ Soumission de ${normalized.length} URL(s) à IndexNow…`);
  normalized.slice(0, 10).forEach(u => console.log(`  • ${u}`));
  if (normalized.length > 10) console.log(`  …et ${normalized.length - 10} de plus`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: normalized,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  const status = res.status;
  const text = await res.text().catch(() => '');

  console.log(`\n← Réponse API : HTTP ${status}`);
  if (status === 200) {
    console.log(`✅ URL(s) acceptée(s) et traitée(s) immédiatement par IndexNow`);
    console.log(`   Bing, Yandex, Seznam, Naver vont re-crawler dans les minutes/heures à venir.`);
  } else if (status === 202) {
    console.log(`✅ URL(s) acceptée(s) — en cours de traitement asynchrone`);
  } else if (status === 400) {
    console.error(`✗ Bad request — vérifier le format des URLs`);
    console.error(`  Body : ${text.slice(0, 300)}`);
  } else if (status === 403) {
    console.error(`✗ Forbidden — la clé n'est pas servie publiquement OU clé invalide`);
    console.error(`  Vérifier : ${KEY_LOCATION}`);
  } else if (status === 422) {
    console.error(`✗ Unprocessable — URLs invalides ou doublons`);
    console.error(`  Body : ${text.slice(0, 300)}`);
  } else if (status === 429) {
    console.error(`✗ Rate limit dépassé — réessayer plus tard`);
  } else {
    console.error(`✗ Erreur inattendue : HTTP ${status}`);
    console.error(`  Body : ${text.slice(0, 300)}`);
  }
}

async function loadFromSitemap() {
  const sitemapUrl = `https://${HOST}/sitemap.xml`;
  console.log(`\n→ Lecture du sitemap : ${sitemapUrl}`);
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    console.error(`✗ Sitemap inaccessible : HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
  console.log(`  ${urls.length} URLs extraites`);
  return urls;
}

// ─── Main ──────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage :
  node scripts/indexnow-submit.js <url> [url2 ...]    Soumet 1+ URLs
  node scripts/indexnow-submit.js --sitemap           Soumet toutes les URLs du sitemap
  node scripts/indexnow-submit.js --test              Vérifie que la clé est servie

Exemples :
  node scripts/indexnow-submit.js /guides/cabanon
  node scripts/indexnow-submit.js /guides/pergola /guides/cloture
  node scripts/indexnow-submit.js https://www.diy-builder.fr/guides/pergola-panneaux-solaires-diy-2026
  node scripts/indexnow-submit.js --sitemap

Quota : 10 000 URLs / jour (Bing).
Clé   : exposée publiquement à ${KEY_LOCATION}
`);
    process.exit(0);
  }

  if (args[0] === '--test') {
    const ok = await checkKeyHosted();
    process.exit(ok ? 0 : 1);
  }

  let urls;
  if (args[0] === '--sitemap') {
    urls = await loadFromSitemap();
  } else {
    urls = args;
  }

  // Vérif clé hébergée avant soumission (sauf si on est déjà sûr)
  if (!process.env.SKIP_KEY_CHECK) {
    const ok = await checkKeyHosted();
    if (!ok) {
      console.error(`\n✗ Soumission annulée (clé non servie publiquement)`);
      console.error(`  Pour bypasser : SKIP_KEY_CHECK=1 node scripts/indexnow-submit.js ...`);
      process.exit(1);
    }
  }

  await submitUrls(urls);
})().catch(e => {
  console.error('✗ Erreur :', e.message);
  process.exit(1);
});
