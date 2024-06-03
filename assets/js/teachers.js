if (localStorage.getItem("isLoggedIn")) {
  const teachersContainer = document.getElementById("teachers_container");
  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }
    });

  async function fetchData(filter, searchTerm) {
    teachersContainer.innerHTML = "";
    try {
      const response = await fetch("/api/getAllContents?table=Teachers");
      if (!response.ok) {
        throw new Error("No response could be obtained from the server");
      }
      const data = await response.json();
      var entered = false;
      data.Items.forEach(async (teacher, index) => {
        var teaching_matches = false;
        if (
          (filter === "both" &&
            teacher.teaching_in_person &&
            teacher.teaching_online) ||
          (filter === "online" && teacher.teaching_online) ||
          (filter === "in-person" && teacher.teaching_in_person)
        ) {
          teaching_matches = true;
        }
        const searchTermContains = Object.values(teacher).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (
          teacher.public_profile &&
          (filter == "none" || teaching_matches) &&
          searchTermContains
        ) {
          entered = true;
          const teacherDiv = document.createElement("div");
          teacherDiv.classList.add("col-lg-4");
          const teacherName = await get_teacher_name(teacher.ID);
          var about_me = teacher.about_me;
          if (teacher.about_me.split(" ").length > 25) {
            about_me = teacher.about_me.split(" ").slice(0, 25).join(" ") + "...";
          }
          teacherDiv.innerHTML = `
          <a href="#" onclick="window.location.href = '/Teachers/' + '${teacher.url_link}'">
            <div class="member" style="border-radius: 10px;">
              <div class="member-img">
                <img src="${teacher.profile_picture}" class="img-fluid" style="width: 400px; height: 350px; object-fit: cover;">
                <div class="social" style="display: flex; justify-content: center; align-items: center;">
                  <div style="flex-grow: 1;">
                    <h4 style="text-align: center; margin: 0;color:#9C3030;"><strong>${teacherName}</strong></h4>
                  </div>
                </div>
              </div>
              <div class="member-info text-center">
                <p style="padding-top:5px;text-align:justify;">${about_me}</p> 
              </div>
            </div>
          </a>`;
          teachersContainer.appendChild(teacherDiv);
        }
      });
      if (!entered) {
        teachersContainer.innerHTML = noData("There are no teachers with public profiles in the system");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      document.getElementById("teacherData").textContent =
        "Error fetching data";
    }
  }

  function filterByClassType(type) {
    document
      .getElementById("select-both")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-online")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-in-person")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-" + type)
      .classList.add("select-categories-selected");
    fetchData(type, document.getElementById("searchInput").value.toLowerCase());
  }

  function performSearch() {
    const selectOptions = {
      "select-both": "both",
      "select-online": "online",
      "select-in-person": "in-person",
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

  async function get_teacher_name(id) {
    try {
      const response1 = await fetch(`/api/getUser?id=${id}&table=Users`);
      if (!response1.ok) {
        throw new Error("No response could be obtained from the server");
      }
      const user = await response1.json();
      return user.full_name;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  function clearSearch() {
    document.getElementById("searchInput").value = "";
    document
      .getElementById("select-both")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-online")
      .classList.remove("select-categories-selected");
    document
      .getElementById("select-in-person")
      .classList.remove("select-categories-selected");
    fetchData("none", "");
  }
  fetchData("none", "");
}
