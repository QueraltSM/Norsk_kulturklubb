const loginBtn = document.getElementById('loginBtn');
const isLoggedIn = localStorage.getItem('isLoggedIn');

const lessonsLink = document.getElementById('lessonsLink');
const teachersLink = document.getElementById('teachersLink');
const translatorLink = document.getElementById('translatorLink');
const eventsLink = document.getElementById('eventsLink');

if (isLoggedIn=="true") {
  loginBtn.textContent = 'Logout';
  setHeaderButtons("block");
} else {
  setHeaderButtons("none");
}

loginBtn.addEventListener('click', function () {
  if (isLoggedIn) {
    localStorage.setItem('isLoggedIn', false);
    setHeaderButtons("none");
  }
});

function setHeaderButtons(state) {
  lessonsLink.style.display = state;
  teachersLink.style.display = state;
  translatorLink.style.display = state;
  eventsLink.style.display = state;
}

function showAlert(alertType, message, containerId, timeout) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';
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