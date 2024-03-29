const words_container = document.getElementById("words_container");
const lessons_container = document.getElementById("lessons_container");
const posts_container = document.getElementById("posts_container");
const events_container = document.getElementById("events_container");

fetchDataWords();

$('#contributions-flters li').click(function () {
  var filter = $(this).attr('data-filter');
  if (filter == ".words") {
    fetchDataWords();
  } else if (filter == ".lessons") {
    fetchDataLessons();
  } else if (filter == ".posts") {
    fetchDataCulture();
  }
  // events
  $('.contributions-item').hide();
  $(filter).show();
  $('#contributions-flters li').removeClass('filter-active');
  $(this).addClass('filter-active');
});


function loadLessonDetails(lessonId) {
  localStorage.setItem("lessonID", lessonId);
  window.location.href = "lesson.html";
}

function deleteLesson() {
  alert("ID->" + localStorage.getItem(
    "selectedLessonID"
  ));

  alert("CONTENT->" + localStorage.getItem(
    "selectedLessonContentUrl"
  ));

  fetch(
    'http://localhost:3000/api/deleteLesson',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: localStorage.getItem("selectedLessonID"),
        content_url: localStorage.getItem("selectedLessonContentUrl")
      })
    }
  ).then((response) => {
    if (response.status === 200) {
      showAlert(
        "success",
        "Your lesson was removed sucessfully",
        "alertContainer",
        3000
      );
      setTimeout(() => {
        window.location.href = "/my-contributions.html";
      }, 3000);
    } else if (response.status === 500) {
      showAlert(
        "danger",
        "An issue occurred while deleting the lesson",
        "alertContainer",
        5000
      );
    }
  });
}

function askDelete(params) {
  const [lessonID, contentURL] = params.split(':::');
  localStorage.setItem("selectedLessonID", lessonID);
  localStorage.setItem("selectedLessonContentUrl", contentURL.substring(contentURL.lastIndexOf('/') + 1));
  $("#confirmDeleteModal").modal("show");
}

function convertToDateObject(dateString) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

async function fetchDataWords() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/getMyContributions?user_id=${localStorage.getItem(
        "userLoggedInID"
      )}&table=Words`
    );
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta del servidor.");
    }
    const data = await response.json();
    words = data.Items;
    words.sort((a, b) => {
      const dateA = new Date(convertToDateObject(a.date));
      const dateB = new Date(convertToDateObject(b.date));
      return dateB - dateA;
    });

    const wordsHTML = `
<table class="lessons-table">
<thead>
  <tr>
    <th>Publication date</th>
    <th>Word</th>
    <th></th>
  </tr>
</thead>
<tbody>
  ${words
    .map(
      (w) => `
        <tr>
          <td>${w.date}</td>
          <td>${w.word}</td>
          <td style="text-align: center;">
            <a style="border-radius: 0px;color:#9C3030;margin:10px;" title="Edit"><i class="fas fa-pencil-alt"></i></a>
            <a href="#" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Delete"><i class="fa fa-trash"></i></a>

          </td>
        </tr>
      `
    )
    .join("")}
</tbody>
</table>
`;
    words_container.innerHTML = wordsHTML;
  } catch (error) {
    document.getElementById("words_container").textContent =
      "Error fetching data";
  }
}


async function fetchDataLessons() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/getMyContributions?user_id=${localStorage.getItem(
        "userLoggedInID"
      )}&table=Lessons`
    );
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta del servidor.");
    }
    const data = await response.json();
    lessons = data.Items;

    lessons.sort((a, b) => {
      const dateA = new Date(convertToDateObject(a.pubdate));
      const dateB = new Date(convertToDateObject(b.pubdate));

      return dateB - dateA;
    });

    const lessonHTML = `
<table class="lessons-table">
<thead>
  <tr>
    <th>Publication date</th>
    <th>Language level</th>
    <th>Lesson's title</th>
    <th></th>
  </tr>
</thead>
<tbody>
  ${lessons
    .map(
      (lesson) => `
        <tr>
          <td>${lesson.pubdate}</td>
          <td>${lesson.language_level}</td>
          <td>${lesson.title}</td>
          <td style="text-align: center;">
            <a onclick="updateLesson('${
              lesson.ID
            }')" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Edit"><i class="fas fa-pencil-alt"></i></a>
            <a href="#" onclick="askDelete('${lesson.ID}:::${lesson.content_url}')" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Delete"><i class="fa fa-trash"></i></a>

          </td>
        </tr>
      `
    )
    .join("")}
</tbody>
</table>
`;
    lessons_container.innerHTML = lessonHTML;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("lessons_container").textContent =
      "Error fetching data";
  }
}

async function fetchDataCulture() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/getMyContributions?user_id=${localStorage.getItem(
        "userLoggedInID"
      )}&table=Culture`
    );
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta del servidor.");
    }
    const data = await response.json();
    posts = data.Items;
    posts.sort((a, b) => {
      const dateA = new Date(convertToDateObject(a.date));
      const dateB = new Date(convertToDateObject(b.date));
      return dateB - dateA;
    });
    const postsHTML = `
<table class="lessons-table">
<thead>
  <tr>
    <th>Publication date</th>
    <th>Title</th>
    <th></th>
  </tr>
</thead>
<tbody>
  ${posts
    .map(
      (w) => `
        <tr>
          <td>${w.date}</td>
          <td>${w.title}</td>
          <td style="text-align: center;">
            <a style="border-radius: 0px;color:#9C3030;margin:10px;" title="Edit"><i class="fas fa-pencil-alt"></i></a>
            <a href="#" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Delete"><i class="fa fa-trash"></i></a>

          </td>
        </tr>
      `
    )
    .join("")}
</tbody>
</table>
`;
    posts_container.innerHTML = postsHTML;
  } catch (error) {
    document.getElementById("posts_container").textContent =
      "Error fetching data";
  }
}


