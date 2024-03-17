const cultureEntries = document.getElementById("culture_entries");
fetch("http://localhost:3000/api/getCulture")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    return response.json();
  })
  .then((data) => {
    data.Items.forEach((cultureData) => {
      const cultureCard = document.createElement("div");
      cultureCard.classList.add("col-md-6", "d-flex", "align-items-stretch");

      const card = document.createElement("div");
      card.classList.add("card");

      const cardImg = document.createElement("div");
      cardImg.classList.add("card-img");

      const img = document.createElement("img");
      //img.src = cultureData.imageUrl; // Assuming imageUrl is a property in your event data
      //img.alt = cultureData.title; // Assuming title is a property in your event data

      cardImg.appendChild(img);

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      const titleLink = document.createElement("a");
      titleLink.href = `culture_info.html?aWQ===${cultureData.id}`;
      titleLink.textContent = cultureData.title;
      cardTitle.appendChild(titleLink);
      
      const italicText = document.createElement("p");
      italicText.classList.add("fst-italic", "text-center");
      italicText.textContent = cultureData.date;
      italicText.style.color = "#777";
      italicText.style.fontSize = "13px";

      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.textContent = cultureData.description;
      cardText.style.textAlign = "justify";
      cardText.style.fontSize = "13px";
      
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(italicText);
      cardBody.appendChild(cardText);

      card.appendChild(cardImg);
      card.appendChild(cardBody);

      cultureCard.appendChild(card);
      cultureEntries.appendChild(cultureCard);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });