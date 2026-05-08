/**
 * api-go.test.js — buildStoreUrl
 *
 * Couvre :
 *   - Stores connus : leroymerlin, castorama, bricodepot, manomano
 *   - Store inconnu → fallback Google
 *   - UTM params toujours présents
 *   - Le project est encodé dans utm_campaign
 */
import { describe, it, expect } from 'vitest';
import { buildStoreUrl } from '@/app/api/go/route.js';

describe('buildStoreUrl', () => {
  it('Leroy Merlin — endpoint /search?q= avec UTM', () => {
    const url = buildStoreUrl('leroymerlin', 'lame%20terrasse', 'terrasse');
    expect(url).toContain('https://www.leroymerlin.fr/search?q=lame%20terrasse');
    expect(url).toContain('utm_source=diy-builder');
    expect(url).toContain('utm_medium=referral');
    expect(url).toContain('utm_campaign=terrasse');
  });

  it('Castorama — endpoint /search?term=', () => {
    const url = buildStoreUrl('castorama', 'bois', 'pergola');
    expect(url).toContain('https://www.castorama.fr/search?term=bois');
    expect(url).toContain('utm_campaign=pergola');
  });

  it('Brico Dépôt — page accueil (search JS-driven)', () => {
    const url = buildStoreUrl('bricodepot', 'lame', 'cloture');
    expect(url).toContain('https://www.bricodepot.fr/');
    expect(url).toContain('utm_campaign=cloture');
    // BD ne propage pas le terme `q` dans l'URL — confirmé
    expect(url).not.toContain('q=lame');
  });

  it('Brico Dépôt — alias avec tiret aussi accepté', () => {
    const url = buildStoreUrl('brico-depot', 'lame', 'cloture');
    expect(url).toContain('bricodepot.fr');
  });

  it('ManoMano — endpoint /search?q=', () => {
    const url = buildStoreUrl('manomano', 'pergola', 'pergola');
    expect(url).toContain('https://www.manomano.fr/search?q=pergola');
    expect(url).toContain('utm_campaign=pergola');
  });

  it('Store inconnu → fallback Google', () => {
    const url = buildStoreUrl('unknown-store', 'foo', 'bar');
    expect(url).toContain('google.com/search');
    expect(url).toContain('q=foo');
  });

  it('Caractères spéciaux dans project → encodés dans utm_campaign', () => {
    const url = buildStoreUrl('leroymerlin', 'q', 'projet&malicieux');
    expect(url).toContain('utm_campaign=projet%26malicieux');
  });
});
