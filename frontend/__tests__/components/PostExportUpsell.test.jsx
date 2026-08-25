/**
 * PostExportUpsell.test.jsx
 *
 * Le flux PDF se terminait sans étape suivante alors qu'il concentre le plus
 * gros volume du funnel — 28 exports contre 9 clics devis sur 28 jours.
 * Ces tests verrouillent le contrat de l'étape ajoutée.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostExportUpsell from '@/components/simulator/PostExportUpsell';

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
