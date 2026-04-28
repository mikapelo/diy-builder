# Skill — E2E Playwright + Page Object Model (DIY Builder)

## Contexte

Tests E2E Playwright dans `frontend/e2e/`.
4 modules actifs : terrasse, cabanon, pergola, clôture.
URL de base : `http://localhost:57723`

---

## Pattern Page Object Model

### Structure recommandée
```
frontend/e2e/
├── pages/
│   ├── BasePage.js          ← Classe abstraite commune
│   ├── TerrassePage.js
│   ├── CabanonPage.js
│   ├── PergolaPage.js
│   └── CloturePage.js
├── terrasse.spec.js
├── cabanon.spec.js
├── pergola.spec.js
└── cloture.spec.js
```

### BasePage — template
```js
// e2e/pages/BasePage.js
export class BasePage {
  constructor(page, path) {
    this.page = page
    this.path = path
  }

  async goto() {
    await this.page.goto(`http://localhost:57723${this.path}`)
    await this.page.waitForSelector('[data-testid="simulator-ready"]', { timeout: 10000 })
  }

  // Contrôles communs
  async setWidth(value) {
    const slider = this.page.locator('[data-testid="width-slider"]')
    await slider.fill(String(value))
    await this.page.waitForTimeout(300) // laisser le debounce engine
  }

  async setDepth(value) {
    const slider = this.page.locator('[data-testid="depth-slider"]')
    await slider.fill(String(value))
    await this.page.waitForTimeout(300)
  }

  async getResultValue(key) {
    return this.page.locator(`[data-testid="result-${key}"]`).textContent()
  }

  async switchMode(mode) {
    await this.page.locator(`[data-testid="mode-${mode}"]`).click()
  }

  async exportPDF() {
    const downloadPromise = this.page.waitForEvent('download')
    await this.page.locator('[data-testid="export-pdf"]').click()
    return downloadPromise
  }
}
```

### Module Page — exemple Cabanon
```js
// e2e/pages/CabanonPage.js
import { BasePage } from './BasePage.js'

export class CabanonPage extends BasePage {
  constructor(page) {
    super(page, '/cabanon')
    // Sélecteurs spécifiques cabanon
    this.heightSlider = page.locator('[data-testid="height-slider"]')
    this.modeStructure = page.locator('[data-testid="mode-structure"]')
    this.modePlan = page.locator('[data-testid="mode-plan"]')
  }

  async setHeight(value) {
    await this.heightSlider.fill(String(value))
    await this.page.waitForTimeout(300)
  }

  async getStudCount() {
    const text = await this.getResultValue('stud-count')
    return parseInt(text)
  }

  async switchToPlan() {
    await this.modePlan.click()
    // Mode Plan = SVG, pas de canvas
    await this.page.waitForSelector('svg[data-testid="cabanon-sketch"]')
  }
}
```

### Spec refactorisé avec POM
```js
// e2e/cabanon.spec.js
import { test, expect } from '@playwright/test'
import { CabanonPage } from './pages/CabanonPage.js'

test.describe('Simulateur Cabanon', () => {
  let cabanon

  test.beforeEach(async ({ page }) => {
    cabanon = new CabanonPage(page)
    await cabanon.goto()
  })

  test('C1 — contrôles largeur/profondeur', async () => {
    await cabanon.setWidth(4.0)
    await cabanon.setDepth(5.0)
    const surface = await cabanon.getResultValue('surface')
    expect(parseFloat(surface)).toBeCloseTo(20.0, 1)
  })

  test('C2 — switch mode Plan', async () => {
    await cabanon.switchToPlan()
    await expect(cabanon.page.locator('svg')).toBeVisible()
  })

  test('C3 — export PDF', async () => {
    const download = await cabanon.exportPDF()
    expect(download.suggestedFilename()).toContain('.pdf')
  })
})
```

---

## Conventions data-testid

Pour que le POM fonctionne, les composants React doivent exposer des `data-testid` cohérents :

| Sélecteur | Composant | Usage |
|---|---|---|
| `simulator-ready` | DeckSimulator | Signal de chargement complet |
| `width-slider` | Controls | Slider largeur |
| `depth-slider` | Controls | Slider profondeur |
| `mode-{nom}` | ViewerRouter | Boutons de mode |
| `result-{clé}` | TunnelSections | Valeurs de résultat |
| `export-pdf` | ExportPDF | Bouton export |
| `cabanon-sketch` | CabanonSketch | SVG plan |

---

## Commandes utiles

```bash
# Depuis frontend/
npm run test:e2e                    # tous les tests
npx playwright test cabanon         # module spécifique
npx playwright test --headed        # mode visuel
npx playwright test --ui            # Playwright UI mode
npx playwright show-report          # rapport HTML
```

---

## Quand utiliser ce skill

- Ajouter un nouveau module → créer `e2e/pages/[Nom]Page.js` + `e2e/[nom].spec.js`
- Refactorer un composant → vérifier que les `data-testid` sont préservés
- Débogage E2E → utiliser `--headed` + `page.pause()` pour inspection manuelle
