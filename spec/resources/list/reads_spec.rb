require 'rails_helper'

RSpec.describe ListResource, type: :resource do
  describe 'serialization' do
    let!(:list) { create(:list) }

    it 'works' do
      render
      data = jsonapi_data[0]
      expect(data.id).to eq(list.id)
      expect(data.jsonapi_type).to eq('lists')
    end
  end

  describe 'filtering' do
    let!(:list1) { create(:list) }
    let!(:list2) { create(:list) }

    context 'by id' do
      before do
        params[:filter] = { id: { eq: list2.id } }
      end

      it 'works' do
        render
        expect(d.map(&:id)).to eq([list2.id])
      end
    end
  end

  describe 'sorting' do
    describe 'by id' do
      let!(:list1) { create(:list) }
      let!(:list2) { create(:list) }

      context 'when ascending' do
        before do
          params[:sort] = 'id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            list1.id,
            list2.id
          ])
        end
      end

      context 'when descending' do
        before do
          params[:sort] = '-id'
        end

        it 'works' do
          render
          expect(d.map(&:id)).to eq([
            list2.id,
            list1.id
          ])
        end
      end
    end
  end

  describe 'sideloading' do
    # ... your tests ...
  end
end
