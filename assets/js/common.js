var isLoggedIn = localStorage.getItem("isLoggedIn");
if (isLoggedIn == "true") {
  document.getElementById("welcomeUser").innerHTML = localStorage.getItem("welcomeUser");
  document.getElementById("handleUserMenuLink").style.display = "block";
  if (document.getElementById("preview_teachers") != null) document.getElementById("preview_teachers").style.display = "none";
  if (document.getElementById("teachers") != null) document.getElementById("teachers").style.display = "block";
  if (document.getElementById("preview_lessons") != null) document.getElementById("preview_lessons").style.display = "none";
  if (document.getElementById("lessons") != null ) document.getElementById("lessons").style.display = "block";
  if (document.getElementById("preview_events") != null) document.getElementById("preview_events").style.display = "none";
  if (document.getElementById("events")  != null ) document.getElementById("events").style.display = "block";

} else {
  document.getElementById("loginBtn").style.display = "block";
  if (document.getElementById("preview_teachers") != null) document.getElementById("preview_teachers").style.display = "flex";
  if (document.getElementById("teachers") != null) document.getElementById("teachers").style.display = "none";
  if (document.getElementById("preview_lessons") != null) document.getElementById("preview_lessons").style.display = "flex";
  if (document.getElementById("lessons") != null ) document.getElementById("lessons").style.display = "none";
  if (document.getElementById("preview_events") != null) document.getElementById("preview_events").style.display = "flex";
  if (document.getElementById("events")  != null ) document.getElementById("events").style.display = "none";
}

function logout() {
  document.getElementById("handleUserMenuLink").style.display = "none";
  document.getElementById("loginBtn").style.display = "block";
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
