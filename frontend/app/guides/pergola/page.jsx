import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Comment construire une pergola bois : guide complet 2025 | DIY Builder',
  description: 'Guide pas à pas pour construire votre pergola bois : poteaux, longerons, chevrons. Calcul des sections, ancrage, budget estimé. Simulateur gratuit inclus.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment construire une pergola bois',
  description:
    'Guide complet pour concevoir, calculer et monter une pergola bois dans votre jardin.',
  totalTime: 'P2D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: '250-1200',
  },
  supply: [
    { '@type': 'HowToSupply', name: 'Poteaux bois 100×100 mm' },
    { '@type': 'HowToSupply', name: 'Longerons 63×150 mm' },
    { '@type': 'HowToSupply', name: 'Chevrons 45×120 mm' },
    { '@type': 'HowToSupply', name: 'Sabots d\'ancrage galvanisés' },
    { '@type': 'HowToSupply', name: 'Vis inox A2' },
    { '@type': 'HowToSupply', name: 'Béton dosé 350 kg/m³' },
  ],
  tool: [
    { '@type': 'HowToTool', name: 'Niveau à bulle' },
    { '@type': 'HowToTool', name: 'Cordeau de maçon' },
    { '@type': 'HowToTool', name: 'Perceuse-visseuse' },
    { '@type': 'HowToTool', name: 'Scie circulaire' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Implantation',
      text: 'Tendez un cordeau entre les 4 coins. Vérifiez l\'équerre avec la règle 3-4-5 : côté 3 m, côté 4 m, diagonale 5 m exactement. Contrôlez ensuite les deux diagonales du rectangle — elles doivent être égales à 1 mm près. Une implantation fausse de 2 cm se voit une fois les chevrons posés.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Fondations et plots',
      text: 'Creusez des fouilles de 30×30 cm à 60-80 cm de profondeur selon votre région (hors-gel). Coulez un béton dosé à 350 kg/m³ et noyez les sabots d\'ancrage dans le béton encore frais en vérifiant leur alignement au cordeau. Attendez 48 heures minimum avant de continuer.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Pose des poteaux',
      text: 'Glissez les poteaux dans les sabots et vissez-les. Vérifiez l\'aplomb sur deux faces perpendiculaires avec un niveau à bulle. Maintenez provisoirement avec des écharpes en bois clouées au sol — ne les enlevez qu\'une fois les longerons boulonnés.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Longerons',
      text: 'Hissez les longerons en tête de poteaux. Assemblez avec des boulons M12 traversants ou des vis de charpente de 150 mm minimum. Vérifiez le niveau et l\'alignement avant de serrer définitivement. Prévoyez un porte-à-faux de 20 à 30 cm en extrémité pour l\'esthétique.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Chevrons',
      text: 'Posez les chevrons perpendiculairement aux longerons avec un espacement de 40 à 60 cm. Fixez-les avec des équerres de charpente galvanisées ou par vissage biais (deux vis en croix). Un gabarit d\'espacement en bois vous fait gagner du temps et garantit un entraxe régulier.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Finitions',
      text: 'Poncez toutes les arêtes vives et les coupes exposées à la pluie. Appliquez une huile de protection ou une lasure incolore microporeuse dès la fin du montage. Renouvelez le traitement tous les 2 à 3 ans — les coupes transversales sont les premières à se dégrader si elles ne sont pas protégées.',
    },
  ],
};

