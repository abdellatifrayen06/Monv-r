/**
 * Generates cohesive MONVÉR leather-goods placeholder imagery as SVG files.
 * Warm leather-toned backgrounds + minimal line-art product silhouettes +
 * the MONVÉR wordmark. Presentation-ready, easily replaced with real photos.
 *
 *   node scripts/gen-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUB = join(__dirname, '..', 'public')
const PH = join(PUB, 'placeholders')
mkdirSync(PH, { recursive: true })

// Warm leather palettes — each tile pairs a soft ground with an ink line-art.
const GROUNDS = {
  cream:    ['#F3ECE0', '#E7DCC9'],
  taupe:    ['#E9E0D2', '#D6C7B0'],
  cognac:   ['#E2CBAF', '#C9A87E'],
  espresso: ['#2A2320', '#191411'],
  stone:    ['#EDE7DC', '#DCD2C2'],
  sand:     ['#EFE7D8', '#E0D2BC'],
}

const INK = '#3A2E24'
const INK_ON_DARK = '#E7D8C4'

// Minimal line-art icons, drawn in a 0..100 box, centered on the tile.
const ICONS = {
  wallet: `
    <rect x="18" y="30" width="64" height="44" rx="6"/>
    <path d="M18 42 H82"/>
    <rect x="60" y="48" width="18" height="12" rx="3"/>
    <circle cx="69" cy="54" r="2.2"/>`,
  cardholder: `
    <rect x="22" y="34" width="56" height="36" rx="5"/>
    <path d="M22 46 H78"/>
    <path d="M30 58 H54"/>`,
  belt: `
    <path d="M14 46 H70 a4 4 0 0 1 4 4 v4 a4 4 0 0 1 -4 4 H14"/>
    <rect x="70" y="42" width="18" height="20" rx="3"/>
    <path d="M79 42 V62"/>
    <circle cx="26" cy="52" r="1.8"/>
    <circle cx="36" cy="52" r="1.8"/>
    <circle cx="46" cy="52" r="1.8"/>`,
  bag: `
    <path d="M28 40 h44 l4 40 h-52 z"/>
    <path d="M38 40 v-6 a12 12 0 0 1 24 0 v6"/>`,
  handbag: `
    <path d="M24 46 h52 l-4 32 h-44 z"/>
    <path d="M36 46 a14 12 0 0 1 28 0"/>
    <path d="M24 58 H76"/>`,
  backpack: `
    <rect x="30" y="36" width="40" height="46" rx="12"/>
    <path d="M42 36 a8 8 0 0 1 16 0"/>
    <rect x="42" y="52" width="16" height="18" rx="4"/>
    <path d="M30 46 q-8 4 -6 16" /><path d="M70 46 q8 4 6 16"/>`,
  washbag: `
    <rect x="20" y="42" width="60" height="30" rx="10"/>
    <path d="M20 52 H80"/>
    <rect x="44" y="34" width="12" height="10" rx="3"/>`,
  travel: `
    <rect x="22" y="40" width="56" height="36" rx="8"/>
    <path d="M22 52 H78"/>
    <path d="M40 40 v-6 h20 v6"/>
    <path d="M50 58 v10"/>`,
  accessory: `
    <circle cx="50" cy="50" r="20"/>
    <circle cx="50" cy="50" r="8"/>
    <path d="M50 30 V22"/>`,
  keyring: `
    <circle cx="44" cy="46" r="14"/>
    <path d="M54 56 L74 76"/>
    <path d="M68 70 l6 -6"/>`,
  monogram: `
    <path d="M34 66 V38 l16 20 16 -20 v28"/>`,
}

const WORDMARK = (color, x, y, size = 5.2, sub = null) => `
  <text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="${size}" letter-spacing="${size * 0.42}" fill="${color}" font-weight="500">MONVÉR</text>
  ${sub ? `<text x="${x}" y="${y + size * 1.9}" text-anchor="middle" font-family="Georgia, serif"
        font-size="${size * 0.42}" letter-spacing="${size * 0.34}" fill="${color}" opacity="0.75">${sub}</text>` : ''}`

function tile({ w, h, ground = 'cream', icon = 'bag', label = '', dark = false, iconScale = 1 }) {
  const [c0, c1] = GROUNDS[ground]
  const ink = dark ? INK_ON_DARK : INK
  // Center the 0..100 icon box, scaled to the shorter side.
  const box = Math.min(w, h) * 0.52 * iconScale
  const ix = (w - box) / 2
  const iy = (h - box) / 2 - h * 0.03
  const id = Math.random().toString(36).slice(2, 8)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label || 'MONVÉR'}">
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${c0}"/>
      <stop offset="1" stop-color="${c1}"/>
    </linearGradient>
    <radialGradient id="v${id}" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${dark ? 0.28 : 0.07}"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g${id})"/>
  <rect width="${w}" height="${h}" fill="url(#v${id})"/>
  <g transform="translate(${ix} ${iy}) scale(${box / 100})"
     fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.82">
    ${ICONS[icon] || ICONS.bag}
  </g>
  ${WORDMARK(ink, w / 2, h * 0.9, Math.min(w, h) * 0.052, label || null)}
</svg>`
}

// ── Product placeholders (3:4) ────────────────────────────────────────────────
const PRODUCTS = [
  ['wallet', 'wallet', 'sand', 'PORTEFEUILLE'],
  ['cardholder', 'cardholder', 'stone', 'PORTE-CARTES'],
  ['belt', 'belt', 'taupe', 'CEINTURE'],
  ['bag', 'bag', 'cream', 'SAC'],
  ['handbag', 'handbag', 'sand', 'SAC À MAIN'],
  ['crossbody', 'handbag', 'stone', 'SAC BANDOULIÈRE'],
  ['messenger', 'bag', 'taupe', 'MESSAGER'],
  ['backpack', 'backpack', 'cream', 'SAC À DOS'],
  ['washbag', 'washbag', 'sand', 'TROUSSE'],
  ['travel', 'travel', 'taupe', 'VOYAGE'],
  ['weekender', 'travel', 'cream', 'WEEKEND'],
  ['accessory', 'accessory', 'stone', 'ACCESSOIRE'],
  ['keyring', 'keyring', 'sand', 'PORTE-CLÉS'],
  ['generic', 'monogram', 'cream', ''],
]
for (const [name, icon, ground, label] of PRODUCTS) {
  writeFileSync(join(PH, `${name}.svg`), tile({ w: 600, h: 800, ground, icon, label }))
}

// ── Category tiles (3:4, richer) ──────────────────────────────────────────────
const CATS = [
  ['cat-wallets', 'wallet', 'espresso', 'PORTEFEUILLES', true],
  ['cat-cardholders', 'cardholder', 'cognac', 'PORTE-CARTES', false],
  ['cat-belts', 'belt', 'espresso', 'CEINTURES', true],
  ['cat-bags', 'handbag', 'cognac', 'SACS', false],
  ['cat-washbags', 'washbag', 'espresso', 'TROUSSES', true],
  ['cat-travel', 'travel', 'cognac', 'VOYAGE', false],
  ['cat-accessories', 'accessory', 'espresso', 'ACCESSOIRES', true],
]
for (const [name, icon, ground, label, dark] of CATS) {
  writeFileSync(join(PH, `${name}.svg`), tile({ w: 800, h: 1000, ground, icon, label, dark }))
}

// ── Hero (wide editorial) ─────────────────────────────────────────────────────
function hero() {
  const id = 'hero'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100" role="img" aria-label="MONVÉR — maroquinerie en cuir">
  <defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#3A2F27"/>
      <stop offset="0.55" stop-color="#26201B"/>
      <stop offset="1" stop-color="#171310"/>
    </linearGradient>
    <radialGradient id="${id}v" cx="0.62" cy="0.4" r="0.8">
      <stop offset="0.45" stop-color="#6E5A44" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.45"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1100" fill="url(#${id}g)"/>
  <rect width="1600" height="1100" fill="url(#${id}v)"/>
  <g fill="none" stroke="#C9A87E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"
     transform="translate(980 300) scale(5.2)">
    ${ICONS.handbag}
  </g>
  <g fill="none" stroke="#8C6B47" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"
     transform="translate(1120 640) scale(3.2)">
    ${ICONS.wallet}
  </g>
  <text x="150" y="560" font-family="Georgia, serif" font-size="34" letter-spacing="14" fill="#C9A87E">MONVÉR</text>
  <text x="150" y="470" font-family="Georgia, serif" font-size="20" letter-spacing="8" fill="#B49B7C" opacity="0.8">MAROQUINERIE</text>
  <line x1="152" y1="600" x2="360" y2="600" stroke="#6E5A44" stroke-width="1.5"/>
</svg>`
}
writeFileSync(join(PUB, 'hero-monver.svg'), hero())

// ── Banners (collection / lifestyle) ─────────────────────────────────────────
writeFileSync(join(PUB, 'banner-collection.svg'), tile({ w: 1200, h: 800, ground: 'espresso', icon: 'handbag', label: 'LA COLLECTION', dark: true, iconScale: 1.1 }))
writeFileSync(join(PUB, 'banner-wallets.svg'), tile({ w: 800, h: 800, ground: 'cognac', icon: 'wallet', label: 'PORTEFEUILLES', iconScale: 1.1 }))
writeFileSync(join(PUB, 'banner-travel.svg'), tile({ w: 800, h: 800, ground: 'taupe', icon: 'travel', label: 'VOYAGE', iconScale: 1.1 }))
writeFileSync(join(PUB, 'banner-story.svg'), tile({ w: 1000, h: 1200, ground: 'espresso', icon: 'monogram', label: 'MONVÉR', dark: true, iconScale: 0.9 }))

// ── Social share (OG) ─────────────────────────────────────────────────────────
writeFileSync(join(PUB, 'og-monver.svg'), (() => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="og" x1="0" y1="0" x2="0.6" y2="1">
    <stop offset="0" stop-color="#2A2320"/><stop offset="1" stop-color="#151110"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#og)"/>
  <g fill="none" stroke="#C9A87E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"
     transform="translate(830 210) scale(3.6)">${ICONS.handbag}</g>
  <text x="120" y="300" font-family="Georgia, serif" font-size="76" letter-spacing="22" fill="#E7D8C4">MONVÉR</text>
  <text x="126" y="360" font-family="Georgia, serif" font-size="26" letter-spacing="9" fill="#B49B7C">MAROQUINERIE &amp; ACCESSOIRES EN CUIR</text>
  <line x1="128" y1="400" x2="430" y2="400" stroke="#6E5A44" stroke-width="2"/>
</svg>`
})())

console.log('MONVÉR placeholders generated in', PH)
