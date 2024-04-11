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

function limitTextarea(element, maxLength) {
  if (element.textContent.length > maxLength) {
      element.textContent = element.textContent.slice(0, maxLength);
  }
}

function formatText(command, id) {
  var textarea = document.getElementById(id);
  if (command === "bold") {
      toggleStyle(textarea, "fontWeight", "bold");
  } else if (command === "italic") {
      toggleStyle(textarea, "fontStyle", "italic");
  } else if (command === "underline") {
      toggleStyle(textarea, "textDecoration", "underline");
  } else if (command === "alignLeft") {
      toggleTextAlign(textarea, "left");
  } else if (command === "alignCenter") {
      toggleTextAlign(textarea, "center");
  } else if (command === "alignRight") {
      toggleTextAlign(textarea, "right");
  } else if (command === "justify") {
      toggleTextAlign(textarea, "justify");
  }
}

function toggleStyle(element, styleName, styleValue) {
  // Obtiene el inicio y el fin de la selección en el textarea
  var selectionStart = element.selectionStart;
  var selectionEnd = element.selectionEnd;

  // Obtiene el texto antes y después de la selección
  var textBeforeSelection = element.value.substring(0, selectionStart);
  var selectedText = element.value.substring(selectionStart, selectionEnd);
  var textAfterSelection = element.value.substring(selectionEnd);

  // Aplica el estilo al texto seleccionado
  var styledText = `<${styleName}>${selectedText}</${styleName}>`;

  // Construye el nuevo contenido del textarea
  var newContent = textBeforeSelection + styledText + textAfterSelection;

  // Establece el nuevo contenido en el textarea
  element.value = newContent;

  // Mueve el cursor al final del texto estilizado
  var newCursorPosition = textBeforeSelection.length + styledText.length;
  element.setSelectionRange(newCursorPosition, newCursorPosition);
}


function toggleTextAlign(element, alignment) {
  if (element.style.textAlign === alignment) {
      element.style.textAlign = "left";
  } else {
      element.style.textAlign = alignment;
  }
}