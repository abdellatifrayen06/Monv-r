import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Banknote, RefreshCw, ShieldCheck, Truck, Star } from 'lucide-react'
import { api, apiV1Fresh, peekCacheV1, peekFreshCacheV1 } from '../api/client'
import { SEO } from '../components/SEO'
import { HeroCarousel, type HeroSlide } from '../components/home/HeroCarousel'
import { FallbackHero } from '../components/home/FallbackHero'
import { AgeShopRail } from '../components/home/AgeShopRail'
import { CategoryPhotoGrid } from '../components/home/CategoryPhotoGrid'
import type { ShopCategory } from '../lib/categories'
import { ProductRow } from '../components/home/ProductRow'
import { ValuesStrip } from '../components/home/ValuesStrip'
import type { HomeProduct } from '../components/home/ProductCard'

const SLICE = 8

const DEFAULT_ASSETS = {
  hero_fallback: '/hero-main.png',
  banner_collection: '/banner-collection.svg',
  banner_wallets: '/banner-wallets.svg',
  banner_travel: '/banner-travel.svg',
  banner_story: '/banner-story.svg',
}

const LCP_HERO_KEY = 'monver_lcp_hero'

type HomeAssets = Record<string, string | null | undefined>

function resolveHeroImage(sliders: HeroSlide[], assets: HomeAssets): string {
  const slideImage = sliders.find((s) => s.image_url)?.image_url
  if (slideImage) return slideImage
  return assets.hero_fallback || DEFAULT_ASSETS.hero_fallback
}

