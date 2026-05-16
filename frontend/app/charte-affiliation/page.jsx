import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Charte d\'affiliation DIY Builder : comment ça marche, ce qu\'on gagne',
  description:
    'Transparence complète sur l\'affiliation DIY Builder : programmes actifs (Amazon, Awin, ManoMano), mécanisme de tracking, durée des cookies, règles éditoriales et engagement non-négociable. Conformité Loi 2023-451 et Code conso L121-1.',
  alternates: { canonical: 'https://diy-builder.fr/charte-affiliation' },
  openGraph: {
    title: 'Charte d\'affiliation DIY Builder : comment ça marche, ce qu\'on gagne',
    description:
      'Programmes actifs, cookies de tracking, règles éditoriales — tout ce qui concerne l\'affiliation sur DIY Builder, dit clairement.',
    url: 'https://diy-builder.fr/charte-affiliation',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://diy-builder.fr' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Charte d\'affiliation',
      item: 'https://diy-builder.fr/charte-affiliation',
    },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Charte d\'affiliation DIY Builder : comment ça marche, ce qu\'on gagne',
  url: 'https://diy-builder.fr/charte-affiliation',
  description:
    'Transparence complète sur l\'affiliation DIY Builder : programmes actifs, mécanisme de tracking, règles éditoriales.',
  dateModified: '2026-05-16',
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    url: 'https://diy-builder.fr',
  },
};

