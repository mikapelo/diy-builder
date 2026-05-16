#!/usr/bin/env node
/**
 * capture-simulators.mjs — Captures Playwright des simulateurs 3D pour les guides éditoriaux.
 *
 * Usage :
 *   cd frontend
 *   node scripts/capture-simulators.mjs <module> [--port <port>]
 *
 * Exemples :
 *   node scripts/capture-simulators.mjs cabanon
 *   node scripts/capture-simulators.mjs cabanon --port 55651
 *
 * Output : public/images/guides/<module>/<nom>.png
 *
 * Pré-requis : dev server lancé (npm run dev) sur le port indiqué.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const MODULES = {
  cabanon: {
    url: '/cabanon',
    captures: [
      { mode: 'Assemblée', name: 'hero-assemble', target: 'canvas' },
      { mode: 'Détaillée', name: 'detaillee-voliges', target: 'canvas' },
      { mode: 'Plan',      name: 'plan-svg', target: 'svg' },
    ],
  },
  calculateur: {
    url: '/calculateur',
    captures: [
      { mode: 'Assemblée', name: 'hero-assemble', target: 'canvas' },
      { mode: 'Détaillée', name: 'detaillee', target: 'canvas' },
      { mode: 'Plan',      name: 'plan-svg', target: 'svg' },
    ],
  },
  pergola: {
    url: '/pergola',
    captures: [
      { mode: 'Assemblée', name: 'hero-assemble', target: 'canvas' },
      { mode: 'Détaillée', name: 'detaillee', target: 'canvas' },
      { mode: 'Plan',      name: 'plan-svg', target: 'svg' },
    ],
  },
  cloture: {
    url: '/cloture',
    captures: [
      { mode: 'Assemblée', name: 'hero-assemble', target: 'canvas' },
      { mode: 'Détaillée', name: 'detaillee', target: 'canvas' },
      { mode: 'Plan',      name: 'plan-svg', target: 'svg' },
    ],
  },
};

function parseArgs(argv) {
  const mod = argv[2];
  let port = 3000;
  const i = argv.indexOf('--port');
  if (i !== -1 && argv[i + 1]) port = parseInt(argv[i + 1], 10);
  return { mod, port };
}

async function captureModule(name, port) {
  const cfg = MODULES[name];
  if (!cfg) {
    console.error(`Unknown module "${name}". Available: ${Object.keys(MODULES).join(', ')}`);
    process.exit(1);
  }

  const outDir = path.join('public', 'images', 'guides', name);
  await mkdir(outDir, { recursive: true });

  const base = `http://localhost:${port}`;
  console.log(`→ Launching Chromium against ${base}${cfg.url}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  await page.goto(`${base}${cfg.url}`, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.locator('.simulator-layout').waitFor({ state: 'visible', timeout: 20_000 });
  await page.locator('canvas').first().waitFor({ state: 'visible', timeout: 20_000 });
  // Wait for 3D scene settle + auto-dismiss hint overlay (4s)
  await page.waitForTimeout(5000);

  for (const cap of cfg.captures) {
    console.log(`  • ${cap.mode} → ${cap.name}.png`);
    const tab = page.getByRole('tab', { name: cap.mode });
    if (await tab.count() === 0) {
      console.warn(`    skip: tab "${cap.mode}" not found`);
      continue;
    }
    await tab.click({ force: true });
    await page.waitForTimeout(2000);

    const selector = cap.target === 'svg'
      ? '.simulator-layout svg'
      : '.simulator-layout canvas';
    const el = page.locator(selector).first();
    if (await el.count() === 0) {
      console.warn(`    skip: ${selector} not found`);
      continue;
    }
    const filePath = path.join(outDir, `${cap.name}.png`);
    await el.screenshot({ path: filePath });
    console.log(`    saved ${filePath}`);
  }

  await browser.close();
  console.log(`✓ done — ${cfg.captures.length} captures for ${name}`);
}

const { mod, port } = parseArgs(process.argv);
if (!mod) {
  console.error('Usage: node scripts/capture-simulators.mjs <module> [--port <port>]');
  console.error(`Modules: ${Object.keys(MODULES).join(', ')}`);
  process.exit(1);
}

captureModule(mod, port).catch((e) => {
  console.error(e);
  process.exit(1);
});
