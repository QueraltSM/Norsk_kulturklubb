var userLoggedInID = localStorage.getItem("userLoggedInID");
var userLoggedInRole = localStorage.getItem("userLoggedInRole");

if (userLoggedInRole=="Teacher") {
  fetch(`http://localhost:3000/api/getTeacher?id=${userLoggedInID}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta del servidor.");
    }
    return response.json();
  })
  .then((teacher) => {
    if (teacher.profile_picture == undefined) teacher.profile_picture = "/assets/img/user.png";
    if (teacher.teacher_name != undefined) teacher.teacher_name = document.getElementById("teacher_name").innerHTML = teacher.name;
    if (teacher.about_teacher != undefined) teacher.about_teacher = document.getElementById("about_teacher").innerHTML = teacher.about_teacher;
    if (teacher.about_classes != undefined) teacher.about_classes = document.getElementById("about_classes").innerHTML = teacher.about_classes;
    if (teacher.class_location != undefined) teacher.class_location = document.getElementById("class_location").innerHTML = teacher.class_location;
    if (teacher.class_prices != undefined) teacher.class_prices = document.getElementById("class_prices").innerHTML = teacher.class_prices;
    if (teacher.contact_information != undefined) teacher.contact_information = document.getElementById("contact_information").innerHTML = teacher.contact_information;   
    document.getElementById("teacher_image").src = teacher.profile_picture;
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });
}

function saveUserData() {
  var about_teacher = document.getElementById("about_teacher").innerHTML;
  alert(about_teacher);
}