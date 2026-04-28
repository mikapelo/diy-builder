'use client';

import BrandIcon from '@/components/ui/BrandIcon';

/**
 * ProjectSummary.jsx — Bloc A : résumé premium du projet simulé
 *
 * Affiche un header éditorial avec les highlights clés du projet.
 * Mapping projectType → highlights pour chaque module.
 * Ne modifie aucun calcul — lecture seule des données engine.
 *
 * Note DA G v2 : chaque icône Phosphor est doublée d'un <BrandIcon>.
 * Le scope `[data-theme="g-v2"]` bascule l'affichage via CSS — le reste
 * des pages continue d'utiliser l'iconographie Phosphor classique.
 */

const PROJECT_LABELS = {
  terrasse: { title: 'Terrasse bois',         icon: 'ph-duotone ph-park',        description: 'Terrasse en bois sur plots ou dalle' },
  cabanon:  { title: 'Cabanon ossature bois', icon: 'ph-duotone ph-house-line',  description: 'Cabanon à ossature bois mono-pente' },
  pergola:  { title: 'Pergola bois',          icon: 'ph-duotone ph-umbrella',    description: 'Pergola autoportante en bois massif' },
  cloture:  { title: 'Clôture bois',          icon: 'ph-duotone ph-tree-structure', description: 'Clôture ajourée en bois' },
};

function Highlight({ label, value, unit, accent }) {
  return (
    <div className={`proj-highlight${accent ? ' proj-highlight--accent' : ''}`}>
      <div className="proj-highlight-content">
        <span className="proj-highlight-value">
          {value}<span className="proj-highlight-unit">{unit}</span>
        </span>
        <span className="proj-highlight-label">{label}</span>
      </div>
    </div>
  );
}

function getHighlights(projectType, dims, materials) {
  const { width, depth, area } = dims;

  switch (projectType) {
    case 'terrasse':
      return [
        { icon: 'ph-duotone ph-ruler',         label: 'Dimensions', value: `${width} × ${depth}`, unit: 'm' },
        { icon: 'ph-duotone ph-square-half',   label: 'Surface',    value: area, unit: 'm²', accent: true },
        { icon: 'ph-duotone ph-stack-simple',  label: 'Lames',      value: materials.boards, unit: 'pcs' },
        { icon: 'ph-duotone ph-grid-four',     label: 'Lambourdes', value: materials.joists, unit: 'pcs' },
      ];

    case 'cabanon':
      return [
        { icon: 'ph-duotone ph-ruler',         label: 'Dimensions', value: `${width} × ${depth}`, unit: 'm' },
        { icon: 'ph-duotone ph-square-half',   label: 'Surface',    value: materials.surface ?? +(width * depth).toFixed(1), unit: 'm²', accent: true },
        { icon: 'ph-duotone ph-arrows-vertical', label: 'Hauteur',  value: materials.height ?? '2.30', unit: 'm' },
        { icon: 'ph-duotone ph-rows',          label: 'Montants',   value: materials.studCount, unit: 'pcs' },
      ];

    case 'pergola':
      return [
        { icon: 'ph-duotone ph-ruler',         label: 'Dimensions',     value: `${width} × ${depth}`, unit: 'm' },
        { icon: 'ph-duotone ph-square-half',   label: 'Surface couverte', value: area, unit: 'm²', accent: true },
        { icon: 'ph-duotone ph-rows',          label: 'Poteaux',        value: materials.posts, unit: 'pcs' },
        { icon: 'ph-duotone ph-hammer',        label: 'Chevrons',       value: materials.rafters, unit: 'pcs' },
      ];

    case 'cloture':
      return [
        { icon: 'ph-duotone ph-ruler',           label: 'Longueur', value: width, unit: 'm' },
        { icon: 'ph-duotone ph-arrows-vertical', label: 'Hauteur',  value: depth, unit: 'm' },
        { icon: 'ph-duotone ph-rows',            label: 'Poteaux',  value: materials.posts, unit: 'pcs' },
        { icon: 'ph-duotone ph-stack-simple',    label: 'Lames',    value: materials.boards, unit: 'pcs' },
      ];

    default:
      return [
        { icon: 'ph-duotone ph-ruler',       label: 'Dimensions', value: `${width} × ${depth}`, unit: 'm' },
        { icon: 'ph-duotone ph-square-half', label: 'Surface',    value: area, unit: 'm²' },
      ];
  }
}

export default function ProjectSummary({ projectType = 'terrasse', dims, materials }) {
  const meta = PROJECT_LABELS[projectType] || PROJECT_LABELS.terrasse;
  const highlights = getHighlights(projectType, dims, materials);

  return (
    <div className="proj-summary">
      <div className="proj-summary-header">
        <div className="proj-summary-icon-wrap">
          <i className={`proj-summary-icon ${meta.icon}`} aria-hidden="true" />
          <BrandIcon name={projectType} size={44} className="proj-summary-brand-icon" />
        </div>
        <div className="proj-summary-meta">
          <h2 className="proj-summary-title">{meta.title}</h2>
          <p className="proj-summary-desc">{meta.description}</p>
        </div>
        <div className="proj-summary-badge">Estimation</div>
      </div>

      <div className="proj-highlights">
        {highlights.map(h => (
          <Highlight key={h.label} {...h} />
        ))}
      </div>
    </div>
  );
}
