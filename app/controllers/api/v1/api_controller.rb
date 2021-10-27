module Api
  module V1
    class ApiController < ActionController::API
      include Graphiti::Rails::Responders
    end
  end
end
