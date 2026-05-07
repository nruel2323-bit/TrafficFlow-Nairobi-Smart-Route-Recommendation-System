const authWrapper = document.querySelector(".auth-wrapper");
const loginTrigger = document.querySelector(".login-trigger");
const registerTrigger = document.querySelector(".register-trigger");

// 1. ANIMATION LOGIC (Keep this exactly as it was)
registerTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  authWrapper.classList.add("toggled");
});

loginTrigger.addEventListener("click", (e) => {
  e.preventDefault();
  authWrapper.classList.remove("toggled");
});

// 2. ACTUAL LOGIN LOGIC (Fixed to not block animation)
// We target the SPECIFIC login button so it doesn't interfere with the toggle
const actualLoginBtn = document.querySelector(
  ".login-form button[type='submit']",
);

if (actualLoginBtn) {
  actualLoginBtn.addEventListener("click", (e) => {
    // Find the input closest to this button
    const usernameInput = document.querySelector(
      ".login-form input[type='text']",
    );

    if (usernameInput && usernameInput.value !== "") {
      e.preventDefault(); // Stop the page from refreshing

      // Save user and go to map
      localStorage.setItem("trafficFlow_user", usernameInput.value);
      window.location.href = "route-planner.html";
    }
    // If it's empty, we let the browser show the "Please fill out this field" warning
  });
}
