require('es6-promise').polyfill()
require('isomorphic-fetch')

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
  // Confirm Your Email Address, po 5. 8. 2013 11:42
  const sinceDate = new Date('2013-08-01T00:00Z')
  const payload = {
    consumer_key: consumerKey,
    access_token: accessToken,
    // count: 20,
    since: Math.round(sinceDate.getTime() / 1000), // UNIX timestamp is in seconds, but getTime() returns miliseconds
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
