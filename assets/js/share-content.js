const li_word_of_the_day = document.getElementById("li_word_of_the_day");
const li_lesson = document.getElementById("li_lesson");
const li_post = document.getElementById("li_post");
const li_event = document.getElementById("li_event");
const div_word = document.getElementById("div_word");
const div_lesson = document.getElementById("div_lesson");
const div_post = document.getElementById("div_post");
const div_event = document.getElementById("div_event");

async function fetchData() {
  const response = await fetch(
    `/api/getUser?id=${localStorage.getItem(
      "userLoggedInID"
    )}&table=${localStorage.getItem("userLoggedInRole")}s`
  );
  if (!response.ok) {
    throw new Error("No response could be obtained from the server");
  }
  const userData = await response.json();
  if (!userData.public_profile) {
    document.getElementById("public_profile").innerHTML =
      "<span style='color: #9C3030; font-weight: bold;font-size:14px;'><i class='fas fa-exclamation-triangle'></i> To make any contributions to this platform, your profile must be public. Please access to <a href='/account.html'><u>Account</u></a> to complete your profile.</span>";
    div_word.style.pointerEvents = "none";
    div_word.style.opacity = "0.5";
    div_lesson.style.pointerEvents = "none";
    div_lesson.style.opacity = "0.5";
    div_post.style.pointerEvents = "none";
    div_post.style.opacity = "0.5";
    div_event.style.pointerEvents = "none";
    div_event.style.opacity = "0.5";
    if (localStorage.getItem("userLoggedInRole") === "Collaborator") {
      li_post.style.display = "block";
      li_post.classList.add("filter-active");
      li_event.style.display = "block";
    }
  } else {
    div_word.style.pointerEvents = "auto";
    div_word.style.opacity = "1";
    div_lesson.style.pointerEvents = "auto";
    div_lesson.style.opacity = "1";
    div_post.style.pointerEvents = "auto";
    div_post.style.opacity = "1";
    div_event.style.pointerEvents = "auto";
    div_event.style.opacity = "1";
    if (localStorage.getItem("userLoggedInRole") === "Collaborator") {
      li_post.style.display = "block";
      li_post.classList.add("filter-active");
      li_event.style.display = "block";
    } else if (localStorage.getItem("userLoggedInRole") === "Teacher") {
      li_word_of_the_day.style.display = "block";
      li_word_of_the_day.classList.add("filter-active");
      li_lesson.style.display = "block";
      li_post.style.display = "block";
      li_event.style.display = "block";
    }
  }  
}

function publishWord() {
  const word = document.getElementById("word_of_the_day_word").innerHTML.trim();
  const meaning = document
    .getElementById("word_of_the_day_meaning")
    .innerHTML.trim();
  const calendar = document.getElementById("word_of_the_day_calendar").value;
  if (word && meaning && calendar) {
    fetch("/api/uploadWord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID: uuidv4(),
        word: word,
        meaning: meaning,
        date: calendar,
        teacher_id: localStorage.getItem("userLoggedInID"),
        pubdate: new Date()
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", ""),
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        showAlert(
          "success",
          "The Word of the day was submitted",
          "alertContainer",
          3000
        );
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 3000);
      })
      .catch((error) => {
        showAlert(
          "danger",
          "An error occurred during uploading",
          "alertContainer",
          5000
        );
      });
  } else {
    showAlert(
      "danger",
      "Please fill all fields before submitting",
      "alertContainer",
      5000
    );
  }
}

