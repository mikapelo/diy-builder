'use client';

/**
 * BudgetComparator.jsx — Bloc fusionné : budget + comparatif enseignes
 *
 * Répond à la question : « Combien ça coûte, et où acheter au mieux ? »
 *
 * Structure :
 *   1. Header section
 *   2. Partie haute : 3 niveaux budget (éco / recommandé / premium)
 *   3. Partie basse : 3 enseignes (cartes comparatives)
 *   4. Disclaimer
 *
 * Fusionne l'ancien BudgetOverview + PriceComparator en un seul bloc.
 */

import { useMemo } from 'react';
import { calculateDetailedCost, calculateTotalCost } from '@/lib/costCalculator.js';
import { useLivePrices, isPricesCacheStale } from '@/hooks/useLivePrices.js';
import { trackOutboundClick, trackAffiliateClick } from '@/hooks/useAnalytics.js';

/** Formate un entier en notation française (espace fine comme séparateur milliers).
 *  Déterministe — même résultat sur serveur Node et client Chrome. */
const fmtEur = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');

/* ── Budget tiers ── */
const TIERS = [
  { key: 'eco',      label: 'Économique',  desc: 'Matériaux standards, bon rapport qualité-prix', color: '#3D6FA8', bg: '#EAF1F8' },
  { key: 'balanced', label: 'Équilibré',   desc: 'Choix intermédiaire, qualité et durabilité',    color: '#A07A14', bg: '#FBF3DA' },
  { key: 'premium',  label: 'Premium',     desc: 'Matériaux haut de gamme, finitions supérieures', color: '#2B5D3A', bg: '#EAF3EC' },
];

