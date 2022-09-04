let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// days array for getting week day based on Date.getDay()
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// set api key here and use it in all places
let apiKey = "d296f3b5eb9c5ad34d0650aec94e4ce3";

function formatDate(date) {
  let day = days[date.getDay()];

  let month = months[date.getMonth()];

  return `${date.getHours()}:${date.getMinutes()} - ${day}, ${date.getDate()} ${month}`;
}

function titleCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

let timeSelector = document.querySelector("#current-time");
let forecastContainer = document.querySelector("#forecast-container");

let currentTime = new Date();

if (timeSelector) {
  timeSelector.innerHTML = formatDate(currentTime);
}
let currentCity = document.querySelector("#current-city");
let cityInput = document.querySelector("#city-input");
let searchForm = document.querySelector("#search-form");

// forecast function to make request with coordinates tp api and get forecast data
function processForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  // making request to get forecast data
  axios.get(apiUrl).then((response) => {
    let forecasts = [];

    // remove first element from array because we dont need current date to display
    let daylyData = response.data.daily.slice(1);

    for (let i = 0; i < daylyData.length; i++) {
      let forecast = daylyData[i];

      let forecastDate = new Date(forecast.dt * 1000);

      let forecastDayName = days[forecastDate.getDay()];

      let minTemp = Math.round(forecast.temp.min);
      let maxTemp = Math.round(forecast.temp.max);

      let weatherIcon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

      forecasts.push({
        weekday: forecastDayName,
        date: forecastDate,
        minMax: `${minTemp}°/${maxTemp}°`,
        icon: weatherIcon,
      });
    }

    if (forecasts.length > 0) {
      let forecastInterval = document.querySelector("#forecast-interval");
      let forecastItems = document.querySelector("#forecasts-items");

      let forecastHtml = "";

      for (let i = 0; i < forecasts.length; i++) {
        let item = forecasts[i];
        forecastHtml += `<li class="card-background">
                                <span>${item.weekday}</span>
                                <span>${item.minMax}</span>
                                <span><img
                                    src="${item.icon}"
                                    alt="Weather icon"
                                    id="icon"
                                /></span>
                            </li>`;
      }

      forecastItems.innerHTML = forecastHtml;

      let firstDay = forecasts[0].date;
      let lastDay = forecasts[forecasts.length - 1].date;

      forecastInterval.innerHTML = `${firstDay.getDate()} ${
        months[firstDay.getMonth()]
      } - ${lastDay.getDate()} ${months[lastDay.getMonth()]}`;
    }

    forecastContainer.classList.add("is-active");
  });
}

function showTemp(response) {
  currentCity.innerHTML = titleCase(response.data.name);
  let temp = Math.round(response.data.main.temp);
  let currentDegree = document.querySelector("#current-degree");
  currentDegree.innerHTML = `${temp}°`;
  let currentHumidity = document.querySelector("#current-humidity");
  currentHumidity.innerHTML = response.data.main.humidity;
  let currentWind = document.querySelector("#current-wind");
  currentWind.innerHTML = Math.round(response.data.wind.speed);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  processForecast(response.data.coord);
}

function processWeather(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

function searchLocation(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (cityInput && cityInput.value) {
    processWeather(cityInput.value);
  }
  cityInput.value = ``;
});

document.addEventListener("DOMContentLoaded", function (event) {
  processWeather("Kyiv");
});
