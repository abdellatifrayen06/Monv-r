module Api
  module V1
    class CategoriesController < BaseController
      def index
        data = cache_response("categories") do
          Category.active
                  .includes(:children, image_attachment: :blob)
                  .roots
                  .ordered
                  .map { |c| category_tree_json(c) }
        end
        # Revalidate on every load so admin category-image changes appear
        # immediately. The server-side cache_response above keeps this fast.
        expires_now
        render json: { categories: data }
      end

      private

      def category_tree_json(category)
        {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          gender: category.gender,
          image_url: json_variant_url(category.image, size: :medium),
          children: category.children.active.map do |child|
            {
              id: child.id,
              name: child.name,
              slug: child.slug,
              description: child.description,
              gender: child.gender,
              parent_id: child.parent_id,
              image_url: json_variant_url(child.image, size: :medium)
            }
          end
        }
      end
    end
  end
end
