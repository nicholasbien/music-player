'use strict'

let $ = (selector) => {
  let results = document.querySelectorAll(selector)
  if (results.length === 0) {
    return null
  } else if (results.length == 1) {
    return document.querySelector(selector)
  } else {
    return results
  }
}

let show = (selector) => {
  var elements = $(selector)
  if (elements) {
    if (elements instanceof NodeList) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block'
      }
    } else {
      elements.style.display = 'block'
    }
  }
}

let hide = (selector) => {
  var elements = $(selector)
  if (elements) {
    if (elements instanceof NodeList) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none'
      }
    } else {
      elements.style.display = 'none'
    }
  }
}

let create = (tag) => {
  return document.createElement(tag)
}

let request = (method, url, body, callback) => {
  let xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.onload = () => {
    callback(JSON.parse(xhr.response))
  }
  if (body === null) {
    xhr.send()
  } else {
    xhr.send(JSON.stringify(body))
  }
}