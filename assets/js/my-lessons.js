const lessonsContainer = document.getElementById("lessons_container");

function loadLessonDetails(lessonId) {
  localStorage.setItem("lessonID", lessonId);
  window.location.href = "lesson.html";
}

function convertToDateObject(dateString) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

async function fetchData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/getMyLessons?teacher_id=${localStorage.getItem(
        "userLoggedInID"
      )}`
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
            <a onclick="updateLesson('${lesson.ID}')" style="border-radius: 0px;color:#9C3030;margin:10px;"><i class="fas fa-pencil-alt"></i></a>
            <a onclick="deleteLesson('${lesson.ID}')"  style="border-radius: 0px;color:#9C3030;margin:10px;" onclick="deleteLesson('${lesson.ID}')"><i class="fa fa-trash"></i></a>
          </td>
        </tr>
      `
    )
    .join("")}
</tbody>
</table>
`;
    lessonsContainer.innerHTML += lessonHTML;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("lessons_container").textContent =
      "Error fetching data";
  }
}
fetchData();