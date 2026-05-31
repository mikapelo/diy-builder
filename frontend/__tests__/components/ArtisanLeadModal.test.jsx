/**
 * ArtisanLeadModal.test.jsx
 *
 * Couvre :
 *   - open=false → ne rend rien
 *   - role=dialog + aria-modal présents
 *   - Submit sans téléphone → erreur "Numéro requis", pas d'appel API
 *   - Submit sans code postal → erreur "Code postal requis"
 *   - Email invalide → erreur "Email invalide"
 *   - Submit complet (consentement coché) → fetch /api/artisan-lead avec bons champs
 *   - Erreur serveur → status error affiché
 *
 * Note : la soumission requiert le consentement explicite RGPD (case
 * non précochée). Les tests de flux nominal cochent donc `alm-consent`.
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArtisanLeadModal from '@/components/simulator/ArtisanLeadModal';

// Mock useAnalytics pour éviter le tracking dans les tests
vi.mock('@/hooks/useAnalytics.js', () => ({
  trackLeadSubmitted: vi.fn(),
  trackArtisanModalOpen: vi.fn(),
  trackArtisanModalAbandon: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => ({ ok: true }) }));
});

describe('ArtisanLeadModal — visibilité', () => {
  it('open=false → ne rend rien', () => {
    const { container } = render(
      <ArtisanLeadModal open={false} onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('open=true → role=dialog + aria-modal', () => {
    render(
      <ArtisanLeadModal open onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});

describe('ArtisanLeadModal — validation', () => {
  function getInput(id) { return document.getElementById(id); }

  it('phone vide → erreur "Numéro requis", pas d\'appel API', async () => {
    render(
      <ArtisanLeadModal open onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    fireEvent.change(getInput('alm-zip'), { target: { value: '75001' } });
    fireEvent.submit(document.querySelector('form'));
    await waitFor(() => {
      expect(screen.getByText(/Numéro requis/i)).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('zipCode vide → erreur "Code postal requis"', async () => {
    render(
      <ArtisanLeadModal open onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    fireEvent.change(getInput('alm-phone'), { target: { value: '0612345678' } });
    fireEvent.submit(document.querySelector('form'));
    await waitFor(() => {
      expect(screen.getByText(/Code postal requis/i)).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('email invalide (avec phone+zip valides) → erreur "Email invalide"', async () => {
    render(
      <ArtisanLeadModal open onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    fireEvent.change(getInput('alm-phone'), { target: { value: '0612345678' } });
    fireEvent.change(getInput('alm-zip'), { target: { value: '75001' } });
    fireEvent.change(getInput('alm-email'), { target: { value: 'pas-un-email' } });
    fireEvent.submit(document.querySelector('form'));
    await waitFor(() => {
      expect(screen.getByText(/Email invalide/i)).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('consentement non coché (phone+zip valides) → pas d\'appel API', async () => {
    render(
      <ArtisanLeadModal open onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    // La case de consentement RGPD doit être non précochée par défaut.
    expect(getInput('alm-consent').checked).toBe(false);
    fireEvent.change(getInput('alm-phone'), { target: { value: '0612345678' } });
    fireEvent.change(getInput('alm-zip'), { target: { value: '75001' } });
    fireEvent.submit(document.querySelector('form'));
    await waitFor(() => {
      expect(screen.getByText(/accord est nécessaire/i)).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('ArtisanLeadModal — flux nominal', () => {
  it('submit complet → fetch /api/artisan-lead avec les bons champs', async () => {
    render(
      <ArtisanLeadModal open onClose={vi.fn()} projectType="cabanon" dims={{ width: 3, depth: 4, area: 12 }} />,
    );
    fireEvent.change(document.getElementById('alm-phone'), { target: { value: '0612345678' } });
    fireEvent.change(document.getElementById('alm-zip'), { target: { value: '75001' } });
    fireEvent.change(document.getElementById('alm-email'), { target: { value: 'jean@exemple.fr' } });
    fireEvent.click(document.getElementById('alm-consent'));
    fireEvent.submit(document.querySelector('form'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toBe('/api/artisan-lead');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.phone).toBe('0612345678');
    expect(body.zipCode).toBe('75001');
    expect(body.email).toBe('jean@exemple.fr');
    expect(body.projectType).toBe('cabanon');
    expect(body.dims).toEqual({ width: 3, depth: 4, area: 12 });
  });

  it('erreur serveur → status error annoncé via role=alert', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    render(
      <ArtisanLeadModal open onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    fireEvent.change(document.getElementById('alm-phone'), { target: { value: '0612345678' } });
    fireEvent.change(document.getElementById('alm-zip'), { target: { value: '75001' } });
    fireEvent.click(document.getElementById('alm-consent'));
    fireEvent.submit(document.querySelector('form'));
    await waitFor(() => {
      expect(screen.getByText(/Une erreur est survenue/i)).toBeInTheDocument();
    });
  });
});
