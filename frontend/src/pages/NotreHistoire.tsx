import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Compass, Layers, Sparkles } from 'lucide-react'
import { SEO } from '../components/SEO'

const VALUES = [
  { icon: Clock, title: 'Design intemporel', text: 'Des formes pensées au-delà des saisons et des tendances passagères.' },
  { icon: Sparkles, title: 'Fonction du quotidien', text: 'Un bel objet doit aussi être utile — chaque pièce est pensée pour l’usage réel.' },
  { icon: Layers, title: 'Détails maîtrisés', text: 'Coutures nettes, bords lissés, finitions soignées jusqu’au moindre détail.' },
  { icon: Compass, title: 'Fait pour le trajet', text: 'Conçu pour accompagner le quotidien et les voyages, près ou loin.' },
]

const CARE = [
  { title: 'Au quotidien', text: 'Essuyez régulièrement votre pièce avec un chiffon doux et sec pour retirer la poussière et préserver le grain du cuir.' },
  { title: 'À l’abri de l’humidité', text: 'Évitez l’exposition prolongée à l’eau et à la chaleur. En cas de contact avec l’eau, laissez sécher à l’air libre, loin d’une source de chaleur directe.' },
  { title: 'Rangement', text: 'Conservez vos pièces à l’abri de la lumière directe. Une pochette en tissu aide à préserver la surface entre deux utilisations.' },
  { title: 'La patine', text: 'Le cuir évolue à l’usage : il se patine et gagne en caractère au fil du temps. C’est le propre d’une belle matière.' },
]

export function NotreHistoire() {
  return (
    <div>
      <SEO
        title="Notre histoire"
        description="La philosophie MONVÉR : une maroquinerie en cuir au design intemporel, pensée pour le quotidien et les voyages. Qualité, fonctionnalité et détails maîtrisés."
        url="/notre-histoire"
      />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="page-wrap py-16 md:py-24 max-w-3xl">
          <p className="eyebrow text-brand-400 mb-4">Notre histoire</p>
          <h1 className="font-display text-4xl md:text-6xl font-normal leading-[1.05] mb-6">
            Conçu pour devenir vôtre
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            MONVÉR crée des essentiels en cuir pensés pour accompagner la vie moderne — des pièces
            faites pour durer, au-delà des saisons et des tendances.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="page-wrap py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-[#EFEAE1]">
            <img src="/banner-story.svg" alt="L'univers MONVÉR" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow mb-4">La maison</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-ink leading-tight mb-5">
              Le cuir, pensé pour la vie de tous les jours
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                MONVÉR est une maison de maroquinerie unisexe, pour femme et homme. Portefeuilles,
                porte-cartes, ceintures, sacs, trousses et accessoires : chaque pièce est dessinée
                autour d’une même exigence — la justesse.
              </p>
              <p>
                Nous privilégions les formes réfléchies, les détails maîtrisés et une esthétique
                intemporelle. L’objectif n’est pas de suivre la mode, mais de créer des objets
                que l’on garde et que l’on utilise, jour après jour.
              </p>
              <p>
                Un cuir premium, des finitions soignées et une attention portée à l’usage réel :
                voilà ce qui réunit toutes les pièces MONVÉR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#EFE9DF] border-y border-[#E1D8C8]">
        <div className="page-wrap py-14 md:py-20">
          <div className="text-center mb-10 md:mb-14">
            <p className="eyebrow mb-3">Nos principes</p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-ink">Ce qui guide chaque pièce</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center px-2">
                <div className="w-12 h-12 rounded-full bg-white text-brand-600 border border-[#E1D8C8] flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className="font-medium text-ink text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care / entretien */}
      <section id="entretien" className="page-wrap py-14 md:py-20 scroll-mt-24">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">Le journal · Entretien</p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-ink leading-tight mb-4">
            Prendre soin de votre cuir
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Quelques gestes simples suffisent à préserver l’allure de vos pièces et à accompagner
            leur belle patine dans le temps.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {CARE.map((c, i) => (
            <div key={c.title} className="bg-white rounded-lg border border-[#E7DFD2] p-7">
              <span className="font-display text-2xl text-brand-500">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-medium text-ink text-lg mt-2 mb-2">{c.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-white">
        <div className="page-wrap py-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-normal mb-2">Découvrir la collection</h2>
            <p className="text-white/60 text-sm max-w-md">Portefeuilles, ceintures, sacs et accessoires en cuir, pensés pour durer.</p>
          </div>
          <Link to="/produits" className="inline-flex items-center gap-2 bg-white text-ink font-semibold uppercase tracking-[0.12em] text-sm px-8 py-4 rounded-md hover:bg-brand-100 transition-colors whitespace-nowrap">
            Voir la boutique <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
