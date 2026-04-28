/**
 * projectTime.js — Estimation du temps de réalisation + checklists chantier
 *
 * Formules basées sur des moyennes de chantiers DIY réels (retours forums et blogs).
 * Pas de DTU pour la durée — ce sont des estimations orientées week-end solo/duo.
 *
 * Hypothèses :
 *   - Solo : bricoleur expérimenté, bonne organisation
 *   - Duo  : facteur 0.62 (les deux personnes ne travaillent pas toujours en parallèle)
 *   - Heure de travail effectif = 6h/jour (pauses, mesures, ajustements)
 *   - Un "jour" = 1 journée complète de chantier, une "½ journée" = 3h
 */

/* ── Unités ── */
const EFFECTIVE_HOURS_PER_DAY = 6;
const DUO_FACTOR = 0.62;

function toDays(hours) {
  return hours / EFFECTIVE_HOURS_PER_DAY;
}

function roundToHalf(days) {
  return Math.max(0.5, Math.round(days * 2) / 2);
}

function daysLabel(days) {
  if (days <= 0.5) return '½ journée';
  if (days === 1)  return '1 journée';
  if (days === 1.5) return '1 journée ½';
  if (days === 2)  return '2 journées';
  if (days === 2.5) return '2 journées ½';
  return `${days} journées`;
}

/* ── Calcul par module ── */

function computeTerrasse(width, depth) {
  const area = width * depth;
  // 1h prépa + 0.7h/m² pose lames+vis + 1h finitions
  const rawHours = 1 + area * 0.7 + 1;
  return Math.max(3, rawHours);
}

function computeCabanon(width, depth, height) {
  const area = width * depth;
  const perim = (width + depth) * 2;
  // 3h fondations + ossature (montants entraxe 60cm) + toiture + bardage
  const rawHours = 3 + perim * height * 0.55 + area * 1.1 + 4;
  return Math.max(8, rawHours);
}

function computePergola(width, depth) {
  const area = width * depth;
  // 3h scellement poteaux + longerons + chevrons
  const rawHours = 3 + area * 0.55 + 1;
  return Math.max(4, rawHours);
}

function computeCloture(width) {
  // width = longueur linéaire en mètres
  // 0.5h prépa + 1.5h/ml poteaux+rails + 0.6h/ml lames
  const rawHours = 0.5 + width * 1.5 + width * 0.6;
  return Math.max(2, rawHours);
}

/**
 * Calcule le temps de réalisation estimé pour un projet.
 *
 * @param {string} projectType
 * @param {number} width   — largeur (m) ou longueur pour clôture
 * @param {number} depth   — profondeur (m)
 * @param {number} height  — hauteur (m, cabanon/pergola)
 * @returns {{ soloHours, duoHours, soloDays, duoDays, soloLabel, duoLabel, weekendPlan }}
 */
export function computeProjectTime(projectType, width, depth, height = 2.3) {
  let soloHours;

  if (projectType === 'terrasse')  soloHours = computeTerrasse(width, depth);
  else if (projectType === 'cabanon')  soloHours = computeCabanon(width, depth, height);
  else if (projectType === 'pergola')  soloHours = computePergola(width, depth);
  else if (projectType === 'cloture')  soloHours = computeCloture(width);
  else soloHours = 8;

  const duoHours  = soloHours * DUO_FACTOR;
  const soloDays  = roundToHalf(toDays(soloHours));
  const duoDays   = roundToHalf(toDays(duoHours));

  return {
    soloHours: Math.round(soloHours),
    duoHours:  Math.round(duoHours),
    soloDays,
    duoDays,
    soloLabel: daysLabel(soloDays),
    duoLabel:  daysLabel(duoDays),
    weekendPlan: buildWeekendPlan(projectType, soloDays),
  };
}

/* ── Planning week-end indicatif ── */

function buildWeekendPlan(projectType, soloDays) {
  const stages = CHECKLISTS[projectType]?.map(s => s.title) ?? [];
  if (!stages.length) return [];

  if (soloDays <= 1) {
    return [
      { moment: 'Matin', tasks: stages.slice(0, Math.ceil(stages.length / 2)) },
      { moment: 'Après-midi', tasks: stages.slice(Math.ceil(stages.length / 2)) },
    ];
  }
  if (soloDays <= 2) {
    const mid = Math.ceil(stages.length / 2);
    return [
      { moment: 'Samedi', tasks: stages.slice(0, mid) },
      { moment: 'Dimanche', tasks: stages.slice(mid) },
    ];
  }
  if (soloDays <= 3) {
    const third = Math.ceil(stages.length / 3);
    return [
      { moment: 'Samedi matin', tasks: stages.slice(0, third) },
      { moment: 'Samedi après-midi', tasks: stages.slice(third, third * 2) },
      { moment: 'Dimanche', tasks: stages.slice(third * 2) },
    ];
  }
  return [
    { moment: 'Week-end 1', tasks: stages.slice(0, Math.ceil(stages.length / 2)) },
    { moment: 'Week-end 2', tasks: stages.slice(Math.ceil(stages.length / 2)) },
  ];
}

