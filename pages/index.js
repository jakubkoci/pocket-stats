import 'react'
import 'isomorphic-fetch'

const API_URL = 'http://localhost:8888'

function Index({ unread = 0 }) {
  return (
    <div>
      <div>Unread: {unread}</div>
    </div>
  )
}

Index.getInitialProps = async ({ req }) => {
  const res = await fetch(`${API_URL}/api/unread/d7e17371-3d12-6666-8fb4-362ed5`)
  const json = await res.json()
  const { unread } = json
  return { unread }
}

export default Index
