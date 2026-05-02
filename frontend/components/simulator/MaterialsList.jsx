'use client';

/**
 * MaterialsList.jsx — Bloc B : matériaux estimés (refonte premium)
 *
 * Affiche les matériaux avec prix unitaires et sous-totaux par enseigne.
 * Regroupement par catégorie : Ossature / Couverture / Finitions / Quincaillerie
 * Avec colonne prix + sous-total.
 *
 * Backward compatible : fallback sur affichage simple si materialPrices indisponible.
 */

import { useState, useMemo } from 'react';
import { calculateDetailedCost, groupByCategory, calculateTotalCost } from '@/lib/costCalculator.js';
import { STORES } from '@/lib/materialPrices.js';
import { formatLength } from '@/lib/formatters.js';
import BrandIcon from '@/components/ui/BrandIcon';
import { useLivePrices, isPricesCacheStale } from '@/hooks/useLivePrices.js';

const TOOLS_BY_PROJECT = {
  terrasse: [
    { label: 'Visseuse à percussion', search: 'visseuse percussion bois terrasse' },
    { label: 'Scie circulaire', search: 'scie circulaire bois terrasse' },
    { label: 'Niveau laser', search: 'niveau laser chantier' },
    { label: 'Équerre de charpente', search: 'equerre charpente inox' },
    { label: 'Serre-joints', search: 'serre joint bois' },
    { label: 'Vis inox terrasse', search: 'vis inox terrasse bois' },
    { label: 'Lasure bois extérieur', search: 'lasure protection bois exterieur' },
  ],
  pergola: [
    { label: 'Visseuse à choc', search: 'visseuse choc boulonnage' },
    { label: 'Niveau à bulle 120cm', search: 'niveau bulle 120cm chantier' },
    { label: 'Tarière manuelle', search: 'tariere manuelle poteau' },
    { label: 'Sangle de levage', search: 'sangle levage bois charpente' },
    { label: 'Boulons M10 inox', search: 'boulon m10 inox charpente' },
    { label: 'Lasure bois extérieur', search: 'lasure bois exterieur pergola' },
  ],
  cabanon: [
    { label: 'Scie sauteuse', search: 'scie sauteuse bois ossature' },
    { label: 'Cloueur pneumatique', search: 'cloueur pneumatique charpente' },
    { label: 'Niveau laser rotatif', search: 'niveau laser rotatif chantier' },
    { label: 'Visseuse 18V', search: 'visseuse 18v bois' },
    { label: 'Agrafes bardage', search: 'agrafe bardage bois' },
    { label: 'Hydrofuge bois', search: 'hydrofuge bois bardage exterieur' },
  ],
  cloture: [
    { label: 'Tarière électrique', search: 'tariere electrique poteau cloture' },
    { label: 'Niveau à bulle', search: 'niveau bulle chantier' },
    { label: 'Massette', search: 'massette maillet chantier' },
    { label: 'Pince coupante', search: 'pince coupante grillage' },
    { label: 'Vis inox', search: 'vis inox cloture bois' },
    { label: 'Saturateur bois', search: 'saturateur bois cloture exterieur' },
  ],
};

function amazonUrl(search) {
  return `https://www.amazon.fr/s?k=${encodeURIComponent(search)}&tag=diybuilder01-21`;
}

