# Rules — React 18 (DIY Builder)

Ces règles s'appliquent à tous les composants React du projet.

## State & Rendering

- **Ne jamais stocker le résultat d'un engine en `useState`** — utiliser `useMemo` avec les inputs comme dépendances
- **Dériver plutôt que synchroniser** — si une valeur peut être calculée depuis le state, ne pas la stocker
- **`useEffect` pour les effets de bord uniquement** — pas de logique métier dans useEffect
- **Clés stables** — ne jamais utiliser l'index de tableau comme `key` sur des listes réordonnables

## Three.js / R3F

- **`visible={bool}` plutôt que `{condition && <Component>}`** pour les groupes Three.js (préserve les refs et useFrame)
- **`key` sur `<Scene>`, jamais sur `<Canvas>`** — sinon le contexte WebGL est détruit (flash noir)
- **InstancedMesh pour >10 objets identiques** — ne pas créer N `<mesh>` séparés pour les montants ou chevrons
- **Cleanup dans useEffect** — toujours disposer les géométries et matériaux créés manuellement

## Composants

- **Pas de logique de calcul dans les composants** — les composants reçoivent les données calculées, ils n'appellent pas les engines directement (sauf via hooks)
- **Props atomiques plutôt que objects entiers** — préférer `width={w} depth={d}` à `dims={{width, depth}}`
- **`'use client'` au minimum** — ne marquer `'use client'` que les composants qui en ont réellement besoin
- **Dynamic import pour Three.js** — `dynamic(() => import(...), { ssr: false })` obligatoire

## Performance

- **Ne pas créer d'objets dans le render** — `new THREE.Vector3()` dans le render = fuite mémoire
- **Memoizer les callbacks passés aux enfants** — `useCallback` pour éviter les re-renders inutiles sur les sliders
- **Debounce les inputs slider** — 150-300ms avant de recalculer l'engine

## Conventions projet

- Fichiers composants : PascalCase (ex: `CabanonScene.jsx`)
- Hooks custom : camelCase préfixé `use` (ex: `useCabanonSimulatorState.js`)
- Engines : camelCase (ex: `generateCabanon`)
- Constants : SCREAMING_SNAKE_CASE (ex: `STUD_SPACING`)
