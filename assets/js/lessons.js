
function loadLessonDetails(lessonId) {
  localStorage.setItem("lessonID", lessonId);
  window.location.href = "lesson.html";
}

document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });

function performSearch() {
  /*const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const lessons = lessonsContainer.querySelectorAll(".col-4");
  lessons.forEach(function (card) {
    const title = card
      .querySelector(".lesson-content h3")
      .textContent.toLowerCase();
    const languageLevel = card
      .querySelector(".lesson-content h4")
      .textContent.toLowerCase();
    const description = card
      .querySelector(".lesson-content p")
      .textContent.toLowerCase();
    const levelMatch =
      selectedLevel === "" || languageLevel.includes(selectedLevel);
    const searchTermMatch =
      title.includes(searchTerm) || description.includes(searchTerm);
    if (levelMatch && searchTermMatch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });*/
}

async function fetchData() {
  try {
    const response = await fetch("/api/getLessons");
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const data = await response.json();

    var entered = false;
    for (const lesson of data.Items) {
      try {
        const result = await getUser(lesson.teacher_id);
        if (result) {
          entered = true;
          const lessonHTML = `<div class="col-4" style="padding-bottom:10px;">
              <a href="#" onclick="loadLessonDetails('${lesson.ID}')" style="text-decoration: none; color: inherit;">
                <div class="course-item" style="border: none; cursor: pointer; background-color: #f9f9f9; border-radius: 10px; overflow: hidden;">
                  <div class="course-img" style="height: 200px; overflow: hidden;">
                    <img src="${lesson.header_image}" class="img-fluid" alt="Lesson Image" style="object-fit: cover; height: 100%; width: 100%;">
                  </div>
                  <div class="lesson-content" style="text-align: center; padding: 20px;">
                    <h3 style="margin-bottom: 10px;">${lesson.title}</h3>
                    <p style="margin-bottom: 0; word-wrap: break-word;">${lesson.short_description}</p>
                  </div>
                </div>
              </a>
            </div>
          `;
          document.getElementById(lesson.language_level).innerHTML += lessonHTML;
          console.log(lessonHTML);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    if (!entered) {
      setNoPosts();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function setNoPosts() {
  const noDataDiv = document.createElement("div");
  noDataDiv.classList.add("col-md-12", "text-center", "mt-5");
  noDataDiv.style.paddingTop = "0"; // Eliminar el padding top
  const img = document.createElement("img");
  img.src = "/assets/img/not-found.png";
  img.alt = "No Data";
  img.style.width = "300px";
  const message = document.createElement("p");
  message.textContent = "No posts yet :(";
  message.style.fontSize = "18px";
  message.style.fontWeight = "bold";
  message.style.marginTop = "0";
  message.style.color = "#9C3030";
  noDataDiv.appendChild(message);
  noDataDiv.appendChild(img);
  lessonsContainer.appendChild(noDataDiv);
}

async function getUser(id) {
  try {
    const response1 = await fetch(
      `/api/getUser?id=${id}&table=Users`
    );
    if (!response1.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const user = await response1.json();
    const role = user.role;
    const response2 = await fetch(
      `/api/getUser?id=${id}&table=${role}s`
    );
    if (!response2.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const userData = await response2.json();
    if (role === "Teacher") {
      return userData.public_profile;
    }
    return true;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

fetchData();
