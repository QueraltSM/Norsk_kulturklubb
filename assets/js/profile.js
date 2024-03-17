var userLoggedInID = localStorage.getItem("userLoggedInID");
var userLoggedInRole = localStorage.getItem("userLoggedInRole");

if (userLoggedInRole=="Teacher") {
  fetch(`http://localhost:3000/api/getTeacher?id=${userLoggedInID}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    return response.json();
  })
  .then((teacher) => {
    if (teacher.profile_picture == undefined) teacher.profile_picture = "/assets/img/user.png";
    if (teacher.name != undefined) teacher.teacher_name = document.getElementById("teacher_name").innerHTML = teacher.name;
    if (teacher.about_teacher != undefined) teacher.about_teacher = document.getElementById("about_teacher").innerHTML = teacher.about_teacher;
    if (teacher.about_classes != undefined) teacher.about_classes = document.getElementById("about_classes").innerHTML = teacher.about_classes;
    if (teacher.class_location != undefined) teacher.class_location = document.getElementById("class_location").innerHTML = teacher.class_location;
    if (teacher.class_prices != undefined) teacher.class_prices = document.getElementById("class_prices").innerHTML = teacher.class_prices;
    if (teacher.contact_information != undefined) teacher.contact_information = document.getElementById("contact_information").innerHTML = teacher.contact_information;   
    if (teacher.public_profile != undefined) document.getElementById("public_profile").checked = teacher.public_profile;   
    document.getElementById("teacher_image").src = teacher.profile_picture;
  })
  .catch((error) => {
    console.error("Error al obtener los datos:", error);
  });
}

function checkDataFields() {
  var about_teacher = document.getElementById("about_teacher").innerHTML.trim();
  var about_classes = document.getElementById("about_classes").innerHTML.trim();
  var class_location = document.getElementById("class_location").innerHTML.trim();
  var class_prices = document.getElementById("class_prices").innerHTML.trim();
  var contact_information = document.getElementById("contact_information").innerHTML.trim();
  if (about_teacher == "" || about_classes == "" || class_location == "" || class_prices == "" || contact_information == "") {
    showAlert("danger", "You must fill out all fields to make your profile public", "alertContainer", 3000);
    return false;
  }
  if (document.getElementById("profile_picture").files[0]) {
    alert(JSON.stringify(document.getElementById("profile_picture").files[0]))
    return true;
  } else {
    showAlert("danger", "You must select a profile picture to make your profile public", "alertContainer", 3000);
    return false;
  }
}

function saveUserData() {
  var userData = {
    about_classes: document.getElementById("about_classes").innerHTML,
    about_teacher: document.getElementById("about_teacher").innerHTML,
    class_location: document.getElementById("class_location").innerHTML,
    class_prices: document.getElementById("class_prices").innerHTML,
    contact_information: document.getElementById("contact_information").innerHTML,
    public_profile: document.getElementById("public_profile").checked,
  };
  if (checkDataFields()) {
    var request = {
      userData: userData,
      table: "Teachers"
    };
    fetch(`http://localhost:3000/api/updateUserData?id=${userLoggedInID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then((response) => {
      if (response.status === 200) {
        //updateProfileImage()
      } else if (response.status === 500) {
        showAlert(
          "danger",
          "There was an error while updating your information",
          "alertContainer",
          5000
        );
      }
    });
  }
}

function updateProfileImage() {
  var image = document.getElementById("profile_picture").files[0];
  
  var formData = new FormData();
  formData.append('image', image);

  var filename = userLoggedInID + "." +  image.type.split('/')[1];
  fetch(`http://localhost:3000/api/updateProfileImage?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    return response.json();
  })
  .then(data => {
    console.log('Image uploaded successfully:', data.imageUrl);
    showAlert("success", "Your personal information has been updated", "alertContainer", 3000);
  })
  .catch(error => {
    console.error('Error uploading image:', error);
    showAlert("danger", "Failed to update profile image", "alertContainer", 3000);
  });
}