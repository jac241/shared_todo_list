import { useSWRConfig } from "swr"
import { useCallback, useEffect, useRef, useState } from "react"
import Form from "react-bootstrap/Form"

import { patchTask, toggleTaskCompleted } from "../data/tasks"
import { pathname } from "../data/http"

const Task = (props) => {
  const { task } = props
  const [checked, setChecked] = useState(task.attributes.completed)
  const [text, setText] = useState(task.attributes.name)
  const [mode, setMode] = useState(props.mode)
  const { mutate } = useSWRConfig()
  const checkBoxId = `task_${task.id}_checkbox`

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
          className="form-check-label"
          htmlFor={checkBoxId}
          onClick={() => {
            setMode("edit")
          }}
        >
          {text}
        </label>
      )
      break
    case "edit":
      inner = (
        <DetectClickOutside onOutsideClick={handleClosingEditMode}>
          <Form.Control
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
    <Form.Group>
      <div className="form-check">
        <input
          id={checkBoxId}
          className="form-check-input"
          type="checkbox"
          checked={checked}
          onClick={async () => {
            setChecked(!checked)
            await toggleTaskCompleted(task)
            mutate(
              pathname(task.relationships.list.links.related) + "?include=tasks"
            )
          }}
          onChange={() => {}}
        />
        {inner}
      </div>
    </Form.Group>
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
