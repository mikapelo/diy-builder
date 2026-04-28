import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Comment construire une terrasse bois : guide complet 2025 | DIY Builder',
  description:
    'Guide pas à pas pour construire votre terrasse bois : choix des matériaux, calcul des lambourdes, pose des lames. Estimez votre budget en 30 secondes.',
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment construire une terrasse bois',
  description:
    'Guide complet pour construire une terrasse bois : préparation du sol, plots béton, lambourdes, lames et finitions.',
  totalTime: 'PT16H',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    minValue: '360',
    maxValue: '1200',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Préparer le sol',
      text: 'Appliquer un désherbant total, poser un géotextile anti-repousse et niveler la surface. Un sol plan garantit une terrasse stable sur la durée.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Poser les plots béton',
      text: "Disposer les plots réglables tous les 1,5 m en longueur et en largeur. Utiliser un niveau laser ou un cordeau pour aligner parfaitement l'ensemble.",
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Installer les lambourdes',
      text: "Visser les lambourdes (40×60 mm minimum) sur les plots avec des vis inox 6×60. Vérifier la planéité à chaque pose et respecter l'entraxe de 40 cm.",
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Poser les lames de terrasse',
      text: "Fixer les lames perpendiculairement aux lambourdes en laissant un espacement de 5 mm entre chaque lame pour l'évacuation de l'eau. Utiliser des vis inox ou des clips cachés.",
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Finitions : ponçage et protection',
      text: "Poncer les bois bruts au grain 80 puis 120 pour un rendu lisse. Appliquer une huile de finition ou une lasure bois extérieur pour protéger contre l'humidité et les UV.",
    },
  ],
};

