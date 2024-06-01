if (localStorage.getItem("isLoggedIn") == "false") {
  window.location.href = "/";
}
var url = new URL(window.location.href).pathname.split("/")[2];
async function fetchData() {
  fetch("/api/getFromURL?url_link=" + url + "&table=Collaborators")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Failed to get server response.");
      }
      const collaborator = await response.json();
      if (!collaborator.public_profile) {
        window.location.href = "/404.html";
        return;
      }
      const user = await getUser(collaborator.ID);
      document.getElementById("full_name").innerHTML = user.full_name;
      document.getElementById("collaborator_image").src =
        collaborator.profile_picture;
      document.getElementById("contact").innerHTML =
        collaborator.contact;
      document.getElementById("about_me").innerHTML = collaborator.about_me;
    })
    .catch((error) => {
      window.location.href = "/404.html";
    });
}
fetchData();
