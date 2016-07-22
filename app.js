var http = require('http');
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/music-player');

var server = http.createServer(app);

require('./settings.js')(app, express);
require('./routes.js')(app);

server.listen(3000);
console.log('Listening at localhost:' + 3000);
