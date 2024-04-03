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
    flatpickr("#word_of_the_day_calendar", {
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
  const word = document.getElementById("word_of_the_day_word").innerHTML.trim();
  const meaning = document.getElementById("word_of_the_day_meaning").innerHTML.trim();
  const calendar = document.getElementById("word_of_the_day_calendar").value;
  if (word && meaning && calendar) {
    fetch("http://localhost:3000/api/uploadWord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: uuidv4(),
      word: word,
      meaning: meaning,
      date: calendar,
      teacher_id: localStorage.getItem("userLoggedInID"),
      pubdate: new Date().toLocaleString('en-US', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: false}).replace(',', '')
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
      showAlert("success", "The word of the day was submitted", "alertContainer", 3000);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 3000);
    })
    .catch((error) => {
      showAlert(
        "danger",
        "An error occurred during uploading",
        "alertContainer",
        5000
      );
    });
  } else {
    showAlert(
      "danger",
      "Please fill all fields before submitting",
      "alertContainer",
      5000
    );
  }
}

async function publishLesson() {
  var title = document.getElementById("lesson_title").innerHTML.trim();
  var shortDescription = document.getElementById("lesson_short_description").innerHTML.trim();
  var description = document.getElementById("lesson_description").innerHTML.trim();
  var languageLevel = document.getElementById("lesson_language_level").value;
  if (title && shortDescription && description && languageLevel) {
    try {
      var fileInput = document.getElementById("lesson_content_url");
      var file = fileInput.files[0];
      if (!file) {
        showAlert("danger", "No file selected", "alertContainer", 3000);
        return "";
      }
      var formData = new FormData();
      formData.append("file", file);
      var filename = uuidv4() + "." + file.name.split('.').pop(); // Generamos un nombre único
      const response = await fetch(
        `http://localhost:3000/api/uploadFileLesson?filename=${encodeURIComponent(
          filename
        )}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const data = await response.json();
      fetch("http://localhost:3000/api/uploadLesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: uuidv4(),
          title: title,
          short_description: shortDescription,
          description: description,
          language_level: languageLevel,
          content_url: data.fileUrl,
          teacher_id: localStorage.getItem("userLoggedInID"),
          pubdate: new Date().toLocaleString('en-US', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: false}).replace(',', '')
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
          showAlert("success", "The lesson was submitted", "alertContainer", 3000);
          setTimeout(() => {
            window.location.href = "/lessons.html";
          }, 3000);
        })
        .catch((error) => {
          showAlert(
            "danger",
            "An error occurred during uploading",
            "alertContainer",
            5000
          );
        });
    } catch (error) {
      showAlert("danger", "Failed to upload file", "alertContainer", 3000);
      return "";
    }
  } else {
    showAlert("danger", "Please fill all fields before submitting", "alertContainer", 3000);
  }
}

function publishEvent() {
  const title = document.getElementById("title_event").innerHTML.trim();
  const short_description = document.getElementById("event_short_description").innerHTML.trim();
  const description = document.getElementById("event_description").innerHTML.trim();
  const platform_url = document.getElementById("event_platform_url").innerHTML.trim();
  const calendar = document.getElementById("event_calendar").value;

  if (title && short_description && description && platform_url && calendar) {
    fetch("http://localhost:3000/api/uploadEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: uuidv4(),
      title: title,
      short_description: short_description,
      description: description,
      platform_url: platform_url,
      date: calendar,
      teacher_id: localStorage.getItem("userLoggedInID"),
      pubdate: new Date().toLocaleString('en-US', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit', hour12: false}).replace(',', '')
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
      showAlert("success", "Event was submitted", "alertContainer", 3000);
      setTimeout(() => {
        window.location.href = "/events.html";
      }, 3000);
    })
    .catch((error) => {
      showAlert(
        "danger",
        "An error occurred during uploading",
        "alertContainer",
        5000
      );
    });
  } else {
    showAlert(
      "danger",
      "Please fill all fields before submitting",
      "alertContainer",
      5000
    );
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var filterItems = document.querySelectorAll('#contributions-flters li');
  filterItems.forEach(function (item) {
      item.addEventListener('click', function () {
          filterItems.forEach(function (filterItem) {
              filterItem.classList.remove('filter-active');
          });
          item.classList.add('filter-active');
          var filter = item.getAttribute('data-filter').substring(1);
          var contributionsItems = document.querySelectorAll('.contributions-item');
          contributionsItems.forEach(function (contributionItem) {
              if (contributionItem.classList.contains(filter)) {
                  contributionItem.style.display = 'block';
                  if (filter == "events") {
                    flatpickr("#event_calendar", {
                      dateFormat: "d/m/Y",
                      minDate: "today"
                    });
                  }
              } else {
                  contributionItem.style.display = 'none';
              }
          });
      });
  });
});