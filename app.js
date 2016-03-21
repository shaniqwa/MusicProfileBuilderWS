var express = require('express'),
	app = express(),
	genreID = require('./DJController');


	app.use('/', express.static('./public'));

	//route that return all genres objects in our data base in a json format
	app.get('/all', function (req, res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		app.set('json spaces', 4);
		res.set("Content-Type", "application/json");
		res.status(200);
		res.json(genreID.getAllGenres());
	});


	//defined parameters callback, display a msg to console for confirmation.
	app.param('genre', function ( req, res, next, value){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log("\nRequest recived with genre: " + value);
		next();
	});

	//route that recives parameter using defined parameters - enter a genre to get info about it
	app.get('/genre/:genre', 

		function (req, res, next){
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next(); 
		},

		function (req, res) {
		res.status(200).json(genreID.getRelatedTo(req.params.genre));
	});


	app.listen(process.env.PORT || 3000);
	console.log("service is listening on port 3000");