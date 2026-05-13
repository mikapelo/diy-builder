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
import { getProjectTools, getProjectKit, PROJECT_CONSUMABLES, buildAmazonUrl, buildAmazonImageUrl, buildLMUrl } from '@/lib/projectTools';
import { getRating, SNAPSHOT_DATE } from '@/lib/amazonRatings';

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
  budget:     {
    label: 'Entrée de gamme',
    color: '#3D6FA8',
    bg: 'linear-gradient(135deg, #F4F8FC 0%, #E0EBF4 100%)',
    border: '#b8cfe8',
    visualBg: 'linear-gradient(135deg, #C8DDEF, #A5C4E0)',
    iconColor: '#2A5480',
  },
  polyvalent: {
    label: 'Polyvalent',
    color: '#A07A14',
    bg: 'linear-gradient(135deg, #FFF8D8 0%, #F5E8B8 100%)',
    border: '#e0c060',
    badge: 'Recommandé',
    visualBg: 'linear-gradient(135deg, #F5E099, #E0C050)',
    iconColor: '#7A5C00',
  },
  pro:        {
    label: 'Professionnel',
    color: '#2B5D3A',
    bg: 'linear-gradient(135deg, #F2F9F3 0%, #DCEDDF 100%)',
    border: '#9dcfa6',
    visualBg: 'linear-gradient(135deg, #B8DBBF, #8EC89A)',
    iconColor: '#1D4028',
  },
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

/* ── Image produit avec fallback icône ──
   Amazon sert un placeholder ~1×1 (43 b) pour les ASINs sans visuel sur /images/P/.
   On bascule vers l'icône si naturalWidth < 50 (heuristique placeholder). */
function TierVisual({ asin, toolIcon, fallbackBg, fallbackColor, brand, model }) {
  const [imgFailed, setImgFailed] = useState(false);
  const imageUrl = asin ? buildAmazonImageUrl(asin) : null;
  const showImage = imageUrl && !imgFailed;

  const handleLoad = (e) => {
    if (e.target.naturalWidth < 50) setImgFailed(true);
  };

  if (showImage) {
    return (
      <div className="tier-card-visual tier-card-visual--image">
        <img
          src={imageUrl}
          alt={`${brand} ${model}`}
          loading="lazy"
          onError={() => setImgFailed(true)}
          onLoad={handleLoad}
          className="tier-card-product-img"
        />
      </div>
    );
  }
  return (
    <div className="tier-card-visual tier-card-visual--icon" style={{ background: fallbackBg }}>
      <span
        className="material-symbols-outlined tier-card-visual-icon"
        style={{ color: fallbackColor }}
        aria-hidden="true"
      >
        {toolIcon || 'build'}
      </span>
    </div>
  );
}

/* ── Pictogramme Prime (Amazon) ── */
function PrimeBadge() {
  return (
    <span className="tier-prime" aria-label="Éligible Amazon Prime">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Prime
    </span>
  );
}

/* ── Étoiles SVG : 5 étoiles avec remplissage proportionnel à rating/5 ── */
function Stars({ value }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="amazon-stars" aria-hidden="true">
      <span className="amazon-stars-bg">★★★★★</span>
      <span className="amazon-stars-fg" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}

/* ── Badge note Amazon — affiche étoiles + count si rating sourcé, badge générique sinon ── */
function RatingBadge({ asin, compact = false }) {
  const data = getRating(asin);
  if (!data || data.rating == null) {
    /* Pas de note sourcée → badge générique honnête */
    return (
      <span className={`amazon-rating amazon-rating--generic${compact ? ' amazon-rating--compact' : ''}`} aria-label="Voir les avis sur Amazon">
        <span className="amazon-stars-generic">★</span>
        <span className="amazon-rating-text">{compact ? 'Avis' : 'Voir les avis'}</span>
      </span>
    );
  }
  /* Note sourcée → étoiles + count + snapshot daté */
  const countLabel = data.count >= 1000
    ? `${(data.count / 1000).toFixed(1).replace('.0', '')}k`
    : `${data.count}`;
  return (
    <span
      className={`amazon-rating${compact ? ' amazon-rating--compact' : ''}`}
      title={`Note moyenne ${data.rating}/5 — ${data.count} avis (relevé Amazon au ${SNAPSHOT_DATE})`}
    >
      <Stars value={data.rating} />
      <span className="amazon-rating-value">{data.rating.toFixed(1)}</span>
      <span className="amazon-rating-count">({countLabel})</span>
    </span>
  );
}

