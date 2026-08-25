/**
 * CTALead.test.jsx
 *
 * Audit CTA devis du 25/08/2026 : quand `projectHref` ne désignait aucun
 * simulateur, le composant retombait sur un simple lien — sans modale et sans
 * événement. Trois pages étaient concernées, dont les deux à plus forte
 * intention « confier à un pro » : /guides/soi-meme-ou-pro et
 * /guides/comparer-devis-travaux. Elles n'avaient donc AUCUN CTA devis.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@/hooks/useAnalytics.js', () => ({
  trackDevisClick: vi.fn(),
  trackLeadSubmitted: vi.fn(),
  trackArtisanModalOpen: vi.fn(),
  trackArtisanModalAbandon: vi.fn(),
}));

import CTALead from '@/components/landing/CTALead';
import { trackDevisClick } from '@/hooks/useAnalytics.js';

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => ({ ok: true }) }));
});

const bouton = () => screen.getByRole('button', { name: /Demander un devis gratuit/i });

describe('CTALead — avec simulateur associé', () => {
  it('ouvre la modale et trace le module réel', () => {
    render(<CTALead projectHref="/cloture" projectLabel="ma clôture" />);
    fireEvent.click(bouton());
    expect(trackDevisClick).toHaveBeenCalledWith({ module: 'cloture', placement: 'guide' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('le lien secondaire pointe vers le simulateur', () => {
    render(<CTALead projectHref="/pergola" projectLabel="ma pergola" />);
    expect(screen.getByRole('link', { name: /calculer ma pergola/i })).toHaveAttribute('href', '/pergola');
  });
});

describe('CTALead — sans simulateur associé (pages génériques)', () => {
  it.each(['/', '/guides/soi-meme-ou-pro'])(
    'projectHref="%s" → bouton devis présent, pas un simple lien',
    (href) => {
      render(<CTALead projectHref={href} projectLabel="mon projet" />);
      expect(bouton()).toBeInTheDocument();
    },
  );

  it('ouvre bien la modale et la trace sous « generique »', () => {
    render(<CTALead projectHref="/" projectLabel="mon projet" />);
    fireEvent.click(bouton());
    expect(trackDevisClick).toHaveBeenCalledWith({ module: 'generique', placement: 'guide' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('sans dimensions, la modale ne promet pas de dossier joint', () => {
    render(<CTALead projectHref="/" projectLabel="mon projet" />);
    fireEvent.click(bouton());
    expect(screen.queryByText(/dossier projet/i)).not.toBeInTheDocument();
    expect(screen.getByText(/plus la demande est précise/i)).toBeInTheDocument();
  });

  it('le lien secondaire retombe sur l\'accueil, jamais sur un guide', () => {
    render(<CTALead projectHref="/guides/soi-meme-ou-pro" projectLabel="mon projet" />);
    expect(screen.getByRole('link', { name: /calculer mon projet/i })).toHaveAttribute('href', '/');
  });
});
