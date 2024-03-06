const urlParams = new URLSearchParams(window.location.search);
let teacherId = urlParams.get("aWQ");
teacherId = teacherId.substring(1);

fetch(`http://localhost:3000/api/getTeacher?id=${teacherId}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta del servidor.");
    }
    return response.json();
  })
  .then((teacher) => {
    document.getElementById("teacher_image").src =
      teacher.profile_picture;
    document.getElementById("teacher_name").innerHTML =
      "About " + teacher.name;
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
    console.error("Error al obtener los datos:", error);
  });