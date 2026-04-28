// @vitest-environment jsdom
/**
 * DeckControls.test.jsx
 *
 * Teste le composant de contrôles du simulateur :
 *   - affichage des labels dimensions
 *   - surface calculée affichée
 *   - champ Hauteur conditionnel (showHeight)
 *   - sélecteur de fenêtre conditionnel (showWindow + windowPresets)
 *   - type de support (Sol direct / Chape béton)
 *   - section Épaisseur dalle visible uniquement si foundationType='slab'
 *   - résumé dalle visible si slab.betonVolume > 0
 *
 * Pas de Three.js. Tests DOM purs.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import DeckControls from '@/components/simulator/DeckControls.jsx';

afterEach(cleanup);

/* ── Props minimales valides ──────────────────────────────────── */
const BASE_PROPS = {
  width: 5.5,
  depth: 3.5,
  area:  19.25,
  setWidth: vi.fn(),
  setDepth: vi.fn(),
  foundationType: 'ground',
  setFoundationType: vi.fn(),
  slabThickness: 12,
  setSlabThickness: vi.fn(),
  slab: null,
};

const WINDOW_PRESETS = {
  none:     { label: 'Pas de fenêtre'  },
  '60x60':  { label: '60 × 60 cm'     },
  '80x100': { label: '80 × 100 cm'    },
};

describe('DeckControls — affichage de base', () => {
  it('affiche le titre "Dimensions"', () => {
    render(<DeckControls {...BASE_PROPS} />);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
  });

  it('affiche les labels Largeur et Profondeur', () => {
    render(<DeckControls {...BASE_PROPS} />);
    expect(screen.getByText('Largeur')).toBeInTheDocument();
    expect(screen.getByText('Profondeur')).toBeInTheDocument();
  });

  it('affiche la surface calculée', () => {
    render(<DeckControls {...BASE_PROPS} />);
    expect(screen.getByText('19.25')).toBeInTheDocument();
  });

  it('affiche les deux options de support', () => {
    render(<DeckControls {...BASE_PROPS} />);
    expect(screen.getByText(/sol direct/i)).toBeInTheDocument();
    expect(screen.getByText(/chape béton/i)).toBeInTheDocument();
  });
});

describe('DeckControls — champ Hauteur conditionnel', () => {
  it("n'affiche pas le champ Hauteur par défaut (showHeight=false)", () => {
    render(<DeckControls {...BASE_PROPS} />);
    expect(screen.queryByText('Hauteur')).not.toBeInTheDocument();
  });

  it('affiche le champ Hauteur si showHeight=true', () => {
    render(<DeckControls {...BASE_PROPS} showHeight height={2.3} setHeight={vi.fn()} />);
    expect(screen.getByText('Hauteur')).toBeInTheDocument();
  });

  it('sous-titre adapté si showHeight=true (cabanon/pergola)', () => {
    render(<DeckControls {...BASE_PROPS} showHeight height={2.3} setHeight={vi.fn()} />);
    // Le sous-titre change selon la version des contrôles (presets ou classique)
    const subtitle = document.querySelector('.sim-section-subtitle');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.textContent).not.toMatch(/largeur et profondeur de la terrasse/i);
  });

  it('sous-titre mentionne uniquement la terrasse si showHeight=false', () => {
    render(<DeckControls {...BASE_PROPS} />);
    expect(screen.getByText(/largeur et profondeur de la terrasse/i)).toBeInTheDocument();
  });
});

describe('DeckControls — sélecteur de fenêtre conditionnel', () => {
  it("n'affiche pas le sélecteur de fenêtre par défaut (showWindow=false)", () => {
    render(<DeckControls {...BASE_PROPS} />);
    expect(screen.queryByText('Fenêtre')).not.toBeInTheDocument();
  });

  it('affiche le sélecteur de fenêtre si showWindow=true', () => {
    render(
      <DeckControls
        {...BASE_PROPS}
        showWindow
        windowPreset="none"
        setWindowPreset={vi.fn()}
        windowPresets={WINDOW_PRESETS}
      />
    );
    expect(screen.getByText('Fenêtre')).toBeInTheDocument();
  });

  it('affiche les labels de tous les presets', () => {
    render(
      <DeckControls
        {...BASE_PROPS}
        showWindow
        windowPreset="none"
        setWindowPreset={vi.fn()}
        windowPresets={WINDOW_PRESETS}
      />
    );
    expect(screen.getByText('Pas de fenêtre')).toBeInTheDocument();
    expect(screen.getByText('60 × 60 cm')).toBeInTheDocument();
    expect(screen.getByText('80 × 100 cm')).toBeInTheDocument();
  });
});

