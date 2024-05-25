var ID = "";
var content_url = "";
var type = "";
var url = "";

async function updateLesson() {
  var title = document.getElementById("lesson_title").innerHTML.trim();
  var short_description = document
    .getElementById("lesson_short_description")
    .innerHTML.trim();
  var description = document.getElementById("lesson_description").value.trim();
  var language_level = document.getElementById("lesson_language_level").value;
  var url_link = formatURL(document.getElementById("lesson_url_link").value);
  if (
    !title ||
    !short_description ||
    !description ||
    !language_level
  ) {
    showAlert("danger", "All fields must be completed to update");
  } else {
      var current_practice_url =  document.getElementById("current_practice").href.split("/").pop();
      var current_image_url =  document.getElementById("current_image_lessons").value.split("/").pop();
      var content_url = document.getElementById("current_practice").href;
      var image_url = document.getElementById("current_image_lessons").value;
      if (document.getElementById("lesson_content_url").files[0]) {
        await fetch("/api/deleteFromS3?folder=Lessons&url="+current_practice_url,{
          method: "POST",
          headers: {"Content-Type": "application/json",},
        }).then((response) => {});
        content_url = await uploadFile("Lessons", document.getElementById("lesson_content_url").files[0], url_link);
      }
      if (document.getElementById("lesson_image").files[0]) {
        await fetch("/api/deleteFromS3?folder=Lessons&url="+current_image_url,{
          method: "POST",
          headers: {"Content-Type": "application/json",},
        }).then((response) => {});
        image_url = await uploadImage("Lessons", document.getElementById("lesson_image").files[0], url_link);
      }
      response = await fetch(`/api/updateContent?table=Lessons&ID=` + ID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          short_description: short_description,
          description: description,
          language_level: language_level,
          content_url: content_url,
          image_url: image_url
        }),
      });
      if (!response.ok) {
        throw new Error("There was an error");
      }
      window.location.href = "/Edit/Lessons/" + url_link;
  }
}

async function updateWord() {
  var title = document.getElementById("word_title").innerHTML;
  var meaning = document.getElementById("word_meaning").innerHTML;
  var date = document.getElementById("word_date").value;
  var url_link = formatURL(title + "-" + formatDate(date));
  if (title && meaning && date) {
    const response = await fetch(`/api/updateContent?table=Words&ID=` + ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        meaning: meaning,
        display_date: date,
        url_link: url_link,
      }),
    });
    if (!response.ok) {
      throw new Error("There was an error");
    } else {
      window.location.href = "/Edit/Words/" + url_link;
    }
  } else {
    showAlert("danger", "All fields must be completed to update");
  }
}

async function updatePost() {
  var title = document.getElementById("post_title").innerHTML;
  var short_description = document.getElementById("post_short_description").innerHTML;
  var description = document.getElementById("post_description").value;
  var category = document.getElementById("category-select").value.replace(/-/g, " ");
  var subcategory = document.getElementById("subcategory-select-"+document.getElementById("category-select").value).value.replace(/-/g, " ");
  var min_read = document.getElementById("min_read").value;
  var url_link = formatURL(document.getElementById("post_url_link").value);
  if (
    !title ||
    !short_description ||
    !description ||
    !category ||
    !subcategory ||
    !min_read
  ) {
    showAlert("danger", "All fields must be completed to update");
  } else {
    var current_image_url =  document.getElementById("current_image_culture").value.split("/").pop();
    var image_url = document.getElementById("current_image_culture").value;
    if (document.getElementById("post_image").files[0]) {
      await fetch("/api/deleteFromS3?folder=Culture&url="+current_image_url,{
        method: "POST",
        headers: {"Content-Type": "application/json",},
      }).then((response) => {});
      image_url = await uploadImage("Culture", document.getElementById("post_image").files[0], url_link);
    }
    const response = await fetch(`/api/updateContent?table=Culture&ID=` + ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        short_description: short_description,
        description: description,
        category: category,
        subcategory: subcategory,
        image_url: image_url,
        min_read: min_read
      }),
    });
    if (!response.ok) {
      throw new Error("There was an error");
    } else {
      window.location.href = "/Edit/Culture/" + url_link;
    }
  }
}