export default function GuideTerrassePage() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <div className="content-container">
        <nav className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <a href="/guides">Guides</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Terrasse bois</span>
        </nav>

        <h1 className="content-h1">Construire une terrasse bois soi-même : le guide terrain</h1>

        <p className="content-lead">
          Une terrasse bois bien construite, c'est deux jours de travail, les bons matériaux et
          une ossature posée proprement. On voit trop de projets partir de travers dès le départ :
          bois trop humide à la pose, lambourdes sous-dimensionnées, pas de pente d'évacuation.
          Ce guide ne vous noie pas dans la théorie — il vous donne les chiffres qui comptent,
          les erreurs à éviter et les étapes dans le bon ordre.
        </p>

        <h2 className="content-h2">Quelle essence choisir selon votre budget et votre usage ?</h2>
        <p className="content-body">
          Tout part de là. L'essence que vous choisissez va dicter le prix, le comportement du
          bois dans le temps et l'entretien que vous acceptez de faire. Voici les trois familles
          qui couvrent 95 % des terrasses posées en France.
        </p>

        <h3 className="content-h3">Pin traité autoclave — le choix raisonné pour les grandes surfaces</h3>
        <p className="content-body">
          Le pin sylvestre traité en autoclave classe 4 est le bois le plus posé en France, et
          pour de bonnes raisons. Le procédé force des sels de cuivre dans les fibres sous
          pression : résultat, une résistance aux champignons et aux insectes xylophages garantie
          15 à 20 ans sans traitement régulier. À 25–40 €/m² pour les lames, c'est la seule
          option vraiment viable au-dessus de 20 m².
        </p>
        <p className="content-body">
          Le piège classique ici : acheter du bois vert fraîchement sorti d'autoclave et le poser
          immédiatement. Le taux d'humidité dépasse souvent 30 % à la livraison. En séchant sur
          place, les lames gauchissent et les vis arrachent. Laissez le bois se stabiliser à
          l'abri 3 à 4 semaines avant la pose — cette étape n'est jamais indiquée sur l'étiquette
          en GSB, et elle change tout.
        </p>

        <h3 className="content-h3">Douglas — naturellement durable, sans compromis sur le rendu</h3>
        <p className="content-body">
          Le douglas est un résineux français dont le cœur (duramen) atteint la classe de
          durabilité 3-4 sans aucun traitement chimique. Il part d'un miel orangé à la coupe et
          grisaille progressivement en quelques saisons pour un rendu ardoise que beaucoup
          recherchent. Comptez 35–55 €/m². Un entretien à l'huile tous les 2-3 ans ralentit
          ce vieillissement si vous voulez conserver la teinte.
        </p>
        <p className="content-body">
          Ce qu'on oublie souvent : le douglas accepte très bien la lasure et l'huile, mais il
          faut poncer avant application — sa surface lisse en sortie de scierie limite l'adhérence
          des produits de finition.
        </p>

        <h3 className="content-h3">Bois exotiques (ipé, teck) — quand la durabilité prime sur le budget</h3>
        <p className="content-body">
          L'ipé et le teck sont en classe 1 : 30 à 50 ans sans entretien, grâce à leur teneur
          naturelle en huiles et silices. Leur densité les rend quasi insensibles aux chocs,
          aux rayures et aux UV. Le prix (80–150 €/m²) et l'obligation d'une certification FSC
          réduisent leur usage à des projets où la durabilité long terme justifie l'investissement.
        </p>
        <p className="content-body">
          Contrainte technique à ne pas négliger : leur dureté exige des forets carbure et un
          pré-perçage systématique. Visser sans pré-percer, c'est la fissure garantie, même
          avec des vis inox costaud.
        </p>

        <h2 className="content-h2">Calculer les quantités sans se tromper</h2>
        <p className="content-body">
          Sur les chantiers qu'on voit en GSB, la moitié des acheteurs sous-commandent les lames
          et sur-commandent les vis. Voici la méthode juste pour une terrasse 4 × 3 m = 12 m² :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lames de terrasse :</strong> surface + 10 % de chute pour les découpes et
            les défauts de fil, soit 12 × 1,10 = 13,2 m² à commander. Ne descendez jamais
            en dessous de ce coefficient, même pour un rectangle parfait.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Lambourdes :</strong> entraxe 40 cm sur 4 m de largeur → (4 / 0,40) + 1 = 11
            lambourdes, chacune courant sur 3 m. La lambourde de rive compte comme les autres :
            ne l'oubliez pas.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Plots réglables :</strong> tous les 1,5 m en longueur et en largeur — pour
            12 m², prévoyez 15 à 20 plots selon la configuration du terrain et la présence ou
            non d'une lambourde centrale de raidissage.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Vis inox :</strong> 6 vis par lame par lambourde. Pour des lames de 2,4 m
            posées sur 11 lambourdes, c'est environ 500 vis 5 × 60 mm inox A2 minimum.
            Prenez A4 si la terrasse est en bord de mer.
          </li>
        </ul>
        <p className="content-body">
          Le recomplément de stock en cours de chantier coûte toujours plus cher que la surcommande
          initiale — livraison supplémentaire, lot dépareillé, teinte légèrement différente.
          Les 10 % de marge ne sont pas optionnels.
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Calculateur gratuit</p>
          <p className="content-cta-box-title">Calculez précisément vos matériaux</p>
          <p className="content-cta-box-desc">
            Entrez vos dimensions et obtenez la liste complète : lames, lambourdes, plots, vis et
            budget par enseigne.
          </p>
          <a href="/calculateur" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Les 5 étapes de construction dans le bon ordre</h2>

        <h3 className="content-h3">1. Préparer le sol — l'étape qu'on bâcle toujours</h3>
        <p className="content-body">
          Désherbez la zone avec un produit total à base de glyphosate ou un brûleur thermique.
          Attendez 2 semaines, retirez les végétaux morts. Posez un géotextile 90 g/m² minimum,
          recouvert de 5 à 10 cm de gravillon concassé pour le drainage. Nivelez à la règle de
          maçon en ménageant une pente de 1 cm/m vers l'extérieur — juste ce qu'il faut pour
          évacuer sans créer un toboggan.
        </p>
        <p className="content-body">
          L'erreur classique : ne pas mettre de géotextile pour "économiser 20 €". Deux ans plus
          tard, la végétation traverse le gravillon, soulève les plots et vous passez un week-end
          à démonter la moitié de la terrasse.
        </p>

        <h3 className="content-h3">2. Poser les plots — la tolérance est de ±3 mm sur l'ensemble</h3>
        <p className="content-body">
          Plots réglables en acier galvanisé ou plots béton coulés, espacement 1,5 m maximum dans
          les deux directions. Utilisez un niveau laser rotatif — le cordeau fonctionne, mais il
          fléchit sur les grandes longueurs. La tolérance admissible est de ±3 mm sur l'ensemble
          de la surface. Sur terrain meuble, coulez une semelle béton 20 × 20 × 10 cm sous chaque
          plot pour répartir les charges et éviter l'enfoncement hivernal.
        </p>

        <h3 className="content-h3">3. Installer les lambourdes — la section, pas un détail</h3>
        <p className="content-body">
          Section minimale 40 × 60 mm, mais préférez 45 × 70 mm dès que la terrasse dépasse 15 m²
          ou que l'entraxe des plots atteint 1,5 m. Vissez sur les plots avec des vis inox
          6 × 60 mm, deux par extrémité. Vérifiez la planéité à la règle de 2 m avant chaque
          nouvelle pose — rattraper 5 mm de dévers en milieu de chantier, c'est possible ;
          rattraper 15 mm en fin de pose, c'est souvent tout refaire.
        </p>

        <h3 className="content-h3">4. Poser les lames — l'espacement de 5 mm n'est pas décoratif</h3>
        <p className="content-body">
          Commencez par la lame de rive la plus droite et maintenez 5 mm d'écartement entre les
          lames avec des cales plastique ou des clous de 5 mm comme écarteurs temporaires.
          Pour le vissage apparent, pré-percez systématiquement — sans pré-perçage, le bois
          éclate en bout de lame, surtout sur pin traité sec. Les systèmes à clips cachés
          (Camo, Deckbone) donnent un rendu propre mais ajoutent 5–8 € par m². Coupez les
          extrémités au cordeau avec une scie circulaire après pose complète, pas avant.
        </p>

        <h3 className="content-h3">5. Ponçage et protection — ne pas brûler cette étape</h3>
        <p className="content-body">
          Poncez à la ponceuse orbitale, grain 80 puis 120, pour éliminer les échardes et
          unifier la surface. Appliquez l'huile de finition ou la lasure bois extérieur dans
          le sens du fil, première couche, séchage 24 h, puis seconde couche. Le rythme
          d'entretien ensuite : tous les 1–2 ans pour le pin, tous les 2–3 ans pour le
          douglas. Une terrasse jamais traitée ne "tient" pas moins longtemps — elle grisaille
          et se fissure, mais ne s'effondre pas. En revanche, une terrasse traitée régulièrement
          reste propre et structurellement saine deux fois plus longtemps.
        </p>

        <h2 className="content-h2">Budget matériaux : ce que vous allez vraiment dépenser</h2>
        <p className="content-body">
          Les prix ci-dessous concernent les matériaux uniquement, hors outillage et livraison.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Niveau</th>
              <th>Essence</th>
              <th>Prix matériaux</th>
              <th>Pour 12 m²</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Économique</td>
              <td>Pin traité autoclave</td>
              <td>~30 €/m²</td>
              <td>~360 €</td>
            </tr>
            <tr>
              <td>Standard</td>
              <td>Douglas</td>
              <td>~45 €/m²</td>
              <td>~540 €</td>
            </tr>
            <tr>
              <td>Premium</td>
              <td>Ipé / Teck</td>
              <td>~100 €/m²</td>
              <td>~1 200 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Si vous faites appel à un artisan pour la pose, ajoutez 40 à 60 €/m² de main-d'œuvre.
          Les prix varient selon les enseignes et les périodes — Leroy Merlin et Brico Dépôt
          pratiquent régulièrement des remises de 20–30 % sur les lames en fin de saison
          (septembre–octobre).
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Comparateur d'enseignes</p>
          <p className="content-cta-box-title">Obtenez un devis précis</p>
          <p className="content-cta-box-desc">
            Comparez les prix Leroy Merlin, Brico Dépôt et Castorama en temps réel.
          </p>
          <a href="/calculateur" className="btn-primary">
            Calculer ma terrasse{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Questions fréquentes</h2>

        <h3 className="content-h3">Faut-il un permis de construire pour une terrasse de plain-pied ?</h3>
        <p className="content-body">
          Non. Une terrasse de plain-pied — hauteur inférieure à 60 cm du sol fini — ne nécessite
          aucun permis, quelle que soit sa surface. Au-dessus de 20 m² en zone urbaine, une
          déclaration préalable de travaux est requise : formulaire Cerfa 13703, à déposer en
          mairie, délai d'instruction un mois. Consultez le PLU de votre commune avant de
          commencer : certains secteurs sauvegardés imposent des contraintes sur les matériaux
          ou les teintes, même pour une simple déclaration.
        </p>

        <h3 className="content-h3">Combien de temps dure une terrasse bois bien construite ?</h3>
        <p className="content-body">
          Comptez 15–25 ans selon l'essence et la régularité de l'entretien. Un pin traité
          autoclave huilé tous les 2 ans tient facilement 20 ans. Un douglas entretenu dépasse
          les 25 ans. Les bois exotiques certifiés FSC atteignent 40–50 ans sans entretien.
          L'exposition compte autant que l'essence : une terrasse couverte ou orientée nord
          vieillit deux fois moins vite qu'une terrasse plein sud exposée aux UV toute la journée.
        </p>

        <h3 className="content-h3">Peut-on poser une terrasse bois directement sur la terre ?</h3>
        <p className="content-body">
          Non, jamais — même avec un bois traité classe 4. Le contact direct avec un sol humide
          accélère la dégradation fongique en créant une zone de stagnation permanente que
          l'imprégnation ne suffit pas à contrer. La pose sur plots est obligatoire, avec
          5 cm minimum sous les lambourdes pour assurer la ventilation. Ce dégagement seul
          prolonge la durée de vie de la structure de 5 à 10 ans.
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Prêt à calculer votre terrasse ?</p>
          <p className="content-cta-box-desc">
            Le simulateur calcule lames, lambourdes, plots et budget en 30 secondes.
            Comparez les enseignes et exportez votre devis en PDF.
          </p>
          <a href="/calculateur" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </ContentLayout>
  );
}
