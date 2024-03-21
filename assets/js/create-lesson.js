var userLoggedInID = localStorage.getItem("userLoggedInID");

async function publishLesson() {
  alert(123);
   
  try {
    var fileData = document.getElementById("content_url").value;

    alert(fileData);

    var blob = dataURItoBlob(fileData);

    var uploadedFile = new File([blob], "content_url", {
        type: "application/octet-stream",
    });

    alert(uploadedFile);

    // Crear un FormData y agregar el archivo
    var formData = new FormData();

    alert(456);

    formData.append("file", uploadedFile);

    alert("jajajajaj");

    // Nombre del archivo
    var filename = uuidv4() + "." + fileData.split(":")[1].split(";")[0].split("/")[1];

    alert(filename)

    // Enviar la solicitud al servidor para cargar el archivo
    const response = await fetch(
        `http://localhost:3000/api/uploadFileLesson?filename=${encodeURIComponent(filename)}`, {
            method: "POST",
            body: formData,
        }
    );

    // Verificar si la carga fue exitosa
    if (!response.ok) {
        throw new Error("Failed to upload file");
    }

    // Obtener la URL del archivo cargado
    const data = await response.json();
    alert("subido:"+data.fileUrl);

    return data.fileUrl;
} catch (error) {
    // Manejar errores de carga
    showAlert("danger", "Failed to upload file", "alertContainer", 3000);
    return "";
}

}

function uploadLesson() {
  const title = document.getElementById("title").innerHTML.trim();
  const description = document.getElementById("description").innerHTML.trim();
  const content_url = document.getElementById("content_url").value;
  const languageLevel = document.getElementById("languageLevel").value;

  fetch("http://localhost:3000/api/uploadLesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: uuidv4(),
      title: title,
      description: description,
      languageLevel: languageLevel
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
