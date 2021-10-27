class ListResource < ApplicationResource
  attribute :name, :string
  attribute :created_at, :datetime, writable: false
  attribute :updated_at, :datetime, writable: false

  has_many :tasks
end
