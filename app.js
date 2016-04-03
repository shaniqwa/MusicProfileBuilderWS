var express = require('express'),
	app = express(),
	MP = require('./MPcontroller');
	// FB = require('./FBController');
	


	app.use('/', express.static('./public'));

	//route that return all genres objects in our data base in a json format
	app.get('/all', function (req, res){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		app.set('json spaces', 4);
		res.set("Content-Type", "application/json");
		res.status(200);
		res.json(MP.getAllGenres());
	});


	
	// app.get('/insert', function (req, res){
	// 	res.header("Access-Control-Allow-Origin", "*");
	// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// 	app.set('json spaces', 4);
	// 	res.set("Content-Type", "application/json");
	// 	res.status(200);
	// 	res.json(MP.insert());
	// });


	// //route that return a genre object by passing it's name as parameter
	// app.param('genre', function ( req, res, next, value){
	// 	res.header("Access-Control-Allow-Origin", "*");
	// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// 	console.log("\nRequest recived with genre: " + value);
	// 	next();
	// });

	// //route that recives parameter using defined parameters - enter a genre to get info about it. res parsed to json
	// app.get('/genre/:genre', 

	// 	function (req, res, next){
	// 		res.header("Access-Control-Allow-Origin", "*");
	// 		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// 		next(); 
	// 	},

	// 	function (req, res) {
	// 	res.status(200).json(MP.getRelatedTo(req.params.genre));
	// });


	// FACEBOOK
	//define route MP with parameter FBat (fabebook access token).
	app.param('FBac', function ( req, res, next, value){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log("\nRequest recived with genre: " + value);
		next();
	});
	// YOUTUBE
	//define route MP with parameter YTat (youtube access token).
	app.param('YTac', function ( req, res, next, value){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log("\nRequest recived with genre: " + value);
		next();
	});

	//route that recives parameter using defined parameters - enter FB/YT/both access token to get  music info about it
	app.get('/MP/:FBat/:YTat', 
		function (req, res, next){
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next(); 
		},

		function (req, res) {
		MP.getMP(req, res, req.params.FBat,req.params.YTat);
	});





	app.listen(process.env.PORT || 8080);
	console.log("service is listening on port 8080");