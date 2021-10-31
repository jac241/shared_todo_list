import { useCallback, useEffect, useState } from "react"
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripVertical } from "@fortawesome/free-solid-svg-icons"
import arrayMove from "array-move"

import styles from "./SortableListItems.module.scss"
import taskStyles from "./Task.module.scss"
import Task from "./Task"
import NewItem from "./lists/NewItem"
import { changeTaskPostition, owningListPathname } from "../data/tasks"
import { useSWRConfig } from "swr"

const SortableContainer = sortableContainer(({ children, beingSorted }) => {
  return <ul className={beingSorted ? styles.sorting : ""}> {children} </ul>
})

const SortableListItems = (props) => {
  const [beingSorted, setBeingSorted] = useState(false)
  const [listItems, setListItems] = useState(props.listItems)
  const [newItem, setNewItem] = useState(null)
  const { mutate } = useSWRConfig()

  const onSortStart = () => {
    setBeingSorted(true)
  }

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return
    }

    try {
      const previousListItems = listItems
      setListItems(arrayMove(listItems, oldIndex, newIndex))

      const updatedTaskResource = await changeTaskPostition(
        previousListItems[oldIndex],
        newIndex
      )

      mutate(owningListPathname(updatedTaskResource.data))
    } finally {
      setBeingSorted(false)
    }
  }

  const onNewItemCreated = useCallback(
    (newItemResource) => {
      setNewItem(newItemResource.data)
      setListItems((currentListItems) => [
        ...currentListItems,
        newItemResource.data,
      ])
    },
    [listItems]
  )

  const handleTaskDestroyed = useCallback(
    (task) => {
      setListItems((currentListItems) =>
        currentListItems.filter((item) => item.id !== task.id)
      )
    },
    [listItems]
  )

  return (
    <SortableContainer
      onSortStart={onSortStart}
      onSortEnd={onSortEnd}
      beingSorted={beingSorted}
      useDragHandle
    >
      {listItems.map((listItem, index) => (
        <TaskItem
          key={listItem.id}
          index={index}
          task={listItem}
          mode={newItem?.id === listItem?.id ? "edit" : "display"}
          onTaskDestroyed={handleTaskDestroyed}
          beingSorted={beingSorted}
        />
      ))}
      <NewItem
        parentList={props.parentList}
        onNewItemCreated={onNewItemCreated}
      />
    </SortableContainer>
  )
}

const TaskItem = sortableElement((props) => {
  const taskStyles = props.beingSorted ? styles.task__dragging : styles.task
  const classes = `d-flex flex-row p-2 ${taskStyles}`
  return (
    <li className={classes} style={{ columnGap: "1rem" }}>
      <DragHandle />
      <Task {...props} />
    </li>
  )
})

const DragHandle = sortableHandle((props) => (
  <span className={styles.dragHandle} {...props}>
    <FontAwesomeIcon icon={faGripVertical} />
  </span>
))

export default SortableListItems
