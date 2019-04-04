window.onload = async () => {
  const response = await fetch('/api/data')

  if (response.status === 401) {
    // Redirect to login
    window.location.replace('/api/login')
  } else {
    const json = await response.json()
    console.log(json)

    if (json.error) {
      alert(`Unexpected error: ${json.error}`)
    } else {
      const unreadArticlesComponent = document.querySelector('#unread')
      unreadArticlesComponent.innerText = json.unread
    }
  }
}
