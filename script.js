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
// [saveRouteToHistory Function]
// [loadRouteHistory Function]

/**
 * 6. FORM VALIDATION & EVENT LISTENERS
 * Grabbing user inputs, checking for errors,
 * and triggering the map/logic.
 */
// [Form Submit Listener]
// [Input Validation Logic]
