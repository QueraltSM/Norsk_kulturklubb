if (localStorage.getItem("isLoggedIn") == "false") {
  window.location.href = "/Lessons";
}

const lessonContainer = document.getElementById("lesson_container");
var url = new URL(window.location.href).pathname.split('/')[2];

async function fetchData() {
  try {
    const response = await fetch("/api/getFromURL?url_link="+url+"&table=Lessons");
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const lesson = await response.json();
    try {
      document.getElementById("lesson_level").innerHTML = lesson.language_level;
      document.getElementById("lesson_title").innerHTML = lesson.title;
      const lessonHTML = `
      <div class="col-lg-12">
        <div class="course-item">
          <div id="lesson_content_wrapper" class="lesson-content">
            <iframe id="lesson_description" style='text-align:justify; width:100%; height:100%; overflow:hidden;'></iframe>
            <div class="lesson-container">
              <a href="#" target="_blank" id="practice_lesson" class="get-started-btn">Let's practice <i class="bx bx-chevron-right"></i></a>
            </div>
          </div>
        </div>
      </div>`;
      getUser(lesson.teacher_id).then((user) => {
        const userDetailsSection = document.createElement("div");
        userDetailsSection.classList.add("user-details");
        const authorTitle = document.createElement("h3");
        authorTitle.textContent = "Learn with " + user.full_name;
        authorTitle.style.color = "#9C3030";
        const authorText = document.createElement("p");
        authorText.classList.add("card-text");
        authorText.innerHTML = user.about_me;
        authorText.style.textAlign = "justify";
        authorText.style.fontSize = "13px";
        userDetailsSection.appendChild(authorTitle);
        userDetailsSection.appendChild(authorText);
        const button = document.createElement("a");
        button.href = "/Teachers/" + user.url_link;
        button.innerHTML = "About me <i class='bx bx-chevron-right'></i>";
        button.style.fontWeight = "bold";
        button.style.float = "right";
        userDetailsSection.appendChild(button);
        const lessonContainer = document.createElement("div");
        lessonContainer.classList.add("col-lg-12");
        lessonContainer.appendChild(userDetailsSection);
        document
          .querySelector(".course-item")
          .parentNode.appendChild(lessonContainer);
      });
      lessonContainer.innerHTML += lessonHTML;
      document.getElementById("lesson_description").srcdoc = lesson.description;
      const lessonDescription = document.getElementById("lesson_description");
      const lessonContentWrapper = document.getElementById(
        "lesson_content_wrapper"
      );
      lessonDescription.addEventListener("load", () => {
        const iframeHeight =
          lessonDescription.contentWindow.document.body.scrollHeight;
          var height = iframeHeight + 100;
        lessonContentWrapper.style.height = `${height}px`;
      });
      document.getElementById("practice_lesson").href = "/Lessons/Practice/" + url;
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    window.location.href = "/404.html";
  }
}
fetchData();
