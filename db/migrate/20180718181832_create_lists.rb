class CreateLists < ActiveRecord::Migration[5.2]
  def change
    enable_extension 'pgcrypto'

    create_table :lists, id: :uuid do |t|
      t.string :name, null: false
    end
  end
end
