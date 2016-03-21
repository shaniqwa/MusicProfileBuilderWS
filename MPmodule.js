//Genre object 
exports.Genre = function(genre, counter) {
    this.genre = genre;
    this.counter = counter;
    this.percent = null;
    this.artists = [];
}

exports.Genre.prototype.clearCounter = function() {
    this.counter = 0;
};

exports.MP = function(){
	this.data = [];
	this.total = 0;
}
exports.MP.prototype.getTotal = function(){
	return this.total;
}
exports.MP.prototype.clearMP = function(){
	for(var k = 0 ; k<this.data.length; k++){
		this.data[k].counter = 0;
		this.data[k].artists = [];
	}
}
exports.MP.prototype.printAll = function(){
	for(var k = 0 ; k<this.data.length; k++){
		console.log(this.data[k]);
	}
}
exports.MP.prototype.calcPercent = function(){
	for(var k = 0; k<this.data.length; k++){
		this.data[k].percent = (this.data[k].counter / this.total) * 100;
	}
}


		    

