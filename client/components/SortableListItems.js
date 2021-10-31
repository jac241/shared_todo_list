import { useCallback, useEffect, useState } from "react"
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripVertical } from "@fortawesome/free-solid-svg-icons"

import styles from "./SortableListItems.module.scss"
import Task from "./Task"
import NewItem from "./lists/NewItem"

const SortableContainer = sortableContainer(({ children, beingSorted }) => {
  return <ul className={beingSorted ? styles.sorting : ""}> {children} </ul>
})

const SortableListItems = (props) => {
  const [beingSorted, setBeingSorted] = useState(false)

  const [listItems, setListItems] = useState(props.listItems)
  useEffect(() => {
    setListItems(props.listItems), [props.listItems, beingSorted]
  })

  const [newItem, setNewItem] = useState(null)

  const handleSortStart = () => {
    setBeingSorted(true)
  }

  const handleSortEnd = useCallback(
    async ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) {
        return
      }
      try {
        props.onSortEnd(listItems, oldIndex, newIndex)
      } finally {
        setBeingSorted(false)
      }
    },
    [listItems]
  )

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

  return (
    <SortableContainer
      onSortStart={handleSortStart}
      onSortEnd={handleSortEnd}
      beingSorted={beingSorted}
      useDragHandle
    >
      {listItems.map((listItem, index) => (
        <TaskItem
          key={listItem.id}
          index={index}
          task={listItem}
          mode={newItem?.id === listItem?.id ? "edit" : "display"}
          onTaskDestroyed={props.onTaskDestroyed}
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
