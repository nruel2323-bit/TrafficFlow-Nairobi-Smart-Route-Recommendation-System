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

  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: true, // This gets us the "Alternative Routes" for the rubric
  };

  directionsService.route(request, (response, status) => {
    if (status === "OK") {
      // Display the routes on the map
      directionsRenderer.setDirections(response);
      // Get the first route's base time (in seconds) and convert to minutes
      const baseTimeMinutes = Math.floor(response.routes[0].legs[0].duration.value / 60);
// Calculate the SMART time using our Step 4 algorithm
      const smartTime = calculateSmartTime(baseTimeMinutes, weather, incident);
// Update the UI (Display it on the screen)
document.getElementById("time-output").innerText = "Estimated Smart Time: " + smartTime + "mins";
// Save to history (call step 5 function)
saveRouteToHistory(response.routes[0], smartTime, weather);
      // Now we send this data to a function that builds the choice buttons
      // (We will write this function in the next part)
      displayAltRouteChoices(response.routes, weather, incident);
    } else {
      console.error("Map request failed: " + status);
      alert("Could not find route. Please check your locations.");
    }
  });
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
      btn.innerHTML = '<b>Option ${index +1}:</b> ${route.summary}<br><small>${altSmartTime} mins</small></b>';
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
function saveRouteToHistory(routeData, smartTime, weather){
  // Create a clean object with the info we need
  const tripEntry = {
    id: Date.now(), 
    origin: routeData.legs[0].start_address,
    destination: routeData.legs[0].end_address,
    distance: routeData.legs[0].end_address,
    distance: routeData.legs[0].distance.text,
    duration: smartTime + "mins",
    condition: weather,
    date: new Date().toLocaleDateString()
  };
  let tripHistory = JSON.parse(localStorage.getItem("trafficFlow_history")) || [];
tripHistory.unshift(tripEntry);
localStorage.setItem('trafficFlow_history', JSON.stringify(tripHistory));
console.log("Trip saved to LocalStorage successfully.");
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
