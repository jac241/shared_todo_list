class TaskResource < ApplicationResource
  attribute :name, :string
  attribute :completed_at, :datetime
  attribute :created_at, :datetime, writable: false
  attribute :updated_at, :datetime, writable: false
  attribute :position, :integer

  attribute :new_position, :integer, only: [:writable]

  attribute :completed, :boolean do
    !!@object.completed_at
  end

  belongs_to :list
  filter :list_id, :integer

  def base_scope
    Task.order(position: :asc)
  end
end
