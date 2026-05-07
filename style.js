const authWrapper = document.querySelector(".auth-wrapper");
const loginTrigger = document.querySelector(".login-trigger");
const registerTrigger = document.querySelector(".register-trigger");

// 1. Keep your flip animation working
registerTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  authWrapper.classList.add("toggled");
});

loginTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  authWrapper.classList.remove("toggled");
});

// 2. The NEW Login Redirect (Targeting your specific HTML)
const loginForm = document.querySelector(".credentials-panel.signin form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    // This STOP the "#" refresh so we can redirect
    e.preventDefault();

    // Find the username input inside this specific form
    const usernameInput = loginForm.querySelector("input[type='text']");

    if (usernameInput && usernameInput.value !== "") {
      // Save the user
      localStorage.setItem("trafficFlow_user", usernameInput.value);

      // Go to the map
      console.log("Redirecting to map...");
      window.location.href = "route-planner.html";
    }
  });
}
