import 'react'
import 'isomorphic-fetch'
import { Card, Heading } from 'rimble-ui'
import styled from 'styled-components'
import { getAppConfig } from '../server/config'
import * as service from '../server/service'

const { appUrl, consumerKey } = getAppConfig()

class Index extends React.Component {
  static getInitialProps = async ({ req, res }) => {
    const { session } = req
    const { accessToken } = session

    try {
      const items = await service.retrieveData(consumerKey, accessToken)
      return { unread: items.length }
    } catch (error) {
      res.writeHead(302, { Location: `${appUrl}/api/login` })
      res.end()
      return {}
    }
  }

  render() {
    const { unread = 0 } = this.props
    return (
      <Page>
        <Card width={'420px'} mx={'auto'} px={4} border={0}>
          <Heading>Unread</Heading>
          <Number>{unread}</Number>
        </Card>
      </Page>
    )
  }
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
