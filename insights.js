document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("history-table-body");

  function displayHistory() {
    // Look for the "routeHistory" box
    const savedRoutes = JSON.parse(localStorage.getItem("routeHistory")) || [];

    if (savedRoutes.length === 0) {
      tableBody.innerHTML =
        "<tr><td colspan='5' style='text-align:center;'>No trips recorded yet.</td></tr>";
      return;
    }

    // Show newest trips first
    const reversedRoutes = [...savedRoutes].reverse();

    // MATCHING YOUR NAMES: origin, destination, distance, duration, condition, date
    tableBody.innerHTML = reversedRoutes
      .map(
        (trip) => `
            <tr>
                <td>${trip.origin || "Nairobi"} ➔ ${trip.destination || "Destination"}</td>
                <td>${trip.distance || "N/A"}</td>
                <td><strong>${trip.duration || "N/A"}</strong></td>
                <td>${trip.condition || "Clear"}</td>
                <td>${trip.date || "Today"}</td>
            </tr>
        `,
      )
      .join("");
  }

  displayHistory();
});
