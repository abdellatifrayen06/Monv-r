namespace :images do
  # One-time warm-up for images uploaded BEFORE preprocessed variants were added.
  # Generates the storefront thumbnails so the listing never shows a "broken image"
  # on first load. Safe to re-run (already-generated variants are skipped).
  #
  #   Server (Docker):
  #     docker compose -f deploy/docker-compose.prod.yml exec web bin/rails images:warm
  desc "Pre-generate storefront thumbnail variants for all existing product images"
  task warm: :environment do
    sizes = %i[thumb medium large]
    warmed = 0
    skipped = 0

    [Product, ProductColor].each do |model|
      model.find_each do |record|
        record.images.each do |img|
          next unless img.blob&.image?

          sizes.each do |size|
            img.variant(size).processed
            warmed += 1
          rescue StandardError => e
            skipped += 1
            warn "  skip #{model.name}##{record.id} (#{size}): #{e.message.lines.first&.strip}"
          end
        end
      end
    end

    puts "Done — warmed #{warmed} variant(s), skipped #{skipped}."
  end
end
