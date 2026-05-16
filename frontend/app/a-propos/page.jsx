import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'À propos de DIY Builder : qui sommes-nous, comment on bosse',
  description:
    'DIY Builder : quatre simulateurs de construction bois gratuits (terrasse, cabanon, pergola, clôture), calculs DTU, comparatif de prix par enseigne. Pourquoi ce site existe et comment il est financé.',
  alternates: { canonical: 'https://www.diy-builder.fr/a-propos' },
  openGraph: {
    title: 'À propos de DIY Builder : qui sommes-nous, comment on bosse',
    description:
      'Origine, mission et modèle économique de DIY Builder — quatre simulateurs bois gratuits financés par l\'affiliation transparente.',
    url: 'https://www.diy-builder.fr/a-propos',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr' },
    { '@type': 'ListItem', position: 2, name: 'À propos', item: 'https://www.diy-builder.fr/a-propos' },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'À propos de DIY Builder : qui sommes-nous, comment on bosse',
  url: 'https://www.diy-builder.fr/a-propos',
  description:
    'Origine, mission et modèle économique de DIY Builder.',
  dateModified: '2026-05-16',
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    url: 'https://www.diy-builder.fr',
  },
};

export default function AProposPage() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="content-container">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">À propos</span>
        </nav>

        <h1 className="content-h1">À propos de DIY Builder&nbsp;: qui sommes-nous, comment on bosse</h1>

        <p className="content-meta">
          <span><strong>Mis à jour le 16 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
        </p>

        <p className="content-lead">
          DIY Builder est un ensemble de calculateurs de construction bois — terrasse, cabanon,
          pergola, clôture — conçus pour que n&apos;importe qui puisse obtenir une liste de matériaux
          cohérente avec les normes DTU avant d&apos;aller en GSB. Gratuit, sans compte, sans
          formulaire de données personnelles.
        </p>

        <h2 className="content-h2">Pourquoi DIY Builder existe</h2>
        <p className="content-body">
          Le problème qu&apos;on voulait résoudre est concret : pour savoir combien coûte une terrasse
          bois de 20 m², il faut soit payer un devis à un artisan (qui n&apos;a pas forcément envie
          de devis pour des projets qu&apos;il ne fera pas), soit passer des heures à calculer à la
          main des quantités de lames, de lambourdes et de plots — avec des références de produits
          différentes chez chaque enseigne.
        </p>
        <p className="content-body">
          Le même problème existe pour un cabanon (nombre de montants, section selon le DTU 31.2,
          chevrons de toiture), une pergola (poteaux, longerons, jambes de force) et une clôture
          (poteaux tous les 2 m, rails, lames). Les forums DIY français donnent des réponses
          variables et rarement sourcées. Les guides des GSB sont utiles mais ne calculent pas
          les quantités pour votre configuration spécifique.
        </p>
        <p className="content-body">
          DIY Builder répond à cette question simple : pour mes dimensions, combien de pièces
          faut-il commander, et combien ça coûte chez Leroy Merlin, Castorama, Brico Dépôt
          et ManoMano aujourd&apos;hui ?
        </p>

        <h2 className="content-h2">Ce qu&apos;on fait, ce qu&apos;on ne fait pas</h2>
        <p className="content-body">
          Ce que DIY Builder propose :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Quatre simulateurs gratuits</strong> : terrasse bois, cabanon ossature bois,
            pergola, clôture bois. Accessibles sans compte et sans inscription.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Calculs basés sur les normes DTU</strong> : les quantités générées
            (nombre de montants, sections, entraxes) suivent NF DTU 31.2, 31.1, 51.4 et 13.3.
            Les constantes sont documentées et traçables — voir <Link href="/methodologie">la
            page méthodologie</Link>.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Comparatif de prix par enseigne</strong> : les prix Leroy Merlin,
            Castorama, Brico Dépôt et ManoMano sont mis à jour mensuellement par scraping
            automatisé. Ils sont datés dans le code — vous voyez toujours la date du
            dernier relevé.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Export PDF</strong> : la liste de matériaux et l&apos;estimatif budgétaire
            peuvent être exportés en PDF pour l&apos;emmener en magasin ou le joindre à un
            dossier de déclaration préalable de travaux.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Visualisation 3D</strong> : l&apos;ossature du cabanon et la structure de la
            pergola sont visualisables en 3D (mode assemblé, structure, détaillé, éclaté).
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Guides et FAQ</strong> : des articles techniques couvrant les étapes de
            construction, les règles réglementaires (urbanisme, RE 2020) et les questions
            fréquentes de mise en œuvre.
          </li>
        </ul>

        <p className="content-body">
          Ce que DIY Builder ne fait pas :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pas de mise en relation avec des artisans</strong> : les simulateurs
            calculent des quantités pour l&apos;autoproduction. Nous ne référençons pas
            d&apos;artisans et ne gérons pas de demandes de devis auprès de professionnels.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pas de boutique propre</strong> : les liens vers les enseignes renvoient
            directement sur les sites des distributeurs. DIY Builder ne stocke ni ne revend
            de matériaux.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pas de devis contractuel</strong> : les quantités et prix générés sont
            des estimatifs indicatifs. Pour un projet structurel engageant (cabanon
            &gt; 20 m², pergola couverte portant des charges de neige), consultez un
            bureau d&apos;études ou un charpentier qualifié. C&apos;est dit dans les simulateurs
            et dans les guides — nous ne le cachons pas.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Pas de support technique des marques</strong> : si un produit acheté
            chez Leroy Merlin présente un défaut, le recours est auprès de Leroy Merlin —
            pas auprès de nous.
          </li>
        </ul>

        <h2 className="content-h2">Pourquoi une signature collective</h2>
        <p className="content-body">
          Les contenus de DIY Builder sont signés &quot;L&apos;équipe DIY Builder&quot; sans auteur individuel
          nominatif. Ce n&apos;est pas une façon de masquer quelque chose — le directeur de
          publication légal est identifié dans les <Link href="/mentions-legales">mentions légales</Link>.
          C&apos;est un choix éditorial : le contenu technique est produit et relu collectivement,
          et attribuer un article à une personne alors qu&apos;il a été construit à plusieurs
          est inexact.
        </p>
        <p className="content-body">
          La contrepartie de ce choix est la transparence sur la méthode : toutes les normes
          citées, toutes les constantes utilisées dans les calculs, et toutes les sources de
          prix sont documentées. Voir <Link href="/methodologie">la page méthodologie</Link> et{' '}
          <Link href="/sources">la page sources</Link>.
        </p>

        <h2 className="content-h2">Comment on est financé</h2>
        <p className="content-body">
          DIY Builder est financé à 100 % par l&apos;affiliation. Lorsqu&apos;un utilisateur clique
          sur un lien vers une enseigne partenaire et réalise un achat dans la fenêtre de
          tracking, le site perçoit une commission de la part du marchand. Le prix payé
          par l&apos;acheteur est strictement identique avec ou sans lien affilié.
        </p>
        <p className="content-body">
          Il n&apos;y a pas de publicité display (bannières, interstitiels), pas de contenu
          sponsorisé par les marques, et pas de partenariat conditionnel à des avis positifs.
          Le détail complet des programmes d&apos;affiliation actifs et de nos règles éditoriales
          en la matière est dans la <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
        </p>
        <p className="content-body">
          Ce modèle crée un intérêt financier à ce que les utilisateurs cliquent et achètent.
          Nous le savons et nous le disons. La façon dont nous le gérons : les comparatifs
          de prix incluent les quatre enseignes même quand certaines n&apos;ont pas de programme
          d&apos;affiliation actif avec nous — parce qu&apos;un comparatif partial n&apos;est pas un
          comparatif.
        </p>

        <h2 className="content-h2">Comment nous contacter</h2>
        <p className="content-body">
          Pour toute question, signalement d&apos;erreur factuelle, suggestion de sujet ou demande
          presse : <Link href="/contact">page contact</Link> — réponse sous 7 jours ouvrés.
        </p>
        <p className="content-body">
          Pour un droit de réponse sur un contenu publié : même adresse, avec la mention
          &quot;droit de réponse&quot; en objet. Nous appliquons les délais légaux.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/methodologie">Méthodologie — nos calculs et sources DTU</Link></li>
            <li><Link href="/charte-affiliation">Charte d&apos;affiliation — comment on gagne de l&apos;argent</Link></li>
            <li><Link href="/mentions-legales">Mentions légales</Link></li>
            <li><Link href="/contact">Nous contacter</Link></li>
          </ul>
        </aside>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Essayez les simulateurs</p>
          <p className="content-cta-box-title">Terrasse, cabanon, pergola, clôture</p>
          <p className="content-cta-box-desc">
            Calcul gratuit, liste de matériaux avec prix par enseigne, export PDF.
            Aucun compte requis.
          </p>
          <a href="/" className="btn-primary">
            Voir les simulateurs{' '}
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
