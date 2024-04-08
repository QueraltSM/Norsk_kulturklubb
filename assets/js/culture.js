const cultureEntries = document.getElementById("culture_entries");

fetch("http://localhost:3000/api/getCultureEntries")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    return response.json();
  })
  .then((data) => {
    var entered = false;
    data.Items.forEach((cultureData) => {
      getUser(cultureData.user_id).then((result) => {
        if (result) {
          entered = true;
          const cultureCard = document.createElement("div");
          cultureCard.classList.add("col-md-6", "d-flex", "align-items-stretch");
          const postLink = document.createElement("a");
          postLink.href = "#";
          postLink.style.textDecoration = "none";
          postLink.addEventListener("click", function() {
            loadPostDetails(cultureData.ID, cultureData.title);
          });
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
          titleLink.href = "#";
          titleLink.textContent = cultureData.title;
          titleLink.style.color = "black";
          titleLink.style.textDecoration = "none";
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
    
          postLink.appendChild(card);
          cultureCard.appendChild(postLink);
          cultureEntries.appendChild("<br><br>");
          cultureEntries.appendChild(cultureCard);
        }
      });
      if (!entered) {
        setNoPosts();
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

  function setNoPosts() {
    const noDataDiv = document.createElement("div");
    noDataDiv.classList.add("col-md-12", "text-center", "mt-5");
    noDataDiv.style.paddingTop = "0"; // Eliminar el padding top
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
  localStorage.setItem('postID', postId);
  localStorage.setItem('postTitle', postTitle);
  window.location.href = 'post.html';
}

document.getElementById("searchInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    performSearch();
  }
});
function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const cultureCards = document.querySelectorAll(".col-md-6");
  cultureCards.forEach(function(card) {
    const title = card.querySelector(".card-title a").textContent.toLowerCase();
    const description = card.querySelector(".card-text").textContent.toLowerCase();
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.visibility = "visible";
    } else {
      card.style.visibility = "hidden";
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
    throw error; // Re-throw the error to handle it in the calling function
  }
}
