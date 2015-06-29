var http = require('http');
console.log('here');
module.exports = function(app) {
	app.get('/#', function(request, response) {
		console.log('server');
		/*
		var url = request.request.url;
		var options = [ '-g', '-x'];
		youtubedl.getInfo(url, options, function(error, info) {
			if (error) callback(error);
			callback(null, error);
		});
	*/
	});
}