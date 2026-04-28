import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Comment construire une clôture bois : guide complet 2025 | DIY Builder',
  description: 'Guide complet pour poser une clôture bois : poteaux, rails, lames. Calcul des matériaux, entraxes, hauteurs réglementaires et budget estimé.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment construire une clôture bois',
  description:
    'Guide complet pour calculer, implanter et poser une clôture bois en jardin.',
  totalTime: 'P1D',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: '180-700',
  },
  supply: [
    { '@type': 'HowToSupply', name: 'Poteaux bois 90×90 mm traités classe 4' },
    { '@type': 'HowToSupply', name: 'Rails horizontaux 38×90 mm' },
    { '@type': 'HowToSupply', name: 'Lames de bardage pin ou douglas' },
    { '@type': 'HowToSupply', name: 'Équerres galvanisées' },
    { '@type': 'HowToSupply', name: 'Vis inox A2' },
    { '@type': 'HowToSupply', name: 'Béton dosé 350 kg/m³' },
  ],
  tool: [
    { '@type': 'HowToTool', name: 'Niveau à bulle' },
    { '@type': 'HowToTool', name: 'Cordeau de maçon' },
    { '@type': 'HowToTool', name: 'Perceuse-visseuse' },
    { '@type': 'HowToTool', name: 'Tarière ou bêche' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Piquetage et implantation',
      text: 'Tendez un cordeau entre les deux extrémités. Marquez la position de chaque poteau à intervalle régulier (1,5 à 2 m). Commencez toujours par les poteaux d\'extrémité et tendez à nouveau le cordeau pour aligner les poteaux intermédiaires. Un poteau décalé de 3 cm se voit immédiatement une fois les lames posées.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Ancrage des poteaux',
      text: 'Creusez des fouilles de 30×30 cm à 60 cm de profondeur minimum. Placez le poteau au centre, vérifiez l\'aplomb sur deux faces perpendiculaires, puis coulez le béton dosé à 350 kg/m³. Arrondir le béton en couronne autour du poteau facilite l\'évacuation des eaux de pluie. Attendez 48 heures avant de monter les rails.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Fixation des rails',
      text: 'Commencez par le rail du bas, entre 5 et 10 cm du sol pour éviter le contact permanent avec l\'humidité. Fixez-le avec des équerres galvanisées sur chaque poteau. Posez ensuite le rail du haut (5 cm sous le sommet des lames prévu), puis les rails intermédiaires. Contrôlez l\'horizontalité au niveau à bulle à chaque rail.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Pose des lames',
      text: 'Vissez les lames verticalement sur les rails avec 2 vis par lame et par rail. Laissez un jeu de 5 à 8 mm entre les lames — ce jeu compense la dilatation du bois en été et son retrait en hiver. Sans jeu, les lames bombent et se déforment. Un gabarit en chute de bois à la bonne épaisseur accélère considérablement la pose. Les lames ne doivent pas toucher le sol : gardez au minimum 2 cm de garde au sol.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Traitement et finitions',
      text: 'Appliquez une lasure microporeuse ou une huile de protection sur toutes les faces exposées dès la fin de la pose, avant les premières pluies. Insistez sur les coupes en tête de lame — c\'est là que l\'eau s\'infiltre en priorité. Posez des chapeaux de poteau en bois ou en métal pour protéger les extrémités. Renouvelez le traitement tous les 3 à 4 ans.',
    },
  ],
};

