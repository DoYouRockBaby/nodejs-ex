//Include libraries
var express = require('express'),
    bodyParser = require('body-parser'),
	mongodb = require('mongodb'),
    jade    = require('jade');

//Initialize express 
var app = express();

//The database URL
var mongoURL = "mongodb://mongodb/mydatabase";

//App settings
var app = express();
app.set('env', 'development');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connection to the database
mongodb.connect(mongoURL, function(err, conn) {
	if (err) {
		console.log("Connection to MongoDB failed");
		console.log(err);
		return;
	}

	db = conn;

	console.log('Connected to MongoDB at: %s', mongoURL);

	//After were connected, we initialize the routes
	require('./routes/book.js')(app, db);
});

//A simple route to test if the server is listening
app.get('/', function (req, res) {
	res.render('index');
});

//Turn express on !
app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});

module.exports = app ;
