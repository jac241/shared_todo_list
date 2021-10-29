import {useState} from 'react'
import {sortableContainer, sortableElement} from 'react-sortable-hoc'
import arrayMove from 'array-move'

import styles from './SortableListItems.module.css'
import Task from './Task'
import {changeTaskPostition, owningListPathname} from '../data/tasks'
import {useSWRConfig} from 'swr'

const SortableContainer = sortableContainer(
  ({ children, beingSorted } ) => (
    <div className={beingSorted ? styles.sorting : ""}> {children} </div>
  )
)

const SortableListItems = (props) => {
  const [beingSorted, setBeingSorted] = useState(false)
  const [listItems, setListItems] = useState(props.listItems)
  const { mutate } = useSWRConfig()

  const onSortStart = () => { setBeingSorted(true) }

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) { return }

    try {
      const previousListItems = listItems
      setListItems(arrayMove(listItems, oldIndex, newIndex))

      const updatedTaskResource = await changeTaskPostition(previousListItems[oldIndex], newIndex)
      console.log(updatedTaskResource)

      mutate(owningListPathname(updatedTaskResource.data))
    } finally {
      setBeingSorted(false)
    }
  }

  return (
    <SortableContainer
      onSortStart={onSortStart}
      onSortEnd={onSortEnd}
      beingSorted={beingSorted}
    >
      {
        listItems.map((listItem, index) => (
          <TaskItem key={listItem.id} index={index} task={listItem} />
        ))
      }
        </SortableContainer>
  )
}

const TaskItem = sortableElement(Task)

export default SortableListItems