export default function GuidePergolaBois() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="content-container">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <a href="/guides">Guides</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Pergola bois</span>
        </nav>

        <h1 className="content-h1">Construire une pergola bois</h1>

        <p className="content-lead">
          La pergola est l&apos;un des rares ouvrages de jardin qui ne nécessite pas de démarche administrative dans
          la majorité des cas — du moment qu&apos;elle reste ouverte sur les côtés et sous les 20 m² d&apos;emprise.
          Ce guide couvre les points qui posent problème en pratique&nbsp;: choix des sections, ancrage des
          poteaux, assemblage des longerons et finitions. Budget réaliste en fin de page.
        </p>

        <h2 className="content-h2">Choisir les bonnes sections de bois</h2>
        <p className="content-body">
          L&apos;erreur classique du débutant, c&apos;est de sous-dimensionner. Une section trop faible donne une flèche
          visible sur les longerons, et un vent fort peut tout déstabiliser. Voici les sections qui tiennent
          à long terme.
        </p>

        <h3 className="content-h3">Poteaux porteurs</h3>
        <p className="content-body">
          Pour une portée inférieure à 3 m, du&nbsp;<strong>90×90 mm</strong> suffit. Entre 3 et 4 m, passez
          à du&nbsp;<strong>100×100 mm</strong>. Au-delà de 4 m ou si vous prévoyez un toit végétal chargé,
          prenez du&nbsp;<strong>120×120 mm</strong> — le surcoût est négligeable par rapport au risque de
          flambement sous charge de vent.
        </p>

        <h3 className="content-h3">Longerons (poutres maîtresses)</h3>
        <p className="content-body">
          Les longerons supportent tous les chevrons et transmettent les charges aux poteaux. Pour des portées
          courantes jusqu&apos;à 4 m, du&nbsp;<strong>63×150 mm</strong> convient sans problème. Pour des portées
          plus longues ou une pergola destinée à recevoir un store, des jardinières ou un toit végétalisé,
          montez à du&nbsp;<strong>75×175 mm</strong>.
        </p>

        <h3 className="content-h3">Chevrons</h3>
        <p className="content-body">
          Les chevrons forment le quadrillage horizontal visible depuis le dessous. Entraxe standard&nbsp;:
          <strong> 40 à 60 cm</strong>. Sections usuelles&nbsp;:&nbsp;<strong>45×120 mm</strong> pour les petits
          formats, <strong>63×150 mm</strong> pour les grandes portées. Plus l&apos;entraxe est serré, plus l&apos;ombre
          portée est dense — c&apos;est aussi un choix esthétique.
        </p>

        <h3 className="content-h3">Essences recommandées</h3>
        <ul className="content-body">
          <li><strong>Douglas</strong>&nbsp;: durabilité naturelle de classe 3, tient sans traitement si les coupes sont protégées. Prend une belle patine grise après quelques saisons.</li>
          <li><strong>Pin traité autoclave classe 3</strong>&nbsp;: économique, disponible partout, efficace — c&apos;est le choix le plus répandu pour un premier chantier.</li>
          <li><strong>Mélèze</strong>&nbsp;: résistance naturelle élevée, grain serré, aspect premium. Compte environ 30 % de plus au linéaire que le douglas.</li>
        </ul>

        <h2 className="content-h2">Combien de matériaux pour une pergola 4×3 m&nbsp;?</h2>
        <p className="content-body">
          Exemple concret pour une structure standard&nbsp;: <strong>4 poteaux</strong> 100×100×300 cm,
          <strong> 2 longerons</strong> 63×150×400 cm, <strong>6 chevrons</strong> 45×120×300 cm.
          Pour la quincaillerie&nbsp;: 8 sabots d&apos;ancrage galvanisés, 8 équerres de charpente pour les
          assemblages longerons/chevrons, vis inox A2.
        </p>
        <p className="content-body">
          Attention aux vis&nbsp;: les vis acier zingué ordinaires tachent durablement le bois de traînées de
          rouille brune après quelques pluies. En extérieur, l&apos;inox A2 est non négociable.
          Ces quantités varient selon l&apos;entraxe des chevrons et vos dimensions exactes — le simulateur les
          calcule automatiquement.
        </p>

        <div className="content-cta-box" role="complementary" aria-label="Appel à l'action simulateur">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Calculez votre pergola en détail</p>
          <p className="content-cta-box-desc">Liste de matériaux complète, longueurs de coupes et comparatif enseignes.</p>
          <a href="/pergola" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <h2 className="content-h2">Ancrage des poteaux — le point critique</h2>
        <p className="content-body">
          Un poteau mal ancré bascule sous les premières rafales, même pour un ouvrage léger. C&apos;est là que
          les pergolas bricolées trop vite montrent leurs limites. Deux solutions fiables existent.
        </p>

        <h3 className="content-h3">Sabots sur plots béton — la méthode propre</h3>
        <p className="content-body">
          Coulez d&apos;abord un plot béton de 30×30 cm à la profondeur hors-gel, puis noyez un sabot galvanisé
          dans le béton encore frais. Le poteau se fixe ensuite dans le sabot sans jamais toucher le sol —
          ce qui élimine tout risque de pourriture à la base. Autre avantage&nbsp;: l&apos;installation est
          réversible si vous déplacez la pergola un jour.
        </p>

        <h3 className="content-h3">Scellement direct dans le béton</h3>
        <p className="content-body">
          Le bas du poteau est coulé directement dans un massif béton. Méthode robuste, mais elle impose
          un bois traité&nbsp;<strong>autoclave classe 4</strong>&nbsp;(contact sol humide permanent). Comptez
          une longueur d&apos;encastrement d&apos;au moins un sixième de la hauteur totale du poteau. Un poteau de
          3 m doit donc être enterré sur 50 cm minimum.
        </p>

        <h3 className="content-h3">Profondeur hors-gel</h3>
        <p className="content-body">
          Dans le nord de la France et les zones de montagne&nbsp;: <strong>60 à 80 cm</strong> minimum.
          Dans le midi&nbsp;: <strong>40 à 50 cm</strong> suffisent. En cas de doute, appelez votre mairie —
          certaines communes publient la profondeur hors-gel locale dans leur règlement de voirie.
        </p>
        <p className="content-body">
          Règle absolue&nbsp;: ne jamais enterrer du bois non traité ou du bois classe 2 au contact du sol
          humide. La pourriture colonise les fibres ligneuses en deux à trois hivers.
        </p>

        <h2 className="content-h2">Les 6 étapes de montage</h2>

        <h3 className="content-h3">1. Implantation</h3>
        <p className="content-body">
          Matérialisez les 4 coins avec des piquets reliés par un cordeau. Vérifiez l&apos;orthogonalité avec
          la règle 3-4-5&nbsp;: si un côté mesure 3 m et l&apos;autre 4 m, la diagonale doit faire exactement 5 m.
          Comparez ensuite les deux diagonales du rectangle — elles doivent être égales au millimètre.
          Une implantation fausse de 2 cm se corrige à cette étape&nbsp;; pas une fois les poteaux coulés.
        </p>

        <h3 className="content-h3">2. Fondations et plots</h3>
        <p className="content-body">
          Creusez les fouilles aux 4 coins — et en intermédiaire si la pergola dépasse 4 m. Dosez le béton
          à 350 kg de ciment par m³ ou utilisez des sacs prêts à l&apos;emploi. Noyez les sabots dans le béton
          encore frais en vérifiant leur alignement au cordeau. Attendez&nbsp;<strong>48 heures</strong> — pas
          12, pas 24 — avant de continuer.
        </p>

        <h3 className="content-h3">3. Pose des poteaux</h3>
        <p className="content-body">
          Glissez les poteaux dans les sabots et vissez-les. Vérifiez l&apos;aplomb sur deux faces perpendiculaires
          avec un niveau à bulle. Maintenez provisoirement avec des écharpes en bois clouées au sol jusqu&apos;à
          ce que les longerons soient boulonnés et que l&apos;ensemble soit rigidifié.
        </p>

        <h3 className="content-h3">4. Longerons</h3>
        <p className="content-body">
          Hissez les longerons en tête de poteaux — prévoyez de l&apos;aide, une pièce de 63×150×4 m pèse
          environ 15 kg. Assemblez avec des boulons M12 traversants ou des vis de charpente de 150 mm minimum.
          Vérifiez le niveau et le fil avant de serrer définitivement. Les longerons doivent dépasser les
          poteaux extérieurs de 20 à 30 cm pour un porte-à-faux équilibré.
        </p>

        <h3 className="content-h3">5. Chevrons</h3>
        <p className="content-body">
          Posez les chevrons perpendiculairement aux longerons avec un entraxe régulier. Fixez-les avec
          des équerres de charpente galvanisées ou par vissage biais (deux vis en croix de chaque côté).
          Fabriquez un gabarit d&apos;espacement — une simple chute de bois à la bonne longueur — pour maintenir
          l&apos;entraxe constant sans mesurer à chaque pose.
        </p>

        <h3 className="content-h3">6. Finitions</h3>
        <p className="content-body">
          Poncez toutes les arêtes vives et les coupes de bois exposées à la pluie. Appliquez une
          <strong> huile de protection</strong> ou une <strong>lasure incolore microporeuse</strong> dès la
          fin du montage — avant les premières pluies. Les coupes transversales absorbent l&apos;eau
          dix fois plus vite que le bois de fil&nbsp;: elles méritent deux couches. Renouvelez le traitement
          tous les 2 à 3 ans.
        </p>

        <h2 className="content-h2">Budget matériaux</h2>
        <p className="content-body">
          Les fourchettes ci-dessous couvrent les pièces de bois et la quincaillerie (hors béton des
          fondations et outillage). L&apos;écart bas/haut dépend principalement de l&apos;essence choisie et de l&apos;enseigne.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Format</th>
              <th>Dimensions</th>
              <th>Budget matériaux estimé</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Petite</td>
              <td>2×2 m</td>
              <td>250 – 400&nbsp;€</td>
            </tr>
            <tr>
              <td>Standard</td>
              <td>3×3 m</td>
              <td>450 – 700&nbsp;€</td>
            </tr>
            <tr>
              <td>Grande</td>
              <td>4×4 m</td>
              <td>700 – 1 200&nbsp;€</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le douglas est environ 25 % plus cher que le pin traité en GSB. Le mélèze dépasse souvent la
          fourchette haute. Pour un chiffrage précis selon vos dimensions et les prix actuels par enseigne,
          utilisez le simulateur.
        </p>

        <h2 className="content-h2">Réglementation</h2>
        <p className="content-body">
          La pergola est l&apos;ouvrage de jardin le plus permissif administrativement — mais il y a des limites
          à ne pas ignorer.
        </p>
        <ul className="content-body">
          <li>
            <strong>Pergola ouverte sur les côtés</strong>&nbsp;: aucune démarche requise en dessous de 20 m²
            d&apos;emprise au sol dans la grande majorité des communes.
          </li>
          <li>
            <strong>Pergola couverte (polycarbonate, bâche, tuiles)</strong>&nbsp;: elle crée une surface de
            plancher et déclenche une déclaration préalable de travaux dès 5 m² créés.
          </li>
          <li>
            <strong>Zone ABF ou secteur sauvegardé</strong>&nbsp;: la consultation de l&apos;Architecte des
            Bâtiments de France est obligatoire avant tout projet, quelle que soit la surface.
          </li>
          <li>
            Consultez le PLU de votre commune avant de commander les matériaux&nbsp;: certains règlements
            locaux imposent des reculs par rapport aux limites séparatives, des contraintes de hauteur ou
            de matériaux.
          </li>
        </ul>

        <div className="content-cta-box" role="complementary" aria-label="Appel à l'action final">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Votre pergola calculée en 30 secondes</p>
          <p className="content-cta-box-desc">Liste de matériaux complète, longueurs de coupes précises et comparatif des prix par enseigne.</p>
          <a href="/pergola" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </ContentLayout>
  );
}
