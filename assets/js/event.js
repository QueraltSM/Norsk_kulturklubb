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
      const eventHTML = `<div class="row">
      <div class="col-12 course-item">
        <p class="event-description">${event.description}</p>
          <p class="event-p"><i class="bi bi-calendar4-event" style="font-size: 12px;"></i>&nbsp; Date <span class="event-description">${formatEvent(
            event.celebration_date
          )}</span></p>
          <p class="event-p"><i class="bi bi-link" style="font-size: 13px;"></i>&nbsp; Link <span class="event-description">${
            event.platform_url
          }</span></p>
        </div>
    </div>
    `;
      getUser(event.user_id).then((user) => {
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
        authorTitle.textContent = "Host " + user.full_name;
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
        if (user.role === "Teacher") {
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
        } else if (user.role === "Collaborator") {
          introText.innerHTML = `<br><strong>${user.full_name} is a collaborator in Norsk Kulturklubb</strong>`;
          const about_meText = document.createElement("p");
          about_meText.classList.add("card-text");
          about_meText.style.textAlign = "justify";
          about_meText.style.fontSize = "13px";
          about_meText.innerHTML = `<br><strong>About me<br></strong>${user.about_me}`;
          const contactText = document.createElement("p");
          contactText.classList.add("card-text");
          contactText.style.textAlign = "justify";
          contactText.style.fontSize = "13px";
          contactText.innerHTML = `<strong>Contact<br></strong>${user.contact}`;
          textContainer.appendChild(introText);
          textContainer.appendChild(about_meText);
          textContainer.appendChild(contactText);
        }
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
      eventContainer.innerHTML += eventHTML;
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    window.location.href = "/404.html";
  }
}
fetchData();
