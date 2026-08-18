import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  ShoppingBag,
  User,
  Home,
  Grid3X3,
  Menu,
  X,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ChevronRight,
  Truck,
  ShieldCheck,
  Headphones,
  Banknote,
  Heart,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useUI } from '../context/UIContext'
import { useShopCategories } from '../hooks/useShopCategories'
import { CategoryFooterLinks, CategoryNavBar, CategoryNavMobile, CategoryShopSheet } from './CategoryNavMenu'
import { UserAccountMenu } from './UserAccountMenu'
import { CartDrawer } from './CartDrawer'

export function Layout() {
  const { user } = useAuth()
  const { count } = useCart()
  const { count: favCount } = useFavorites()
  const { openCart } = useUI()
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopSheetOpen, setShopSheetOpen] = useState(false)
  const location = useLocation()
  const categories = useShopCategories()

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="flex flex-col min-h-dvh">
      {/* ── Announcement bar ── */}
      <div className="bg-ink text-[#E7D8C4] text-center text-[11px] sm:text-xs py-2.5 px-4 font-medium uppercase tracking-[0.18em] flex items-center justify-center gap-3 flex-wrap" role="status">
        <span>Cuir intemporel, pensé pour chaque trajet</span>
        <span className="hidden sm:inline text-white/25">·</span>
        <span className="hidden sm:inline-flex items-center gap-1.5"><Truck size={13} /> Livraison offerte dès 200 TND</span>
        <span className="hidden md:inline text-white/25">·</span>
        <span className="hidden md:inline-flex items-center gap-1.5"><ShieldCheck size={13} /> Garantie 3 ans</span>
      </div>

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-50 bg-warm/95 backdrop-blur-sm border-b border-[#E7DFD2] overflow-visible" role="banner">
        <div className="page-wrap flex items-center gap-2 sm:gap-3 h-16 md:h-20 overflow-visible">
          {/* Wordmark */}
          <Link to="/" className="flex items-center flex-shrink-0 mr-2 md:mr-4 min-w-0" aria-label="MONVÉR — Accueil">
            <span style={{ fontFamily: "'Cinzel', 'Fraunces', Georgia, serif" }} className="text-xl md:text-2xl font-semibold tracking-[0.3em] text-ink leading-none">MONVÉR</span>
          </Link>

          {/* Desktop: category nav */}
          <nav className="hidden md:flex flex-1 min-w-0 items-center overflow-visible" aria-label="Catégories">
            <CategoryNavBar categories={categories} />
          </nav>

          {/* Right: account, cart, mobile menu */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="flex-shrink-0 max-w-[9rem] sm:max-w-[11rem]">
              <UserAccountMenu align="right" />
            </div>

            <Link
              to="/favoris"
              className="relative min-w-11 min-h-11 flex items-center justify-center rounded-full hover:bg-brand-50 transition-colors text-ink/70 hover:text-brand-600"
              aria-label={favCount > 0 ? `Mes favoris, ${favCount} article${favCount > 1 ? 's' : ''}` : 'Mes favoris'}
            >
              <Heart size={19} />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favCount > 9 ? '9+' : favCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-1.5 btn-primary btn-sm min-h-11"
              aria-label={count > 0 ? `Panier, ${count} article${count > 1 ? 's' : ''}` : 'Ouvrir le panier'}
            >
              <ShoppingBag size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Panier</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm" aria-hidden="true">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              className="md:hidden min-w-11 min-h-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-category-menu"
              aria-label={menuOpen ? 'Fermer le menu catégories' : 'Ouvrir le menu catégories'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile: categories menu */}
        {menuOpen && (
          <div id="mobile-category-menu" className="md:hidden border-t border-gray-100 bg-white animate-fade-in max-h-[70vh] overflow-y-auto">
            <div className="page-wrap py-4">
              <CategoryNavMobile categories={categories} onNavigate={closeMenu} />
            </div>
          </div>
        )}
      </header>

      {/* ── Main content ── */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-ink text-[#C9BCA9] mt-16 pb-16 md:pb-0" role="contentinfo">
        <div className="border-b border-white/10">
          <div className="page-wrap py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck size={22} />, title: 'Livraison en Tunisie', desc: 'Expédition rapide, suivi en ligne' },
              { icon: <Banknote size={22} />, title: 'Paiement à la livraison', desc: 'En espèces, sans frais' },
              { icon: <ShieldCheck size={22} />, title: 'Cuir & finitions soignées', desc: 'Pensé pour durer' },
              { icon: <Headphones size={22} />, title: 'Conseil attentionné', desc: 'Une équipe à votre écoute' },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="text-brand-400 flex-shrink-0">{b.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{b.title}</p>
                  <p className="text-[#A7987F] text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="page-wrap py-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <span style={{ fontFamily: "'Cinzel', 'Fraunces', Georgia, serif" }} className="text-xl font-semibold tracking-[0.3em] text-white">MONVÉR</span>
            <p className="text-sm text-[#A7987F] leading-relaxed mt-4 max-w-xs">
              Maroquinerie en cuir au design intemporel — portefeuilles, ceintures, sacs et
              accessoires pensés pour accompagner le quotidien et les voyages.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.facebook.com/profile.php?id=61590348549914"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MONVÉR sur Facebook"
                className="p-2 rounded-full bg-white/5 hover:bg-brand-500 text-[#A7987F] hover:text-white transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/kideliowear/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MONVÉR sur Instagram"
                className="p-2 rounded-full bg-white/5 hover:bg-brand-500 text-[#A7987F] hover:text-white transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-[0.18em]">Boutique</h3>
            <CategoryFooterLinks categories={categories} />
            <ul className="space-y-2.5 text-sm mt-2.5">
              <li><Link to="/produits" className="hover:text-brand-400 transition-colors">Nouveautés</Link></li>
              <li><Link to="/favoris" className="hover:text-brand-400 transition-colors">Mes favoris</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-[0.18em]">La maison</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/notre-histoire" className="hover:text-brand-400 transition-colors">Notre histoire</Link></li>
              <li><Link to="/notre-histoire#entretien" className="hover:text-brand-400 transition-colors">Entretien du cuir</Link></li>
              <li><Link to="/suivi" className="hover:text-brand-400 transition-colors">Suivre ma commande</Link></li>
              <li><Link to="/contact#faq" className="hover:text-brand-400 transition-colors">Questions fréquentes</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Livraison &amp; retours</Link></li>
              <li><Link to="/conditions-generales" className="hover:text-brand-400 transition-colors">Conditions générales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-[0.18em]">Contact</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} className="text-brand-400" /><span>+216 24 681 500</span></li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-brand-400" /><span>monvercuir@gmail.com</span></li>
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              Nous contacter <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="page-wrap py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#8C7E68]">
            <p className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} MONVÉR — Tous droits réservés</span>
              <span className="text-white/20">·</span>
              <Link to="/conditions-generales" className="hover:text-brand-400 transition-colors">Conditions générales</Link>
            </p>
            <p className="uppercase tracking-[0.15em]">Cuir intemporel · Fait pour durer</p>
          </div>
        </div>
      </footer>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 grid grid-cols-5 shadow-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Navigation mobile"
      >
        {[
          { to: '/', label: 'Accueil', icon: <Home size={20} aria-hidden="true" />, action: 'link' as const },
          { to: '/produits', label: 'Boutique', icon: <Grid3X3 size={20} aria-hidden="true" />, action: 'shop' as const },
          { to: '/favoris', label: 'Favoris', icon: <Heart size={20} aria-hidden="true" />, action: 'link' as const },
          {
            to: user ? '/compte' : '/connexion',
            label: 'Compte',
            icon: <User size={20} aria-hidden="true" />,
            action: 'link' as const,
          },
        ].map((item) => {
          const isActive =
            item.action === 'shop'
              ? location.pathname.startsWith('/produits')
              : item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to)

          if (item.action === 'shop') {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setShopSheetOpen(true)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-h-14 py-2 gap-0.5 text-[11px] font-semibold transition-colors w-full ${
                  isActive ? 'text-brand-600' : 'text-gray-500 hover:text-brand-500'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.to === '/favoris' && favCount > 0 ? `Favoris, ${favCount} article${favCount > 1 ? 's' : ''}` : item.label}
              className={`flex flex-col items-center justify-center min-h-14 py-2 gap-0.5 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-brand-600' : 'text-gray-500 hover:text-brand-500'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.to === '/favoris' && favCount > 0 && (
                <span className="sr-only">{favCount} favori{favCount > 1 ? 's' : ''}</span>
              )}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={openCart}
          aria-label={count > 0 ? `Panier, ${count} article${count > 1 ? 's' : ''}` : 'Panier'}
          className="flex flex-col items-center justify-center min-h-14 py-2 gap-0.5 text-[11px] font-semibold text-gray-500 hover:text-brand-500 transition-colors relative"
        >
          {count > 0 && (
            <span className="absolute top-2 right-1/2 translate-x-4 bg-brand-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center" aria-hidden="true">
              {count > 9 ? '9+' : count}
            </span>
          )}
          <ShoppingBag size={20} aria-hidden="true" />
          <span>Panier</span>
        </button>
      </nav>

      <CategoryShopSheet open={shopSheetOpen} onClose={() => setShopSheetOpen(false)} categories={categories} />
      <CartDrawer />
    </div>
  )
}
