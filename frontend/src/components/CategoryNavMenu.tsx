import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import type { ShopCategory } from '../lib/categories'

type Gender = 'femme' | 'homme'
const GENDERS: { key: Gender; label: string }[] = [
  { key: 'femme', label: 'Femme' },
  { key: 'homme', label: 'Homme' },
]

/** Type-category filter within a gender, e.g. /produits?gender=femme&category=9 */
function genderCategoryHref(gender: Gender, id: number) {
  return `/produits?gender=${gender}&category=${id}`
}
/** Everything for a gender, e.g. /produits?gender=femme */
function genderAllHref(gender: Gender) {
  return `/produits?gender=${gender}`
}
/** Plain category link (footer). */
function categoryHref(id: number) {
  return `/produits?category=${id}`
}

/** True when a category should appear under the given gender ("both" shows in both). */
function inGender(cat: { gender?: string }, gender?: Gender): boolean {
  if (!gender) return true
  const g = (cat.gender || 'both').toLowerCase()
  return g === 'both' || g === gender
}

/**
 * Flatten the tree to leaf type-categories (products live on leaves),
 * optionally filtered to a gender section.
 */
function typeCategories(categories: ShopCategory[], gender?: Gender): ShopCategory[] {
  const out: ShopCategory[] = []
  for (const root of categories) {
    const kids = root.children ?? []
    if (kids.length > 0) {
      for (const ch of kids) {
        if (inGender(ch, gender)) out.push({ id: ch.id, name: ch.name, slug: ch.slug, gender: ch.gender })
      }
    } else if (inGender(root, gender)) {
      out.push(root)
    }
  }
  return out
}

type LinkItemProps = { to: string; label: string; sub?: boolean; onNavigate?: () => void }

function NavLink({ to, label, sub, onNavigate }: LinkItemProps) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
        sub
          ? 'text-gray-600 hover:bg-brand-50 hover:text-brand-700 pl-5'
          : 'font-semibold text-ink hover:bg-brand-50 hover:text-brand-700'
      }`}
    >
      {label}
    </Link>
  )
}

/** One gender entry in the desktop nav bar with a dropdown of type-categories. */
function GenderNavItem({
  gender,
  label,
  categories,
  onNavigate,
}: {
  gender: Gender
  label: string
  categories: ShopCategory[]
  onNavigate?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const types = typeCategories(categories, gender)

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  const updatePosition = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 6, left: rect.left })
  }, [])

  const openMenu = () => {
    cancelClose()
    updatePosition()
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const close = () => {
    setOpen(false)
    onNavigate?.()
  }

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed min-w-[13rem] rounded-lg border border-gray-100 bg-white shadow-xl py-2 animate-fade-in"
          style={{ top: menuPos.top, left: menuPos.left, zIndex: 200 }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <NavLink to={genderAllHref(gender)} label={`Tout ${label}`} onNavigate={close} />
          <div className="my-1 border-t border-gray-100" />
          {types.map((cat) => (
            <NavLink
              key={cat.id}
              to={genderCategoryHref(gender, cat.id)}
              label={cat.name}
              sub
              onNavigate={close}
            />
          ))}
        </div>,
        document.body
      )
    : null

  return (
    <>
      <div
        ref={wrapRef}
        className="relative flex-shrink-0"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <button
          ref={btnRef}
          type="button"
          onClick={() => (open ? setOpen(false) : openMenu())}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${
            open ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:text-brand-600 hover:bg-brand-50'
          }`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {label}
          <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {menu}
    </>
  )
}

/** Desktop: gender-first horizontal nav (Femme / Homme → type-categories). */
export function CategoryNavBar({
  categories,
  onNavigate,
}: {
  categories: ShopCategory[]
  onNavigate?: () => void
}) {
  return (
    <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-hide py-1">
      <Link
        to="/produits"
        onClick={onNavigate}
        className="px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-all whitespace-nowrap flex-shrink-0"
      >
        Tout
      </Link>
      {GENDERS.map((g) => (
        <GenderNavItem
          key={g.key}
          gender={g.key}
          label={g.label}
          categories={categories}
          onNavigate={onNavigate}
        />
      ))}
      <Link
        to="/notre-histoire"
        onClick={onNavigate}
        className="px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-all whitespace-nowrap flex-shrink-0"
      >
        Notre histoire
      </Link>
    </div>
  )
}

