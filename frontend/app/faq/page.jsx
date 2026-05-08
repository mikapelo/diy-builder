import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Construction bois : 24 questions fréquentes (FAQ 2025)',
  description: 'Réponses aux questions les plus fréquentes sur la construction de terrasse, cabanon, pergola et clôture en bois. Calculs, matériaux, coûts.',
};

// faqData contient les réponses en texte brut — utilisé pour le JSON-LD FAQPage (pas de HTML).
// Les liens internes et citations DTU sont injectés via faqLinks ci-dessous.
const faqData = [
  {
    category: 'Terrasse bois',
    questions: [
      {
        q: 'Quelle essence de bois choisir pour une terrasse extérieure ?',
        a: 'Le pin traité autoclave classe 4 est le choix le plus courant pour un premier chantier — disponible partout, moins cher, facile à travailler. Le douglas offre une durabilité naturelle de classe 3 sans traitement chimique, avec un aspect plus chaleureux. Les bois exotiques comme l\'ipé ou le teck durent 25 à 30 ans sans entretien mais coûtent trois à cinq fois plus cher au m². Pour une terrasse de jardin familiale, le pin traité reste le meilleur rapport qualité/prix à condition de renouveler la lasure tous les 2 à 3 ans.',
      },
      {
        q: 'Quel entraxe pour les lambourdes d\'une terrasse bois ?',
        a: 'La règle de base : 40 cm d\'entraxe pour des lames de 27 mm d\'épaisseur, 60 cm pour des lames de 45 mm. Ces valeurs garantissent l\'absence de flèche sous un passage normal. Si la terrasse doit supporter des charges importantes (pot de jardin lourd, mobilier en pierre, passage fréquent), réduisez systématiquement l\'entraxe de 10 cm. Pour les lames posées en diagonale, réduisez d\'un tiers supplémentaire car la portée effective augmente.',
      },
      {
        q: 'Combien coûte une terrasse bois en moyenne ?',
        a: 'Entre 40 € et 120 €/m² en matériaux selon l\'essence et les finitions — hors pose si vous faites appel à un professionnel. Le pin traité se situe autour de 40-55 €/m², le douglas autour de 55-75 €/m², les bois exotiques au-delà de 90 €/m². Ces chiffres incluent les lambourdes, les lames, les plots béton et la visserie, mais pas les éventuels travaux de nivellement ou de terrassement. Le simulateur DIY Builder calcule votre devis précis en 30 secondes.',
      },
      {
        q: 'Faut-il un permis de construire pour une terrasse bois ?',
        a: 'Non pour les terrasses de plain-pied inférieures à 20 m² en zone non protégée — aucune démarche n\'est requise dans la grande majorité des cas. Entre 20 m² et 40 m², une déclaration préalable de travaux est nécessaire. Au-delà de 40 m² ou si la terrasse est surélevée de plus de 60 cm, un permis de construire s\'impose. En zone ABF ou secteur sauvegardé, consultez votre mairie avant tout, quelle que soit la surface.',
      },
      {
        q: 'Combien de plots béton faut-il pour une terrasse 4×3 m ?',
        a: 'Entre 12 et 20 plots selon la configuration des lambourdes et leur entraxe. Pour une terrasse 4×3 m avec lambourdes à 40 cm d\'entraxe, comptez en général 3 rangées de 5 plots, soit 15 plots. Espacez les plots à 1,20 m au maximum dans le sens de la longueur des lambourdes. Le calculateur DIY Builder détermine le nombre exact en fonction de vos dimensions et du schéma de pose.',
      },
      {
        q: 'Quel jeu laisser entre les lames d\'une terrasse bois ?',
        a: 'Entre 5 et 8 mm selon l\'humidité de la région et le type de bois. Ce jeu est indispensable pour la dilatation du bois en été et son retrait en hiver. Sans jeu, les lames se bombent et se disjoignent. Avec du bois vert ou de l\'épicéa, prévoyez 8 mm. Avec du douglas sec ou du pin traité stabilisé, 5 mm suffisent. Le jeu facilite aussi l\'évacuation de l\'eau de pluie et des débris.',
      },
    ],
  },
  {
    category: 'Cabanon ossature bois',
    questions: [
      {
        q: 'Quelle section de bois pour les montants d\'un cabanon ?',
        a: 'Les montants d\'un cabanon standard se font en 45×90 mm ou 45×145 mm selon la hauteur du mur et l\'exposition au vent. L\'entraxe réglementaire est de 60 cm (entraxe DTU ossature bois). Pour une hauteur supérieure à 2,50 m ou dans une zone exposée au vent, préférez le 45×145 mm pour éviter le voilement des montants. Les coins exigent toujours deux montants en L pour offrir une surface d\'appui correcte au bardage et aux finitions intérieures.',
      },
      {
        q: 'Faut-il un permis de construire pour un cabanon ?',
        a: 'Non pour les abris inférieurs à 5 m² sans fondation permanente — aucune démarche n\'est requise. Entre 5 et 20 m², une déclaration préalable de travaux suffit. Au-delà de 20 m², un permis de construire est obligatoire. Ces seuils s\'appliquent en zone urbaine classique ; en zone protégée (ABF, Natura 2000, POS restrictif), les règles peuvent être plus strictes. Vérifiez toujours le PLU de votre commune avant de commencer.',
      },
      {
        q: 'Quelle pente minimale pour un toit de cabanon mono-pente ?',
        a: '15 % minimum pour assurer l\'évacuation correcte des eaux de pluie sur un toit couvert de tôle ou d\'ondulé. En pratique, 20 à 30 % (soit 11 à 17°) est la fourchette recommandée pour un cabanon de jardin. Une pente trop faible stagne l\'eau, encrasse les voliges et accélère la pourriture. Pour des toits végétalisés ou des bardeaux bitumés, une pente de 30 % minimum est recommandée par les fabricants.',
      },
      {
        q: 'Quel bois pour le bardage extérieur d\'un cabanon ?',
        a: 'Pin traité autoclave classe 3b ou douglas naturellement durable. Le douglas est souvent préféré pour son aspect chaleureux et sa résistance naturelle — il tient bien sans traitement si les coupes sont protégées. Prévoyez toujours un espace de ventilation de 2 cm minimum derrière le bardage, entre les lames et le pare-pluie, pour évacuer l\'humidité par convection. Sans ventilation arrière, même le meilleur bois pourrit en quelques années.',
      },
      {
        q: 'Comment calculer le nombre de montants pour un cabanon ?',
        a: 'Formule de base : (périmètre total ÷ 0,60) + montants de coin (2 par coin × 4 coins = 8) + montants d\'encadrement des ouvertures (2 montants king + 2 jack studs par ouverture). Pour un cabanon de 3×2,5 m avec une porte et une fenêtre, comptez typiquement 25 à 30 montants. Le simulateur DIY Builder calcule le détail exact avec les linteaux et les cripple studs.',
      },
      {
        q: 'Faut-il un pare-pluie sous le bardage d\'un cabanon ?',
        a: 'Oui, systématiquement. Le pare-pluie (ou pare-vent) est un film respirant posé sur l\'ossature, sous le bardage. Il bloque les infiltrations d\'eau tout en laissant la vapeur d\'eau migrer vers l\'extérieur, évitant la condensation dans les montants. Sans lui, l\'humidité s\'accumule dans l\'isolant et les montants — la structure peut pourrir en moins de 10 ans dans les régions pluvieuses. Comptez environ 1,20 € à 2 € par m² pour ce matériau.',
      },
    ],
  },
  {
    category: 'Pergola bois',
    questions: [
      {
        q: 'Quelle section de poteau pour une pergola ?',
        a: 'Du 90×90 mm pour une pergola compacte (portée inférieure à 3 m), du 100×100 mm pour une pergola standard 3×3 m. Au-delà de 4 m de portée ou si vous prévoyez un toit végétal, un store motorisé ou des jardinières suspendues, passez directement au 120×120 mm. Sous-dimensionner les poteaux ne crée pas de risque immédiat visible, mais ils fléchissent progressivement sous les charges combinées vent + poids, et l\'ancrage travaille de façon prématurée.',
      },
      {
        q: 'Comment ancrer les poteaux d\'une pergola sans les laisser pourrir ?',
        a: 'La méthode recommandée : plots béton coulés à la profondeur hors-gel (60 à 80 cm selon la région) avec un sabot d\'ancrage galvanisé noyé dans le béton frais. Le poteau ne touche jamais le sol — zéro contact humide, zéro pourriture. Si vous optez pour le scellement direct dans le béton (poteau coulé dans la masse), le bois doit être traité autoclave classe 4. Un poteau Douglas ou pin classe 2 enterré directement dans du béton pourrit en 5 à 7 ans.',
      },
      {
        q: 'Quel entraxe pour les chevrons d\'une pergola ?',
        a: '40 à 60 cm selon la section des chevrons et la portée. Des chevrons en 45×120 mm se posent à 40 cm d\'entraxe sur une portée de 3 m. Du 63×150 mm permet d\'aller jusqu\'à 60 à 70 cm d\'entraxe sur la même portée. L\'entraxe a aussi un effet esthétique direct : des chevrons serrés à 40 cm créent une ombre dense, idéale pour remplacer un store ; à 60 cm, le quadrillage est plus aéré et laisse davantage de lumière.',
      },
      {
        q: 'Faut-il un permis pour construire une pergola dans son jardin ?',
        a: 'Non si elle est ouverte sur les côtés (sans couverture pleine) et inférieure à 20 m² d\'emprise au sol — aucune démarche n\'est requise dans la grande majorité des communes. Dès qu\'un toit plein est ajouté (polycarbonate, bac acier, bâche permanente), la pergola crée une surface de plancher et déclenche une déclaration préalable de travaux à partir de 5 m². En zone ABF, consultez votre mairie avant tout projet, même ouvert.',
      },
      {
        q: 'Quel bois choisir pour une pergola durable ?',
        a: 'Le douglas est le premier choix pour une pergola soignée : résistance naturelle de classe 3, pas de traitement chimique nécessaire, il prend une belle patine argentée après quelques saisons. Le pin traité autoclave classe 3 est une alternative économique très valable, plus disponible en GSB. Le mélèze offre une durabilité comparable au douglas avec un grain plus fin — il coûte 20 à 30 % de plus au linéaire mais demande encore moins d\'entretien dans le temps.',
      },
      {
        q: 'Comment éviter que les longerons d\'une pergola fléchissent ?',
        a: 'En respectant le rapport section/portée. Pour du 63×150 mm, la portée maximale sans appui intermédiaire est de 4 m. Au-delà, ajoutez un poteau central ou passez à du 75×175 mm. Une flèche visible (supérieure à L/300, soit 13 mm pour 4 m) n\'est pas seulement inesthétique — elle signale que le bois travaille au-delà de sa limite élastique et que les assemblages en bouts de longerons subissent des efforts de traction non prévus.',
      },
    ],
  },
  {
    category: 'Clôture bois',
    questions: [
      {
        q: 'Quelle hauteur pour une clôture de jardin en limite de propriété ?',
        a: '1,50 m à 2 m dans la grande majorité des communes françaises, sans démarche administrative préalable. Certains PLU ou règlements de lotissement imposent une limite plus basse — 1,50 m ou même 1,20 m dans certains secteurs résidentiels. Au-delà de 2 m, une déclaration préalable de travaux est en général nécessaire. Vérifiez le PLU de votre commune avant de commander vos matériaux : un poteau trop haut coulé dans du béton est difficile à corriger.',
      },
      {
        q: 'Quel entraxe entre les poteaux d\'une clôture bois ?',
        a: '1,50 m à 2 m selon la hauteur de la clôture et l\'exposition au vent. Pour une clôture de 1,20 m, 2 m d\'entraxe convient avec des rails en 38×90 mm. Pour une clôture de 1,80 m ou plus, réduisez à 1,50 m pour éviter que les rails fléchissent sous le poids des lames. Dans les zones exposées au vent marin ou en altitude, une entraxe de 1,20 à 1,50 m maximum est recommandée.',
      },
      {
        q: 'Comment poser les poteaux de clôture sans qu\'ils penchent ?',
        a: 'Commencez par les poteaux d\'extrémité en vérifiant l\'aplomb sur deux faces perpendiculaires avec un niveau à bulle. Maintenez chaque poteau avec deux écharpes provisoires pendant la prise du béton. Coulez ensuite les poteaux intermédiaires en tendant un cordeau entre les poteaux d\'extrémité pour garantir l\'alignement. Attendez 48 heures minimum avant de démonter les écharpes et de fixer les rails — pas 12 heures, même si le béton semble dur en surface.',
      },
      {
        q: 'Quelle essence pour les lames d\'une clôture bois extérieure ?',
        a: 'Pin traité autoclave classe 3b minimum pour toute lame exposée aux intempéries. Le douglas non traité est une excellente alternative — il résiste naturellement aux champignons et aux insectes de classe 3, et ne nécessite pas de traitement chimique si les coupes sont correctement protégées par une huile ou une lasure. Évitez l\'épicéa et le sapin non traités en extérieur : ils se dégradent rapidement sans protection sérieuse.',
      },
      {
        q: 'Combien coûte une clôture bois de 20 mètres linéaires ?',
        a: 'Entre 300 € et 800 € en matériaux selon la hauteur et l\'essence choisie. Une clôture de 20 ml à 1,50 m en pin traité coûte environ 350-450 €. Avec du douglas, comptez 500-650 €. Ces chiffres incluent les poteaux, les rails, les lames, les équerres et les vis inox — pas le béton ni l\'outillage. Utilisez le simulateur clôture pour un chiffrage précis avec comparatif Leroy Merlin / Brico Dépôt / Castorama.',
      },
      {
        q: 'Faut-il laisser un jeu entre les lames d\'une clôture bois ?',
        a: 'Oui, systématiquement. Un jeu de 5 à 8 mm est indispensable entre chaque lame pour compenser la dilatation du bois en été et son retrait en hiver. Sans ce jeu, les lames poussent les unes contre les autres, se bombent ou se fendent longitudinalement après un ou deux cycles climatiques. Utilisez un gabarit en chute de bois à la bonne épaisseur pour maintenir un espacement régulier tout au long de la pose — ça va dix fois plus vite que de mesurer à chaque lame.',
      },
    ],
  },
];

