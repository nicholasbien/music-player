var ejs = require('ejs');

module.exports = function(app, express) {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('html', ejs.renderFile);

	app.use(express.static(__dirname + '/public'));
}
