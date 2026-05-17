'use client';

/**
 * MaterialsList.jsx — Bloc B : matériaux estimés (refonte premium)
 *
 * Affiche les matériaux avec prix unitaires et sous-totaux par enseigne.
 * Regroupement par catégorie : Ossature / Couverture / Finitions / Quincaillerie
 * Avec colonne prix + sous-total.
 *
 * La catégorie "Garde-corps" (option terrasse) est créée naturellement par
 * groupByCategory(calculateDetailedCost(...)) — aucun composant ad-hoc nécessaire.
 */

import { useState, useMemo } from 'react';
import { calculateDetailedCost, groupByCategory, calculateTotalCost } from '@/lib/costCalculator.js';
import { STORES } from '@/lib/materialPrices.js';
import BrandIcon from '@/components/ui/BrandIcon';

function MatRow({ label, quantity, unit, highlight, unitPrice = null, subtotal = null, showPrice = false }) {
  return (
    <div className={`mat-row${highlight ? ' mat-row--highlight' : ''}`}>
      <span className="mat-label">{label}</span>
      <span className="mat-qty">{typeof quantity === 'number' ? quantity.toFixed(2) : quantity}</span>
      <span className="mat-unit">{unit}</span>
      {showPrice && unitPrice !== null && (
        <>
          <span className="mat-price" title="Prix unitaire">{unitPrice.toFixed(2)}&nbsp;€</span>
          <span className="mat-subtotal" title="Sous-total">{(subtotal || 0).toFixed(2)}&nbsp;€</span>
        </>
      )}
    </div>
  );
}

function GroupCard({ title, icon, badge, items, showPrice = false }) {
  const total = items.length;
  const categoryTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  return (
    <div className="mat-group-card">
      <div className="mat-group-header">
        <span className="mat-group-icon">
          <BrandIcon name={icon} size={18} />
        </span>
        <span className="mat-group-title">{title}</span>
        {badge && <span className="mat-group-badge">{badge}</span>}
        <span className="mat-group-count">{total} poste{total > 1 ? 's' : ''}</span>
        {showPrice && categoryTotal > 0 && (
          <span className="mat-group-total">{categoryTotal.toFixed(2)}&nbsp;€</span>
        )}
      </div>
      <div className="mat-group-body">
        {items.map(item => <MatRow key={item.label} {...item} showPrice={showPrice} />)}
      </div>
    </div>
  );
}

/* ── Composant principal ──────────────────────── */
export default function MaterialsList({ materials, projectType = 'terrasse', storeId = 'leroymerlin' }) {
  const [selectedStore, setSelectedStore] = useState(storeId);

  const detailedCosts = useMemo(() => {
    try {
      return calculateDetailedCost(materials, selectedStore, projectType);
    } catch (e) {
      console.debug('Detailed cost calculation failed:', e);
      return null;
    }
  }, [materials, selectedStore, projectType]);

  const grouped = useMemo(() => {
    if (!detailedCosts) return null;
    return groupByCategory(detailedCosts);
  }, [detailedCosts]);

  const totalCost = useMemo(() => {
    if (!detailedCosts) return 0;
    return calculateTotalCost(detailedCosts);
  }, [detailedCosts]);

  if (!detailedCosts || detailedCosts.length === 0 || !grouped) return null;

  return (
    <div className="result-block">
      <div className="result-block-header">
        <div>
          <h2 className="result-block-title">Matériaux estimés</h2>
          <p className="result-block-subtitle">
            Détail par enseigne — Cliquez pour changer de fournisseur
          </p>
        </div>
      </div>

      {/* Sélecteur enseigne */}
      <div className="mat-store-selector">
        {STORES.map(store => (
          <button
            key={store.id}
            className={`mat-store-btn${selectedStore === store.id ? ' mat-store-btn--active' : ''}`}
            onClick={() => setSelectedStore(store.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/brands/${store.logo}.svg`} alt={store.name} />
            <span>{store.name}</span>
          </button>
        ))}
      </div>

      {/* Coût total en haut */}
      <div className="mat-total-cost">
        <span className="mat-total-label">Budget matériaux</span>
        <span className="mat-total-amount">{totalCost.toFixed(2)}&nbsp;€</span>
      </div>

      {/* Groupes par catégorie */}
      <div className="mat-groups">
        {Object.entries(grouped).map(([category, items]) => (
          <GroupCard
            key={category}
            title={category}
            icon="inventory_2"
            items={items}
            showPrice={true}
          />
        ))}
      </div>
    </div>
  );
}
