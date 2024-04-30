if (localStorage.getItem("isLoggedIn") == "true") {

  const roleDisplayOptions = {
    "Teacher": { "createWordOfDay": "block", "makeContribution": "block", "myContributions": "block" },
    "Student": { "createWordOfDay": "none", "makeContribution": "none", "myContributions": "none" },
    "Collaborator": { "createWordOfDay": "none", "makeContribution": "block", "myContributions": "block" }
  };
  for (const option in roleDisplayOptions[localStorage.getItem("userLoggedInRole")]) {
    const element = document.getElementById(option);
    if (element) {
      element.style.display = roleDisplayOptions[localStorage.getItem("userLoggedInRole")][option];
    }
  }

  document.getElementById("welcomeUser").innerHTML = "Hallo " + localStorage.getItem("user_first_name");
  document.getElementById("handleUserMenuLink").style.display = "block";
} else {
  document.getElementById("loginBtn").style.display = "block";
  const previewElements = ["preview_teachers", "preview_lessons", "preview_events"];
  const normalElements = ["teachers", "lessons", "events"];
  
  for (const elementId of previewElements) {
    const element = document.getElementById(elementId);
    if (element != null) {
      element.style.display = "flex";
    }
  }
  for (const elementId of normalElements) {
    const element = document.getElementById(elementId);
    if (element != null) {
      element.style.display = "none";
    }
  }
}

function logout() {
  document.getElementById("handleUserMenuLink").style.display = "none";
  document.getElementById("loginBtn").style.display = "block";
  localStorage.setItem("isLoggedIn", false);
  window.location.href = "/login.html";
}

function showAlert(alertType, message, containerId, timeout) {
  window.scrollTo(0, 0);
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

function showAlert(alertType, message, containerId, timeout) {
  window.scrollTo(0, 0);
  var container = document.getElementById(containerId);
  container.innerHTML = "";

  var alertElement = document.createElement("div");
  alertElement.classList.add("alert", "alert-dismissible", "fade", "show");
  alertElement.classList.add("alert-" + alertType);
  alertElement.role = "alert";

  var closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("data-bs-dismiss", "alert");
  closeButton.setAttribute("aria-label", "Close");

  var messageElement = document.createElement("p");
  messageElement.textContent = message;

  alertElement.appendChild(messageElement);
  alertElement.appendChild(closeButton);
  container.appendChild(alertElement);

  setTimeout(function () {
    alertElement.classList.remove("show");
    setTimeout(function () {
      alertElement.remove();
    }, 300);
  }, timeout);
}

function limitTextarea(element, maxLength) {
  if (element.textContent.length > maxLength) {
      element.textContent = element.textContent.slice(0, maxLength);
  }
}

function cleanPaste(event, element) {
  alert("clean")
  event.preventDefault();
  var pastedText = (event.originalEvent || event).clipboardData.getData('text/plain');
  var cleanedText = pastedText.replace(/<[^>]+>/g, '');
  document.execCommand("insertHTML", false, cleanedText);
}