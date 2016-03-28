var request = require("request");
var async = require("async");
var mongoose = require('mongoose'),
	db = mongoose.connect('mongodb://music_profile:musicprofile@ds039175.mongolab.com:39175/music_profile');

var genresSchema = require('./genres_schema').genresSchema;
mongoose.model('actionM', genresSchema);

var genres;
var completed_requests = 0;
var num_of_requsts = 0;
var num_of_requsts2 = 0;
var lastFM_API_KEY = "5b801a66d1a34e73b6e563afc27ef06b";
var youtubeAPI_KEY = "AIzaSyCFLDEh1SbsSvQcgEVHuMOGfKefK8Ko-xc";

//connect to DB and get all genres
mongoose.connection.once('open', function() {
	var Genres = this.model('actionM');

	var query = Genres.find();
	query.where('id').ne('PRIVATE');
	query.exec(function (err, docs){
		genres = docs;
		mongoose.disconnect();

		//initialize array of Genre objects, all counters set to 0
		var len = genres.length;
		for(var i=0; i<len ; i++){
				var genre = new Genre(genres[i].name, 0)
			    MP.data.push(genre);
		}
		return genres;
	});
});

//Genre object 
function Genre(genre, counter) {
    this.genre = genre;
    this.counter = counter;
    this.percent = null;
    this.artists = [];
}

Genre.prototype.clearCounter = function() {
    this.counter = 0;
};

//Music Profile object
function MP(){
	this.data = [];
	this.total = 0;
}
MP.prototype.getTotal = function(){
	return this.total;
}
MP.prototype.clearMP = function(){
	var len = this.data.length;
	for(var k = 0 ; k<len; k++){
		this.data[k].counter = 0;
		this.data[k].artists = [];
	}
}
MP.prototype.printAll = function(){
	var len = this.data.length;
	for(var k = 0 ; k<len; k++){
		console.log(this.data[k]);
	}
}
MP.prototype.calcPercent = function(){
	var len = this.data.length;
	for(var k = 0; k<len; k++){
		this.data[k].percent = (this.data[k].counter / this.total) * 100;
	}
}
MP.prototype.exists = function(artist,genre){
	var len = this.data.length;
	for(var k = 0 ; k<len; k++){
		if(this.data[k].genre == genre){
			for(var j = 0 ; j<this.data[k].artists.length; j++){
				if(this.data[k].artists[j] == artist){
					return true;
				}
			}
		}
	}
	return false;
}


var MP = new MP();

// function updateMPwithNewArtist(artist,callback){
// 	var encodedParam = encodeURIComponent(artist); //safe search: encode to support any language search
// 	request( "http://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=" + encodedParam + "&api_key="+ lastFM_API_KEY + "&limit=2&format=json", function(error, response, body) {
// 	if (!error && response.statusCode == 200) {
// 		var temp = JSON.parse(body);
// 		if(temp.error){
// 			console.log(temp.message , artist); //if the artist is not valid - print the error message
// 		}else{
// 			//artist is valid
// 			var tags = temp.toptags.tag;
// 			var tagsSize = tags.length;
// 			var genresSize = MP.data.length;
// 			for(var i = 0 ; i < tagsSize ; i++){
// 				for(var j = 0; j < genresSize; j++) {
// 				    if ((tags[i].name == MP.data[j].genre) && (tags[i].count > 10)) {
// 				        MP.data[j].counter++;
// 				        MP.total++;
// 				        MP.data[j].artists.push(artist);
// 				        break;
// 				    }
// 				}
// 			}
// 		}
// 		completed_requests++;
// 		callback(true);
// 	  }else{
// 	  	//problem with request
// 	  	console.log("lastFM returned ",response.statusCode);
// 	  	callback(false);
// 	  }
// 	});
// }


exports.getAllGenres = function() {
	return genres;
}

exports.getRelatedTo = function(genre){
	var res = [];
	for(i in genres){
		if(genres[i].name == genre){
			res.push(genres[i]);
		}
	}
	return res;
}

