const lessonsContainer = document.getElementById("lessons_container");

  function loadLessonDetails(lessonId) {
    localStorage.setItem('lessonID', lessonId);
    window.location.href = 'lesson.html';
  }

async function fetchData() {
  const lessonsContainer = document.getElementById("lessons_container");
  try {
    const response = await fetch("http://localhost:3000/api/getLessons");
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const data = await response.json();

    for (const lesson of data.Items) {
      try {
        const lessonHTML = `
          <div class="col-lg-4" style="padding-bottom:10px;">
            <a href="#" onclick="loadLessonDetails('${lesson.ID}')" style="text-decoration: none; color: inherit;">
              <div class="course-item" style="border: none; cursor: pointer; background-color: #f9f9f9; border-radius: 10px; overflow: hidden;">
                <div class="course-img" style="height: 200px; overflow: hidden;">
                  <img src="${lesson.header_image}" class="img-fluid" alt="Lesson Image" style="object-fit: cover; height: 100%; width: 100%;">
                </div>
                <div class="course-content" style="text-align: center; padding: 20px;">
                  <h4 style="margin-bottom: 10px;">${lesson.language_level}</h4>
                  <h3 style="margin-bottom: 10px;">${lesson.title}</h3>
                  <p style="margin-bottom: 0; word-wrap: break-word;">${lesson.short_description}</p>
                </div>
              </div>
            </a>
          </div>
        `;
        lessonsContainer.innerHTML += lessonHTML;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    lessonsContainer.textContent = "Error fetching data";
  }
}

fetchData();