export function Home() {
  const cachedHome = peekFreshCacheV1<{ assets: HomeAssets; sliders: HeroSlide[] }>('/homepage')
  const [sliders, setSliders] = useState<HeroSlide[]>(() => cachedHome?.sliders ?? [])
  const [assets, setAssets] = useState<HomeAssets>(() => cachedHome?.assets ?? {})
  const [homeHeroReady, setHomeHeroReady] = useState(() => Boolean(cachedHome))
  const [categories, setCategories] = useState<ShopCategory[]>(
    () => peekCacheV1<{ categories: ShopCategory[] }>('/categories')?.categories ?? []
  )
  const [newIn, setNewIn] = useState<HomeProduct[]>(
    () => peekCacheV1<{ products: HomeProduct[] }>('/products')?.products?.slice(0, SLICE) ?? []
  )
  const [promos, setPromos] = useState<HomeProduct[]>(
    () => peekCacheV1<{ products: HomeProduct[] }>('/products?on_promo=true')?.products?.slice(0, SLICE) ?? []
  )
  const [featured, setFeatured] = useState<HomeProduct[]>(
    () => peekCacheV1<{ products: HomeProduct[] }>('/products?featured=true')?.products?.slice(0, SLICE) ?? []
  )
  const [loading, setLoading] = useState(
    () => !peekCacheV1('/products?featured=true')
  )

  useEffect(() => {
    const heroImage = resolveHeroImage(sliders, assets)
    try {
      sessionStorage.setItem(LCP_HERO_KEY, heroImage)
    } catch {
      /* private browsing */
    }
    const link = document.querySelector<HTMLLinkElement>('link[data-lcp-hero]')
    if (link) link.href = heroImage
  }, [sliders, assets])

  useEffect(() => {
    Promise.all([
      apiV1Fresh<{ assets: HomeAssets; sliders: HeroSlide[] }>('/homepage'),
      apiV1Fresh<{ categories: ShopCategory[] }>('/categories'),
      api<{ products: HomeProduct[] }>('/products'),
      api<{ products: HomeProduct[] }>('/products?on_promo=true'),
      api<{ products: HomeProduct[] }>('/products?featured=true'),
    ])
      .then(([home, cd, all, promo, feat]) => {
        setAssets(home.assets ?? {})
        setSliders(home.sliders ?? [])
        setCategories(cd.categories)
        setNewIn(all.products.slice(0, SLICE))
        setPromos(promo.products.slice(0, SLICE))
        setFeatured(feat.products.slice(0, SLICE))
        setHomeHeroReady(true)
      })
      .catch(() => setHomeHeroReady(true))
      .finally(() => setLoading(false))
  }, [])

  const img = (key: keyof typeof DEFAULT_ASSETS) =>
    assets[key] || DEFAULT_ASSETS[key]

  const slidesWithImage = sliders.filter((s) => Boolean(s.image_url))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'MONVÉR',
      url: 'https://monver.com',
      description: 'Maroquinerie en cuir au design intemporel — portefeuilles, ceintures, sacs et accessoires pour femme et homme.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://monver.com/produits?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MONVÉR',
      url: 'https://monver.com',
      logo: 'https://monver.com/og-monver.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: 'French',
        areaServed: 'TN',
      },
    },
  ]

  return (
    <div className="bg-white">
      <SEO url="/" jsonLd={jsonLd} />
      {/* Fixed-height hero — show fallback immediately; swap to carousel only when confirmed */}
      <div className="hero-slot min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px]">
        {homeHeroReady && slidesWithImage.length > 0 ? (
          <HeroCarousel slides={slidesWithImage} />
        ) : (
          <FallbackHero heroImage={img('hero_fallback')} />
        )}
      </div>

      <div className="age-rail-slot min-h-[148px] sm:min-h-[156px]">
        {homeHeroReady ? <AgeShopRail /> : null}
      </div>

      <div className="border-y border-gray-100 bg-white">
        <div className="page-wrap py-3">
          <div className="flex items-center gap-6 xs:gap-10 overflow-x-auto scrollbar-hide">
            {[
              { icon: Truck, text: 'Livraison partout en Tunisie' },
              { icon: Banknote, text: 'Paiement à la livraison' },
              { icon: ShieldCheck, text: 'Cuir & finitions soignées' },
              { icon: RefreshCw, text: 'Échanges faciles' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-xs font-semibold text-gray-600 whitespace-nowrap flex-shrink-0 py-1"
              >
                <Icon size={14} className="text-brand-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryPhotoGrid categories={categories} assets={assets} />

      <section className="page-wrap py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Link
            to="/produits"
            className="group relative overflow-hidden rounded-lg md:col-span-2 h-64 sm:h-80 md:h-96 block"
          >
            <img
              src={img('banner_collection')}
              alt="La collection MONVÉR"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 md:p-8">
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.22em] mb-1.5">La collection</p>
              <h3 className="font-display font-normal text-2xl md:text-4xl text-white leading-snug mb-3">
                Cuir intemporel
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white border-b border-white pb-0.5 group-hover:gap-3 transition-all">
                Découvrir <ArrowRight size={14} />
              </span>
            </div>
          </Link>
          <div className="flex flex-col gap-3 md:gap-4">
            <Link
              to="/produits?category=6"
              className="group relative overflow-hidden rounded-lg h-48 md:h-auto md:flex-1 block"
            >
              <img
                src={img('banner_wallets')}
                alt="Portefeuilles en cuir"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-5">
                <p className="text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em] mb-0.5">Le quotidien</p>
                <h3 className="font-display font-normal text-lg md:text-2xl text-white leading-tight">Portefeuilles</h3>
              </div>
            </Link>
            <Link
              to="/produits?category=11"
              className="group relative overflow-hidden rounded-lg h-48 md:h-auto md:flex-1 block"
            >
              <img
                src={img('banner_travel')}
                alt="Maroquinerie de voyage"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-5">
                <p className="text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em] mb-0.5">En déplacement</p>
                <h3 className="font-display font-normal text-lg md:text-2xl text-white leading-tight">Voyage</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <ProductRow
        title="Nouveautés"
        subtitle="Les dernières arrivées en boutique"
        viewAllHref="/produits"
        products={newIn}
        loading={loading}
        bg="muted"
      />

      <ProductRow
        title="Promotions"
        subtitle="Les meilleures offres du moment"
        viewAllHref="/produits?on_promo=true"
        products={promos}
        loading={loading}
        bg="white"
      />

      <ProductRow
        title="Coups de cœur"
        subtitle="Nos favoris de la saison"
        viewAllHref="/produits?featured=true"
        products={featured}
        loading={loading}
        bg="muted"
      />

      <section className="page-wrap py-8 md:py-10">
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white flex flex-col md:flex-row items-center gap-6 md:gap-0 px-8 md:px-14 py-10 md:py-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Offre spéciale</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-2">Livraison offerte</h2>
            <p className="text-gray-300 text-sm">
              Pour toute commande supérieure à <strong className="text-white">200 TND</strong>
            </p>
          </div>
          <div className="hidden md:block w-px h-20 bg-white/10 mx-14" />
          <div className="text-center md:text-right">
            <Link
              to="/produits?on_promo=true"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-full hover:bg-gray-100 transition-colors text-sm"
            >
              Profiter de l&apos;offre <ArrowRight size={16} />
            </Link>
          </div>
          <div className="absolute -left-12 -top-12 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
        </div>
      </section>

      <BrandStory storyImage={img('banner_story')} />

      <ValuesStrip />

      <Testimonials />

      <section className="bg-ink text-white">
        <div className="page-wrap py-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="eyebrow text-brand-400 mb-2">Un conseil ?</p>
            <h2 className="font-display text-2xl md:text-3xl font-normal text-white mb-2">
              Choisir la pièce qui vous ressemble
            </h2>
            <p className="text-white/60 text-sm max-w-md">Notre équipe vous accompagne dans le choix de votre portefeuille, sac ou ceinture en cuir.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-ink font-semibold uppercase tracking-[0.12em] text-sm px-7 py-3.5 rounded-md hover:bg-brand-100 transition-colors whitespace-nowrap">
            Nous contacter <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

/** Editorial brand-story band. */
function BrandStory({ storyImage }: { storyImage: string }) {
  return (
    <section className="page-wrap py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        <div className="relative overflow-hidden rounded-lg aspect-[4/5] md:aspect-[5/6] bg-[#EFEAE1] order-1 md:order-none">
          <img src={storyImage} alt="L'univers MONVÉR" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="eyebrow mb-4">Notre approche</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-ink leading-[1.1] mb-5">
            Conçu pour devenir vôtre
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            MONVÉR crée des essentiels en cuir pensés pour accompagner la vie moderne. Des formes
            réfléchies, des détails maîtrisés et une esthétique intemporelle se réunissent dans des
            pièces faites pour devenir partie de votre quotidien.
          </p>
          <p className="text-gray-600 leading-relaxed mb-7">
            Portefeuilles, ceintures, sacs et accessoires — chaque pièce est dessinée pour durer,
            au-delà des saisons et des tendances passagères.
          </p>
          <Link to="/notre-histoire" className="btn-secondary btn-sm">
            Découvrir MONVÉR <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Presentation placeholder testimonials — design & everyday-use focused. */
function Testimonials() {
  const items = [
    { quote: 'La finition est nette et le cuir a un vrai grain. Exactement l’allure que je cherchais pour tous les jours.', name: 'Yasmine B.', tag: 'Portefeuille Essentiel' },
    { quote: 'Le sac messager est parfait pour le bureau : sobre, bien pensé, tout tient à sa place.', name: 'Karim T.', tag: 'Sac Messager Atelier' },
    { quote: 'Belle présentation à la réception et une ceinture qui se marie avec tout. Rien à redire.', name: 'Leïla M.', tag: 'Ceinture Signature' },
  ]
  return (
    <section className="bg-[#EFE9DF] border-y border-[#E1D8C8]">
      <div className="page-wrap py-14 md:py-20">
        <div className="text-center mb-10 md:mb-12">
          <p className="eyebrow mb-3">Ce qu’en disent nos clients</p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-ink">Portés au quotidien</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {items.map((t) => (
            <figure key={t.name} className="bg-warm rounded-lg border border-[#E1D8C8] p-7 flex flex-col">
              <div className="flex gap-0.5 mb-4 text-brand-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-700 leading-relaxed flex-1">&laquo;&nbsp;{t.quote}&nbsp;&raquo;</blockquote>
              <figcaption className="mt-5 pt-5 border-t border-[#E1D8C8]">
                <p className="font-semibold text-ink text-sm">{t.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.tag}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
