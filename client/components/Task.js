import { useSWRConfig } from 'swr'
import { useState } from "react"
import Form from 'react-bootstrap/Form'

import {toggleTaskCompleted} from '../data/tasks'
import {pathname} from '../data/http'

const Task = ({ task }) => {
  const [checked, setChecked] = useState(task.attributes.completed)
  const { mutate } = useSWRConfig()

  return (
    <Form.Group>
      <Form.Check
        type="checkbox"
        label={ task.attributes.name }
        checked={checked}
        onClick={ async () => {
            setChecked(!checked)
            await toggleTaskCompleted(task)
            mutate(pathname(task.relationships.list.links.related)+'?include=tasks')
          }
        }
        onChange={ () => {} }
      />
    </Form.Group>
  )
}

export default Task
