const rowContainer = document.createElement("div");
rowContainer.classList.add("row");

const cultureEntries = document.getElementById("culture_entries");

const cultureCardsContainer = document.createElement("div");
cultureCardsContainer.classList.add("col-8");

var culture = [];

async function fetchData() {
  try {
    const response = await fetch("/api/getAllContents?table=Culture");
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const data = await response.json();
    var entered = false;
    culture = data.Items;
    culture = sortByDate(culture);
    cultureCardsContainer.innerHTML = "";
    for (let i = 0; i < culture.length; i++) {
      try {
        const cultureData = culture[i];
        const user = await getUser(cultureData.user_id);
        if (user.public_profile) {
          entered = true;
          const cultureCard = document.createElement("div");
          cultureCard.id = cultureData.ID;
          cultureCard.classList.add("card");
          cultureCard.classList.add("mb-3");
          const postLink = document.createElement("a");
          postLink.href = "#";
          postLink.style.textDecoration = "none";
          postLink.addEventListener("click", function () {
            window.location.href = "/Culture/" + cultureData.url_link;
          });
          const cardImg = document.createElement("img");
          cardImg.src = cultureData.image_url;
          cardImg.classList.add("card-img-top");
          cardImg.style.width = "100%";
          cardImg.style.height = "400px";
          cardImg.style.objectFit = "cover";
          cardImg.style.transition = "none";
          cardImg.style.filter = "none";
          cardImg.style.transform = "none";

          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          cardBody.style.backgroundColor = "#fff";
          cardBody.style.padding = "50px";
          cardBody.style.textAlign = "justify";
          cardBody.style.boxShadow = "0px 10px 15px -10px rgba(0, 0, 0, 0.1)";

          const cardTitle = document.createElement("h5");
          cardTitle.classList.add("card-title");
          cardTitle.textContent = cultureData.title;
          cardTitle.style.color = "#000000";
          cardTitle.style.textDecoration = "none";
          cardTitle.style.textAlign = "justify";
          cardTitle.style.transition = "color 0.3s";
          cultureCard.addEventListener("mouseover", function () {
            cardTitle.style.color = "#9C3030";
          });
          cultureCard.addEventListener("mouseout", function () {
            cardTitle.style.color = "#000000";
          });

          const dateContainer = document.createElement("div");
          const daySpan = document.createElement("span");
          daySpan.textContent = formatDateBlog(
            cultureData.pubdate.split(" ")[0]
          ).split(" ")[0];
          daySpan.style.fontWeight = "bold";

          const monthSpan = document.createElement("span");
          monthSpan.textContent = formatDateBlog(
            cultureData.pubdate.split(" ")[0]
          ).split(" ")[1];
          monthSpan.style.fontWeight = "normal";

          dateContainer.appendChild(daySpan);
          dateContainer.appendChild(document.createElement("br"));
          dateContainer.appendChild(monthSpan);
          dateContainer.classList.add("date-container");

          dateContainer.style.backgroundColor = "#9C3030";
          dateContainer.style.color = "#FFFFFF";
          dateContainer.style.fontSize = "15px";
          dateContainer.style.width = "fit-content";
          dateContainer.style.padding = "15px 25px";
          dateContainer.style.borderRadius = "5px";
          dateContainer.style.display = "inline-block";
          dateContainer.style.position = "absolute";
          dateContainer.style.transform = "translate(-50%, -50%)";
          dateContainer.style.textAlign = "center";

          cardBody.style.position = "relative";

          dateContainer.style.position = "absolute";
          dateContainer.style.top = "-50px";
          dateContainer.style.left = "10%";
          dateContainer.style.transform = "translateX(-50%)";

          const minReadText = document.createElement("span");
          minReadText.classList.add("d-inline-block", "align-middle");
          const iconElement = document.createElement("i");
          iconElement.classList.add("bi", "bi-clock");
          minReadText.appendChild(iconElement);

          const textNode = document.createTextNode(
            "\u00A0" + cultureData.min_read + " min read"
          );

          minReadText.appendChild(textNode);

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
      cultureEntries.innerHTML = noData("There is no post published at the moment");
    } else {
      document.getElementById("search_container").style.display = "block";
      document.getElementById("categories_container").style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

rowContainer.appendChild(cultureCardsContainer);
const searchContainer = document.createElement("div");
searchContainer.classList.add("col-4");
searchContainer.innerHTML = `
<div id="search_container" class="container" style="background-color: #f9faf9;padding:5px;border-radius: 5px;display:none">
<form class="d-flex justify-content-end" style="border: none;background-color: #f9faf9;">
<div class="input-group">
<span class="input-group-text" style="background-color: transparent; border: none;">
  <i class="bi bi-search" style="font-size: 13px;"></i>
</span>
<input type="text" class="form-control" placeholder="Search for posts..." id="searchInput" style="background-color: #f9faf9;font-size: 13px;">
<i class="bi bi-x" style="font-size: 20px;" onclick="clearSearch();" ></i>
</div>
</form>
</div>
<div id="categories_container" class="container mt-3" style="padding: 5px; border-radius: 5px;display:none">
<h5 style="font-weight: bold;">Categories</h5>
<div class="d-flex flex-wrap">
  <span id="category-History and traditions" class="select-categories" onclick="toggleSubcategories('History and traditions','History and traditions')">History and traditions</span>
  <span id="category-Art and literature" class="select-categories" onclick="toggleSubcategories('Art and literature','Art and literature')">Art and literature</span>
  <span id="category-Nature and landscapes" class="select-categories" onclick="toggleSubcategories('Nature and landscapes', 'Nature and landscapes')">Nature and landscapes</span>
  <span id="category-Gastronomy" class="select-categories" onclick="toggleSubcategories('Gastronomy','Gastronomy')">Gastronomy</span>
  <span id="category-Lifestyle and society" class="select-categories" onclick="toggleSubcategories('Lifestyle and society','Lifestyle and society')">Lifestyle and society</span>
  <span id="category-Travel and tourism" class="select-categories" onclick="toggleSubcategories('Travel and tourism','Travel and tourism')">Travel and tourism</span>
  <span id="category-Language and linguistics" class="select-categories" onclick="toggleSubcategories('Language and linguistics','Language and linguistics')">Language and linguistics</span>
  <span id="category-Events and festivals" class="select-categories" onclick="toggleSubcategories('Events and festivals','Events and festivals')">Events and festivals</span>
</div>
</div>
<div id="subcategories" class="container mt-3" style="padding: 5px; border-radius: 5px;display:none">
<h5 style="font-weight: bold;" id="categories_title"></h5>
<div class="d-flex flex-wrap">

<!-- History and traditions -->
<div class="blog-subcategories " id="History and traditions" style="display:none">
  <span id="subcategory-Norwegian history" class="select-categories">Norwegian history</span>
  <span id="subcategory-Mythology" class="select-categories">Mythology</span>
  <span id="subcategory-Traditional festivals and celebrations" class="select-categories">Traditional festivals and celebrations</span>
  <span id="subcategory-Customs and ceremonies" class="select-categories">Customs and ceremonies</span>
</div>

<!-- Art and literature -->
<div class="blog-subcategories" id="Art and literature" style="display:none">
  <span id="subcategory-Norwegian literature" class="select-categories">Norwegian literature</span>
  <span id="subcategory-Norwegian art and artists" class="select-categories">Norwegian art and artists</span>
  <span id="subcategory-Traditional and modern music" class="select-categories">Traditional and modern music</span>
  <span id="subcategory-Norwegian theater and cinema" class="select-categories">Norwegian theater and cinema</span>
</div>

<!-- Nature and landscapes -->
<div class="blog-subcategories" id="Nature and landscapes" style="display:none">
  <span id="subcategory-Fjords and mountains" class="select-categories">Fjords and mountains</span>
  <span id="subcategory-Norwegian fauna and flora" class="select-categories">Norwegian fauna and flora</span>
  <span id="subcategory-Outdoor sports and activities" class="select-categories">Outdoor sports and activities</span>
</div>

<!-- Gastronomy -->
<div class="blog-subcategories" id="Gastronomy" style="display:none">
  <span id="subcategory-Traditional norwegian dishes" class="select-categories">Traditional norwegian dishes</span>
  <span id="subcategory-Local ingredients and recipe" class="select-categories">Local ingredients and recipes</span>
  <span id="subcategory-Culinary customs and festivals" class="select-categories">Culinary customs and festivals</span>
</div>

<!--Lifestyle and society-->
<div class="blog-subcategories" id="Lifestyle and society" style="display:none">
  <span id="subcategory-Norwegian cultural values" class="select-categories">Norwegian cultural values</span>
  <span id="subcategory-Scandinavian fashion and design" class="select-categories">Scandinavian fashion and design</span>
  <span id="subcategory-Daily life and modern traditions" class="select-categories">Daily life and modern traditions</span>
</div>

<!-- Travel and tourism -->
<div class="blog-subcategories" id="Travel and tourism" style="display:none">
  <span id="subcategory-Tourist destinations in Norway" class="select-categories">Tourist destinations in Norway</span>
  <span id="subcategory-Travel tips for the country" class="select-categories">Travel tips for the country</span>
  <span id="subcategory-Unique experiences and adventures" class="select-categories">Unique experiences and adventures</span>
</div>

<!-- Language and linguistics -->
<div class="blog-subcategories" id="Language and linguistics" style="display:none">
  <span id="subcategory-Basic norwegian lessons" class="select-categories">Basic norwegian lessons</span>
  <span id="subcategory-Common expressions and phrases" class="select-categories">Common expressions and phrases</span>
  <span id="subcategory-Dialects and regional variations" class="select-categories">Dialects and regional variations</span>
</div>

<!-- Events and festivals -->
<div class="blog-subcategories" id="Events and festivals" style="display:none">
  <span id="subcategory-Cultural and artistic events" class="select-categories">Cultural and artistic events</span>
  <span id="subcategory-Music and film festivals" class="select-categories">Music and film festivals</span>
  <span id="subcategory-Traditional fairs and markets" class="select-categories">Traditional fairs and markets</span>
</div>
</div>
</div>
`;

rowContainer.appendChild(searchContainer);
cultureEntries.appendChild(rowContainer);

document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });

function clearSearch() {
  document.getElementById('searchInput').value='';
  document.getElementById('subcategories').style.display="none";
  performSearch();
}

function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const cultureCards = document.querySelectorAll(".card");
  cultureCards.forEach(function (card) {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
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

function toggleSubcategories(category, title) {
  const allSubcategories = document.querySelectorAll(".blog-subcategories");
  allSubcategories.forEach((subcategory) => {
    subcategory.style.display = "none";
    subcategory.classList.remove("d-flex", "flex-wrap");
    subcategory.querySelectorAll(".select-categories").forEach((sub) => {
      sub.addEventListener("click", function () {
        culture.forEach((entry) => {
          document.getElementById(entry.ID).style.display =
            entry.subcategory !== sub.textContent ? "none" : "block";
            if (title == "History and traditions") {
              document.getElementById("subcategory-Norwegian history").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Mythology").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Traditional festivals and celebrations").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Customs and ceremonies").classList.remove("select-categories-selected");
            } else if (title=="Art and literature") {
              document.getElementById("subcategory-Norwegian literature").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Norwegian art and artists").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Traditional and modern music").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Norwegian theater and cinema").classList.remove("select-categories-selected");
            } else if (title=="Nature and landscapes") {
              document.getElementById("subcategory-Fjords and mountains").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Norwegian fauna and flora").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Outdoor sports and activities").classList.remove("select-categories-selected");
            }  else if (title=="Gastronomy") {
              document.getElementById("subcategory-Traditional norwegian dishes").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Local ingredients and recipe").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Culinary customs and festivals").classList.remove("select-categories-selected");
            } else if (title=="Lifestyle and society") {
              document.getElementById("subcategory-Norwegian cultural values").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Scandinavian fashion and design").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Daily life and modern traditions").classList.remove("select-categories-selected");
            } else if (title=="Travel and tourism") {
              document.getElementById("subcategory-Tourist destinations in Norway").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Travel tips for the country").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Unique experiences and adventures").classList.remove("select-categories-selected");
            } else if (title=="Language and linguistics") {
              document.getElementById("subcategory-Basic norwegian lessons").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Common expressions and phrases").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Dialects and regional variations").classList.remove("select-categories-selected");
            } else if (title=="Events and festivals") {
              document.getElementById("subcategory-Cultural and artistic events").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Music and film festivals").classList.remove("select-categories-selected");
              document.getElementById("subcategory-Traditional fairs and markets").classList.remove("select-categories-selected");
            }
            document.getElementById("subcategory-"+sub.textContent).classList.add("select-categories-selected");
        });
      });
    });
  });

  const subcategories = document.getElementById(category);
  document.getElementById("categories_title").innerHTML = title;
  document.getElementById("subcategories").style.display = "block";
  document.getElementById(category).classList.add("d-flex", "flex-wrap");
  subcategories.style.display = "block";
  culture.forEach((entry) => {
    document.getElementById(entry.ID).style.display =
      entry.category !== category ? "none" : "block";
      document.getElementById("category-History and traditions").classList.remove("select-categories-selected");
      document.getElementById("category-Art and literature").classList.remove("select-categories-selected");
      document.getElementById("category-Nature and landscapes").classList.remove("select-categories-selected");
      document.getElementById("category-Gastronomy").classList.remove("select-categories-selected");
      document.getElementById("category-Lifestyle and society").classList.remove("select-categories-selected");
      document.getElementById("category-Travel and tourism").classList.remove("select-categories-selected");
      document.getElementById("category-Language and linguistics").classList.remove("select-categories-selected");
      document.getElementById("category-Events and festivals").classList.remove("select-categories-selected");
      document.getElementById("category-"+category).classList.add("select-categories-selected");
  });
}
fetchData();