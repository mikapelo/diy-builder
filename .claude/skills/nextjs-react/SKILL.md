# Skill — Next.js 14 / React 18 Patterns (DIY Builder)

## Contexte projet

Stack : Next.js 14 App Router, React 18, Tailwind CSS 3.4, Three.js 0.160.
Modules actifs : terrasse, cabanon, pergola, clôture.
SSR désactivé pour les composants Three.js via `dynamic(() => ..., { ssr: false })`.

---

## Patterns App Router (Next.js 14)

### Structure de page module
```jsx
// app/[module]/page.jsx — toujours un Server Component léger
import dynamic from 'next/dynamic'

const SimulatorClient = dynamic(() => import('@/components/simulator/DeckSimulator'), { ssr: false })

export default function ModulePage() {
  return <SimulatorClient />
}
```

### Règle 'use client'
- Les composants qui utilisent `useState`, `useEffect`, hooks custom → `'use client'`
- Les composants Three.js / R3F → toujours `dynamic + ssr:false`
- Ne jamais mettre `'use client'` sur un fichier d'engine (engine.js est du JS pur, côté serveur ou client indifféremment)

---

## State management

### Pattern hook custom par module
```js
// hooks/use[Module]SimulatorState.js
export function useCabanonSimulatorState() {
  const [width, setWidth] = useState(3.0)
  const [depth, setDepth] = useState(4.0)
  const [options, setOptions] = useState({ ... })
  
  // Dériver depuis l'engine — jamais stocker le résultat en state
  const structure = useMemo(() => generateCabanon(width, depth, options), [width, depth, options])
  
  return { width, depth, options, structure, setWidth, setDepth, setOptions }
}
```

**Règle :** le résultat de l'engine va dans `useMemo`, jamais dans `useState`.
Ça évite les double-renders et les états désynchronisés.

### useProjectEngine (hook générique)
```js
import { useProjectEngine } from '@/core/useProjectEngine'

const { structure, width, depth, setWidth, setDepth } = useProjectEngine('cabanon', { ... })
```

---

## Three.js / R3F patterns

### Canvas isolé par module
```jsx
// Ne jamais mettre key= sur <Canvas> — détruit le contexte WebGL
// Mettre key= sur le composant Scene pour forcer un remount propre
<Canvas>
  <CabanonScene key={sceneKey} structure={structure} sceneMode={sceneMode} />
</Canvas>
```

### InstancedMesh pour éléments répétés
```jsx
// Préférer InstancedMesh pour les montants (50+ instances)
const meshRef = useRef()
useEffect(() => {
  structure.geometry.structuralStuds.forEach((stud, i) => {
    const matrix = new THREE.Matrix4()
    matrix.setPosition(stud.x, stud.zBase + stud.height/2, stud.y)
    meshRef.current.setMatrixAt(i, matrix)
  })
  meshRef.current.instanceMatrix.needsUpdate = true
}, [structure])
```

### Visibilité vs montage conditionnel
```jsx
// ✅ Préférer visible={bool} pour garder les refs useFrame actifs
<group visible={sceneMode === 'structure'}>
  <StudsGroup ... />
</group>

// ❌ Éviter — détruit et recrée les refs Three.js
{sceneMode === 'structure' && <StudsGroup ... />}
```

---

## Tailwind CSS — conventions projet

- Design tokens dans `styles/TOKENS.md` — utiliser les variables CSS, pas de valeurs hardcodées
- Theme `[data-theme="g-v2"]` défini dans `theme-g-v2.css`
- Classes utilitaires Tailwind pour layout uniquement ; styles complexes dans les fichiers CSS séparés
- Pas de `@apply` dans les composants — uniquement dans les fichiers CSS globaux

---

## PDF Export

```js
// hooks/usePDFExport.js — hook multi-module
const { exportPDF } = usePDFExport(structure, 'cabanon')
// Déclenché par un bouton, jamais au render
```

---

## Checklist avant de créer un nouveau module

1. `modules/[nom]/engine.js` → fonction pure `generate[Nom](width, depth, options)` 
2. `modules/[nom]/config.js` → `{ id, label, icon, pdfTitle }`
3. `core/projectRegistry.js` → ajouter l'entrée
4. `app/[nom]/page.jsx` → Server Component + dynamic import
5. `components/simulator/[Nom]Viewer.jsx` + `[Nom]Scene.jsx`
6. Tests dans `__tests__/[nom]-engine.test.js`
7. E2E dans `e2e/[nom].spec.js`

---

## Erreurs fréquentes

| Erreur | Cause | Fix |
|---|---|---|
| Flash noir sur changement mode | `key` sur `<Canvas>` | Mettre `key` sur `<Scene>` |
| Z-fighting toit | Faces coplanaires | Offset normal perpendiculaire |
| Chevron fantôme | `Math.ceil + 1` | Filtrer `y <= depth` |
| State désynchronisé | Résultat engine en `useState` | Passer en `useMemo` |
| SSR crash Three.js | Manque `ssr: false` | `dynamic(() => ..., { ssr: false })` |
