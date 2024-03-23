const lessonContainer = document.getElementById("lesson_container");
var teacher_public_profile = false;

function getTeacher(id) {
  return fetch(`http://localhost:3000/api/getUser?id=${id}&table=Teachers`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta del servidor.");
      }
      return response.json();
    })
    .then((teacher) => {
      teacher_public_profile = teacher.public_profile;
      return teacher.name;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

function loadTeacherProfile(id) {
  if (teacher_public_profile) {
    localStorage.setItem('teacherID', id);
    window.location.href = 'teacher.html';
  }
}

async function fetchData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/getLesson?id=${localStorage.getItem(
        "lessonID"
      )}`
    );
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta del servidor.");
    }
    const lesson = await response.json();
    try {
      const teacherName = await getTeacher(lesson.teacher_id);
      const lessonHTML = `
          <div class="col-lg-12 col-md-6 d-flex align-items-stretch">
            <div class="course-item">
              <div class="course-content">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h4>${lesson.language_level}</h4>
                </div>
                <h3><a href="#" onclick="loadLessonDetails('${lesson.ID}')">${lesson.title}</a></h3>
                <p>${lesson.description}</p>
                <div class="trainer d-flex justify-content-between align-items-center">
                  <div class="trainer-profile d-flex align-items-center">
                    <span><a href="#" onclick="loadTeacherProfile('${lesson.teacher_id}')">${teacherName}</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
      lessonContainer.innerHTML += lessonHTML;
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("lessons_container").textContent =
      "Error fetching data";
  }
}
fetchData();