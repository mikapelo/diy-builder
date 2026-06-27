import Link from 'next/link';
import Image from 'next/image';
import ContentLayout from '@/components/layout/ContentLayout';
import CTALead from '@/components/landing/CTALead';

const OG_TITLE = 'Prix terrasse bois au m² en France 2026';
const OG_SUBTITLE = 'Comparatif essence × enseigne · chiffres recalculés';
const OG_URL = `https://www.diy-builder.fr/api/og?title=${encodeURIComponent(OG_TITLE)}&subtitle=${encodeURIComponent(OG_SUBTITLE)}&type=guide&icon=terrasse`;

export const metadata = {
  title: 'Prix terrasse bois au m² 2026 : le vrai prix dès 43 €/m²',
  description:
    'Le vrai prix au m² d\'une terrasse bois en 2026 : pin 43-53 €, douglas 53-65 €, ipé 103-125 € hors pose. L\'étiquette du rayon cache 60 % du coût réel.',
  alternates: { canonical: 'https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026' },
  openGraph: {
    title: 'Prix terrasse bois au m² 2026 : le vrai prix dès 43 €/m² | DIY Builder',
    description: 'Le vrai prix au m² d\'une terrasse bois en 2026 : pin 43-53 €, douglas 53-65 €, ipé 103-125 € hors pose, et le coût que l\'étiquette du rayon cache.',
    url: 'https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026',
    type: 'article',
    images: [{ url: OG_URL, width: 1200, height: 630, alt: 'Comparatif prix terrasse bois 2026 — DIY Builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_URL],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Prix d\'une terrasse bois au m² en France en 2026 : comparatif essence × enseigne',
  description:
    'Le prix réel d\'une terrasse bois au m² en France en 2026, recalculé à partir de notre base de prix relevée chez Leroy Merlin, Castorama, Brico Dépôt et ManoMano. Comparatif par essence (pin, douglas, ipé, composite) et par enseigne, avec et sans pose artisan.',
  author: { '@type': 'Organization', name: 'DIY Builder', url: 'https://www.diy-builder.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'DIY Builder',
    logo: { '@type': 'ImageObject', url: 'https://www.diy-builder.fr/images/logo-512.png' },
  },
  datePublished: '2026-05-24',
  dateModified: '2026-05-24',
  mainEntityOfPage: 'https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026',
  image: OG_URL,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.diy-builder.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.diy-builder.fr/guides' },
    { '@type': 'ListItem', position: 3, name: 'Guide terrasse bois', item: 'https://www.diy-builder.fr/guides/terrasse' },
    { '@type': 'ListItem', position: 4, name: 'Prix terrasse bois au m² 2026', item: 'https://www.diy-builder.fr/guides/prix-terrasse-bois-m2-2026' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel est le prix au m² d\'une terrasse bois en 2026 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hors pose, comptez 43 à 53 €/m² en pin traité autoclave classe 4, 53 à 65 €/m² en douglas, 103 à 125 €/m² en ipé. Avec la pose artisan, ajoutez 40 à 60 €/m². Ces fourchettes sont issues de notre base de prix mai 2026 (Brico Dépôt en bas, Leroy Merlin en haut) pour une terrasse rectangulaire de 12 m², lambourdes incluses.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle enseigne est la moins chère pour une terrasse pin ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Brico Dépôt sur les volumes standard : 517 € pour 12 m² de pin traité (lames + lambourdes + plots + visserie), contre 634 € en Leroy Merlin et 637 € en Castorama (mai 2026). L\'écart représente environ 23 % entre le moins cher et le plus cher pour des produits techniquement équivalents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Pourquoi le bois composite n\'est pas systématiquement plus cher que l\'ipé ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le composite (~75 à 90 €/m²) est plus cher que le pin et le douglas, mais reste sous l\'ipé (~103 à 125 €/m²). Sa durée de vie de 25 à 30 ans sans entretien le rend compétitif sur 20 ans, surtout face aux essences qui demandent un saturateur tous les 2 ans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Que comprend exactement le prix au m² annoncé en GSB ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quasiment jamais le total. Les étiquettes 25-40 €/m² en GSB visent la lame matière seule, sans la structure (lambourdes, plots), sans la visserie inox A2, sans la bande bitume. Le total réel se situe entre 43 et 65 €/m² selon l\'essence — soit environ 60 % de plus que l\'étiquette de la lame.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quand fait-il sens de passer par un artisan plutôt que de poser soi-même ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Au-delà de 25 m² ou si la pente du terrain dépasse 5 %. La pose représente alors plus de 40 % du budget total et un artisan qualifié garantit la planéité (±5 mm sous règle de 2 m, DTU 51.4) que la plupart des bricoleurs ne tiennent pas sans niveau laser. Pour une petite terrasse rectangulaire sur sol plat, la pose soi-même reste rentable.',
      },
    },
  ],
};

export default function PrixTerrasseBoisM2Page() {
  return (
    <ContentLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="content-container">
        <nav aria-label="Fil d'Ariane" className="content-breadcrumb">
          <a href="/">Accueil</a>
          <span className="content-breadcrumb-sep">›</span>
          <a href="/guides">Guides</a>
          <span className="content-breadcrumb-sep">›</span>
          <Link href="/guides/terrasse">Terrasse bois</Link>
          <span className="content-breadcrumb-sep">›</span>
          <span className="content-breadcrumb-current">Prix au m² 2026</span>
        </nav>

        <h1 className="content-h1">Prix d&apos;une terrasse bois au m² en France en 2026 : comparatif essence × enseigne</h1>

        <p className="content-meta">
          <span><strong>Publié le 24 mai 2026</strong></span>
          <span>·</span>
          <span>L&apos;équipe DIY Builder</span>
          <span>·</span>
          <span><Link href="/methodologie">Méthodologie</Link></span>
          <span>·</span>
          <span><Link href="/sources">Sources DTU</Link></span>
        </p>

        <div className="content-hero">
          <Image
            src="/images/guides/prix-terrasse-bois-m2-2026/hero.png"
            alt="Échantillons de lames de terrasse en quatre essences (pin autoclave, douglas, ipé, composite) alignés avec étiquettes prix et mètre déroulé, ambiance jardin lumière dorée"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, margin: '0 0 32px 0' }}
          />
        </div>

        <p className="content-lead">
          Les annonces 25–40 €/m² en grande surface de bricolage cachent un piège classique : le prix porte
          uniquement sur la lame, jamais sur l&apos;addition complète. Une fois lambourdes, plots, visserie inox
          et bande bitume comptés, le total tourne plutôt entre 43 et 65 €/m² selon l&apos;essence — et l&apos;écart
          entre Brico Dépôt et Leroy Merlin atteint 23 % sur un projet de 12 m². Cet article compare le
          prix réel d&apos;une terrasse bois au m² en France, en 2026, sur quatre essences (pin traité, douglas, ipé, composite) et quatre enseignes
          (Leroy Merlin, Castorama, Brico Dépôt, ManoMano), avec et sans pose par un artisan. Tous les chiffres
          sont recalculés à partir de notre{' '}
          <Link href="/methodologie" className="content-link">base de prix relevée</Link> sur une terrasse
          rectangulaire de 12 m² (4 × 3 m), structure complète incluse.
        </p>

        <h2 className="content-h2">Ce qui se cache derrière le prix au m² affiché en magasin</h2>
        <p className="content-snippet">
          L&apos;étiquette 30&nbsp;€/m² d&apos;une lame pin traité ne couvre que la lame elle-même.
          Une terrasse posée demande aussi des lambourdes (~95&nbsp;€/12&nbsp;m²),
          des plots réglables (~125&nbsp;€), une boîte de vis inox A2 (~43&nbsp;€) et une bande bitume
          de protection sous lambourdes (~34&nbsp;€). Total réel pour 12&nbsp;m² en pin&nbsp;: 517 à
          637&nbsp;€ selon l&apos;enseigne, soit 43 à 53&nbsp;€/m² hors pose.
        </p>
        <p className="content-body">
          Quand un magasin affiche &quot;à partir de 25 €/m²&quot;, l&apos;information vise un client qui s&apos;arrête
          au rayon lames. Une terrasse en place demande quatre couches de matériaux que personne ne pose
          séparément : la lame visible, la lambourde qui porte la lame, le plot ou la semelle qui porte la
          lambourde, et la visserie qui tient tout ensemble. Manquer une couche dans le devis mental, c&apos;est
          se retrouver à 25 % au-dessus du budget au moment de passer en caisse.
        </p>
        <p className="content-body">
          Pour 12 m² de terrasse rectangulaire (4 m × 3 m) en pin traité classe 4, voici la nomenclature
          réelle d&apos;après le DTU 51.4 — entraxe lambourdes 40 cm, lames 145×27 mm de 3,6 m, plots tous les
          1,5 m, visserie inox A2 obligatoire en extérieur :
        </p>
        <ul className="content-body" style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>26 lames de terrasse</strong> 145×27 mm × 3,6 m — surface couverte 13,2 m² avec
            10 % de chute, conforme DTU 51.4 §6.3
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>8 lambourdes</strong> 60×70 mm classe 4 en 3 m — porteur sous lames, section minimale
            DTU 51.4 §6.2
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>14 plots réglables</strong> — entraxe 1,5 m dans les deux sens (DTU)
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>28 m linéaires de bande bitume</strong> sous lambourde — protection contre la remontée
            d&apos;humidité
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>1 boîte de 500 vis inox A2</strong> 5×60 mm — 2 vis par lame × par lambourde
          </li>
        </ul>

        <h2 className="content-h2">Pin traité autoclave — l&apos;option économique de 95 % des chantiers</h2>
        <p className="content-snippet">
          Pin sylvestre traité en autoclave classe 4 — la lame standard du marché français. Total
          matériaux pour 12&nbsp;m² au 24 mai 2026 : 517&nbsp;€ chez Brico Dépôt (43&nbsp;€/m²),
          560&nbsp;€ chez ManoMano (47&nbsp;€/m²), 634&nbsp;€ chez Leroy Merlin (53&nbsp;€/m²),
          637&nbsp;€ chez Castorama (53&nbsp;€/m²). L&apos;écart entre l&apos;enseigne la moins chère
          et la plus chère atteint 23 % pour la même nomenclature.
        </p>
        <p className="content-body">
          Le pin traité couvre la majorité des terrasses en France parce que son rapport prix-durée de vie
          reste imbattable. La lame courante (145×27 mm × 3,6 m) coûte 10,90 € en Brico Dépôt et 13,23 € en
          Castorama (avril 2026), soit un écart de 21 % au pied du rayon. Sur 26 lames, la facture lame seule
          oscille entre 283 € (Brico Dépôt) et 344 € (Castorama).
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Enseigne</th>
              <th>Lames (26)</th>
              <th>Lambourdes (8)</th>
              <th>Plots (14)</th>
              <th>Bande + vis</th>
              <th>Total 12 m²</th>
              <th>€/m²</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Brico Dépôt</td>
              <td>283 €</td>
              <td>63 €</td>
              <td>111 €</td>
              <td>60 €</td>
              <td><strong>517 €</strong></td>
              <td>43 €</td>
            </tr>
            <tr>
              <td>ManoMano</td>
              <td>312 €</td>
              <td>101 €</td>
              <td>105 €</td>
              <td>42 €</td>
              <td><strong>560 €</strong></td>
              <td>47 €</td>
            </tr>
            <tr>
              <td>Leroy Merlin</td>
              <td>338 €</td>
              <td>95 €</td>
              <td>125 €</td>
              <td>76 €</td>
              <td><strong>634 €</strong></td>
              <td>53 €</td>
            </tr>
            <tr>
              <td>Castorama</td>
              <td>344 €</td>
              <td>111 €</td>
              <td>77 €</td>
              <td>105 €</td>
              <td><strong>637 €</strong></td>
              <td>53 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Brico Dépôt domine sur les lames et les lambourdes (gammes Maximat ou équivalent), Castorama est
          en revanche compétitif sur les plots Blooma. Leroy Merlin reste central sur Starblock pour la
          visserie inox A2, qui pèse 76 € sur le total contre 60 € en Brico Dépôt. L&apos;enseigne ManoMano
          se positionne entre les deux, avec un avantage sur la visserie (17 € pour la boîte de 500 vs
          42 € en Leroy Merlin) mais des prix lames un peu plus hauts que Brico Dépôt.
        </p>

        <h2 className="content-h2">Douglas — 20 à 25 % plus cher pour une durée de vie équivalente</h2>
        <p className="content-snippet">
          Le douglas, résineux français à durabilité naturelle classe 3 (norme EN 350-2 — durabilité naturelle modérée) sans traitement chimique,
          coûte environ 40 % de plus que le pin sur la lame seule. Total matériaux pour 12&nbsp;m²&nbsp;:
          630&nbsp;€ chez Brico Dépôt (53&nbsp;€/m²) à 775&nbsp;€ chez Castorama (65&nbsp;€/m²).
          Sans entretien, il grisaille en 2-3 saisons — un rendu ardoise apprécié par beaucoup.
        </p>
        <p className="content-body">
          Le calcul change pour le douglas parce que la lame représente une part plus grande du total.
          La lame douglas 145×27 mm coûte de l&apos;ordre de 18,20 € en Leroy Merlin et 15,25 € en Brico Dépôt,
          soit un surcoût de 40 % par rapport au pin. Le reste de la nomenclature (lambourdes, plots,
          visserie) ne change pas — on garde du pin traité classe 4 en lambourde, qui n&apos;est pas exposé
          à la vue.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Enseigne</th>
              <th>Total 12 m² douglas</th>
              <th>€/m²</th>
              <th>Surcoût vs pin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Brico Dépôt</td>
              <td>~630 €</td>
              <td>53 €</td>
              <td>+22 %</td>
            </tr>
            <tr>
              <td>ManoMano</td>
              <td>~685 €</td>
              <td>57 €</td>
              <td>+22 %</td>
            </tr>
            <tr>
              <td>Leroy Merlin</td>
              <td>~770 €</td>
              <td>64 €</td>
              <td>+21 %</td>
            </tr>
            <tr>
              <td>Castorama</td>
              <td>~775 €</td>
              <td>65 €</td>
              <td>+22 %</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Le surcoût douglas vs pin tourne autour de 22 % toutes enseignes confondues. C&apos;est la
          différence entre un projet à 517 € et un projet à 630 € pour 12 m² — soit 113 €. Sur 25 ans
          de durée de vie comparable, la différence est négligeable. Le vrai argument du douglas, c&apos;est
          l&apos;absence de traitement chimique (cuivre azolé) et la patine grise qu&apos;il prend naturellement
          après 2 à 3 saisons.
        </p>

        <h2 className="content-h2">Ipé et bois exotiques — le triple du prix pour une durée de vie multipliée par 2</h2>
        <p className="content-snippet">
          L&apos;ipé, le teck et le cumaru atteignent 80 à 150&nbsp;€/m² pour la lame seule. Total matériaux
          pour 12&nbsp;m²&nbsp;: 1&nbsp;232&nbsp;€ chez Brico Dépôt (103&nbsp;€/m²) à 1&nbsp;505&nbsp;€
          chez Castorama (125&nbsp;€/m²). En contrepartie, durabilité 30-50 ans sans entretien et certification
          FSC obligatoire pour rester dans la légalité. Densité élevée — pré-perçage systématique.
        </p>
        <p className="content-body">
          L&apos;ipé est classe 1 selon EN 350 : il résiste aux champignons, aux termites et aux insectes
          xylophages sans aucun traitement. Sa densité (1 050 kg/m³) le rend dur à travailler — les vis
          inox A2 plient sans pré-perçage, les forets carbure deviennent obligatoires. Compter 20 % de plus
          en visserie A4 pour la résistance à la corrosion en bord de mer ou en piscine.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Enseigne</th>
              <th>Total 12 m² ipé</th>
              <th>€/m²</th>
              <th>Surcoût vs pin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Brico Dépôt</td>
              <td>~1 232 €</td>
              <td>103 €</td>
              <td>+138 %</td>
            </tr>
            <tr>
              <td>ManoMano</td>
              <td>~1 344 €</td>
              <td>112 €</td>
              <td>+140 %</td>
            </tr>
            <tr>
              <td>Leroy Merlin</td>
              <td>~1 488 €</td>
              <td>124 €</td>
              <td>+135 %</td>
            </tr>
            <tr>
              <td>Castorama</td>
              <td>~1 505 €</td>
              <td>125 €</td>
              <td>+136 %</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          L&apos;ipé ne se justifie économiquement que sur du long terme. Posée correctement, une terrasse
          ipé tient 30 à 50 ans contre 15 à 20 ans pour le pin traité. Sur 30 ans, le pin demande deux
          re-traitements (saturateur tous les 2-3 ans) plus un remplacement complet à mi-parcours. L&apos;ipé
          ne demande rien. Sur 25 ans amortis, le coût annuel devient comparable au pin.
        </p>
        <p className="content-body">
          Restriction réglementaire : l&apos;ipé importé dans l&apos;Union européenne doit faire
          l&apos;objet d&apos;une diligence raisonnée pour exclure les origines illégales, dans le
          cadre du règlement européen RBUE n°995/2010 (entré en application le 3 mars 2013). Les
          enseignes françaises vendent en pratique exclusivement de l&apos;ipé certifié FSC ou
          PEFC, ce qui élimine les revendeurs informels mais limite la variété d&apos;origines
          disponibles.
        </p>

        <h2 className="content-h2">Bois composite — entre 75 et 90 €/m² pour zéro entretien</h2>
        <p className="content-snippet">
          Le composite (60 % fibre bois, 40 % polymère HDPE), souvent rebaptisé WPC, vise les acheteurs
          qui ne veulent pas entretenir. Total matériaux pour 12&nbsp;m²&nbsp;: 885&nbsp;€ chez
          Brico Dépôt (74&nbsp;€/m²) à 1&nbsp;084&nbsp;€ chez Castorama (90&nbsp;€/m²). Durée de vie
          25-30 ans, mais aspect plastique reconnaissable et chaleur restituée par temps chaud.
        </p>
        <p className="content-body">
          Le composite est entre l&apos;ipé et le douglas en prix. Sa promesse — zéro saturateur, zéro
          grisaillement, zéro échardes — séduit les propriétaires qui ont d&apos;autres ouvrages à
          entretenir. La structure dessous reste classique (lambourdes pin traité, plots, vis inox) ; seules
          les lames changent.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Enseigne</th>
              <th>Total 12 m² composite</th>
              <th>€/m²</th>
              <th>Surcoût vs pin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Brico Dépôt</td>
              <td>~885 €</td>
              <td>74 €</td>
              <td>+71 %</td>
            </tr>
            <tr>
              <td>ManoMano</td>
              <td>~966 €</td>
              <td>80 €</td>
              <td>+72 %</td>
            </tr>
            <tr>
              <td>Leroy Merlin</td>
              <td>~1 074 €</td>
              <td>89 €</td>
              <td>+69 %</td>
            </tr>
            <tr>
              <td>Castorama</td>
              <td>~1 084 €</td>
              <td>90 €</td>
              <td>+70 %</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Deux inconvénients réels du composite à intégrer dans le choix : la lame chauffe sous le soleil
          direct (les teintes foncées peuvent devenir inconfortables pieds nus en plein été, plus que
          le bois), et le rendu plastique reste reconnaissable de près malgré les progrès des
          finitions imitation bois. Sur 25 ans d&apos;usage, le composite reste compétitif face à un pin
          re-traité tous les 2 ans, et bat l&apos;ipé en investissement initial.
        </p>

        <h2 className="content-h2">Tableau de synthèse — quatre essences × quatre enseignes pour 12 m²</h2>
        <p className="content-snippet">
          Le pin traité reste l&apos;option la plus accessible (43-53&nbsp;€/m² hors pose), suivi du
          douglas (+22 %), du composite (+70 %) et de l&apos;ipé (+135 %). L&apos;écart entre la solution
          la moins chère (pin Brico Dépôt à 517&nbsp;€) et la plus chère (ipé Castorama à 1&nbsp;505&nbsp;€)
          atteint un facteur 2,9 pour la même surface posée.
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Essence</th>
              <th>Brico Dépôt</th>
              <th>ManoMano</th>
              <th>Leroy Merlin</th>
              <th>Castorama</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Pin traité cl.4</strong></td>
              <td>517 € (43 €/m²)</td>
              <td>560 € (47 €/m²)</td>
              <td>634 € (53 €/m²)</td>
              <td>637 € (53 €/m²)</td>
            </tr>
            <tr>
              <td><strong>Douglas</strong></td>
              <td>630 € (53 €/m²)</td>
              <td>685 € (57 €/m²)</td>
              <td>770 € (64 €/m²)</td>
              <td>775 € (65 €/m²)</td>
            </tr>
            <tr>
              <td><strong>Composite WPC</strong></td>
              <td>885 € (74 €/m²)</td>
              <td>966 € (80 €/m²)</td>
              <td>1 074 € (89 €/m²)</td>
              <td>1 084 € (90 €/m²)</td>
            </tr>
            <tr>
              <td><strong>Ipé certifié FSC</strong></td>
              <td>1 232 € (103 €/m²)</td>
              <td>1 344 € (112 €/m²)</td>
              <td>1 488 € (124 €/m²)</td>
              <td>1 505 € (125 €/m²)</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Les douglas et composites Castorama et Leroy Merlin se tiennent à 1 ou 2 € près. Brico Dépôt
          conserve un avantage de 13 à 23 % toutes essences confondues, mais le réseau Brico Dépôt couvre
          moins le territoire — il faut vérifier le magasin le plus proche avant de fonder son devis.
          ManoMano se positionne en deuxième moins cher dans tous les cas, mais avec des délais de
          livraison plus longs (5-10 jours ouvrés pour le bois, contre retrait immédiat en GSB).
        </p>

        <div className="content-cta-box">
          <p className="content-cta-box-label">Comparateur 4 enseignes</p>
          <p className="content-cta-box-title">Obtenez les prix actuels pour vos dimensions</p>
          <p className="content-cta-box-desc">
            Notre simulateur recalcule la nomenclature exacte selon votre projet et compare les
            quatre enseignes en direct.
          </p>
          <a href="/calculateur" className="btn-primary">
            Lancer le simulateur{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <h2 className="content-h2">Avec un artisan, le budget double — la pose coûte autant que les matériaux</h2>
        <p className="content-snippet">
          Tarif moyen pose terrasse bois en France 2026 : 40 à 60 €/m² selon région et complexité du
          terrain. Pour 12 m², la pose ajoute donc 480 à 720 €, soit un projet artisan complet de
          1&nbsp;000 à 1&nbsp;350 € en pin traité, 1&nbsp;110 à 1&nbsp;495 € en douglas, 1&nbsp;720 à
          2&nbsp;225 € en ipé. La pose représente entre 43 % et 50 % du budget total pour les essences
          courantes.
        </p>
        <p className="content-body">
          La main-d&apos;œuvre artisan se facture en France en 2026 entre 60 et 90 €/h pour un charpentier
          qualifié, ou en forfait au m² posé : 40-50 €/m² en région avec accès facile, 50-60 €/m² en Île-de-France
          ou pour des terrains pentus. Ce forfait couvre le terrassement léger, la pose des plots, la
          fixation des lambourdes et le vissage des lames. Il ne couvre pas la fourniture des matériaux (à
          ajouter), ni l&apos;évacuation des déchets de chantier (souvent 50-80 € en sus).
        </p>

        <table className="content-table">
          <thead>
            <tr>
              <th>Essence</th>
              <th>Matériaux (12 m²)</th>
              <th>Pose artisan</th>
              <th>Total clé en main</th>
              <th>€/m² clé en main</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pin traité</td>
              <td>517-637 €</td>
              <td>480-720 €</td>
              <td>1 000-1 360 €</td>
              <td>83-113 €</td>
            </tr>
            <tr>
              <td>Douglas</td>
              <td>630-775 €</td>
              <td>480-720 €</td>
              <td>1 110-1 495 €</td>
              <td>93-125 €</td>
            </tr>
            <tr>
              <td>Composite</td>
              <td>885-1 084 €</td>
              <td>540-780 €</td>
              <td>1 425-1 865 €</td>
              <td>119-156 €</td>
            </tr>
            <tr>
              <td>Ipé certifié FSC</td>
              <td>1 232-1 505 €</td>
              <td>720-960 €</td>
              <td>1 950-2 465 €</td>
              <td>163-205 €</td>
            </tr>
          </tbody>
        </table>

        <p className="content-body">
          Pour le composite et surtout l&apos;ipé, la pose se facture plus cher au m² (+25 à +40 %) en
          raison de la durée d&apos;assemblage : pré-perçage systématique sur ipé, clips spécifiques sur
          composite, ajustements de coupe plus précis. Un artisan habitué à ces essences vous facturera
          50-65 €/m² au lieu des 40-50 €/m² du pin traité courant.
        </p>

        <h2 className="content-h2">Les coûts cachés qui font dérailler le budget en réel</h2>
        <p className="content-snippet">
          Quatre postes échappent souvent à l&apos;estimation initiale&nbsp;: terrassement préalable
          (50–200&nbsp;€ pour 12 m²), évacuation des gravats si dépose ancienne terrasse
          (60–120 €/m³), traitements hydrofuges ou saturateurs annuels (30-50 €/12 m² × 25 ans), et
          remplacement progressif des lames les plus exposées (10-15 % des lames après 8-10 ans).
        </p>
        <p className="content-body">
          L&apos;estimation au m² rentre rarement dans le détail des préparatifs. Sur 12 m², le
          terrassement léger (décaissement de 5 cm, géotextile, gravillon drainant) ajoute 50 à 200 €
          selon la nature du sol et la location éventuelle d&apos;une mini-pelle. Pour une dépose préalable
          d&apos;ancienne terrasse, comptez 60-120 €/m³ d&apos;évacuation en déchèterie professionnelle —
          la majorité des déchèteries municipales refusent les volumes au-dessus d&apos;1 m³ ou les bois
          traités.
        </p>
        <p className="content-body">
          L&apos;entretien représente le coût caché le plus sous-estimé. Une terrasse pin demande un
          saturateur tous les 2-3 ans (~30 €/15 m² pour 1 L de produit qualité), soit environ 250 € sur
          25 ans uniquement pour les produits. En main-d&apos;œuvre si déléguée à un artisan : 8 à 12 €/m²
          par passage, soit 96-144 € tous les 2-3 ans. L&apos;ipé et le composite échappent à cette
          contrainte — c&apos;est l&apos;argument économique réel des essences premium.
        </p>

        <h2 className="content-h2">Questions fréquentes</h2>

        <h3 className="content-h3">Quel est le prix au m² d&apos;une terrasse bois en 2026 ?</h3>
        <p className="content-body">
          Hors pose, comptez 43 à 53 €/m² en pin traité autoclave classe 4, 53 à 65 €/m² en douglas,
          103 à 125 €/m² en ipé. Avec la pose artisan, ajoutez 40 à 60 €/m². Ces fourchettes sont issues
          de notre base de prix mai 2026 (Brico Dépôt en bas, Leroy Merlin en haut) pour une terrasse
          rectangulaire de 12 m², lambourdes incluses.
        </p>

        <h3 className="content-h3">Quelle enseigne est la moins chère pour une terrasse pin ?</h3>
        <p className="content-body">
          Brico Dépôt sur les volumes standard : 517 € pour 12 m² de pin traité (lames + lambourdes +
          plots + visserie), contre 634 € en Leroy Merlin et 637 € en Castorama. L&apos;écart représente
          environ 23 % entre le moins cher et le plus cher pour des produits techniquement équivalents.
          ManoMano se positionne à 560 € avec une visserie nettement moins chère mais des délais de
          livraison plus longs.
        </p>

        <h3 className="content-h3">Pourquoi le bois composite n&apos;est pas systématiquement plus cher que l&apos;ipé ?</h3>
        <p className="content-body">
          Le composite (~75 à 90 €/m²) est plus cher que le pin et le douglas, mais reste sous l&apos;ipé
          (~103 à 125 €/m²). Sa durée de vie de 25 à 30 ans sans entretien le rend compétitif sur 20 ans,
          surtout face aux essences qui demandent un saturateur tous les 2 ans. Sa fabrication à partir
          de fibre bois recyclée et de polymère HDPE le rapproche d&apos;un produit semi-industriel, ce qui
          réduit sa volatilité de prix par rapport aux essences nobles importées.
        </p>

        <h3 className="content-h3">Que comprend exactement le prix au m² annoncé en GSB ?</h3>
        <p className="content-body">
          Quasiment jamais le total. Les étiquettes 25-40 €/m² en GSB visent la lame matière seule, sans
          la structure (lambourdes, plots), sans la visserie inox A2, sans la bande bitume sous lambourde.
          Le total réel se situe entre 43 et 65 €/m² selon l&apos;essence — soit environ 60 % de plus que
          l&apos;étiquette de la lame. L&apos;arbitrage économique réel se fait sur le total nomenclature,
          pas sur le prix lame seul.
        </p>

        <h3 className="content-h3">Quand fait-il sens de passer par un artisan plutôt que de poser soi-même ?</h3>
        <p className="content-body">
          Au-delà de 25 m² ou si la pente du terrain dépasse 5 %, la pose représente plus de 40 % du
          budget total et un artisan qualifié garantit la planéité (±5 mm sous règle de 2 m, DTU 51.4)
          que la plupart des bricoleurs ne tiennent pas sans niveau laser. Pour une petite terrasse
          rectangulaire sur sol plat, la pose soi-même reste rentable — économie de 480-720 € sur
          12 m². Voir notre comparateur{' '}
          <Link href="/guides/soi-meme-ou-pro" className="content-link">faire soi-même ou faire faire</Link>
          {' '}pour les cinq critères de décision détaillés.
        </p>

        <aside className="content-related">
          <h3>Voir aussi</h3>
          <ul>
            <li><Link href="/guides/dalle-clipsable-terrasse-balcon-sans-travaux">Dalle clipsable terrasse et balcon</Link> — bien moins cher qu&apos;une terrasse construite, sans chantier</li>
            <li><Link href="/guides/terrasse">Guide terrasse complet</Link> — DTU 51.4, calculs, étapes</li>
            <li><Link href="/guides/terrasse-composite-ou-bois">Terrasse composite ou bois</Link> — comparatif des deux matières : durée de vie, entretien, glissance et coût sur 15 ans</li>
            <li><Link href="/guides/soi-meme-ou-pro">Soi-même ou faire faire</Link> — cinq critères de décision</li>
            <li><Link href="/calculateur">Calculateur terrasse</Link> — devis matériaux + plan</li>
            <li><Link href="/sources">Sources DTU citées</Link> — DTU 51.4 et RBUE</li>
          </ul>
        </aside>

        <CTALead projectHref="/calculateur" projectLabel="ma terrasse" />

        <footer className="content-byline">
          <p>
            <strong>L&apos;équipe DIY Builder</strong> — Article publié le 24 mai 2026, chiffres recalculés
            depuis notre <Link href="/methodologie">base de prix</Link> scrapée en mai 2026.
            {' '}<Link href="/methodologie">Notre méthodologie</Link> ·
            {' '}<Link href="/sources">Sources DTU citées</Link> ·
            {' '}<Link href="/contact">Signaler une erreur</Link>
          </p>
        </footer>
      </div>
    </ContentLayout>
  );
}
