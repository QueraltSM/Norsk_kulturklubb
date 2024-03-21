var events = [];
fetch(`http://localhost:3000/api/getWords`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta del servidor.");
    }
    return response.json();
  })
  .then((words) => {
    words.Items.forEach((word, index) => {
      const fechaFormateada = word.date.split("/").reverse().join("-");
      events.push(fechaFormateada);
    });
    flatpickr("#calendar", {
      dateFormat: "d/m/Y",
      minDate: "today",
      disable: events.concat(["today"]).map(function (event) {
        return new Date(event);
      }),
    });
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });

function publishWord() {
  const word = document.getElementById("word").innerHTML.trim();
  const meaning = document.getElementById("meaning").innerHTML.trim();
  const calendar = document.getElementById("calendar").value;

  fetch("http://localhost:3000/api/uploadWord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: uuidv4(),
      word: word,
      meaning: meaning,
      date: calendar
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      showAlert("success", "Your word was submitted", "alertContainer", 3000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 3000);
    })
    .catch((error) => {
      showAlert(
        "danger",
        "An error occurred during uploading word",
        "alertContainer",
        5000
      );
    });
}