// Liens internes et enrichissements DTU par question (clé = texte de la question).
// Séparés de faqData pour ne pas polluer le JSON-LD (texte brut requis par schema.org).
const faqEnrichments = {
  'Quelle essence de bois choisir pour une terrasse extérieure ?': (
    <>
      {' '}Pour comparer les essences en détail (sections, durabilité, entretien), consultez{' '}
      <Link href="/guides/terrasse">le guide terrasse complet</Link>.
    </>
  ),
  'Quel entraxe pour les lambourdes d\'une terrasse bois ?': (
    <>
      {' '}Selon NF DTU 51.4 §6.2, l&apos;entraxe entre lambourdes ne dépasse pas 50 cm pour des lames de 21 mm.{' '}
      <Link href="/calculateur">Le simulateur terrasse</Link> applique ces valeurs automatiquement selon vos dimensions.
    </>
  ),
  'Combien coûte une terrasse bois en moyenne ?': (
    <>
      {' '}<Link href="/calculateur">Lancez le simulateur</Link> pour obtenir votre devis détaillé avec comparatif Leroy Merlin / Brico Dépôt / Castorama.
    </>
  ),
  'Faut-il un permis de construire pour une terrasse bois ?': (
    <>
      {' '}<Link href="/guides/terrasse">Le guide terrasse</Link> récapitule les seuils surface/hauteur et les démarches Cerfa selon votre cas.
    </>
  ),
  'Combien de plots béton faut-il pour une terrasse 4×3 m ?': (
    <>
      {' '}<Link href="/calculateur">Le calculateur terrasse</Link> détermine le nombre exact de plots en fonction de vos dimensions et du schéma de pose.
    </>
  ),
  'Quelle section de bois pour les montants d\'un cabanon ?': (
    <>
      {' '}NF DTU 31.2 §9.1.1.2 fixe la section minimale à 95 mm pour les montants de mur extérieur en ossature bois.{' '}
      <Link href="/guides/cabanon">Le guide cabanon</Link> détaille les sections selon hauteur et exposition au vent.
    </>
  ),
  'Faut-il un permis de construire pour un cabanon ?': (
    <>
      {' '}<Link href="/guides/cabanon">Le guide complet</Link> détaille les formulaires Cerfa, les seuils RE 2020 et les cas particuliers en zone protégée.
    </>
  ),
  'Quelle pente minimale pour un toit de cabanon mono-pente ?': (
    <>
      {' '}Voir <Link href="/guides/cabanon">le guide cabanon</Link> pour les détails de couverture (tôle, ondulé, bardeaux) et les pentes associées selon NF DTU 31.1.
    </>
  ),
  'Comment calculer le nombre de montants pour un cabanon ?': (
    <>
      {' '}<Link href="/cabanon">Le simulateur cabanon</Link> calcule le détail exact avec les linteaux, les king studs et les cripple studs — BOM exportable en PDF.
    </>
  ),
  'Quelle section de poteau pour une pergola ?': (
    <>
      {' '}Voir <Link href="/guides/pergola">le guide pergola</Link> pour le tableau portée → section selon les charges prévues (toit végétal, store motorisé).
    </>
  ),
  'Comment ancrer les poteaux d\'une pergola sans les laisser pourrir ?': (
    <>
      {' '}<Link href="/guides/pergola">Le guide pergola</Link> illustre les deux méthodes d&apos;ancrage (sabot vs scellement) avec les profondeurs hors-gel par région.
    </>
  ),
  'Faut-il un permis pour construire une pergola dans son jardin ?': (
    <>
      {' '}Retrouvez les seuils surface / couverture / zone dans <Link href="/guides/pergola">le guide pergola</Link>.
    </>
  ),
  'Quelle hauteur pour une clôture de jardin en limite de propriété ?': (
    <>
      {' '}Le PLU varie selon les communes — <Link href="/guides/cloture">le guide clôture</Link> résume les règles par type de zone et les démarches préalables.
    </>
  ),
  'Combien coûte une clôture bois de 20 mètres linéaires ?': (
    <>
      {' '}Selon l&apos;essence choisie, NF EN 335 distingue 5 classes d&apos;emploi : en contact avec le sol (poteaux enterrés), la classe 4 est obligatoire.{' '}
      <Link href="/cloture">Le simulateur clôture</Link> chiffre votre projet avec comparatif Leroy Merlin / Brico Dépôt / Castorama.
    </>
  ),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.flatMap(({ questions }) =>
    questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    }))
  ),
};

