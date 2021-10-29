import { useState } from "react"
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripVertical } from "@fortawesome/free-solid-svg-icons"
import arrayMove from "array-move"

import styles from "./SortableListItems.module.scss"
import Task from "./Task"
import NewItem from "./lists/NewItem"
import { changeTaskPostition, owningListPathname } from "../data/tasks"
import { useSWRConfig } from "swr"

const SortableContainer = sortableContainer(({ children, beingSorted }) => (
  <ul className={beingSorted ? styles.sorting : ""}> {children} </ul>
))

const SortableListItems = (props) => {
  const [beingSorted, setBeingSorted] = useState(false)
  const [listItems, setListItems] = useState(props.listItems)
  const [newItem, setNewItem] = useState(null)
  const { mutate } = useSWRConfig()

  const onSortStart = () => {
    document.body.style = "overscroll-behavior: contain;"
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
      document.body.style = ""
    }
  }

  console.log(newItem?.id, newItem)
  const onNewItemCreated = (newItemResource) => {
    setNewItem(newItemResource.data)
    setListItems([...listItems, newItemResource.data])
  }
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
        />
      ))}
      <NewItem
        parentList={props.parentList}
        onNewItemCreated={onNewItemCreated}
      />
    </SortableContainer>
  )
}

const DragHandle = sortableHandle((props) => (
  <span {...props}>
    <FontAwesomeIcon icon={faGripVertical} />
  </span>
))

const TaskItem = sortableElement((props) => (
  <li
    className={"d-flex flex-row p-2 " + styles.task}
    style={{ columnGap: "1rem" }}
  >
    <DragHandle />
    <Task {...props} />
  </li>
))

export default SortableListItems
