import { describe, it, expect } from 'vitest';
import {
  buildAwinUrl,
  getAwinPartner,
  hasAwinPartner,
  fitsAwinPartnerArea,
  AWIN_MERCHANTS,
  AWIN_PARTNERS,
  AWIN_SNAPSHOT_DATE,
} from '@/lib/awinProducts';

describe('buildAwinUrl', () => {
  const dest = 'https://www.aosom.fr/item/outsunny-pergola~1S83LUJJQ0000.html';

  it('construit un deep-link cread.php avec awinmid + awinaffid éditeur', () => {
    const url = buildAwinUrl(dest, '19184', 'pergola-alternative-sim');
    expect(url).toContain('https://www.awin1.com/cread.php?');
    expect(url).toContain('awinmid=19184');
    expect(url).toContain('awinaffid=2934749');
  });

  it('encode l’URL marchand dans ued', () => {
    const url = buildAwinUrl(dest, '19184', 'ref');
    expect(url).toContain('ued=https%3A%2F%2Fwww.aosom.fr');
    // le ~ (caractère non réservé) reste littéral
    expect(url).toContain('~1S83LUJJQ0000.html');
  });

  it('intègre le clickref d’attribution', () => {
    const url = buildAwinUrl(dest, '109434', 'terrasse-complement-guide');
    expect(url).toContain('clickref=terrasse-complement-guide');
  });

  it('retourne null si dest ou mid manquant', () => {
    expect(buildAwinUrl('', '19184', 'r')).toBeNull();
    expect(buildAwinUrl(dest, '', 'r')).toBeNull();
    expect(buildAwinUrl(null, null, 'r')).toBeNull();
  });

  it('fonctionne sans clickref', () => {
    const url = buildAwinUrl(dest, '19184');
    expect(url).toContain('awinmid=19184');
    expect(url).not.toContain('clickref=');
  });
});

describe('getAwinPartner / hasAwinPartner', () => {
  it('résout pergola (Aosom) et terrasse (Plots) avec merchantInfo', () => {
    const pergola = getAwinPartner('pergola');
    expect(pergola.merchant).toBe('aosom');
    expect(pergola.merchantInfo.mid).toBe('19184');
    expect(pergola.variant).toBe('alternative');

    const terrasse = getAwinPartner('terrasse');
    expect(terrasse.merchant).toBe('plots');
    expect(terrasse.merchantInfo.mid).toBe('109434');
    expect(terrasse.variant).toBe('complement');
  });

  it('résout cabanon (Aosom) avec plafond de surface', () => {
    const cab = getAwinPartner('cabanon');
    expect(cab.merchant).toBe('aosom');
    expect(cab.merchantInfo.mid).toBe('19184');
    expect(cab.simMaxArea).toBe(6);
  });

  it('retourne null pour un module sans partenaire', () => {
    expect(getAwinPartner('cloture')).toBeNull();
    expect(getAwinPartner('dalle')).toBeNull();
    expect(getAwinPartner('inconnu')).toBeNull();
  });

  it('hasAwinPartner est un prédicat cohérent', () => {
    expect(hasAwinPartner('pergola')).toBe(true);
    expect(hasAwinPartner('terrasse')).toBe(true);
    expect(hasAwinPartner('cabanon')).toBe(true);
    expect(hasAwinPartner('cloture')).toBe(false);
    expect(hasAwinPartner('dalle')).toBe(false);
  });

  it('fitsAwinPartnerArea : pas de plafond pergola/terrasse, gate cabanon ≤ 6 m²', () => {
    expect(fitsAwinPartnerArea('pergola', 999)).toBe(true);
    expect(fitsAwinPartnerArea('terrasse', 999)).toBe(true);
    expect(fitsAwinPartnerArea('cabanon', 5)).toBe(true);
    expect(fitsAwinPartnerArea('cabanon', 6)).toBe(true);
    expect(fitsAwinPartnerArea('cabanon', 16)).toBe(false);
    expect(fitsAwinPartnerArea('cabanon', undefined)).toBe(false);
    expect(fitsAwinPartnerArea('cloture', 2)).toBe(false);
  });
});

describe('intégrité des données partenaires', () => {
  it('chaque marchand de partenaire existe dans AWIN_MERCHANTS', () => {
    for (const partner of Object.values(AWIN_PARTNERS)) {
      expect(AWIN_MERCHANTS[partner.merchant]).toBeTruthy();
    }
  });

  it('chaque produit a nom, prix, URL https et image https', () => {
    for (const partner of Object.values(AWIN_PARTNERS)) {
      expect(partner.products.length).toBeGreaterThan(0);
      for (const p of partner.products) {
        expect(typeof p.name).toBe('string');
        expect(p.name.length).toBeGreaterThan(3);
        expect(p.price).toMatch(/^\d+,\d{2}$/);
        expect(p.url).toMatch(/^https:\/\//);
        expect(p.img).toMatch(/^https:\/\//);
      }
    }
  });

  it('les URLs produit pointent vers le bon domaine marchand', () => {
    for (const p of AWIN_PARTNERS.pergola.products) {
      expect(p.url).toContain('aosom.fr');
    }
    for (const p of AWIN_PARTNERS.cabanon.products) {
      expect(p.url).toContain('aosom.fr');
    }
    for (const p of AWIN_PARTNERS.terrasse.products) {
      expect(p.url).toContain('plots-discount.com');
    }
  });

  it('expose une date de snapshot ISO', () => {
    expect(AWIN_SNAPSHOT_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
