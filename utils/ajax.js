export const ajax = {
  get(url, successCb, failCb) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.send(null)
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const json = JSON.parse(xhr.responseText)
          successCb && successCb(json)
        } catch (e) {
          failCb && failCb(xhr)
        }
      } else {
        failCb && failCb(xhr)
      }
    }
  }
}
