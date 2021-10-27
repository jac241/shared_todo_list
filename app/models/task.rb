class Task < ApplicationRecord
  belongs_to :list, touch: true

  validates :name, presence: true
end
