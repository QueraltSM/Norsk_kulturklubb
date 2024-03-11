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
  if (teachers != null) teachers.style.display = "block";
  events.style.display = "block";
  preview_lessons.style.display = "none";
  if (preview_events!= null) preview_teachers.style.display = "none";
  preview_events.style.display = "none";
} else {
  loginBtn.style.display = "block";
  lessons.style.display = "none";
  if (teachers != null) teachers.style.display = "none";
  events.style.display = "none";
  preview_lessons.style.display = "block";
  if (preview_events!= null) preview_teachers.style.display = "block";
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
