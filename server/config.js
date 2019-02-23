function getAppConfig() {
  const port = process.env.PORT || 3000
  const appUrl = process.env.APP_URL || `http://localhost:${port}`
  const consumerKey = process.env.CONSUMER_KEY
  const sessionSecret = process.env.SESSION_SECRET
  return {
    port,
    appUrl,
    consumerKey,
    sessionSecret,
  }
}

module.exports = {
  getAppConfig,
}
