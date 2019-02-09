require('dotenv').config()
const express = require('express')
const service = require('./service')

const consumerKey = process.env.CONSUMER_KEY
const port = process.env.PORT || 8888
const app = express()

// TODO Add error handling

app.get('/login', async (req, res) => {
  const accessToken = null
  if (!accessToken) {
    const redirectUri = `http://localhost:${port}/auth`
    const { requestToken } = await service.getRequestToken(consumerKey, redirectUri)
    res.redirect(`https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}?requestToken=${requestToken}`)
  } else {
    res.status(200).send(`Already logged in with access token: ${accessToken}`)
  }
})

app.get('/auth', async (req, res) => {
  const requestToken = req.query.requestToken
  const { accessToken, username } = await service.getAccessToken(consumerKey, requestToken)
  res.status(200).send(`Access token: ${accessToken}, username: ${username}`)
})

app.get('/unread/:accessToken', async (req, res) => {
  const accessToken = req.params.accessToken
  const items = await service.retrieveData(consumerKey, accessToken)
  res.status(200).send(`Unread count: ${items.length}`)
})

app.get('/', (req, res) => {
  res.status(200).send(`Pocket Stats`)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})