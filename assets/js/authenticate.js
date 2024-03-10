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
    localStorage.setItem("welcomeUser", data.message);
    localStorage.setItem("userLoggedIn", data.ID);
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
  if (selectedRole) {
    var userData = {
      ID: uuidv4(),
      name: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      password: btoa(
        unescape(
          encodeURIComponent(
            document.querySelector('input[name="password"]').value
          )
        )
      ),
      role: selectedRole.value.slice(0, -1)
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
        if (selectedRole.value=="Teachers") {
          userData.public_profile = false;
        }
        insertUserDataToServer(userData, selectedRole.value);
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
    table: table
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
