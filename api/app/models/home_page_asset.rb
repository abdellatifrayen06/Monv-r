class HomePageAsset < ApplicationRecord
  include Auditable
  audit_as "HomePageAsset"

  KEYS = %w[hero_fallback banner_collection banner_wallets banner_travel banner_story].freeze

  LABELS = {
    "hero_fallback" => "Image hero (page d'accueil, sans carousel)",
    "banner_collection" => "Bannière « La collection » (grande tuile)",
    "banner_wallets" => "Bannière « Portefeuilles » (tuile)",
    "banner_travel" => "Bannière « Voyage » (tuile)",
    "banner_story" => "Image « Notre approche » (section éditoriale)"
  }.freeze

  has_one_attached :image

  validates :key, presence: true, uniqueness: true, inclusion: { in: KEYS }

  def self.for(key)
    find_or_create_by!(key: key.to_s)
  end

  def audit_label
    LABELS[key] || key
  end
end
