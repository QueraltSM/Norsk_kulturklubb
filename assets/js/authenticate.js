function login() {
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  fetch("/api/login", {
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
      localStorage.setItem("user_full_name", data.user_full_name);
      localStorage.setItem("userLoggedInID", data.ID);
      localStorage.setItem("userLoggedInRole", data.role);
      localStorage.setItem("isLoggedIn", true);
      window.location.href = "/index.html";
    })
    .catch((error) => {
      showAlert(
        "danger",
        "Account not found on system"
      );
    });
}

function signup() {
  var selectedRole = document.querySelector('input[name="role"]:checked');
  var password = document.querySelector('input[name="password"]').value;
  var confirm_password = document.querySelector('input[name="confirm_password"]').value;
  var ID = uuidv4();
  if (selectedRole) {
    if (password == confirm_password) {
      var userData = {
        ID: ID,
        full_name: document.querySelector('input[name="name"]').value,
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
      fetch("/api/insertUser", {
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
            user.about_me = "";
            user.about_classes = "";
            user.class_location = "";
            user.class_prices = "";
            user.contact_information = "";
            user.profile_picture = "";
            user.url_link = "";
          } else if (selectedRole.value == "Students") {
            user.language_level = "A1 - Nybegynner";
            user.hobbies_and_interests = "";
          } else if (selectedRole.value == "Collaborators") {
            user.public_profile = false;
            user.about_me = "";
            user.contact = "";
            user.profile_picture = "";
          }
          insertUserDataToServer(user, selectedRole.value);
        } else if (response.status === 500) {
          showAlert(
            "danger",
            "An issue occurred while creating the account"
          );
        } else if (response.status === 409) {
          showAlert(
            "danger",
            "Your email already exists in the database"
          );
        }
      });
    } else {
      showAlert("danger", "Passwords must match");
    }
  } else {
    showAlert("danger", "Please select a role");
  }
}

function insertUserDataToServer(userData, table) {
  var request = {
    userData: userData,
    table: table,
  };
  fetch("/api/insertUserDataToServer", {
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
