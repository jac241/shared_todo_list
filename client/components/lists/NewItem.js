import Button from "react-bootstrap/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import Spinner from "react-bootstrap/Spinner"

import { createNewTask, listWithTasksPathname } from "../../data/tasks"
import { useState } from "react"
import { useSWRConfig } from "swr"

const NewItem = ({ parentList, onNewItemCreated }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = useSWRConfig()

  const createBlankTask = async () => {
    setIsLoading(true)
    try {
      const newItemResource = await createNewTask(parentList)
      mutate(listWithTasksPathname(parentList.id))
      onNewItemCreated(newItemResource)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-2">
      <NewItemButton handleClick={createBlankTask} isLoading={isLoading} />
    </div>
  )
}

const NewItemButton = ({ handleClick, isLoading }) => {
  return (
    <Button
      size="sm"
      onClick={!isLoading ? handleClick : null}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <FontAwesomeIcon icon={faPlus} />
      )}
    </Button>
  )
}

export default NewItem
