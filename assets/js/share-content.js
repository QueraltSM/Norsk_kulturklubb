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
    document.getElementById("public_profile").style.display = "block";
    document.getElementById("share-content-div").style.display = "none";
  } else {
    document.getElementById("public_profile").style.display = "none";
    document.getElementById("share-content-div").style.display = "block";
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
  const date = document.getElementById("word_date").value;
  var url_link = formatURL(title + "-" + formatDate(date));
  if (title && meaning && date) {
    await fetch("/api/uploadContent?table=Words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID: uuidv4(),
        title: title,
        meaning: meaning,
        display_date: date,
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
        showAlert("success", "Contribution was submitted");
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
  var short_description = document
    .getElementById("lesson_short_description")
    .innerHTML.trim();
  var description = document.getElementById("lesson_description").value.trim();
  var language_level = document.getElementById("lesson_language_level").value;
  var lesson_content_url =
    document.getElementById("lesson_content_url").files[0];
  var lesson_image_url = document.getElementById("lesson_image").files[0];
  var url_link = document
    .getElementById("lesson_url_link")
    .innerHTML.toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-");
  var url_available = await check_availability_url_link(
    "Lessons",
    ID,
    url_link
  );
  var content_url = "";
  var image_url = "";
  if (
    !title ||
    !short_description ||
    !description ||
    !language_level ||
    !lesson_content_url ||
    !lesson_image_url ||
    !url_link
  ) {
    showAlert("danger", "All fields must be completed to share");
  } else {
    if (url_available) {
      content_url = await uploadFile(
        "Lessons",
        document.getElementById("lesson_content_url").files[0],
        url_link
      );
      image_url = await uploadImage(
        "Lessons",
        document.getElementById("lesson_image").files[0],
        url_link
      );
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
          showAlert("success", "Contribution was submitted");
        } else {
          throw new Error("Network response was not ok");
        }
      });
    } else {
      showAlert("danger", "URL link is not available. Try another one.");
    }
  }
}

async function publishPost() {
  const ID = uuidv4();
  const title = document.getElementById("post_title").innerHTML.trim();
  const short_description = document
    .getElementById("post_short_description")
    .innerHTML.trim();
  const description = document.getElementById("post_description").value.trim();
  const min_read = document.getElementById("min_read").value.trim();
  const category_select = document
    .getElementById("category-select")
    .value.replace(/-/g, " ");
  const subcategory_select = document
    .getElementById(
      "subcategory-select-" + document.getElementById("category-select").value
    )
    .value.replace(/-/g, " ");
  var url_link = document
    .getElementById("post_url_link")
    .innerHTML.toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-");
  var url_available = await check_availability_url_link(
    "Culture",
    ID,
    url_link
  );
  if (
    title &&
    short_description &&
    description &&
    category_select &&
    subcategory_select &&
    min_read &&
    url_link &&
    document.getElementById("post_image").files[0]
  ) {
    if (url_available) {
      var image_url = await uploadImage(
        "Culture",
        document.getElementById("post_image").files[0],
        url_link
      );
      const response = await fetch("/api/uploadContent?table=Culture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: ID,
          title: title,
          short_description: short_description,
          description: description,
          image_url: image_url,
          category: category_select,
          subcategory: subcategory_select,
          min_read: min_read,
          user_id: localStorage.getItem("userLoggedInID"),
          url_link: url_link,
          pubdate: new Date()
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            .replace(",", ""),
        }),
      });
      if (!response.ok) {
        throw new Error("There was an error");
      } else {
        showAlert("success", "Contribution was submitted");
      }
    } else {
      showAlert("danger", "URL link is not available. Try another one.");
    }
  } else {
    showAlert("danger", "Please fill all fields before submitting");
  }
}

async function publishEvent() {
  const ID = uuidv4();
  const title = document.getElementById("title_event").innerHTML.trim();
  const description = document.getElementById("event_description").value.trim();
  const platform_url = document
    .getElementById("event_platform_url")
    .innerHTML.trim();
  const date = document.getElementById("event_date").value;
  const category = document.getElementById("event_category").value;
  var url_link = document
    .getElementById("event_url_link")
    .innerHTML.toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-");
  var url_available = await check_availability_url_link("Events", ID, url_link);
  if (
    title &&
    description &&
    platform_url &&
    date &&
    category &&
    url_link &&
    document.getElementById("event_image").files[0]
  ) {
    if (url_available) {
      var image_url = await uploadImage(
        "Events",
        document.getElementById("event_image").files[0],
        url_link
      );
      const response = await fetch("/api/uploadContent?table=Events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: ID,
          title: title,
          short_description: short_description,
          description: description,
          image_url: image_url,
          platform_url: platform_url,
          celebration_date: date,
          user_id: localStorage.getItem("userLoggedInID"),
          url_link: url_link,
          category: category,
          pubdate: new Date()
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            .replace(",", ""),
        }),
      });
      if (!response.ok) {
        throw new Error("There was an error");
      } else {
        showAlert("success", "Contribution was submitted");
      }
    } else {
      showAlert("danger", "URL link is not available. Try another one.");
    }
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
flatpickr("#event_date", {
  enableTime: true,
  dateFormat: "d/m/Y H:i",
  minDate: "today",
});
