module Api
  module V1
    class ListsController < Api::V1::ApiController
      def index
        lists = ListResource.all(params)

        #if stale?(lists.data)
          respond_with(lists)
        #end
      end

      def show
        list = ListResource.find(params)
        if stale?(list.data)
          respond_with(list)
        end
      end

      def create
        list = ListResource.build(params)

        if list.save
          render jsonapi: list, status: 201
        else
          render jsonapi_errors: list
        end
      end

      def update
        list = ListResource.find(params)

        if list.update_attributes
          render jsonapi: list
        else
          render jsonapi_errors: list
        end
      end

      def destroy
        list = ListResource.find(params)

        if list.destroy
          render jsonapi: { meta: {} }, status: 200
        else
          render jsonapi_errors: list
        end
      end

    end
  end
end
