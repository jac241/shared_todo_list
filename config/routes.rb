Rails.application.routes.draw do
  namespace :api, defaults: { format: :jsonapi } do
    namespace :v1 do
      resources :lists
      resources :tasks
      mount VandalUi::Engine, at: '/vandal'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  #get 'lists/:id/:slug', to: 'lists#show', as: :slugged_list
  #resources :lists do
    #resources :tasks, shallow: true
  #end
  get '/privacy', to: 'home#privacy'
  get '/terms', to: 'home#terms'

  root to: 'lists#index'
end
