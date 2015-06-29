var http = require('http');
var express = require('express');
var ejs = require('ejs');
//var youtubedl = require('youtube-dl');
var exec = require('child_process').exec;

var app = express();

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/search', function(req, res) {
	var id = req.query.id;
	var cmd = 'youtube-dl -x -g http://www.youtube.com/watch?v=' + req.query.id;
	exec(cmd, function(error, stdout, stderr) {
		res.status(200).json(stdout);
	});
});

var server = http.createServer(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.use(express.static('public'));

//require('./routes/index.js')(app);

server.listen(3000);
console.log('Listening at localhost:' + 3000);