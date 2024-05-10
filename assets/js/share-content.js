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
      fetchCalendar();
      li_lesson.style.display = "block";
      li_post.style.display = "block";
      li_event.style.display = "block";
    }
  }
}

async function publishWord() {
  const title = document.getElementById("word_title").innerHTML.trim();
  const meaning = document.getElementById("word_meaning").innerHTML.trim();
  const calendar = document.getElementById("word_date").value;
  var url_link = title.toLowerCase().replace(/[.,]/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, "-").replace(/-{2,}/g, "-") + "-"+formatDate(calendar);
  if (title && meaning && calendar) {
    await fetch("/api/uploadContent?table=Words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID: uuidv4(),
        title: title,
        meaning: meaning,
        display_date: calendar,
        teacher_id: localStorage.getItem("userLoggedInID"),
        url_link: url_link,
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
        showAlert("success", "The Word of the day was submitted");
      })
      .catch((error) => {
        showAlert("danger", "An error occurred during uploading");
      });
  } else {
    showAlert("danger", "Please fill all fields before submitting");
  }
}

async function publishLesson() {
  var ID = uuidv4();
  var title = document.getElementById("lesson_title").innerHTML.trim();
  var short_description = document.getElementById("lesson_short_description").innerHTML.trim();
  var description = document.getElementById("lesson_description").value.trim();
  var language_level = document.getElementById("lesson_language_level").value;
  var lesson_content_url = document.getElementById("lesson_content_url").files[0];
  var lesson_image_url = document.getElementById("lesson_image").files[0];
  var url_link = document.getElementById("url_link").innerHTML.toLowerCase().replace(/[.,]/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, "-").replace(/-{2,}/g, "-");
  var content_url = "";
  var image_url = "";
  if (
    !title ||
    !short_description ||
    !description ||
    !language_level ||
    !lesson_content_url ||
    !lesson_image || 
    !url_link
  ) {
    showAlert("danger", "All fields must be completed to share");
  } else {
    var formData = new FormData();
    formData.append("file", lesson_content_url);
    var filename = ID + "." + lesson_content_url.name.split(".").pop();
    var response = await fetch(
      `/api/uploadFile?key=Lessons&filename=${filename}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to upload file");
    } else {
      const responseData = await response.json();
      content_url = responseData.fileUrl;
    }
    var formData = new FormData();
    formData.append("image", lesson_image_url);
    var filename = ID + "." + lesson_image_url.name.split(".").pop();
    response = await fetch(
      `/api/updateImage?key=Lesson-Images&filename=${filename}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to upload file");
    } else {
      const responseData = await response.json();
      image_url = responseData.imageUrl;
    }
    await fetch("/api/uploadContent?table=Lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID: ID,
        title: title,
        short_description: short_description,
        description: description,
        language_level: language_level,
        content_url: content_url,
        image_url: image_url,
        teacher_id: localStorage.getItem("userLoggedInID"),
        url_link: url_link,
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
    }).then((response) => {
      if (response.ok) {
        showAlert("success", "The lesson was submitted");
      } else {
        throw new Error("Network response was not ok");
      }
    });
  }
}

async function publishPost() {
  const title = document.getElementById("post_title").innerHTML.trim();
  const short_description = document
    .getElementById("post_short_description")
    .innerHTML.trim();
  const description = document.getElementById("post_description").value.trim();
  const min_read = document.getElementById("post_min_read").innerHTML.trim();
  const category_select = document
    .getElementById("category_select")
    .value.replace(/-/g, " ");
  const subcategory_select = document
    .getElementById("subcategory_select")
    .value.replace(/-/g, " ");
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
        showAlert("danger", "No file selected");
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
      fetch("/api/uploadContent?table=Culture", {
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
          showAlert("success", "The post was submitted");
          setTimeout(() => {
            window.location.href = "/culture.html";
          }, 3000);
        })
        .catch((error) => {
          showAlert("danger", "An error occurred during uploading");
        });
    } catch (error) {
      showAlert("danger", "Failed to upload file");
      return "";
    }
  } else {
    showAlert("danger", "Please fill all fields before submitting");
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
        showAlert("success", "Event was submitted");
        setTimeout(() => {
          window.location.href = "/events.html";
        }, 3000);
      })
      .catch((error) => {
        showAlert("danger", "An error occurred during uploading");
      });
  } else {
    showAlert("danger", "Please fill all fields before submitting");
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
        } else {
          contributionItem.style.display = "none";
        }
      });
    });
  });
});

fetchData();
flatpickr("#word_date", {
  dateFormat: "d/m/Y",
  minDate: "today",
});
flatpickr("#event_calendar", {
  dateFormat: "d/m/Y",
  minDate: "today",
});
