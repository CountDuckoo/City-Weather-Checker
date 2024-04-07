$( function(){
    const APIKey = "ed84f8908a19b40fae418c4197d3e4e5";
    const formEl = $('.form');
    const cityField = $('#city');
    const searchHistoryEl = $('#search-history');
    const mainWeatherResultsEl = $('#main-weather');
    const dailyWeatherResultsEl = $('#5-days-weather');
    const weatherHeaderEl = $('#weather-header');

    let searchHistory = [];
    const savedSearchHistory = localStorage.getItem("searchHistory");
    if(savedSearchHistory){
        searchHistory= JSON.parse(savedSearchHistory);
        updateHistoryDisplay();
    }
    if(localStorage.getItem("weatherResults")){
        formatWeather();
    } else {
        weatherHeaderEl.attr("style", "display: none;");
    }
     

    // can use searchHistory.getElementsByClassName("li").length to get the number of elements in it

    formEl.on( "submit", function(event){
        event.preventDefault();
        const city = cityField.val().trim();
        if (!city){
            window.alert("Enter a city first!");
            return;
        }
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
        citySearch(geocodeURL, city);
    });

    searchHistoryEl.on( "click", ".search-history-button", function(event){
        let {lat, lon, city} = searchHistory[$(event.target).attr("id").split('-')[2]];
        weatherSearch(lat, lon, city);
    });

    function citySearch(searchUrl, city){
        fetch(searchUrl)
        .then(function(response){
            if(response.ok){
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .then(function(data){
            if(data.length<1){
                throw new Error({name: '404 Error', message: 'No city found with that name.'})
            }
            //get the latitude and longitude from the first element in the array
            const {lat, lon} = data[0];
            cityField.val('');
            // add a new element to search history, using city, lat, and lon
            // if necessary, remove the oldest element
            updateSearchHistory(lat, lon, city);
            weatherSearch(lat, lon, city);
        })
        .catch(function(e){
            console.error(`${e.name}: ${e.message}`);
            window.alert(`An error occurred when searching for the city, ${e.name}: ${e.message}. Please try again.`);
        });
    }

    function weatherSearch(lat, lon, city){
        const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
        fetch(weatherURL)
        .then(function(response){
            if(response.ok){
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .then(function(data){
            localStorage.setItem("weatherResults", JSON.stringify(data));
            formatWeather();
        })
        .catch(function(e){
            console.error(`${e.name}: ${e.message}`);
            window.alert(`An error occurred when getting the weather data, ${e.name}: ${e.message}. Please try again.`);
        });
    }

    function formatWeather(){
        weatherHeaderEl.attr("style", "display: block;");
        const weatherObject = JSON.parse(localStorage.getItem("weatherResults"));
        const city = weatherObject.city.name;
        const weatherResults = weatherObject.list;

        mainWeatherResultsEl.empty();
        const todayWeather = weatherResults[0];
        const mainCard = $('<div>').addClass("card");
        const mainCardBody = $('<div>').addClass("card-body");
        const mainTitle = $('<h2>').addClass("card-title").text(`${city} (${dateFormatting(todayWeather.dt_txt)})`);
        const inlineImage = $('<img>').attr("src", `https://openweathermap.org/img/wn/${todayWeather.weather[0].icon}.png`).attr("alt", todayWeather.weather[0].description);
        mainTitle.append(inlineImage);
        const mainTemp = $('<p>').addClass("card-text").text(`Temp: ${todayWeather.main.temp} °F`);
        const mainWind = $('<p>').addClass("card-text").text(`Wind: ${todayWeather.wind.speed} MPH`);
        const mainHumidity = $('<p>').addClass("card-text").text(`Humidity: ${todayWeather.main.humidity}%`);
        mainCardBody.append(mainTitle, mainTemp, mainWind, mainHumidity);
        mainCard.append(mainCardBody);
        mainWeatherResultsEl.append(mainCard);

        // handle the current time separately
        // then loop over the further ones, making cards for them
        dailyWeatherResultsEl.empty();
        for (let x=7; x<weatherResults.length; x+=8){
            const currentWeather=weatherResults[x];
            const cardDiv = $('<div>').addClass("card bg-dark text-white me-2").attr("style", "width: 16rem;");
            const cardBody = $('<div>').addClass("card-body");
            const cardTitle = $('<h4>').addClass("card-title").text(dateFormatting(currentWeather.dt_txt));
            const cardImage = $('<img>').attr("src", `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`).attr("alt", currentWeather.weather[0].description);
            const cardTemp = $('<p>').addClass("card-text").text(`Temp: ${currentWeather.main.temp} °F`);
            const cardWind = $('<p>').addClass("card-text").text(`Wind: ${currentWeather.wind.speed} MPH`);
            const cardHumidity = $('<p>').addClass("card-text").text(`Humidity: ${currentWeather.main.humidity}%`);
            cardBody.append(cardTitle, cardImage, cardTemp, cardWind, cardHumidity);
            cardDiv.append(cardBody);
            dailyWeatherResultsEl.append(cardDiv);
        }
    }

    function dateFormatting(date){
        let tempDate = date.split(' ')[0].split('-');
        return `${1*tempDate[1]}/${1*tempDate[2]}/${tempDate[0]}`;
    }

    function updateSearchHistory(lat, lon, city){
        searchHistory.push({lat: lat, lon: lon, city: city});
        if(searchHistory.length>8){
            // removes the first (oldest) element from the array
            searchHistory.shift();
        }
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        updateHistoryDisplay();
    }

    function updateHistoryDisplay(){
        searchHistoryEl.empty();
        for(let i=searchHistory.length-1; i>=0; i--){
            const searchElement = $('<li>').addClass("search-history-button btn btn-info").attr("id", ("search-history-"+i)).text(searchHistory[i].city);
            searchHistoryEl.append(searchElement);
        }
    }
});
//var APIKey = "ed84f8908a19b40fae418c4197d3e4e5";
//var city;
//var geocodeURL=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;
// just get the first one
// response.lat and response.lon
// get the lat and lon fields from the chosen city and store them in variables
// save them to search history, along with name (an array, if above certain length call shift() to remove the oldest)
// weatherURL = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
// will give a list of weathers
// list[x].dt=date and time, unix UTC
// list[x].main has temp, feels_like, humidity
// list[x].weather[0] has id, main, description, icon
// iconUrl = "https://openweathermap.org/img/wn/"+icon + ".png"; // can optionally have @2x or @4x before .png
// list[x].clouds.all gives cloudiness %
// list[x].wind has speed, deg for direction, and gust
// list[x].pop has probability of precipitation, from 0 (0%) to 1 (100%)
// list[x].rain.3h or list[x].snow.3h will have rain/snow volume for past 3 hours in mm, might not exist
// list[x].sys.pod will be n for night, or d for day
// list[x].dt_txt gives time and date in ISO, UTC

// goes every 3 hours, so we need to separate by 8 responses
// 0, 7, 15, 23, 31, 39

// need city name, date/time, weather icon using iconUrl, temperature, humidity, wind speed
// city
// dt_txt
// img src=iconUrl
// main.temp
// main.humidity
// wind.speed