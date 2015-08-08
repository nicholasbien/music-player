var exec = require('child_process').exec;

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index.html');
	});

	app.get('/search', function(req, res) {
		var cmd = 'youtube-dl -x -g --no-cache-dir --no-warnings ' + req.query.url;
		exec(cmd, function(error, stdout, stderr) {
			if (stderr) {
				res.status(400).json(stderr);
			} else {
				var streamUrl = stdout.replace(/(\r\n|\n|\r)/gm,"");
				res.status(200).json(streamUrl);
			}
		});
	});
}