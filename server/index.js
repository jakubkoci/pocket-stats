require('dotenv').config()
const express = require('express')
const next = require('next')
const service = require('./service')

const consumerKey = process.env.CONSUMER_KEY
const port = process.env.PORT || 8888
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/api/login', async (req, res) => {
    const accessToken = null
    if (!accessToken) {
      const redirectUri = `http://localhost:${port}/api/auth`
      const { requestToken } = await service.getRequestToken(consumerKey, redirectUri)
      res.redirect(
        `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}?requestToken=${requestToken}`
      )
    } else {
      res.status(200).send(`Already logged in with access token: ${accessToken}`)
    }
  })

  server.get('/api/auth', async (req, res) => {
    const requestToken = req.query.requestToken
    const { accessToken, username } = await service.getAccessToken(consumerKey, requestToken)
    res.json({ accessToken, username })
  })

  server.get('/api/unread/:accessToken', async (req, res) => {
    const accessToken = req.params.accessToken
    const items = await service.retrieveData(consumerKey, accessToken)
    res.json({ unread: items.length })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})
