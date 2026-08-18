import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'

const UPDATED = '16 août 2026'

const SECTIONS = [
  {
    title: '1. Objet',
    body: [
      "Les présentes conditions générales de vente (les « CGV ») régissent les ventes de produits proposés par MONVÉR sur le présent site. Toute commande implique l’acceptation pleine et entière des présentes CGV.",
    ],
  },
  {
    title: '2. Produits',
    body: [
      "Les produits proposés sont des articles de maroquinerie et accessoires en cuir. Ils sont présentés avec le plus grand soin. Les photographies et couleurs peuvent toutefois présenter de légères variations avec le produit réel, sans engager la responsabilité de MONVÉR.",
      "Les produits sont proposés dans la limite des stocks disponibles.",
    ],
  },
  {
    title: '3. Prix',
    body: [
      "Les prix sont indiqués en dinars tunisiens (TND), toutes taxes comprises. MONVÉR se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.",
      "La livraison est offerte pour toute commande supérieure à 200 TND. En deçà, des frais de livraison peuvent s’appliquer et sont indiqués avant la validation de la commande.",
    ],
  },
  {
    title: '4. Commande',
    body: [
      "La commande est validée une fois les informations de livraison renseignées et la commande confirmée par le client. MONVÉR peut être amené à contacter le client pour confirmer les détails de sa commande.",
      "MONVÉR se réserve le droit d’annuler toute commande présentant un motif légitime (indisponibilité, informations manifestement erronées, litige antérieur).",
    ],
  },
  {
    title: '5. Paiement',
    body: [
      "Le paiement s’effectue à la livraison (paiement en espèces à la réception de la commande), sauf autre moyen de paiement expressément proposé sur le site.",
    ],
  },
  {
    title: '6. Livraison',
    body: [
      "La livraison est assurée partout en Tunisie. Les délais indicatifs sont de 2 à 5 jours ouvrables selon le gouvernorat. Un suivi de commande est disponible en ligne.",
      "Les délais de livraison sont donnés à titre indicatif ; un retard ne peut donner lieu à annulation, indemnité ou dédommagement.",
    ],
  },
  {
    title: '7. Retours et échanges',
    body: [
      "Le client dispose d’un délai de 7 jours à compter de la réception pour demander un échange ou un retour. L’article doit être retourné dans son état d’origine, non utilisé, non endommagé et avec son emballage.",
      "Les frais de retour sont à la charge du client, sauf en cas d’erreur de MONVÉR ou de produit défectueux.",
    ],
  },
  {
    title: '8. Garantie',
    body: [
      "Chaque produit bénéficie d’une garantie de 3 ans limitée aux défauts de qualité (coutures, finitions et fermetures).",
      "La garantie ne couvre pas l’usure normale du cuir, les dommages accidentels, ni les dommages résultant d’un mauvais entretien ou d’une utilisation non conforme.",
    ],
  },
  {
    title: '9. Propriété intellectuelle',
    body: [
      "L’ensemble des éléments du site (marque MONVÉR, textes, visuels, mise en page) est protégé. Toute reproduction ou utilisation sans autorisation préalable est interdite.",
    ],
  },
  {
    title: '10. Données personnelles',
    body: [
      "Les informations recueillies lors d’une commande sont utilisées uniquement pour le traitement et le suivi de celle-ci. Elles ne sont pas cédées à des tiers à des fins commerciales. Le client peut demander la consultation ou la suppression de ses données en contactant MONVÉR.",
    ],
  },
  {
    title: '11. Droit applicable',
    body: [
      "Les présentes CGV sont soumises au droit tunisien. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.",
    ],
  },
]

export function ConditionsGenerales() {
  return (
    <div>
      <SEO
        title="Conditions générales de vente"
        description="Conditions générales de vente de MONVÉR — commandes, prix, paiement à la livraison, livraison en Tunisie, retours, échanges et garantie."
        url="/conditions-generales"
      />

      {/* Hero */}
      <div className="bg-[#EFE9DF] border-b border-[#E1D8C8]">
        <div className="page-wrap py-12 md:py-16">
          <p className="eyebrow mb-3">Informations légales</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal text-ink mb-3">
            Conditions générales de vente
          </h1>
          <p className="text-gray-600 text-sm">Dernière mise à jour : {UPDATED}</p>
        </div>
      </div>

      <div className="page-wrap py-12 md:py-16 max-w-3xl">
        {/* Legal entity placeholder — MONVÉR to complete */}
        <div className="rounded-lg border border-[#E7DFD2] bg-white p-5 mb-10 text-sm text-gray-600 leading-relaxed">
          <p>
            Le présent site est édité par <strong className="text-ink">MONVÉR</strong>.
            {' '}
            <span className="text-gray-400">
              [Raison sociale, adresse, matricule fiscal, e-mail et téléphone de contact à compléter.]
            </span>
          </p>
        </div>

        <div className="space-y-9">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl md:text-2xl font-normal text-ink mb-3">{s.title}</h2>
              <div className="space-y-3">
                {s.body.map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#E7DFD2] text-sm text-gray-600">
          Une question sur nos conditions ?{' '}
          <Link to="/contact" className="text-brand-600 font-semibold hover:text-brand-800 transition-colors">
            Contactez-nous
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
