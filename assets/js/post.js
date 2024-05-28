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
      document.getElementById("post_category").innerHTML = post.category;
      document.getElementById("post_subcategory").innerHTML = post.subcategory;
      const cultureCard = document.createElement("div");
      cultureCard.classList.add("col-md-8", "offset-md-2", "d-flex", "justify-content-center");
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
      dateText.textContent = "Published on " + post.pubdate.split(" ")[0];
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
        const authorTitle = document.createElement("h3");
        authorTitle.style.color = "#9C3030";
        const authorText = document.createElement("p");
        authorText.classList.add("card-text");
        authorTitle.textContent = user.full_name;
        authorText.style.textAlign = "justify";
        authorText.style.fontSize = "13px";
        userDetailsSection.appendChild(authorTitle);
        userDetailsSection.appendChild(authorText);
        const button = document.createElement("a");
        if (user.role == "Teacher") {
          authorText.innerHTML = user.about_me;
          button.href = "/Teachers/" + user.url_link;
        } else {
          authorText.innerHTML = user.about_me;
          button.href = "/Collaborators/" + user.url_link;
        }
        button.innerHTML = "About me <i class='bx bx-chevron-right'></i>";
        button.style.fontWeight = "bold";
        button.style.float = "right";
        userDetailsSection.appendChild(button);
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
