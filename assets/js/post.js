let cultureID = localStorage.getItem("contentID");
const culture_entry = document.getElementById("culture_entry");
document.getElementById("contentTitle").innerHTML = localStorage.getItem("contentTitle");

fetch(`/api/getCulture?id=${cultureID}`)
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
    img.style.maxWidth = "100%"; 
    img.src = cultureData.image;
    cardImg.style.borderRadius = "10px";

    cardImg.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.style.borderColor = "#9C3030";

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerHTML  = cultureData.description;
    cardText.style.textAlign = "justify";
    cardText.style.fontSize = "13px";

    const dateText = document.createElement("p");
    dateText.textContent = "Published on " + cultureData.pubdate.split(" ")[0];
    dateText.style.color = "#777";
    dateText.style.fontSize = "13px";
    dateText.style.textAlign = "center";
    cardBody.appendChild(cardText);
    cardBody.appendChild(dateText);

    getUser(cultureData.user_id).then((result) => {
      const userDetailsSection = document.createElement("section");
      userDetailsSection.classList.add("user-details");
      const authorTitle = document.createElement("h3");
      authorTitle.textContent = "About " + result[0];
      const authorLink = document.createElement("a");
      authorLink.href = "#";
      authorLink.onclick = function () {
        localStorage.setItem("userInfo", result);
        window.location.href = "user_details.html";
      };
      const authorText = document.createElement("p");
      authorText.classList.add("card-text");
      authorText.innerHTML = result[1];
      authorText.style.textAlign = "justify";
      authorText.style.fontSize = "13px";
      userDetailsSection.appendChild(authorTitle);
      userDetailsSection.appendChild(authorLink);
      authorLink.appendChild(authorText);
      cardBody.appendChild(userDetailsSection);
    });

    cardBody.style.borderRadius = "10px";

    card.appendChild(cardImg);
    card.appendChild(cardBody);

    cultureCard.appendChild(card);
    culture_entry.appendChild(cultureCard);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

async function getUser(id) {
  try {
    const response1 = await fetch(
      `/api/getUser?id=${id}&table=Users`
    );
    if (!response1.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const user = await response1.json();
    const name = user.first_name;
    const role = user.role;

    const response2 = await fetch(
      `/api/getUser?id=${id}&table=${role}s`
    );
    if (!response2.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const userData = await response2.json();
    var user_info = userData.biography;
    if (role === "Teacher") {
      user_info = userData.about_teacher;
    }
    return [name, user_info];
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