async function publishLesson() {
  var title = document.getElementById("lesson_title").innerHTML.trim();
  var short_description = document
    .getElementById("lesson_short_description")
    .innerHTML.trim();
  var description = document.getElementById("lesson_description").value.trim();
  var languageLevel = document.getElementById("lesson_language_level").value;
  if (title && short_description && description && languageLevel) {
    try {
      var fileInput = document.getElementById("lesson_content_url");
      var file = fileInput.files[0];
      var imageInput = document.getElementById("lesson_image");
      var image = imageInput.files[0];
      if (!file || !image) {
        showAlert(
          "danger",
          "Please select both file and image",
          "alertContainer",
          3000
        );
        return "";
      }
      var formData = new FormData();
      formData.append("file", file);
      formData.append("image", image);

      var filename = uuidv4() + "." + file.name.split(".").pop();
      var image_filename = uuidv4() + "." + image.name.split(".").pop();

      const response = await fetch(
        `/api/uploadFileLesson?filename=${encodeURIComponent(
          filename
        )}&image_filename=${encodeURIComponent(image_filename)}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const data = await response.json();
      fetch("/api/uploadLesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: uuidv4(),
          title: title,
          short_description: short_description,
          description: description,
          language_level: languageLevel,
          content_url: data.fileUrl,
          header_image: data.imageUrl,
          teacher_id: localStorage.getItem("userLoggedInID"),
          pubdate: new Date()
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(",", ""),
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          showAlert(
            "success",
            "The lesson was submitted",
            "alertContainer",
            3000
          );
          setTimeout(() => {
            window.location.href = "/lessons.html";
          }, 3000);
        })
        .catch((error) => {
          showAlert(
            "danger",
            "An error occurred during uploading",
            "alertContainer",
            5000
          );
        });
    } catch (error) {
      showAlert("danger", "Failed to upload file", "alertContainer", 3000);
      return "";
    }
  } else {
    showAlert(
      "danger",
      "Please fill all fields before submitting",
      "alertContainer",
      3000
    );
  }
}

async function publishPost() {
  const title = document.getElementById("post_title").innerHTML.trim();
  const short_description = document
    .getElementById("post_short_description")
    .innerHTML.trim();
  const description = document.getElementById("post_description").value.trim();
  const min_read = document.getElementById("post_min_read").innerHTML.trim();
  const category_select = document.getElementById("category_select").value;
  const subcategory_select =
    document.getElementById("subcategory_select").value;

  if (
    title &&
    short_description &&
    description &&
    category_select &&
    subcategory_select &&
    min_read
  ) {
    try {
      var fileInput = document.getElementById("post_image");
      var file = fileInput.files[0];
      if (!file) {
        showAlert("danger", "No file selected", "alertContainer", 3000);
        return "";
      }
      var formData = new FormData();
      formData.append("file", file);
      var filename = uuidv4() + "." + file.name.split(".").pop();
      const response = await fetch(
        `/api/uploadPostImage?filename=${encodeURIComponent(filename)}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const data = await response.json();
      fetch("/api/uploadPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: uuidv4(),
          title: title,
          short_description: short_description,
          description: description,
          image: data.fileUrl,
          category: category_select,
          subcategory: subcategory_select,
          min_read: min_read,
          user_id: localStorage.getItem("userLoggedInID"),
          pubdate: new Date()
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(",", ""),
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          showAlert(
            "success",
            "The post was submitted",
            "alertContainer",
            3000
          );
          setTimeout(() => {
            window.location.href = "/culture.html";
          }, 3000);
        })
        .catch((error) => {
          showAlert(
            "danger",
            "An error occurred during uploading",
            "alertContainer",
            5000
          );
        });
    } catch (error) {
      showAlert("danger", "Failed to upload file", "alertContainer", 3000);
      return "";
    }
  } else {
    showAlert(
      "danger",
      "Please fill all fields before submitting",
      "alertContainer",
      3000
    );
  }
}

function publishEvent() {
  const title = document.getElementById("title_event").innerHTML.trim();
  const short_description = document
    .getElementById("event_short_description")
    .innerHTML.trim();
  const description = document.getElementById("event_description").value.trim();
  const platform_url = document
    .getElementById("event_platform_url")
    .innerHTML.trim();
  const calendar = document.getElementById("event_calendar").value;

  if (title && short_description && description && platform_url && calendar) {
    fetch("/api/uploadEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID: uuidv4(),
        title: title,
        short_description: short_description,
        description: description,
        platform_url: platform_url,
        date: calendar,
        teacher_id: localStorage.getItem("userLoggedInID"),
        pubdate: new Date()
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", ""),
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        showAlert("success", "Event was submitted", "alertContainer", 3000);
        setTimeout(() => {
          window.location.href = "/events.html";
        }, 3000);
      })
      .catch((error) => {
        showAlert(
          "danger",
          "An error occurred during uploading",
          "alertContainer",
          5000
        );
      });
  } else {
    showAlert(
      "danger",
      "Please fill all fields before submitting",
      "alertContainer",
      5000
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var filterItems = document.querySelectorAll("#contributions-flters li");
  filterItems.forEach(function (item) {
    item.addEventListener("click", function () {
      filterItems.forEach(function (filterItem) {
        filterItem.classList.remove("filter-active");
      });
      item.classList.add("filter-active");
      var filter = item.getAttribute("data-filter").substring(1);
      var contributionsItems = document.querySelectorAll(".contributions-item");
      contributionsItems.forEach(function (contributionItem) {
        if (contributionItem.classList.contains(filter)) {
          contributionItem.style.display = "block";
          if (filter == "events") {
            flatpickr("#event_calendar", {
              dateFormat: "d/m/Y",
              minDate: "today",
            });
          }
        } else {
          contributionItem.style.display = "none";
        }
      });
    });
  });
});

function toggleCategoryPost() {
  document.getElementById("History and traditions").style.display = "none";
  document.getElementById("Art and literature").style.display = "none";
  document.getElementById("Nature and landscapes").style.display = "none";
  document.getElementById("Gastronomy").style.display = "none";
  document.getElementById("Lifestyle and society").style.display = "none";
  document.getElementById("Travel and tourism").style.display = "none";
  document.getElementById("Language and linguistics").style.display = "none";
  document.getElementById("Events and festivals").style.display = "none";

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

fetchData();