window.onload = async () => {
  const response = await fetch('/api/data')
  const json = await response.json()
  console.log(json)

  const unreadArticlesComponent = document.querySelector('#unread')
  console.log('unreadArticlesComponent', unreadArticlesComponent)
  unreadArticlesComponent.innerText = json.unread
}