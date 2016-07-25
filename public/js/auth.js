'use strict'

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCookieValue(a, b) {
  b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

var token = getParameterByName('token', document.location.href)
var cookieToken = getCookieValue('token')

if (token !== null) {
  document.cookie = 'token=' + token
  document.location.href = '/'
} else if (cookieToken !== '') {
  loginUser(cookieToken)
}
