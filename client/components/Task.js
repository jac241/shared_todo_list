import { useSWRConfig } from "swr"
import { useCallback, useEffect, useRef, useState } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import dynamic from "next/dynamic"
import DOMPurify from "dompurify"

import { patchTask, toggleTaskCompleted, destroyTask } from "../data/tasks"
import { pathname } from "../data/http"
import styles from "./Task.module.scss"
import sortableListItemStyles from "./SortableListItems.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

const TaskTextEditor = dynamic(() => import("./lists/TaskTextEditor"), {
  ssr: false,
})

const Task = (props) => {
  const { task, onTaskDestroyed } = props
  const [checked, setChecked] = useState(task.attributes.completed)
  const [text, setText] = useState(task.attributes.name)
  const [mode, setMode] = useState(props.mode)
  const { mutate } = useSWRConfig()
  const checkBoxId = `task_${task.id}_checkbox`
  const checkRef = useRef(null)

  const handleClosingEditMode = useCallback(
    async (html) => {
      setMode("display")
      setText(html)
      await patchTask(task, { name: html })
    },
    [setMode, setText]
  )

  let inner = null
  switch (mode) {
    case "display":
      inner = (
        <label
          className={"form-check-label " + styles.task_text}
          htmlFor={checkBoxId}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
        />
      )
      break
    case "edit":
      inner = (
        <TaskTextEditor html={text} onEditingFinished={handleClosingEditMode} />
      )
      break
    default:
      break
  }

  return (
    <>
      <Form.Group
        style={{ flexGrow: 1 }}
        onClick={(event) => {
          if (!checkRef.current.contains(event.target)) {
            setMode("edit")
          }
        }}
      >
        <div className="form-check">
          <input
            ref={checkRef}
            id={checkBoxId}
            className="form-check-input"
            type="checkbox"
            checked={checked}
            onClick={async () => {
              setChecked(!checked)
              await toggleTaskCompleted(task)
              mutate(
                pathname(task.relationships.list.links.related) +
                  "?include=tasks"
              )
            }}
            onChange={() => {}}
          />
          {inner}
        </div>
      </Form.Group>
      <DeleteTaskButton task={task} onTaskDestroyed={onTaskDestroyed} />
    </>
  )
}

Task.defaultProps = {
  mode: "display",
}

const DeleteTaskButton = ({ task, onTaskDestroyed }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    await destroyTask(task)
    onTaskDestroyed(task)
  }, [task])

  return (
    <Button
      className={sortableListItemStyles.delete}
      size="sm"
      variant="outline-secondary"
      disabled={isLoading}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  )
}

export default Task
