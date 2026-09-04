class ProductColor < ApplicationRecord
  include Auditable
  audit_as "ProductColor"

  belongs_to :product
  has_many :sizes, -> { ordered }, class_name: "ProductColorSize", dependent: :destroy
  # Pre-generate storefront thumbnails in the background on upload (see Product).
  # Options MUST match ApplicationController#json_variant_url.
  has_many_attached :images do |attachable|
    attachable.variant :thumb,  resize_to_limit: [ 300, 400 ],  format: :webp, saver: { quality: 82 }, preprocessed: true
    attachable.variant :medium, resize_to_limit: [ 600, 800 ],  format: :webp, saver: { quality: 82 }, preprocessed: true
    attachable.variant :large,  resize_to_limit: [ 900, 1200 ], format: :webp, saver: { quality: 82 }, preprocessed: true
  end
  # Explicit, deterministic photo order: attachment row id = display order.
  # Reordering recreates the attachment rows (ProductColorsController#reorder_images);
  # without ORDER BY, SQLite returns rows in index order (by blob id).
  has_many :images_attachments,
    -> { where(name: "images").order(:id) },
    as: :record, class_name: "ActiveStorage::Attachment",
    inverse_of: :record, dependent: :destroy
  has_many :images_blobs, through: :images_attachments,
    class_name: "ActiveStorage::Blob", source: :blob

  validates :name, presence: true

  scope :ordered, -> { order(:position, :id) }

  def audit_label
    "#{product.name} — #{name}"
  end

  # Total stock across all sizes, or nil when no sizes are defined.
  def total_stock
    sizes.any? ? sizes.sum(:stock) : nil
  end
end
