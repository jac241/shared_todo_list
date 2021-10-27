require 'rails_helper'

RSpec.describe ListResource, type: :resource do
  describe 'creating' do
    let(:payload) do
      {
        data: {
          type: 'lists',
          attributes: attributes_for(:list)
        }
      }
    end

    let(:instance) do
      ListResource.build(payload)
    end

    it 'works' do
      expect {
        expect(instance.save).to eq(true), instance.errors.full_messages.to_sentence
      }.to change { List.count }.by(1)
    end
  end

  describe 'updating' do
    let!(:list) { create(:list) }

    let(:payload) do
      {
        data: {
          id: list.id.to_s,
          type: 'lists',
          attributes: { } # Todo!
        }
      }
    end

    let(:instance) do
      ListResource.find(payload)
    end

    xit 'works (add some attributes and enable this spec)' do
      expect {
        expect(instance.update_attributes).to eq(true)
      }.to change { list.reload.updated_at }
      # .and change { list.foo }.to('bar') <- example
    end
  end

  describe 'destroying' do
    let!(:list) { create(:list) }

    let(:instance) do
      ListResource.find(id: list.id)
    end

    it 'works' do
      expect {
        expect(instance.destroy).to eq(true)
      }.to change { List.count }.by(-1)
    end
  end
end