exports.getMP = function(req, res, fb_access_token,yt_access_token) {
	MP.clearMP();	//clear MP object - prevent duplications because object is initialized outside this function
	MP.total = 0;

	if(fb_access_token != "null" && yt_access_token != "null"){
		async.parallel([
	    function(callback) {
	        Facebook(fb_access_token, function(err) {
	            if (err) {
	                callback(err);
	                return; //It's important to return so that the task callback isn't called twice
	            }
	            console.log('Facebook check finished');
	            callback();
	        });
	    },
	    function(callback) {
	         YouTube(yt_access_token, function(err) {
	            if (err) {
	                callback(err);
	                return; //It's important to return so that the task callback isn't called twice
	            }
	            console.log('Youtube check finished');
	            callback();
	        });
	    }
	], function(err) {
	    if (err) {
	        throw err; //Or pass it on to an outer callback, log it or whatever suits your needs
	    }
	    console.log('Both Facebook and Youtube are done now');

	    //remove all generes that set to zero
	    for(i=0; i<MP.data.length;i++){
			if(MP.data[i].counter == 0){
				MP.data.splice(i, 1);
			}	
	    }
	    res.status(200).json(MP);
	});
	}else if(fb_access_token == "null" && yt_access_token != "null" ){
			YouTube(yt_access_token, function(err) {
	            if (err) {
	                res.status(200).json("error");
	                return; //It's important to return so that the task callback isn't called twice
	            }
	            console.log('Youtube check finished');
	            res.status(200).json(MP);
	        });
	}else if(fb_access_token != "null" && yt_access_token == "null" ){
			Facebook(fb_access_token, function(err) {
	            if (err) {
	            	res.status(200).json("error");	
	                return; //It's important to return so that the task callback isn't called twice
	            }
	            console.log('Facebook check finished');
	            res.status(200).json(MP);
	        });
	}else if(fb_access_token == "null" && yt_access_token == "null" ){
		res.status(200).json("no access tokens!");
	}
}
YouTube = function(yt_access_token, callback){
	request("https://www.googleapis.com/youtube/v3/activities?part=snippet&home=true&maxResults=50&key=" + youtubeAPI_KEY + "&access_token=" + yt_access_token, function(error, response, body) {
		if (!error && response.statusCode == 200) {	
			var YT_MP = JSON.parse(body);
			YT_MP = YT_MP.items;
			var len = YT_MP.length;

			// create a queue object. the task is requests to last FM and update the MP accordingly
			var q = async.queue(function (artist, callback) {
			    	var encodedParam = encodeURIComponent(artist.name); //safe search: encode to support any language search
					request( "http://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=" + encodedParam + "&api_key="+ lastFM_API_KEY + "&limit=2&format=json", function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var temp = JSON.parse(body);
						if(temp.error){
							console.log(temp.message , artist.name); //if the artist is not valid - print the error message
						}else{
							//artist is valid
							var tags = temp.toptags.tag;
							var tagsSize = tags.length;
							var genresSize = MP.data.length;
							for(var i = 0 ; i < tagsSize ; i++){
								for(var j = 0; j < genresSize; j++) {
									// look for a match between popular last.FM tags and our genres from db. the last condition checks that the artist is not already in the MP under the same genre
								    if ((tags[i].name == MP.data[j].genre) && (tags[i].count > 10) && (MP.exists(artist.name,MP.data[j].genre) == false)) { 
								        MP.data[j].counter++;
								        MP.total++;
								        MP.data[j].artists.push(artist.name);
								        break;
								    }
								}
							}
						}
						callback();
					  }else{
					  	//problem with request
					  	console.log(response.statusCode);
					  }
					});
			}, 5); //end queue - the task


			for(var i = 0; i < len; i++) {
				var artist = valueOrDefault(YT_MP[i].snippet.title);
					//separate words before "-"  - words that more likly contain the artist name
					var index =  artist.indexOf("-")
					if(index != -1){
						 artist = artist.substring(0,index-1) ;
						 // console.log("artist: ", artist);
					}
				q.push([{ name: artist }], function (err) {
				    // console.log('finished processing add new artist to MP task');
				});
			}


			// assign a callback
			q.drain = function() {
			    console.log('all items have been processed');
			    //update percent of each genre in MP
				MP.calcPercent();
				callback();
			}
		}else{
			console.log("youtube retuered: " , response.statusCode, " error msg: ", error);
		 	callback(error);
		}
	});
}

Facebook = function(fb_access_token, callback){
		request("https://graph.facebook.com/v2.5/me/music?access_token=" + fb_access_token, function(error, response, body) {
		if (!error && response.statusCode == 200) {
		    var FB_MP = JSON.parse(body);
		    var data = FB_MP["data"];

		    // create a queue object. the task is requests to last FM and update the MP accordingly
			var q = async.queue(function (artist, callback) {
			    	var encodedParam = encodeURIComponent(artist.name); //safe search: encode to support any language search
					request( "http://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=" + encodedParam + "&api_key="+ lastFM_API_KEY + "&limit=2&format=json", function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var temp = JSON.parse(body);
						if(temp.error){
							console.log(temp.message , artist.name); //if the artist is not valid - print the error message
						}else{
							//artist is valid
							var tags = temp.toptags.tag;
							var tagsSize = tags.length;
							var genresSize = MP.data.length;
							for(var i = 0 ; i < tagsSize ; i++){
								for(var j = 0; j < genresSize; j++) {
								    if ((tags[i].name == MP.data[j].genre) && (tags[i].count > 10) && (MP.exists(artist.name,MP.data[j].genre) == false)) { //todo: check also that the artist is not already in the MP
								        MP.data[j].counter++;
								        MP.total++;
								        MP.data[j].artists.push(artist.name);
								        break;
								    }
								}
							}
						}
						callback();
					  }else{
					  	//problem with request
					  	console.log(response.statusCode);
					  }
					});
			}, 1); //end queue - the task


		    //for each artist: get top tags from Last.FM
		    var len = data.length;
			for(var i = 0; i < len; i++) {
				
				// CLEAN
				var artist = data[i].name;
				//remove commeon words that might be along the artist name
				var index = artist.indexOf("Official");
				if(index != -1){
					 artist = artist.substring(0,index);
				}
				//separate words before "-"  - words that more likly contain the artist name
				var index =  artist.indexOf("-")
				if(index != -1){
					 artist = artist.substring(0,index-1) ;
				}
				// END CLEAN

				q.push([{ name: artist }], function (err) {
				    // console.log('finished processing add new artist to MP task');
				});

				// assign a callback
				q.drain = function() {
				    console.log('all items have been processed');
				    //update percent of each genre in MP
					MP.calcPercent();
					callback();
				}
			}
		  }else{
		  	console.log("facebook returned ", response.statusCode);
		  	callback(error);
		  }
		});
}

function valueOrDefault(val, def) {
    if (def == undefined) def = "";
    return val == undefined ? def : val;
}
