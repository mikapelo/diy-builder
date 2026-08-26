/**
 * PostExportUpsell.test.jsx
 *
 * Le flux PDF se terminait sans étape suivante alors qu'il concentre le plus
 * gros volume du funnel — 28 exports contre 9 clics devis sur 28 jours.
 * Ces tests verrouillent le contrat de l'étape ajoutée.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@/hooks/useAnalytics.js', () => ({
  trackUpsellShown: vi.fn(),
  trackUpsellDeclined: vi.fn(),
}));

import PostExportUpsell from '@/components/simulator/PostExportUpsell';
import { trackUpsellShown, trackUpsellDeclined } from '@/hooks/useAnalytics.js';

beforeEach(() => { vi.clearAllMocks(); });

const props = { projectType: 'terrasse', dims: { width: 4.5, depth: 3, area: 13.5 } };

describe('PostExportUpsell', () => {
  it('fermé → ne rend rien', () => {
    const { container } = render(
      <PostExportUpsell open={false} onDecline={vi.fn()} onAccept={vi.fn()} {...props} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('ouvert → dialogue accessible et projet rappelé', () => {
    render(<PostExportUpsell open onDecline={vi.fn()} onAccept={vi.fn()} {...props} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText(/Dossier téléchargé/i)).toBeInTheDocument();
    expect(screen.getByText(/Terrasse bois — 4.5 m × 3 m/)).toBeInTheDocument();
  });

  it('« Demander un devis gratuit » appelle onAccept', () => {
    const onAccept = vi.fn();
    render(<PostExportUpsell open onDecline={vi.fn()} onAccept={onAccept} {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /Demander un devis gratuit/i }));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('refus neutre, jamais culpabilisant', () => {
    const onDecline = vi.fn();
    render(<PostExportUpsell open onDecline={onDecline} onAccept={vi.fn()} {...props} />);
    const refus = screen.getByRole('button', { name: /^Non merci$/i });
    fireEvent.click(refus);
    expect(onDecline).toHaveBeenCalledTimes(1);
  });

  it('Échap et clic sur le fond valent refus', () => {
    const onDecline = vi.fn();
    const { container } = render(
      <PostExportUpsell open onDecline={onDecline} onAccept={vi.fn()} {...props} />,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(container.querySelector('.modal-overlay'));
    expect(onDecline).toHaveBeenCalledTimes(2);
  });

  it('sans dimensions, aucune puce projet inventée', () => {
    render(<PostExportUpsell open onDecline={vi.fn()} onAccept={vi.fn()} projectType="pergola" dims={null} />);
    expect(document.querySelector('.modal-project-chip')).toBeNull();
  });
});

/* D-4 (audit tracking du 26/08/2026) — l'étape était livrée sans instrument sur
   ses issues : on voyait les acceptations, ni les affichages ni les refus. Son
   taux d'acceptation n'était donc pas calculable, seulement encadrable par le
   nombre d'exports — qui comptait alors les tentatives, pas les réussites.

   L'identité que ces tests verrouillent :
     upsell-shown = upsell-declined + acceptations + sorties sans choix          */
describe('PostExportUpsell — les deux issues sont mesurées', () => {
  const props2 = { projectType: 'pergola', dims: { width: 5, depth: 2.5, area: 12.5 } };

  it('fermé → aucun affichage compté', () => {
    render(<PostExportUpsell open={false} onDecline={vi.fn()} onAccept={vi.fn()} {...props2} />);
    expect(trackUpsellShown).not.toHaveBeenCalled();
  });

  it('affichage compté une seule fois, avec le module', () => {
    const { rerender } = render(
      <PostExportUpsell open onDecline={vi.fn()} onAccept={vi.fn()} {...props2} />,
    );
    rerender(<PostExportUpsell open onDecline={vi.fn()} onAccept={vi.fn()} {...props2} />);
    expect(trackUpsellShown).toHaveBeenCalledTimes(1);
    expect(trackUpsellShown).toHaveBeenCalledWith({ module: 'pergola' });
  });

  it.each([
    ['« Non merci »',    (c) => fireEvent.click(screen.getByRole('button', { name: /^Non merci$/i }))],
    ['la croix',         (c) => fireEvent.click(screen.getByLabelText('Fermer'))],
    ['le clic au fond',  (c) => fireEvent.click(c.querySelector('.modal-overlay'))],
    ['Échap',            () => fireEvent.keyDown(window, { key: 'Escape' })],
  ])('refus par %s → compté une fois, et onDecline appelé', (_libelle, sortir) => {
    const onDecline = vi.fn();
    const { container } = render(
      <PostExportUpsell open onDecline={onDecline} onAccept={vi.fn()} {...props2} />,
    );
    sortir(container);
    expect(trackUpsellDeclined).toHaveBeenCalledTimes(1);
    expect(trackUpsellDeclined).toHaveBeenCalledWith({ module: 'pergola' });
    expect(onDecline).toHaveBeenCalledTimes(1);
  });

  it('accepter n\'est pas un refus — le devis-click du parent s\'en charge', () => {
    render(<PostExportUpsell open onDecline={vi.fn()} onAccept={vi.fn()} {...props2} />);
    fireEvent.click(screen.getByRole('button', { name: /Demander un devis gratuit/i }));
    expect(trackUpsellDeclined).not.toHaveBeenCalled();
  });
});
