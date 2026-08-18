module Api
  module V1
    class ProductsController < BaseController
      def index
        cache_key = params.slice(:category, :featured, :on_promo, :q, :age, :gender, :sort, :ids).to_json
        data = cache_response("products/index/#{cache_key}") do
          scope = Product.active.includes(:category, images_attachments: :blob,
                                          colors: { images_attachments: :blob })
          if params[:category].present?
            category = Category.find_by(id: params[:category])
            if category
              scope = scope.where(category_id: category.product_scope_ids)
            else
              scope = scope.none
            end
          end
          # Gender-first browsing: unisex ("Mixte") pieces appear under both.
          if params[:gender].present?
            genders =
              case params[:gender].to_s.downcase
              when "femme", "women", "f" then %w[Femme Mixte]
              when "homme", "men", "h"   then %w[Homme Mixte]
              else []
              end
            scope = scope.where(age_group: genders) if genders.any?
          end
          scope = scope.featured if params[:featured] == "true"
          scope = scope.on_promo if params[:on_promo] == "true"
          if params[:age].present?
            age = params[:age].to_s
            scope = scope.where("age_group LIKE ?", "%#{age}%")
          end
          scope = apply_search(scope, params[:q])
          if params[:ids].present?
            ids = params[:ids].to_s.split(",").map(&:to_i).select(&:positive?).uniq.first(100)
            scope = scope.where(id: ids) if ids.any?
          end
          apply_sort(scope, params[:sort]).map { |p| product_json(p) }
        end

        expires_in 2.minutes, public: true
        render json: { products: data }
      end

      def show
        product = Product.active
          .includes(:category, images_attachments: :blob,
                    colors: [:sizes, { images_attachments: :blob }])
          .find_by!(slug: params[:id])
        expires_in 5.minutes, public: true
        if marketing_consent?
          MetaPixelEventJob.perform_later(
            :view_content,
            product_id: product.id,
            user_context: meta_user_context
          )
        end
        render json: { product: product_json(product, detail: true) }
      end

      private

      # Multi-word, accent- and case-insensitive search across product name,
      # description, slug and category name. Every token must match (AND); a
      # token may match any field (OR). "sac cuir" → items with both words.
      def apply_search(scope, query)
        tokens = query.to_s.downcase.split(/\s+/).reject(&:blank?).first(6)
        return scope if tokens.empty?

        scope = scope.left_joins(:category)
        # products.details is a JSON column stored as text — includes the spec
        # rows ("Matière: Cuir premium", dimensions, …), so material words match.
        fields = %w[products.name products.description products.slug products.details categories.name]
        tokens.each do |tok|
          like = "%#{fold_accents(tok)}%"
          clause = fields.map { |f| "#{folded_sql(f)} LIKE ?" }.join(" OR ")
          scope = scope.where(clause, *Array.new(fields.size, like))
        end
        scope.distinct
      end

      def apply_sort(scope, sort)
        case sort.to_s
        when "price_asc"  then scope.reorder(Arel.sql("COALESCE(promo_price, price) ASC"))
        when "price_desc" then scope.reorder(Arel.sql("COALESCE(promo_price, price) DESC"))
        when "name"       then scope.reorder(name: :asc)
        else scope.order(created_at: :desc)
        end
      end

      # Ruby-side accent folding for the search token.
      def fold_accents(str)
        str.tr("áàâäãéèêëíìîïóòôöõúùûüç", "aaaaaeeeeiiiiooooouuuuc")
      end

      # SQLite expression that lowercases and folds common French accents so the
      # column matches the folded token.
      def folded_sql(col)
        pairs = { "é" => "e", "è" => "e", "ê" => "e", "ë" => "e", "à" => "a",
                  "â" => "a", "ä" => "a", "ù" => "u", "û" => "u", "ü" => "u",
                  "î" => "i", "ï" => "i", "ô" => "o", "ö" => "o", "ç" => "c" }
        expr = "LOWER(#{col})"
        pairs.each { |from, to| expr = "REPLACE(#{expr}, '#{from}', '#{to}')" }
        expr
      end

      def listing_image_urls(product, size: :medium)
        urls = product.listing_image_attachments.filter_map { |img| json_variant_url(img, size: size) }
        urls.presence || [ placeholder_image_url(product) ]
      end

      # Elegant leather-toned placeholder shown until real photography is added.
      # Served from the frontend's public/ (same origin in dev and production).
      def placeholder_image_url(product)
        slug = product.slug.to_s
        cat  = product.category&.slug.to_s
        key =
          if    slug.include?("dos")                             then "backpack"
          elsif slug.include?("bandouliere")                     then "crossbody"
          elsif slug.include?("messager")                        then "messenger"
          elsif slug.include?("weekend") || cat == "voyage"      then "travel"
          elsif slug.include?("cabas") || slug.include?("main")  then "handbag"
          elsif slug.include?("cle")                             then "keyring"
          elsif slug.include?("ceinture") || cat == "ceintures"  then "belt"
          elsif slug.include?("trousse") || cat == "trousses"    then "washbag"
          elsif cat == "portefeuilles"                           then "wallet"
          elsif cat == "porte-cartes"                            then "cardholder"
          elsif cat == "sacs"                                    then "bag"
          elsif cat == "accessoires"                             then "accessory"
          else "generic"
          end
        "/placeholders/#{key}.svg"
      end

      def product_json(product, detail: false)
        json = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          promo_price: product.promo_price,
          on_promo: product.on_promo,
          effective_price: product.effective_price,
          stock: product.stock,
          in_stock: product.in_stock?,
          has_variants: product.colors.any?,
          featured: product.featured,
          age_group: product.age_group,
          category: product.category&.slice(:id, :name, :slug),
          image_urls: listing_image_urls(product, size: detail ? :large : :medium)
        }
        if detail
          json[:description] = product.description
          json[:details] = product.details
          json[:rating] = rating_json(product)
          json[:reviews_preview] = reviews_preview_json(product)
          json[:colors] = product.colors.map do |c|
            urls = c.images.map { |img| json_variant_url(img, size: :large) }.compact
            {
              id:            c.id,
              name:          c.name,
              hex:           c.hex,
              position:      c.position,
              thumbnail_url: json_variant_url(c.images.first, size: :thumb),
              image_urls:    urls,
              sizes:         c.sizes.map { |s| { size: s.size, stock: s.stock } }
            }
          end
        end
        json
      end

      def rating_json(product)
        product.rating_stats.merge(user_stars: visitor_review(product)&.stars)
      end

      def reviews_preview_json(product)
        product.reviews
          .includes(:user)
          .order(created_at: :desc)
          .limit(5)
          .map do |review|
            {
              stars: review.stars,
              created_at: review.created_at.iso8601,
              author_name: review.user&.name.presence || "Client MONVÉR"
            }
          end
      end

      def visitor_review(product)
        ProductReview.for_visitor(user: Current.user, ip: request.remote_ip)
          .find_by(product_id: product.id)
      end
    end
  end
end
