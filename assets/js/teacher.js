if (localStorage.getItem("isLoggedIn") == "false") {
  window.location.href = "/Teachers";
}
var url = new URL(window.location.href).pathname.split('/')[2];
async function fetchData() {
  fetch("/api/getFromURL?url_link="+url+"&table=Teachers")
  .then(async (response) => {
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const teacher = await response.json();
    const user = await getUser(teacher.ID);
    document.getElementById("teacher_name").innerHTML = user.first_name;
    document.getElementById("teacher_image").src =
      teacher.profile_picture;
    document.getElementById("about_teacher").innerHTML =
      teacher.about_teacher;
    document.getElementById("about_class").innerHTML =
      teacher.about_classes;
    document.getElementById("teacher_place").innerHTML =
      teacher.class_location;
    document.getElementById("teacher_prices").innerHTML =
      teacher.class_prices;
    document.getElementById("teacher_contact").innerHTML =
      teacher.contact_information;
  })
  .catch((error) => {
    window.location.href = "/404.html";
  });
}
fetchData();