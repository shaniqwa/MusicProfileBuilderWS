var mongoose = require('mongoose'),
	db = mongoose.connect('mongodb://music_profile:musicprofile@ds039175.mongolab.com:39175/music_profile');

var genresSchema = require('./genres_schema').genresSchema;
mongoose.model('actionM', genresSchema);

var gerneID;

mongoose.connection.once('open', function() {
	var Genres = this.model('actionM');

	var query = Genres.find();
	query.where('id').ne('PRIVATE');
	query.exec(function (err, docs){
		gerneID = docs;
		mongoose.disconnect();
		return gerneID;
	});
});

exports.getAllGenres = function() {
	return gerneID;
}

exports.getRelatedTo = function(genre){
	
	var res = [];

	for(i in gerneID){
		if(gerneID[i].name == genre){
			res.push(gerneID[i]);
		}
	}
	return res;
}