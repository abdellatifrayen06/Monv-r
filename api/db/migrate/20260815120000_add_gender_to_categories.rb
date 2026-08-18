class AddGenderToCategories < ActiveRecord::Migration[8.1]
  def change
    # "femme", "homme", or "both" (nil = both). Controls which gender section of
    # the storefront navigation a type-category appears under.
    add_column :categories, :gender, :string, default: "both", null: false
  end
end
