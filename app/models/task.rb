class Task < ApplicationRecord
  belongs_to :list, touch: true
  acts_as_list scope: :list

  validates :name, presence: true

  def completed=(was_completed)
    if was_completed
      self.completed_at = Time.now
    else
      self.completed_at = nil
    end
  end

  def new_position=(pos)
    insert_at(pos)
  end
end
