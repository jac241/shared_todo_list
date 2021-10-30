import { useSWRConfig } from "swr"
import { useCallback, useEffect, useRef, useState } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import { patchTask, toggleTaskCompleted } from "../data/tasks"
import { pathname } from "../data/http"
import styles from "./Task.module.scss"
import sortableListItemStyles from "./SortableListItems.module.scss"

const Task = (props) => {
  const { task } = props
  const [checked, setChecked] = useState(task.attributes.completed)
  const [text, setText] = useState(task.attributes.name)
  const [mode, setMode] = useState(props.mode)
  const { mutate } = useSWRConfig()
  const checkBoxId = `task_${task.id}_checkbox`
  const checkRef = useRef(null)

  const handleClosingEditMode = async (containerElement) => {
    const newText = containerElement.children[0].value
    setMode("display")
    // text has initial value of text in the callback's closure
    if (text == newText) {
      return
    }
    console.log(newText)
    await patchTask(task, { name: newText })
  }

  let inner = null
  switch (mode) {
    case "display":
      inner = (
        <label
          className={"form-check-label " + styles.task_text}
          htmlFor={checkBoxId}
        >
          {text}
        </label>
      )
      break
    case "edit":
      inner = (
        <DetectClickOutside onOutsideClick={handleClosingEditMode}>
          <Form.Control
            className={styles.task_text__edit}
            autoFocus
            as="textarea"
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
          />
        </DetectClickOutside>
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
      <Button
        className={sortableListItemStyles.delete}
        size="sm"
        variant="outline-secondary"
      >
        X
      </Button>
    </>
  )
}

Task.defaultProps = {
  mode: "display",
}

const DetectClickOutside = (props) => {
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, props.onOutsideClick)
  return <div ref={wrapperRef}>{props.children}</div>
}

const useOutsideAlerter = (ref, callback) => {
  // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(ref.current)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

export default Task
