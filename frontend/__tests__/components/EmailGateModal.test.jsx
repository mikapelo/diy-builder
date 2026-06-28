/**
 * EmailGateModal.test.jsx
 *
 * Couvre :
 *   - Rendu initial avec dimensions
 *   - Email vide → required HTML5 empêche submit, onConfirm pas appelé
 *   - Email invalide → erreur formatée, onConfirm pas appelé
 *   - Email valide → onConfirm + localStorage, SANS POST /api/leads
 *     (le POST appartient à usePDFExport, qui l'envoie une seule fois avec le PDF)
 *   - Double soumission → onConfirm appelé une seule fois (garde anti double-write)
 *   - Escape ferme la modale
 *   - role="dialog", aria-modal, aria-labelledby présents
 */
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailGateModal from '@/components/ui/EmailGateModal';

beforeEach(() => {
  vi.clearAllMocks();
  // Le modal ne doit JAMAIS appeler fetch : on mocke pour détecter toute régression.
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
  it('email vide → required HTML5 empêche submit (onConfirm pas appelé)', async () => {
    const onConfirm = vi.fn();
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={onConfirm} onClose={vi.fn()} />,
    );
    const submit = screen.getByRole('button', { name: /Télécharger mon devis PDF/i });
    fireEvent.click(submit);
    await new Promise(r => setTimeout(r, 50));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('email invalide → erreur affichée, onConfirm pas appelé', async () => {
    const onConfirm = vi.fn();
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={onConfirm} onClose={vi.fn()} defaultEmail="invalide" />,
    );
    const form = document.querySelector('form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
    expect(onConfirm).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('EmailGateModal — flux nominal', () => {
  it('email valide → onConfirm + localStorage, SANS POST /api/leads', async () => {
    const onConfirm = vi.fn();
    render(
      <EmailGateModal projectType="cabanon" dims={{ width: 3, depth: 4 }}
        onConfirm={onConfirm} onClose={vi.fn()} defaultEmail="user@example.fr" />,
    );
    const form = document.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith('user@example.fr'));
    expect(localStorage.getItem('diy_lead_email')).toBe('user@example.fr');
    // Le lead (avec PDF) est posté par usePDFExport, pas par la modale.
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('double soumission rapide → onConfirm appelé une seule fois (anti double-write)', async () => {
    const onConfirm = vi.fn();
    render(
      <EmailGateModal projectType="terrasse" dims={{ width: 4, depth: 3 }}
        onConfirm={onConfirm} onClose={vi.fn()} defaultEmail="user@example.fr" />,
    );
    const form = document.querySelector('form');
    fireEvent.submit(form);
    fireEvent.submit(form);

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
  });
});
