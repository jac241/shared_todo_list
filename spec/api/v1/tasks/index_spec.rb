require 'rails_helper'

RSpec.describe "tasks#index", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v1/tasks", params: params
  end

  describe 'basic fetch' do
    let!(:task1) { create(:task) }
    let!(:task2) { create(:task) }

    it 'works' do
      expect(TaskResource).to receive(:all).and_call_original
      make_request
      expect(response.status).to eq(200), response.body
      expect(d.map(&:jsonapi_type).uniq).to match_array(['tasks'])
      expect(d.map(&:id)).to match_array([task1.id, task2.id])
    end
  end
end
