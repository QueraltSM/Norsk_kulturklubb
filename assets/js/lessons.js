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
    performSearch();
  }

  function performSearch() {
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const lessons = document
      .getElementById("accordion-content")
      .querySelectorAll(".col-4");
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
  }

  async function fetchData() {
    try {
      const response = await fetch("/api/getAllContents?table=Lessons");
      if (!response.ok) {
        throw new Error("No response could be obtained from the server");
      }
      const data = await response.json();
      const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes);
      };
      data.Items.sort((a, b) => parseDate(b.pubdate) - parseDate(a.pubdate));
      for (const lesson of data.Items) {
        try {
          const user = await getUser(lesson.teacher_id);
          if (user.public_profile) {
            var short_description = lesson.short_description;
            if (short_description.split(" ").length > 20) {
              short_description =
                lesson.short_description.split(" ").slice(0, 20).join(" ") +
                "...";
            }
            const lessonHTML = `
            <div class="col-4" style="padding-bottom: 20px;">
              <a href="#" onclick="window.location.href = '/Lessons/${lesson.url_link}';" style="text-decoration: none; color: inherit; display: flex; width: 100%;">
                <div class="course-item" style="position: relative; cursor: pointer; background-color: #f8f8f8; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s, box-shadow 0.3s; height: 200px; display: flex; width: 100%; align-items: center;">
                  <div class="lesson-image" style="margin: 10px; border-radius: 10px; width: 40%; height: 80%; background-image: url('${lesson.image_url}'); background-size: cover; background-position: center;"></div>
                  <div class="lesson-content" style="flex: 1; padding: 20px; display: flex; flex-direction: column; justify-content: center;">
                    <h3 style="margin-bottom: 10px; color: #9C3030; text-align: left; font-family: 'Arial', sans-serif;">${lesson.title}</h3>
                    <p style="margin-bottom: 0; word-wrap: break-word; color: #003657; text-align: left;">${short_description}</p>
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