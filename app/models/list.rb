class List < ApplicationRecord
  def slug
    name.parameterize
  end
end
