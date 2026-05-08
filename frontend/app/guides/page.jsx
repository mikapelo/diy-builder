import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Guides DIY bois 2025 : terrasse, cabanon, pergola, clôture',
  description: 'Construire soi-même en bois — 4 guides pratiques (DTU, prix, étapes, outils, durée).',
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Guides DIY construction bois',
  description: 'Quatre guides pratiques pour construire en bois soi-même : terrasse, cabanon, pergola, clôture.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      url: 'https://www.diy-builder.fr/guides/terrasse',
      name: 'Guide terrasse bois',
    },
    {
      '@type': 'ListItem',
      position: 2,
      url: 'https://www.diy-builder.fr/guides/cabanon',
      name: 'Guide cabanon ossature bois',
    },
    {
      '@type': 'ListItem',
      position: 3,
      url: 'https://www.diy-builder.fr/guides/pergola',
      name: 'Guide pergola bois',
    },
    {
      '@type': 'ListItem',
      position: 4,
      url: 'https://www.diy-builder.fr/guides/cloture',
      name: 'Guide clôture bois',
    },
  ],
};

export default function GuidesPage() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="content-container">
        <nav className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Guides</span>
        </nav>

        <h1 className="content-h1">4 guides DIY pour construire en bois</h1>

        <p className="content-lead">
          Ces quatre guides ont été rédigés pour des bricoleurs qui construisent eux-mêmes — pas pour des
          professionnels du bâtiment. Chaque projet est traité du début à la fin : choix des matériaux,
          calculs dimensionnels issus des DTU en vigueur, liste des outils, étapes dans l&apos;ordre.
          Les prix indiqués correspondent à des achats en grande surface de bricolage française, mis à
          jour régulièrement. Vous trouverez aussi les erreurs courantes à éviter — celles qui font
          reprendre un chantier à zéro. Si vous n&apos;avez jamais posé une lambourde ou monté une
          ossature bois, partez du guide terrasse : c&apos;est le plus court, le plus direct, et il pose
          les bases que les trois autres projets reprennent. Une fois la terrasse maîtrisée, la pergola
          et la clôture deviennent logiques. Le cabanon, lui, s&apos;attaque en connaissance de cause —
          c&apos;est le projet le plus exigeant des quatre.
        </p>

        <section>
          <h2 className="content-h2">Par où commencer&nbsp;?</h2>
          <p className="content-body">
            Si vous débutez, commencez par la terrasse. C&apos;est le projet le plus accessible : pas
            d&apos;ossature verticale, pas de toiture, juste une structure posée au sol. Deux à trois
            jours suffisent pour un résultat propre sur 15&nbsp;m². Une fois à l&apos;aise avec les
            assemblages bois et la visserie inox, la pergola est une suite naturelle — même logique de
            poteaux et de longerons, portée un peu plus grande. La clôture peut se faire en parallèle ou
            après : chantier court, résultat immédiat, idéal pour prendre confiance sur les fondations
            en béton. Le cabanon, lui, demande de comprendre l&apos;ossature bois (montants, lisses,
            contreventement), la toiture et les ouvertures — comptez un à deux weekends complets, et
            lisez le guide en entier avant de commander les matériaux.
          </p>
        </section>

        <section>
          <h2 className="content-h2">Les 4 projets bois</h2>
          <div className="content-guides-grid">

            <Link href="/guides/terrasse" className="content-guide-card">
              <div className="content-guide-card-accent"></div>
              <h3 className="content-guide-card-title">Terrasse bois</h3>
              <div className="content-guide-card-meta">
                <span className="badge-level">Débutant</span>
                <span className="badge-time">2-3 jours</span>
                <span className="badge-cost">1&nbsp;000 – 3&nbsp;000&nbsp;€</span>
              </div>
              <p className="content-guide-card-desc">
                Choix des essences, calcul des lambourdes et plots béton, pose des lames, jeu de
                dilatation, finitions huile ou lasure. Le projet idéal pour démarrer — structure simple,
                chantier propre, résultat immédiatement visible.
              </p>
              <span className="btn-secondary">Lire le guide →</span>
            </Link>

            <Link href="/guides/cabanon" className="content-guide-card">
              <div className="content-guide-card-accent"></div>
              <h3 className="content-guide-card-title">Cabanon ossature bois</h3>
              <div className="content-guide-card-meta">
                <span className="badge-level">Avancé</span>
                <span className="badge-time">1-2 weekends</span>
                <span className="badge-cost">2&nbsp;500 – 5&nbsp;000&nbsp;€</span>
              </div>
              <p className="content-guide-card-desc">
                Montants 60&nbsp;cm d&apos;entraxe (DTU 31.1), lisses hautes et basses, bardage, toiture
                mono-pente. Le guide couvre aussi les ouvertures (porte, fenêtre) et le contreventement.
                Prévoir le week-end d&apos;ossature séparé du week-end de bardage.
              </p>
              <span className="btn-secondary">Lire le guide →</span>
            </Link>

            <Link href="/guides/pergola" className="content-guide-card">
              <div className="content-guide-card-accent"></div>
              <h3 className="content-guide-card-title">Pergola bois</h3>
              <div className="content-guide-card-meta">
                <span className="badge-level">Intermédiaire</span>
                <span className="badge-time">1-2 jours</span>
                <span className="badge-cost">800 – 2&nbsp;000&nbsp;€</span>
              </div>
              <p className="content-guide-card-desc">
                Ancrage des poteaux (béton ou platines), calcul des longerons et chevrons selon la portée,
                sections recommandées. Un guide court mais précis sur les dimensionnements — les erreurs
                de section sont la cause numéro un de fléchissement prématuré.
              </p>
              <span className="btn-secondary">Lire le guide →</span>
            </Link>

            <Link href="/guides/cloture" className="content-guide-card">
              <div className="content-guide-card-accent"></div>
              <h3 className="content-guide-card-title">Clôture bois</h3>
              <div className="content-guide-card-meta">
                <span className="badge-level">Débutant</span>
                <span className="badge-time">1-2 jours</span>
                <span className="badge-cost">600 – 1&nbsp;500&nbsp;€</span>
              </div>
              <p className="content-guide-card-desc">
                Espacement des poteaux, choix des lames et rails, classe de traitement UC4 pour les poteaux
                enterrés. Le guide aborde aussi l&apos;alignement au cordeau et les finitions qui font la
                différence sur une clôture exposée aux intempéries.
              </p>
              <span className="btn-secondary">Lire le guide →</span>
            </Link>

          </div>
        </section>

        <section>
          <h2 className="content-h2">Des questions techniques&nbsp;?</h2>
          <p className="content-body">
            24 questions-réponses sur les entraxes, les sections de bois, les prix au m², la
            réglementation (permis, DTU, classe de traitement) et les outils indispensables. Si vous
            bloquez sur un calcul ou un choix de matériau, la réponse est probablement dans
            la{' '}
            <Link href="/faq" className="content-link">FAQ complète</Link>
            {' '}— classée par type de projet pour aller vite.
          </p>
        </section>

        <section>
          <h2 className="content-h2">Calculer votre projet</h2>
          <p className="content-body">
            Avant d&apos;acheter quoi que ce soit, passez deux minutes sur les simulateurs : ils calculent
            le nombre exact de lames, montants, poteaux et visserie selon vos dimensions, et génèrent une
            liste de matériaux prête à emporter en magasin.{' '}
            <Link href="/calculateur" className="content-link">Terrasse</Link>,{' '}
            <Link href="/cabanon" className="content-link">cabanon</Link>,{' '}
            <Link href="/pergola" className="content-link">pergola</Link>,{' '}
            <Link href="/cloture" className="content-link">clôture</Link>{' '}
            — quatre outils gratuits, sans inscription.
          </p>
        </section>

      </div>
    </ContentLayout>
  );
}
