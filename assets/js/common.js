if (localStorage.getItem("isLoggedIn") == "true") {
  const roleDisplayOptions = {
    Teacher: {
      createWordOfDay: "block",
      makeContribution: "block",
      myContributions: "block",
    },
    Student: {
      createWordOfDay: "none",
      makeContribution: "none",
      myContributions: "none",
    },
    Collaborator: {
      createWordOfDay: "none",
      makeContribution: "block",
      myContributions: "block",
    },
  };
  for (const option in roleDisplayOptions[
    localStorage.getItem("userLoggedInRole")
  ]) {
    const element = document.getElementById(option);
    if (element) {
      element.style.display =
        roleDisplayOptions[localStorage.getItem("userLoggedInRole")][option];
    }
  }
  document.getElementById("welcomeUser").innerHTML =
    "Hallo " + localStorage.getItem("user_full_name");
  document.getElementById("handleUserMenuLink").style.display = "block";
} else {
  document.getElementById("loginBtn").style.display = "block";
  const previewElements = [
    "preview_teachers",
    "preview_lessons",
    "preview_events",
  ];
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
  window.scrollTo(0, document.body.scrollHeight + 100);
  var container = document.getElementById("alertContainer");
  container.innerHTML = "";
  var content = document.createElement("span");
  content.style.display = "block";
  content.style.margin = "auto";
  content.style.fontWeight = "bold";
  content.style.fontSize = "15px";
  content.style.textAlign = "center";
  if (alertType === "danger") {
    content.style.color = "#ff4444";
    content.innerHTML =
      "<i class='bi bi-exclamation-circle-fill'></i> " + message;
  } else if (alertType === "success") {
    content.style.color = "#3EA66A";
    content.innerHTML = "<i class='bi bi-check2-circle'></i> " + message;
  }
  container.appendChild(content);
}

function cleanPaste(event, element) {
  alert("clean");
  event.preventDefault();
  var pastedText = (event.originalEvent || event).clipboardData.getData(
    "text/plain"
  );
  var cleanedText = pastedText.replace(/<[^>]+>/g, "");
  document.execCommand("insertHTML", false, cleanedText);
}

function markDayAsTaken(calendarId, day) {
  var calendar = document.getElementById(calendarId);
  var formattedDay = formatDateForFlatpickr(day);
  calendar._flatpickr.config.disable.push(formattedDay);
  calendar._flatpickr.setDate(calendar._flatpickr.selectedDates, false);
}

function formatDateForFlatpickr(date) {
  var parts = date.split("/");
  var year = parts[2];
  var month = parts[1] - 1;
  var day = parts[0];
  return new Date(year, month, day);
}

function fetchCalendar() {
  fetch("/api/getAllContents?table=Words")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get server response.");
      }
      return response.json();
    })
    .then((data) => {
      data.Items.forEach((word) => {
        markDayAsTaken("word_date", word.display_date);
      });
    })
    .catch((error) => {
      console.error("Error retrieving data", error);
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
  var category_select = document.getElementById("category-select").value;
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
    const response1 = await fetch(`/api/getUser?id=${id}&table=Users`);
    if (!response1.ok) {
      throw new Error("User data not found");
    }
    const user = await response1.json();
    const role = user.role;
    const response2 = await fetch(`/api/getUser?id=${id}&table=${role}s`);
    if (!response2.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const userData = await response2.json();

    if (Object.keys(userData).length === 0) {
      throw new Error("User data not found");
    }

    const mergedData = Object.assign({}, user, userData);
    return mergedData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

function formatDate(dateString) {
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  return dateString.split("/").reduce((acc, val, index) => {
    if (index === 0) return val.padStart(2, "0") + "-" + acc;
    if (index === 1) return acc + months[parseInt(val) - 1];
    if (index === 2) return acc + "-" + val.slice(-2);
  }, ""); //Output: "01-Jun-24"
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

function formatURL(url) {
  return url
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-");
}

function noPosts() {
  return `<div style="text-align: center;">
  <img src="/assets/img/not-found.png" alt="No data found" style="width:300px;padding-bottom:10px;"><br>
  <span style="color:#9C3030; font-size: 15px;">There is nothing published at the moment <i class="bi bi-emoji-frown"></i></span>
  </div>`;
}

function parseURL(url) {
  return url.replace(/-/g, " ");
}

async function check_availability_url_link(table, ID, url_link) {
  try {
    const response = await fetch(
      `/api/getFromURL?url_link=${url_link}&table=${table}`
    );
    const data = await response.json();
    return data.ID === ID;
  } catch (error) {
    return true;
  }
}

async function uploadFile(key, file, url_link) {
  var formData = new FormData();
  formData.append("file", file);
  var filename = url_link + "." + file.name.match(/\.([^.]+)$/)[1];
  var response = await fetch(
    "/api/uploadFile?key=" + key +  "/" + localStorage.getItem("userLoggedInID") + "&filename=" + filename,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  var responseData = await response.json();
  return responseData.fileUrl;
}

async function uploadImage(key, file, url_link) {
  var formData = new FormData();
  formData.append("image", file);
  var filename = url_link + "." + file.name.match(/\.([^.]+)$/)[1];
  var response = await fetch(
    "/api/uploadImage?key=" + key +  "/" + localStorage.getItem("userLoggedInID") + "&filename=" + filename,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  var responseData = await response.json();
  return responseData.imageUrl;
}

function previewImage(event, element_id) {
  var reader = new FileReader();
  reader.onload = function () {
    var img = document.getElementById(element_id);
    img.src = reader.result;
    localStorage.setItem(element_id, reader.result);
  };
  reader.readAsDataURL(event.target.files[0]);
}

function sortByDate(entries) {
  function compareDates(entryA, entryB) {
    var dateTimePartsA = entryA.pubdate.split(' ');
    var dateTimePartsB = entryB.pubdate.split(' ');
    var datePartsA = dateTimePartsA[0].split('/');
    var datePartsB = dateTimePartsB[0].split('/');
    var timePartsA = dateTimePartsA[1].split(':');
    var timePartsB = dateTimePartsB[1].split(':');
    var dateA = new Date(datePartsA[2], datePartsA[1] - 1, datePartsA[0], timePartsA[0], timePartsA[1], timePartsA[2]);
    var dateB = new Date(datePartsB[2], datePartsB[1] - 1, datePartsB[0], timePartsB[0], timePartsB[1], timePartsB[2]);
    return dateB - dateA;
  } 
  var sortedEntries = entries.slice();
  sortedEntries.sort(compareDates);
  return sortedEntries;
}

function formatEvent(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    let formattedDate = `${day} ${monthNames[month - 1]}`;
    if (year !== currentYear) formattedDate += ` ${year}`;
    formattedDate += ` ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedDate;
}
function base64ToString(base64) {
  const binaryString = atob(base64);
  const binaryArray = Uint8Array.from(binaryString, char => char.charCodeAt(0));
  const decodedString = new TextDecoder().decode(binaryArray);
  return decodedString;
}
