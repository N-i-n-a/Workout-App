//Weather
var APIkey = "&appid=99d1a7e58f500ed377f1399b47f88c6a";
var currentWeather = document.querySelector(".current-weather");



//Get all necessary elements from the DOM
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const distance = document.querySelector(".form__input form__input--distance");
const duration = document.querySelector(".form__input--duration");
const todayContainer = document.querySelector("#today-container");

//Weather
var currentWeather = document.querySelector(".current-weather");
var APIkey = "&appid=99d1a7e58f500ed377f1399b47f88c6a";

/// Get date
// const date = moment().format("h:mm a - dddd MMM YY");
// dateOutput.innerText = date;
// console.log(date);

//Default city when the page loads


function initMap(lat, lng) {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat, lng },
    disableDefaultUI: true,
  });
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("sidebar"));
  const control = document.getElementById("floating-panel");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  directionsService
    .route({
      origin: "westminster, London",

      destination: "Chelsea, London",

      travelMode: google.maps.TravelMode.BICYCLING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}
function getLocation() {
  navigator.geolocation.getCurrentPosition((data) => {
    const lat = data.coords.latitude;
    const lon = data.coords.longitude;
    // initMap(lat, lon);
    currentConditions(lat, lon);
  });
}

//Weather
var currentWeather = document.querySelector(".current-weather");
var APIkey = "&appid=99d1a7e58f500ed377f1399b47f88c6a";

//fetch data from current weather api, and display desired data on the page
function currentConditions(lat, lon) {
  let currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}${APIkey}&units=metric`;
  const tempDisplay = document.querySelector(".temp");
  const cityname = document.querySelector(".name");
  fetch(currentWeatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (wdata) {
      // city's name, and use moment to get the date
      // var city = getLocation();
      // weather condition icon
      var weatherIcon = wdata.weather[0].icon;
      //add
      tempDisplay.innerText = Math.round(wdata.main.temp) + "°";
      cityname.innerText = wdata.name;
    });
}


getLocation();

