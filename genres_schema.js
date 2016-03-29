var mongoose = require('mongoose'),
	schema = mongoose.Schema;

var genresSchema = new schema({
	name: String,
	related_to:  [{ type: String}]
}, {collection: 'genres'});

exports.genresSchema = genresSchema; 
