require('dotenv').config()
const path = require('path')
const express = require('express')
const cookieSession = require('cookie-session')
const service = require('./service')
const config = require('./config')
const { AuthorizationError } = require('./errors')
 
const { appUrl, port, sessionSecret, consumerKey } = config.getAppConfig()

const publicAssetsDirectory = path.join(__dirname, '..', 'public')
console.log('publicAssetsDirectory', publicAssetsDirectory)

const server = express()

server.use(
  cookieSession({
    secret: sessionSecret,
    name: 'sessionId',
  })
)

server.use('/static', express.static(publicAssetsDirectory))

server.get('/api/login', wrapAsync(login))
server.get('/api/auth', wrapAsync(auth))
server.get('/api/data', wrapAsync(data))
server.get('/', wrapAsync(index))

// Set custom error handle middleware after all routes declaration
server.use(errorHandler)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

async function login(req, res) {
  console.log('/api/login')
  const redirectUri = `${appUrl}/api/auth`
  const { requestToken } = await service.getRequestToken(consumerKey, redirectUri)
  res.redirect(
    `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}?requestToken=${requestToken}`
  )
}

async function auth(req, res) {
  console.log('/api/auth')
  const { session, query } = req
  const { requestToken } = query
  const { accessToken } = await service.getAccessToken(consumerKey, requestToken)
  session.accessToken = accessToken
  res.redirect('/')
}

async function data(req, res) {
  console.log('/api/data')
  let { session } = req
  const { accessToken } = session
  const items = await service.retrieveData(consumerKey, accessToken)
  res.json({ unread: items.length })
}

async function index(req, res) {
  console.log('/')
  const { session } = req
  const { accessToken } = session
  if (!accessToken) {
    res.redirect('/api/login')
  } else {
    res.sendFile(path.join(publicAssetsDirectory, 'index.html'))
  }
}

function wrapAsync(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

function errorHandler(error, req, res, next) {
  console.log('errorHandler')
  if (error instanceof AuthorizationError) {
    res.status(401)
  } else {
    res.status(500)
  }
  res.json({ error: error.message || 'Unexpected error' })
}
