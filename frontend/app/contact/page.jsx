import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = {
  title: 'Contact DIY Builder : nous écrire, signaler une erreur',
  description:
    'Contactez l\'équipe DIY Builder par email pour une correction factuelle, une suggestion de sujet, un retour simulateur ou une demande presse. Réponse sous 7 jours ouvrés.',
  alternates: { canonical: 'https://www.diy-builder.fr/contact' },
  openGraph: {
    title: 'Contact DIY Builder : nous écrire, signaler une erreur',
    description:
      'Email, délai de réponse et guide de routage pour contacter l\'équipe DIY Builder efficacement.',
    url: 'https://www.diy-builder.fr/contact',
    type: 'website',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr' },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://www.diy-builder.fr/contact' },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact DIY Builder',
  url: 'https://www.diy-builder.fr/contact',
  description: 'Page de contact de DIY Builder.',
  dateModified: '2026-05-16',
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    url: 'https://www.diy-builder.fr',
    email: 'contact@diy-builder.fr',
  },
};

export default function ContactPage() {
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
          <span className="content-breadcrumb-current">Contact</span>
        </nav>

        <h1 className="content-h1">Contact DIY Builder&nbsp;: nous écrire, signaler une erreur</h1>

        <p className="content-meta">
          <span><strong>Mis à jour le 16 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
        </p>

        <p className="content-lead">
          Pour nous écrire : <strong>contact@diy-builder.fr</strong>. Délai de réponse
          habituel : 7 jours ouvrés. Pas de support 24/7, pas de chat en temps réel —
          on lit et on répond, par mail, dans les meilleurs délais.
        </p>

        <h2 className="content-h2">Nous écrire</h2>
        <p className="content-body">
          L&apos;adresse de contact unique est{' '}
          <a href="mailto:contact@diy-builder.fr">contact@diy-builder.fr</a>.
        </p>
        <p className="content-body">
          Délai de réponse : <strong>7 jours ouvrés</strong> dans la grande majorité des cas.
          Pour les corrections factuelles urgentes (erreur sur un prix ou une constante
          DTU), on essaie de traiter en 48 h ouvrées. Pour les demandes presse, merci de
          le préciser en objet — elles remontent en priorité.
        </p>
        <p className="content-body">
          Pas de formulaire en ligne : un formulaire collecte des données personnelles côté
          serveur, un email aussi — mais au moins vous contrôlez depuis quel client mail
          vous écrivez, et vous gardez une copie de votre message. Un email c&apos;est plus
          simple et plus respectueux de vos données.
        </p>

        <h2 className="content-h2">Avant d&apos;écrire</h2>
        <p className="content-body">
          Selon votre question, une page existante répondra plus vite que nous :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '12px' }}>
            <strong>Doute sur la méthode de calcul ou les normes DTU utilisées</strong>&nbsp;→{' '}
            <Link href="/methodologie">page méthodologie</Link> et{' '}
            <Link href="/sources">page sources DTU</Link>. Les constantes structurelles
            (entraxe des montants, sections, coefficients) y sont toutes documentées avec
            leur référence normative.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Vous voulez vérifier la source d&apos;un chiffre précis</strong>&nbsp;→{' '}
            <Link href="/sources">page sources</Link>. Chaque norme, chaque texte légal et
            chaque enseigne est listé avec son URL.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Question sur l&apos;affiliation ou sur un lien rémunéré</strong>&nbsp;→{' '}
            <Link href="/charte-affiliation">charte d&apos;affiliation</Link>. Les programmes
            actifs, les durées de cookie et nos règles éditoriales y sont détaillés.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Question sur vos données personnelles</strong>&nbsp;→{' '}
            <Link href="/politique-confidentialite">politique de confidentialité</Link> et{' '}
            <Link href="/cookies">politique cookies</Link>. Pour un exercice de droit d&apos;accès
            ou de suppression RGPD, écrivez-nous avec la mention &quot;RGPD&quot; en objet.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Informations légales sur l&apos;éditeur</strong>&nbsp;→{' '}
            <Link href="/mentions-legales">mentions légales</Link>. SIRET, hébergeur, directeur
            de publication — tout y est.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Question technique sur la construction</strong> (pas sur le simulateur)&nbsp;→{' '}
            <Link href="/faq">FAQ</Link> en premier lieu. 24 questions couvrent les sections
            de bois, les classes de traitement, la RE 2020 et les démarches urbanisme.
            Si la réponse n&apos;est pas là, écrivez-nous et on envisagera une nouvelle entrée FAQ.
          </li>
        </ul>

        <h2 className="content-h2">Ce qui passe particulièrement bien</h2>
        <p className="content-body">
          Les messages les plus utiles qu&apos;on reçoit :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Correction factuelle</strong> : &quot;dans le guide cabanon, vous dites X
            mais le DTU 31.2 §9.1.1.2 dit Y&quot; — avec le paragraphe exact et votre source.
            Ce type de retour est traité en priorité et la correction est créditée dans
            le changelog de la page.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Écart de prix constaté</strong> : &quot;le prix du montant 45×90 chez
            Castorama affiche X€ dans le simulateur mais il est à Y€ en ce moment sur
            le site&quot;. Précisez l&apos;enseigne, le produit et la date — on corrige dans les
            7 jours.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Suggestion de module ou de sujet</strong> : &quot;il manque un calculateur
            pour les garde-corps&quot; ou &quot;un guide sur les fondations sur plots mériterait
            un article&quot;. On ne promet pas de tout faire, mais on lit tout.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Retour d&apos;usage sur le simulateur</strong> : &quot;sur mobile, le slider de
            profondeur est difficile à manipuler&quot; ou &quot;l&apos;export PDF n&apos;affiche pas les
            fondations&quot;. Ces retours alimentent directement les correctifs.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Demande presse</strong> : présentez votre média et votre angle. On répond
            en 48 h ouvrées sur ce type de demande.
          </li>
        </ul>

        <h2 className="content-h2">Ce qu&apos;on ne fait pas par email</h2>
        <p className="content-body">
          Pour gagner du temps des deux côtés :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Support technique des outils des marques</strong> : si votre perceuse
            Bosch tombe en panne ou si votre commande Leroy Merlin n&apos;arrive pas, le
            contact est le fabricant ou l&apos;enseigne directement. Nous ne sommes pas
            revendeurs et nous ne pouvons pas intervenir sur les commandes en ligne.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Devis personnalisé</strong> : les simulateurs font ça mieux et plus
            vite. Si le résultat du simulateur ne correspond pas à votre besoin (projet
            sur-mesure, configuration atypique), un artisan ou un charpentier de votre
            région sera plus utile qu&apos;un email.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Démarchage commercial</strong> : les propositions de partenariat
            éditorial conditionnel, de &quot;placement naturel&quot; de produit, de lien sponsorisé
            non signalé — ces demandes ne reçoivent pas de réponse. Ce n&apos;est pas
            de l&apos;arrogance, c&apos;est notre modèle éditorial, décrit dans la{' '}
            <Link href="/charte-affiliation">charte d&apos;affiliation</Link>.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Vérification de plan ou de devis tiers</strong> : nous ne pouvons pas
            valider le plan d&apos;un artisan ou les quantités d&apos;un autre calculateur.
            Les simulateurs génèrent leurs propres estimatifs — comparez, mais nous ne
            sommes pas un bureau de contrôle.
          </li>
        </ul>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/methodologie">Méthodologie — comment nos calculs sont construits</Link></li>
            <li><Link href="/sources">Sources DTU — normes et textes légaux cités</Link></li>
            <li><Link href="/charte-affiliation">Charte d&apos;affiliation</Link></li>
            <li><Link href="/faq">FAQ technique — 24 questions de construction bois</Link></li>
          </ul>
        </aside>
      </div>
    </ContentLayout>
  );
}
