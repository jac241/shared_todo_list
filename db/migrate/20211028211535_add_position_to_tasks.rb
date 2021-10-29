class AddPositionToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :position, :integer
    List.all.each do |list|
      list.tasks.order(:updated_at).each.with_index(1) do |task, index|
        task.update_column :position, index
      end
    end
  end
end
