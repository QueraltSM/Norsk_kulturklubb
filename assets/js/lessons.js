if (localStorage.getItem("isLoggedIn")) {
  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }
    });

  function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("A1-Nybegynner").style.display = "none";
    document.getElementById("A2-Grunnleggende").style.display = "none";
    document.getElementById("B1-Mellomnivå").style.display = "none";
    document.getElementById("B2-Øvet").style.display = "none";
    document.getElementById("C1-Avansert").style.display = "none";
    document.getElementById("C2-Mester").style.display = "none";
  }

  function performSearch() {
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const lessons = document
      .getElementById("accordion-content")
      .querySelectorAll(".col-6");
    lessons.forEach(function (card) {
      const title = card
        .querySelector(".lesson-content h3")
        .textContent.toLowerCase();
      const description = card
        .querySelector(".lesson-content p")
        .textContent.toLowerCase();
      const searchTermMatch =
        title.includes(searchTerm) || description.includes(searchTerm);
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
      for (const lesson of data.Items) {
        try {
          const user = await getUser(lesson.teacher_id);
          if (user.public_profile) {
            var short_description = lesson.short_description;
            if (short_description.split(" ").length > 25) {
              short_description = lesson.short_description.split(" ").slice(0, 25).join(" ") + "...";
            } 
            const lessonHTML = `
            <div class="col-6" style="padding-bottom: 20px;">
              <a href="#" onclick="window.location.href = '/Lessons/${lesson.url_link}';" style="text-decoration: none; color: inherit; display: flex;">
                <div class="course-item" style="position: relative; border: none; cursor: pointer; background-color: #ffffff; border-radius: 10px; overflow: hidden; display: flex; height: 300px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s, box-shadow 0.3s;">
                  <div class="course-img" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;">
                    <img src="${lesson.image_url}" class="img-fluid" style="object-fit: cover; width: 100%; height: 100%; filter: background: rgba(255, 255, 255, 0.75);">
                  </div>
                  <div class="lesson-content" style="position: relative; padding: 20px; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255, 255, 255, 0.8);">
                    <h3 style="margin-bottom: 10px; color: #9C3030;">${lesson.title}</h3>
                    <p style="margin-bottom: 0; word-wrap: break-word; color: #003657;">${short_description}</p>
                  </div>
                </div>
              </a>
            </div>`;
          
            document.getElementById(lesson.language_level).innerHTML +=
              lessonHTML;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  fetchData();
}
