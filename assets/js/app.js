//Get all necessary elements from the DOM
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const distance = document.querySelector(".form__input form__input--distance");
const duration = document.querySelector(".form__input--duration");
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
function getDistanceAndDuration(response) {
  var route = response.routes[0];
  var distance = 0;
  var duration = 0;
  for (var i = 0; i < route.legs.length; i++) {
    distance += route.legs[i].distance.value;
    duration += route.legs[i].duration.value;
  }
  return { distance: distance, duration: duration };
}

function calculateAndDisplayRoute() {
  directionsService.route(
    {
      origin: markers[0].getPosition(),
      destination: markers[1].getPosition(),
      travelMode: "BICYCLING",
    },
    function (response, status) {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        var distanceAndDuration = getDistanceAndDuration(response);
        var distance = distanceAndDuration.distance / 1000; // convert to kilometers
        var duration = distanceAndDuration.duration / 60; // convert to minutes
        distanceInput.value = distance.toFixed(2);
        durationInput.value = duration.toFixed(0);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
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
      // weather condition icon
      var weatherIcon = wdata.weather[0].icon;

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