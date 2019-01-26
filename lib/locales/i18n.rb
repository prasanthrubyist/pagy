# frozen_string_literal: true

# this file returns the default i18n hash used to replace the I18n gem

# flatten the dictionary file nested keys
# convert each value to a simple ruby interpolation proc
flatten = lambda do |hash, key=''|
            hash.each.reduce({}) do |h, (k, v)|
              if v.is_a?(Hash)
                h.merge!(flatten.call(v, "#{key}#{k}."))
              else
                v_proc = eval %({"#{key}#{k}" => lambda{|vars|"#{v.gsub(/%{[^}]+?}/){|m| "\#{vars[:#{m[2..-2]}]||'#{m}'}" }}"}}) #rubocop:disable Security/Eval
                h.merge!(v_proc)
              end
            end
          end

# i18n hash of flat-path/interpolation-proc and the plural proc for the language
{flatten: flatten}.tap do |i18n|
  def i18n.load(args={})  # ruby 1.9 compatible args
    args[:file]     ||= Pagy.root.join('locales', 'en.yml')
    args[:language] ||= 'en'
    self[:data]       = self[:flatten].call(YAML.load_file(args[:file])[args[:language]])
    self[:plural]     = eval(Pagy.root.join('locales', 'plurals.rb').read)[args[:language]] #rubocop:disable Security/Eval
  end
  i18n.load
end

