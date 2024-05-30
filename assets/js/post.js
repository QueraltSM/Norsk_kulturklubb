var url = new URL(window.location.href).pathname.split("/")[2];
const culture_entry = document.getElementById("culture_entry");
async function fetchData() {
  try {
    const response = await fetch(
      "/api/getFromURL?url_link=" + url + "&table=Culture"
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const post = await response.json();
    try {
      document.getElementById("post_title").innerHTML = post.title;
      document.getElementById("post_subcategory").innerHTML = post.subcategory;
      const cultureCard = document.createElement("div");
      cultureCard.classList.add(
        "col-md-8",
        "offset-md-2",
        "d-flex",
        "justify-content-center"
      );
      const card = document.createElement("div");
      card.classList.add("card");
      const cardImg = document.createElement("div");
      cardImg.classList.add("card-img");
      const img = document.createElement("img");
      img.style.width = "100%";
      img.src = post.image_url;
      img.style.borderRadius = "10px";
      cardImg.style.borderRadius = "10px";
      cardImg.appendChild(img);
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      cardBody.style.borderColor = "#9C3030";
      cardBody.style.borderRadius = "10px";
      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.innerHTML = post.description;
      cardText.style.textAlign = "justify";
      cardText.style.fontSize = "13px";
      const dateText = document.createElement("p");
      dateText.innerHTML =
        '<p class="event-p"><i class="bi bi-calendar4-event" style="font-size: 12px;"></i>&nbsp; Date <span class="event-description">' +
        formatEvent(post.pubdate) +
        "</span></p>";
      dateText.style.color = "#777";
      dateText.style.fontSize = "13px";
      dateText.style.float = "right";
      cardBody.appendChild(cardText);
      cardBody.appendChild(dateText);
      cultureCard.appendChild(card);
      card.appendChild(cardImg);
      card.appendChild(cardBody);
      getUser(post.user_id).then((user) => {
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
        cardBody.appendChild(userDetailsSection);
      });
      card.appendChild(cardImg);
      card.appendChild(cardBody);
      cultureCard.appendChild(card);
      culture_entry.appendChild(cultureCard);
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    window.location.href = "/404.html";
  }
}
fetchData();
