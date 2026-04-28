'use client';

/**
 * ProjectTools.jsx — Outils avec sélecteur de gammes + consommables
 *
 * Onglet "Outils" :
 *   - 4 chips sélecteurs (un par outil du module)
 *   - 3 cartes de gamme horizontales pour l'outil sélectionné
 *     Budget (bleu) / Polyvalent⭐ (ambre) / Professionnel (vert)
 *
 * Onglet "Consommables" :
 *   - Groupes accordion par catégorie
 *   - Liens de recherche uniquement (produits trop variables)
 */

import { useState } from 'react';
import { getProjectTools, PROJECT_CONSUMABLES, buildAmazonUrl, buildLMUrl } from '@/lib/projectTools';

const SECTION_LABELS = {
  terrasse: 'Outils & consommables',
  cabanon:  'Outils & consommables',
  pergola:  'Outils & consommables',
  cloture:  'Outils & consommables',
};

/* ── Mapping icônes consommables (dérivé du préfixe d'ID) ── */
const CONSUMABLE_ICON_MAP = [
  { prefix: 'combinaison',  icon: 'checkroom',    bg: '#DCEAF5', color: '#2A5480' },
  { prefix: 'gants',        icon: 'back_hand',    bg: '#DCEAF5', color: '#2A5480' },
  { prefix: 'lunettes',     icon: 'visibility',   bg: '#DCEAF5', color: '#2A5480' },
  { prefix: 'casque',       icon: 'hearing',      bg: '#DCEAF5', color: '#2A5480' },
  { prefix: 'bouchons',     icon: 'hearing',      bg: '#DCEAF5', color: '#2A5480' },
  { prefix: 'genouilleres', icon: 'shield',       bg: '#DCEAF5', color: '#2A5480' },
  { prefix: 'huile',        icon: 'water_drop',   bg: '#D8EEDC', color: '#1D5E32' },
  { prefix: 'lasure',       icon: 'brush',        bg: '#D8EEDC', color: '#1D5E32' },
  { prefix: 'saturateur',   icon: 'opacity',      bg: '#D8EEDC', color: '#1D5E32' },
  { prefix: 'traitement',   icon: 'science',      bg: '#D8EEDC', color: '#1D5E32' },
  { prefix: 'vis',          icon: 'settings',     bg: '#FBF0D0', color: '#7A5C00' },
  { prefix: 'embouts',      icon: 'extension',    bg: '#FBF0D0', color: '#7A5C00' },
  { prefix: 'lame',         icon: 'content_cut',  bg: '#FBF0D0', color: '#7A5C00' },
  { prefix: 'disques',      icon: 'motion_blur',  bg: '#FBF0D0', color: '#7A5C00' },
  { prefix: 'boulons',      icon: 'hardware',     bg: '#FBF0D0', color: '#7A5C00' },
  { prefix: 'beton',        icon: 'foundation',   bg: '#E8E4DC', color: '#5A4E3A' },
];
const CONSUMABLE_ICON_DEFAULT = { icon: 'inventory_2', bg: '#F0ECE4', color: '#6B5C48' };

function getConsumableIcon(id) {
  return CONSUMABLE_ICON_MAP.find(e => id.startsWith(e.prefix)) ?? CONSUMABLE_ICON_DEFAULT;
}

const TIER_STYLES = {
  budget:     { label: 'Entrée de gamme', color: '#3D6FA8', bg: '#EAF1F8', border: '#b8cfe8', visualBg: 'linear-gradient(135deg, #C8DDEF, #A5C4E0)', iconColor: '#2A5480' },
  polyvalent: { label: 'Polyvalent',      color: '#A07A14', bg: '#FBF3DA', border: '#e0c060', badge: 'Recommandé', visualBg: 'linear-gradient(135deg, #F5E099, #E0C050)', iconColor: '#7A5C00' },
  pro:        { label: 'Professionnel',   color: '#2B5D3A', bg: '#EAF3EC', border: '#9dcfa6', visualBg: 'linear-gradient(135deg, #B8DBBF, #8EC89A)', iconColor: '#1D4028' },
};

