/**
 * seoSchemas.js — Données structurées schema.org pour les 4 modules
 *
 * Type HowTo : éligible aux rich results Google sur les requêtes
 * "comment construire une terrasse bois", "comment poser une clôture", etc.
 *
 * Utilisé dans les pages modules (JsonLd) et dans /liste (ItemList).
 * Pure data — pas de dépendance browser.
 */

/** HowTo par module — injecté en JSON-LD dans chaque page simulateur */
export const HOW_TO_SCHEMAS = {

  terrasse: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment construire une terrasse bois',
    description:
      'Guide complet pour calculer et construire une terrasse bois : choix des matériaux, calcul des lambourdes et des plots, pose des lames.',
    url: 'https://www.diy-builder.fr/calculateur',
    inLanguage: 'fr-FR',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', minValue: '600', maxValue: '3500' },
    totalTime: 'PT16H',
    supply: [
      { '@type': 'HowToSupply', name: 'Lames terrasse pin traité classe 4 (145×27 mm)' },
      { '@type': 'HowToSupply', name: 'Lambourdes 60×70 mm traité classe 4' },
      { '@type': 'HowToSupply', name: 'Plots béton réglables' },
      { '@type': 'HowToSupply', name: 'Vis inox A2 4×40 mm' },
      { '@type': 'HowToSupply', name: 'Bande bitume anti-humidité (80 mm)' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Calcul des matériaux',
        text: 'Saisissez les dimensions de votre terrasse dans le simulateur pour obtenir la liste exacte : nombre de lames, de lambourdes, de plots et estimation du budget.',
      },
      {
        '@type': 'HowToStep',
        name: 'Préparation et implantation',
        text: 'Désherbez la zone, réglez le niveau. Disposez les plots béton réglables selon le plan de pose en respectant un entraxe de 40 cm pour les lambourdes (DTU 51.4).',
      },
      {
        '@type': 'HowToStep',
        name: 'Pose des lambourdes',
        text: 'Posez les lambourdes 60×70 mm sur les plots. Glissez une bande bitume sous chaque lambourde pour isoler du contact direct. Vérifiez le niveau et l\'alignement.',
      },
      {
        '@type': 'HowToStep',
        name: 'Pose des lames de terrasse',
        text: 'Fixez les lames perpendiculairement aux lambourdes avec 2 vis inox A2 par appui. Respectez un jeu de 5 à 8 mm entre les lames pour l\'évacuation des eaux.',
      },
    ],
  },

  cabanon: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment construire un cabanon en ossature bois',
    description:
      'Guide de construction d\'un cabanon en bois : calcul des montants, lisses, chevrons, bardage et toiture mono-pente selon les règles DTU.',
    url: 'https://www.diy-builder.fr/cabanon',
    inLanguage: 'fr-FR',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', minValue: '1200', maxValue: '5000' },
    totalTime: 'PT40H',
    supply: [
      { '@type': 'HowToSupply', name: 'Montants ossature bois 90×90 mm' },
      { '@type': 'HowToSupply', name: 'Lisses hautes et basses 90×90 mm' },
      { '@type': 'HowToSupply', name: 'Chevrons 60×80 mm' },
      { '@type': 'HowToSupply', name: 'Bardage pin traité classe 4 (21×120 mm)' },
      { '@type': 'HowToSupply', name: 'Voligeage sapin 14 mm' },
      { '@type': 'HowToSupply', name: 'Membrane pare-pluie sous-toiture' },
      { '@type': 'HowToSupply', name: 'Vis inox et équerres galvanisées' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Calcul de l\'ossature',
        text: 'Utilisez le simulateur pour obtenir le nombre exact de montants (entraxe 60 cm), lisses hautes et basses, chevrons de toiture selon vos dimensions.',
      },
      {
        '@type': 'HowToStep',
        name: 'Fondations',
        text: 'Coulez des dés béton ou posez des plots réglables pour soutenir la lisse basse. Vérifiez l\'équerrage de l\'empreinte au sol.',
      },
      {
        '@type': 'HowToStep',
        name: 'Montage de l\'ossature',
        text: 'Assemblez les cadres au sol : lisse basse, montants 90×90 mm à 60 cm d\'entraxe, lisse haute. Dressez les panneaux, solidarisez les coins.',
      },
      {
        '@type': 'HowToStep',
        name: 'Toiture mono-pente',
        text: 'Posez les chevrons 60×80 mm sur les sablières. Clouez le voligeage 14 mm, puis la membrane pare-pluie. Terminez par la couverture choisie.',
      },
      {
        '@type': 'HowToStep',
        name: 'Bardage et finitions',
        text: 'Posez les lames de bardage pin traité classe 4 à l\'aide de vis inox A2. Installez porte et fenêtre dans les réservations prévues dans l\'ossature.',
      },
    ],
  },

  pergola: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment construire une pergola en bois',
    description:
      'Guide de construction d\'une pergola bois autoportée : calcul des poteaux, longerons, traverses et chevrons selon les entraxes DTU.',
    url: 'https://www.diy-builder.fr/pergola',
    inLanguage: 'fr-FR',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', minValue: '500', maxValue: '2500' },
    totalTime: 'PT12H',
    supply: [
      { '@type': 'HowToSupply', name: 'Poteaux 100×100 mm traité classe 4' },
      { '@type': 'HowToSupply', name: 'Longerons / poutres 150×50 mm' },
      { '@type': 'HowToSupply', name: 'Chevrons de couverture 80×50 mm' },
      { '@type': 'HowToSupply', name: 'Platines pied de poteau galvanisées' },
      { '@type': 'HowToSupply', name: 'Boulons M10 galvanisés' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Calcul des éléments',
        text: 'Saisissez les dimensions de votre pergola dans le simulateur pour obtenir le nombre de poteaux, de longerons et de chevrons avec les sections adaptées à la portée.',
      },
      {
        '@type': 'HowToStep',
        name: 'Ancrage des poteaux',
        text: 'Sceller les platines au sol (dallage ou massif béton). Fixer les poteaux 100×100 mm traité classe 4 sur les platines avec les boulons fournis.',
      },
      {
        '@type': 'HowToStep',
        name: 'Pose des longerons',
        text: 'Assembler les poutres 150×50 mm sur les têtes de poteaux avec des boulons M10 galvanisés. Vérifier le niveau et l\'aplomb avant serrage définitif.',
      },
      {
        '@type': 'HowToStep',
        name: 'Pose des chevrons',
        text: 'Poser les chevrons 80×50 mm perpendiculairement aux longerons à l\'entraxe calculé. Fixer avec des sabots ou des boulons selon le plan de charpente.',
      },
    ],
  },

  cloture: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment poser une clôture en bois',
    description:
      'Guide de pose d\'une clôture bois : calcul des poteaux, rails et lames, entraxes réglementaires et ancrage des poteaux en terre.',
    url: 'https://www.diy-builder.fr/cloture',
    inLanguage: 'fr-FR',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', minValue: '300', maxValue: '2000' },
    totalTime: 'PT8H',
    supply: [
      { '@type': 'HowToSupply', name: 'Poteaux 90×90 mm traité classe 4 UC4' },
      { '@type': 'HowToSupply', name: 'Rails horizontaux 45×95 mm' },
      { '@type': 'HowToSupply', name: 'Lames verticales 20×120 mm' },
      { '@type': 'HowToSupply', name: 'Béton de scellement 25 kg' },
      { '@type': 'HowToSupply', name: 'Vis inox A2' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Calcul des matériaux',
        text: 'Saisissez la longueur et la hauteur de votre clôture dans le simulateur. Vous obtenez le nombre de poteaux (entraxe 2 m), de rails et de lames nécessaires.',
      },
      {
        '@type': 'HowToStep',
        name: 'Implantation des poteaux',
        text: 'Tracez l\'alignement au cordeau. Creusez les trous de 40 à 60 cm de profondeur. Les poteaux 90×90 mm traité UC4 doivent être scellés au béton.',
      },
      {
        '@type': 'HowToStep',
        name: 'Scellement des poteaux',
        text: 'Coulez le béton de scellement autour de chaque poteau. Vérifiez la verticalité avec un niveau à bulle. Laissez sécher 24 h avant de continuer.',
      },
      {
        '@type': 'HowToStep',
        name: 'Pose des rails et des lames',
        text: 'Fixez les rails horizontaux sur les poteaux avec des vis inox. Posez ensuite les lames verticales en bois en respectant un jeu de 5 mm pour la dilatation.',
      },
    ],
  },
};

