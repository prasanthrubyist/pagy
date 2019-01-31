require 'bundler/setup'

if RUBY_VERSION >= '2.0'
  require 'single_cov'
  SingleCov.setup(:minitest, branches: false)
end

$LOAD_PATH.unshift File.expand_path("../../lib", __FILE__)
require 'pagy'
require 'pagy/countless'
require 'rack'
require_relative 'test_helper/array'
require_relative 'test_helper/frontend'
require_relative 'test_helper/backend'
require "minitest/autorun"
