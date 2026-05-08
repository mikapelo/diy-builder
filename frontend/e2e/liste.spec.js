/**
 * liste.spec.js — Tests E2E de la page /liste (BOM partageable)
 *
 * Couvre :
 *   L1 — /liste?project=terrasse&w=4&d=3 charge avec table BOM + 4 enseignes
 *   L2 — Caption sr-only + th[scope=col] présents (a11y)
 *   L3 — Liens /api/go présents avec aria-label complet
 *   L4 — Multi-modules : cabanon, pergola, cloture rendent aussi
 */
import { test, expect } from '@playwright/test';

const ENSEIGNES = ['Leroy Merlin', 'Castorama', 'Brico Dépôt', 'ManoMano'];

/* ── L1 — Page /liste terrasse 4×3 ───────────────────────────── */

test('L1 — /liste terrasse 4×3 affiche table BOM + 4 enseignes', async ({ page }) => {
  await page.goto('/liste?project=terrasse&w=4&d=3', { waitUntil: 'domcontentloaded' });

  // H1 contient les dimensions
  const h1 = page.locator('h1');
  await expect(h1).toContainText('Terrasse bois');
  await expect(h1).toContainText('4');
  await expect(h1).toContainText('3');

  // 4 cartes enseigne avec totaux €
  for (const enseigne of ENSEIGNES) {
    await expect(page.locator(`text=${enseigne}`).first()).toBeVisible();
  }

  // Au moins quelques lignes de matériaux (lames, lambourdes, plots)
  const tbody = page.locator('tbody');
  await expect(tbody).toBeVisible();
  const rowCount = await tbody.locator('tr').count();
  expect(rowCount).toBeGreaterThanOrEqual(4);
});

/* ── L2 — Accessibilité table ────────────────────────────────── */

test('L2 — table BOM accessible : caption sr-only + th[scope=col]', async ({ page }) => {
  await page.goto('/liste?project=terrasse&w=4&d=3', { waitUntil: 'domcontentloaded' });

  // Caption présent (visuellement caché mais lisible par lecteurs d'écran)
  const caption = page.locator('table caption');
  await expect(caption).toHaveCount(1);
  const captionText = await caption.textContent();
  expect(captionText).toContain('Terrasse');
  expect(captionText).toContain('matériaux');

  // 6 th avec scope="col"
  const ths = page.locator('th[scope="col"]');
  await expect(ths).toHaveCount(6);
});

/* ── L3 — Liens affiliés avec aria-label ─────────────────────── */

test('L3 — liens enseigne avec aria-label complet', async ({ page }) => {
  await page.goto('/liste?project=terrasse&w=4&d=3', { waitUntil: 'domcontentloaded' });
  // Au moins un lien avec aria-label "Chercher ... chez Leroy Merlin"
  const lmLinks = page.locator('a[aria-label*="Leroy Merlin"]');
  expect(await lmLinks.count()).toBeGreaterThanOrEqual(1);
  // L'href contient /api/go
  const href = await lmLinks.first().getAttribute('href');
  expect(href).toContain('/api/go');
  expect(href).toContain('store=leroymerlin');
});

/* ── L4 — Multi-modules ──────────────────────────────────────── */

test('L4 — /liste rend aussi cabanon, pergola, cloture', async ({ page }) => {
  for (const project of ['cabanon', 'pergola', 'cloture']) {
    await page.goto(`/liste?project=${project}&w=3&d=4`, { waitUntil: 'domcontentloaded' });
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const tbody = page.locator('tbody');
    await expect(tbody).toBeVisible();
    expect(await tbody.locator('tr').count()).toBeGreaterThanOrEqual(2);
  }
});
