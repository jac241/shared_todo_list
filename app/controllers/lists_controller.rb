class ListsController < ApplicationController
  def index

  end

  def new
    @list = List.new
  end

  def create
    @list = List.new(create_params)

    respond_to do |format|
      if @list.save
        format.js { redirect_to slugged_list_path(@list, @list.slug), notice: 'Todo list created successfully!' }
      else
        format.js { render :new }
      end
    end
  end

  def show
    @list = List.find(params[:id])
    @tasks = @list.tasks.order(created_at: :asc)
    @task = @list.tasks.new
  end

  private

  def create_params
    params.require(:list).permit(:name, tasks_attributes: :name)
  end
end
