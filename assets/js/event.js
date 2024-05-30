if (localStorage.getItem("isLoggedIn") == "false") {
  window.location.href = "/Events";
}
const eventContainer = document.getElementById("event_container");
var url = new URL(window.location.href).pathname.split("/")[2];
async function fetchData() {
  try {
    const response = await fetch(
      "/api/getFromURL?url_link=" + url + "&table=Events"
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const event = await response.json();
    try {
      document.getElementById("event_category").innerHTML = event.category;
      document.getElementById("event_title").innerHTML = event.title;
      const eventHTML = `<p class="event-description">${event.description}</p>
          <p class="event-p"><i class="bi bi-calendar4-event" style="font-size: 12px;"></i>&nbsp; Date <span class="event-description">${formatEvent(
            event.celebration_date
          )}</span></p>
          <p class="event-p"><i class="bi bi-link" style="font-size: 13px;"></i>&nbsp; Link <span class="event-description">${
            event.platform_url
          }</span></p>`;
      eventContainer.innerHTML += eventHTML;
      getUser(event.user_id).then((user) => {
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
        textContainer.appendChild(authorTitle);
        const button = document.createElement("a");
        const about_me = document.createElement("p");
        about_me.classList.add("card-text");
        about_me.style.textAlign = "justify";
        about_me.style.fontStyle = "italic";
        about_me.style.fontSize = "13px";
        about_me.innerHTML = `<br>${user.about_me}`;
        if (user.role === "Teacher") {
          button.href = "/Teachers/" + user.url_link;
          button.innerHTML =
            user.full_name +
            " is a teacher in Norsk Kulturklub <i class='bx bx-chevron-right'></i>";
        } else if (user.role === "Collaborator") {
          button.href = "/Collaborators/" + user.url_link;
          button.innerHTML =
            user.full_name +
            " is a collaborator in Norsk Kulturklub <i class='bx bx-chevron-right'></i>";
        }
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
        eventContainer.appendChild(userDetailsSection);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    window.location.href = "/404.html";
  }
}
fetchData();
