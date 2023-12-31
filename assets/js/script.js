$( function(){
    var APIKey = "ed84f8908a19b40fae418c4197d3e4e5";
    
}

//var APIKey = "ed84f8908a19b40fae418c4197d3e4e5";
//var city;
//var geocodeURL="http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + APIKey;
// do something with the returned cities and user input to select which one
// if only one is returned, use that, if none are returned, display error message, if more than one, let them select which one
// https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json has countries with country codes
// get the lat and lon fields from the chosen city and store them in variables
// weatherURL = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+ APIKey + "&units=imperial";
// will give a list of weathers
// list.dt=date and time, unix UTC
// list.main has temp, feels_like, humidity
// list.weather has id, main, description, icon
// iconUrl = "https://openweathermap.org/img/wn/"+icon + ".png"; // can optionally have @2x or @4x before .png
// list.clouds.all gives cloudiness %
// list.wind has speed, deg for direction, and gust
// list.pop has probability of precipitation, from 0 (0%) to 1 (100%)
// list.rain.3h or list.snow.3h will have rain/snow volume for past 3 hours in mm, might not exist
// list.sys.pod while be n for night, or d for day
// list.dt_txt gives time and date in ISO, UTC