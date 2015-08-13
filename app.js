var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);

require('./settings.js')(app, express);
require('./routes/index.js')(app);

server.listen(80);
console.log('Listening at localhost:' + 80);