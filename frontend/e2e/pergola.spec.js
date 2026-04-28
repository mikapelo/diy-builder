/**
 * pergola.spec.js — Tests E2E du simulateur pergola
 *
 * Couvre :
 *   P1 — Chargement complet du simulateur sans erreur critique
 *   P2 — Contrôles spécifiques pergola visibles (dimensions, hauteur poteau)
 *   P3 — Matériaux pergola affichés (Structure, Quincaillerie)
 *   P4 — Bouton export PDF visible et réactif au clic
 */
import { test, expect } from '@playwright/test';

/** Attendre que le simulateur soit chargé */
async function waitForSimulator(page) {
  await page.locator('.simulator-container').waitFor({ state: 'visible', timeout: 20_000 });
}

/* ── P1 — Chargement simulateur pergola ─────────────────────── */

test('P1 — simulateur pergola charge sans erreur critique', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        text.includes('404') ||
        text.includes('THREE.') ||
        text.includes('Hydration') ||
        text.includes('WebGL') ||
        text.includes('WEBGL') ||
        text.includes('GPU') ||
        text.includes('Failed to load resource')
      ) return;
      errors.push(text);
    }
  });

  await page.goto('/pergola');
  await waitForSimulator(page);

  // Le panneau de contrôle est chargé
  await expect(page.getByRole('heading', { name: 'Dimensions' })).toBeVisible();

  // Les matériaux sont rendus
  await expect(page.getByRole('heading', { name: 'Matériaux' })).toBeVisible();

  // Pas d'erreur console critique
  expect(errors).toEqual([]);
});

/* ── P2 — Contrôles spécifiques pergola ─────────────────────── */

test('P2 — contrôles pergola : largeur, profondeur, hauteur poteau', async ({ page }) => {
  await page.goto('/pergola');
  await waitForSimulator(page);

  // Contrôles dimensions standard
  await expect(page.locator('.ctrl-label', { hasText: 'Largeur' }).first()).toBeVisible();
  await expect(page.locator('.ctrl-label', { hasText: 'Profondeur' }).first()).toBeVisible();

  // Contrôle spécifique pergola : Hauteur poteau
  await expect(page.locator('.ctrl-label', { hasText: /hauteur/i }).first()).toBeVisible();
});

/* ── P3 — Matériaux pergola affichés ────────────────────────── */

test('P3 — matériaux pergola : Structure et Quincaillerie', async ({ page }) => {
  await page.goto('/pergola');
  await waitForSimulator(page);

  // Les catégories matériaux pergola
  await expect(page.locator('.mat-group-title', { hasText: 'Structure' })).toBeVisible();
  await expect(page.locator('.mat-group-title', { hasText: 'Quincaillerie' })).toBeVisible();

  // Au moins un matériau affiché
  const matRows = page.locator('.mat-row');
  await expect(matRows.first()).toBeVisible();
  const count = await matRows.count();
  expect(count).toBeGreaterThanOrEqual(3); // poteaux, longerons, traverses minimum
});

/* ── P4 — Bouton export PDF visible ─────────────────────────── */

test('P4 — bouton export PDF visible et réactif au clic', async ({ page }) => {
  await page.goto('/pergola');
  await waitForSimulator(page);

  const pdfBtn = page.locator('.download-pdf');
  await expect(pdfBtn).toBeVisible();
  await expect(pdfBtn).toBeEnabled();

  // Cliquer sur le bouton (ne crash pas)
  await pdfBtn.click();
  await expect(pdfBtn).toBeVisible({ timeout: 5_000 });
});
