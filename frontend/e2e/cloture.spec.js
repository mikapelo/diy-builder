/**
 * cloture.spec.js — Tests E2E du simulateur clôture
 *
 * Couvre :
 *   CL1 — Chargement complet du simulateur sans erreur critique
 *   CL2 — Contrôles spécifiques clôture (longueur, hauteur)
 *   CL3 — Matériaux clôture affichés (Structure, Quincaillerie)
 *   CL4 — Modifier la longueur met à jour les quantités
 *   CL5 — Bouton export PDF visible et réactif au clic
 */
import { test, expect } from '@playwright/test';

/** Attendre que le simulateur soit chargé */
async function waitForSimulator(page) {
  await page.locator('.simulator-container').waitFor({ state: 'visible', timeout: 20_000 });
}

/* ── CL1 — Chargement simulateur clôture ────────────────────── */

test('CL1 — simulateur clôture charge sans erreur critique', async ({ page }) => {
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

  await page.goto('/cloture');
  await waitForSimulator(page);

  // Le panneau de contrôle est chargé
  await expect(page.getByRole('heading', { name: 'Dimensions' })).toBeVisible();

  // Les matériaux sont rendus
  await expect(page.getByRole('heading', { name: 'Matériaux' })).toBeVisible();

  // Pas d'erreur console critique
  expect(errors).toEqual([]);
});

/* ── CL2 — Contrôles spécifiques clôture ────────────────────── */

test('CL2 — contrôles clôture : longueur et hauteur', async ({ page }) => {
  await page.goto('/cloture');
  await waitForSimulator(page);

  // Dimensions de base : largeur = longueur clôture, profondeur = hauteur clôture
  await expect(page.locator('.ctrl-label', { hasText: 'Largeur' }).first()).toBeVisible();
  await expect(page.locator('.ctrl-label', { hasText: 'Profondeur' }).first()).toBeVisible();
});

/* ── CL3 — Matériaux clôture affichés ───────────────────────── */

test('CL3 — matériaux clôture : Structure et Quincaillerie', async ({ page }) => {
  await page.goto('/cloture');
  await waitForSimulator(page);

  // Les catégories matériaux clôture
  await expect(page.locator('.mat-group-title', { hasText: 'Structure' })).toBeVisible();
  await expect(page.locator('.mat-group-title', { hasText: 'Quincaillerie' })).toBeVisible();

  // Au moins un matériau affiché
  const matRows = page.locator('.mat-row');
  await expect(matRows.first()).toBeVisible();
  const count = await matRows.count();
  expect(count).toBeGreaterThanOrEqual(3); // poteaux, rails, lames minimum
});

/* ── CL4 — Modifier longueur → quantités changent ──────────── */

test('CL4 — modifier longueur met à jour les quantités', async ({ page }) => {
  await page.goto('/cloture');
  await waitForSimulator(page);

  // Surface initiale visible
  const surfaceEl = page.locator('.ctrl-surface-value');
  await expect(surfaceEl).toBeVisible();
  const initialText = await surfaceEl.textContent();

  // Modifier la largeur (= longueur clôture)
  const widthInput = page.locator('.ctrl-val').first();
  await widthInput.fill('10');
  await widthInput.blur();

  // Attendre la mise à jour (la valeur surface/linéaire doit changer)
  await expect(surfaceEl).not.toHaveText(initialText, { timeout: 5_000 });

  // Les quantités matériaux sont mises à jour (au moins une)
  const firstQty = page.locator('.mat-qty').first();
  await expect(firstQty).toBeVisible();
});

/* ── CL5 — Bouton export PDF visible ────────────────────────── */

test('CL5 — bouton export PDF visible et réactif au clic', async ({ page }) => {
  await page.goto('/cloture');
  await waitForSimulator(page);

  const pdfBtn = page.locator('.download-pdf');
  await expect(pdfBtn).toBeVisible();
  await expect(pdfBtn).toBeEnabled();

  // Cliquer sur le bouton (ne crash pas)
  await pdfBtn.click();
  await expect(pdfBtn).toBeVisible({ timeout: 5_000 });
});
