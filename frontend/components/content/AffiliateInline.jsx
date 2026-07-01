'use client';

/**
 * AffiliateInline.jsx — Lien affilié Awin inline, marqué « lien partenaire ».
 *
 * Touchpoint en milieu d'article (le bloc complet AffiliatePartnerBlock reste
 * plus bas) : capte le clic avant que le lecteur ne quitte la page. Le marchand
 * est le même que le bloc du module (getAwinPartner), attribution via un clickref
 * dédié `${module}-inline` + event Umami awin-click placement:'inline' pour
 * distinguer ce touchpoint du bloc en pied de section.
 *
 * Marquage publicitaire obligatoire (loi 2023-451, DGCCRF) : rel="sponsored"
 * pour les moteurs + « (lien partenaire) » visible pour le lecteur.
 *
 * Usage : <AffiliateInline module="pergola">des modèles prêts à poser</AffiliateInline>
 */

import { getAwinPartner, buildAwinUrl } from '@/lib/awinProducts';
import { trackAwinClick } from '@/hooks/useAnalytics';

export default function AffiliateInline({ module, productIndex = 0, children }) {
  const partner = getAwinPartner(module);
  const product = partner?.products?.[productIndex];
  const href = product ? buildAwinUrl(product.url, partner.merchantInfo.mid, `${module}-inline`) : null;
  if (!href) return null;

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="content-link"
        onClick={() => trackAwinClick({ merchant: partner.merchantInfo.name, module, product: product.name, placement: 'inline' })}
      >
        {children}
      </a>
      <span className="aff-inline-tag">&nbsp;(lien partenaire)</span>
    </>
  );
}
