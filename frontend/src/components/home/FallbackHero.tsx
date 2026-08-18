import { Link } from 'react-router-dom'
import { ArrowRight, Truck } from 'lucide-react'

/** Static editorial hero when no admin sliders are configured */
export function FallbackHero({ heroImage = '/hero-monver.svg' }: { heroImage?: string }) {
  return (
    <section className="relative w-full overflow-hidden bg-[#EFE9DF]">
      <div className="flex flex-col md:flex-row min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px]">
        <div className="flex-1 flex flex-col justify-center px-6 xs:px-8 sm:px-12 lg:px-20 py-14 md:py-0 order-2 md:order-1">
          <span className="eyebrow mb-6">Maroquinerie · Femme &amp; Homme</span>
          <h1 className="font-display text-4xl xs:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-ink leading-[1.05] tracking-tight mb-6">
            Le cuir
            <br />
            intemporel,
            <br />
            <em className="not-italic text-brand-600">au quotidien</em>
          </h1>
          <p className="text-gray-600 text-sm xs:text-base lg:text-lg leading-relaxed mb-8 max-w-md">
            Des essentiels en cuir raffinés — portefeuilles, ceintures, sacs et accessoires —
            pensés pour les trajets modernes et les gestes de tous les jours.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 mb-9">
            <Link
              to="/produits"
              className="inline-flex items-center justify-center gap-2 bg-ink hover:bg-brand-800 text-white font-semibold uppercase tracking-[0.12em] text-sm rounded-md px-8 py-4 transition-colors"
            >
              Découvrir la collection <ArrowRight size={16} />
            </Link>
            <Link
              to="/notre-histoire"
              className="inline-flex items-center justify-center gap-2 border border-ink text-ink hover:bg-ink hover:text-white font-semibold uppercase tracking-[0.12em] text-sm rounded-md px-8 py-4 transition-colors"
            >
              Découvrir MONVÉR
            </Link>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5"><Truck size={15} className="text-brand-600" /> Livraison partout en Tunisie</span>
            <span className="hidden xs:inline-flex items-center gap-1.5">Paiement à la livraison</span>
          </div>
        </div>
        <div className="relative w-full md:w-[52%] lg:w-[55%] order-1 md:order-2 h-72 xs:h-80 sm:h-96 md:h-auto overflow-hidden">
          <img
            src={heroImage}
            alt="MONVÉR — maroquinerie en cuir"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width={1600}
            height={1100}
          />
          <div className="hidden md:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#EFE9DF] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
