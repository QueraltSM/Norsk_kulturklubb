const li_word_of_the_day = document.getElementById("li_word_of_the_day");
const li_lesson = document.getElementById("li_lesson");
const li_post = document.getElementById("li_post");
const li_event = document.getElementById("li_event");

const div_word = document.getElementById("div_word");
const div_lesson = document.getElementById("div_lesson");
const div_post = document.getElementById("div_post");
const div_event = document.getElementById("div_event");

if (localStorage.getItem("userLoggedInRole") == "Collaborator") {
  li_post.style.display = "block";
  li_post.classList.add("filter-active");
  li_event.style.display = "block";
  $('.posts').show();
  $('.posts').addClass('filter-active');
  fetchCulture();
} else if (localStorage.getItem("userLoggedInRole") == "Teacher") {
  li_word_of_the_day.style.display = "block";
  li_word_of_the_day.classList.add("filter-active");
  li_lesson.style.display = "block";
  li_post.style.display = "block";
  li_event.style.display = "block";
  $('.words').show();
  $('.words').addClass('filter-active');
  fetchWords();
}


$('#contributions-flters li').click(function () {
  var filter = $(this).attr('data-filter');
  if (filter == ".words") {
    fetchWords();
  } else if (filter == ".lessons") {
    fetchLessons();
  } else if (filter == ".posts") {
    fetchCulture();
  } else if (filter == ".events") {
    //fetchEvents();
  }
 
  $('.contributions-item').hide();
  $(filter).show();
  $('#contributions-flters li').removeClass('filter-active');
  $(this).addClass('filter-active');
});

function convertToDateObject(dateString) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

