var ForecastIo = require('forecastio');

var forecastIo = new ForecastIo('8f74177820144d2762a09467d14a93b2'); //forecastIo API Key
var temp;

var options = {
	units: 'si',
	exclude: 'minutely,flags,daily'
};


function secondsToString(seconds){
var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
return numhours + ":00";

}

//main function - returns weather infonrmation relevant for our project
exports.getData = function (lat, lon) {
	//use forecastIO API to get weather by lat and lon .
	forecastIo.forecast(lat, lon,options,  function (err,data){
		if(err) throw err;
		temp = data;
	});

	//process received data - remove unwanted fields.
	var res = [];
	res.push({"temperature" : temp.currently.temperature});

	for(i=1; i<15 ; i=i+3){
		res.push(temp.hourly.data[i]);
	}

	for(i in res){
		res[i].time =  secondsToString(res[i].time);
		delete res[i].precipIntensity;
		delete res[i].summary;
		delete res[i].precipProbability;
		delete res[i].apparentTemperature;
		delete res[i].dewPoint;
		delete res[i].humidity;
		delete res[i].windSpeed;
		delete res[i].windBearing;
		delete res[i].cloudCover;
		delete res[i].pressure;
		delete res[i].ozone;
		delete res[i].visibility;
	}
	return res;
}