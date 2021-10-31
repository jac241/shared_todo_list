import Button from "react-bootstrap/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import Spinner from "react-bootstrap/Spinner"

import { useState } from "react"

const NewItem = ({ onNewItemCreated }) => {
  const [isLoading, setIsLoading] = useState(false)

  const createBlankTask = async () => {
    setIsLoading(true)
    try {
      onNewItemCreated()
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
