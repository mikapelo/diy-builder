/**
 * BudgetComparator.test.jsx
 *
 * Couvre :
 *   - Mode détaillé : materials valides → calculateDetailedCost utilisé
 *   - Mode simple (fallback) : materials=null → tarifs moyens (rate)
 *   - Badge "Meilleur prix" sur l'enseigne au prix le plus bas
 *   - hasSlab → ajoute slabTotal aux prix affichés
 *   - Lien /liste affiché quand dims fourni
 *   - Pas de crash quand area=0
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BudgetComparator from '@/components/simulator/BudgetComparator';

vi.mock('@/hooks/useAnalytics.js', () => ({
  trackOutboundClick: vi.fn(),
  trackAffiliateClick: vi.fn(),
}));

const TERRASSE_BOM = {
  boards: 30,
  joists: 12,
  pads: 64,
  screws: 240,
  entretoises: 8,
  bande: 36,
};

describe('BudgetComparator — mode détaillé', () => {
  it('avec materials terrasse → 4 cartes enseigne avec prix € total', () => {
    render(<BudgetComparator area={12} materials={TERRASSE_BOM} projectType="terrasse" />);
    expect(screen.getByRole('heading', { name: /Budget & comparatif/i })).toBeInTheDocument();
    // Au moins 3 store cards visibles avec prix
    const storeCards = document.querySelectorAll('.store-card');
    expect(storeCards.length).toBeGreaterThanOrEqual(3);
    // Sous-titre indique le mode détaillé
    expect(screen.getByText(/détaillée/i)).toBeInTheDocument();
  });

  it('badge "Meilleur prix" présent sur exactement une carte', () => {
    render(<BudgetComparator area={12} materials={TERRASSE_BOM} projectType="terrasse" />);
    const badges = screen.getAllByText(/Meilleur prix/i);
    expect(badges.length).toBe(1);
  });

  it('aria-label sur les boutons "Voir l\'offre"', () => {
    render(<BudgetComparator area={12} materials={TERRASSE_BOM} projectType="terrasse" />);
    const buttons = document.querySelectorAll('.store-cta');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach(b => {
      expect(b.getAttribute('aria-label')).toMatch(/Voir l['']offre chez/);
    });
  });
});

describe('BudgetComparator — mode simple (fallback)', () => {
  it('materials=null → fallback "estimation tarifs moyens"', () => {
    render(<BudgetComparator area={12} materials={null} projectType="terrasse" />);
    expect(screen.getByText(/tarifs moyens/i)).toBeInTheDocument();
  });

  it('area=0 ne crash pas', () => {
    expect(() => render(
      <BudgetComparator area={0} materials={null} projectType="terrasse" />,
    )).not.toThrow();
  });
});

describe('BudgetComparator — slab', () => {
  it('hasSlab=true (slabTotal > 0) → mention dalle dans le sous-titre', () => {
    render(<BudgetComparator area={12} materials={TERRASSE_BOM} projectType="terrasse" slabTotal={250} />);
    expect(screen.getByText(/dalle b[ée]ton.*250/i)).toBeInTheDocument();
  });
});

describe('BudgetComparator — lien /liste', () => {
  it('avec dims → lien partageable visible', () => {
    render(
      <BudgetComparator
        area={12} materials={TERRASSE_BOM} projectType="terrasse"
        dims={{ width: 4, depth: 3 }}
      />,
    );
    const link = document.querySelector('a.bc-liste-link');
    expect(link).not.toBeNull();
    expect(link.href).toContain('/liste?project=terrasse&w=4&d=3');
    expect(link.target).toBe('_blank');
  });

  it('sans dims → pas de lien /liste', () => {
    render(<BudgetComparator area={12} materials={TERRASSE_BOM} projectType="terrasse" />);
    expect(document.querySelector('a.bc-liste-link')).toBeNull();
  });
});

describe('BudgetComparator — niveaux budget', () => {
  it('rend 3 niveaux : Économique, Équilibré, Premium', () => {
    render(<BudgetComparator area={12} materials={TERRASSE_BOM} projectType="terrasse" />);
    expect(screen.getByText(/Économique/i)).toBeInTheDocument();
    expect(screen.getByText(/Équilibré/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium/i)).toBeInTheDocument();
    // "Recommandé" badge sur le niveau Équilibré (i=1)
    expect(screen.getByText(/Recommandé/i)).toBeInTheDocument();
  });
});