/* ── Chevron SVG ── */
function Chevron({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ── Flèche externe ── */
function ArrowExternal() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ── Carte de gamme ── */
function TierCard({ tier, toolName, toolIcon }) {
  const style = TIER_STYLES[tier.key];
  const href  = buildAmazonUrl(tier.amazonQuery, tier.amazonAsin);

  return (
    <div className={`tier-card tier-card--${tier.key}`} style={{ '--tier-color': style.color, '--tier-bg': style.bg, '--tier-border': style.border }}>

      {/* Badge recommandé */}
      {style.badge && (
        <span className="tier-badge">{style.badge}</span>
      )}

      {/* Visual header — icône grand format sur fond coloré */}
      <div className="tier-card-visual" style={{ background: style.visualBg }}>
        <span
          className="material-symbols-outlined tier-card-visual-icon"
          style={{ color: style.iconColor }}
        >
          {toolIcon || 'build'}
        </span>
      </div>

      {/* Header */}
      <div className="tier-card-header">
        <span className="tier-label">{style.label}</span>
      </div>

      {/* Marque + modèle */}
      <div className="tier-product">
        <span className="tier-brand">{tier.brand}</span>
        <span className="tier-model">{tier.model}</span>
      </div>

      {/* Prix */}
      <div className="tier-price">
        ~{tier.price}&nbsp;<span className="tier-currency">€</span>
      </div>

      {/* Specs */}
      <ul className="tier-specs">
        {tier.specs.map((spec, i) => (
          <li key={i} className="tier-spec-item">{spec}</li>
        ))}
      </ul>

      {/* CTA Amazon */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="tier-cta"
        aria-label={`Voir ${tier.brand} ${tier.model} sur Amazon`}
      >
        Voir sur Amazon
        <ArrowExternal />
      </a>
    </div>
  );
}

/* ── Sélecteur d'outil + affichage gammes ── */
function ToolsPanel({ tools }) {
  const [selected, setSelected] = useState(0);
  const tool = tools[selected];

  return (
    <div className="tools-panel">

      {/* Sous-titre */}
      <p className="project-tools-subtitle">
        Les outils marqués{' '}
        <span className="tool-rentable-inline">Louable</span>{' '}
        sont disponibles à la location en GSB — inutile d&apos;acheter pour un projet unique.
      </p>

      {/* Chips sélecteurs */}
      <div className="tool-selector" role="tablist">
        {tools.map((t, i) => (
          <button
            key={t.id}
            className={`tool-chip${selected === i ? ' tool-chip--active' : ''}`}
            onClick={() => setSelected(i)}
            role="tab"
            aria-selected={selected === i}
          >
            {t.name}
            {t.rentable && <span className="tool-chip-rentable">Louable</span>}
          </button>
        ))}
      </div>

      {/* Contexte d'usage */}
      <p className="tool-context-desc">{tool.desc}</p>

      {/* 3 cartes de gamme */}
      <div className="tier-cards-grid">
        {tool.tiers.map((tier) => (
          <TierCard key={tier.key} tier={tier} toolName={tool.name} toolIcon={tool.icon} />
        ))}
      </div>
    </div>
  );
}

/* ── Groupe consommables dépliable ── */
function ConsumableGroup({ group, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`consumable-group${open ? ' consumable-group--open' : ''}`}>
      <button className="consumable-group-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="consumable-group-label">
          <i className={`ph-duotone ${group.icon} consumable-group-icon`} aria-hidden="true" />
          {group.category}
          <span className="consumable-group-count">{group.items.length}</span>
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="consumable-group-body">
          <div className="consumable-items-grid">
            {group.items.map((item) => (
              <div key={item.id} className="consumable-item">
                {(() => {
                  const iconData = getConsumableIcon(item.id);
                  return (
                    <div className="consumable-item-header">
                      <div className="consumable-item-icon-pill" style={{ background: iconData.bg }}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 20, color: iconData.color, fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          {iconData.icon}
                        </span>
                      </div>
                      <span className="consumable-item-name">{item.name}</span>
                    </div>
                  );
                })()}
                <p className="consumable-item-desc">{item.desc}</p>
                <div className="consumable-item-stores">
                  <a href={buildAmazonUrl(item.amazonQuery)} target="_blank" rel="noopener noreferrer sponsored"
                    className="consumable-store-cta consumable-store-cta--amazon"
                    aria-label={`Voir ${item.name} sur Amazon`}>
                    <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
                    Amazon
                  </a>
                  <a href={buildLMUrl(item.lmQuery)} target="_blank" rel="noopener noreferrer"
                    className="consumable-store-cta consumable-store-cta--lm"
                    aria-label={`Voir ${item.name} chez Leroy Merlin`}>
                    <span className="material-symbols-outlined" aria-hidden="true">storefront</span>
                    Leroy Merlin
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ Composant principal ══ */
export default function ProjectTools({ projectType }) {
  const tools       = getProjectTools(projectType);
  const consumables = PROJECT_CONSUMABLES[projectType];
  const [tab, setTab] = useState('tools');

  if (!tools?.length && !consumables?.length) return null;

  const label = SECTION_LABELS[projectType] ?? 'Outils & consommables';

  return (
    <div className="project-tools-section">

      <div className="project-tools-header">
        <div className="project-tools-title-row">
          <i className="ph-duotone ph-toolbox project-tools-icon" aria-hidden="true" />
          <h3 className="project-tools-title">{label}</h3>
        </div>
      </div>

      {/* Onglets */}
      <div className="project-tools-tabs" role="tablist">
        <button className={`project-tools-tab${tab === 'tools' ? ' project-tools-tab--active' : ''}`}
          onClick={() => setTab('tools')} role="tab" aria-selected={tab === 'tools'}>
          <i className="ph-duotone ph-wrench" aria-hidden="true" />
          Outils
        </button>
        <button className={`project-tools-tab${tab === 'consumables' ? ' project-tools-tab--active' : ''}`}
          onClick={() => setTab('consumables')} role="tab" aria-selected={tab === 'consumables'}>
          <i className="ph-duotone ph-package" aria-hidden="true" />
          Consommables
        </button>
      </div>

      {tab === 'tools' && <ToolsPanel tools={tools} />}

      {tab === 'consumables' && (
        <div className="project-tools-panel">
          <p className="project-tools-subtitle">
            Sélection par catégorie — cliquer pour dérouler et voir les références conseillées.
          </p>
          <div className="consumable-groups">
            {consumables.map((group, idx) => (
              <ConsumableGroup key={group.category} group={group} defaultOpen={idx === 0} />
            ))}
          </div>
        </div>
      )}

      <p className="project-tools-disclaimer">
        Liens sponsorisés (Amazon Associates). Prix indicatifs, susceptibles de varier.
      </p>
    </div>
  );
}
