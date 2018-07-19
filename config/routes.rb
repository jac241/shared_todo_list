Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'lists/:id/:slug', to: 'lists#show', as: :slugged_list
  resources :lists

  get '/privacy', to: 'home#privacy'
  get '/terms', to: 'home#terms'

  root to: 'lists#index'
end
