require('dotenv').config()
const path = require('path')
const express = require('express')
const cookieSession = require('cookie-session')
const service = require('./service')
const config = require('./config')

const dev = process.env.NODE_ENV !== 'production'
const { appUrl, port, sessionSecret, consumerKey } = config.getAppConfig()

const server = express()

server.use(
  cookieSession({
    secret: sessionSecret,
    name: 'sessionId',
  })
)

const publicAssetsDirectory = path.join(__dirname, '..', 'public')
console.log('publicAssetsDirectory', publicAssetsDirectory)

server.use('/static', express.static(publicAssetsDirectory))

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

server.get('/api/data', async (req, res) => {
  const { session } = req
  const { accessToken } = session
  try {
    const items = await service.retrieveData(consumerKey, accessToken)
    res.json({ unread: items.length })
  } catch (error) {
    res.status(500)
    res.json({ error: { message: 'Authorization error' } })
  }
})

server.get('/', async (req, res) => {
  const { session } = req
  const { accessToken } = session
  if (!accessToken) {
    res.redirect('/api/login')
  } else {
    res.sendFile(path.join(publicAssetsDirectory, 'index.html'))
  }
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
