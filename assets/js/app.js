//Get all necessary elements from the DOM
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const distance = document.querySelector("#distance-input");
const duration = document.querySelector("#duration-input");
const todayContainer = document.querySelector("#today-container");

// set my variables
var currentWeather = document.querySelector(".current-weather");
var APIkey = "&appid=99d1a7e58f500ed377f1399b47f88c6a";
var distanceInput = document.getElementById("distance-input");
var durationInput = document.getElementById("duration-input");
var map;
var markers = [];
var directionsService;
var directionsRenderer;
var today = $("#weather-icon");
var btn = document.querySelector(".form__btn");

//Default city when the page loads/------------------------------------------------------------
let cityInput = "London";

/// Get date /----------------------------------------------------------------------------------------------------------------
const date = moment().format("h:mm a - dddd MMM YY");
dateOutput.innerText = date;
// console.log(date);

//Google map------------------------------------------------------------------------------------------
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.509865, lng: -0.118092 }, //center mapp to Hyde park London
    zoom: 12.5,
  });
  // Get directions and render on map
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  directionsRenderer.setOptions({
    polylineOptions: {
      strokeColor: "red",
    },
    suppressMarkers: true,
  });
  // Add a click event listener to the map
  google.maps.event.addListener(map, "click", function (event) {
    addMarker(event.latLng);
  });
}
function addMarker(location) {
  // Add the marker at the clicked location
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });
  markers.push(marker);
  if (markers.length >= 2) {
    calculateAndDisplayRoute();
  }
}
function deleteMarkers() {
  // Clear markers from the map
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

//function to add distance and duration:
function calculateAndDisplayRoute() {
  var request = {
    origin: markers[0].getPosition(),
    destination: markers[1].getPosition(),
    travelMode: "BICYCLING",
    provideRouteAlternatives: true,

    unitSystem: google.maps.UnitSystem.METRIC,
  };
  directionsService.route(request, function (response, status) {
    if (status === "OK") {
      directionsRenderer.setDirections(response);
      var distance = response.routes[0].legs[0].distance.text;
      var duration = response.routes[0].legs[0].duration.text;
      var elevation = response.routes[0].legs[0].elevation;
      // set input values
      document.getElementById("distance-input").value = distance;
      document.getElementById("duration-input").value = duration;
      document.getElementById("elevation-input").value = elevation;
    } else {
      window.alert("Directions request failed due to " + status);
    }
  });
}

function getLocation() {
  navigator.geolocation.getCurrentPosition((data) => {
    const lat = data.coords.latitude;
    const lon = data.coords.longitude;
    initMap(lat, lon);
    currentConditions(lat, lon);
  });
}

//get geolocation
function getLocation() {
  navigator.geolocation.getCurrentPosition((data) => {
    const lat = data.coords.latitude;
    const lon = data.coords.longitude;

    initMap(lat, lon);

    currentConditions(lat, lon);
  });
}

//Weather

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
      //weather condition icon
      var weatherIcon = wdata.weather[0].icon;
      var iconURL = "https://openweathermap.org/img/w/";
      var weatherIcon = `<img src='${iconURL + wdata.weather[0].icon}.png'>`;
      today.append(weatherIcon);
      //add
      tempDisplay.innerText = Math.round(wdata.main.temp) + "°";
      cityname.innerText = wdata.name;
    });
}

getLocation();

// local storage
btn.addEventListener("click", function (event) {
  event.preventDefault();

  var rides = JSON.parse(localStorage.getItem("rides")) || []; // Add new ride to existing rides data in LS
  var newRide = { distance: distance.value, duration: duration.value };
  rides.push(newRide);
  localStorage.setItem("rides", JSON.stringify(rides));
  // for loop to iterate through the collection of elements and set the innerHTML property of each element to the stored data.
  var element = document.querySelector(".ElementThatHoldsTheHistoryData");

  var h4 = document.createElement("p");
  h4.textContent = `The 🚴‍♀️Distance was ${
    rides[rides.length - 1].distance
  } and the ⏱  Duration was ${rides[rides.length - 1].duration}⚡️`;
  element.appendChild(h4);

  // Clear form
  distance.value = "";
  duration.value = "";
  // Clear markers from the map
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
});

// add function on page load  which will check if the local storage has the data and then you can append that to the HTML
window.onload = function () {
  var rides = JSON.parse(localStorage.getItem("rides")) || [];
  if (rides.length > 0) {
    var element = document.querySelector(".ElementThatHoldsTheHistoryData");
    for (let i = 0; i < rides.length; i++) {
      var h4 = document.createElement("p");
      h4.textContent = `The 🚴‍♀️ Distance was ${rides[i].distance} and the ⏱ Duration was ${rides[i].duration}⚡️`;
      element.appendChild(h4);
    }
  }
};
