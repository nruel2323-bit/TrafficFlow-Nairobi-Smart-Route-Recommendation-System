// ==========================================
// PROJECT: TrafficFlow Nairobi - Smart Route
// GOAL: FSD-FT01 30/30 (Functional Logic)
// ==========================================

/**
 * 1. NAIROBI GEOLOCATION DATA
 * Mapping landmarks to coordinates for Google Maps API.
 */
const nairobiCoordinates = {
  cbd: { lat: -1.286389, lng: 36.817223 },
  westlands: { lat: -1.2633, lng: 36.8045 },
  upperhill: { lat: -1.2997, lng: 36.8143 },
  kilimani: { lat: -1.2901, lng: 36.7828 },
  jkia: { lat: -1.3323, lng: 36.9212 },
  eastleigh: { lat: -1.2754, lng: 36.8504 },
};
// [Coordinates Object will go here]

/**
 * 2. SMART FACTOR MULTIPLIERS
 * Weights for Weather (Rain/Sun) and Nairobi Events (Nyayo/Protests).
 */
const smartFactors = {
  weather: {
    clear: 1.0,
    "light-rain": 1.3,
    "heavy-rain": 2.0, // In Nairobi, heavy rain usually doubles travel time
  },
  incidents: {
    none: 0,
    "nyayo-event": 25, // Minutes added
    "mombasa-rd-accident": 20,
    "cbd-protest": 45,
  },
};
// [Multipliers Object will go here]

/**
 * 3. GOOGLE MAPS CORE LOGIC
 * Functions to initialize the map and draw the 3 alternative routes.
 */
// [initMap Function]
// [calculateAndDisplayRoute Function]
let map, directionsService, directionsRenderer;

function initMap() {
  // 1. Initialize the Google Services
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  // 2. Set the default center (Nairobi CBD)
  const nairobiCenter = nairobiCoordinates["cbd"];

  // 3. Create the map inside the 'map' div
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: nairobiCenter,
    // Disable default UI for a cleaner Glassmorphism look
    disableDefaultUI: true,
    zoomControl: true,
  });

  // 4. Tell the renderer to display the directions on this map
  directionsRenderer.setMap(map);
}

/**
 * Function to fetch routes from Google and trigger the Smart Factor
 */
function calculateAndDisplayRoute(startKey, endKey, weather, incident) {
    const start = nairobiCoordinates[startKey];
    const end = nairobiCoordinates[endKey];

    // 1. Draw the straight line (Path B)
    const routeLine = new google.maps.Polyline({
        path: [start, end],
        geodesic: true,
        strokeColor: "#2ecc71", // TrafficFlow Green
        strokeOpacity: 1.0,
        strokeWeight: 5,
    });
    
    routeLine.setMap(map);

    // 2. Clear old markers and add new ones
    new google.maps.Marker({ position: start, map: map, label: "A" });
    new google.maps.Marker({ position: end, map: map, label: "B" });

    // 3. Zoom the map to fit the route
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);

    // 4. Manually trigger the "Smart Time" calculation (since Google isn't giving us baseTime)
    // We'll estimate base time: 15 mins for short trips, 45 for long ones
    const baseTimeMinutes = (startKey === "jkia" || endKey === "jkia") ? 45 : 20;
    const smartTime = calculateSmartTime(baseTimeMinutes, weather, incident);

    // 5. Update the UI
    document.getElementById("time-output").innerText = "Estimated Smart Time: " + smartTime + " mins";
    
    // 6. Save to history (Keep your existing function call)
    // Create a fake routeData object so your save function doesn't crash
    const fakeRouteData = { legs: [{ start_address: startKey, end_address: endKey, distance: { text: "Calculated" } }] };
    saveRouteToHistory(fakeRouteData, smartTime, weather);
}
/**
 * Helper Function : Build buttons for alternative routes
 */
function displayAltRouteChoices (routes, weather, incident) {
  const altContainer = document.getElementById("alt-routes");
  if (altContainer) {
    altContainer.innerHTML = "<h4>Alternative Routes:</h4>";
    routes.forEach((route, index) => {
      const baseMins = Math.floor(route.legs[0].duration.value / 60);
      const altSmartTime = calculateSmartTime(baseMins, weather, incident);
      const btn = document.createElement("button");
      btn.className = "glass-btn-small";
      btn.style.margin= "5px";
      btn.innerHTML = `<b>Option ${index +1}:</b> ${route.summary}<br><small>${altSmartTime} mins</small>`;
      btn.onclick = () => {
        directionsRenderer.setRouteIndex(index);
        document.getElementById("time-output").innerText = "Selected Route Time: " + altSmartTime + "mins";
        saveRouteToHistory(route, altSmartTime, weather); 
    };
    altContainer.appendChild(btn);
  });
}
}
/**
 * 4. THE SMART ALGORITHM
 * Function that takes base travel time and adjusts it
 * based on the Smart Factor Multipliers.
 */
// [calculateSmartTime Function]
function calculateSmartTime(baseMinutes, weatherKey, incidentKey) {
  // 1. Apply the weather multiplier first
  let adjustedTime = baseMinutes * smartFactors.weather[weatherKey];

  // 2. Add the incident delay in minutes
  adjustedTime += smartFactors.incidents[incidentKey];

  // 3. Return as a rounded number
  return Math.round(adjustedTime);
}

/**
 * 5. DATA PERSISTENCE (LocalStorage)
 * Handling the saving of route history so it appears on the Insights Page.
 */
function saveRouteToHistory(routeData, smartTime, weather) {
  // Safe check: If routeData is a string (manual), or an object (Google)
  const startName = routeData.legs
    ? routeData.legs[0].start_address
    : routeData.startKey;
  const endName = routeData.legs
    ? routeData.legs[0].end_address
    : routeData.endKey;

  const tripEntry = {
    id: Date.now(),
    origin: startName,
    destination: endName,
    distance: routeData.legs ? routeData.legs[0].distance.text : "Calculated",
    duration: smartTime + " mins",
    condition: weather,
    date: new Date().toLocaleDateString(),
  };

  const history = JSON.parse(localStorage.getItem("routeHistory")) || [];
  history.push(tripEntry);
  localStorage.setItem("routeHistory", JSON.stringify(history));
}
// [saveRouteToHistory Function]
// [loadRouteHistory Function]

/**
 * 6. FORM VALIDATION & EVENT LISTENERS
 * Grabbing user inputs, checking for errors,
 * and triggering the map/logic.
 */
// [Form Submit Listener]
// [Input Validation Logic]
const routeForm = document.getElementById("route-form");

if(routeForm) {
  routeForm.addEventListener("submit", function(event){
    event.preventDefault();
    const start = document.getElementById("start-point").value;
    const end = document.getElementById("destination-point").value;
    const weather = document.getElementById("weather-factor").value;
    const incident = document.getElementById("incident-factor").value;
   
    if (start === end){
      alert("Starting point and destination cannot be the same!");
      return;
    }

    const resultArea = document.getElementById("route-result");
    if (resultArea) resultArea.style.display = "block";

    calculateAndDisplayRoute(start, end, weather, incident);
  });
}
// At the very bottom of script.js
if (document.getElementById("map")) {
    // Only start the map if the map div actually exists!
    initMap();
}