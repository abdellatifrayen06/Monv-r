import { Link } from 'react-router-dom'
import { Wallet, CreditCard, ShoppingBag, Plane, Sparkles } from 'lucide-react'

/** Belt icon (lucide has none) — buckle + strap, matching lucide's stroke style. */
function BeltIcon({ size = 24, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
      <path d="M8 12H3" />
      <path d="M16 12h5" />
      <path d="M12 8v8" />
    </svg>
  )
}

const SHOP_LINKS = [
  { label: 'Portefeuilles', sub: 'Le quotidien', to: '/produits?category=6', icon: Wallet },
  { label: 'Porte-cartes', sub: 'L’essentiel', to: '/produits?category=7', icon: CreditCard },
  { label: 'Ceintures', sub: 'Intemporel', to: '/produits?category=8', icon: BeltIcon },
  { label: 'Sacs', sub: 'Femme & homme', to: '/produits?category=9', icon: ShoppingBag },
  { label: 'Voyage', sub: 'En déplacement', to: '/produits?category=11', icon: Plane },
  { label: 'Accessoires', sub: 'Les détails', to: '/produits?category=12', icon: Sparkles },
] as const

export function AgeShopRail() {
  return (
    <section className="bg-warm border-b border-[#E7DFD2] min-h-[inherit]">
      <div className="page-wrap py-6 md:py-8">
        <p className="eyebrow mb-4 text-center md:text-left">Explorer par catégorie</p>
        <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {SHOP_LINKS.map(({ label, sub, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex-shrink-0 flex flex-col items-center justify-center min-w-[104px] sm:min-w-[124px] md:flex-1 rounded-lg border border-[#E1D8C8] bg-white hover:border-ink hover:bg-white px-4 py-4 md:py-5 transition-all group"
            >
              <span className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-2 group-hover:bg-ink group-hover:text-white transition-colors">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <span className="font-medium text-sm text-ink text-center leading-tight">{label}</span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">{sub}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
