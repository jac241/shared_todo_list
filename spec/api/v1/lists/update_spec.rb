require 'rails_helper'

RSpec.describe "lists#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v1/lists/#{list.id}", payload
  end

  describe 'basic update' do
    let!(:list) { create(:list) }

    let(:payload) do
      {
        data: {
          id: list.id.to_s,
          type: 'lists',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect(ListResource).to receive(:find).and_call_original
      expect {
        make_request
        expect(response.status).to eq(200), response.body
      }.to change { list.reload.attributes }
    end
  end
end
