/**
 * cabanon.spec.js — Tests E2E du simulateur cabanon
 *
 * Couvre :
 *   C1 — Chargement avec contrôles spécifiques cabanon (Hauteur + Fenêtre)
 *   C2 — Onglets de mode existent + bascule vers Plan (SVG, sans WebGL)
 *   C3 — Bouton export PDF visible et réactif au clic
 */
import { test, expect } from '@playwright/test';

/** Attendre que le simulateur soit chargé */
async function waitForSimulator(page) {
  await page.locator('.simulator-container').waitFor({ state: 'visible', timeout: 20_000 });
}

/* ── C1 — Chargement simulateur cabanon ──────────────────────── */

test('C1 — simulateur cabanon charge avec contrôles Hauteur et Fenêtre', async ({ page }) => {
  await page.goto('/cabanon');
  await waitForSimulator(page);

  // Contrôles dimensions standard
  await expect(page.getByRole('heading', { name: 'Dimensions' })).toBeVisible();
  await expect(page.locator('.ctrl-label', { hasText: 'Largeur' }).first()).toBeVisible();
  await expect(page.locator('.ctrl-label', { hasText: 'Profondeur' }).first()).toBeVisible();

  // Contrôles spécifiques cabanon (absents en mode terrasse)
  await expect(page.locator('.ctrl-label', { hasText: 'Hauteur' }).first()).toBeVisible();
  await expect(page.locator('.ctrl-label', { hasText: 'Fenêtre' }).first()).toBeVisible();

  // Matériaux cabanon : sections spécifiques
  await expect(page.locator('.mat-group-title', { hasText: 'Ossature' })).toBeVisible();
  await expect(page.locator('.mat-group-title', { hasText: 'Toiture' })).toBeVisible();
  await expect(page.locator('.mat-group-title', { hasText: 'Quincaillerie' })).toBeVisible();
});

/* ── C2 — Onglets de mode + bascule vers Plan ─────────────── */

test('C2 — onglets de mode existent et bascule vers Plan fonctionne', async ({ page }) => {
  await page.goto('/cabanon');
  await waitForSimulator(page);

  // Attendre que le viewer dynamique charge (mode tabs apparaissent)
  const tabPlan = page.locator('.mode-tab', { hasText: 'Plan' });

  // Attendre que les onglets de mode soient visibles (le viewer dynamique peut prendre du temps)
  await expect(tabPlan).toBeVisible({ timeout: 20_000 });

  // Vérifier que les 3 modes cabanon sont présents
  await expect(page.locator('.mode-tab', { hasText: 'Assemblée' })).toBeVisible();
  await expect(page.locator('.mode-tab', { hasText: 'Détaillée' })).toBeVisible();

  // Mode initial : Assemblée actif
  await expect(page.locator('.mode-tab', { hasText: 'Assemblée' })).toHaveClass(/active/);

  // --- Basculer vers Plan (SVG, pas de WebGL → pas de crash) ---
  await tabPlan.click();
  await expect(tabPlan).toHaveClass(/active/, { timeout: 5_000 });

  // En mode Plan, le hint mentionne "façade technique"
  await expect(page.locator('.deck-viewer-hint', { hasText: /façade technique/i })).toBeVisible();
});

/* ── C3 — Bouton export PDF visible et cliquable ─────────────── */

test('C3 — bouton export PDF visible et réactif au clic', async ({ page }) => {
  await page.goto('/cabanon');
  await waitForSimulator(page);

  // Le bouton PDF est visible
  const pdfBtn = page.locator('.download-pdf');
  await expect(pdfBtn).toBeVisible();
  await expect(pdfBtn).toContainText('Télécharger la liste PDF');
  await expect(pdfBtn).toBeEnabled();

  // Cliquer sur le bouton
  await pdfBtn.click();

  // Le bouton reste dans le DOM (pas de crash) et revient à idle
  await expect(pdfBtn).toBeVisible({ timeout: 5_000 });
  await expect(pdfBtn).toContainText('Télécharger la liste PDF', { timeout: 15_000 });
});
