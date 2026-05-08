/**
 * EmailGateModal.test.jsx
 *
 * Couvre :
 *   - Rendu initial avec dimensions
 *   - Email vide → erreur, pas d'appel API
 *   - Email invalide → erreur formaté, pas d'appel API
 *   - Email valide → fetch /api/leads + onConfirm + localStorage
 *   - Escape ferme la modale
 *   - role="dialog", aria-modal, aria-labelledby présents
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailGateModal from '@/components/ui/EmailGateModal';

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: async () => ({ ok: true }) }));
  if (typeof localStorage !== 'undefined') localStorage.clear();
});

describe('EmailGateModal — accessibilité', () => {
  it('rend role=dialog, aria-modal, aria-labelledby', () => {
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={vi.fn()} onClose={vi.fn()} />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('Escape ferme la modale', () => {
    const onClose = vi.fn();
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={vi.fn()} onClose={onClose} />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

describe('EmailGateModal — validation email', () => {
  it('email vide → required HTML5 empêche submit (pas de fetch)', async () => {
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={vi.fn()} onClose={vi.fn()} />,
    );
    const submit = screen.getByRole('button', { name: /Télécharger mon devis PDF/i });
    fireEvent.click(submit);
    // HTML5 required bloque la soumission, fetch n'est pas appelé
    await new Promise(r => setTimeout(r, 50));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('email invalide → erreur affichée, pas de fetch', async () => {
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={vi.fn()} onClose={vi.fn()} defaultEmail="invalide" />,
    );
    const form = document.querySelector('form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('EmailGateModal — flux nominal', () => {
  it('email valide → fetch /api/leads + onConfirm + localStorage', async () => {
    const onConfirm = vi.fn();
    render(
      <EmailGateModal projectType="cabanon" dims={{ width: 3, depth: 4 }}
        onConfirm={onConfirm} onClose={vi.fn()} defaultEmail="user@example.fr" />,
    );
    const form = document.querySelector('form');
    fireEvent.submit(form);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toBe('/api/leads');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.email).toBe('user@example.fr');
    expect(body.projectType).toBe('cabanon');
    expect(body.dims).toEqual({ width: 3, depth: 4 });
    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith('user@example.fr'));
    expect(localStorage.getItem('diy_lead_email')).toBe('user@example.fr');
  });

  it('fetch échoue → onConfirm est quand même appelé (téléchargement non bloqué)', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network')));
    const onConfirm = vi.fn();
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={onConfirm} onClose={vi.fn()} defaultEmail="user@example.fr" />,
    );
    fireEvent.submit(document.querySelector('form'));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith('user@example.fr'));
  });
});
