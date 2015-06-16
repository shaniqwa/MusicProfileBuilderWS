var mongoose = require('mongoose'),
	db = mongoose.connect('mongodb://db_user:db_pass@ds043962.mongolab.com:43962/homicide');

var actionSchema = require('./action_schema').actionSchema;
mongoose.model('actionM', actionSchema);

var coutryID;

mongoose.connection.once('open', function() {
	var Countries = this.model('actionM');

	var query = Countries.find();
	query.where('id').ne('PRIVATE');
	query.exec(function (err, docs){
		coutryID = docs;
		mongoose.disconnect();
		return coutryID;
	});
});

exports.getData = function() {
	return coutryID;
}

exports.getDataByCountry = function(country){
	
	var res = [];

	for(i in coutryID){
		if(coutryID[i].id == country){
			res.push(coutryID[i]);
		}
	}
	return res;
}