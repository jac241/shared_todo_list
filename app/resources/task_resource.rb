class TaskResource < ApplicationResource
  attribute :name, :string
  attribute :completed_at, :datetime
  attribute :created_at, :datetime, writable: false
  attribute :updated_at, :datetime, writable: false

  belongs_to :list
  filter :list_id, :integer
end
