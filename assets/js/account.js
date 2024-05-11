var userLoggedInID = localStorage.getItem("userLoggedInID");
var userLoggedInRole = localStorage.getItem("userLoggedInRole");
var teacher_photo = false;

document.getElementById(userLoggedInRole.toLowerCase() + "-account").style.display = "flex";

getBasicInformation();
getInformationByRole();

function getBasicInformation() {
  fetch(`/api/getUser?id=${userLoggedInID}&table=Users`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No response could be obtained from the server");
      }
      return response.json();
    })
    .then((user) => {
      if (user.first_name != undefined) document.getElementById(userLoggedInRole.toLowerCase() + "_name").innerHTML = user.first_name;
      if (user.email != undefined) document.getElementById(userLoggedInRole.toLowerCase() + "_email").innerHTML = user.email;
    })
    .catch((error) => {
      console.error("Error retrieving data", error);
    });
}

function getInformationByRole() {
  fetch(`/api/getUser?id=${userLoggedInID}&table=${userLoggedInRole + "s"}`)
    .then((response) => {
      if (!response.ok) throw new Error("No response could be obtained from the server");
      return response.json();
    })
    .then((user) => {
      if (userLoggedInRole == "Teacher") {
        if (user.profile_picture == undefined) user.profile_picture = "/assets/img/user.png";
        else teacher_photo = true;
        if (user.short_description != undefined) document.getElementById("short_description").innerHTML = user.short_description;
        if (user.about_teacher != undefined) document.getElementById("about_teacher").value = user.about_teacher;
        if (user.about_classes != undefined) document.getElementById("about_classes").value = user.about_classes;
        if (user.city_residence != undefined) document.getElementById("city_residence").innerHTML = user.city_residence;
        if (user.teaching_in_person != undefined) document.getElementById("teaching_in_person").checked = user.teaching_in_person;
        if (user.teaching_online != undefined) document.getElementById("teaching_online").checked = user.teaching_online;
        if (user.class_location != undefined) document.getElementById("class_location").value = user.class_location;
        if (user.class_prices != undefined) document.getElementById("class_prices").value = user.class_prices;
        if (user.contact_information != undefined)
          document.getElementById("contact_information").value =
            user.contact_information;
        if (user.url_link !== undefined) document.getElementById("url_link").innerHTML = user.url_link.replace(/-/g, " ");
        if (user.public_profile != undefined)
          document.getElementById("teacher_public_profile").checked =
            user.public_profile;
        document.getElementById("teacher_image").src = user.profile_picture;
      } else if (userLoggedInRole == "Student") {
        if (user.hobbies_and_interests != undefined)
          document.getElementById("student_hobbies_and_interests").innerHTML =
            user.hobbies_and_interests;
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
        if (user.public_profile != undefined) document.getElementById("collaborator_public_profile").checked = user.public_profile;
      }
    })
    .catch((error) => {
      console.error("Error retrieving data", error);
    });
}

