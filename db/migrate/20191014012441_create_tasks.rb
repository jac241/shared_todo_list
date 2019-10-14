class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks, id: :uuid do |t|
      t.string :name, null: false
      t.datetime :completed_at

      t.timestamps
    end

    add_reference :tasks, :list, foreign_key: true, index: true, type: :uuid
  end
end
