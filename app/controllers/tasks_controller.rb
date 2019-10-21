class TasksController < ApplicationController
  def create
    @list = List.find(params[:list_id])
    @task = @list.tasks.new(create_params)

    respond_to do |format|
      if @task.save
        format.js
      else
        format.js { render :new }
      end
    end
  end

  private

  def create_params
    params.require(:task).permit(:name)
  end
end
