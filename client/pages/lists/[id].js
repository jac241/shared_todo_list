import axios from 'axios'
import qs from 'qs'
import { useRouter } from 'next/router'
import Spinner from 'react-bootstrap/Spinner'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import useSWR from 'swr'
import { useState } from 'react'

import Layout from '../../components/layout'

axios.defaults.baseURL = "http://localhost:5000"
const fetcher = url => axios.get(url).then(r => r.data)



const listURL = (id) => {
  const queryString = qs.stringify({ include: "tasks"})
  return `/api/v1/lists/${id}?${queryString}`
}

function ListPage({ listResource }) {
  return <Layout><List listResource={listResource} /></Layout>
}

const List = (props) => {
  const router = useRouter()
  const { id } = router.query

  const queryString = qs.stringify({ include: "tasks"})
  const { data: listResource, error } = useSWR(
    `/api/v1/lists/${id}?${queryString}`,
    fetcher,
    { fallbackData: props.listResource }
  )


  if (error) {
    console.log(error)
    return <div>Error!</div>
  }
  //if (!listResource) { return <Spinner animation="border" />}

  const tasks = listResource.included

  return (
    <Card id={`list_${id}`}>
      <Card.Header>
        <h3>
          { listResource.data.attributes.name }
        </h3>
      </Card.Header>
      <Card.Body>
        <ListGroup>
          {
            tasks.map((task) => (
              <Task key={task.id} task={task} />
            ))
          }
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

const Task = ({ task }) => {
  const [checked, setChecked] = useState(true)

  return (
    <Form.Group>
      <Form.Check
        type="checkbox"
        label={ task.attributes.name }
        checked={checked}
        onClick={ () => setChecked(!checked) }
        onChange={ () => {} }
      />
    </Form.Group>
  )
}

ListPage.getInitialProps = async (ctx) => {
  console.log(ctx.query.id)
  const listResource = await fetcher(listURL(ctx.query.id))

  return {
    listResource
  }
}

export default ListPage
