var ID = JSON.parse(localStorage.getItem("contentData")).ID;
var type = localStorage.getItem("contentType");

document.getElementById("div_" + type.toLocaleLowerCase()).style.display = "block";

function handleDocumentViewer() {
  var document_container = document.getElementById("document_container");
  if (document_container.style.display == "none") {
    document_container.style.display = "block";
    document.getElementById("document_label").innerHTML = "Close document";
  } else {
    document_container.style.display = "none";
    document.getElementById("document_label").innerHTML =
      "View current document";
  }
}

function handleImageViewer() {
  const image = document.getElementById("content_image");
  if (image.style.display == "none") {
    image.style.display = "block";
    document.getElementById("image_label").innerHTML = "Close image";
  } else {
    image.style.display = "none";
    document.getElementById("image_label").innerHTML = "View image";
  }
}

async function updateLesson() {
  var title = document.getElementById("lesson_title").innerHTML;
  var short_description = document.getElementById(
    "lesson_short_description"
  ).innerHTML;
  var description = document.getElementById("lesson_description").innerHTML;
  var language_level = document.getElementById("lesson_language_level").value;
  var lesson_image = document.getElementById("lesson_image").files[0];
  var image_url = document.getElementById("content_image").src;
  var lesson_content_url = document.getElementById("lesson_content_url").files[0];
  var content_url = localStorage.getItem("lesson_content_url");
  if (!title || !short_description || !description || !language_level) {
    showAlert("danger", "All fields must be completed to update");
  } else {
    if (lesson_content_url) {
      var formData = new FormData();
      formData.append("file", lesson_content_url);
      var filename = localStorage.getItem("contentURL") + "." + lesson_content_url.name.match(/\.([^.]+)$/)[1];
      const response = await fetch(`/api/updateFile?key=Lessons&filename=${filename}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      } else {
        const responseData = await response.json();
        content_url = responseData.fileUrl;
      }
    }
    if (lesson_image) {
      var formData = new FormData();
      formData.append("image", lesson_image);
      url = document.getElementById("content_image").src;
      var filename = url.substring(url.lastIndexOf("/") + 1);
      const response = await fetch(`/api/updateImage?key=Lesson-Images&filename=${filename}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      } else {
        const responseData = await response.json();
        image_url =  responseData.imageUrl;
      }
    }
    const response = await fetch(`/api/updateContent?table=Lessons&ID=` + ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        short_description: short_description,
        description: description,
        language_level: language_level,
        image_url: image_url,
        content_url: content_url,
      }),
    });
    if (!response.ok) {
      throw new Error("There was an error");
    } else {
      showAlert("success", "Lesson was updated");
    }
    fetchData();
    location.reload();
  }
}

async function updateWord() {
  var title = document.getElementById("word_title").innerHTML;
  var meaning = document.getElementById("word_meaning").innerHTML;
  var display_date = document.getElementById("word_date").value;
  if (title && meaning && display_date) {
    const response = await fetch(`/api/updateContent?table=Words&ID=` + ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        meaning: meaning,
        display_date: display_date
      }),
    });
    if (!response.ok) {
      throw new Error("There was an error");
    } else {
      showAlert("success", "Word was updated");
    }
  } else {
    showAlert("danger", "All fields must be completed to update");
  }
}

async function fetchData() {
  try {
    const response = await fetch("/api/getContent?id="+ID+"&table="+type);
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const data = await response.json();
    if (type=="Words") {
      document.getElementById("word_title").innerHTML = data.title;
      document.getElementById("word_meaning").innerHTML = data.meaning;
      document.getElementById("word_date").value = data.display_date;
    } else if (type=="Lessons") {
      document.getElementById("lesson_title").innerHTML = data.title;
      document.getElementById("lesson_short_description").innerHTML =
      data.short_description;
      document.getElementById("lesson_description").innerHTML =
      data.description;
      document.getElementById("content_image").src = data.image_url;
      document.getElementById("lesson_language_level").value =
      data.language_level;
      var content_url = data.content_url;
      localStorage.setItem("lesson_content_url", data.content_url);
      localStorage.setItem("contentURL", content_url.substring(content_url.lastIndexOf('/') + 1, content_url.lastIndexOf('.')));
      const contentType = data.content_url.split(".").pop();
      if (contentType == "mp4") {
        document.getElementById("video_url").src = data.content_url;
        document.getElementById("video_container").style.display = "block";
      } else {
        document.getElementById("iframe_container").src = "https://docs.google.com/viewer?url=" +data.content_url +"&embedded=true";
        document.getElementById("iframe_container").style.display = "block";
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


fetchData();
flatpickr("#word_date", {
  dateFormat: "d/m/Y",
  minDate: "today",
});