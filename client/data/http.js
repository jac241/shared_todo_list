import axios from "axios"

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  timeout: 15000,
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
})

export const fetcher = (url) => client.get(url).then((r) => r.data)
export const pathname = (url) => new URL(url).pathname

export default client
