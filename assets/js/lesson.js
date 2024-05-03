const lessonContainer = document.getElementById("lesson_container");
var teacher_public_profile = false;

function getTeacher(id) {
  return fetch(`/api/getUser?id=${id}&table=Users`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get server response.");
      }
      return response.json();
    })
    .then((teacher) => {
      teacher_public_profile = teacher.public_profile;
      return teacher.first_name;
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
      `/api/getLesson?id=${localStorage.getItem("contentID")}`
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const lesson = await response.json();
    try {
      const teacherName = "Lesson published by" + await getTeacher(lesson.teacher_id);
      const lessonHTML = `
          <div class="col-lg-12">
            <div class="course-item">
              <div class="lesson-content">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h4>${lesson.language_level}</h4>
                </div>
                <h3><a href="#" onclick="loadLesson('${lesson.ID}')">${lesson.title}</a></h3>
                <p>${lesson.description}</p>
                <video controls style="display:none" id="video_container" style="width:100%">
                  <source id="video_url" type="video/mp4">
                </video>
                <iframe id="iframe_container" style="display:none" width="100%" height="842px" frameborder="0"></iframe>
                <div class="trainer d-flex justify-content-between align-items-center">
                  <div class="trainer-profile d-flex align-items-center">
                    <span><a href="#" onclick="loadTeacherProfile('${lesson.teacher_id}')">${teacherName}</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
      lessonContainer.innerHTML += lessonHTML;
      const contentType = lesson.content_url.split('.').pop();
      if (contentType == "mp4") {
        document.getElementById("video_url").src = lesson.content_url;
        document.getElementById("video_container").style.display = "block";
      } else {
        document.getElementById("iframe_container").src = "https://docs.google.com/viewer?url=" + lesson.content_url + "&embedded=true";
        document.getElementById("iframe_container").style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
fetchData();