/** Mobile: gender-first accordion (Femme / Homme → type-categories). */
export function CategoryNavMobile({
  categories,
  onNavigate,
}: {
  categories: ShopCategory[]
  onNavigate?: () => void
}) {
  const [expanded, setExpanded] = useState<Gender | null>('femme')

  return (
    <nav className="flex flex-col gap-0.5">
      <Link
        to="/produits"
        onClick={onNavigate}
        className="flex items-center justify-between px-4 py-3.5 rounded-lg font-bold uppercase tracking-wide text-brand-700 bg-brand-50"
      >
        Toute la boutique
        <ChevronRight size={16} className="text-brand-400" />
      </Link>

      {GENDERS.map((g) => {
        const isOpen = expanded === g.key
        const types = typeCategories(categories, g.key)
        return (
          <div key={g.key}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : g.key)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg font-semibold uppercase tracking-wide text-ink hover:bg-brand-50 hover:text-brand-700 text-left"
              aria-expanded={isOpen}
            >
              {g.label}
              <ChevronDown
                size={20}
                className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="ml-4 mr-2 mb-2 border-l-2 border-brand-100 pl-3 space-y-0.5">
                <Link
                  to={genderAllHref(g.key)}
                  onClick={onNavigate}
                  className="block px-3 py-2.5 rounded-md text-sm font-semibold text-brand-600 hover:bg-brand-50"
                >
                  Tout {g.label}
                </Link>
                {types.map((cat) => (
                  <Link
                    key={cat.id}
                    to={genderCategoryHref(g.key, cat.id)}
                    onClick={onNavigate}
                    className="block px-3 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <Link
        to="/notre-histoire"
        onClick={onNavigate}
        className="flex items-center justify-between px-4 py-3.5 mt-2 rounded-lg font-semibold uppercase tracking-wide text-ink hover:bg-brand-50 hover:text-brand-700 border-t border-gray-100 pt-4"
      >
        Notre histoire
        <ChevronRight size={16} className="text-gray-400" />
      </Link>
      <Link
        to="/contact"
        onClick={onNavigate}
        className="flex items-center justify-between px-4 py-3.5 rounded-lg font-semibold uppercase tracking-wide text-gray-600 hover:bg-gray-50"
      >
        Contact
        <ChevronRight size={16} className="text-gray-400" />
      </Link>
    </nav>
  )
}

/** Footer column from API categories (by type). */
export function CategoryFooterLinks({ categories }: { categories: ShopCategory[] }) {
  const types = typeCategories(categories)
  return (
    <ul className="space-y-2.5 text-sm">
      <li>
        <Link to="/produits?gender=femme" className="hover:text-brand-400 transition-colors font-semibold text-white/90">
          Femme
        </Link>
      </li>
      <li>
        <Link to="/produits?gender=homme" className="hover:text-brand-400 transition-colors font-semibold text-white/90">
          Homme
        </Link>
      </li>
      {types.map((cat) => (
        <li key={cat.id}>
          <Link to={categoryHref(cat.id)} className="hover:text-brand-400 transition-colors">
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Mobile bottom sheet: categories (Boutique tab) */
export function CategoryShopSheet({
  open,
  onClose,
  categories,
}: {
  open: boolean
  onClose: () => void
  categories: ShopCategory[]
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Fermer" />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl animate-fade-in pb-[calc(env(safe-area-inset-bottom,0px)+4.5rem)]">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-display font-normal text-lg text-ink">Boutique</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <div className="p-3">
          <CategoryNavMobile categories={categories} onNavigate={onClose} />
        </div>
      </div>
    </div>
  )
}
