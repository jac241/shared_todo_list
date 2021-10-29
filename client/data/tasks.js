import client, {pathname} from './http'

export const toggleTaskCompleted = (task) => {
  console.log(task)
  return patchTask(task, { completed: !task.attributes.completed })
}

const patchTask = async (task, newAttributes) => {
  const response = await client.patch(`/api/v1/tasks/${task.id}`,
    {
      data: {
        type: task.type,
        id: task.id,
        attributes: {
          ...newAttributes
        }
      }
    }
  )
  return response.data
}

export const changeTaskPostition = async (task, newPosition) => {
  return patchTask(task, { new_position: newPosition + 1})
}

export const owningListPathname = (task) => (
  pathname(`${task.relationships.list.links.related}?include=tasks`)
)