/** Labels affichés dans la page /liste */
export const PROJECT_LABELS = {
  terrasse: { label: 'Terrasse bois', unit: 'm × m', dim1: 'Largeur', dim2: 'Longueur' },
  cabanon:  { label: 'Cabanon ossature bois', unit: 'm × m', dim1: 'Largeur', dim2: 'Profondeur' },
  pergola:  { label: 'Pergola bois', unit: 'm × m', dim1: 'Largeur', dim2: 'Profondeur' },
  cloture:  { label: 'Clôture bois', unit: 'm (long.) × m (haut.)', dim1: 'Longueur', dim2: 'Hauteur' },
};

/** Dimensions par défaut par module (w, d) — source unique du 1er rendu simulateur.
 *  Consommé par useDeckSimulatorState ; chaque couple DOIT rester dans les bornes
 *  du module déclarées par boundsFor() (DeckControls.jsx), invariant sous test.
 *  Pour la clôture, d = hauteur : plafond légal courant 2,60 m, borne UI 2,20 m. */
export const PROJECT_DEFAULTS = {
  terrasse: { w: 5.5, d: 3.5 },
  cabanon:  { w: 4,   d: 3   },  // = preset « 4 × 3 » (12 m², DP) ; bornes cabanon w ≤ 5, d ≤ 4
  pergola:  { w: 5.5, d: 3.5 },
  cloture:  { w: 15,  d: 1.5 },  // 15 m de long × 1,50 m de haut
};
