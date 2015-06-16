var express = require('express'),
	app = express(),
	coutryID = require('./HomicideController'),
	weather = require('./weather');

	app.use('/', express.static('./public'));

	//route that return all counties in our data base in json 
	app.get('/all', function (req, res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		app.set('json spaces', 4);
		res.set("Content-Type", "application/json");
		res.status(200);
		res.json(coutryID.getData());
	});


	//defined parameters callback, display a msg to console for confirmation.
	app.param('country', function ( req, res, next, value){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log("\nRequest recived with country: " + value);
		next();
	});

	//route that recives parameter using defined parameters - enter a country to get homicide info about it
	app.get('/country/:country', 

		function (req, res, next){
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next(); 
		},

		function (req, res) {
		res.status(200).json(coutryID.getDataByCountry(req.params.country));
	});




	//defined parameters callback, display a msg to console for confirmation.
	app.param('lan', function (req, res, next, value) {
	  	res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log("\nRequest recived with lan: " + value);
		next();

	});
	//defined parameters callback, display a msg to console for confirmation.
	app.param('lat', function (req, res, next, value) {
	  	res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log("\nRequest recived with lat: " + value);
		next();
	});
	//route that recives parameters - Latitude and Longitude, and will call a function that returns the weather info for those values.
	app.get('/weather/:lat/:lon', 
		function (req, res, next){
		  	res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		},

		function (req, res){
			res.status(200).json(weather.getData(req.params.lat, req.params.lon));
		});




	app.listen(process.env.PORT || 3000);
	console.log("service is listening on port 3000");