export default function CharteAffiliationPage() {
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
          <span className="content-breadcrumb-current">Charte d&apos;affiliation</span>
        </nav>

        <h1 className="content-h1">
          Charte d&apos;affiliation DIY Builder&nbsp;: comment ça marche, ce qu&apos;on gagne
        </h1>

        <p className="content-meta">
          <span><strong>Mis à jour le 16 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/mentions-legales">Mentions légales</Link></span>
        </p>

        <p className="content-lead">
          Certains liens sur DIY Builder sont des liens d&apos;affiliation. Lorsque vous cliquez
          et réalisez un achat, le site perçoit une commission du marchand. Votre prix
          d&apos;achat ne change pas. Cette page détaille précisément le mécanisme, les programmes
          actifs et les règles éditoriales qui encadrent ces liens — parce que la transparence
          sur ce point n&apos;est pas optionnelle. Elle est exigée par la Loi n° 2023-451 du
          9 juin 2023 (dite &quot;loi influenceurs&quot;) et par l&apos;article L121-1 du Code de la
          consommation.
        </p>

        <div className="content-disclaimer">
          <strong>Mention publicitaire :</strong> certains liens de ce site sont rémunérés.
          Voir ci-dessous le détail complet des programmes actifs.
        </div>

        <h2 className="content-h2">Comment l&apos;affiliation fonctionne</h2>
        <p className="content-body">
          Techniquement, voici ce qui se passe quand vous cliquez sur un bouton &quot;Voir chez
          Leroy Merlin&quot; ou équivalent dans un simulateur DIY Builder :
        </p>
        <ol className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            Le clic passe par notre redirecteur interne (<code>/api/go</code>) qui ajoute
            des paramètres UTM (source, medium, campaign) identifiant DIY Builder comme
            origine du trafic.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Vous arrivez sur le site de l&apos;enseigne (leroymerlin.fr, castorama.fr,
            bricodepot.fr ou manomano.fr). Si un programme d&apos;affiliation est actif avec
            cette enseigne, l&apos;URL de destination contient un identifiant affilié
            supplémentaire.
          </li>
          <li style={{ marginBottom: '10px' }}>
            Un cookie de tracking est déposé par l&apos;enseigne ou la plateforme d&apos;affiliation
            (pas par DIY Builder) dans votre navigateur, pour une durée variable selon
            le programme (précisée ci-dessous).
          </li>
          <li style={{ marginBottom: '10px' }}>
            Si vous réalisez un achat dans cette fenêtre, l&apos;enseigne attribue une commission
            à DIY Builder. Cette commission est calculée sur le montant de votre achat
            (taux variable par catégorie de produit) et ne s&apos;ajoute pas à votre prix.
          </li>
        </ol>
        <p className="content-body">
          Si vous achetez après expiration du cookie, ou sur un autre navigateur ou
          appareil, DIY Builder ne perçoit rien. Si vous utilisez un bloqueur de
          publicité qui neutralise les cookies de tracking, DIY Builder ne perçoit rien.
        </p>

        <h2 className="content-h2">Programmes d&apos;affiliation actifs</h2>
        <p className="content-body">
          Les programmes actifs au moment de la mise à jour de cette page sont les suivants.
          La liste est tenue à jour — si un programme est suspendu ou ajouté, cette section
          est modifiée.
        </p>

        <h3 className="content-h3">Amazon Partenaires</h3>
        <p className="content-body">
          DIY Builder participe au Programme Partenaires d&apos;Amazon EU, conçu pour permettre
          à des sites de percevoir une rémunération grâce à la création de liens vers Amazon.fr.
          Les liens vers Amazon concernent essentiellement les produits de quincaillerie
          (vis, équerres, chevilles, outils de pose) disponibles en livraison rapide mais
          moins bien référencés en GSB physique.
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Plateforme&nbsp;:</strong> programme affilié Amazon direct
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Durée du cookie&nbsp;:</strong> 24 heures (achat dans le panier) ou
            90 jours (produit ajouté au panier mais acheté plus tard)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Taux de commission&nbsp;:</strong> variable par catégorie (bricolage&nbsp;:
            généralement 3–5&nbsp;%)
          </li>
        </ul>

        <h3 className="content-h3">Leroy Merlin, Castorama, Brico Dépôt</h3>
        <p className="content-body">
          Les liens vers ces trois enseignes passent actuellement par notre redirecteur UTM
          sans identifiant affilié actif — les paramètres d&apos;affiliation Awin/Affilae sont
          en cours de validation pour ces comptes. Les liens sont donc actuellement des
          liens de référencement pur (suivi UTM uniquement) sans rémunération sur les
          achats générés.
        </p>
        <p className="content-body">
          Dès que les comptes affiliés Awin seront validés, cette section sera mise à
          jour avec les identifiants de programme et les durées de cookie correspondantes.
          En attendant, les comparatifs de prix restent complets et non conditionnés à
          l&apos;existence d&apos;un programme.
        </p>

        <h3 className="content-h3">ManoMano</h3>
        <p className="content-body">
          Les liens vers ManoMano passent par notre redirecteur UTM. Un programme
          d&apos;affiliation ManoMano (direct ou via plateforme) est en cours d&apos;étude.
          Aucune rémunération active sur les achats ManoMano à date.
        </p>
        <p className="content-body">
          ManoMano est inclus dans les comparatifs indépendamment de ce statut, parce
          que c&apos;est un acteur pertinent sur les prix des matériaux bois — notamment sur
          les références moins courantes en GSB physique.
        </p>

        <h2 className="content-h2">Notre engagement non-négociable</h2>
        <p className="content-body">
          Trois règles qui ne bougent pas, programme actif ou non :
        </p>

        <h3 className="content-h3">1. Le choix éditorial précède le lien d&apos;affiliation</h3>
        <p className="content-body">
          Les quatre enseignes du comparatif (Leroy Merlin, Castorama, Brico Dépôt,
          ManoMano) sont dans les simulateurs parce que ce sont les quatre GSB majeurs
          en France pour les matériaux bois — pas parce qu&apos;elles ont un programme
          d&apos;affiliation avec nous. Les prix sont comparés honnêtement : si Brico Dépôt
          est moins cher sur un produit donné, c&apos;est affiché comme tel, même si c&apos;est
          l&apos;enseigne avec laquelle nous avons le moins de liens affiliés actifs.
        </p>
        <p className="content-body">
          Aucun tri des résultats n&apos;est effectué en fonction de la commission perçue.
          L&apos;ordre d&apos;affichage dans les comparatifs est alphabétique ou par prix croissant
          selon la vue sélectionnée.
        </p>

        <h3 className="content-h3">2. On cite même sans programme</h3>
        <p className="content-body">
          Si un produit ou une enseigne est pertinent pour l&apos;utilisateur mais n&apos;a pas
          de programme d&apos;affiliation avec nous, il est mentionné quand même. Exemple :
          les prix Brico Dépôt sont dans tous les comparatifs même quand le scraping
          automatique est difficile et le programme inactif. On perd peut-être de l&apos;argent
          sur ce choix ; un comparatif partiel coûterait plus en crédibilité.
        </p>

        <h3 className="content-h3">3. On refuse les conditions éditoriales</h3>
        <p className="content-body">
          Nous n&apos;acceptons pas de partenariats conditionnés à un avis positif, à l&apos;exclusion
          d&apos;un concurrent ou à la mise en avant artificielle d&apos;un produit. Si une enseigne
          ou une marque nous contactait pour proposer ce type d&apos;accord, le refus serait
          immédiat. Cette règle n&apos;a jamais été testée à date, mais elle est écrite ici
          pour être opposable.
        </p>

        <h2 className="content-h2">Les prix affichés</h2>
        <p className="content-body">
          Les prix dans les simulateurs sont mis à jour par scraping automatisé, avec
          vérification manuelle avant intégration. Ils portent une date de dernière
          mise à jour (constante <code>PRICES_DATE</code> dans le code source). Ils
          peuvent diverger du prix constaté en magasin ou sur le site de l&apos;enseigne
          au moment où vous les consultez — les prix en ligne varient, parfois quotidiennement
          pour certaines références ManoMano.
        </p>
        <p className="content-body">
          Ces prix sont affichés à titre indicatif pour permettre une comparaison
          de tendance entre enseignes. Ils ne constituent pas un engagement de prix
          de la part des enseignes ni de DIY Builder. Vérifiez toujours le prix
          sur le site de l&apos;enseigne avant d&apos;ajouter au panier.
        </p>
        <p className="content-body">
          Vous constatez un écart important entre le prix affiché et le prix réel ?{' '}
          <Link href="/contact">Signalez-le</Link> avec l&apos;enseigne et le produit — nous
          corrigeons sous 7 jours ouvrés.
        </p>

        <h2 className="content-h2">Mention sur les pages du site</h2>
        <p className="content-body">
          Cette charte constitue la déclaration générale de nature publicitaire des liens
          affiliés sur l&apos;ensemble du site DIY Builder. Conformément aux recommandations
          de la DGCCRF et aux exigences de la Loi 2023-451, un rappel court est affiché
          sur les pages contenant des liens affiliés actifs :
        </p>
        <div className="content-disclaimer">
          &quot;Ce site contient des liens affiliés. Si vous achetez via ces liens, DIY Builder
          perçoit une commission sans surcoût pour vous.&quot;
        </div>
        <p className="content-body" style={{ marginTop: '16px' }}>
          Ce disclaimer est visible sans défilement sur les pages concernées. Il n&apos;est
          pas noyé dans un footer ou dans une politique de confidentialité — c&apos;est ici,
          et c&apos;est répété là où les liens apparaissent.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/a-propos">À propos — comment DIY Builder est financé</Link></li>
            <li><Link href="/methodologie">Méthodologie — comment les prix sont relevés</Link></li>
            <li><Link href="/mentions-legales">Mentions légales — directeur de publication</Link></li>
            <li><Link href="/contact">Contact — signaler un écart de prix</Link></li>
          </ul>
        </aside>
      </div>
    </ContentLayout>
  );
}
