var ID = "";
var image_url = "";
var type = "";
var url = "";

function handleDocumentViewer() {
  var document_container = document.getElementById("document_container");
  if (document_container.style.display == "none") {
    document_container.style.display = "block";
    document.getElementById("document_label").innerHTML = "Close document";
  } else {
    document_container.style.display = "none";
    document.getElementById("document_label").innerHTML =
      "View current document";
  }
}

async function updateLesson() {
  var title = document.getElementById("lesson_title").innerHTML.trim();
  var short_description = document
    .getElementById("lesson_short_description")
    .innerHTML.trim();
  var description = document.getElementById("lesson_description").value.trim();
  var language_level = document.getElementById("lesson_language_level").value;
  var lesson_image = document.getElementById("lesson_image").files[0];
  var image_url = document.getElementById(
    "content_image_" + type.toLocaleLowerCase()
  ).src;
  var lesson_content_url =
    document.getElementById("lesson_content_url").files[0];
  var content_url = localStorage.getItem("lesson_content_url");
  var url_link = formatURL(
    document.getElementById("lesson_url_link").innerHTML
  );
  var url_available = await check_availability_url_link("Lessons", url_link);
  if (
    !title ||
    !short_description ||
    !description ||
    !language_level ||
    !url_link
  ) {
    showAlert("danger", "All fields must be completed to update");
  } else {
    alert(url_available);
    if (url_available) {
      if (lesson_content_url) {
        var formData = new FormData();
        formData.append("file", lesson_content_url);
        var filename =
          localStorage.getItem("contentURL") +
          "." +
          lesson_content_url.name.match(/\.([^.]+)$/)[1];
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
      }
      if (lesson_image) {
        var formData = new FormData();
        formData.append("image", lesson_image);
        url = document.getElementById(
          "content_image_" + type.toLocaleLowerCase()
        ).src;
        var filename = url.substring(url.lastIndexOf("/") + 1);
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
          image_url: image_url,
          content_url: content_url,
          url_link: url_link,
        }),
      });
      if (!response.ok) {
        throw new Error("There was an error");
      } else {
        showAlert("success", "Lesson was updated");
      }
      window.location.href = "/Edit/Lessons/" + url_link;
    } else {
      showAlert("danger", "URL link is not available. Try another one.");
    }
  }
}

async function updateWord() {
  var title = document.getElementById("word_title").innerHTML;
  var meaning = document.getElementById("word_meaning").innerHTML;
  var calendar = document.getElementById("word_date").value;
  var url_link =
    title
      .toLowerCase()
      .replace(/[.,]/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-{2,}/g, "-") +
    "-" +
    formatDate(calendar);
  if (title && meaning && calendar) {
    const response = await fetch(`/api/updateContent?table=Words&ID=` + ID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        meaning: meaning,
        display_date: calendar,
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
  var short_description = document.getElementById(
    "post_short_description"
  ).innerHTML;
  var description = document.getElementById("post_description").value;
  var category = document.getElementById("category_select").value;
  var subcategory = document.getElementById("subcategory_select").value;
  var min_read = document.getElementById("min_read").value;
  var post_image = document.getElementById("post_image").files[0];
  var url_link = formatURL(document.getElementById("post_url_link").innerHTML);

  if (
    !title &&
    !short_description &&
    !category &&
    !subcategory &&
    !min_read &&
    !url_link
  ) {
    showAlert("danger", "All fields must be completed to update");
  } else {
    if (post_image) {
      var formData = new FormData();
      formData.append("image", post_image);
      const response = await fetch(
        `/api/updateImage?key=Culture-Images&filename=${image_url
          .split("/")
          .pop()}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
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
        min_read: min_read,
        url_link: url_link,
      }),
    });
    if (!response.ok) {
      throw new Error("There was an error");
    } else {
      window.location.href = "/Edit/Culture/" + url_link;
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
    image_url = data.image_url;
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
      document.getElementById("content_image_" + type.toLocaleLowerCase()).src =
        data.image_url;
      document.getElementById("lesson_language_level").value =
        data.language_level;
      document.getElementById("lesson_url_link").innerHTML = parseURL(
        data.url_link
      );
      var content_url = data.content_url;
      localStorage.setItem("lesson_content_url", data.content_url);
      localStorage.setItem(
        "contentURL",
        content_url.substring(
          content_url.lastIndexOf("/") + 1,
          content_url.lastIndexOf(".")
        )
      );
      const contentType = data.content_url.split(".").pop();
      if (contentType == "mp4") {
        document.getElementById("video_url").src = data.content_url;
        document.getElementById("video_container").style.display = "block";
      } else {
        document.getElementById("iframe_container").src =
          "https://docs.google.com/viewer?url=" +
          data.content_url +
          "&embedded=true";
        document.getElementById("iframe_container").style.display = "block";
      }
    } else if (type == "Culture") {
      var category = data.category.replace(/\s+/g, "-");
      var subcategory = data.subcategory.replace(/\s+/g, "-");
      document.getElementById("post_title").innerHTML = data.title;
      document.getElementById("post_short_description").innerHTML =
        data.short_description;
      document.getElementById("post_description").innerHTML = data.description;
      document.getElementById("category_select").value = category;
      document.getElementById(category).style.display = "block";
      document.getElementById("subcategory_select").value = subcategory;
      document.getElementById("min_read").value = data.min_read;
      document.getElementById("content_image_" + type.toLocaleLowerCase()).src =
        image_url;
      document.getElementById("post_url_link").innerHTML = parseURL(
        data.url_link
      );
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
