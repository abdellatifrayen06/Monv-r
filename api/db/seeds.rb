puts "Seeding MONVÉR..."

# ── Staff accounts ────────────────────────────────────────────────────────────
admin_email    = ENV.fetch("ADMIN_EMAIL",    "admin@monver.com")
admin_password = ENV.fetch("ADMIN_PASSWORD", SecureRandom.hex(16))

admin = User.find_or_initialize_by(email: admin_email)
admin.name = "MONVÉR Admin"
admin.role = :admin
admin.password = admin_password if admin.new_record?
admin.save!

# Convenience admin (simple credentials for local sign-in)
convenience = User.find_or_initialize_by(email: "admin@admin.com")
if convenience.new_record?
  convenience.name = "Admin"
  convenience.role = :admin
  convenience.password = "admin1234"
  convenience.save!
end

# ── Categories (leaf categories so products attach directly) ──────────────────
CATEGORIES = [
  { slug: "portefeuilles", name: "Portefeuilles", desc: "Essentiels du quotidien, pensés jusqu'au moindre détail." },
  { slug: "porte-cartes",  name: "Porte-cartes",  desc: "Le minimum raffiné pour vos cartes essentielles." },
  { slug: "ceintures",     name: "Ceintures",     desc: "Des pièces intemporelles pour tous les jours." },
  { slug: "sacs",          name: "Sacs",          desc: "Emporter l'essentiel avec une élégance discrète." },
  { slug: "trousses",      name: "Trousses",      desc: "L'organisation prête à voyager, avec une finition soignée." },
  { slug: "voyage",        name: "Voyage",        desc: "Conçu pour les trajets, près ou loin." },
  { slug: "accessoires",   name: "Accessoires",   desc: "Les petits détails qui complètent le quotidien." },
].freeze

cat = {}
CATEGORIES.each_with_index do |c, i|
  record = Category.find_or_initialize_by(slug: c[:slug])
  record.name = c[:name]
  record.description = c[:desc]
  record.position = i
  record.active = true
  record.save!
  cat[c[:slug]] = record
end

# ── Placeholder catalogue ─────────────────────────────────────────────────────
# Safe, presentation-ready copy — no unverifiable claims (origin, tanning, etc.).
CARE = "Nettoyer avec un chiffon doux et sec. Éviter l'humidité prolongée."

def spec(matiere:, doublure:, dimensions:, finition:)
  [
    { "label" => "Matière",    "value" => matiere },
    { "label" => "Doublure",   "value" => doublure },
    { "label" => "Dimensions", "value" => dimensions },
    { "label" => "Finition",   "value" => finition },
    { "label" => "Entretien",  "value" => CARE },
  ]
end