/* ── Carte de gamme ── */
function TierCard({ tier, toolIcon, subtag }) {
  const style = TIER_STYLES[tier.key];
  const href  = buildAmazonUrl(tier.amazonQuery, tier.amazonAsin, subtag);

  return (
    <div className={`tier-card tier-card--${tier.key}`} style={{ '--tier-color': style.color, '--tier-bg': style.bg, '--tier-border': style.border }}>

      {/* Badge "Recommandé" (badge principal du tier polyvalent) */}
      {style.badge && (
        <span className="tier-badge">{style.badge}</span>
      )}

      {/* Visuel — image produit Amazon ou icône de fallback */}
      <TierVisual
        asin={tier.amazonAsin}
        toolIcon={toolIcon}
        fallbackBg={style.visualBg}
        fallbackColor={style.iconColor}
        brand={tier.brand}
        model={tier.model}
      />

      {/* Badge "Best-seller Amazon" — coin haut droit, indépendant du badge Recommandé */}
      {tier.bestSeller && (
        <span className="tier-bestseller" aria-label="Top vente Amazon">
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          Top vente
        </span>
      )}

      {/* Header */}
      <div className="tier-card-header">
        <span className="tier-label">{style.label}</span>
      </div>

      {/* Marque + modèle */}
      <div className="tier-product">
        <span className="tier-brand">{tier.brand}</span>
        <span className="tier-model">{tier.model}</span>
      </div>

      {/* Note Amazon (étoiles si sourcée, badge générique sinon) */}
      <RatingBadge asin={tier.amazonAsin} />

      {/* Prix + Prime */}
      <div className="tier-price-row">
        <span className="tier-price">
          ~{tier.price}&nbsp;<span className="tier-currency">€</span>
        </span>
        {tier.prime && <PrimeBadge />}
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
function ToolsPanel({ tools, projectType }) {
  const [selected, setSelected] = useState(0);
  const tool = tools[selected];

  return (
    <div className="tools-panel">

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
          </button>
        ))}
      </div>

      {/* Contexte d'usage */}
      <p className="tool-context-desc">{tool.desc}</p>

      {/* 3 cartes de gamme — key inclut tool.id pour forcer le remount au switch d'onglet
          (sinon l'état local TierVisual.imgFailed se traîne entre outils) */}
      <div className="tier-cards-grid">
        {tool.tiers.map((tier) => (
          <TierCard
            key={`${tool.id}-${tier.key}`}
            tier={tier}
            toolIcon={tool.icon}
            subtag={`${projectType}-tier-${tier.key}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Item consommable individuel — image produit si ASIN, pictogramme sinon ── */
function ConsumableItem({ item, subtag }) {
  const [imgFailed, setImgFailed] = useState(false);
  const iconData = getConsumableIcon(item.id);
  const imageUrl = item.amazonAsin ? buildAmazonImageUrl(item.amazonAsin) : null;
  const showImage = imageUrl && !imgFailed;

  const handleLoad = (e) => { if (e.target.naturalWidth < 50) setImgFailed(true); };

  return (
    <div className="consumable-item">
      <div className="consumable-item-header">
        {showImage ? (
          <div className="consumable-item-image">
            <img
              src={imageUrl}
              alt={item.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              onLoad={handleLoad}
              className="consumable-item-img"
            />
          </div>
        ) : (
          <div className="consumable-item-icon-pill" style={{ background: iconData.bg }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20, color: iconData.color, fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              {iconData.icon}
            </span>
          </div>
        )}
        <div className="consumable-item-name-wrap">
          <span className="consumable-item-name">{item.name}</span>
          {item.priceHint && (
            <span className="consumable-item-price">{item.priceHint}</span>
          )}
        </div>
      </div>
      <p className="consumable-item-desc">{item.desc}</p>
      <div className="consumable-item-stores">
        <a
          href={buildAmazonUrl(item.amazonQuery, item.amazonAsin, subtag)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="consumable-store-cta consumable-store-cta--amazon"
          aria-label={`Voir ${item.name} sur Amazon`}
        >
          <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
          Amazon
        </a>
        <a
          href={buildLMUrl(item.lmQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="consumable-store-cta consumable-store-cta--lm"
          aria-label={`Voir ${item.name} chez Leroy Merlin`}
        >
          <span className="material-symbols-outlined" aria-hidden="true">storefront</span>
          Leroy Merlin
        </a>
      </div>
    </div>
  );
}

/* ── Groupe consommables dépliable ── */
function ConsumableGroup({ group, defaultOpen = false, subtag }) {
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
              <ConsumableItem key={item.id} item={item} subtag={subtag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Icônes de catégorie EPI / consommable (Material Symbols) ── */
const KIT_ICONS = {
  // EPI
  'combinaison': { icon: 'checkroom',  bg: '#DCEAF5', color: '#2A5480' },
  'gants':       { icon: 'back_hand',  bg: '#DCEAF5', color: '#2A5480' },
  'lunettes':    { icon: 'visibility', bg: '#DCEAF5', color: '#2A5480' },
  'casque':      { icon: 'hearing',    bg: '#DCEAF5', color: '#2A5480' },
  'bouchons':    { icon: 'hearing',    bg: '#DCEAF5', color: '#2A5480' },
  // Consommables
  'vis':         { icon: 'settings',    bg: '#FBF0D0', color: '#7A5C00' },
  'huile':       { icon: 'water_drop',  bg: '#D8EEDC', color: '#1D5E32' },
  'lasure':      { icon: 'brush',       bg: '#D8EEDC', color: '#1D5E32' },
  'saturateur':  { icon: 'opacity',     bg: '#D8EEDC', color: '#1D5E32' },
};
const KIT_ICON_DEFAULT = { icon: 'inventory_2', bg: '#F0ECE4', color: '#6B5C48' };

function getKitItemIcon(id) {
  const key = Object.keys(KIT_ICONS).find((k) => id.startsWith(k));
  return key ? KIT_ICONS[key] : KIT_ICON_DEFAULT;
}

/* ── Mini-carte d'un item du kit (outil / EPI / consommable) ── */
function KitCard({ item, subtag }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isTool = item.kind === 'tool';
  const href = buildAmazonUrl(item.amazonQuery, item.amazonAsin, subtag);
  const imageUrl = isTool && item.amazonAsin ? buildAmazonImageUrl(item.amazonAsin) : null;
  const showImage = imageUrl && !imgFailed;
  const iconData = !isTool ? getKitItemIcon(item.id) : null;

  const handleLoad = (e) => { if (e.target.naturalWidth < 50) setImgFailed(true); };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`kit-card kit-card--${item.kind}`}
      aria-label={`${item.name}${item.brand ? ' — ' + item.brand : ''} sur Amazon`}
    >
      {/* Tag de type en coin */}
      <span className={`kit-card-tag kit-card-tag--${item.kind}`}>
        {item.kind === 'tool' ? 'Outil' : item.kind === 'epi' ? 'EPI' : 'Fournit.'}
      </span>

      {/* Visuel : image produit (outils) ou icône colorée (EPI/consommable) */}
      <div className="kit-card-visual">
        {showImage ? (
          <img
            src={imageUrl}
            alt={`${item.brand} ${item.model}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
            onLoad={handleLoad}
            className="kit-card-img"
          />
        ) : isTool ? (
          <span className="material-symbols-outlined kit-card-fallback-icon" aria-hidden="true">
            {item.icon || 'build'}
          </span>
        ) : (
          <div className="kit-card-icon-pill" style={{ background: iconData.bg }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 28, color: iconData.color, fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              {iconData.icon}
            </span>
          </div>
        )}
      </div>

      {/* Texte */}
      <div className="kit-card-body">
        {item.brand && <span className="kit-card-brand">{item.brand}</span>}
        <span className="kit-card-name">{isTool ? item.model : item.name}</span>
        {isTool && item.amazonAsin && (
          <RatingBadge asin={item.amazonAsin} compact />
        )}
        {isTool && item.price != null && (
          <span className="kit-card-price">~{item.price}&nbsp;€</span>
        )}
        {!isTool && (
          <span className="kit-card-price kit-card-price--variable">Voir prix</span>
        )}
      </div>
    </a>
  );
}

/* ── Bloc Kit complet — résumé visuel actionable en tête de section ── */
function ProjectKit({ kit, projectLabel, projectType }) {
  if (!kit || kit.itemCount === 0) return null;
  const allItems = [...kit.tools, ...kit.epi, ...kit.supplies];

  return (
    <div className="project-kit">
      <div className="project-kit-header">
        <div className="project-kit-eyebrow">
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 17 }}>shopping_basket</span>
          Kit complet — {projectLabel}
        </div>
        <p className="project-kit-subtitle">
          {kit.itemCount} essentiels pour démarrer demain — outils polyvalents + EPI + consommables clés.
        </p>
      </div>

      <div className="project-kit-grid">
        {allItems.map((item) => (
          <KitCard
            key={`${item.kind}-${item.id}`}
            item={item}
            subtag={`${projectType}-kit-${item.kind}`}
          />
        ))}
      </div>

      <div className="project-kit-footer">
        <div className="project-kit-total">
          <span className="project-kit-total-label">Budget outils (polyvalent)</span>
          <span className="project-kit-total-amount">~{kit.toolsTotal}&nbsp;€</span>
          <span className="project-kit-total-hint">+ EPI &amp; fournitures (prix variables)</span>
        </div>
      </div>
    </div>
  );
}

