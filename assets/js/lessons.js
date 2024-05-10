document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });

function clearSearch() {
  document.getElementById('searchInput').value='';
  document.getElementById("A1-Nybegynner").style.display = "none";
  document.getElementById("A2-Grunnleggende").style.display = "none";
  document.getElementById("B1-Mellomnivå").style.display = "none";
  document.getElementById("B2-Øvet").style.display = "none";
  document.getElementById("C1-Avansert").style.display = "none";
  document.getElementById("C2-Mester").style.display = "none";
}

function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const lessons = document.getElementById('accordion-content').querySelectorAll(".col-6");
  lessons.forEach(function (card) {
    const title = card.querySelector(".lesson-content h3").textContent.toLowerCase();
    const description = card.querySelector(".lesson-content p").textContent.toLowerCase();
    const searchTermMatch = title.includes(searchTerm) || description.includes(searchTerm);
    if (searchTermMatch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
  document.getElementById("A1-Nybegynner").style.display = "block";
  document.getElementById("A2-Grunnleggende").style.display = "block";
  document.getElementById("B1-Mellomnivå").style.display = "block";
  document.getElementById("B2-Øvet").style.display = "block";
  document.getElementById("C1-Avansert").style.display = "block";
  document.getElementById("C2-Mester").style.display = "block";
}

async function fetchData() {
  try {
    const response = await fetch("/api/getAllContents?table=Lessons");
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const data = await response.json();

    var entered = false;
    for (const lesson of data.Items) {
      try {
        const user = await getUser(lesson.teacher_id);
        if (user.public_profile) {
          entered = true;
          const lessonHTML = `<div class="col-6" style="padding-bottom:10px;">
          <a href="#" onclick="window.location.href = '/Lessons/` + lesson.url_link +`';" style="text-decoration: none; color: inherit; display: flex;">
            <div class="course-item" style="border: none; cursor: pointer; background-color: #f9f9f9; border-radius: 10px; overflow: hidden; display: flex;">
              <div class="course-img" style="height: 200px; width: 40%; overflow: hidden;">
                <img src="${lesson.image_url}" class="img-fluid" alt="Lesson Image" style="object-fit: cover; height: 100%; width: 100%;">
              </div>
              <div class="lesson-content" style="padding: 20px; width: 60%;">
                <h3 style="margin-bottom: 10px;">${lesson.title}</h3>
                <p style="margin-bottom: 0; word-wrap: break-word;">${lesson.short_description}</p>
              </div>
            </div>
          </a>
        </div>`;
          document.getElementById(lesson.language_level).innerHTML += lessonHTML;
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

fetchData();