async function fetchWords() {
  try {
    const response = await fetch(
      `/api/getMyContributions?user_id=${localStorage.getItem(
        "userLoggedInID"
      )}&table=Words`
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const data = await response.json();
    let words = data.Items || [];

    if (words.length === 0) {
      const noDataMessage = `
      <div style="text-align: center;">
      <h4 style="font-size: 18px; color: #9C3030; margin-top: 10px;"><strong>You haven't posted anything yet :(</strong></h4>
        <img src="/assets/img/not-found.png" alt="No data found" style="width:300px;padding-bottom:10px;">
      </div>
      `;
      words_container.innerHTML = noDataMessage;

    } else {
    words.sort((a, b) => {
      const dateA = new Date(convertToDateObject(a.pubdate));
      const dateB = new Date(convertToDateObject(b.pubdate));
      return dateB - dateA;
    });
    const wordsHTML = `
    <table class="contributions-table">
      <thead>
        <tr>
          <th>Published</th>
          <th>Word</th>
          <th>Meaning</th>
          <th>Displayed</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${words
          .map(
            (data) => `
              <tr>
                <td>${data.pubdate}</td>
                <td>${data.title}</td>
                <td>${data.meaning}</td>
                <td>${data.display_date}</td>
                <td style="text-align: center;">
                  <a href="#" onclick="manage_action('${data.url_link}', 'Words', 'edit')" style="display: inline-block; border-radius: 20px; color: #2471A3; margin: 5px; padding: 5px;"><i class="bi bi-pencil-square"></i></a>
                  <a href="#" onclick="manage_action('${data.url_link}', 'Words', 'delete')" style="display: inline-block; border-radius: 20px; color: #9C3030; margin: 5px; padding: 5px;"><i class="bi bi-x-circle-fill"></i></a>
                </td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;
      words_container.innerHTML = wordsHTML;
    }
  } catch (error) {}
}

async function fetchLessons() {
  try {
    const response = await fetch(
      `/api/getMyContributions?user_id=${localStorage.getItem(
        "userLoggedInID"
      )}&table=Lessons`
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const data = await response.json();
    let lessons = data.Items || [];
    if (lessons.length === 0) {
      const noDataMessage = `
      <div style="text-align: center;">
      <h4 style="font-size: 18px; color: #9C3030; margin-top: 10px;"><strong>You haven't posted anything yet :(</strong></h4>
        <img src="/assets/img/not-found.png" alt="No data found" style="width:300px">
      </div>
      `;
      lessons_container.innerHTML = noDataMessage;
    } else {
      lessons.sort((a, b) => {
        const dateA = new Date(convertToDateObject(a.pubdate));
        const dateB = new Date(convertToDateObject(b.pubdate));
        return dateB - dateA;
      });
      const lessonHTML = `
        <table class="contributions-table">
          <thead>
            <tr>
              <th>Published</th>
              <th>Title</th>
              <th>Language level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${lessons
              .map(
                (data) => `
                  <tr style='cursor:pointer;'>
                    <td>${data.pubdate}</td>
                    <td>${data.title}</td>
                    <td>${data.language_level}</td>
                    <td style="text-align: center;">
                    <a href="#" onclick="manage_action('${data.url_link}', 'Lessons', 'view')" style="display: inline-block; border-radius: 20px; color: #117A65; margin: 5px; padding: 5px;"><i class="fas fa-eye"></i></a>
                    <a href="#" onclick="manage_action('${data.url_link}', 'Lessons', 'edit')" style="display: inline-block; border-radius: 20px; color: #2471A3; margin: 5px; padding: 5px;"><i class="bi bi-pencil-square"></i></a>
                    <a href="#" onclick="manage_action('${data.url_link}', 'Lessons', 'delete')" style="display: inline-block; border-radius: 20px; color: #9C3030; margin: 5px; padding: 5px;"><i class="bi bi-x-circle-fill"></i></a>
                  </td>
                  </tr>
                `)
              .join("")}
          </tbody>
        </table>
      `;
      lessons_container.innerHTML = lessonHTML;
    }
  } catch (error) {
    console.error("Error fetching data:");
  }
}

async function fetchCulture() {
  try {
    const response = await fetch(
      `/api/getMyContributions?user_id=${localStorage.getItem(
        "userLoggedInID"
      )}&table=Culture`
    );
    if (!response.ok) {
      throw new Error("Failed to get server response.");
    }
    const data = await response.json();
    let posts = data.Items || [];
    if (posts.length === 0) {
      const noDataMessage = `
        <div style="text-align: center;">
        <h4 style="font-size: 18px; color: #9C3030; margin-top: 10px;"><strong>You haven't posted anything yet :(</strong></h4>
          <img src="/assets/img/not-found.png" alt="No data found" style="width:300px">
        </div>`;
      posts_container.innerHTML = noDataMessage;
    } else {
      posts.sort((a, b) => {
        const dateA = new Date(convertToDateObject(a.pubdate));
        const dateB = new Date(convertToDateObject(b.pubdate));
        return dateB - dateA;
      });
      const postsHTML = `
        <table class="contributions-table">
          <thead>
            <tr>
              <th>Published</th>
              <th>Title</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${posts
              .map(
                (data) => `
                  <tr>
                    <td>${data.pubdate}</td>
                    <td>${data.title}</td> 
                    <td>${data.category} > ${data.subcategory}</td> 
                    <td style="text-align: center;">
                    <a href="#" onclick="manage_action('${data.url_link}', 'Culture', 'view')" style="display: inline-block; border-radius: 20px; color: #117A65; margin: 5px; padding: 5px;"><i class="fas fa-eye"></i></a>
                    <a href="#" onclick="manage_action('${data.url_link}', 'Culture', 'edit')" style="display: inline-block; border-radius: 20px; color: #2471A3; margin: 5px; padding: 5px;"><i class="bi bi-pencil-square"></i></a>
                    <a href="#" onclick="manage_action('${data.url_link}', 'Culture', 'delete')" style="display: inline-block; border-radius: 20px; color: #9C3030; margin: 5px; padding: 5px;"><i class="bi bi-x-circle-fill"></i></a>
                  </td>          
                  </tr>`
              ).join("")}
          </tbody>
        </table>
      `;
      posts_container.innerHTML = postsHTML;
    }
  } catch (error) {}
}

async function manage_action(url, content_type, action) {
  if (action == "view") {
      window.location.href = "/"+content_type+"/"+url;
  } else if (action == "edit") {
    window.location.href = "/edit/"+content_type+"/"+url;
  } else {
    $('#confirmDeleteModal').modal('show');
  }
}

function deleteContentS3(url, key) {
  fetch('/api/deleteContentS3',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: localStorage.getItem("contentID"),
        key: key,
        url: url,
      })
    }).then((response) => {
      if (response.status === 500) {
        showAlert("danger","An issue occurred while deleting");
        return false;
      }
    });
  return true;
}

function deleteContentDB(ID) {
  fetch('/api/deleteContent',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ID,
        table: localStorage.getItem("contentType")
      })
    }
  ).then((response) => {
    if (response.status === 200) {
      location.reload();
    } else if (response.status === 500) {
      showAlert("danger","An issue occurred while deleting");
    }
  });
}

function deleteContent() {
  var type = localStorage.getItem("contentType");
  var data = JSON.parse(localStorage.getItem("contentData"));
  if (type == "Words") {
    deleteContentDB(data.ID);
  } else if (type == "Lessons") {
    var content_url = (data.content_url).substring((data.content_url).lastIndexOf("/") + 1);
    if (deleteContentS3(content_url, "Lessons")) {
      var image_url = (data.image_url).substring((data.image_url).lastIndexOf("/") + 1);
      if (deleteContentS3(image_url, "Lesson-Images")) {
        deleteContentDB(data.ID);
      }
    }
  } else if ("Culture") {
    var image_url = (data.image_url).substring((data.image_url).lastIndexOf("/") + 1);
    if (deleteContentS3(image_url, "Culture-Images")) {
      deleteContentDB(data.ID);
    }
  }
}