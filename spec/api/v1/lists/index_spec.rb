require 'rails_helper'

RSpec.describe "lists#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v1/lists", params: params
  end

  describe 'basic fetch' do
    let!(:list1) { create(:list) }
    let!(:list2) { create(:list) }

    it 'works' do
      expect(ListResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200), response.body
      expect(d.map(&:jsonapi_type).uniq).to match_array(['lists'])
      expect(d.map(&:id)).to match_array([list1.id, list2.id])
    end
  end
end
