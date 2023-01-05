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
      origin: 'Atlanta, GA', // You can pass lat and long in as a string as well. ie `${lat}, ${lng}`
      destination: 'Jacksonville, FL',
      travelMode: google.maps.TravelMode.BICYCLING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(data => {
    const lat = data.coords.latitude;
    const lon = data.coords.longitude;
    initMap(lat, lon);
  });
}

getLocation();
