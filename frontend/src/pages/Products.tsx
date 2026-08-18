import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, SearchX, ArrowUpDown } from 'lucide-react'
import { api, peekCacheV1 } from '../api/client'
import { ProductCard } from '../components/home/ProductCard'
import type { HomeProduct } from '../components/home/ProductCard'

type Product = HomeProduct

import { findShopCategory, shopCategoryRootId, type ShopCategory } from '../lib/categories'
import { trackSearch, trackViewCategory } from '../lib/metaPixel'
import { trackSearchQuery } from '../lib/userTracking'
import { SEO } from '../components/SEO'

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '')

  const q = searchParams.get('q') || ''
  const categoryId = searchParams.get('category') || ''
  const age = searchParams.get('age') || ''
  const gender = searchParams.get('gender') || ''
  const sort = searchParams.get('sort') || ''
  const featuredOnly = searchParams.get('featured') === 'true'
  const onPromo = searchParams.get('on_promo') === 'true'

  const genderLabel = gender === 'femme' ? 'Femme' : gender === 'homme' ? 'Homme' : ''

  const productsPath = useMemo(() => {
    const params = new URLSearchParams()
    if (categoryId) params.set('category', categoryId)
    if (q) params.set('q', q)
    if (age) params.set('age', age)
    if (gender) params.set('gender', gender)
    if (sort) params.set('sort', sort)
    if (featuredOnly) params.set('featured', 'true')
    if (onPromo) params.set('on_promo', 'true')
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }, [categoryId, q, age, gender, sort, featuredOnly, onPromo])

  const cachedCategories = peekCacheV1<{ categories: ShopCategory[] }>('/categories')
  const cachedProducts = peekCacheV1<{ products: Product[] }>(productsPath)

  const [products, setProducts] = useState<Product[]>(() => cachedProducts?.products ?? [])
  const [categories, setCategories] = useState<ShopCategory[]>(() => cachedCategories?.categories ?? [])
  const [fetching, setFetching] = useState(() => !cachedProducts)

  useEffect(() => {
    api<{ categories: ShopCategory[] }>('/categories').then((d) => setCategories(d.categories))
  }, [])

  useEffect(() => {
    const cached = peekCacheV1<{ products: Product[] }>(productsPath)
    if (cached) {
      setProducts(cached.products)
      setFetching(false)
    } else {
      setFetching(true)
    }

    api<{ products: Product[] }>(productsPath)
      .then((d) => {
        setProducts(d.products)
        // Search event
        if (q) {
          trackSearch(q, d.products.length)
          trackSearchQuery(q, d.products.length)
        }
      })
      .finally(() => setFetching(false))
  }, [productsPath]) // eslint-disable-line react-hooks/exhaustive-deps

  const setCategory = (id: string) => {
    const p = new URLSearchParams(searchParams)
    if (id) p.set('category', id)
    else p.delete('category')
    setSearchParams(p)
  }

  const setSort = (value: string) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set('sort', value)
    else p.delete('sort')
    setSearchParams(p)
  }

  // Category chips respect the active gender ("both" categories show in either).
  const inGender = (c: ShopCategory) => {
    if (!gender) return true
    const g = (c.gender || 'both').toLowerCase()
    return g === 'both' || g === gender
  }
  const visibleCategories = categories.filter(inGender)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams(searchParams)
    if (inputVal.trim()) p.set('q', inputVal.trim())
    else p.delete('q')
    setSearchParams(p)
  }

  const clearSearch = () => {
    setInputVal('')
    const p = new URLSearchParams(searchParams)
    p.delete('q')
    setSearchParams(p)
  }

  const activeCategory = findShopCategory(categories, categoryId)
  const activeParentId = shopCategoryRootId(categories, categoryId)
  const activeParent = categories.find((c) => String(c.id) === activeParentId)
  const subcategories = activeParent?.children ?? []

  // ViewCategory when filter changes and category is known
  useEffect(() => {
    if (!categoryId || !activeCategory) return
    trackViewCategory({ id: activeCategory.id, name: activeCategory.name })
  }, [categoryId]) // eslint-disable-line react-hooks/exhaustive-deps

  const pageTitle = useMemo(() => {
    if (onPromo) return 'Promotions'
    if (featuredOnly) return 'Coups de cœur'
    if (age) return `Âge ${age.replace('-', ' – ')} ans`
    if (genderLabel && activeCategory) return `${genderLabel} · ${activeCategory.name}`
    if (activeCategory) return activeCategory.name
    if (genderLabel) return genderLabel
    return 'Boutique'
  }, [onPromo, featuredOnly, age, genderLabel, activeCategory])

  const seoDescription = onPromo
    ? 'Les offres MONVÉR : portefeuilles, ceintures, sacs et accessoires en cuir à prix réduits. Livraison en Tunisie.'
    : activeCategory
    ? `${activeCategory.name} en cuir MONVÉR. Livraison en Tunisie, paiement à la livraison.`
    : 'Toute la maroquinerie MONVÉR : portefeuilles, porte-cartes, ceintures, sacs, trousses et accessoires en cuir.'

  return (
    <div>
      <SEO
        title={pageTitle}
        description={seoDescription}
        url="/produits"
      />
      {/* Page header */}
      <div className="bg-[#EFE9DF] border-b border-[#E1D8C8]">
        <div className="page-wrap py-10 md:py-14">
          <p className="eyebrow mb-2">La collection</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal text-ink mb-1">
            {pageTitle}
          </h1>
          <p className="text-gray-500 font-medium">
            {fetching && products.length === 0 ? '…' : `${products.length} article${products.length !== 1 ? 's' : ''}`}
            {q && <span> pour « {q} »</span>}
          </p>
        </div>
      </div>

      <div className="page-wrap py-6">
        {/* Search + filters row */}
        <div className="flex gap-3 mb-5">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              placeholder="Rechercher un article..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="input pl-10 pr-10"
            />
            {inputVal && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </form>
          <button
            type="submit"
            form=""
            onClick={handleSearch as unknown as React.MouseEventHandler}
            className="btn-primary btn-sm flex-shrink-0"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Chercher</span>
          </button>
          <div className="relative flex-shrink-0">
            <ArrowUpDown size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              aria-label="Trier"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input pl-9 pr-8 py-2 text-sm w-auto cursor-pointer appearance-none"
            >
              <option value="">Nouveautés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name">Nom (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Category filters: parent then sub */}
        {visibleCategories.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-0.5">Catégories</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              <button
                type="button"
                className={`chip ${!categoryId ? 'chip-active' : ''}`}
                onClick={() => setCategory('')}
              >
                <SlidersHorizontal size={13} className="inline mr-1" />
                Tous
              </button>
              {visibleCategories.map((root) => (
                <button
                  key={root.id}
                  type="button"
                  className={`chip ${activeParentId === String(root.id) ? 'chip-active' : ''}`}
                  onClick={() => setCategory(String(root.id))}
                >
                  {root.name}
                </button>
              ))}
            </div>
            {subcategories.length > 0 && activeParentId && (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <p className="text-xs font-semibold text-gray-400 self-center flex-shrink-0 pr-1">
                  {activeParent?.name} —
                </p>
                <button
                  type="button"
                  className={`chip text-xs ${categoryId === activeParentId ? 'chip-active' : ''}`}
                  onClick={() => setCategory(activeParentId)}
                >
                  Tout
                </button>
                {subcategories.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    className={`chip text-xs ${categoryId === String(ch.id) ? 'chip-active' : ''}`}
                    onClick={() => setCategory(String(ch.id))}
                  >
                    {ch.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active filters */}
        {(q || activeCategory || genderLabel) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {genderLabel && (
              <span className="inline-flex items-center gap-1.5 bg-ink text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {genderLabel}
                <button
                  type="button"
                  onClick={() => {
                    const p = new URLSearchParams(searchParams)
                    p.delete('gender')
                    setSearchParams(p)
                  }}
                  className="hover:text-brand-200"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {q && (
              <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full">
                Recherche: «{q}»
                <button type="button" onClick={clearSearch} className="hover:text-brand-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full">
                {activeCategory.name}
                <button type="button" onClick={() => setCategory('')} className="hover:text-brand-900">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products grid */}
        {fetching && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-4 rounded w-3/4" />
                  <div className="skeleton h-4 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchX size={48} strokeWidth={1.5} className="text-gray-300 mx-auto mb-4" />
            <h2 className="font-display font-semibold text-ink text-xl mb-2">Aucun résultat trouvé</h2>
            <p className="text-gray-500 mb-6">
              Essayez d'autres mots-clés ou parcourez toutes nos catégories.
            </p>
            <button
              type="button"
              onClick={() => {
                clearSearch()
                setCategory('')
              }}
              className="btn-primary"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
