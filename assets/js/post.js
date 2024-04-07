let cultureID = localStorage.getItem('postID');
const culture_entry = document.getElementById("culture_entry");
document.getElementById("postTitle").innerHTML =  localStorage.getItem('postTitle');

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
      
      const dateText = document.createElement("p");
      dateText.textContent = "Published on " + cultureData.pubdate.split(" ")[0];
      dateText.style.color = "#777";
      dateText.style.fontSize = "13px";
      dateText.style.textAlign = "center";

      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.textContent = cultureData.description;
      cardText.style.textAlign = "justify";
      cardText.style.fontSize = "13px";

      cardBody.appendChild(dateText);
      cardBody.appendChild(cardText);

      card.appendChild(cardImg);
      card.appendChild(cardBody);

      cultureCard.appendChild(card);
      culture_entry.appendChild(cultureCard);
      
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });