require 'rails_helper'

RSpec.describe "tasks#create", type: :request do
  subject(:make_request) do
    jsonapi_post "/api/v1/tasks", payload
  end

  describe 'basic create' do
    let(:params) do
      attributes_for(:task)
    end
    let(:payload) do
      {
        data: {
          type: 'tasks',
          attributes: params
        }
      }
    end

    it 'works' do
      expect(TaskResource).to receive(:build).and_call_original
      expect {
        make_request
        expect(response.status).to eq(201), response.body
      }.to change { Task.count }.by(1)
    end
  end
end
