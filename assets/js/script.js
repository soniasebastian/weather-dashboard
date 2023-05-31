var searchFormSubmitEl = document.querySelector('#fetch-button');
var mainSection = document.getElementById('mainSection');
mainSection.classList.add('hideMainSection');
var clearSearchSubmitEl = document.querySelector('#btn');
var searchedCites = [];

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  document.getElementById('search-input').value='';

  if (!searchInputVal) {
    alert('Please enter a search input value!');
    return;
  }
  getWeatherData(searchInputVal);
}

searchFormSubmitEl.addEventListener('click', handleSearchFormSubmit);

function getWeatherData(cityName) {
  var currentWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=cb16b26657f1e991e6ce3376061376d5';
  var forecastWeather = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=cb16b26657f1e991e6ce3376061376d5';

  fetch(currentWeather)
    .then(function (response) {
      return response.json();
    }).then(function (data) {    
      if (data.cod !== 200) {
        alert(data.message);
        mainSection.classList.remove('showMainSection');
        mainSection.classList.add('hideMainSection');
        return;
      }  
      displayCurrentWeatherData(data);
      fetch(forecastWeather)
        .then(function (forecastWeatherResponse) {
          if (!forecastWeatherResponse.ok) {
            throw forecastWeatherResponse.json();
          }
          return forecastWeatherResponse.json();
        }).then(function (forecastWeatherData) {
          displayforecastWeatherData(forecastWeatherData);
        })
    })
    .catch(function (error) {
      alert('Please enter a valid city name' + error.message);
    });
}

function displayCurrentWeatherData(data) {
  mainSection.classList.remove('hideMainSection');
  mainSection.classList.add('showMainSection');
  var formattedDate = getDateFromTimestamp(data.dt);
  document.getElementById('currentTemp').textContent = 'Temp :' + data.main.temp + ' \u00B0C';
  document.getElementById('currentCityDateDetail').textContent = data.name + "  (" + formattedDate + ")";
  document.getElementById('currentConditionImg').setAttribute('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png')
  document.getElementById('currentWind').textContent = 'Wind: ' + data.wind.speed + ' MPH';
  document.getElementById('currrentHumidity').textContent = 'Humidity: ' + data.main.humidity + ' %';
  addSearchedCitiesToLocalStorage(data.name);
}


function displayforecastWeatherData(data) {
  var forecastWeatherDataArr = [data.list[7], data.list[15], data.list[23], data.list[31], data.list[39]];
  var futureConditionEl = document.getElementById('future-conditions');
  futureConditionEl.innerHTML = '';
  for (var i = 0; i < forecastWeatherDataArr.length; i++) {

    var weathercard = document.createElement("div");
    weathercard.classList.add("weather-card");

    var formattedDate = getDateFromTimestamp(forecastWeatherDataArr[i].dt);
    var forecastDateEl = document.createElement("h3");
    forecastDateEl.textContent = data.city.name + "  (" + formattedDate + ")";

    var forecastTemperatureEl = document.createElement("p");
    forecastTemperatureEl.textContent = 'Temp :' + forecastWeatherDataArr[i].main.temp + '\u00B0C';

    var forecastImageEl = document.createElement("img");
    forecastImageEl.setAttribute('src', 'http://openweathermap.org/img/w/' + forecastWeatherDataArr[i].weather[0].icon + '.png');

    var forecastWindEl = document.createElement("p");
    forecastWindEl.textContent = 'Wind: ' + forecastWeatherDataArr[i].wind.speed + ' MPH';

    var forecastHumidityEl = document.createElement("p");
    forecastHumidityEl.textContent = 'Humidity: ' + forecastWeatherDataArr[i].main.humidity + ' %';

    weathercard.append(forecastDateEl, forecastImageEl, forecastTemperatureEl, forecastWindEl, forecastHumidityEl);
    futureConditionEl.append(weathercard);

  }

}

function getDateFromTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert to milliseconds
  const month = date.getMonth() + 1; // Add 1 since getMonth() returns zero-based index
  const day = date.getDate();
  const year = date.getFullYear();
  return month + "/" + day + "/" + year;
};




function buildSearchHistory() {

  if (null != localStorage.getItem('searchedCites')) {
    searchedCites = JSON.parse(localStorage.getItem('searchedCites'));
  }
  var serchedCitiesEl = document.getElementById("searchedCities");
  serchedCitiesEl.innerHTML ='';
  console.log("Removed history from UI");
  // alert(searchedCites);
  if (null !=searchedCites && searchedCites.length > 0) {
    for (var i = 0; i < searchedCites.length; i++) {
      var serchedCitiesLiEl = document.createElement("l1");
      serchedCitiesLiEl.addEventListener("click", function () {
        getWeatherData(this.innerHTML);
      });
      serchedCitiesLiEl.textContent = searchedCites[i];
      serchedCitiesLiEl.classList.add('searchedCities')
      serchedCitiesEl.append(serchedCitiesLiEl);

    }
  }
}

function addSearchedCitiesToLocalStorage(cityName) {
  if (null != localStorage.getItem('searchedCites')) {
    searchedCites = JSON.parse(localStorage.getItem('searchedCites'));
  }
  if (!searchedCites || searchedCites.length == 0 || !searchedCites.includes(cityName)) {
    searchedCites.push(cityName);
  } 
  localStorage.setItem('searchedCites', JSON.stringify(searchedCites));
  buildSearchHistory();
}
buildSearchHistory();

function handleClearSearchSubmit(){
  localStorage.removeItem("searchedCites");
  console.log("Element removed from local storage.");
  searchedCites = [];
  buildSearchHistory();
}
clearSearchSubmitEl.addEventListener('click', handleClearSearchSubmit);

// var removeButton = document.getElementById("btn");

// removeButton.addEventListener("click", function() {
//   localStorage.removeItem("searchedCites");
//   console.log("Element removed from local storage.");
// });