async function updateEvent() {
  var title = document.getElementById("event_title").innerHTML;
  var description = document.getElementById("event_description").value;
  var platform_url = document.getElementById("event_platform_url").innerHTML;
  var date = document.getElementById("event_date").value;
  var category = document.getElementById("event_category").value;
  var url_link = formatURL(document.getElementById("event_url_link").value);
  if (
    !title ||
    !description ||
    !platform_url ||
    !category ||
    !date) {
    showAlert("danger", "All fields must be completed to update");
  } else {
    var current_image_url =  document.getElementById("current_image_events").value.split("/").pop();
    var image_url = document.getElementById("current_image_events").value;
    if (document.getElementById("event_image").files[0]) {
      await fetch("/api/deleteFromS3?folder=Events&url="+current_image_url,{
        method: "POST",
        headers: {"Content-Type": "application/json",},
      }).then((response) => {});
      image_url = await uploadImage("Events", document.getElementById("event_image").files[0], url_link);
    }
    const response = await fetch(`/api/updateContent?table=Events&ID=` + ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        platform_url: platform_url,
        celebration_date: date,
        category: category,
        image_url: image_url
      }),
    });
    if (!response.ok) {
      throw new Error("There was an error");
    } else {
      window.location.href = "/Edit/Events/" + url_link;
    }
  } 
}

async function fetchData() {
  type = new URL(window.location.href).pathname.split("/")[2];
  url = new URL(window.location.href).pathname.split("/")[3];
  document.getElementById("div_" + type.toLocaleLowerCase()).style.display = "block";
  try {
    const response = await fetch(
      "/api/getFromURL?url_link=" + url + "&table=" + type
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const data = await response.json();
    ID = data.ID;

    if (type != "Words") {
      document.getElementById("current_image_"+type.toLocaleLowerCase()).value = data.image_url;
      document.getElementById("content_image_" + type.toLocaleLowerCase()).src = data.image_url;
    }
    if (type == "Words") {
      document.getElementById("word_title").innerHTML = data.title;
      document.getElementById("word_meaning").innerHTML = data.meaning;
      document.getElementById("word_date").value = data.display_date;
    } else if (type == "Lessons") {
      document.getElementById("lesson_title").innerHTML = data.title;
      document.getElementById("lesson_short_description").innerHTML =
        data.short_description;
      document.getElementById("lesson_description").innerHTML =
        data.description;
      document.getElementById("lesson_language_level").value = data.language_level;
      document.getElementById("lesson_url_link").value = parseURL(data.url_link);
      document.getElementById("current_practice").href = data.content_url;
    } else if (type == "Culture") {
      var category = data.category.replace(/\s+/g, "-");
      var subcategory = data.subcategory.replace(/\s+/g, "-");
      document.getElementById("post_title").innerHTML = data.title;
      document.getElementById("post_short_description").innerHTML = data.short_description;
      document.getElementById("post_description").innerHTML = data.description;
      document.getElementById("category-select").value = category;
      document.getElementById(category).style.display = "block";
      document.getElementById("subcategory-select-" + category).value = subcategory;
      document.getElementById("min_read").value = data.min_read;
      document.getElementById("post_url_link").value = parseURL(data.url_link);
    } else if (type == "Events") {
      document.getElementById("event_title").innerHTML = data.title;
      document.getElementById("event_description").innerHTML = data.description;
      document.getElementById("event_platform_url").innerHTML = data.platform_url;
      document.getElementById("event_url_link").value = parseURL(data.url_link);
      document.getElementById("event_date").value = data.celebration_date;
      document.getElementById("event_category").value = data.category;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

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
