function login() {

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
                alert(JSON.stringify(response.ok));
                if (response.ok) {
                    showAlert("success", "Your account was created", "alertContainer", 5000);
                    window.location.href = "/login.html";
                } else {
                    showAlert("danger", "An issue occurred while creating the account", "alertContainer", 5000);
                }
            })
        }
    } else {
        showAlert("danger", "Please select a role", "alertContainer", 3000);
    }
}
