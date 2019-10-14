class List < ApplicationRecord
  has_many :tasks, inverse_of: :list
  accepts_nested_attributes_for :tasks, reject_if: :all_blank

  validates :name, presence: true
  def slug
    name.parameterize
  end
end