/* ── Store card ── */
function StoreCard({ store, isBest, hasSlab, slabTotal, projectType }) {
  return (
    <div className={`store-card${isBest ? ' store-card--best' : ''}`}>
      {isBest && <span className="store-best-badge">Meilleur prix</span>}

      <div className="store-card-top">
        <img
          src={`/brands/${store.logo}.svg`}
          alt={`Logo ${store.name}`}
          className="store-logo"
          style={{ height: 28, width: 'auto', objectFit: 'contain' }}
          loading="lazy"
        />
        <span className="store-name">{store.name}</span>
      </div>

      <div className="store-card-price">
        <span className="store-total">{fmtEur(store.total)}&nbsp;€</span>
        <span className="store-rate">{store.rate}&nbsp;€/m²</span>
      </div>

      {hasSlab && (
        <div className="store-detail">
          <span>Matériaux : {fmtEur(store.projectTotal ?? store.deckTotal ?? 0)} €</span>
          <span>Dalle : {slabTotal.toFixed(0)} €</span>
        </div>
      )}

      <button
        className="store-cta"
        onClick={() => {
          const q = encodeURIComponent(store.searchQuery || store.name);
          const url = `/go?store=${store.id}&project=${projectType}&q=${q}`;
          trackOutboundClick({ store: store.id, project: projectType, url });
          trackAffiliateClick({ store: store.id, project: projectType });
          window.open(url, '_blank', 'noopener,noreferrer');
        }}
        aria-label={`Voir l'offre chez ${store.name}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
        Voir l&apos;offre
      </button>
    </div>
  );
}

export default function BudgetComparator({ area, slabTotal = 0, materials = null, projectType = 'terrasse' }) {
  const hasSlab = slabTotal > 0;

  /* ── Prix live ou statiques (fallback transparent) ── */
  const { prices: livePrices, stores: materialStores, date: pricesDate, live: pricesLive, staleDays, sources: priceSources } = useLivePrices();
  const pricesStale = isPricesCacheStale(staleDays);

  /* ── Calcul détaillé ou fallback ── */
  const detailedPrices = useMemo(() => {
    if (!materials || !projectType) return null;
    try {
      const pricesByStore = {};
      materialStores.forEach(store => {
        const costs = calculateDetailedCost(materials, store.id, projectType, livePrices);
        pricesByStore[store.id] = calculateTotalCost(costs);
      });
      return pricesByStore;
    } catch (e) {
      console.debug('Detailed calculation failed, using simple mode:', e);
      return null;
    }
  }, [materials, projectType, livePrices, materialStores]);

  let sorted, prices, storePrices, displayMode = 'detailed';

  if (detailedPrices) {
    sorted = [...materialStores].map(store => ({
      ...store,
      total: Math.round(detailedPrices[store.id] + slabTotal),
    })).sort((a, b) => a.total - b.total);
    prices = sorted.map(s => s.total);

    storePrices = materialStores.map(s => ({
      ...s,
      projectTotal: Math.round(detailedPrices[s.id]),
      total: Math.round(detailedPrices[s.id] + slabTotal),
    }));
  } else {
    displayMode = 'simple';
    sorted = [...materialStores].sort((a, b) => (a.rate || 35) - (b.rate || 35));
    prices = sorted.map(s => Math.round(area * (s.rate || 35) + slabTotal));

    storePrices = materialStores.map(s => ({
      ...s,
      deckTotal: Math.round(area * (s.rate || 35)),
      total: Math.round(area * (s.rate || 35) + slabTotal),
      projectTotal: Math.round(area * (s.rate || 35)),
    }));
  }

  const tiers = TIERS.map((tier, i) => ({
    ...tier,
    price: prices[i] ?? prices[prices.length - 1],
    store: sorted[i]?.name ?? '',
  }));

  const bestPrice = Math.min(...storePrices.map(p => p.total));

  return (
    <div className="result-block budget-comparator-block">
      {/* ── Header ── */}
      <div className="result-block-header">
        <div style={{ flex: 1 }}>
          <h2 className="result-block-title">Budget & comparatif</h2>
          <p className="result-block-subtitle">
            {displayMode === 'detailed'
              ? 'Estimation détaillée par niveau et par enseigne'
              : 'Estimation basée sur les tarifs moyens constatés'}
            {hasSlab ? ` · dalle béton : ${slabTotal.toFixed(0)} €` : ''}
          </p>
        </div>
        {/* Badge prix live */}
        {pricesLive && !pricesStale && (
          <span
            title={priceSources?.length
              ? `Sources : ${priceSources.join(' · ')}`
              : `Prix mis à jour le ${pricesDate}`}
            style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              borderRadius: 20, background: '#e6f4ea', color: '#2e7d32',
              whiteSpace: 'nowrap', alignSelf: 'flex-start', marginTop: 2,
            }}
          >
            ● Prix du {pricesDate}
            {priceSources?.length > 0 && (
              <span style={{ opacity: 0.7, fontWeight: 400 }}>
                {' '}· {priceSources.length} enseignes
              </span>
            )}
          </span>
        )}
        {pricesStale && (
          <span
            title={`Dernière mise à jour il y a ${staleDays} jours`}
            style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              borderRadius: 20, background: '#fff8e1', color: '#f57f17',
              whiteSpace: 'nowrap', alignSelf: 'flex-start', marginTop: 2,
            }}
          >
            ⚠ Prix du {pricesDate}
          </span>
        )}
      </div>

      {/* ══ PARTIE HAUTE : 3 niveaux budget ══ */}
      <div className="bc-section-label">
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>tune</span>
        Fourchettes budget
      </div>
      <div className="budget-tiers">
        {tiers.map((tier, i) => (
          <div
            key={tier.key}
            className={`budget-tier${i === 1 ? ' budget-tier--recommended' : ''}`}
          >
            {i === 1 && (
              <span className="budget-recommended-badge">Recommandé</span>
            )}
            <div className="budget-tier-header" style={{ color: tier.color }}>
              <span className="budget-tier-label">{tier.label}</span>
            </div>
            <div className="budget-tier-price" style={{ whiteSpace: 'nowrap' }}>
              {fmtEur(tier.price)}<span className="budget-tier-currency">&nbsp;€</span>
            </div>
            <p className="budget-tier-desc">{tier.desc}</p>
            <span className="budget-tier-ref">Réf. {tier.store}</span>
          </div>
        ))}
      </div>

      {/* ── Séparateur visuel ── */}
      <div className="bc-divider" />

      {/* ══ PARTIE BASSE : comparatif enseignes ══ */}
      <div className="bc-section-label">
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>storefront</span>
        Comparer par enseigne
      </div>
      <div className="store-cards">
        {storePrices.map(p => (
          <StoreCard
            key={p.name}
            store={p}
            isBest={p.total === bestPrice}
            hasSlab={hasSlab}
            slabTotal={slabTotal}
            projectType={projectType}
          />
        ))}
      </div>

      {/* ── Disclaimer ── */}
      <p className="budget-disclaimer">
        Estimation indicative hors pose, livraison et options.
        Les dimensions et références des matériaux varient selon les enseignes (sections approchantes, longueurs disponibles).
        Les prix sont indicatifs et peuvent différer selon votre localisation et les promotions en cours.
      </p>
    </div>
  );
}
