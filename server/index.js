require('dotenv').config()
const express = require('express')
const next = require('next')
const cookieSession = require('cookie-session')
const service = require('./service')
const config = require('./config')

const dev = process.env.NODE_ENV !== 'production'
const { appUrl, port, sessionSecret, consumerKey } = config.getAppConfig()
const app = next({ dev })

app.prepare().then(() => {
  const server = express()

  server.use(
    cookieSession({
      secret: sessionSecret,
      name: 'sessionId',
    })
  )

  server.get('/api/login', async (req, res) => {
    const redirectUri = `${appUrl}/api/auth`
    const { requestToken } = await service.getRequestToken(consumerKey, redirectUri)
    res.redirect(
      `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}?requestToken=${requestToken}`
    )
  })

  server.get('/api/auth', async (req, res) => {
    const { session, query } = req
    const { requestToken } = query
    const { accessToken } = await service.getAccessToken(consumerKey, requestToken)
    session.accessToken = accessToken
    res.redirect('/')
  })

  server.get('/', async (req, res) => {
    const { session } = req
    const { accessToken } = session
    if (!accessToken) {
      res.redirect('/api/login')
    } else {
      return app.render(req, res, '/index')
    }
  })

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})
