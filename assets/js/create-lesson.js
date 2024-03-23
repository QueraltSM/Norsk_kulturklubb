async function publish() {
  try {

    var fileInput = document.getElementById("content_url");
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
    uploadLesson(data.fileUrl);

  } catch (error) {
    showAlert("danger", "Failed to upload file", "alertContainer", 3000);
    return "";
  }
}

function uploadLesson(content_url) {
  fetch("http://localhost:3000/api/uploadLesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: uuidv4(),
      title: document.getElementById("title").innerHTML.trim(),
      short_description: document.getElementById("short_description").innerHTML.trim(),
      description: document.getElementById("description").innerHTML.trim(),
      language_level: document.getElementById("language_level").value,
      content_url: content_url,
      teacher_id: localStorage.getItem("userLoggedInID"),
      pubdate: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '')
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
      showAlert("success", "Your lesson was submitted", "alertContainer", 3000);
      setTimeout(() => {
        window.location.href = "/lessons.html";
      }, 3000);
    })
    .catch((error) => {
      showAlert(
        "danger",
        "An error occurred during uploading lesson",
        "alertContainer",
        5000
      );
    });
}
