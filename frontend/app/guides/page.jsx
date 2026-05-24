import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = '6 guides bois & béton';
const OG_SUBTITLE = 'Terrasse, cabanon, pergola, clôture, dalle';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide`;

export const metadata = {
  title: 'Guides bois & béton : terrasse, cabanon, pergola, clôture, dalle',
  description: 'Construire soi-même en bois et béton — 5 guides pratiques (DTU 31.1, 31.2, 51.4, 13.3) avec prix, étapes, outils et durée par projet.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides' },
  openGraph: {
    title: '6 guides pour construire en bois et béton | DIY Builder',
    description: 'Terrasse, cabanon, pergola, clôture, dalle béton — guides pas à pas conformes DTU avec budget, outils et durée par projet.',
    url: 'https://www.diy-builder.fr/guides',
    type: 'website',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: '5 guides DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Guides de construction bois et béton',
  description: 'Cinq guides pratiques pour construire en bois et béton soi-même : terrasse, cabanon, pergola, clôture et dalle béton extérieure.',
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      url: 'https://www.diy-builder.fr/guides/terrasse',
      name: 'Guide terrasse bois',
      image: 'https://www.diy-builder.fr/images/guides/cards/terrasse.png',
    },
    {
      '@type': 'ListItem',
      position: 2,
      url: 'https://www.diy-builder.fr/guides/cabanon',
      name: 'Guide cabanon ossature bois',
      image: 'https://www.diy-builder.fr/images/guides/cards/cabanon.png',
    },
    {
      '@type': 'ListItem',
      position: 3,
      url: 'https://www.diy-builder.fr/guides/pergola',
      name: 'Guide pergola bois',
      image: 'https://www.diy-builder.fr/images/guides/cards/pergola.png',
    },
    {
      '@type': 'ListItem',
      position: 4,
      url: 'https://www.diy-builder.fr/guides/cloture',
      name: 'Guide clôture bois',
      image: 'https://www.diy-builder.fr/images/guides/cards/cloture.png',
    },
    {
      '@type': 'ListItem',
      position: 5,
      url: 'https://www.diy-builder.fr/dalle',
      name: 'Tutoriel dalle béton extérieure (NF DTU 13.3)',
      image: 'https://www.diy-builder.fr/images/guides/cards/dalle.png',
    },
    {
      '@type': 'ListItem',
      position: 6,
      url: 'https://www.diy-builder.fr/guides/soi-meme-ou-pro',
      name: 'Faire soi-même ou faire faire : 5 critères pour décider',
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

        <h1 className="content-h1">6 guides pour construire en bois et béton</h1>

        <p className="content-meta">
          <span><strong>Mis à jour le 16 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
        </p>

        <p className="content-lead">
          Ces cinq guides ont été rédigés pour des bricoleurs qui construisent eux-mêmes — pas pour des
          professionnels du bâtiment. Quatre projets bois (terrasse, cabanon ossature, pergola, clôture)
          et un tutoriel béton (dalle de fondation) traités du début à la fin : choix des matériaux,
          calculs dimensionnels issus des DTU en vigueur (31.1, 31.2, 51.4, 13.3), liste des outils,
          étapes dans l&apos;ordre. Les prix indiqués correspondent à des achats en grande surface de
          bricolage française, mis à jour régulièrement. Vous trouverez aussi les erreurs courantes à
          éviter — celles qui font reprendre un chantier à zéro. Si vous n&apos;avez jamais posé une
          lambourde ou monté une ossature bois, partez du guide terrasse : c&apos;est le plus court, le
          plus direct, et il pose les bases que les autres projets reprennent.
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
            lisez le guide en entier avant de commander les matériaux. Et avant tout cabanon ou grosse
            pergola, consultez le tutoriel <Link href="/dalle" className="content-link">dalle béton</Link>{' '}
            : la fondation conditionne toute la stabilité de l&apos;ouvrage, et une dalle ratée se paie
            cher quand l&apos;ossature est déjà montée.
          </p>
        </section>

        <section>
          <h2 className="content-h2">Les guides pratiques</h2>
          <div className="content-guides-grid">

            <Link href="/guides/terrasse" className="content-guide-card">
              <div className="content-guide-card-image">
                <Image
                  src="/images/guides/cards/terrasse.png"
                  alt="Terrasse bois en pin classe 4 sur plots béton dans un jardin"
                  width={1672}
                  height={941}
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
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
              <div className="content-guide-card-image">
                <Image
                  src="/images/guides/cards/cabanon.png"
                  alt="Cabanon ossature bois avec bardage clin et toit mono-pente en fond de jardin"
                  width={1672}
                  height={941}
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
              <h3 className="content-guide-card-title">Cabanon ossature bois</h3>
              <div className="content-guide-card-meta">
                <span className="badge-level">Avancé</span>
                <span className="badge-time">1-2 weekends</span>
                <span className="badge-cost">2&nbsp;500 – 5&nbsp;000&nbsp;€</span>
              </div>
              <p className="content-guide-card-desc">
                Montants 60&nbsp;cm d&apos;entraxe (DTU 31.2), lisses hautes et basses, bardage, toiture
                mono-pente. Le guide couvre aussi les ouvertures (porte, fenêtre) et le contreventement.
                Prévoir le week-end d&apos;ossature séparé du week-end de bardage.
              </p>
              <span className="btn-secondary">Lire le guide →</span>
            </Link>

            <Link href="/guides/pergola" className="content-guide-card">
              <div className="content-guide-card-image">
                <Image
                  src="/images/guides/cards/pergola.png"
                  alt="Pergola bois avec poteaux 90×90 mm et chevrons espacés sur terrasse"
                  width={1672}
                  height={941}
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
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
              <div className="content-guide-card-image">
                <Image
                  src="/images/guides/cards/cloture.png"
                  alt="Clôture bois claire-voie verticale en pin classe 4 en bord de jardin"
                  width={1672}
                  height={941}
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
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

            <Link href="/dalle" className="content-guide-card">
              <div className="content-guide-card-image">
                <Image
                  src="/images/guides/cards/dalle.png"
                  alt="Dalle béton extérieure fraîchement coulée avec treillis soudé ST25 visible sur la tranche"
                  width={1672}
                  height={941}
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
              <h3 className="content-guide-card-title">Dalle béton extérieure</h3>
              <div className="content-guide-card-meta">
                <span className="badge-level">Prérequis</span>
                <span className="badge-time">2 jours</span>
                <span className="badge-cost">150 – 600&nbsp;€</span>
              </div>
              <p className="content-guide-card-desc">
                Tutoriel illustré pour couler une dalle béton conforme NF DTU 13.3 — terrassement, forme
                drainante, treillis soudé ST25, coulage et joints. La fondation indispensable sous un
                cabanon ou une grosse pergola. Calculateur de matériaux inclus (béton, treillis).
              </p>
              <span className="btn-secondary">Lire le tutoriel →</span>
            </Link>

            <Link href="/guides/soi-meme-ou-pro" className="content-guide-card">
              <div className="content-guide-card-meta" style={{ marginTop: 0 }}>
                <span className="badge-level">Avant de commencer</span>
                <span className="badge-time">Lecture 12 min</span>
              </div>
              <h3 className="content-guide-card-title">Faire soi-même ou faire faire</h3>
              <p className="content-guide-card-desc">
                Cinq critères chiffrés pour trancher entre autoconstruction et appel à un artisan :
                surface du chantier, risque structurel, outillage nécessaire, garantie décennale,
                temps disponible. Tableau de décision projet par projet.
              </p>
              <span className="btn-secondary">Lire le guide →</span>
            </Link>

          </div>
        </section>

        <section>
          <h2 className="content-h2">Aller plus loin&nbsp;: comparatifs et analyses</h2>
          <p className="content-body">
            Pour creuser un sujet précis avant de vous lancer, ces analyses complémentaires reprennent
            une question fréquente avec des chiffres réels et des comparaisons enseigne par enseigne.
          </p>
          <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/guides/prix-terrasse-bois-m2-2026" className="content-link">
                Prix d&apos;une terrasse bois au m² en 2026
              </Link>
              {' '}— comparatif essence × enseigne (pin, douglas, ipé, composite) en mai 2026,
              avec et sans pose artisan.
            </li>
          </ul>
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
            <Link href="/cloture" className="content-link">clôture</Link>, et{' '}
            <Link href="/dalle" className="content-link">dalle béton</Link>{' '}
            — cinq outils gratuits, sans inscription.
          </p>
        </section>

        <CTALead projectHref="/" projectLabel="mon projet" />

      </div>
    </ContentLayout>
  );
}
