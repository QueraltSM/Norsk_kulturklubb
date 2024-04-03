const cultureEntries = document.getElementById("culture_entries");
fetch("http://localhost:3000/api/getCultureEntries")
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
      img.src = cultureData.image;
      img.onload = function() {
        // Una vez que la imagen se haya cargado, agregar el resto del contenido
        cardImg.appendChild(img);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        const titleLink = document.createElement("a");
        titleLink.href = `culture-post.html?aWQ==${cultureData.ID}`;
        titleLink.textContent = cultureData.title;
        cardTitle.appendChild(titleLink);
        
        const dateText = document.createElement("p");
        dateText.textContent = cultureData.date + " · " + cultureData.min_read + " min read";
        dateText.style.color = "gray";
        dateText.style.fontSize = "13px";
        dateText.style.textAlign = "center";
        
        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = cultureData.short_description;
        cardText.style.textAlign = "justify";
        cardText.style.fontSize = "13px";
        
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(dateText);

        card.appendChild(cardImg);
        card.appendChild(cardBody);

        cultureCard.appendChild(card);
        cultureEntries.appendChild(cultureCard);
      };

    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });