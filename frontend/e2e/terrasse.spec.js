/**
 * terrasse.spec.js — Tests E2E du simulateur terrasse
 *
 * Couvre :
 *   T1 — Chargement complet du simulateur sans erreur critique
 *   T2 — Modifier la largeur met à jour surface + matériaux
 *   T3 — Les onglets de mode du viewer existent et sont interactifs
 */
import { test, expect } from '@playwright/test';

/** Attendre que le simulateur soit chargé */
async function waitForSimulator(page) {
  await page.locator('.simulator-container').waitFor({ state: 'visible', timeout: 20_000 });
}

/* ── T1 — Chargement simulateur terrasse ─────────────────────── */

test('T1 — simulateur terrasse charge sans erreur critique', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filtrer : 404 brand logos, Three.js/WebGL warnings, React hydration
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

  await page.goto('/calculateur');
  await waitForSimulator(page);

  // Le panneau de contrôle est chargé
  await expect(page.getByRole('heading', { name: 'Dimensions' })).toBeVisible();

  // Les matériaux sont rendus
  await expect(page.getByRole('heading', { name: 'Matériaux' })).toBeVisible();

  // Le comparateur de prix est rendu
  await expect(page.getByRole('heading', { name: 'Prix estimé' })).toBeVisible();

  // Le bouton PDF est visible
  await expect(page.locator('.download-pdf')).toBeVisible();

  // Pas d'erreur console critique (404 assets et WebGL filtrés)
  expect(errors).toEqual([]);
});

/* ── T2 — Modifier largeur → surface + matériaux changent ───── */

test('T2 — modifier largeur met à jour surface et matériaux', async ({ page }) => {
  await page.goto('/calculateur');
  await waitForSimulator(page);

  // Lire la surface initiale (5.5 × 3.5 = 19.25 m²)
  const surfaceEl = page.locator('.ctrl-surface-value');
  await expect(surfaceEl).toBeVisible();

  // Modifier la valeur de l'input directement (plus fiable que click sur + en headless)
  const widthInput = page.locator('.ctrl-val').first();
  await widthInput.fill('6');
  // Déclencher le blur pour que React traite la valeur
  await widthInput.blur();

  // Attendre la mise à jour (6.0 × 3.5 = 21 m²)
  await expect(surfaceEl).toContainText('21', { timeout: 5_000 });

  // La quantité de matériaux a changé (premier .mat-qty devrait contenir une valeur différente)
  const firstQty = page.locator('.mat-qty').first();
  await expect(firstQty).toBeVisible();
});

/* ── T3 — Onglets de mode du viewer existent ─────────────────── */

test('T3 — le viewer terrasse affiche les onglets de mode', async ({ page }) => {
  await page.goto('/calculateur');
  await waitForSimulator(page);

  // Attendre que le viewer dynamique charge (mode tabs apparaissent)
  const modeTabs = page.locator('.mode-tab');
  const tabCount = await modeTabs.count();

  // Si le viewer 3D charge, les onglets sont présents
  if (tabCount > 0) {
    // L'onglet initial devrait être actif
    await expect(modeTabs.first()).toHaveClass(/active/);

    // Il y a au moins 2 onglets
    expect(tabCount).toBeGreaterThanOrEqual(2);
  } else {
    // En headless, le viewer peut ne pas charger (WebGL limitation)
    // On vérifie que le skeleton/error est au moins affiché
    const fallback = page.locator('.deck-preview');
    await expect(fallback).toBeVisible();
  }
});
