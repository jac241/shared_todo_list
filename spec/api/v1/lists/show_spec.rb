require 'rails_helper'

RSpec.describe "lists#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v1/lists/#{list.id}", params: params
  end

  describe 'basic fetch' do
    let!(:list) { create(:list) }

    it 'works' do
      expect(ListResource).to receive(:find).and_call_original
      make_request
      expect(response.status).to eq(200)
      expect(d.jsonapi_type).to eq('lists')
      expect(d.id).to eq(list.id)
    end
  end
end
