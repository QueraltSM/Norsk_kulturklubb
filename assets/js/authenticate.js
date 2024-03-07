function login() {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.status === 200) {
            localStorage.setItem('isLoggedIn', true);
            window.location.href = "/index.html";
        } else if (response.status === 401) {
            showAlert("danger", "Invalid email or password", "alertContainer", 5000);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        showAlert("danger", "An error occurred during login", "alertContainer", 5000);
    });
}

function signup() {
    var selectedRole = document.querySelector('input[name="role"]:checked');
    if (selectedRole) {
        if (selectedRole.value == "teacher") {
            const teacherData = {
                "ID": uuidv4(),
                "name": document.querySelector('input[name="name"]').value,
                "email": document.querySelector('input[name="email"]').value,
                "password": btoa(unescape(encodeURIComponent(document.querySelector('input[name="password"]').value)))
            };
            fetch('http://localhost:3000/api/insertTeacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teacherData)
            })
            .then(response => {
                if (response.status === 200) {
                    showAlert("success", "Your account was created", "alertContainer", 3000);
                    setTimeout(() => {
                        window.location.href = "/login.html";
                    }, 3000);
                } else if (response.status === 500) {
                    showAlert("danger", "An issue occurred while creating the account", "alertContainer", 5000);
                } else if (response.status === 409) {
                    showAlert("danger", "Your email already exists in the database", "alertContainer", 5000);
                }
            })
        }
    } else {
        showAlert("danger", "Please select a role", "alertContainer", 3000);
    }
}
