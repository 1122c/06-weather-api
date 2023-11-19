var searchBtn = document.getElementById("search-btn");
const apiKey = "01b3840cc9e9a73d04df55fac72be65e";

document.addEventListener("DOMContentLoaded", loadSearchHistory);

searchBtn.addEventListener("click", function () {
  var cityValue = document.getElementById("city-search").value;
  getCoords(cityValue);
  addCityToHistory(cityValue);
});

function addCityToHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
  displaySearchHistory();
}

function displaySearchHistory() {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  let historyContainer = document.getElementById("search-history");
  historyContainer.innerHTML = ""; // Clear existing history
  history.forEach((city) => {
    let cityElement = document.createElement("div");
    cityElement.textContent = city;
    cityElement.addEventListener("click", () => {
      getCoords(city);
    });
    historyContainer.appendChild(cityElement);
  });
}

function loadSearchHistory() {
  displaySearchHistory();
}

function getCoords(city) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((potato) => {
      console.log(potato);

      currentWeather(potato[0].lat, potato[0].lon);
      fiveDay(potato[0].lat, potato[0].lon);
    });
}

function currentWeather(lat, lon) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(currentUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      var cityName = document.getElementById("cityname");
      cityName.textContent = data.name;

      var temp = document.getElementById("tempurature");
      temp.textContent = "Temp: " + data.main.temp + " F";

      var wind = document.getElementById("wind");
      wind.textContent = "Wind: " + data.wind.speed + "mph";

      var humidity = document.getElementById("humidity");
      humidity.textContent = "Humidity: " + data.main.humidity + "%";
    });
}
function fiveDay(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      let forecastArray = processForecastData(data);
      displayForecast(forecastArray);
    })
    .catch((error) => {
      console.error("error fetching forecast data:", error);
    });
}

function displayForecast(forecastArray) {
  forecastArray.forEach((forecastData, index) => {
    var dayCard = document.querySelector(`#day${index + 1}`);
    dayCard.querySelector(".forecast-date").textContent = forecastData.date;
    dayCard.querySelector(".forecast-temp").textContent =
      "Temp: " + forecastData.temp + " F";
    dayCard.querySelector(".forecast-wind").textContent =
      "Wind: " + forecastData.wind + " MPH";
    dayCard.querySelector(".forecast-humidity").textContent =
      "Humidity: " + forecastData.humidity + "%";
    dayCard.querySelector(".weather-icon").src = getIconUrl(forecastData.icon);
  });
}

function processForecastData(rawData) {
  let forecastArray = [];
  for (let i = 0; i < rawData.list.length; i += 8) {
    // Assuming a 3-hour interval in API data
    let forecast = rawData.list[i];
    forecastArray.push({
      date: new Date(forecast.dt * 1000).toLocaleDateString(), // Convert Unix timestamp to readable date
      temp: forecast.main.temp,
      wind: forecast.wind.speed,
      humidity: forecast.main.humidity,
      icon: forecast.weather[0].icon, // Assuming the first weather condition is primary
    });
  }
  return forecastArray;
}

function getIconUrl(iconCode) {
  return `http://openweathermap.org/img/wn/${iconCode}.png`; // Standard URL format for OpenWeatherMap icons
}

// fetch(url)
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('city-name').textContent = data.name;
//         document.getElementById('temp').textContent = data.main.temp + 'F';
//         document.getElementById('humidity').textContent = data.main.humidity + '%';
//         document.getElementById('wind').textContent = data.wind.speed + 'mph';

//
