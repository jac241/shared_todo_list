require 'rails_helper'

RSpec.describe "lists#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v1/lists", payload
  end

  describe 'basic create' do
    let(:params) do
      attributes_for(:list)
    end
    let(:payload) do
      {
        data: {
          type: 'lists',
          attributes: params
        }
      }
    end

    it 'works' do
      expect(ListResource).to receive(:build).and_call_original
      expect {
        make_request
        expect(response.status).to eq(201), response.body
      }.to change { List.count }.by(1)
    end
  end
end