/* ══════════════════════════════════════════════════
   CHECKLISTS — étapes détaillées par module
   Utilisées pour le planning et le PDF téléchargeable
══════════════════════════════════════════════════ */

export const CHECKLISTS = {
  terrasse: [
    {
      title: 'Préparation du terrain',
      items: [
        'Délimiter et tracer le périmètre au cordeau',
        'Débroussailler, niveler et décompacter si nécessaire',
        'Poser le géotextile anti-mauvaises herbes (avec 10 cm de recouvrement)',
        'Vérifier la pente d\'évacuation des eaux (1,5–2 % mini vers l\'extérieur)',
        'Préparer les matériaux et vérifier les quantités livrées',
      ],
    },
    {
      title: 'Implantation des plots',
      items: [
        'Positionner les plots réglables aux 4 coins en premier',
        'Tendre les cordeux d\'alignement entre les coins',
        'Placer les plots intermédiaires (entraxe maxi 60 cm)',
        'Régler la hauteur de tous les plots au niveau laser',
        'Vérifier la planéité diagonale (tolérance ± 5 mm)',
      ],
    },
    {
      title: 'Pose des lambourdes',
      items: [
        'Fixer les lambourdes perpendiculairement aux lames prévues',
        'Contrôler niveau et alignement sur toute la longueur',
        'Solidariser les lambourdes sur les plots (4 vis minimum par point)',
        'Traiter les coupes fraîches avec un traitement de fond',
        'Poser les lambourdes de rive en bordure',
      ],
    },
    {
      title: 'Pose des lames',
      items: [
        'Poser la première lame parfaitement alignée sur le bord',
        'Respecter l\'écartement inter-lames (5 mm mini — utiliser des cales)',
        'Visser chaque lame sur chaque lambourde (2 vis inox A4 par point)',
        'Contrôler l\'alignement tous les 5 lames',
        'Couper les extrémités à l\'équerre à la scie circulaire',
        'Poncer les coupes pour éviter les échardes',
      ],
    },
    {
      title: 'Finitions',
      items: [
        'Poser les profils de rive ou lames de finition',
        'Appliquer la 1ère couche d\'huile ou lasure (laisser sécher 24h)',
        'Appliquer la 2e couche de finition',
        'Poser les accessoires (éclairage encastré, jardinières, etc.)',
        'Nettoyer le chantier — évacuer chutes et emballages',
        'Photographier le résultat avant la première utilisation',
      ],
    },
  ],

  cabanon: [
    {
      title: 'Fondations',
      items: [
        'Tracer l\'emplacement précis au cordeau et équerrer au 3-4-5',
        'Creuser les fouilles ou préparer les plots béton',
        'Couler les semelles filantes ou les plots (béton dosé à 350 kg/m³)',
        'Laisser durcir 48h minimum avant de commencer l\'ossature',
        'Poser l\'arase d\'étanchéité (feuille bitumée) entre béton et lisse basse',
      ],
    },
    {
      title: 'Ossature basse',
      items: [
        'Assembler et poser la lisse basse (9×9 cm) sur les fondations',
        'Ancrer la lisse basse avec des tiges filetées scellées ou chevilles béton',
        'Vérifier l\'équerrage en diagonal (côté A = côté B)',
        'Traiter les coupes et about avec du produit fongistatique',
      ],
    },
    {
      title: 'Montants et lisse haute',
      items: [
        'Dresser les montants de coin en L (2 montants par angle)',
        'Poser les montants intermédiaires (entraxe 60 cm DTU)',
        'Poser les king studs et jack studs autour des ouvertures',
        'Installer les linteaux au-dessus de la porte et de la fenêtre',
        'Poser la lisse haute et mettre en place le contreventement',
        'Contrôler l\'aplomb de chaque montant au niveau à bulle',
      ],
    },
    {
      title: 'Toiture mono-pente',
      items: [
        'Poser les chevrons en respectant l\'entraxe calculé (60 cm)',
        'Clouer les voliges de sous-toiture (pose horizontale)',
        'Dérouler et agrafer le pare-pluie (recouvrement 20 cm)',
        'Poser le revêtement de couverture choisi (bac acier, tôle, shingle)',
        'Fixer les faîtières et habiller les rives de toit',
        'Tester l\'étanchéité avant de poser le bardage',
      ],
    },
    {
      title: 'Bardage extérieur',
      items: [
        'Poser les tasseaux de ventilation verticaux sur l\'ossature',
        'Commencer le bardage par le bas (lame de départ + repose)',
        'Respecter les jeux de dilatation (5 mm en bout de lame)',
        'Visser chaque lame (2 vis inox par tasseau)',
        'Poser les profilés d\'angle et de finition',
        'Appliquer la première couche de lasure dès la pose terminée',
      ],
    },
    {
      title: 'Menuiseries et finitions',
      items: [
        'Poser la porte (calage, équerrage, fixation 3 points)',
        'Poser la fenêtre et sa bavette d\'étanchéité',
        'Installer les habillages intérieurs (OSB, lambris) si prévus',
        'Poser le revêtement de sol intérieur',
        'Appliquer la deuxième couche de lasure extérieure',
        'Nettoyer le chantier et photographier le résultat',
      ],
    },
  ],

  pergola: [
    {
      title: 'Implantation et préparation',
      items: [
        'Délimiter précisément l\'emplacement des 4 poteaux au cordeau',
        'Marquer les centres de forage au poinçon',
        'Vérifier les distances aux réseaux enterrés avant de forer',
        'Préparer les platines d\'ancrage ou les tubes d\'ancrage',
      ],
    },
    {
      title: 'Scellement des poteaux',
      items: [
        'Forer les trous à la tarière (dia. 250 mm, prof. 80 cm minimum)',
        'Descendre les poteaux dans les trous et les caler verticalement',
        'Contrôler l\'aplomb sur 2 faces perpendiculaires',
        'Couler le béton de scellement et maintenir les poteaux 24h',
        'Laisser durcir 48h avant de continuer le montage',
      ],
    },
    {
      title: 'Longerons et traverses',
      items: [
        'Tracer la hauteur des longerons sur tous les poteaux au niveau laser',
        'Poser les longerons latéraux (6×15 cm) et les boulonner',
        'Vérifier la diagonale (planéité + équerrage)',
        'Poser les traverses de tête si le modèle en comporte',
      ],
    },
    {
      title: 'Chevrons et couverture',
      items: [
        'Marquer l\'entraxe des chevrons sur les longerons',
        'Poser les chevrons (6×10 cm ou 6×15 cm selon portée)',
        'Fixer avec des équerres de charpente zinguées',
        'Poser les liteaux si une couverture est prévue (polycarbonate, etc.)',
        'Installer les accessoires (éclairage, plantes grimpantes, etc.)',
      ],
    },
    {
      title: 'Finitions',
      items: [
        'Traiter toutes les coupes fraîches avec du produit fongistatique',
        'Appliquer la première couche de lasure ou saturateur (2 couches)',
        'Poser les capuchons de poteaux pour éviter les infiltrations',
        'Nettoyer le chantier et photographier le résultat',
      ],
    },
  ],

  cloture: [
    {
      title: 'Implantation',
      items: [
        'Vérifier les limites cadastrales avant de commencer',
        'Tendre un cordeau sur toute la longueur pour l\'alignement',
        'Marquer la position de chaque poteau (entraxe 2 à 2,5 m)',
        'Repérer les poteaux de départ, d\'angle et de fin de ligne',
      ],
    },
    {
      title: 'Scellement des poteaux',
      items: [
        'Forer les trous à la tarière (dia. 150 mm, profondeur = 1/3 de la hauteur totale)',
        'Descendre les poteaux et les caler verticalement au niveau à bulle',
        'Couler le béton de scellement (1 sac 25 kg par poteau)',
        'Vérifier l\'alignement au cordeau avant durcissement complet',
        'Laisser sécher 24h minimum avant de poser les rails',
      ],
    },
    {
      title: 'Pose des rails',
      items: [
        'Marquer la hauteur des rails sur tous les poteaux',
        'Visser ou boulonner les rails horizontaux (rail bas + rail haut)',
        'Contrôler l\'horizontalité de chaque rail au niveau à bulle',
        'Vérifier que la ligne reste droite vue de bout',
      ],
    },
    {
      title: 'Pose des lames',
      items: [
        'Poser la première lame parfaitement verticale (référence)',
        'Maintenir un jeu de 5–8 mm entre lames (dilatation bois)',
        'Visser chaque lame (2 vis inox par rail)',
        'Couper les lames aux poteaux d\'angle à la scie circulaire',
        'Vérifier la verticalité des lames tous les 5 poteaux',
      ],
    },
    {
      title: 'Finitions',
      items: [
        'Poser les couvre-poteaux et chapeaux d\'angles',
        'Traiter toutes les coupes avec du produit fongistatique',
        'Appliquer 2 couches de saturateur ou lasure',
        'Poser la lisse haute si hauteur > 1,5 m (stabilité DTU)',
        'Nettoyer le chantier et photographier le résultat',
      ],
    },
  ],
};
