require 'rails_helper'

RSpec.describe "lists#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v1/lists/#{list.id}"
  end

  describe 'basic destroy' do
    let!(:list) { create(:list) }

    it 'updates the resource' do
      expect(ListResource).to receive(:find).and_call_original
      expect {
        make_request
        expect(response.status).to eq(200), response.body
      }.to change { List.count }.by(-1)
      expect { list.reload }
        .to raise_error(ActiveRecord::RecordNotFound)
      expect(json).to eq('meta' => {})
    end
  end
end