describe('DeckControls — section chape béton', () => {
  it("n'affiche pas l'épaisseur dalle si foundationType='ground'", () => {
    render(<DeckControls {...BASE_PROPS} foundationType="ground" />);
    expect(screen.queryByText(/épaisseur dalle/i)).not.toBeInTheDocument();
  });

  it("affiche l'épaisseur dalle si foundationType='slab'", () => {
    render(<DeckControls {...BASE_PROPS} foundationType="slab" />);
    expect(screen.getByText(/épaisseur dalle/i)).toBeInTheDocument();
  });

  it("n'affiche pas le résumé béton si slab=null", () => {
    render(<DeckControls {...BASE_PROPS} foundationType="slab" slab={null} />);
    expect(screen.queryByText(/volume béton/i)).not.toBeInTheDocument();
  });

  it("n'affiche pas le résumé béton si betonVolume=0", () => {
    render(<DeckControls {...BASE_PROPS} foundationType="slab" slab={{ betonVolume: 0 }} />);
    expect(screen.queryByText(/volume béton/i)).not.toBeInTheDocument();
  });

  it('affiche le résumé béton si slab.betonVolume > 0', () => {
    render(
      <DeckControls
        {...BASE_PROPS}
        foundationType="slab"
        slab={{ betonVolume: 2.5, totalPrice: 850 }}
      />
    );
    expect(screen.getByText(/volume béton/i)).toBeInTheDocument();
    expect(screen.getByText('2.5 m³')).toBeInTheDocument();
  });

  it('affiche le coût total fondation dans le résumé dalle', () => {
    render(
      <DeckControls
        {...BASE_PROPS}
        foundationType="slab"
        slab={{ betonVolume: 2.5, totalPrice: 850 }}
      />
    );
    expect(screen.getByText('850.00 €')).toBeInTheDocument();
  });
});

describe('DeckControls — Pergola (projectType="pergola")', () => {
  const PERGOLA_PROPS = {
    ...BASE_PROPS,
    projectType: 'pergola',
    showHeight: true,
    height: 2.3,
    setHeight: vi.fn(),
  };

  it("n'affiche PAS les presets cabanon ('2 × 2', '5 × 4', ...) en mode pergola", () => {
    render(<DeckControls {...PERGOLA_PROPS} />);
    expect(screen.queryByText('2 × 2')).not.toBeInTheDocument();
    expect(screen.queryByText('5 × 4')).not.toBeInTheDocument();
    expect(screen.queryByText(/sans formalité/i)).not.toBeInTheDocument();
  });

  it("n'affiche PAS le toggle 'Formats / Sur mesure' en mode pergola", () => {
    render(<DeckControls {...PERGOLA_PROPS} />);
    expect(screen.queryByText('Formats')).not.toBeInTheDocument();
    expect(screen.queryByText('Sur mesure')).not.toBeInTheDocument();
  });

  it("autorise les steppers jusqu'à 10m en largeur (PERGOLA_BOUNDS)", () => {
    render(<DeckControls {...PERGOLA_PROPS} width={10} depth={6} />);
    const ranges = document.querySelectorAll('input[type="range"]');
    // Premier range = largeur, deuxième = profondeur, troisième = hauteur
    expect(ranges[0].getAttribute('max')).toBe('10');
    expect(ranges[1].getAttribute('max')).toBe('6');
  });

  it('affiche le seuil administratif (PC/DP) pour pergola', () => {
    render(<DeckControls {...PERGOLA_PROPS} area={19} />);
    expect(screen.getByText(/déclaration préalable/i)).toBeInTheDocument();
  });

  it('affiche un texte PLU-specific quand surface > 20m² pour pergola', () => {
    render(<DeckControls {...PERGOLA_PROPS} width={5} depth={5} area={25} />);
    // Texte pergola = "DP ou PC selon votre PLU" (≠ "Permis de construire probable" cabanon)
    expect(screen.getByText(/dp ou pc/i)).toBeInTheDocument();
    expect(screen.queryByText(/permis de construire probable/i)).not.toBeInTheDocument();
  });
});

describe('DeckControls — Cabanon vs Pergola : seuil > 20m²', () => {
  it('cabanon affiche "Permis de construire probable" au-dessus de 20m²', () => {
    render(
      <DeckControls
        {...BASE_PROPS}
        projectType="cabanon"
        showHeight
        height={2.3}
        setHeight={vi.fn()}
        width={5}
        depth={5}
        area={25}
      />,
    );
    expect(screen.getByText(/permis de construire probable/i)).toBeInTheDocument();
  });
});

describe('DeckControls — interactions boutons stepper', () => {
  it('le clic sur + appelle setWidth', () => {
    const setWidth = vi.fn();
    render(<DeckControls {...BASE_PROPS} setWidth={setWidth} />);
    // Le bouton + de Largeur est le 2e bouton (−, +, −, +)
    const btns = screen.getAllByText('+');
    fireEvent.click(btns[0]); // premier "+" = largeur
    expect(setWidth).toHaveBeenCalledOnce();
  });

  it('le clic sur − appelle setDepth', () => {
    const setDepth = vi.fn();
    render(<DeckControls {...BASE_PROPS} setDepth={setDepth} />);
    const btns = screen.getAllByText('−');
    fireEvent.click(btns[1]); // deuxième "−" = profondeur
    expect(setDepth).toHaveBeenCalledOnce();
  });
});
