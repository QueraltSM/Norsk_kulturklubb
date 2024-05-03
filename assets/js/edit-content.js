var ID = localStorage.getItem("contentID");
var title = localStorage.getItem("contentTitle");
var type = localStorage.getItem("contentType").toLowerCase();

document.getElementById("div_"+type).style.display = "block";

function openDocumentModal(event) {
  event.preventDefault();
  var modal = document.getElementById("content_document_modal");
  modal.style.display = "block";
}

function openImageModal(event) {
  event.preventDefault();
  var modal = document.getElementById("content_image_modal");
  modal.style.display = "block";
}

function saveLesson() {
  var title = document.getElementById("lesson_title").innerHTML;
  var short_description = document.getElementById("lesson_short_description").innerHTML;
  var description = document.getElementById("lesson_description").innerHTML;
  var language_level = document.getElementById("lesson_language_level").value;
  if (!title || !short_description || description || language_level) {
    showAlert("danger" , "All fields must be completed");
  } else {
    alert("ok save!");
  }
}

async function fetchDataLesson() {
    try {
      const response = await fetch(
        `/api/getLesson?id=${ID}`
      );
      if (!response.ok) {
        throw new Error("Failed to get server response.");
      }
      const lesson = await response.json();
      document.getElementById("lesson_title").innerHTML = lesson.title;
      document.getElementById("lesson_short_description").innerHTML = lesson.short_description;
      document.getElementById("lesson_description").innerHTML = lesson.description;
      document.getElementById("content_image").src = lesson.header_image;
      document.getElementById("content_document").src = lesson.content_url;
      document.getElementById("lesson_language_level").value = lesson.language_level;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  if (type == "lessons") {
    fetchDataLesson();
  }