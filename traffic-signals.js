// traffic-signals.js

document.addEventListener("DOMContentLoaded", () => {
  // Traffic Lights
  const redLight = document.getElementById("tl-red");
  const yellowLight = document.getElementById("tl-yellow");
  const greenLight = document.getElementById("tl-green");

  // Crosswalk Sign
  const walkSign = document.getElementById("ped-walk");
  const stopSign = document.getElementById("ped-stop");
  const statusText = document.getElementById("status-text");

  // Cycle Durations (in Milliseconds)
  const times = {
    red: 5000, // 5 seconds Red (Cars Stop / Peds Walk)
    yellow: 2000, // 2 seconds Yellow (Caution)
    green: 7000, // 7 seconds Green (Cars Go / Peds Stop)
  };

  function startSignalCycle() {
    // --- CYCLE 1: RED LIGHT (Vehicles Stop, Pedestrians Walk) ---
    cycleToRed();

    // After 5 seconds, switch to Green (skipping Yellow for now for cleaner loop)
    setTimeout(() => {
      // --- CYCLE 2: GREEN LIGHT (Vehicles Go, Pedestrians Stop) ---
      cycleToGreen();

      // After 7 seconds, switch to Yellow
      setTimeout(() => {
        // --- CYCLE 3: YELLOW LIGHT (Caution) ---
        cycleToYellow();

        // After 2 seconds, restart the entire loop back to Red
        setTimeout(startSignalCycle, times.yellow);
      }, times.green);
    }, times.red);
  }

  // --- Helper Functions to switch classes ---

  function resetAllLights() {
    // Remove 'active' from all lights
    redLight.classList.remove("active");
    yellowLight.classList.remove("active");
    greenLight.classList.remove("active");
    walkSign.classList.remove("active");
    stopSign.classList.remove("active");
  }

  function cycleToRed() {
    resetAllLights();
    redLight.classList.add("active"); // Traffic must STOP
    walkSign.classList.add("active"); // Pedestrians can WALK
    statusText.innerText = "WALK";
    statusText.style.color = "#2ecc71"; // Green text
  }

  function cycleToYellow() {
    resetAllLights();
    yellowLight.classList.add("active"); // CAUTION
    stopSign.classList.add("active"); // Pedestrians must STOP
    statusText.innerText = "WAIT";
    statusText.style.color = "#f1c40f"; // Yellow text
  }

  function cycleToGreen() {
    resetAllLights();
    greenLight.classList.add("active"); // Traffic can GO
    stopSign.classList.add("active"); // Pedestrians must STOP
    statusText.innerText = "STOP";
    statusText.style.color = "#e74c3c"; // Red text
  }

  // Start the infinite loop!
  startSignalCycle();
});
