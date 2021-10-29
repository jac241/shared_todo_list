import Layout from '../components/layout'
import Spinner from 'react-bootstrap/Spinner'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'
import qs from 'qs'

import client from '../data/http'

const fetcher = url => client.get(url).then(r => r.data)

export default function Home() {
  const router = useRouter()
  const { page } = qs.parse(router.asPath.split('?')[1])

  return (
    <Layout>
      <ListsIndex page={page}/>
    </Layout>
  )
}

const ListsIndex = ({ page }) => {
  const pageQuery = page || { number: 1, page_size: 40 }
  const queryString = qs.stringify(
    { page: { ...pageQuery },
      fields: { lists: "name" },
      sort: "-created_at",
    }
  )

  const { data: listsResource, error } = useSWR(`/api/v1/lists?${queryString}`, fetcher)

  if (error) {
    console.log(error)
    return <div>Error!</div>
  }
  if (!listsResource) { return <Spinner animation="border" />}

  return (
    <div>
      {
        listsResource.data.map((list) => {
          return (
            <Link key={list.id} href={ `/lists/${list.id}` }>
              <h1>
                { list.attributes.name }
              </h1>
            </Link>
          )
        })
      }
      {
        listsResource.links?.prev && (
          <Link href={`/?${listsResource.links.prev.split('?')[1]}`}>
            <a> Prev </a>
          </Link>
        )
      }
      {
        listsResource.links?.next && (
          <Link href={`/?${listsResource.links.next.split('?')[1]}`}>
            <a> Next </a>
          </Link>
        )
      }
    </div>
  )
}
