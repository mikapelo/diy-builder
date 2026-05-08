/**
 * api-go.spec.js — Tests E2E pour /api/go (redirecteur affilié)
 *
 * Couvre :
 *   API1 — Store inconnu → redirige Google fallback
 *   API2 — Leroy Merlin → URL search?q= avec UTM
 *   API3 — Castorama → URL search?term= avec UTM
 *   API4 — Brico Dépôt → page accueil bricodepot.fr (search JS-driven)
 *   API5 — ManoMano → URL search?q= avec UTM
 *   API6 — UTM campaign reflète le projet
 */
import { test, expect } from '@playwright/test';

/* Helper : extraire la location finale après redirect */
async function getFinalUrl(page, path) {
  // followRedirects=false sur fetch() — on capture le 301 directement
  const res = await page.request.get(path, { maxRedirects: 0 });
  return {
    status: res.status(),
    location: res.headers().location,
  };
}

test('API1 — store inconnu redirige Google fallback', async ({ page }) => {
  const { status, location } = await getFinalUrl(page, '/api/go?store=unknown&project=test&q=foo');
  expect(status).toBe(301);
  expect(location).toContain('google.com/search');
  expect(location).toContain('q=foo');
});

test('API2 — Leroy Merlin redirige /search?q= avec UTM', async ({ page }) => {
  const { status, location } = await getFinalUrl(page, '/api/go?store=leroymerlin&project=terrasse&q=lame');
  expect(status).toBe(301);
  expect(location).toContain('leroymerlin.fr/search?q=lame');
  expect(location).toContain('utm_source=diy-builder');
  expect(location).toContain('utm_campaign=terrasse');
});

test('API3 — Castorama redirige /search?term=', async ({ page }) => {
  const { location } = await getFinalUrl(page, '/api/go?store=castorama&project=cabanon&q=bois');
  expect(location).toContain('castorama.fr/search?term=bois');
  expect(location).toContain('utm_campaign=cabanon');
});

test('API4 — Brico Dépôt redirige page accueil bricodepot.fr', async ({ page }) => {
  const { location } = await getFinalUrl(page, '/api/go?store=bricodepot&project=cloture&q=lame');
  expect(location).toContain('bricodepot.fr/');
  expect(location).toContain('utm_campaign=cloture');
  // BD ne propage pas q dans l'URL
  expect(location).not.toContain('q=lame');
});

test('API5 — ManoMano redirige /search?q=', async ({ page }) => {
  const { location } = await getFinalUrl(page, '/api/go?store=manomano&project=pergola&q=poteau');
  expect(location).toContain('manomano.fr/search?q=poteau');
  expect(location).toContain('utm_campaign=pergola');
});

test('API6 — q absent → terme par défaut du projet utilisé', async ({ page }) => {
  const { location } = await getFinalUrl(page, '/api/go?store=leroymerlin&project=terrasse');
  expect(location).toContain('leroymerlin.fr/search?q=');
  // Le terme par défaut terrasse contient "lame terrasse"
  expect(location).toContain('lame');
});