/* ══ Composant principal ══ */
const PROJECT_KIT_LABELS = {
  terrasse: 'Terrasse bois',
  cabanon:  'Cabanon ossature',
  pergola:  'Pergola bois',
  cloture:  'Clôture bois',
};

export default function ProjectTools({ projectType }) {
  const tools       = getProjectTools(projectType);
  const consumables = PROJECT_CONSUMABLES[projectType];
  const kit         = getProjectKit(projectType);
  const [tab, setTab] = useState('tools');

  if (!tools?.length && !consumables?.length) return null;

  const label = SECTION_LABELS[projectType] ?? 'Outils & consommables';
  const kitLabel = PROJECT_KIT_LABELS[projectType] ?? '';

  return (
    <div className="project-tools-section">

      <div className="project-tools-header">
        <div className="project-tools-title-row">
          <i className="ph-duotone ph-toolbox project-tools-icon" aria-hidden="true" />
          <h3 className="project-tools-title">{label}</h3>
        </div>
      </div>

      {/* Kit complet — vue panier rapide en tête de section */}
      <ProjectKit kit={kit} projectLabel={kitLabel} projectType={projectType} />

      {/* Séparateur visuel */}
      <div className="project-tools-divider" aria-hidden="true">
        <span>ou explorer en détail</span>
      </div>

      {/* Onglets */}
      <div className="project-tools-tabs" role="tablist">
        <button className={`project-tools-tab${tab === 'tools' ? ' project-tools-tab--active' : ''}`}
          onClick={() => setTab('tools')} role="tab" aria-selected={tab === 'tools'}>
          <i className="ph-duotone ph-wrench" aria-hidden="true" />
          Outils (3 gammes)
        </button>
        <button className={`project-tools-tab${tab === 'consumables' ? ' project-tools-tab--active' : ''}`}
          onClick={() => setTab('consumables')} role="tab" aria-selected={tab === 'consumables'}>
          <i className="ph-duotone ph-package" aria-hidden="true" />
          Consommables
        </button>
      </div>

      {tab === 'tools' && <ToolsPanel tools={tools} projectType={projectType} />}

      {tab === 'consumables' && (
        <div className="project-tools-panel">
          <p className="project-tools-subtitle">
            Sélection par catégorie — cliquer pour dérouler et voir les références conseillées.
          </p>
          <div className="consumable-groups">
            {consumables.map((group, idx) => (
              <ConsumableGroup
                key={group.category}
                group={group}
                defaultOpen={idx === 0}
                subtag={`${projectType}-cons`}
              />
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
