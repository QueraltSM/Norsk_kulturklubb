var loginBtn = document.getElementById("loginBtn");
var userProfile = document.getElementById("userProfile");
var welcomeUser = document.getElementById("welcomeUser");
var isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn == "true") {
  welcomeUser.innerHTML = localStorage.getItem("welcomeUser");
  userProfile.style.display = "block";
} else {
  loginBtn.style.display = "block";
}

function logout() {
  userProfile.style.display = "none";
  loginBtn.style.display = "block";
  localStorage.setItem("isLoggedIn", false);
}

function showAlert(alertType, message, containerId, timeout) {
  var container = document.getElementById(containerId);
  container.innerHTML = "";
  var alertElement = document.createElement("div");
  alertElement.classList.add("alert", "mt-3", "text-center", "alert-sm");
  alertElement.classList.add("alert-" + alertType);
  alertElement.style.padding = "0.3rem";
  alertElement.textContent = message;
  container.appendChild(alertElement);
  setTimeout(function () {
    alertElement.style.display = "none";
  }, timeout);
}
