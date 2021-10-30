import client, { pathname } from "./http"

export const toggleTaskCompleted = (task) => {
  return patchTask(task, { completed: !task.attributes.completed })
}

export const patchTask = async (task, newAttributes) => {
  const response = await client.patch(`/api/v1/tasks/${task.id}`, {
    data: {
      type: task.type,
      id: task.id,
      attributes: {
        ...newAttributes,
      },
    },
  })
  return response.data
}

export const changeTaskPostition = async (task, newPosition) => {
  return patchTask(task, { new_position: newPosition + 1 })
}

export const owningListPathname = (task) =>
  pathname(`${task.relationships.list.links.related}?include=tasks`)

export const listWithTasksPathname = (listId) =>
  `/api/v1/lists/${listId}?include=tasks`

export const createNewTask = async (parentList) => {
  const response = await client.post("/api/v1/tasks", {
    data: {
      type: "tasks",
      attributes: {
        name: "",
      },
      relationships: {
        list: {
          data: { type: parentList.type, id: parentList.id },
        },
      },
    },
  })
  return response.data
}

export const destroyTask = async (task) => {
  const response = await client.delete(`/api/v1/tasks/${task.id}`)
  return response.data
}
