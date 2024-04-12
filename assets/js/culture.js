const rowContainer = document.createElement("div");
rowContainer.classList.add("row");

const cultureEntries = document.getElementById("culture_entries");

const cultureCardsContainer = document.createElement("div");
cultureCardsContainer.classList.add("col-8");

function calculateTotalPages(totalItems, itemsPerPage) {
  return Math.ceil(totalItems / itemsPerPage);
}

async function fetchData(pageNumber) {
  try {
    const response = await fetch("http://localhost:3000/api/getCultureEntries");
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const data = await response.json();
    var entered = false;

    culture = data.Items;

    const itemsPerPage = 3;

    const startIndex = (pageNumber - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    cultureCardsContainer.innerHTML = "";


    for (let i = startIndex; i < endIndex && i < culture.length; i++) {
      try {
        const cultureData = culture[i];
        const result = await getUser(cultureData.user_id);
        if (result) {
          entered = true;
          if (document.getElementById("pagination") != undefined) document.getElementById("pagination").innerHTML = "";

          const cultureCard = document.createElement("div");
          cultureCard.classList.add("card");
          cultureCard.classList.add("mb-3"); // Añadir margen inferior para separar las tarjetas

          const postLink = document.createElement("a");
          postLink.href = "#";
          postLink.style.textDecoration = "none";
          postLink.addEventListener("click", function () {
            loadPostDetails(cultureData.ID, cultureData.title);
          });

          const cardImg = document.createElement("img");
          cardImg.src = cultureData.image;
          cardImg.classList.add("card-img-top");
          cardImg.style.width = "100%";
          cardImg.style.height = "400px";
          cardImg.style.objectFit = "cover";
          cardImg.style.transition = "none"; // Desactivar cualquier transición en hover
          cardImg.style.filter = "none"; // Eliminar cualquier filtro que se aplique en hover
          cardImg.style.transform = "none"; // Eliminar cualquier transformación en hover

          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          cardBody.style.backgroundColor = "#fff"; // Fondo blanco para los textos
          cardBody.style.padding = "50px"; // Espaciado interior
          cardBody.style.textAlign = "justify"; // Centrar texto
          cardBody.style.boxShadow = "0px 10px 15px -10px rgba(0, 0, 0, 0.1)"; // Sombra con desplazamiento negativo en Y para eliminar la parte superior

          const cardTitle = document.createElement("h5");
          cardTitle.classList.add("card-title");
          cardTitle.textContent = cultureData.title;
          cardTitle.style.color = "#000000"; // Cambia el color del texto a #9C3030
          cardTitle.style.textDecoration = "none";
          cardTitle.style.textAlign = "justify"; // Centrar texto
          cardTitle.style.transition = "color 0.3s"; // Agrega una transición suave al cambio de color
          cultureCard.addEventListener("mouseover", function () {
            cardTitle.style.color = "#9C3030"; // Cambia el color del texto al hacer hover
          });
          cultureCard.addEventListener("mouseout", function () {
            cardTitle.style.color = "#000000"; // Restaura el color normal del texto al dejar de hacer hover
          });

          const dateContainer = document.createElement("div");
          const daySpan = document.createElement("span");
          daySpan.textContent = formatDate(
            cultureData.pubdate.split(" ")[0]
          ).split(" ")[0]; // Separar el día del mes
          daySpan.style.fontWeight = "bold"; // Hacer el número del día en negrita

          const monthSpan = document.createElement("span");
          monthSpan.textContent = formatDate(
            cultureData.pubdate.split(" ")[0]
          ).split(" ")[1]; // Obtener el mes
          monthSpan.style.fontWeight = "normal"; // Hacer el mes en texto normal

          // Agregar los elementos al contenedor de fecha
          dateContainer.appendChild(daySpan);
          dateContainer.appendChild(document.createElement("br"));
          dateContainer.appendChild(monthSpan);
          dateContainer.classList.add("date-container"); // Agregar una clase para aplicar estilos

          // Estilos CSS para el contenedor de fecha
          dateContainer.style.backgroundColor = "#9C3030";
          dateContainer.style.color = "#FFFFFF";
          dateContainer.style.fontSize = "15px";
          dateContainer.style.width = "fit-content";
          dateContainer.style.padding = "15px 25px";
          dateContainer.style.borderRadius = "5px";
          dateContainer.style.display = "inline-block"; // Para que el contenedor se ajuste al contenido
          dateContainer.style.position = "absolute"; // Posición absoluta
          dateContainer.style.transform = "translate(-50%, -50%)"; // Centrar el contenedor
          dateContainer.style.textAlign = "center"; // Centrar texto

          // Establecer la posición relativa en el cardBody
          cardBody.style.position = "relative";

          // Establecer la posición absoluta en el dateContainer
          dateContainer.style.position = "absolute";
          dateContainer.style.top = "-50px"; // Ajusta este valor según sea necesario
          dateContainer.style.left = "10%";
          dateContainer.style.transform = "translateX(-50%)";

          // Crear un elemento <span> para contener el icono y el texto del tiempo de lectura
          const minReadText = document.createElement("span");
          minReadText.classList.add("d-inline-block", "align-middle"); // Agregar clases de Bootstrap para alineación vertical

          // Agregar el icono al span
          const iconElement = document.createElement("i");
          iconElement.classList.add("bi", "bi-clock"); // Agregar clases de Bootstrap para el icono
          minReadText.appendChild(iconElement); // Adjuntar el icono al span

          const textNode = document.createTextNode(
            "\u00A0" + cultureData.min_read + " min read"
          );

          minReadText.appendChild(textNode); // Adjuntar el texto al span

          minReadText.style.color = "#666";
          minReadText.style.fontSize = "11px";

          const cardText = document.createElement("p");
          cardText.classList.add("card-text");
          cardText.textContent = cultureData.short_description;
          cardText.style.fontSize = "13px";
          cardText.style.color = "#000000";

          cardBody.appendChild(dateContainer);
          cardBody.appendChild(cardTitle);
          cardBody.appendChild(cardText);
          cardBody.appendChild(minReadText);

          cultureCard.appendChild(cardImg);
          cultureCard.appendChild(cardBody);
          cultureCard.style.paddingBottom = "5%";

          postLink.appendChild(cultureCard);
          cultureCardsContainer.appendChild(postLink);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (!entered) {
      setNoPosts();
    } else {
      document.getElementById("search_container").style.display = "block";
      document.getElementById("categories_container").style.display = "block";
      
      const paginationContainer = document.createElement("ul");
      paginationContainer.id = "pagination";
      paginationContainer.classList.add("pagination");

      const totalItems = culture.length;
      calculateTotalPages(totalItems, itemsPerPage);

      const totalPages = Math.ceil(culture.length / itemsPerPage);
      const paginationElement = createPagination(totalPages, pageNumber);


      paginationContainer.appendChild(paginationElement);

      cultureEntries.appendChild(paginationContainer);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

function createPagination(totalPages, currentPage) {
  const paginationContainer = document.createElement("nav");

  const paginationList = document.createElement("ul");
  paginationList.classList.add("pagination");

  paginationList.style.justifyContent = "center";

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    const pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.href = "#";
    pageLink.textContent = i;
    pageItem.appendChild(pageLink);
    paginationList.appendChild(pageItem);

    if (i === currentPage) {
      pageItem.classList.add("active");
      pageLink.style.color = "#FFFFFF"; // Color del texto cuando está seleccionado
      pageLink.style.backgroundColor = "#9C3030"; // Fondo del enlace cuando está seleccionado
    } else {
      pageLink.style.color = "#9C3030"; // Color del texto cuando no está seleccionado
      pageLink.style.backgroundColor = "transparent"; // Fondo del enlace cuando no está seleccionado
      pageLink.style.outline = "none"; // Quitar outline
    }
  }

  paginationContainer.appendChild(paginationList);

  // Agregar un event listener a los elementos de paginación
  paginationList.querySelectorAll(".page-link").forEach((pageLink) => {
    pageLink.addEventListener("click", handlePaginationClick);
  });

  return paginationContainer;
}

// Agregar las tarjetas de cultura al contenedor
rowContainer.appendChild(cultureCardsContainer);

// Crear un div para contener el formulario de búsqueda
const searchContainer = document.createElement("div");
searchContainer.classList.add("col-4");

// Agregar el código HTML del formulario de búsqueda al contenedor del formulario
searchContainer.innerHTML = `
<div id="search_container" class="container" style="background-color: #f9faf9;padding:5px;border-radius: 5px;display:none">
<form class="d-flex justify-content-end" style="border: none;background-color: #f9faf9;">
<div class="input-group">
<span class="input-group-text" style="background-color: transparent; border: none;">
  <i class="bi bi-search" style="font-size: 13px;"></i>
</span>
<input type="text" class="form-control" placeholder="Search for posts" id="searchInput" style="background-color: #f9faf9;font-size: 13px;">
</div>
</form>
</div>
<div id="categories_container" class="container mt-3" style="padding: 5px; border-radius: 5px;display:none">
<h5 style="font-weight: bold;">Categories</h5>
<div class="d-flex flex-wrap">
<span class="blog-categories" onclick="toggleSubcategories('history','History and traditions')">History and traditions</span>
<span class="blog-categories" onclick="toggleSubcategories('art','Art and literature')">Art and literature</span>
<span class="blog-categories" onclick="toggleSubcategories('nature', 'Nature and landscapes')">Nature and landscapes</span>
<span class="blog-categories" onclick="toggleSubcategories('gastronomy','Gastronomy')">Gastronomy</span>
<span class="blog-categories" onclick="toggleSubcategories('lifestyle','Lifestyle and society')">Lifestyle and society</span>
<span class="blog-categories" onclick="toggleSubcategories('travel','Travel and tourism')">Travel and tourism</span>
<span class="blog-categories" onclick="toggleSubcategories('language','Language and linguistics')">Language and linguistics</span>
<span class="blog-categories" onclick="toggleSubcategories('events','Events and festivals')">Events and festivals</span>
</div>
</div>
<div id="subcategories" class="container mt-3" style="padding: 5px; border-radius: 5px;display:none">
<h5 style="font-weight: bold;" id="categories_title"></h5>
<div class="d-flex flex-wrap">

<!-- History and traditions -->
<div class="blog-subcategories " id="history" style="display:none">
<span class="blog-categories">Norwegian history</span>
<span class="blog-categories">Mythology</span>
<span class="blog-categories">Traditional festivals and celebrations</span>
<span class="blog-categories">Customs and ceremonies</span>
</div>

<!-- Art and literature -->
<div class="blog-subcategories" id="art" style="display:none">
<span class="blog-categories">Norwegian literature</span>
<span class="blog-categories">Norwegian art and artists</span>
<span class="blog-categories">Traditional and modern music</span>
<span class="blog-categories">Norwegian theater and cinema</span>
</div>

<!-- Nature and landscapes -->
<div class="blog-subcategories" id="nature" style="display:none">
<span class="blog-categories">Fjords and mountains</span>
<span class="blog-categories">Norwegian fauna and flora</span>
<span class="blog-categories">Outdoor sports and activities</span>
</div>

<!-- Gastronomy -->
<div class="blog-subcategories" id="gastronomy" style="display:none">
<span class="blog-categories">Traditional norwegian dishes</span>
<span class="blog-categories">Local ingredients and recipes</span>
<span class="blog-categories">Culinary customs and festivals</span>
</div>

<!--Lifestyle and society-->
<div class="blog-subcategories" id="lifestyle" style="display:none">
<span class="blog-categories">Norwegian cultural values</span>
<span class="blog-categories">Scandinavian fashion and design</span>
<span class="blog-categories">Daily life and modern traditions</span>
</div>

<!-- Travel and tourism -->
<div class="blog-subcategories" id="travel" style="display:none">
<span class="blog-categories">Tourist destinations in Norway</span>
<span class="blog-categories">Travel tips for the country</span>
<span class="blog-categories">Unique experiences and adventures</span>
</div>

<!-- Language and linguistics -->
<div class="blog-subcategories" id="language" style="display:none">
<span class="blog-categories">Basic norwegian lessons</span>
<span class="blog-categories">Common expressions and phrases</span>
<span class="blog-categories">Dialects and regional variations</span>
</div>

<!-- Events and festivals -->
<div class="blog-subcategories" id="events" style="display:none">
<span class="blog-categories">Cultural and artistic events</span>
<span class="blog-categories">Music and film festivals</span>
<span class="blog-categories">Traditional fairs and markets</span>
</div>
</div>
</div>
`;

// Agregar el contenedor del formulario de búsqueda a la fila
rowContainer.appendChild(searchContainer);

// Agregar la fila al contenedor principal de entradas de cultura
cultureEntries.appendChild(rowContainer);

// Función para manejar el evento de clic en los elementos de paginación
function handlePaginationClick(event) {
  // Evitar que se siga el enlace por defecto
  event.preventDefault();

  // Obtener el número de página seleccionado
  const selectedPage = parseInt(event.target.textContent);

  fetchData(selectedPage);
}

function setNoPosts() {
  document.getElementById("search_container").style.display = "none";
  document.getElementById("categories_container").style.display = "none";
  const noDataDiv = document.createElement("div");
  noDataDiv.classList.add("col-md-12", "text-center", "mt-5");
  noDataDiv.style.paddingTop = "0";
  const img = document.createElement("img");
  img.src = "/assets/img/not-found.png";
  img.alt = "No Data";
  img.style.width = "300px";
  const message = document.createElement("p");
  message.textContent = "No posts yet :(";
  message.style.fontSize = "18px";
  message.style.fontWeight = "bold";
  message.style.marginTop = "0";
  message.style.color = "#9C3030";
  noDataDiv.appendChild(message);
  noDataDiv.appendChild(img);
  cultureEntries.appendChild(noDataDiv);
}

function loadPostDetails(postId, postTitle) {
  localStorage.setItem("postID", postId);
  localStorage.setItem("postTitle", postTitle);
  window.location.href = "post.html";
}

document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });

function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const cultureCards = document.querySelectorAll(".col-6");
  cultureCards.forEach(function (card) {
    const title = card.querySelector(".card-title a").textContent.toLowerCase();
    const description = card
      .querySelector(".card-text")
      .textContent.toLowerCase();
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

async function getUser(id) {
  try {
    const response1 = await fetch(
      `http://localhost:3000/api/getUser?id=${id}&table=Users`
    );
    if (!response1.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const user = await response1.json();
    const role = user.role;
    const response2 = await fetch(
      `http://localhost:3000/api/getUser?id=${id}&table=${role}s`
    );
    if (!response2.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const userData = await response2.json();
    if (role === "Teacher") {
      return userData.public_profile;
    }
    return true;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function searchBySubcategory(subcategoria) {
  alert("Seleccionaste la subcategoría:" + subcategoria);
}

function toggleSubcategories(category, title) {
  const allSubcategories = document.querySelectorAll(".blog-subcategories");
  allSubcategories.forEach((subcategory) => {
    subcategory.style.display = "none";
    subcategory.classList.remove("d-flex", "flex-wrap");
    subcategory.querySelectorAll(".blog-categories").forEach((sub) => {
      sub.addEventListener("click", function () {
        searchBySubcategory(sub.textContent);
      });
    });
  });
  const subcategories = document.getElementById(category);
  document.getElementById("categories_title").innerHTML = title;
  document.getElementById("subcategories").style.display = "block";
  document.getElementById(category).classList.add("d-flex", "flex-wrap");
  subcategories.style.display = "block";
}

fetchData(1);
