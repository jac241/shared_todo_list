import axios from 'axios'
import qs from 'qs'
import { useRouter } from 'next/router'
import ListGroup from 'react-bootstrap/ListGroup'
import Placeholder from 'react-bootstrap/Placeholder'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import useSWR from 'swr'

import Layout from '../../components/layout'
import Task from '../../components/Task'
import SortableListItems from '../../components/SortableListItems'
import client from '../../data/http'

const fetcher = url => client.get(url).then(r => r.data)

const listURL = (id) => {
  const queryString = qs.stringify({ include: "tasks"})
  return `/api/v1/lists/${id}?${queryString}`
}

function ListPage({ listResource }) {
  return <Layout><List listResource={listResource} /></Layout>
}

const List = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: listResource, error } = useSWR(
    id && listURL(id),
    fetcher,
  )

  if (error) {
    console.log(error)
    return <div>Error!</div>
  }
  if (!listResource) { return <SkeletonList />}

  console.log(listResource)
  const tasks = listResource.included

  return (
    <Card id={`list_${id}`}>
      <Card.Header>
        <h3>
          { listResource.data.attributes.name }
        </h3>
      </Card.Header>
      <Card.Body>
        <SortableListItems listItems={tasks} />
      </Card.Body>
    </Card>
  )
}

const SkeletonList = () => {
  return (
    <Card>
      <Card.Header>
        <Placeholder as='h3' animation="glow" />
      </Card.Header>
      <Card.Body>
        {
          [...Array(10).keys()].map((i) => (
            <Form.Group key={i} >
              <Placeholder xs={6} animation="glow" />
            </Form.Group>
          ))
        }
      </Card.Body>
    </Card>
  );
};

export default ListPage
