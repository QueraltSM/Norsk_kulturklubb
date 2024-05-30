var userLoggedInID = localStorage.getItem("userLoggedInID");
var userLoggedInRole = localStorage.getItem("userLoggedInRole");
var is_photo = false;
var current_image_url = "";

document.getElementById(
  userLoggedInRole.toLowerCase() + "-account"
).style.display = "flex";

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
      if (user.full_name != undefined)
        document.getElementById(
          userLoggedInRole.toLowerCase() + "_name"
        ).innerHTML = user.full_name;
      if (user.email != undefined)
        document.getElementById(
          userLoggedInRole.toLowerCase() + "_email"
        ).innerHTML = user.email;
      if (user.password != undefined)
          document.getElementById(
            userLoggedInRole.toLowerCase() + "_password"
          ).innerHTML = base64ToString(user.password);

    })
    .catch((error) => {
      console.error("Error retrieving data", error);
    });
}

function getInformationByRole() {
  fetch(`/api/getUser?id=${userLoggedInID}&table=${userLoggedInRole + "s"}`)
    .then((response) => {
      if (!response.ok)
        throw new Error("No response could be obtained from the server");
      return response.json();
    })
    .then((user) => {
      if (userLoggedInRole == "Teacher") {
        if (user.profile_picture == undefined || user.profile_picture == "") {
          user.profile_picture = "/assets/img/user.png";
        } else {
          is_photo = true;
          current_image_url = user.profile_picture;
        }
        document.getElementById("teacher_image").src = user.profile_picture;
        if (user.about_me != undefined)
          document.getElementById("teacher_about_me").innerHTML = user.about_me;
        if (user.about_classes != undefined)
          document.getElementById("about_classes").value = user.about_classes;
        if (user.city_residence != undefined)
          document.getElementById("city_residence").innerHTML =
            user.city_residence;
        if (user.teaching_in_person != undefined)
          document.getElementById("teaching_in_person").checked =
            user.teaching_in_person;
        if (user.teaching_online != undefined)
          document.getElementById("teaching_online").checked =
            user.teaching_online;
        if (user.class_location != undefined)
          document.getElementById("class_location").value = user.class_location;
        if (user.class_prices != undefined)
          document.getElementById("class_prices").value = user.class_prices;
        if (user.contact_information != undefined)
          document.getElementById("contact_information").value =
            user.contact_information;
        if (user.url_link !== undefined)
          document.getElementById("url_link_teacher").innerHTML = parseURL(
            user.url_link
          );
        if (user.public_profile != undefined)
          document.getElementById("teacher_public_profile").checked =
            user.public_profile;
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
        if (user.about_me != undefined)
          document.getElementById("collaborator_about_me").innerHTML =
            user.about_me;
        if (user.contact != undefined)
          document.getElementById("collaborator_contact").innerHTML =
            user.contact;
        if (user.public_profile != undefined)
          document.getElementById("collaborator_public_profile").checked =
            user.public_profile;
        if (user.url_link !== undefined)
          document.getElementById("url_link_collaborator").innerHTML = parseURL(
            user.url_link
          );
        if (user.profile_picture == undefined || user.profile_picture == "") {
          user.profile_picture = "/assets/img/user.png";
        } else {
          is_photo = true;
          current_image_url = user.profile_picture;
        }
        document.getElementById("collaborator_image").src =
          user.profile_picture;
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
  fetch(`/api/updateUserData?id=${userLoggedInID}&table=${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.status === 200) {
      window.location.href = "/Account";
    } else if (response.status === 500) {
      showAlert("danger", "There was an error while updating your information");
    }
  });
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

async function updateProfile() {
  if (userLoggedInRole == "Teacher") {
    var name = document.getElementById("teacher_name").innerHTML;
    var email = document.getElementById("teacher_email").innerHTML.trim();
    var password = document.getElementById("teacher_password").innerHTML.trim();
    var about_me = document.getElementById("teacher_about_me").innerHTML;
    var city_residence = document.getElementById("city_residence").innerHTML;
    var about_classes = document.getElementById("about_classes").value;
    var class_location = document.getElementById("class_location").value;
    var class_prices = document.getElementById("class_prices").value;
    var contact_information = document.getElementById(
      "contact_information"
    ).value;
    var url_link = formatURL(
      document.getElementById("url_link_teacher").innerHTML
    );
    var url_available = await check_availability_url_link(
      "Teachers",
      userLoggedInID,
      url_link
    );
    if (document.getElementById("profile_picture_teacher").files[0]) is_photo = true;
    if (document.getElementById("teacher_public_profile").checked) {
      if (
        !name ||
        !email ||
        !password ||
        !about_classes ||
        !class_location ||
        !class_prices ||
        !contact_information ||
        !about_me ||
        !city_residence ||
        !url_link
      ) {
        showAlert(
          "danger",
          "All fields are required to have a public profile."
        );
      } else if (!is_photo) {
        showAlert(
          "danger",
          "You must select a profile picture to make your profile public"
        );
      } else if (!url_available) {
        showAlert("danger", "URL profile is not available. Try another one.");
      } else {
        saveTeacher(
          name,
          email,
          password,
          about_me,
          city_residence,
          about_classes,
          class_location,
          class_prices,
          contact_information,
          url_link
        );
      }
    } else {
      saveTeacher(
        name,
        email,
        password,
        about_me,
        city_residence,
        about_classes,
        class_location,
        class_prices,
        contact_information,
        url_link
      );
    }
  } else if (userLoggedInRole == "Student") {
    var name = document.getElementById("student_name").innerHTML.trim();
    var email = document.getElementById("student_email").innerHTML.trim();
    var password = document.getElementById("student_password").innerHTML.trim();
    var hobbies_and_interests = document
      .getElementById("student_hobbies_and_interests")
      .value.trim();
    var language_level = document.getElementById(
      "student_language_level"
    ).value;
    if (!name || !email ||!password) {
      showAlert("danger", "Your name, email or password can not be empty");
    } else {
      saveStudent(name, email, password, hobbies_and_interests, language_level);
    }
  } else {
    var name = document.getElementById("collaborator_name").innerHTML.trim();
    var email = document.getElementById("collaborator_email").innerHTML.trim();
    var password = document.getElementById("collaborator_password").innerHTML.trim();
    var about_me = document
      .getElementById("collaborator_about_me")
      .value.trim();
    var contact = document
      .getElementById("collaborator_contact")
      .innerHTML.trim();
    var public_profile = document.getElementById(
      "collaborator_public_profile"
    ).checked;
    if (document.getElementById("profile_picture_collaborator").files[0]) is_photo = true;
    var url_link = formatURL(
      document.getElementById("url_link_collaborator").innerHTML
    );
    var url_available = await check_availability_url_link(
      "Collaborators",
      userLoggedInID,
      url_link
    );
    if (public_profile) {
      if (!name || !email || !about_me || !contact) {
        showAlert(
          "danger",
          "Public profile requires all fields to be completed"
        );
      } else if (!is_photo) {
        showAlert(
          "danger",
          "You must select a profile picture to make your profile public"
        );
      } else if (!url_available) { 
        showAlert("danger", "URL profile is not available. Try another one.");
      } else {
        saveCollaborator(email, name, password, about_me, contact, url_link);
      }
    } else {
      saveCollaborator(email, name, password, about_me, contact, url_link);
    }
  }
}

function saveStudent(name, email, password, hobbies_and_interests, language_level) {
  localStorage.setItem("user_full_name", name);
  updateUserData(
    {
      email: email,
      full_name: name,
      password: btoa(unescape(encodeURIComponent(password)))
    },
    "Users"
  );
  updateUserData(
    {
      hobbies_and_interests: hobbies_and_interests,
      language_level: language_level,
    },
    "Students"
  );
}

async function saveCollaborator(email, name, password, about_me, contact, url_link) {
  localStorage.setItem("user_full_name", name);
  var userData = {
    about_me: about_me,
    contact: contact,
    public_profile: document.getElementById("collaborator_public_profile")
      .checked,
    url_link: url_link
  };
  if (document.getElementById("profile_picture_collaborator").files[0]) {
    await fetch(
      "/api/deleteFromS3?folder=Users&url=" +
        userLoggedInID +
        "/" +
        current_image_url.split("/").pop(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    ).then((response) => {});
    var image_url = await uploadImage(
      "Users",
      document.getElementById("profile_picture_collaborator").files[0],
      "profile_picture"
    );
    userData.profile_picture = image_url;
  }
  updateUserData({ full_name: name, email: email, password: btoa(unescape(encodeURIComponent(password))) }, "Users");
  updateUserData(userData, "Collaborators");
}

async function saveTeacher(
  name,
  email,
  password,
  about_me,
  city_residence,
  about_classes,
  class_location,
  class_prices,
  contact_information,
  url_link
) {
  localStorage.setItem("user_full_name", name);
  var userData = {
    about_me: about_me,
    about_classes: about_classes,
    class_location: class_location,
    class_prices: class_prices,
    contact_information: contact_information,
    about_me: about_me,
    city_residence: city_residence,
    teaching_in_person: document.getElementById("teaching_in_person").checked,
    teaching_online: document.getElementById("teaching_online").checked,
    url_link: url_link,
    public_profile: document.getElementById("teacher_public_profile").checked,
  };
  if (document.getElementById("profile_picture_teacher").files[0]) {
    await fetch(
      "/api/deleteFromS3?folder=Users&url=" +
        userLoggedInID +
        "/" +
        current_image_url.split("/").pop(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    ).then((response) => {});
    var image_url = await uploadImage(
      "Users",
      document.getElementById("profile_picture_teacher").files[0],
      "profile_picture"
    );
    userData.profile_picture = image_url;
  }
  updateUserData({ full_name: name, email: email, password: btoa(unescape(encodeURIComponent(password)))}, "Users");
  updateUserData(userData, "Teachers");
}

function deleteContentDB(ID, table) {
  fetch('/api/deleteContent',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ID,
        table: table
      })
    }
  ).then((response) => {
    if (response.status === 500) {
      showAlert("danger","An issue occurred while deleting");
    }
  });
}

async function deleteContentS3(key) {
  await fetch("/api/deleteAllContentsS3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: key,
      url: userLoggedInID,
    }),
  })
    .then((response) => {})
    .catch((error) => {});
}

async function deleteContentByUserID(table) {
  try {
    const response = await fetch(`/api/getAllContents?table=${table}`);
    const data = await response.json();
    const items = data.Items;
    const itemsToDelete = items.filter(item => item.user_id === userLoggedInID);
    alert(JSON.stringify(itemsToDelete));
    for (const item of itemsToDelete) {
      alert("item id = " + item.ID);
      await deleteContentDB(item.ID, table);
    }
  } catch (error) {
    console.error('Error deleting content:', error);
  }
}

async function deleteAccount() {
  if (userLoggedInRole == "Teacher") {
    await deleteContentS3("Lessons");
    await deleteContentByUserID('Lessons');
    await deleteContentS3("Culture");
    await deleteContentByUserID('Culture');
    await deleteContentS3("Events");
    await deleteContentByUserID('Events');
    await deleteContentS3("Users");
    await deleteContentDB(userLoggedInID, "Teachers");
  } else if (userLoggedInRole == "Collaborator") {
    await deleteContentS3("Culture");
    await deleteContentByUserID('Culture');
    await deleteContentS3("Events");
    await deleteContentByUserID('Events');
    await deleteContentS3("Users");
    await deleteContentDB(userLoggedInID, "Collaborators");
  } else if (userLoggedInRole == "Student") {
    await deleteContentDB(userLoggedInID, "Students");
  }
  await deleteContentDB(userLoggedInID, "Users");
  logout();
}