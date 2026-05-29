'use client';

/**
 * GuideToolsBlock.jsx — Bloc « outillage du chantier » pour les guides piliers
 *
 * Version éditoriale compacte du bloc outils des simulateurs : on ne montre que
 * la gamme polyvalente (le pick conseillé) de chaque outil du module, sans le
 * sélecteur 3 gammes ni les consommables. Pensé pour s'insérer dans le flux de
 * lecture d'un article, pas pour remplacer ProjectTools.jsx.
 *
 * Données : réutilise getProjectTools() — aucun ASIN dupliqué ici.
 * Notes Amazon : getRating() (snapshot daté), badge générique honnête sinon.
 * Tracking : sub-tag `${module}-guide` → isole les clics venant des guides du
 *            trafic simulateur dans le Sub-Tag Report Associates.
 *
 * Modules supportés : terrasse | cabanon | pergola | cloture.
 * (dalle n'a pas encore de jeu d'outils dans projectTools.js.)
 */

import { useState } from 'react';
import Link from 'next/link';
import { getProjectTools, buildAmazonUrl, buildAmazonImageUrl } from '@/lib/projectTools';
import { getRating, SNAPSHOT_DATE } from '@/lib/amazonRatings';

/* Sous-titre contextuel par module (le H3 reste générique) */
const MODULE_SUBTITLE = {
  terrasse: 'Les quatre outils qui font la différence sur une pose de lames propre et de niveau.',
  cabanon:  'L’essentiel pour débiter l’ossature, assembler et vérifier l’aplomb des montants.',
  pergola:  'De quoi forer les ancrages, fixer dans le béton et couper les sections proprement.',
  cloture:  'Forage des poteaux, alignement au cordeau et vissage des lames sans coulures.',
  dalle:    'L\'essentiel pour aligner le coffrage, étaler le béton dans les angles et serrer la surface au talochage.',
};

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

/* ── Étoiles SVG : remplissage proportionnel à rating/5 ── */
function Stars({ value }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="amazon-stars" aria-hidden="true">
      <span className="amazon-stars-bg">★★★★★</span>
      <span className="amazon-stars-fg" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}

/* ── Note Amazon : étoiles + count si sourcée, badge générique honnête sinon ── */
function RatingBadge({ asin }) {
  const data = getRating(asin);
  if (!data || data.rating == null) {
    return (
      <span className="amazon-rating amazon-rating--generic amazon-rating--compact" aria-label="Voir les avis sur Amazon">
        <span className="amazon-stars-generic">★</span>
        <span className="amazon-rating-text">Voir les avis</span>
      </span>
    );
  }
  const countLabel = data.count >= 1000
    ? `${(data.count / 1000).toFixed(1).replace('.0', '')}k`
    : `${data.count}`;
  return (
    <span
      className="amazon-rating amazon-rating--compact"
      title={`Note moyenne ${data.rating}/5 — ${data.count} avis (relevé Amazon au ${SNAPSHOT_DATE})`}
    >
      <Stars value={data.rating} />
      <span className="amazon-rating-value">{data.rating.toFixed(1)}</span>
      <span className="amazon-rating-count">({countLabel})</span>
    </span>
  );
}

/* ── Visuel produit Amazon (CDN /images/P/) avec repli sur l'icône outil ──
   Amazon renvoie un placeholder ~1×1 px pour les ASINs sans visuel sur /images/P/ :
   on bascule sur l'icône Material Symbols si naturalWidth < 50. */
function ToolVisual({ asin, icon, name }) {
  const [imgFailed, setImgFailed] = useState(false);
  const imageUrl = asin ? buildAmazonImageUrl(asin) : null;
  const showImage = imageUrl && !imgFailed;
  const handleLoad = (e) => { if (e.target.naturalWidth < 50) setImgFailed(true); };

  if (showImage) {
    return (
      <div className="guide-tool-visual guide-tool-visual--image">
        {/* eslint-disable-next-line @next/next/no-img-element -- CDN Amazon externe, repli onLoad/naturalWidth */}
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          onError={() => setImgFailed(true)}
          onLoad={handleLoad}
          className="guide-tool-img"
        />
      </div>
    );
  }
  return (
    <div className="guide-tool-visual guide-tool-visual--icon">
      <span className="material-symbols-outlined" aria-hidden="true">{icon || 'build'}</span>
    </div>
  );
}

/* ── Carte outil compacte ── */
function ToolCard({ pick, subtag }) {
  const href = buildAmazonUrl(pick.amazonQuery, pick.amazonAsin, subtag);
  return (
    <div className="guide-tool-card">
      <ToolVisual asin={pick.amazonAsin} icon={pick.icon} name={`${pick.brand} ${pick.model}`} />
      <div className="guide-tool-body">
        <span className="guide-tool-name">{pick.name}</span>
        <span className="guide-tool-model">{pick.brand} {pick.model}</span>
        <RatingBadge asin={pick.amazonAsin} />
        <div className="guide-tool-foot">
          <span className="guide-tool-price">~{pick.price}&nbsp;€</span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="guide-tool-cta"
            aria-label={`Voir ${pick.brand} ${pick.model} sur Amazon`}
          >
            Voir sur Amazon
            <ArrowExternal />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GuideToolsBlock({ module }) {
  const tools = getProjectTools(module);
  if (!tools?.length) return null;

  /* Gamme polyvalente (pick conseillé) de chaque outil ; repli sur le 1er tier. */
  const picks = tools.map((t) => {
    const tier = t.tiers?.find((ti) => ti.key === 'polyvalent') ?? t.tiers?.[0];
    if (!tier) return null;
    return { id: t.id, name: t.name, icon: t.icon, ...tier };
  }).filter(Boolean);

  if (!picks.length) return null;

  const subtag = `${module}-guide`;

  return (
    <section className="guide-tools" aria-label="Outillage recommandé pour ce chantier">
      <div className="guide-tools-head">
        <p className="guide-tools-eyebrow">Outillage du chantier</p>
        <h3 className="guide-tools-title">Les outils pour ce projet</h3>
        {MODULE_SUBTITLE[module] && (
          <p className="guide-tools-sub">{MODULE_SUBTITLE[module]}</p>
        )}
      </div>

      <div className="guide-tools-grid">
        {picks.map((pick) => (
          <ToolCard key={pick.id} pick={pick} subtag={subtag} />
        ))}
      </div>

      <p className="guide-tools-note">
        Liens affiliés Amazon&nbsp;: un achat via ces liens peut nous rémunérer, sans surcoût pour vous.
        Gammes «&nbsp;polyvalentes&nbsp;» conseillées pour un premier chantier — prix indicatifs.{' '}
        <Link href="/charte-affiliation">Notre charte</Link>.
      </p>
    </section>
  );
}
