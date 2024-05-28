if (localStorage.getItem("isLoggedIn") == "false") {
  window.location.href = "/Lessons";
}

const lessonContainer = document.getElementById("lesson_container");
var url = new URL(window.location.href).pathname.split("/")[2];

async function fetchData() {
  try {
    const response = await fetch(
      "/api/getFromURL?url_link=" + url + "&table=Lessons"
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const lesson = await response.json();
    try {
      document.getElementById("lesson_level").innerHTML = lesson.language_level;
      document.getElementById("lesson_title").innerHTML = lesson.title;
      const lessonHTML = `
      <div class="row">
        <div class="col-12">
          <div id="lesson_content_wrapper" class="lesson-content">
            <iframe id="lesson_description" style='text-align:justify; width:100%; height:100%; overflow:hidden;'></iframe><br>
            <div class="lesson-container">
              <a href="#" id="practice_lesson" class="get-started-btn">Let's practice <i class="bx bx-chevron-right"></i></a>
            </div>
          </div>
        </div>
      </div><div class="course-item"></div>`;
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
      document.getElementById("practice_lesson").href = lesson.content_url;
      getUser(lesson.teacher_id).then((user) => {
        const userDetailsSection = document.createElement("div");
        userDetailsSection.style.paddingTop = "100px";
        userDetailsSection.classList.add("user-details");
        const contentContainer = document.createElement("div");
        contentContainer.style.display = "flex";
        contentContainer.style.alignItems = "center";
        contentContainer.style.gap = "50px";
        const textContainer = document.createElement("div");
        const authorTitle = document.createElement("h3");
        authorTitle.style.color = "#9C3030";
        authorTitle.textContent = "Teacher " + user.full_name;
        const authorText = document.createElement("p");
        authorText.classList.add("card-text");
        authorText.style.textAlign = "justify";
        authorText.style.fontSize = "13px";
        textContainer.appendChild(authorTitle);
        const profileImage = document.createElement("img");
        profileImage.src = user.profile_picture;
        profileImage.style.display = "block";
        profileImage.style.width = "400px";
        profileImage.style.height = "350px";
        profileImage.style.objectFit = "cover";
        profileImage.style.margin = "0 auto";
        profileImage.style.borderRadius = "10px";
        textContainer.appendChild(profileImage);
        const introText = document.createElement("p");
        introText.classList.add("card-text");
        introText.style.textAlign = "center";
        introText.style.fontSize = "13px";
        const about_meText = document.createElement("p");
        about_meText.classList.add("card-text");
        about_meText.style.textAlign = "justify";
        about_meText.style.fontSize = "13px";
        about_meText.innerHTML = `<br><strong>About me<br></strong>${user.about_me}`;
        introText.innerHTML = `<br><strong>${user.full_name} is a teacher in Norsk Kulturklubb</strong>`;
        const button = document.createElement("a");
        button.href = "/Teachers/" + user.url_link;
        button.innerHTML = "View profile <i class='bx bx-chevron-right'></i>";
        button.style.fontWeight = "bold";
        button.style.float = "right";
        textContainer.appendChild(introText);
        textContainer.appendChild(about_meText);
        textContainer.appendChild(button);
        textContainer.appendChild(authorText);
        contentContainer.appendChild(textContainer);
        userDetailsSection.appendChild(contentContainer);
        const eventContainer = document.createElement("div");
        eventContainer.classList.add("col-lg-12");
        eventContainer.appendChild(userDetailsSection);
        document
          .querySelector(".course-item")
          .parentNode.appendChild(eventContainer);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    window.location.href = "/404.html";
  }
}
fetchData();
