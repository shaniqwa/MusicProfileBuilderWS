var mongoose = require('mongoose'),
	schema = mongoose.Schema;

var actionSchema = new schema({
	id: {type: String, index:1, require:true, unique:true},
	population: Number,
	rate: Number,
	homicide: Number,
	firearm: Number,
	sharp: Number,
	other: Number,
	male: Number,
	female: Number,
	lat: Number,
	lon: Number
}, {collection: 'countries'});

exports.actionSchema = actionSchema; 