function MatRow({ label, qty, unit, highlight, unitPrice = null, subtotal = null, showPrice = false }) {
  return (
    <div className={`mat-row${highlight ? ' mat-row--highlight' : ''}`}>
      <span className="mat-label">{label}</span>
      <span className="mat-qty">{typeof qty === 'number' ? qty.toFixed(2) : qty}</span>
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

function SlabSection({ slab }) {
  if (!(slab?.betonVolume > 0)) return null;

  const items = [
    { label: 'Béton C20/25 (marge incluse)',      qty: slab.betonVolume,    unit: 'm³',       icon: 'foundation', highlight: true },
    { label: 'Treillis soudé ST25C',              qty: slab.treillisPanels, unit: 'panneaux', icon: 'grid_4x4' },
    { label: 'Cales support treillis',            qty: slab.calesQty,       unit: 'pcs',      icon: 'push_pin' },
    { label: 'Film polyane 200 µ',                qty: slab.polyaneArea,    unit: 'm²',       icon: 'layers' },
    { label: 'Gravier 0/31.5 — couche de forme',  qty: slab.gravierVolume,  unit: 'm³',       icon: '🪨' },
    { label: 'Coffrage périphérique',             qty: slab.coffrageLinear, unit: 'm lin.',       icon: '🪵' },
    ...(slab.jointsActive
      ? [{ label: 'Joints de fractionnement',    qty: slab.jointsLinear,   unit: 'm lin.',       icon: 'content_cut' }]
      : []),
  ];

  return (
    <GroupCard
      title="Dalle béton"
      icon="foundation"
      badge={`${slab.thicknessCm ?? 12} cm`}
      items={items}
    />
  );
}

/* ── Terrasse ─────────────────────────────────── */
function TerrasseMaterials({ materials }) {
  const { boards, joists, pads, screws, entretoises, bande, slab } = materials;

  const structure = [
    { label: 'Lames terrasse 145×28', qty: boards,      unit: 'pcs',   icon: '🪵', highlight: true },
    { label: 'Lambourdes 45×70',      qty: joists,      unit: 'pcs',   icon: 'straighten' },
    { label: 'Plots réglables',       qty: pads,        unit: 'plots', icon: 'construction' },
  ];

  const fixation = [
    { label: 'Vis inox A2',           qty: screws,      unit: 'vis',   icon: 'settings' },
    { label: 'Bande bitume',          qty: bande,       unit: 'm lin.',    icon: '🪤' },
    ...(entretoises > 0
      ? [{ label: 'Entretoises 45×70', qty: entretoises, unit: 'pcs',  icon: 'link' }]
      : []),
  ];

  return (
    <>
      <GroupCard title="Structure" icon="foundation" items={structure} />
      <GroupCard title="Fixation & accessoires" icon="build" items={fixation} />
      <SlabSection slab={slab} />
    </>
  );
}

/* ── Cabanon ──────────────────────────────────── */
function CabanonMaterials({ materials }) {
  const {
    studCount, lissesBasses, lissesHautes, lissesHautes2,
    chevrons, chevronLength, bardage, contreventement,
    osbSurface, osbPanels,
    roofEntretoises, roofEntretoiseLength,
    visBardage, visEntretoises, equerres, sabotsChevrons, membrane,
    slab,
  } = materials;

  const ossature = [
    { label: 'Montants 9,5×9,5 cm',    qty: studCount,        unit: 'pcs', icon: 'fence', highlight: true },
    { label: 'Lisse basse',            qty: lissesBasses,     unit: 'm lin.',  icon: 'straighten' },
    { label: 'Sablière haute',         qty: lissesHautes,     unit: 'm lin.',  icon: 'straighten' },
    { label: 'Double sablière',        qty: lissesHautes2,    unit: 'm lin.',  icon: 'straighten' },
    { label: `Voile OSB 9 mm (${osbPanels ?? Math.ceil(contreventement / 2)} pann.)`, qty: osbSurface ?? contreventement, unit: osbSurface ? 'm²' : 'diag.', icon: 'grid_4x4' },
  ];

  const toiture = [
    { label: `Chevrons (${formatLength(chevronLength)} m)`, qty: chevrons,   unit: 'pcs', icon: 'carpenter' },
    { label: `Entretoises toiture (${formatLength(roofEntretoiseLength)} m)`, qty: roofEntretoises, unit: 'pcs', icon: 'view_column' },
    { label: 'Membrane sous-toiture',  qty: membrane,         unit: 'm²',  icon: 'layers' },
  ];

  const revetement = [
    { label: 'Bardage bois',           qty: bardage,          unit: 'm²',  icon: 'cottage', highlight: true },
  ];

  const quincaillerie = [
    { label: `Vis bardage (${Math.ceil(visBardage / 500)} lots)`, qty: visBardage, unit: 'pcs', icon: 'hardware' },
    { label: `Vis entretoises toiture`, qty: visEntretoises, unit: 'pcs', icon: 'hardware' },
    { label: 'Équerres de fixation',   qty: equerres,         unit: 'pcs', icon: 'shelf_position' },
    { label: 'Sabots de chevrons',     qty: sabotsChevrons,   unit: 'pcs', icon: 'shelf_position' },
  ];

  return (
    <>
      <GroupCard title="Ossature" icon="foundation" badge="Structure porteuse" items={ossature} />
      <GroupCard title="Toiture" icon="roofing" badge="Mono-pente" items={toiture} />
      <GroupCard title="Revêtement" icon="cottage" items={revetement} />
      <GroupCard title="Quincaillerie" icon="build" items={quincaillerie} />
      <SlabSection slab={slab} />
    </>
  );
}

/* ── Pergola ──────────────────────────────────── */
function PergolaMaterials({ materials }) {
  const {
    posts, beamsLong, beamsShort, rafters, braces = 0,
    postLength, beamLongLength, beamShortLength, rafterLength, braceLength,
    visChevrons, visPoteaux, visBraces = 0, boulonsTraverses = 0, ancragePoteaux,
    geometry, slab,
  } = materials;

  // Sections dynamiques (varient selon portée entre poteaux)
  const bW = geometry ? Math.round(geometry.dimensions.beamW * 1000) : 50;
  const bH = geometry ? Math.round(geometry.dimensions.beamH * 1000) : 150;

  const structure = [
    { label: `Poteaux 100×100 (${formatLength(postLength)} m)`,         qty: posts,      unit: 'pcs', icon: 'fence', highlight: true },
    { label: `Longerons ${bH}×${bW} (${formatLength(beamLongLength)} m)`,  qty: beamsLong,  unit: 'pcs', icon: 'straighten' },
    { label: `Traverses ${bH}×${bW} (${formatLength(beamShortLength)} m)`, qty: beamsShort, unit: 'pcs', icon: 'straighten' },
    { label: `Chevrons 80×50 (${formatLength(rafterLength)} m)`,        qty: rafters,    unit: 'pcs', icon: 'carpenter' },
    { label: `Jambes de force 70×70 (${formatLength(braceLength)} m)`,  qty: braces,     unit: 'pcs', icon: 'architecture' },
  ];

  const quincaillerie = [
    { label: 'Vis assemblage chevrons D6×90',  qty: visChevrons,    unit: 'pcs', icon: 'hardware' },
    { label: 'Vis/boulons assemblage poteaux', qty: visPoteaux,     unit: 'pcs', icon: 'hardware' },
    { label: 'Vis/boulons jambes de force',    qty: visBraces,      unit: 'pcs', icon: 'hardware' },
    { label: 'Boulons M10 traverses',         qty: boulonsTraverses, unit: 'pcs', icon: 'hardware' },
    { label: 'Pieds de poteau (platine)',      qty: ancragePoteaux, unit: 'pcs', icon: 'shelf_position' },
  ];

  /* Note longue portée : chevrons > 5.5 m → achat en 6 ou 7 m + coupe en bout */
  const longRafter = rafterLength > 5.5;

  return (
    <>
      {longRafter && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '12px 14px',
          marginBottom: '8px',
          background: 'var(--sky)',
          border: '1px solid rgba(13,71,161,.18)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          color: 'var(--sky-on)',
          lineHeight: '1.5',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>info</span>
          <span>
            <strong>Chevrons {formatLength(rafterLength)} m :</strong> une longueur disponible en 6 m ou 7 m suffit — une coupe en bout de quelques cm sera nécessaire.
            Ces sections existent en Douglas ou épicéa chez les grandes enseignes.
          </span>
        </div>
      )}
      <GroupCard title="Structure" icon="foundation" badge="Autoportante" items={structure} />
      <GroupCard title="Quincaillerie" icon="build" items={quincaillerie} />
      <SlabSection slab={slab} />
    </>
  );
}

/* ── Clôture ──────────────────────────────────── */
function ClotureMaterials({ materials }) {
  const {
    posts, rails, boards,
    postLength, railLength, boardLength,
    visLames, visRails, ancrages,
    postTreatment, footEmbed,
    slab,
  } = materials;

  const isUC4 = postTreatment === 'UC4';
  const structure = [
    { label: `Poteaux 90×90${isUC4 ? ' UC4' : ''} (${formatLength(postLength)} m)`, qty: posts, unit: 'pcs', icon: 'fence', highlight: true },
    { label: `Rails 70×25 (${formatLength(railLength)} m)`, qty: rails, unit: 'pcs', icon: 'straighten' },
    { label: `Lames 120×15 (${formatLength(boardLength)} m)`, qty: boards, unit: 'pcs', icon: 'view_column' },
  ];

  const quincaillerie = [
    { label: 'Vis fixation lames', qty: visLames, unit: 'pcs', icon: 'hardware' },
    { label: 'Vis fixation rails', qty: visRails, unit: 'pcs', icon: 'hardware' },
    { label: 'Ancrages poteaux', qty: ancrages, unit: 'pcs', icon: 'shelf_position' },
  ];

  return (
    <>
      <GroupCard title="Structure" icon="foundation" items={structure} />
      <GroupCard title="Quincaillerie" icon="build" items={quincaillerie} />
      <SlabSection slab={slab} />
    </>
  );
}

/* ── Composant principal ──────────────────────── */
export default function MaterialsList({ materials, projectType = 'terrasse', storeId = 'leroymerlin' }) {
  const [selectedStore, setSelectedStore] = useState(storeId);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { date: pricesDate, live: pricesLive, staleDays } = useLivePrices();

  const tools = TOOLS_BY_PROJECT[projectType] ?? [];

  // Essayer de calculer les coûts détaillés ; fallback sur l'affichage simple
  const detailedCosts = useMemo(() => {
    try {
      return calculateDetailedCost(materials, selectedStore, projectType);
    } catch (e) {
      console.debug('Detailed cost calculation failed, using simple view:', e);
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

  const showDetailed = detailedCosts && detailedCosts.length > 0;

  // Si on a les coûts détaillés, afficher la version avec prix
  if (showDetailed && grouped) {
    return (
      <div className="result-block">
        <div className="result-block-header">
          <div>
            <h2 className="result-block-title">Matériaux estimés</h2>
            <p className="result-block-subtitle">
              Détail par enseigne — Cliquez pour changer de fournisseur
            </p>
          </div>
          {pricesLive && !isPricesCacheStale(staleDays) && (
            <span style={{
              fontSize: 10, color: '#2e7d32', background: '#e6f4ea',
              borderRadius: 12, padding: '1px 7px', fontWeight: 600,
              whiteSpace: 'nowrap', marginLeft: 'auto', alignSelf: 'center',
            }}>
              ● {pricesDate}
            </span>
          )}
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

        {/* ── Section outils Amazon ── */}
        {tools.length > 0 && (
          <div style={{ marginTop: 24, borderTop: '1px solid #e5e2d8', paddingTop: 16 }}>
            <button
              type="button"
              onClick={() => setToolsOpen(o => !o)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', background: 'none',
                border: 'none', cursor: 'pointer', padding: '0 0 8px',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1c1b', fontFamily: 'Manrope, sans-serif' }}>
                🔧 Outils & Consommables
              </span>
              <span style={{ fontSize: 11, color: '#9c9188' }}>
                {toolsOpen ? '▲ Réduire' : '▼ Voir les outils recommandés'}
              </span>
            </button>

            {toolsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tools.map(tool => (
                  <a
                    key={tool.label}
                    href={amazonUrl(tool.search)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 8,
                      background: '#faf9f6', border: '1px solid #e5e2d8',
                      textDecoration: 'none', color: '#1a1c1b',
                      fontSize: 13, fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <span>{tool.label}</span>
                    <span style={{ fontSize: 11, color: '#C9971E', fontWeight: 600 }}>
                      amazon →
                    </span>
                  </a>
                ))}
                <p style={{ fontSize: 11, color: '#9c9188', margin: '4px 0 0', fontFamily: 'Inter, sans-serif' }}>
                  Liens affiliés — sans surcoût pour vous.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback : affichage simple sans prix
  const groupCount = projectType === 'cabanon' ? 4
    : projectType === 'terrasse' ? 2 : 2;

  return (
    <div className="result-block">
      <div className="result-block-header">
        <div>
          <h2 className="result-block-title">Matériaux estimés</h2>
          <p className="result-block-subtitle">
            {groupCount} familles de matériaux pour votre projet
          </p>
        </div>
        {pricesLive && !isPricesCacheStale(staleDays) && (
          <span style={{
            fontSize: 10, color: '#2e7d32', background: '#e6f4ea',
            borderRadius: 12, padding: '1px 7px', fontWeight: 600,
            whiteSpace: 'nowrap', marginLeft: 'auto', alignSelf: 'center',
          }}>
            ● {pricesDate}
          </span>
        )}
      </div>

      <div className="mat-groups">
        {projectType === 'cabanon'
          ? <CabanonMaterials materials={materials} />
          : projectType === 'pergola'
          ? <PergolaMaterials materials={materials} />
          : projectType === 'cloture'
          ? <ClotureMaterials materials={materials} />
          : <TerrasseMaterials materials={materials} />
        }
      </div>

      {/* ── Section outils Amazon ── */}
      {tools.length > 0 && (
        <div style={{ marginTop: 24, borderTop: '1px solid #e5e2d8', paddingTop: 16 }}>
          <button
            type="button"
            onClick={() => setToolsOpen(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', background: 'none',
              border: 'none', cursor: 'pointer', padding: '0 0 8px',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1c1b', fontFamily: 'Manrope, sans-serif' }}>
              🔧 Outils & Consommables
            </span>
            <span style={{ fontSize: 11, color: '#9c9188' }}>
              {toolsOpen ? '▲ Réduire' : '▼ Voir les outils recommandés'}
            </span>
          </button>

          {toolsOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tools.map(tool => (
                <a
                  key={tool.label}
                  href={amazonUrl(tool.search)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: 8,
                    background: '#faf9f6', border: '1px solid #e5e2d8',
                    textDecoration: 'none', color: '#1a1c1b',
                    fontSize: 13, fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <span>{tool.label}</span>
                  <span style={{ fontSize: 11, color: '#C9971E', fontWeight: 600 }}>
                    amazon →
                  </span>
                </a>
              ))}
              <p style={{ fontSize: 11, color: '#9c9188', margin: '4px 0 0', fontFamily: 'Inter, sans-serif' }}>
                Liens affiliés — sans surcoût pour vous.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