function updateUserData(userData, table) {
  var request = {
    userData: userData,
    table: table,
  };
  fetch(
    `/api/updateUserData?id=${userLoggedInID}&table=${table}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then((response) => {
    if (response.status === 200) {
      showAlert(
        "success",
        "Your personal information has been updated"
      );
    } else if (response.status === 500) {
      showAlert(
        "danger",
        "There was an error while updating your information"
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
      userLoggedInID + "." + imageData.split(":")[1].split(";")[0].split("/")[1];
    const response = await fetch(
      `/api/updateProfileImage?filename=${encodeURIComponent(
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
      "Failed to update profile image"
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
    var teacher_name = document.getElementById("teacher_name").innerHTML;
    var teacher_email = document.getElementById("teacher_email").innerHTML;
    var short_description = document.getElementById("short_description").innerHTML;
    var city_residence = document.getElementById("city_residence").innerHTML;
    var about_classes = document.getElementById("about_classes").value;
    var about_teacher = document.getElementById("about_teacher").value;
    var class_location = document.getElementById("class_location").value;
    var class_prices = document.getElementById("class_prices").value;
    var contact_information = document.getElementById("contact_information").value;
    var url_link = document.getElementById("url_link").innerHTML;
    if (document.getElementById("profile_picture").files[0]) teacher_photo = true;
    if (document.getElementById("teacher_public_profile").checked) {
      if (!teacher_name ||
        !teacher_email ||
        !about_classes ||
        !about_teacher ||
        !class_location ||
        !class_prices ||
        !contact_information ||
        !short_description ||
        !city_residence ||
        !url_link) {
        showAlert(
          "danger",
          "All fields are required to have a public profile."
        );
      } else if (!teacher_photo) {
        showAlert(
          "danger",
          "You must select a profile picture to make your profile public"
        );
      } else {
        saveTeacher();
      }
    } else {
      saveTeacher();
    }
  } else if (userLoggedInRole == "Student") {
    var name = document.getElementById("student_name").innerHTML.trim();
    var email = document.getElementById("student_email").innerHTML.trim();
    var hobbies_and_interests =  document.getElementById("student_hobbies_and_interests").value.trim();
    var language_level = document.getElementById("student_language_level").value;
    if (!name || !email) {
      showAlert(
        "danger",
        "Your name or email can not be empty"
      );
    } else {
      saveStudent(name, email, hobbies_and_interests, language_level);
    }
  } else {
    var name = document.getElementById("collaborator_name").innerHTML.trim();
    var email = document.getElementById("collaborator_email").innerHTML.trim();
    var biography =  document.getElementById("collaborator_biography").value.trim();
    var contact =  document.getElementById("collaborator_contact").innerHTML.trim();
    var public_profile =  document.getElementById("collaborator_public_profile").checked;
    if (public_profile) {
      if (!name || !email || !biography || !contact) {
        showAlert(
          "danger",
          "Public profile requires all fields to be completed"
        );
      } else {
        saveCollaborator(email, name, biography, contact, public_profile);
      }
    } else {
      saveCollaborator(email, name, biography, contact, public_profile);
    }
  }
}

function saveStudent(name, email, hobbies_and_interests, language_level) {
  updateUserData({
    email: email,
    first_name: name,
  }, "Users");
  updateUserData({
    hobbies_and_interests: hobbies_and_interests,
    language_level: language_level
  }, "Students");
}

function saveCollaborator(email, name, biography, contact, public_profile) {
  updateUserData({
    email: email,
    first_name: name,
  }, "Users");
  updateUserData({
    biography: biography,
    contact: contact,
    public_profile: public_profile
  }, "Collaborators");
}

async function saveTeacher() {
  var teacher_name = document.getElementById("teacher_name").innerHTML;
  var teacher_email = document.getElementById("teacher_email").innerHTML;
  var short_description = document.getElementById("short_description").innerHTML;
  var city_residence = document.getElementById("city_residence").innerHTML;
  var about_classes = document.getElementById("about_classes").value;
  var about_teacher = document.getElementById("about_teacher").value;
  var class_location = document.getElementById("class_location").value;
  var class_prices = document.getElementById("class_prices").value;
  var contact_information = document.getElementById("contact_information").value;
  var url_link = document.getElementById("url_link").innerHTML.toLowerCase().replace(/[.,]/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, "-").replace(/-{2,}/g, "-");

  var userData = {
    first_name: teacher_name,
    email: teacher_email,
  };
  updateUserData(userData, "Users");
  localStorage.setItem("user_first_name", teacher_name);
  var userData = {
    about_classes: about_classes,
    about_teacher: about_teacher,
    class_location: class_location,
    class_prices: class_prices,
    contact_information: contact_information,
    short_description: short_description,
    city_residence: city_residence,
    teaching_in_person:  document.getElementById("teaching_in_person").checked,
    teaching_online:  document.getElementById("teaching_online").checked,
    url_link: url_link,
    public_profile: document.getElementById("teacher_public_profile").checked,
  };
  if (document.getElementById("profile_picture").files[0]) {
    await updateProfileImage().then((imageUrl) => {
      userData.profile_picture = imageUrl;
    });
  }
  updateUserData(userData, "Teachers");
}

function deleteAccount() {
  var error = false;
  if (userLoggedInRole == "Teacher") {
    if (!deleteLessons()) error = true;
    if (!deleteCulturePosts()) error = true;
  }
  if (!error) {
    deleteUser();
  } else {
    errorDeletion();
  }
}

function successDeletion() {
  showAlert(
    "success",
    "Your account was removed sucessfully"
  );
  setTimeout(() => {
    document.getElementById("handleUserMenuLink").style.display = "none";
    document.getElementById("loginBtn").style.display = "block";
    localStorage.setItem("isLoggedIn", false);
    window.location.href = "/index.html";
  }, 3000);
}

function errorDeletion() {
  showAlert(
    "danger",
    "An issue occurred while deleting the account"
  );
}

function deleteProfileImage() {
  var imageData = localStorage.getItem("profile_image");
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
    fetch(
      `/api/deleteFromS3?folder=Users&url=${filename}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      if (response.status !== 200) {
        errorDeletion();
      }
    });
  }
}

async function deleteLessons() {
  try {
    const response = await fetch("/api/getAllContents?table=Lessons");
    if (!response.ok) {
      throw new Error("Failed to fetch lessons");
    }
    const data = await response.json();
    data.Items.forEach(async (lesson) => {
      if (lesson.teacher_id === userLoggedInID) {
        const response = await fetch("/api/deleteLesson", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: lesson.ID,
            content_url: lesson.content_url.substring(
              lesson.content_url.lastIndexOf("/") + 1
            ),
            image_url: lesson.image_url.substring(
              lesson.image_url.lastIndexOf("/") + 1
            ),
          }),
        });
        return response.status === 200;
      }
    });
  } catch (error) {
    console.error("Error fetching:", error);
  }
}

async function deleteCulturePosts() {
  try {
    const response = await fetch("/api/getAllContents?table=Culture");
    if (!response.ok) {
      throw new Error("Failed to fetch lessons");
    }
    const data = await response.json();
    data.Items.forEach(async (post) => {
      if (post.user_id === userLoggedInID) {
        const response = await fetch(
          "/api/deleteCulture",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: post.ID,
              content_url: post.image.substring(
                post.image.lastIndexOf("/") + 1
              ),
            }),
          }
        );
        return response.status === 200;
      }
    });
  } catch (error) {
    console.error("Error fetching:", error);
  }
}

async function deleteUser() {
  const response = await fetch(
    `/api/deleteUser?id=${userLoggedInID}&role=${userLoggedInRole} + "s"`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    errorDeletion();
  } else {
    successDeletion();
  }
}
