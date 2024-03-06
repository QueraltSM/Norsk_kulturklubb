function showAlert(alertType, message, containerId, timeout) {
    var container = document.getElementById(containerId);
    if (!container) {
      console.error("No se pudo encontrar el contenedor con el ID especificado.");
      return;
    }
    container.innerHTML = '';
    var alertElement = document.createElement("div");
    alertElement.classList.add("alert", "mt-3", "text-center", "alert-sm");
    alertElement.classList.add("alert-" + alertType); // Añadir la clase de tipo de alerta
    alertElement.style.padding = "0.3rem";
    alertElement.textContent = message;
    container.appendChild(alertElement);
    setTimeout(function () {
      alertElement.style.display = "none";
    }, timeout);
  }