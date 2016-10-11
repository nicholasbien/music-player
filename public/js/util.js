'use strict'

let request = (method, url, body, callback) => {
  let xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.onload = () => {
    if (xhr.response) {
      callback(JSON.parse(xhr.response))
    } else {
      callback()
    }
  }
  if (body === null) {
    xhr.send()
  } else {
    xhr.send(JSON.stringify(body))
  }
}