(function(window, document) {

  $ = function(selector) {
    var results = document.querySelectorAll(selector);
    if (results.length === 0) {
      return null;
    } else if (results.length == 1) {
      return document.querySelector(selector);
    } else {
      return results;
    }
  }

  show = function(selector) {
    var elements = $(selector);
    if (elements) {
      if (elements instanceof NodeList) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.display = 'block';
        }
      } else {
        elements.style.display = 'block';
      }
    }
  }

  hide = function(selector) {
    var elements = $(selector);
    if (elements) {
      if (elements instanceof NodeList) {
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none';
        }
      } else {
        elements.style.display = 'none';
      }
    }
  }

  create = function(tag) {
    return document.createElement(tag);
  }

  request = function(method, url, body, callback) {
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

})(this, this.document);