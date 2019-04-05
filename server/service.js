require('es6-promise').polyfill()
require('isomorphic-fetch')
const { AuthorizationError } = require('./errors')

const apiUrl = process.env.API_URL

async function getRequestToken(consumerKey, redirectUri) {
  const payload = {
    consumer_key: consumerKey,
    redirect_uri: redirectUri,
  }

  const response = await post(`${apiUrl}/oauth/request`, payload)
  return {
    requestToken: response.code,
  }
}

async function getAccessToken(consumerKey, requestToken) {
  const payload = {
    consumer_key: consumerKey,
    code: requestToken,
  }

  const response = await post(`${apiUrl}/oauth/authorize`, payload)
  return {
    accessToken: response.access_token,
    username: response.username,
  }
}

async function retrieveData(consumerKey, accessToken) {
  const payload = {
    consumer_key: consumerKey,
    access_token: accessToken,
    detailType: 'simple',
    state: 'unread',
    sort: 'newest',
  }

  const response = await post(`${apiUrl}/get`, payload)
  const items = Object.values(response.list)
  return items.map(({ item_id, resolved_title, status }) => ({ item_id, resolved_title, status }))
}

async function post(url, payload) {
  console.log('post request', url, payload)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  }

  const response = await fetch(url, options)

  if (response.status !== 200) {
    const errorMessage = `${response.status} - ${response.statusText}`
    console.log(errorMessage)

    if (response.status === 401) {
      throw new AuthorizationError(errorMessage)
    }
    throw new Error(errorMessage)
  }

  const json = await response.json()
  console.log('post response', response.status, response.statusText)
  return json
}

module.exports = {
  getRequestToken,
  getAccessToken,
  retrieveData,
}