export default function FAQPage() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="content-container">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">FAQ</span>
        </nav>

        <h1 className="content-h1">Construction bois en autoconstruction : 24 questions fréquentes</h1>
        <p className="content-lead">
          Les vraies questions qui reviennent avant de se lancer — sections de bois, ancrage, réglementation,
          budget. Réponses directes avec des chiffres concrets.
        </p>

        <p className="content-disclaimer">
          Les indications ci-dessous reposent sur les DTU en vigueur (NF DTU 31.1, 31.2, 51.4) et le Code de l&apos;urbanisme français. Les seuils réglementaires varient selon le PLU local : vérifiez auprès de votre mairie avant tout chantier.
        </p>

        {faqData.map(({ category, questions }) => (
          <div key={category} className="content-faq-group">
            <h2 className="content-faq-group-title">{category}</h2>
            {questions.map(({ q, a }) => (
              <details key={q} className="content-details">
                <summary className="content-summary">{q}</summary>
                <div className="content-answer">
                  {a}
                  {faqEnrichments[q] ?? null}
                </div>
              </details>
            ))}
          </div>
        ))}

        <hr className="content-divider" />
        <div className="content-cta-box">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Calculez vos matériaux en 30 secondes</p>
          <p className="content-cta-box-desc">Le simulateur calcule vos matériaux et votre budget gratuitement.</p>
          <a href="/" className="btn-primary">
            Lancer un projet{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </ContentLayout>
  );
}
