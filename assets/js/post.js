let cultureID = localStorage.getItem("contentID");
const culture_entry = document.getElementById("culture_entry");
document.getElementById("contentTitle").innerHTML = localStorage.getItem("contentTitle");

fetch("/api/getContent?id="+cultureID+"&table=Culture")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    return response.json();
  })
  .then((cultureData) => {
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
    img.src = cultureData.image_url;
    img.style.borderRadius = "10px";
    cardImg.style.borderRadius = "10px";
    cardImg.appendChild(img);
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.style.borderColor = "#9C3030";
    cardBody.style.borderRadius = "10px";
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerHTML  = cultureData.description;
    cardText.style.textAlign = "justify";
    cardText.style.fontSize = "13px";
    const dateText = document.createElement("p");
    dateText.textContent = "Published on " + cultureData.pubdate.split(" ")[0];
    dateText.style.color = "#777";
    dateText.style.fontSize = "13px";
    dateText.style.float = "right";
    cardBody.appendChild(cardText);
    cardBody.appendChild(dateText);
    cultureCard.appendChild(card);
    card.appendChild(cardImg);
    card.appendChild(cardBody);
    getUser(cultureData.user_id).then((user) => {
      const userDetailsSection = document.createElement("div");
      userDetailsSection.classList.add("user-details");
      const authorTitle = document.createElement("h3");
      authorTitle.style.color = "#9C3030";
      const authorText = document.createElement("p");
      authorText.classList.add("card-text");
      if (user.role=="Teacher") {
        authorTitle.textContent = "Discover our teacher " + user.first_name;
        authorText.innerHTML = user.about_teacher;
      } else {
        authorTitle.textContent = "Discover our collaborator " + user.first_name;
        authorText.innerHTML = user.biography;
      }
      authorText.style.textAlign = "justify";
      authorText.style.fontSize = "13px";
      userDetailsSection.appendChild(authorTitle);
      userDetailsSection.appendChild(authorText);
      const button = document.createElement("a");
      button.href = "/Users/" + user.first_name;
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
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
