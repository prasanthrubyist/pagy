# See the Pagy documentation: https://ddnexus.github.io/pagy/extras/i18n
# frozen_string_literal: true

class Pagy
  # Use ::I18n gem
  module Frontend

    ::I18n.load_path += Dir[Pagy.root.join('locales', '*.yml')]

    alias :pagy_t_without_i18n :pagy_t
    def pagy_t_with_i18n(*args)
      ::I18n.t(*args)
    end
    alias :pagy_t :pagy_t_with_i18n

  end
end
