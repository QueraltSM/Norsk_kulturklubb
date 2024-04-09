function login() {
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      localStorage.setItem("user_first_name", data.user_first_name);
      localStorage.setItem("userLoggedInID", data.ID);
      localStorage.setItem("userLoggedInRole", data.role);
      localStorage.setItem("isLoggedIn", true);
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("Error during login:", error);
      showAlert(
        "danger",
        "An error occurred during login",
        "alertContainer",
        5000
      );
    });
}

function signup() {
  var selectedRole = document.querySelector('input[name="role"]:checked');
  var ID = uuidv4();
  if (selectedRole) {
    var userData = {
      ID: ID,
      first_name: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      password: btoa(
        unescape(
          encodeURIComponent(
            document.querySelector('input[name="password"]').value
          )
        )
      ),
      role: selectedRole.value.slice(0, -1),
    };
    fetch("http://localhost:3000/api/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then((response) => {
      if (response.status === 200) {
        delete userData.role;
        var user = {
          ID: ID,
        };
        if (selectedRole.value == "Teachers") {
          user.public_profile = false;
          user.about_teacher = "";
          user.about_classes = "";
          user.class_location = "";
          user.class_prices = "";
          user.contact_information = "";
        } else if (selectedRole.value == "Students") {
          user.language_level = "A1 - Nybegynner";
          user.hobbies_and_interests = "";
        } else if (selectedRole.value == "Collaborators") {
          user.biography = "";
          user.contact = "";
        }
        insertUserDataToServer(user, selectedRole.value);
      } else if (response.status === 500) {
        showAlert(
          "danger",
          "An issue occurred while creating the account",
          "alertContainer",
          5000
        );
      } else if (response.status === 409) {
        showAlert(
          "danger",
          "Your email already exists in the database",
          "alertContainer",
          5000
        );
      }
    });
  } else {
    showAlert("danger", "Please select a role", "alertContainer", 3000);
  }
}

function insertUserDataToServer(userData, table) {
  var request = {
    userData: userData,
    table: table,
  };
  fetch("http://localhost:3000/api/insertUserDataToServer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.status === 200) {
      showAlert("success", "Your account was created", "alertContainer", 3000);
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 3000);
    } else if (response.status === 500) {
      showAlert(
        "danger",
        "An issue occurred while creating the account",
        "alertContainer",
        5000
      );
    } else if (response.status === 409) {
      showAlert(
        "danger",
        "Your email already exists in the database",
        "alertContainer",
        5000
      );
    }
  });
}
