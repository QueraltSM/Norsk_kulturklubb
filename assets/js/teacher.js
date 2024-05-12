if (localStorage.getItem("isLoggedIn") == "false") {
  window.location.href = "/Teachers";
}
var url = new URL(window.location.href).pathname.split("/")[2];
async function fetchData() {
  fetch("/api/getFromURL?url_link=" + url + "&table=Teachers")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Failed to get server response.");
      }
      const teacher = await response.json();
      const user = await getUser(teacher.ID);
      document.getElementById("full_name").innerHTML = user.full_name;
      document.getElementById("teacher_image").src = teacher.profile_picture;
      document.getElementById("about_classes").innerHTML =
        teacher.about_classes;
      document.getElementById("class_location").innerHTML =
        teacher.class_location;
      document.getElementById("teacher_prices").innerHTML =
        teacher.class_prices;
      document.getElementById("contact_information").innerHTML =
        teacher.contact_information;
      document.getElementById("about_me").innerHTML = teacher.about_me;
      var teaching = "";
      if (teacher.teaching_in_person && teacher.teaching_online) {
        teaching = "(Online and in person)";
      } else {
        if (teacher.teaching_in_person) teaching += "(In person)";
        if (teacher.teaching_online) teaching += (teacher.teaching_in_person ? " and " : "") + "(Online)";
      }
      document.getElementById("city_residence").innerHTML = teacher.city_residence + " " + teaching; 
    })
    .catch((error) => {
      window.location.href = "/404.html";
    });
}
fetchData();