export default function GuideClotureBois() {
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
          <span className="content-breadcrumb-current">Clôture bois</span>
        </nav>

        <h1 className="content-h1">Construire une clôture bois</h1>

        <p className="content-lead">
          Poser une clôture bois est un chantier d&apos;une journée pour un périmètre de 10 à 15 m — à condition
          d&apos;avoir bien préparé les fouilles et laissé prendre le béton la veille. Les problèmes qui reviennent
          le plus souvent&nbsp;: poteaux mal d&apos;aplomb, rails non horizontaux, lames posées sans jeu de
          dilatation. Ce guide couvre les points de vigilance concrets, les dimensions à respecter et le
          budget selon votre configuration.
        </p>

        <h2 className="content-h2">Les trois familles d&apos;éléments</h2>
        <p className="content-body">
          Une clôture bois, c&apos;est trois couches superposées. Mal dimensionner l&apos;une d&apos;elles compromet
          l&apos;ensemble — même si les deux autres sont correctes.
        </p>

        <h3 className="content-h3">Poteaux porteurs</h3>
        <p className="content-body">
          Les poteaux reprennent tous les efforts&nbsp;: vent latéral, poids des lames, poussée éventuelle
          d&apos;enfants ou d&apos;animaux. Pour une clôture de 1,20 m de hauteur, du&nbsp;<strong>70×70 mm</strong>
          suffit. Au-delà de 1,20 m ou pour des travées supérieures à 1,80 m, passez à
          du&nbsp;<strong>90×90 mm</strong> — les rails fléchissent sinon sous le poids des lames.
          L&apos;entraxe entre poteaux doit rester entre&nbsp;<strong>1,5 et 2 m</strong>.
        </p>
        <p className="content-body">
          Point non négociable&nbsp;: tout poteau en contact avec le sol doit être en bois traité
          <strong> autoclave classe 4</strong>. Ne jamais enterrer du pin classe 2 ou non traité — la
          pourriture s&apos;installe en deux à trois hivers en sol humide.
        </p>

        <h3 className="content-h3">Rails horizontaux</h3>
        <p className="content-body">
          Les rails relient les poteaux et portent les lames. Le nombre de rangées dépend de la hauteur&nbsp;:
          <strong> 2 rails</strong> pour les clôtures inférieures à 1,20 m,
          <strong> 3 rails</strong> pour les hauteurs de 1,50 à 2 m. Section courante&nbsp;: 38×90 mm
          ou 45×90 mm selon votre stock en GSB. Fixez-les toujours avec des équerres galvanisées — jamais
          en vissage direct dans le bois du poteau qui finit par se fendre.
        </p>

        <h3 className="content-h3">Lames de bardage</h3>
        <p className="content-body">
          Les lames constituent la face visible. Largeur usuelle&nbsp;: <strong>10 à 14 cm</strong>,
          épaisseur&nbsp;<strong>18 à 21 mm</strong>. Le douglas offre le meilleur rapport durabilité/prix
          pour une clôture exposée&nbsp;: sa résistance naturelle de classe 3 évite un traitement systématique
          si les coupes sont protégées. Le pin traité classe 3 est plus économique mais demande un entretien
          plus régulier.
        </p>

        <h3 className="content-h3">Quincaillerie — ne pas rogner là-dessus</h3>
        <ul className="content-body">
          <li><strong>Équerres galvanisées</strong>&nbsp;: fixation des rails sur les poteaux sans affaiblir les sections.</li>
          <li><strong>Vis inox A2</strong>&nbsp;: les vis acier zingué ordinaires laissent des coulures de rouille brune sur les lames au bout de quelques mois. En extérieur, l&apos;inox est obligatoire.</li>
          <li><strong>Chapeaux de poteau</strong>&nbsp;: pièce en bois ou en métal posée en tête pour protéger la coupe transversale — la plus vulnérable à l&apos;infiltration d&apos;eau.</li>
        </ul>

        <h2 className="content-h2">Calcul des matériaux — exemple 10 m linéaires</h2>
        <p className="content-body">
          Pour une clôture de&nbsp;<strong>10 m linéaires, hauteur 1,50 m</strong>&nbsp;, avec poteaux
          à 1,67 m d&apos;entraxe&nbsp;:
        </p>
        <ul className="content-body">
          <li><strong>7 poteaux</strong> 90×90×200 cm traités classe 4 (6 travées + 1 poteau d&apos;extrémité)</li>
          <li><strong>21 m de rails</strong> en 38×90 mm (3 rangées × 10 m, avec chutes de recalage)</li>
          <li><strong>environ 70 lames</strong> de 97 cm de longueur utile (lame 10 cm + jeu 8 mm)</li>
          <li>14 équerres galvanisées + vis inox A2 (3 vis par lame et par rail = environ 630 vis)</li>
        </ul>
        <p className="content-body">
          Le nombre de lames varie selon le jeu choisi et leur largeur. Avec des lames de 12 cm et un
          jeu de 8 mm, il en faut environ 56 au lieu de 70. Le simulateur recalcule tout en temps réel.
        </p>

        <div className="content-cta-box" role="complementary" aria-label="Appel à l'action simulateur">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Calculez votre clôture précisément</p>
          <p className="content-cta-box-desc">Nombre de poteaux, rails, lames et quincaillerie selon vos dimensions.</p>
          <a href="/cloture" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <h2 className="content-h2">Ancrage des poteaux — deux méthodes</h2>
        <p className="content-body">
          C&apos;est l&apos;étape qui conditionne la durée de vie de toute la clôture. Un poteau mal ancré penche
          au bout d&apos;un hiver de vent et de gel — les lames se désolidarisent et les rails se fendent.
        </p>

        <h3 className="content-h3">Béton d&apos;ancrage direct</h3>
        <p className="content-body">
          Creusez une fouille de 30×30 cm à&nbsp;<strong>60 cm de profondeur</strong> — hors-gel dans
          la plupart des régions françaises. Placez le poteau au centre, vérifiez l&apos;aplomb sur deux faces
          perpendiculaires avec un niveau à bulle, puis coulez le béton dosé à 350 kg/m³. Formez une légère
          couronne bombée autour du poteau pour éviter la stagnation d&apos;eau. Attendez&nbsp;<strong>48 heures</strong>
          avant de fixer les rails.
        </p>

        <h3 className="content-h3">Sabots d&apos;ancrage sur platine béton</h3>
        <p className="content-body">
          Coulez d&apos;abord une platine béton, puis fixez-y un sabot métallique par chevilles d&apos;expansion
          ou scellement chimique. Le poteau est boulonné dans le sabot sans contact direct avec le sol —
          zéro risque de pourriture à la base, installation réversible. C&apos;est la méthode idéale pour un
          sol déjà bétonnisé ou un dallage existant qu&apos;on ne veut pas casser.
        </p>

        <h3 className="content-h3">Classe de traitement : ce n&apos;est pas optionnel</h3>
        <p className="content-body">
          Quel que soit le mode d&apos;ancrage choisi, tout poteau en contact permanent avec le sol humide
          exige du bois traité&nbsp;<strong>autoclave classe 4</strong>. Cette classe garantit une résistance
          aux champignons et aux insectes xylophages pendant 10 à 15 ans dans des conditions normales.
          La classe 3b n&apos;est pas suffisante pour un usage enterré.
        </p>

        <h2 className="content-h2">Les 5 étapes de pose</h2>

        <h3 className="content-h3">1. Piquetage et implantation</h3>
        <p className="content-body">
          Tendez un cordeau entre les deux extrémités de la clôture. Marquez au sol la position de chaque
          poteau à intervalle régulier. Vérifiez que chaque marque est bien dans l&apos;alignement du cordeau —
          une déviation de 3 cm se voit immédiatement une fois les lames posées. Commencez toujours par
          les poteaux d&apos;angle ou d&apos;extrémité avant les intermédiaires.
        </p>

        <h3 className="content-h3">2. Ancrage des poteaux</h3>
        <p className="content-body">
          Posez les poteaux d&apos;extrémité en premier, puis tendez à nouveau le cordeau entre eux pour
          aligner les poteaux intermédiaires. Après coulée du béton, vérifiez l&apos;aplomb une dernière fois
          et maintenez chaque poteau avec des écharpes provisoires le temps de la prise.
          Les écharpes, c&apos;est 5 minutes par poteau qui évitent de reprendre le travail à la perceuse.
        </p>

        <h3 className="content-h3">3. Fixation des rails</h3>
        <p className="content-body">
          Commencez par le rail du bas&nbsp;: posez-le entre 5 et 10 cm au-dessus du sol pour couper
          le contact avec l&apos;humidité du sol. Fixez-le avec des équerres galvanisées sur chaque poteau.
          Posez ensuite le rail du haut (environ 5 cm sous le sommet des lames prévu), puis les rails
          intermédiaires. Vérifiez l&apos;horizontalité au niveau à bulle — un rail incliné se remarque
          immédiatement sur les lames posées.
        </p>

        <h3 className="content-h3">4. Pose des lames</h3>
        <p className="content-body">
          Vissez les lames verticalement sur les rails avec 2 vis par lame et par rail (6 vis par lame
          pour une clôture 3 rails). Laissez un&nbsp;<strong>jeu de 5 à 8 mm</strong> entre les lames&nbsp;:
          sans ce jeu, les lames bombent en été et se fendent en hiver avec les cycles d&apos;humidité.
          Fabriquez un gabarit en chute de bois à la bonne épaisseur — ça va dix fois plus vite que
          mesurer. Dernière vérification&nbsp;: les lames ne doivent pas toucher le sol, gardez
          au moins 2 cm de garde pour éviter le contact avec l&apos;humidité.
        </p>

        <h3 className="content-h3">5. Traitement et finitions</h3>
        <p className="content-body">
          Appliquez une&nbsp;<strong>lasure microporeuse</strong> ou une
          <strong> huile de protection extérieure</strong> dès la fin de la pose, avant les premières
          pluies. Insistez sur les coupes en tête de lame — le bois de bout absorbe l&apos;eau dix fois plus
          vite que le bois de fil. Posez les chapeaux de poteau sur toutes les têtes de poteaux.
          Renouvelez le traitement tous les&nbsp;<strong>3 à 4 ans</strong> selon l&apos;exposition.
        </p>

        <h2 className="content-h2">Budget matériaux</h2>
        <p className="content-body">
          Les fourchettes ci-dessous incluent le bois, la quincaillerie et le béton des fouilles — pas
          l&apos;outillage. L&apos;écart entre fourchette basse et haute dépend essentiellement de l&apos;essence choisie.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Longueur</th>
              <th>Hauteur</th>
              <th>Budget matériaux estimé</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10 ml</td>
              <td>1,2 m</td>
              <td>180 – 280&nbsp;€</td>
            </tr>
            <tr>
              <td>10 ml</td>
              <td>1,5 m</td>
              <td>240 – 360&nbsp;€</td>
            </tr>
            <tr>
              <td>20 ml</td>
              <td>1,5 m</td>
              <td>450 – 700&nbsp;€</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          La fourchette basse correspond au pin traité classe 3 en grande surface de bricolage. La fourchette
          haute correspond au douglas ou au mélèze chez un distributeur spécialisé. Pour affiner selon
          les prix actuels par enseigne, le simulateur compare Leroy Merlin, Brico Dépôt et Castorama
          sur vos quantités exactes.
        </p>

        <h2 className="content-h2">Réglementation — ce qu&apos;il faut vérifier avant de commander</h2>
        <p className="content-body">
          Les règles varient selon les communes. Avant d&apos;acheter les matériaux, vérifiez ces quatre points.
        </p>
        <ul className="content-body">
          <li>
            <strong>Hauteur maximale</strong>&nbsp;: dans la plupart des communes, une clôture en limite de
            propriété peut atteindre&nbsp;<strong>2 m</strong> sans déclaration préalable. Mais certains PLU
            ou règlements de lotissement imposent 1,50 m ou 1,80 m — vérifiez avant de commander.
          </li>
          <li>
            <strong>Mitoyenneté</strong>&nbsp;: si la clôture est implantée exactement en limite séparative
            et sert les deux propriétés, l&apos;accord écrit du voisin est fortement recommandé. En cas de
            litige, une clôture mitoyenne est à frais partagés — et les deux voisins ont voix au chapitre
            sur l&apos;entretien.
          </li>
          <li>
            <strong>Zone ABF ou secteur sauvegardé</strong>&nbsp;: à proximité d&apos;un monument historique,
            l&apos;Architecte des Bâtiments de France peut imposer matériaux, couleurs et hauteurs. La
            consultation est obligatoire avant tout projet.
          </li>
          <li>
            <strong>Clôture en bord de voie publique</strong>&nbsp;: renseignez-vous auprès de la mairie
            sur les distances de recul et les règles de visibilité aux angles de rue — certaines communes
            exigent un dégagement triangulaire à hauteur limitée.
          </li>
        </ul>

        <div className="content-cta-box" role="complementary" aria-label="Appel à l'action final">
          <p className="content-cta-box-label">Simulateur gratuit</p>
          <p className="content-cta-box-title">Calculez votre clôture en 30 secondes</p>
          <p className="content-cta-box-desc">Nombre de poteaux, rails, lames et quincaillerie avec comparatif des prix par enseigne.</p>
          <a href="/cloture" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </ContentLayout>
  );
}