PRODUCTS = [
  # ── Portefeuilles ──
  { slug: "portefeuille-essentiel", name: "Portefeuille Essentiel MONVÉR", category: "portefeuilles",
    price: 129.000, stock: 60, featured: true, gender: "Mixte",
    desc: "Un portefeuille compact au format pensé pour l'essentiel. Rangements pour cartes, billets et monnaie dans une silhouette épurée qui se glisse facilement en poche.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "11 × 9 cm", finition: "Coutures nettes, bords lissés" } },
  { slug: "portefeuille-compact-heritage", name: "Portefeuille Compact Héritage", category: "portefeuilles",
    price: 149.000, stock: 45, gender: "Mixte",
    desc: "Une pièce sobre et fonctionnelle, avec plusieurs emplacements cartes et un compartiment billets. Pensé pour durer et vous accompagner au quotidien.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "11.5 × 9.5 cm", finition: "Finition raffinée" } },
  { slug: "portefeuille-zippe-atelier", name: "Portefeuille Zippé Atelier", category: "portefeuilles",
    price: 189.000, promo_price: 159.000, on_promo: true, stock: 30, gender: "Femme",
    desc: "Un portefeuille zippé au rangement généreux : cartes, billets et monnaie réunis en toute sécurité. Une allure nette pour un usage de tous les jours.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "19 × 10 cm", finition: "Fermeture zippée, bords lissés" } },

  # ── Porte-cartes ──
  { slug: "porte-cartes-heritage", name: "Porte-cartes Héritage", category: "porte-cartes",
    price: 79.000, stock: 80, featured: true, gender: "Mixte",
    desc: "Un porte-cartes minimaliste qui garde vos cartes essentielles à portée de main. Fin, léger et pensé pour tenir dans la poche avant.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "10 × 7 cm", finition: "Coutures nettes" } },
  { slug: "porte-cartes-slim", name: "Porte-cartes Slim", category: "porte-cartes",
    price: 69.000, stock: 70, gender: "Homme",
    desc: "La version la plus fine de notre porte-cartes, réduite à l'essentiel. Emplacements pour vos cartes du quotidien dans un format ultra-compact.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "9.5 × 6.5 cm", finition: "Finition raffinée" } },

  # ── Ceintures ──
  { slug: "ceinture-signature", name: "Ceinture Signature", category: "ceintures",
    price: 119.000, stock: 50, featured: true, gender: "Homme",
    desc: "Une ceinture classique à la boucle sobre, conçue pour accompagner aussi bien les tenues habillées que décontractées.",
    spec: { matiere: "Cuir premium", doublure: "—", dimensions: "Largeur 3.5 cm", finition: "Boucle métal brossé" } },
  { slug: "ceinture-classique-reversible", name: "Ceinture Classique Réversible", category: "ceintures",
    price: 139.000, stock: 40, gender: "Mixte",
    desc: "Deux teintes en une seule pièce grâce à sa boucle pivotante. Une ceinture polyvalente qui s'adapte à toutes vos tenues.",
    spec: { matiere: "Cuir premium", doublure: "—", dimensions: "Largeur 3.5 cm", finition: "Boucle réversible" } },

  # ── Sacs ──
  { slug: "sac-cabas-everyday", name: "Sac Cabas Everyday", category: "sacs",
    price: 329.000, stock: 25, featured: true, gender: "Femme",
    desc: "Un cabas spacieux à la ligne épurée, pensé pour le quotidien. Volume généreux, anses confortables et intérieur organisé pour l'essentiel.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "34 × 28 × 12 cm", finition: "Anses renforcées" } },
  { slug: "sac-bandouliere-classique", name: "Sac Bandoulière Classique", category: "sacs",
    price: 319.000, promo_price: 269.000, on_promo: true, stock: 22, gender: "Femme",
    desc: "Un sac bandoulière compact et élégant, à la bandoulière ajustable. Idéal pour les journées légères où l'on ne garde que l'essentiel.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "24 × 18 × 8 cm", finition: "Bandoulière ajustable" } },
  { slug: "sac-messager-atelier", name: "Sac Messager Atelier", category: "sacs",
    price: 359.000, stock: 20, featured: true, gender: "Mixte",
    desc: "Un sac messager structuré, pensé pour la ville et le travail. Rabat sécurisé et compartiments pour ordinateur et documents.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "38 × 28 × 10 cm", finition: "Rabat aimanté" } },
  { slug: "sac-a-dos-cite", name: "Sac à Dos Cité", category: "sacs",
    price: 379.000, stock: 18, gender: "Mixte",
    desc: "Un sac à dos raffiné au format urbain. Compartiment principal spacieux, poche intérieure et bretelles confortables pour un usage quotidien.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "42 × 30 × 14 cm", finition: "Bretelles réglables" } },

  # ── Trousses ──
  { slug: "trousse-toilette-atelier", name: "Trousse de Toilette Atelier", category: "trousses",
    price: 149.000, stock: 35, featured: true, gender: "Mixte",
    desc: "Une trousse de toilette spacieuse à l'ouverture large, pensée pour le voyage. Intérieur résistant et finition soignée.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur résistant", dimensions: "24 × 13 × 12 cm", finition: "Fermeture zippée" } },
  { slug: "trousse-compacte-voyage", name: "Trousse Compacte Voyage", category: "trousses",
    price: 99.000, stock: 40, gender: "Mixte",
    desc: "Une trousse au format compact, parfaite pour les week-ends et les déplacements légers. Simple, nette et pratique.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur résistant", dimensions: "20 × 10 × 9 cm", finition: "Fermeture zippée" } },

  # ── Voyage ──
  { slug: "sac-voyage-weekend", name: "Sac de Voyage Weekend", category: "voyage",
    price: 449.000, stock: 15, featured: true, gender: "Mixte",
    desc: "Un sac de voyage au format week-end, spacieux et structuré. Bandoulière amovible et anses renforcées pour accompagner tous vos trajets.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "50 × 28 × 24 cm", finition: "Bandoulière amovible" } },
  { slug: "trousse-voyage-organiseur", name: "Trousse Voyage Organiseur", category: "voyage",
    price: 129.000, stock: 30, gender: "Mixte",
    desc: "Un organiseur de voyage aux multiples rangements pour vos câbles, documents et petits essentiels. Tout à sa place, prêt à partir.",
    spec: { matiere: "Cuir premium", doublure: "Textile intérieur soigné", dimensions: "26 × 18 × 4 cm", finition: "Compartiments multiples" } },

  # ── Accessoires ──
  { slug: "porte-cles-cuir", name: "Porte-clés Cuir", category: "accessoires",
    price: 39.000, stock: 90, gender: "Mixte",
    desc: "Un porte-clés en cuir au détail soigné, pensé pour compléter le quotidien. Léger, élégant et robuste.",
    spec: { matiere: "Cuir premium", doublure: "—", dimensions: "9 × 3 cm", finition: "Anneau métal" } },
  { slug: "etui-lunettes-cuir", name: "Étui à Lunettes", category: "accessoires",
    price: 59.000, stock: 55, gender: "Mixte",
    desc: "Un étui à lunettes protecteur à la ligne épurée. Rigide juste ce qu'il faut, doux à l'intérieur pour préserver vos verres.",
    spec: { matiere: "Cuir premium", doublure: "Intérieur doux protecteur", dimensions: "16 × 7 cm", finition: "Fermeture magnétique" } },
].freeze

PRODUCTS.each do |p|
  record = Product.find_or_initialize_by(slug: p[:slug])
  record.name        = p[:name]
  record.category    = cat[p[:category]]
  record.price       = p[:price]
  record.promo_price = p[:promo_price]
  record.on_promo    = p.fetch(:on_promo, false)
  record.featured    = p.fetch(:featured, false)
  record.stock       = p[:stock]
  record.age_group   = p[:gender]
  record.description = p[:desc]
  record.details     = spec(**p[:spec])
  record.active      = true
  record.save!
end

puts "Done."
puts "Categories: #{Category.count} · Products: #{Product.count}"
puts "Admin: #{admin.email}"
