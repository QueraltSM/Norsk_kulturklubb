const lessonsContainer = document.getElementById("lessons_container");

function getTeacher(id) {
    return fetch(`http://localhost:3000/api/getUser?id=${id}&table=Teachers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to get server response.");
        }
        return response.json();
      })
      .then((teacher) => {
        return teacher.name;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  }

  function loadLessonDetails(lessonId) {
    localStorage.setItem('lessonID', lessonId);
    window.location.href = 'lesson.html';
  }

  async function fetchData() {
    try {
      const response = await fetch("http://localhost:3000/api/getLessons");
      if (!response.ok) {
        throw new Error("Failed to get server response.");
      }
      const data = await response.json();
  
      for (const lesson of data.Items) {
        try {
          const teacherName = await getTeacher(lesson.teacher_id);
          const lessonHTML = `
            <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
              <div class="course-item">
                <div class="course-content">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4>${lesson.language_level}</h4>
                  </div>
                  <h3><a href="#" onclick="loadLessonDetails('${lesson.ID}')">${lesson.title}</a></h3>
                  <p>${lesson.short_description}</p>
                </div>
              </div>
            </div>`;
          lessonsContainer.innerHTML += lessonHTML;
        } catch (error) {
          console.error('Error:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      document.getElementById("lessons_container").textContent = "Error fetching data";
    }
  }  

fetchData();