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
            <iframe id="lesson_description" style='width:100%; height:100%; overflow:hidden;'></iframe><br>
            <div class="lesson-container">
              <a href="#" id="practice_lesson" class="get-started-btn"><i class="bi bi-book" style="font-size: 13px;"></i>&nbsp;&nbsp;Let's practice<i class="bx bx-chevron-right"></i></a>
            </div>
          </div>
        </div>
        <p class="event-p"><i class="bi bi-person" style="font-size: 13px;"></i>&nbsp; Created by <span class="event-description" id="username"></span></p>
        <p class="event-p"><i class="bi bi-calendar4-event" style="font-size: 13px;"></i>&nbsp; Posted on <span class="event-description">${formatEvent(lesson.pubdate)}</span></p>
        </div><div class="course-item"></div>`;
      lessonContainer.innerHTML += lessonHTML;
      const lessonDescription = document.getElementById("lesson_description");
      lessonDescription.srcdoc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lesson Description</title>
          <style>
            html, body {
              font-family: 'Poppins', sans-serif;
              text-align: justify;
            }
          </style>
        </head>
        <body>
          ${lesson.description}
        </body>
        </html>
      `;
      const lessonContentWrapper = document.getElementById("lesson_content_wrapper");
      lessonDescription.addEventListener("load", () => {
        const iframeHeight = lessonDescription.contentWindow.document.body.scrollHeight;
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
        contentContainer.style.width = "100%";
        const textContainer = document.createElement("div");
        const authorTitle = document.createElement("h3");
        authorTitle.style.color = "#9C3030";
        authorTitle.textContent = user.full_name;
        document.getElementById("username").innerHTML = user.full_name;
        textContainer.appendChild(authorTitle);
        const button = document.createElement("a");
        const about_me = document.createElement("p");
        about_me.classList.add("card-text");
        about_me.style.textAlign = "justify";
        about_me.style.fontStyle = "italic";
        about_me.style.fontSize = "13px";
        about_me.innerHTML = `<br>${user.about_me}`;
        button.href = "/Teachers/" + user.url_link;
        button.innerHTML =
          user.full_name +
          " is a teacher in Norsk Kulturklub <i class='bx bx-chevron-right'></i>";
        textContainer.appendChild(about_me);
        button.style.fontWeight = "bold";
        button.style.fontSize = "13px";
        button.style.fontWeight = "bold";
        button.style.marginLeft = "auto";
        button.style.textDecoration = "none";
        const introTextContainer = document.createElement("div");
        introTextContainer.style.display = "flex";
        introTextContainer.style.alignItems = "center";
        introTextContainer.appendChild(button);
        textContainer.appendChild(introTextContainer);
        contentContainer.appendChild(textContainer);
        userDetailsSection.appendChild(contentContainer);
        lessonContainer.appendChild(userDetailsSection);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    window.location.href = "/404.html";
  }
}
fetchData();