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
      
      // Crear un enlace para el post completo
      const postLink = document.createElement("a");
      postLink.href = "#"; // Cambiar el href por ahora
      postLink.style.textDecoration = "none"; // Quitar subrayado del enlace
      
      // Añadir evento click al enlace del post completo
      postLink.addEventListener("click", function() {
        loadPostDetails(cultureData.ID, cultureData.title); // Llamar a la función con el ID y el título del post
      });

      // buscador 
      
      const card = document.createElement("div");
      card.classList.add("card");
      
      const cardImg = document.createElement("div");
      cardImg.classList.add("card-img");
      cardImg.style.borderRadius = "10px";
      const img = document.createElement("img");
      img.src = cultureData.image;
      img.style.width = "100%";
      img.style.height = "300px";
      img.style.objectFit = "cover";
      cardImg.appendChild(img);
      
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      cardBody.style.borderRadius = "10px";
      
      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      const titleLink = document.createElement("a");
      titleLink.href = "#"; // Cambiar el href por ahora
      titleLink.textContent = cultureData.title;
      titleLink.style.color = "black"; // Cambiar color del título
      titleLink.style.textDecoration = "none"; // Quitar subrayado del título
      cardTitle.appendChild(titleLink);
      
      const dateText = document.createElement("p");
      dateText.textContent = cultureData.pubdate.split(" ")[0] + " · " + cultureData.min_read + " min read";
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
      
      // Agregar la tarjeta al enlace del post completo
      postLink.appendChild(card);
      
      // Agregar el enlace del post completo al contenedor de entradas de cultura
      cultureCard.appendChild(postLink);
      
      // Agregar la tarjeta al contenedor de entradas de cultura
      cultureEntries.appendChild(cultureCard);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function loadPostDetails(postId, postTitle) {
  localStorage.setItem('postID', postId);
  localStorage.setItem('postTitle', postTitle);
  window.location.href = 'post.html';
}