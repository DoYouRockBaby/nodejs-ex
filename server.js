//  OpenShift sample Node application
var express = require('express'),
    bodyParser = require('body-parser'),
    app     = express(),
	mongodb = require('mongodb'),
    jade    = require('jade');

var mongoURL = "mongodb://mongodb/mydatabase";

// App settings
var app = express();
app.set('env', 'development');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongodb.connect(mongoURL, function(err, conn) {
	if (err) {
		console.log("Connection to MongoDB failed");
		console.log(err);
		return;
	}

	db = conn;

	console.log('Connected to MongoDB at: %s', mongoURL);

	require('./routes/book.js')(app, db);
});


app.get('/', function (req, res) {
	res.render('index');
});

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});

module.exports = app ;
