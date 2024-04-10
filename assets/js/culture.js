const cultureEntries = document.getElementById("culture_entries");

async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/api/getCultureEntries");
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const data = await response.json();
    
    var entered = false;
    for (const cultureData of data.Items) {
      try {
        const result = await getUser(cultureData.user_id);
        if (result) {
          entered = true;

          const cultureCard = document.createElement("div");
          cultureCard.classList.add("col-6");
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
          titleLink.style.color = "#9C3030"; // Cambia el color del texto a #9C3030
          titleLink.style.textDecoration = "none";
          cardTitle.appendChild(titleLink);

          const dateText = document.createElement("p");
          dateText.textContent = cultureData.pubdate.split(" ")[0] + " · " + cultureData.min_read + " min read";
          dateText.style.color = "#666"; 
          dateText.style.fontSize = "11px";
          dateText.style.textAlign = "center";
          
          const cardText = document.createElement("p");
          cardText.classList.add("card-text");
          cardText.textContent = cultureData.short_description;
          cardText.style.textAlign = "center";
          cardText.style.fontSize = "13px";
          cardText.style.color = "#000000";
          
          cardBody.appendChild(cardTitle);
          cardBody.appendChild(cardText);
          cardBody.appendChild(dateText);
          
          card.appendChild(cardImg);
          card.appendChild(cardBody);
    
          postLink.appendChild(card);
          cultureCard.appendChild(postLink);
          cultureEntries.appendChild(document.createElement("br"));
          cultureEntries.appendChild(document.createElement("br"));
          cultureEntries.appendChild(cultureCard); 

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    if (!entered) {
      setNoPosts();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

  function setNoPosts() {
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
  const cultureCards = document.querySelectorAll(".col-6");
  cultureCards.forEach(function(card) {
    const title = card.querySelector(".card-title a").textContent.toLowerCase();
    const description = card.querySelector(".card-text").textContent.toLowerCase();
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

fetchData();