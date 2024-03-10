var loginBtn = document.getElementById("loginBtn");
var handleUserMenuLink = document.getElementById("handleUserMenuLink");
var welcomeUser = document.getElementById("welcomeUser");
var isLoggedIn = localStorage.getItem("isLoggedIn");
var preview_lessons = document.getElementById("preview_lessons");
var preview_teachers = document.getElementById("preview_teachers");
var preview_events = document.getElementById("preview_events");
var lessons = document.getElementById("lessons");
var teachers = document.getElementById("teachers");
var events = document.getElementById("events");

if (isLoggedIn == "true") {
  welcomeUser.innerHTML = localStorage.getItem("welcomeUser");
  handleUserMenuLink.style.display = "block";
  lessons.style.display = "block";
  teachers.style.display = "block";
  events.style.display = "block";
} else {
  loginBtn.style.display = "block";
  preview_lessons.style.display = "block";
  preview_teachers.style.display = "block";
  preview_events.style.display = "block";
}

function logout() {
  handleUserMenuLink.style.display = "none";
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
