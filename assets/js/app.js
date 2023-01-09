//Get all necessary elements from the DOM
var currentWeather = document.querySelector(".current-weather");
var APIkey = "&appid=99d1a7e58f500ed377f1399b47f88c6a";
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const distance = document.querySelector(".form__input form__input--distance");
const duration = document.querySelector(".form__input--duration");
const todayContainer = document.querySelector("#today-container");

//Default city when the page loads/------------------------------------------------------------
let cityInput = "London";

/// Get date /----------------------------------------------------------------------------------------------------------------
// const date = moment().format("h:mm a - dddd MMM YY");
// dateOutput.innerText = date;
// console.log(date);
//Google map

var map, markerA, markerB;

function initMap() {
  // 1. Initialize map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12.5,
    center: {
      lat: 51.509865,
      lng: -0.118092,
    },
  });

  // 2. Put first marker in Hyde Park
  markerA = new google.maps.Marker({
    position: {
      lat: 51.509865,
      lng: -0.163611,
    },
    map: map,
    icon: {
      url: "http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png",
    },
    title: "Start Exercise",
    draggable: true, // make marker draggable
  });

  // 3. Put second marker in notting hill
  markerB = new google.maps.Marker({
    position: {
      lat: 51.516862,
      lng: -0.205132,
    },
    map: map,
    icon: {
      url: "http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png",
    },
    title: "Finish Exercise",
    draggable: true, // Make marker draggle
  });

  // add event listner to dynamically get marker location
  google.maps.event.addListener(
    (markerA, markerB),
    "position_changed",
    function () {
      var lat = (markerA, markerB).getPosition().lat();
      var lng = (markerA, markerB).getPosition().lng();
      $("#lat").val(lat);
      $("#lng").val(lng);
    }
  );
  // console.log(markerA, markerB);

  //get direction from MmarkerA to markerB
  // const directionsRenderer = new google.maps.DirectionsRenderer();
  // const directionsService = new google.maps.DirectionsService();
  // const map = new google.maps.Map(document.getElementById("map"), {
  //   zoom: 7,
  //   center: { markerA, markerB },
  //   disableDefaultUI: true,
  // });

  // directionsRenderer.setMap(map);
  // directionsRenderer.setPanel(document.getElementById("sidebar"));

  // const control = document.getElementById("floating-panel");

  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  // directionsService
  //   .route({
  //     origin: "markerA",
  //     destination: "markerB",
  //     travelMode: google.maps.TravelMode.BICYCLING,
  //   })
  //   .then((response) => {
  //     directionsRenderer.setDirections(response);
  //   })
  //   .catch((e) => window.alert("Directions request failed due to " + status));
}

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
