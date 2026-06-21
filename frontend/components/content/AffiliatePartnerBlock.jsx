'use client';

/**
 * AffiliatePartnerBlock.jsx — Bloc produits partenaire Awin (Aosom, Plots discount)
 *
 * Distinct du bloc outils Amazon (GuideToolsBlock) : poids visuel secondaire,
 * cadrage explicite par variante :
 *   - 'alternative' (Aosom) : produit fini prêt à poser, PAS un matériau du build
 *   - 'complement'  (Plots) : matériau que le simulateur calcule déjà
 *
 * Données : getAwinPartner(module) depuis lib/awinProducts.js (4 produits curés).
 * Liens : buildAwinUrl() format Awin cread.php, rel="sponsored".
 * Tracking : trackAwinClick (event Umami awin-click) + clickref d'attribution Awin.
 *
 * placement : 'guide' | 'sim' — distingue les clics guide vs page de résultat.
 */

import { useState } from 'react';
import Link from 'next/link';
import { getAwinPartner, buildAwinUrl, AWIN_SNAPSHOT_DATE } from '@/lib/awinProducts';
import { trackAwinClick } from '@/hooks/useAnalytics';

/* Icône de repli par module si l'image marchand ne charge pas */
const FALLBACK_ICON = { pergola: 'pergola', terrasse: 'deck', cloture: 'fence', carport: 'solar_power' };

/* ── Flèche externe (même tracé que le bloc outils, cohérence) ── */
function ArrowExternal() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ── Étoiles SVG : remplissage proportionnel à rating/5 (classes partagées) ── */
function Stars({ value }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="amazon-stars" aria-hidden="true">
      <span className="amazon-stars-bg">★★★★★</span>
      <span className="amazon-stars-fg" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}

/* ── Visuel produit marchand (CDN externe) avec repli sur icône ── */
function PartnerVisual({ img, name, icon }) {
  const [failed, setFailed] = useState(false);
  if (img && !failed) {
    return (
      <div className="guide-tool-visual guide-tool-visual--image">
        {/* eslint-disable-next-line @next/next/no-img-element -- CDN marchand externe, repli onError */}
        <img src={img} alt={name} loading="lazy" onError={() => setFailed(true)} className="guide-tool-img" />
      </div>
    );
  }
  return (
    <div className="guide-tool-visual guide-tool-visual--icon">
      <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
    </div>
  );
}

/* ── Carte produit partenaire ── */
function ProductCard({ product, merchant, module, clickref, cta, icon }) {
  const href = buildAwinUrl(product.url, merchant.mid, clickref);
  const rating = product.rating ? Number(product.rating) : null;
  return (
    <div className="guide-tool-card">
      <PartnerVisual img={product.img} name={product.name} icon={icon} />
      <div className="guide-tool-body">
        <span className="guide-tool-name">{product.name}</span>
        {rating != null && (
          <span className="amazon-rating amazon-rating--compact" title={`Note ${product.rating}/5 (relevé ${AWIN_SNAPSHOT_DATE})`}>
            <Stars value={rating} />
            <span className="amazon-rating-value">{rating.toFixed(1)}</span>
          </span>
        )}
        <div className="guide-tool-foot">
          <span className="guide-tool-price">
            {product.price}&nbsp;€{product.priceSuffix && <span className="guide-tool-price-suffix"> {product.priceSuffix}</span>}
          </span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="guide-tool-cta"
            aria-label={`${cta} : ${product.name}`}
            onClick={() => trackAwinClick({ merchant: merchant.name, module, product: product.name })}
          >
            {cta}
            <ArrowExternal />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AffiliatePartnerBlock({ module, placement = 'guide' }) {
  const partner = getAwinPartner(module);
  if (!partner?.products?.length) return null;

  const { merchantInfo, products, variant, eyebrow, title, subtitle, cta } = partner;
  const clickref = `${module}-${variant}-${placement}`;
  const icon = FALLBACK_ICON[module] || 'shopping_bag';

  return (
    <section className={`guide-tools guide-tools--partner guide-tools--${variant}`} aria-label={`Produits partenaires — ${merchantInfo.name}`}>
      <div className="guide-tools-head">
        <p className="guide-tools-eyebrow guide-tools-eyebrow--partner">{eyebrow}</p>
        <h3 className="guide-tools-title">{title}</h3>
        <p className="guide-tools-sub">{subtitle}</p>
      </div>

      <div className="guide-tools-grid">
        {products.map((product) => (
          <ProductCard
            key={product.url}
            product={product}
            merchant={merchantInfo}
            module={module}
            clickref={clickref}
            cta={cta}
            icon={icon}
          />
        ))}
      </div>

      <p className="guide-tools-note">
        Liens affiliés Awin (marchand&nbsp;{merchantInfo.name})&nbsp;: un achat via ces liens peut nous
        rémunérer, sans surcoût pour vous. Sélection éditoriale indépendante — prix indicatifs relevés
        le&nbsp;{AWIN_SNAPSHOT_DATE}.{' '}
        <Link href="/charte-affiliation">Notre charte</Link>.
      </p>
    </section>
  );
}
