require 'rails_helper'

RSpec.describe "tasks#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v1/tasks/#{task.id}", payload
  end

  describe 'basic update' do
    let!(:task) { create(:task) }

    let(:payload) do
      {
        data: {
          id: task.id.to_s,
          type: 'tasks',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect(TaskResource).to receive(:find).and_call_original
      expect {
        make_request
        expect(response.status).to eq(200), response.body
      }.to change { task.reload.attributes }
    end
  end
end
