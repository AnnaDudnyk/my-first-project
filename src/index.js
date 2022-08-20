let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
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
  let month = months[date.getMonth()];

  return `${date.getHours()}:${date.getMinutes()} - ${day}, ${date.getDate()} ${month}`;
}

//let cities = ["Paris", "Tokyo", "Lisbon", "San Francisco", "Oslo"];
function titleCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
// console.log(weather);
// let city = prompt("Enter a city").toLowerCase().trim();
// if (
//   city === "paris" ||
//   city === "tokyo" ||
//   city === "lisbon" ||
//   city === "san Francisco" ||
//   city === "oslo"
// ) {
//   alert(
//     `It is currently ${Math.floor(weather[city].temp)}°C (66°F) in ${titleCase(
//       city
//     )} with a humidity of ${weather[city].humidity}%`
//   );
// } else {
//   alert(
//     `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+sydney`
//   );
// }

let timeSelector = document.querySelector("#current-time");

let currentTime = new Date();

if (timeSelector) {
  timeSelector.innerHTML = formatDate(currentTime);
}
let currentCity = document.querySelector("#current-city");
let cityInput = document.querySelector("#city-input");
let searchForm = document.querySelector("#search-form");

function showTemp(response) {
  let temp = Math.round(response.data.main.temp);
  let currentDegree = document.querySelector("#current-degree");
  currentDegree.innerHTML = `${temp}°`;
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (cityInput && cityInput.value) {
    currentCity.innerHTML = titleCase(cityInput.value);

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric`;

    let apiKey = "d296f3b5eb9c5ad34d0650aec94e4ce3";

    axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemp);
  }
});
