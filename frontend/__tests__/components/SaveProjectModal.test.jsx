/**
 * SaveProjectModal.test.jsx
 *
 * Couvre :
 *   - open=false → ne rend rien
 *   - open=true → role=dialog + aria-modal présents
 *   - Escape ferme la modale
 *   - Click overlay ferme la modale
 *   - Click panel ne ferme pas (stopPropagation)
 *   - Bouton "Fermer" appelle onClose
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SaveProjectModal from '@/components/simulator/SaveProjectModal';

describe('SaveProjectModal — visibilité', () => {
  it('open=false → ne rend rien', () => {
    const { container } = render(
      <SaveProjectModal open={false} onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('open=true → role=dialog + aria-modal', () => {
    render(
      <SaveProjectModal open onClose={vi.fn()} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText(/Bientôt disponible/i)).toBeInTheDocument();
  });
});

describe('SaveProjectModal — fermeture', () => {
  it('Escape ferme la modale', () => {
    const onClose = vi.fn();
    render(
      <SaveProjectModal open onClose={onClose} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('Click sur overlay ferme la modale', () => {
    const onClose = vi.fn();
    render(
      <SaveProjectModal open onClose={onClose} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    fireEvent.click(document.querySelector('.modal-overlay'));
    expect(onClose).toHaveBeenCalled();
  });

  it('Click sur panel ne ferme pas (stopPropagation)', () => {
    const onClose = vi.fn();
    render(
      <SaveProjectModal open onClose={onClose} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    fireEvent.click(document.querySelector('.modal-panel'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Bouton "Fermer" en bas (modal-btn--outline) déclenche onClose', () => {
    const onClose = vi.fn();
    render(
      <SaveProjectModal open onClose={onClose} projectType="terrasse" dims={{ width: 4, depth: 3 }} />,
    );
    // 2 boutons "Fermer" : le X (modal-close) et le bouton du bas (modal-btn--outline)
    fireEvent.click(document.querySelector('.modal-btn--outline'));
    expect(onClose).toHaveBeenCalled();
  });
});
