var mongoose = require('mongoose'),
	schema = mongoose.Schema;

var genresSchema = new schema({
	id: {type: String, index:1, require:true, unique:true},
	name: String,
	related_to:  [{ name: String }]
}, {collection: 'genres'});

exports.genresSchema = genresSchema; 
