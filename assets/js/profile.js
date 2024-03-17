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
  return true;
}

function updateUserData(userData) {
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
          showAlert("success", "Your personal information has been updated", "alertContainer", 3000);
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

async function updateProfileImage() {
  try {
    var imageData = localStorage.getItem('profile_image');
    var blob = dataURItoBlob(imageData);
    var imageFile = new File([blob], 'profile_image.png', { type: 'image/png' });
    var formData = new FormData();
    formData.append('image', imageFile);
    var filename = userLoggedInID + "." +  imageData.split(':')[1].split(';')[0].split('/')[1];
    
    const response = await fetch(`http://localhost:3000/api/updateProfileImage?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    showAlert("danger", "Failed to update profile image", "alertContainer", 3000);
    return "";
  }
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var intArray = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeString });
}

function updateProfile() {
  if (!document.getElementById("profile_picture").files[0]) {
    showAlert("danger", "You must select a profile picture to make your profile public", "alertContainer", 3000);
  } else {
    if (checkDataFields()) {
      updateProfileImage().then(imageUrl => {
        var userData = {
          about_classes: document.getElementById("about_classes").innerHTML,
          about_teacher: document.getElementById("about_teacher").innerHTML,
          class_location: document.getElementById("class_location").innerHTML,
          class_prices: document.getElementById("class_prices").innerHTML,
          contact_information: document.getElementById("contact_information").innerHTML,
          public_profile: document.getElementById("public_profile").checked,
          profile_picture: imageUrl
        };
        updateUserData(userData);
      }).catch(error => {
        showAlert("danger", "Failed to update profile image", "alertContainer", 3000);
      });
    }
  }
}