'use client';

/**
 * BomAffiliateBlock.jsx — « Le matériel de votre projet » (bloc affilié aligné-BOM)
 *
 * Met en avant les MATÉRIAUX du chantier (ceux que le simulateur chiffre) plutôt
 * qu'un produit fini — correction du décalage d'intention côté affiliation.
 *
 * Données : lib/bomAffiliate.js. Les lignes `awin` référencent un produit curé
 * de awinProducts.js (source unique, pas d'URL dupliquée) ; les lignes `amazon`
 * sont des liens de recherche (consommables). rel="sponsored" partout.
 *
 * placement : 'guide' | 'sim' — pour l'attribution (clickref Awin + subtag Amazon).
 */

import Link from 'next/link';
import { AWIN_PARTNERS, AWIN_MERCHANTS, buildAwinUrl } from '@/lib/awinProducts';
import { buildAmazonUrl } from '@/lib/projectTools';
import { trackAwinClick } from '@/hooks/useAnalytics';
import { BOM_AFFILIATE } from '@/lib/bomAffiliate';

function ArrowExternal() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* Résout le lien d'une ligne : produit Awin curé (référencé) ou recherche Amazon. */
function resolveLine(line, module, placement) {
  if (line.amazon) {
    return { href: buildAmazonUrl(line.amazon, null, `${module}-bom-${placement}`), merchant: 'Amazon', awin: false };
  }
  const block = AWIN_PARTNERS[line.awin?.block];
  const product = block?.products?.[line.awin?.index ?? 0];
  const merchant = AWIN_MERCHANTS[block?.merchant];
  if (!product || !merchant) return null;
  return {
    href: buildAwinUrl(product.url, merchant.mid, `${module}-bom-${placement}`),
    merchant: merchant.name,
    product: product.name,
    awin: true,
  };
}

export default function BomAffiliateBlock({ module, placement = 'guide' }) {
  const kit = BOM_AFFILIATE[module];
  if (!kit?.lines?.length) return null;

  return (
    <section className="guide-tools bom-kit" aria-label={`Le matériel pour ce projet — ${kit.title}`}>
      <div className="guide-tools-head">
        <p className="guide-tools-eyebrow">Le matériel du chantier</p>
        <h3 className="guide-tools-title">{kit.title}</h3>
        <p className="guide-tools-sub">{kit.subtitle}</p>
      </div>

      <div className="bom-kit-rows">
        {kit.lines.map((line, i) => {
          const r = resolveLine(line, module, placement);
          if (!r) return null;
          return (
            <a
              key={i}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bom-kit-row"
              aria-label={`${line.label} — voir sur ${r.merchant}`}
              onClick={r.awin ? () => trackAwinClick({ merchant: r.merchant, module, product: line.label, placement }) : undefined}
            >
              <span className="bom-kit-icon material-symbols-outlined" aria-hidden="true">{line.icon}</span>
              <span className="bom-kit-text">
                <span className="bom-kit-label">{line.label}</span>
                <span className="bom-kit-sub">{line.sub}</span>
              </span>
              <span className="bom-kit-cta">Voir<ArrowExternal /></span>
            </a>
          );
        })}
      </div>

      <p className="guide-tools-note guide-tools-note--mini">
        Liens affiliés (Awin · Amazon) · matériel indicatif d&rsquo;un projet type ·{' '}
        <Link href="/charte-affiliation">charte</Link>
      </p>
    </section>
  );
}
