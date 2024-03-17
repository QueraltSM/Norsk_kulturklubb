let cultureID = new URLSearchParams(window.location.search).get("aWQ").substring(1);
const culture_entry = document.getElementById("culture_entry");

fetch(`http://localhost:3000/api/getCulture?id=${cultureID}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    return response.json();
  })
  .then((cultureData) => {
      const cultureCard = document.createElement("div");
      cultureCard.classList.add("col-md-8", "offset-md-2", "d-flex", "justify-content-center");
      
      const card = document.createElement("div");
      card.classList.add("card");

      const cardImg = document.createElement("div");
      cardImg.classList.add("card-img");

      const img = document.createElement("img");
      img.src = cultureData.image;

      cardImg.appendChild(img);

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      cardBody.style.borderColor = "#9C3030";
      
      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      const titleLink = document.createElement("a");
      titleLink.textContent = cultureData.title;
      titleLink.style.color = "#9C3030";
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
      culture_entry.appendChild(cultureCard);
      
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });