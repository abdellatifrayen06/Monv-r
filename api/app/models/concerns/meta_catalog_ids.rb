# Meta catalog content IDs — must match FacebookCatFeedController and frontend metaCatalogId.ts
module MetaCatalogIds
  module_function

  # Color-level IDs only: `{product_id}` (no colors) or `{product_id}-c{color_id}`.
  # The catalog feed has no per-size rows, so the size must NOT be part of the id —
  # otherwise server-side (Conversions API) events reference content_ids that don't
  # exist in the catalog and Meta can't match them (drops the catalog match rate).
  # `size_label` is accepted for call-site compatibility but intentionally unused,
  # mirroring the frontend's metaCatalogContentId.
  def content_id(product_id:, color_id: nil, size_label: nil)
    parts = [product_id.to_s]
    parts << "c#{color_id}" if color_id.present?
    parts.join("-")
  end

  def content_id_for_order_item(item)
    color_id = nil
    if item.product_id.present? && item.color_label.present?
      color_id = ProductColor.joins(:product)
        .where(products: { id: item.product_id }, name: item.color_label)
        .pick(:id)
    end

    content_id(
      product_id: item.product_id,
      color_id: color_id,
      size_label: item.size_label
    )
  end

  # First catalog row for a product — matches the default color in the feed.
  def default_content_id_for_product(product)
    color = product.colors.min_by { |c| [c.position || 0, c.id] }
    content_id(product_id: product.id, color_id: color&.id)
  end
end
