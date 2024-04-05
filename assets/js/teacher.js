alert(`http://localhost:3000/api/getUser?id=${localStorage.getItem('teacherID')}&table=Teachers`)
fetch(`http://localhost:3000/api/getUser?id=${localStorage.getItem('teacherID')}&table=Teachers`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to get server response.");
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
    alert("Error al obtener los datos:"+ error);
  });