import qs from "qs"
import { useRouter } from "next/router"
import Card from "react-bootstrap/Card"
import useSWR from "swr"

import Layout from "../../components/layout"
import SortableListItems from "../../components/SortableListItems"
import client from "../../data/http"
import SkeletonList from "../../components/lists/SkeletonList"
import { useCallback } from "react"
import arrayMove from "array-move"
import { changeTaskPostition } from "../../data/tasks"

const fetcher = (url) => client.get(url).then((r) => r.data)

const listURL = (id) => {
  const queryString = qs.stringify({ include: "tasks" })
  return `/api/v1/lists/${id}?${queryString}`
}

function ListPage() {
  return (
    <Layout>
      <List />
    </Layout>
  )
}

const List = () => {
  const router = useRouter()
  const { id } = router.query

  const {
    data: listResource,
    error,
    mutate,
  } = useSWR(id && listURL(id), fetcher)

  const tasks = listResource?.included || [] // sideloaded objects can be undefined
  const handleSortEnd = useCallback(
    async (listItems, oldIndex, newIndex) => {
      const newlistItems = arrayMove(listItems, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          attributes: { ...item.attributes, position: index + 1 },
        })
      )
      mutate({ ...listResource, included: newlistItems }, false)

      await changeTaskPostition(listItems[oldIndex], newIndex)

      mutate()
    },
    [listResource]
  )

  if (error) {
    console.log(error)
    return <div>Error! {error}</div>
  }
  if (!listResource) {
    return <SkeletonList />
  }

  return (
    <Card id={`list_${id}`}>
      <Card.Header>
        <h3>{listResource.data.attributes.name}</h3>
      </Card.Header>
      <Card.Body>
        <SortableListItems
          onSortEnd={handleSortEnd}
          parentList={listResource.data}
          listItems={tasks}
        />
      </Card.Body>
    </Card>
  )
}

export default ListPage
