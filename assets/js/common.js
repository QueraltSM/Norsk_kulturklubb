if (localStorage.getItem("isLoggedIn") == "true") {

  const roleDisplayOptions = {
    "Teacher": { "createWordOfDay": "block", "makeContribution": "block", "myContributions": "block" },
    "Student": { "createWordOfDay": "none", "makeContribution": "none", "myContributions": "none" },
    "Collaborator": { "createWordOfDay": "none", "makeContribution": "block", "myContributions": "block" }
  };
  for (const option in roleDisplayOptions[localStorage.getItem("userLoggedInRole")]) {
    const element = document.getElementById(option);
    if (element) {
      element.style.display = roleDisplayOptions[localStorage.getItem("userLoggedInRole")][option];
    }
  }

  document.getElementById("welcomeUser").innerHTML = "Hallo " + localStorage.getItem("user_first_name");
  document.getElementById("handleUserMenuLink").style.display = "block";
} else {
  document.getElementById("loginBtn").style.display = "block";
  const previewElements = ["preview_teachers", "preview_lessons", "preview_events"];
  const normalElements = ["teachers", "lessons", "events"];
  
  for (const elementId of previewElements) {
    const element = document.getElementById(elementId);
    if (element != null) {
      element.style.display = "flex";
    }
  }
  for (const elementId of normalElements) {
    const element = document.getElementById(elementId);
    if (element != null) {
      element.style.display = "none";
    }
  }
}

function logout() {
  document.getElementById("handleUserMenuLink").style.display = "none";
  document.getElementById("loginBtn").style.display = "block";
  localStorage.setItem("isLoggedIn", false);
  window.location.href = "/login.html";
}

function showAlert(alertType, message) {
  window.scrollTo(0, 0);
  var container = document.getElementById('alertContainer');
  container.innerHTML = "";
  var content = document.createElement("span");
  content.style.display = "block";
  content.style.margin = "auto";
  content.style.fontWeight = "bold";
  content.style.fontSize = "15px"
  content.style.textAlign = "center";
  if (alertType === "danger") {
    content.style.color = "#ff4444";
    content.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> " + message;
  } else if (alertType === "success") {
    content.style.color = "#3EA66A";
    content.innerHTML = "<i class='bi bi-check2-circle'></i> " + message;
  }
  container.appendChild(content);
}


function limitTextarea(element, maxLength) {
  if (element.textContent.length > maxLength) {
      element.textContent = element.textContent.slice(0, maxLength);
  }
}

function cleanPaste(event, element) {
  alert("clean")
  event.preventDefault();
  var pastedText = (event.originalEvent || event).clipboardData.getData('text/plain');
  var cleanedText = pastedText.replace(/<[^>]+>/g, '');
  document.execCommand("insertHTML", false, cleanedText);
}

function markDayAsTaken(calendarId, day) {
  var calendar = document.getElementById(calendarId);
  var formattedDay = formatDateForFlatpickr(day);
  calendar._flatpickr.config.disable.push(formattedDay);
  calendar._flatpickr.setDate(calendar._flatpickr.selectedDates, false);
}

function formatDateForFlatpickr(date) {
  var parts = date.split('/');
  var year = parts[2];
  var month = parts[1] - 1;
  var day = parts[0];
  return new Date(year, month, day);
}

function fetchCalendar() {
  fetch('/api/getAllContents?table=Words')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to get server response.');
    }
    return response.json();
  })
  .then(data => {
    data.Items.forEach(word => {
      markDayAsTaken("word_date", word.display_date); 
    });
  }).catch(error => {
    console.error('Error retrieving data', error);
  });
}

function toggleCategoryPost() {
  document.getElementById("History-and-traditions").style.display = "none";
  document.getElementById("Art-and-literature").style.display = "none";
  document.getElementById("Nature-and-landscapes").style.display = "none";
  document.getElementById("Gastronomy").style.display = "none";
  document.getElementById("Lifestyle-and-society").style.display = "none";
  document.getElementById("Travel-and-tourism").style.display = "none";
  document.getElementById("Language-and-linguistics").style.display = "none";
  document.getElementById("Events-and-festivals").style.display = "none";
  var category_select = document.getElementById("category_select").value;
  var categories = document.querySelectorAll(".subcategory-container");
  categories.forEach((category) => {
    category.style.display = "none";
  });
  var selectedCategory = document.getElementById(category_select);
  if (selectedCategory) {
    selectedCategory.style.display = "block";
  }
}

async function getUser(id) {
  try {
    const response1 = await fetch(
      `/api/getUser?id=${id}&table=Users`
    );
    if (!response1.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const user = await response1.json();
    const role = user.role;
    const response2 = await fetch(
      `/api/getUser?id=${id}&table=${role}s`
    );
    if (!response2.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const userData = await response2.json();
    const mergedData = Object.assign({}, user, userData);
    return mergedData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

function formatDate(dateString) {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return dateString.split('/').reduce((acc, val, index) => {
    if (index === 0) return val.padStart(2, '0') + '-' + acc;
    if (index === 1) return acc + months[parseInt(val) - 1];
    if (index === 2) return acc + '-' + val.slice(-2);
  }, ''); //Output: "01-Jun-24"
}

function formatDateBlog(dateString) {
  const parts = dateString.split("/");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(formattedDate);
  return `${date.getDate()} ${months[date.getMonth()]}`;
}