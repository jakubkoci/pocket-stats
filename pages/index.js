import 'react'
import 'isomorphic-fetch'
import { Card, Heading, Text } from 'rimble-ui'
import styled from 'styled-components'

const API_URL = 'http://localhost:8888'

function Index({ unread = 0 }) {
  return (
    <Page>
      <Card width={'420px'} mx={'auto'} px={4} border={0}>
        <Heading>Unread</Heading>
        <Number>{unread}</Number>
      </Card>
    </Page>
  )
}

Index.getInitialProps = async ({ req }) => {
  const res = await fetch(`${API_URL}/api/unread/d7e17371-3d12-6666-8fb4-362ed5`)
  const json = await res.json()
  const { unread } = json
  return { unread }
}

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
const Number = styled.div`
  font-size: 10em;
  text-align: center;
  color: #801010;
`

export default Index
