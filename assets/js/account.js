var userLoggedInID = localStorage.getItem("userLoggedInID");
var userLoggedInRole = localStorage.getItem("userLoggedInRole");

userLoggedInRole = "Teacher";

if (userLoggedInRole == "Teacher") {
  document.getElementById("teacher-account").style.display = "flex";
} else if (userLoggedInRole == "Student") {
  document.getElementById("student-account").style.display = "flex";
} else {
  document.getElementById("collaborator-account").style.display = "flex";
}

getBasicInformation();
getInformationByRole();

function getBasicInformation() {
  fetch(
    `http://localhost:3000/api/getUser?id=${userLoggedInID}&table=Users`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("No response could be obtained from the server");
      }
      return response.json();
    })
    .then((user) => {
      
      if (user.first_name != undefined) {
        if (userLoggedInRole == "Student") document.getElementById("student_name").innerHTML = user.first_name;
        if (userLoggedInRole == "Teacher") document.getElementById("teacher_name").innerHTML = user.first_name;
        if (userLoggedInRole == "Collaborator") document.getElementById("collaborator_name").innerHTML = user.first_name;
      }

      if (user.email != undefined) {
        if (userLoggedInRole == "Student") document.getElementById("student_email").innerHTML = user.email;
        if (userLoggedInRole == "Teacher") document.getElementById("teacher_email").innerHTML = user.email;
        if (userLoggedInRole == "Collaborator") document.getElementById("collaborator_email").innerHTML = user.email;
      }

    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}

function getInformationByRole() {
  fetch(
    `http://localhost:3000/api/getUser?id=${userLoggedInID}&table=${userLoggedInRole + "s"}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("No response could be obtained from the server");
      }
      return response.json();
    })
    .then((user) => {
      if (userLoggedInRole == "Teacher") {
        if (user.profile_picture == undefined)
          user.profile_picture = "/assets/img/user.png";
        if (user.first_name != undefined)
          document.getElementById("teacher_name").innerHTML = user.first_name;
        if (user.about_teacher != undefined)
          document.getElementById("about_teacher").value = user.about_teacher;
        if (user.about_classes != undefined)
          document.getElementById("about_classes").value = user.about_classes;
        if (user.class_location != undefined)
          document.getElementById("class_location").value =
            user.class_location;
        if (user.class_prices != undefined)
          document.getElementById("class_prices").value = user.class_prices;
        if (user.contact_information != undefined)
          document.getElementById("contact_information").value =
            user.contact_information;
        if (user.public_profile != undefined)
          document.getElementById("public_profile").checked = user.public_profile;
        document.getElementById("teacher_image").src = user.profile_picture;
      
      
      } else if (userLoggedInRole == "Student") {

        if (user.hobbies_and_interests != undefined) document.getElementById("student_hobbies_and_interests").innerHTML = user.hobbies_and_interests;
        var selectElement = document.getElementById("student_language_level");
        for (var i = 0; i < selectElement.options.length; i++) {
            var option = selectElement.options[i];
            if (option.value === user.language_level) {
                option.selected = true;
                break;
            }
        }
      
        } else {
        if (user.biography != undefined) document.getElementById("collaborator_biography").innerHTML = user.biography;
        if (user.contact != undefined) document.getElementById("collaborator_contact").innerHTML = user.contact;
      }


    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}



function checkDataFields() {
  var about_teacher = document.getElementById("about_teacher").innerHTML.trim();
  var about_classes = document.getElementById("about_classes").innerHTML.trim();
  var class_location = document
    .getElementById("class_location")
    .innerHTML.trim();
  var class_prices = document.getElementById("class_prices").innerHTML.trim();
  var contact_information = document
    .getElementById("contact_information")
    .innerHTML.trim();
  if (
    about_teacher == "" ||
    about_classes == "" ||
    class_location == "" ||
    class_prices == "" ||
    contact_information == ""
  ) {
    showAlert(
      "danger",
      "You must fill out all fields to make your profile public",
      "alertContainer",
      3000
    );
    return false;
  }
  return true;
}

function updateUserData(userData, table) {
  var request = {
    userData: userData,
    table: table,
  };
  fetch(`http://localhost:3000/api/updateUserData?id=${userLoggedInID}&table=${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.status === 200) {
      showAlert(
        "success",
        "Your personal information has been updated",
        "alertContainer",
        3000
      );
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
    var imageData = localStorage.getItem("profile_image");
    var blob = dataURItoBlob(imageData);
    var imageFile = new File([blob], "profile_image.png", {
      type: "image/png",
    });
    var formData = new FormData();
    formData.append("image", imageFile);
    var filename =
      userLoggedInID +
      "." +
      imageData.split(":")[1].split(";")[0].split("/")[1];

    const response = await fetch(
      `http://localhost:3000/api/updateProfileImage?filename=${encodeURIComponent(
        filename
      )}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    showAlert(
      "danger",
      "Failed to update profile image",
      "alertContainer",
      3000
    );
    return "";
  }
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var intArray = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeString });
}

function updateProfile() {

  if (userLoggedInRole == "Teacher") {
    console.log("teacher");
  } else if (userLoggedInRole == "Student") {
    console.log("student");
  } else {

    var collaborator_name = document.getElementById("collaborator_name").innerHTML.trim();
    var collaborator_email = document.getElementById("collaborator_email").innerHTML.trim();

    if (!collaborator_name || !collaborator_email) {
      showAlert(
        "danger",
        "Both name and email are required fields and cannot be empty",
        "alertContainer",
        3000
      );
    } else {
      var userData = {
        email: collaborator_email,
        first_name: collaborator_name,
        biography: document.getElementById("collaborator_biography").value.trim()
      };
      updateUserData(userData, "Collaborators")
    }
  }

  /*if (!document.getElementById("profile_picture").files[0]) {
    showAlert(
      "danger",
      "You must select a profile picture to make your profile public",
      "alertContainer",
      3000
    );
  } else {
    if (checkDataFields()) {
      updateProfileImage()
        .then((imageUrl) => {
          var userData = {
            about_classes: document.getElementById("about_classes").innerHTML,
            about_teacher: document.getElementById("about_teacher").innerHTML,
            class_location: document.getElementById("class_location").innerHTML,
            class_prices: document.getElementById("class_prices").innerHTML,
            contact_information: document.getElementById("contact_information")
              .innerHTML,
            public_profile: document.getElementById("public_profile").checked,
            profile_picture: imageUrl,
          };
          updateUserData(userData);
        })
        .catch((error) => {
          showAlert(
            "danger",
            "Failed to update profile image",
            "alertContainer",
            3000
          );
        });
    }
  } */
}

function deleteAccount() {
  var imageData = localStorage.getItem("profile_image");
  var image = "";
  userLoggedInRole += "s";
  if (imageData != null) {
    var blob = dataURItoBlob(imageData);
    var imageFile = new File([blob], "profile_image.png", {
      type: "image/png",
    });
    var formData = new FormData();
    formData.append("image", imageFile);
    var filename =
      userLoggedInID +
      "." +
      imageData.split(":")[1].split(";")[0].split("/")[1];
    image = `&profile_picture=${filename}`;
  }
  fetch(
    `http://localhost:3000/api/deleteUser?id=${userLoggedInID}&role=${userLoggedInRole}` +
      image,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => {
    if (response.status === 200) {
      showAlert(
        "success",
        "Your account was removed sucessfully",
        "alertContainer",
        3000
      );
      setTimeout(() => {
        document.getElementById("handleUserMenuLink").style.display = "none";
        document.getElementById("loginBtn").style.display = "block";
        localStorage.setItem("isLoggedIn", false);
        window.location.href = "/index.html";
      }, 3000);
    } else if (response.status === 500) {
      showAlert(
        "danger",
        "An issue occurred while deleting the account",
        "alertContainer",
        5000
      );
    }
  });
}
