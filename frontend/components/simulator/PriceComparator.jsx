'use client';

/**
 * PriceComparator.jsx — Bloc D : comparer les solutions (refonte premium)
 *
 * Cartes comparatives par enseigne avec CTA discrets.
 * Utilise les coûts détaillés si disponibles, fallback sur rate simple.
 * Pas de look marketplace — présentation sobre et crédible.
 */

import { useMemo } from 'react';
import { calculateDetailedCost, calculateTotalCost } from '@/lib/costCalculator.js';
import { STORES as priceStores } from '@/lib/materialPrices.js';

/** Formate un entier en notation française (espace fine comme séparateur milliers).
 *  Déterministe — même résultat sur serveur Node et client Chrome. */
const fmtEur = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');

function StoreCard({ store, isBest, hasSlab, slabTotal }) {
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
        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(store.name + ' bois terrasse')}`, '_blank', 'noopener,noreferrer')}
        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #C9971E'; }}
        onBlur={(e)  => { e.currentTarget.style.boxShadow = ''; }}
        style={{ transition: 'box-shadow 0.15s ease' }}
        aria-label={`Voir l'offre chez ${store.name}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
        Voir l&apos;offre
      </button>
    </div>
  );
}

export default function PriceComparator({ area, slabTotal = 0, materials = null, projectType = 'terrasse' }) {
  const hasSlab = slabTotal > 0;

  // Essayer le calcul détaillé d'abord
  const detailedPrices = useMemo(() => {
    if (!materials || !projectType) return null;
    try {
      const pricesByStore = {};
      materialStores.forEach(store => {
        const costs = calculateDetailedCost(materials, store.id, projectType);
        pricesByStore[store.id] = calculateTotalCost(costs);
      });
      return pricesByStore;
    } catch (e) {
      console.debug('Detailed comparison calculation failed, using simple mode:', e);
      return null;
    }
  }, [materials, projectType]);

  // Déterminer les prix à afficher
  let prices, displayMode = 'detailed';

  if (detailedPrices) {
    // Mode détaillé : utiliser les coûts calculés
    prices = materialStores.map(s => ({
      ...s,
      projectTotal: Math.round(detailedPrices[s.id]),
      total:        Math.round(detailedPrices[s.id] + slabTotal),
    }));
  } else {
    // Fallback : utiliser le taux simple
    displayMode = 'simple';
    prices = priceStores.map(s => ({
      ...s,
      deckTotal:    Math.round(area * s.rate),
      total:        Math.round(area * s.rate + slabTotal),
      projectTotal: Math.round(area * s.rate),
    }));
  }

  const best = Math.min(...prices.map(p => p.total));

  return (
    <div className="result-block">
      <div className="result-block-header">
        <div>
          <h2 className="result-block-title">Comparer les solutions</h2>
          <p className="result-block-subtitle">
            {hasSlab
              ? `Matériaux + dalle béton · chape : ${slabTotal.toFixed(0)} €`
              : `Estimation ${displayMode === 'detailed' ? 'détaillée' : 'par enseigne'} pour votre projet`}
          </p>
        </div>
      </div>

      <div className="store-cards">
        {prices.map(p => (
          <StoreCard
            key={p.name}
            store={p}
            isBest={p.total === best}
            hasSlab={hasSlab}
            slabTotal={slabTotal}
          />
        ))}
      </div>
    </div>
  );
}
