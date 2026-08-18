# frozen_string_literal: true

require "devise/orm/active_record"

Devise.setup do |config|
  config.mailer_sender = "noreply@monver.com"
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = false
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 8..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.navigational_formats = []
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other

  google_id     = ENV["GOOGLE_CLIENT_ID"].presence     || Rails.application.credentials.dig(:google_client_id).presence
  google_secret = ENV["GOOGLE_CLIENT_SECRET"].presence || Rails.application.credentials.dig(:google_client_secret).presence

  if google_id.present? && google_secret.present?
    config.omniauth :google_oauth2,
      google_id,
      google_secret,
      scope: "email,profile",
      prompt: "select_account"

    # Pin the OAuth callback host so the redirect_uri Google receives is exact.
    #  - Dev: the browser sits on the React origin (:3000) and proxies /users to
    #    Rails (:3001) with changeOrigin; without pinning, OmniAuth would build
    #    the callback against 127.0.0.1:3001 and the session cookie would land on
    #    the wrong domain.
    #  - Prod: behind nginx, the proxied request host/scheme would otherwise be
    #    the internal container (e.g. http://web:3000), so Google would reject the
    #    callback with redirect_uri_mismatch. Pinning to FRONTEND_URL fixes both.
    frontend_host = ENV["FRONTEND_URL"].presence || ENV["SITE_URL"].presence ||
                    (Rails.env.development? ? "http://localhost:3000" : nil)
    OmniAuth.config.full_host = frontend_host if frontend_host
  end
end
