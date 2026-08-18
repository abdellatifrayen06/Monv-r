import { Clock, Compass, Layers, Sparkles } from 'lucide-react'

const VALUES = [
  {
    icon: Clock,
    title: 'Design intemporel',
    text: 'Des pièces pensées au-delà des saisons et des tendances passagères.',
  },
  {
    icon: Sparkles,
    title: 'Fonction du quotidien',
    text: 'Un bel objet doit aussi être utile — pensé pour l’usage réel.',
  },
  {
    icon: Layers,
    title: 'Détails maîtrisés',
    text: 'Coutures nettes, bords lissés, finitions soignées jusqu’au moindre détail.',
  },
  {
    icon: Compass,
    title: 'Fait pour le trajet',
    text: 'Conçu pour accompagner le quotidien et les voyages, près ou loin.',
  },
] as const

export function ValuesStrip() {
  return (
    <section className="page-wrap py-14 md:py-20 border-t border-[#E7DFD2]">
      <div className="text-center mb-10 md:mb-14">
        <p className="eyebrow mb-3">Pourquoi MONVÉR</p>
        <h2 className="font-display text-3xl md:text-4xl font-normal text-ink">Une exigence, quatre principes</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="text-center px-2">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Icon size={22} strokeWidth={1.6} />
            </div>
            <h3 className="font-medium text-ink text-base mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
