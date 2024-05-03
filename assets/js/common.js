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

function showAlert(alertType, message) {
  window.scrollTo(0, 0);
  var container = document.getElementById('alertContainer');
  container.innerHTML = "";
  var content = document.createElement("span");
  content.style.display = "block";
  content.style.margin = "auto";
  content.style.fontWeight = "bold";
  content.style.fontSize = "15px"
  content.style.textAlign = "center";
  if (alertType === "danger") {
    content.style.color = "#ff4444";
    content.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> " + message;
  } else if (alertType === "success") {
    content.style.color = "#3EA66A";
    content.innerHTML = "<i class='bi bi-check2-circle'></i> " + message;
  }
  container.appendChild(content);
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