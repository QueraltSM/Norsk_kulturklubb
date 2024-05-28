if (localStorage.getItem("isLoggedIn")) {
  const eventsContainer = document.getElementById("events_container");

  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }
    });

  function performSearch() {
    const selectOptions = {
      "select-class": "class",
      "select-workshop": "workshop",
      "select-talk": "talk",
      "select-pronunciation": "pronunciation",
      "select-cultural": "cultural",
    };
    let type = "none";
    for (const id in selectOptions) {
      if (
        document
          .getElementById(id)
          .classList.contains("select-categories-selected")
      ) {
        type = selectOptions[id];
        break;
      }
    }
    fetchData(type, document.getElementById("searchInput").value.toLowerCase());
  }

  function clearSearch() {
    document.getElementById("searchInput").value = "";
    document
      .getElementById("select-class")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-workshop")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-talk")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-pronunciation")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-cultural")
      .classList.remove("select-categories-selected");
    fetchData("none", "");
  }
  async function fetchData(filter, searchTerm) {
    eventsContainer.innerHTML = "";
    try {
      const response = await fetch("/api/getAllContents?table=Events");
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
      data.Items.sort(
        (a, b) => parseDate(b.celebration_date) - parseDate(a.celebration_date)
      );
      data.Items.forEach(async (event, index) => {
        var event_matches = false;
        if (
          (filter === "class" && event.category == "Class") ||
          (filter === "workshop" && event.category == "Workshop") ||
          (filter === "talk" && event.category == "Talk") ||
          (filter === "pronunciation" && event.category == "Pronunciation") ||
          (filter === "cultural" && event.category == "Cultural")
        ) {
          event_matches = true;
        }
        const eventDiv = document.createElement("div");
        const searchTermContains = Object.values(event).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if ((filter == "none" || event_matches) && searchTermContains) {
          eventDiv.classList.add("col-lg-4");
          eventDiv.innerHTML = `
          <a href="/Events/${event.url_link}" class="event-link">
          <div class="event-card">
          <div class="event-image-container">
            <img src="${event.image_url}" class="img-fluid event-image">
            <div class="event-overlay">
                <h4 class="event-title"><strong>${event.title}</strong></h4>
                <p class="event-p" style="color: #003657;">${formatEvent(
                  event.celebration_date
                )}</p>
            </div>
          </div>
        </div></a>`;
          eventsContainer.appendChild(eventDiv);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      document.getElementById("eventData").textContent = "Error fetching data";
    }
  }

  function filterByClassType(type) {
    document
      .getElementById("select-class")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-workshop")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-talk")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-pronunciation")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-cultural")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-" + type)
      .classList.add("select-categories-selected");
    fetchData(type, document.getElementById("searchInput").value.toLowerCase());
  }
  fetchData("none", "");
}
