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


function loadLessonDetails(lessonId) {
  localStorage.setItem("lessonID", lessonId);
  window.location.href = "lesson.html";
}

function deleteLesson() {
  fetch(
    '/api/deleteLesson',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: localStorage.getItem("selectedLessonID"),
        content_url: localStorage.getItem("selectedLessonContentUrl")
      })
    }
  ).then((response) => {
    if (response.status === 200) {
      showAlert(
        "success",
        "Your lesson was removed sucessfully",
        "alertContainer",
        3000
      );
      setTimeout(() => {
        window.location.href = "/contributions.html";
      }, 3000);
    } else if (response.status === 500) {
      showAlert(
        "danger",
        "An issue occurred while deleting the lesson",
        "alertContainer",
        5000
      );
    }
  });
}

function askDelete(params) {
  const [lessonID, contentURL] = params.split(':::');
  localStorage.setItem("selectedLessonID", lessonID);
  localStorage.setItem("selectedLessonContentUrl", contentURL.substring(contentURL.lastIndexOf('/') + 1));
  $("#confirmDeleteModal").modal("show");
}

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${words
              .map(
                (w) => `
                  <tr>
                    <td>${w.pubdate}</td>
                    <td>${w.word}</td>
                    <td>${w.meaning}</td>
                    <td>${w.date}</td>
                    <td style="text-align: center;">
                      <a style="border-radius: 0px;color:#9C3030;margin:10px;" title="Edit"><i class="fas fa-pencil-alt"></i></a>
                      <a href="#" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Delete"><i class="fa fa-trash"></i></a>
                    </td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `;
      words_container.innerHTML = wordsHTML;
    }
  } catch (error) {
    console.log("Error fetching data");
  }
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${lessons
              .map(
                (l) => `
                  <tr style='cursor:pointer;'>
                    <td>${l.pubdate}</td>
                    <td>${l.title}</td>
                    <td>${l.language_level}</td>
                    <td style="text-align: center;">
                      <a href="#" title="View" onclick="manage_action('${l.ID}', '${l.title}', 'Lessons', 'view')" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Edit"><i class="fas fa-eye"></i></a>
                      <a href="#" title="Edit" onclick="manage_action('${l.ID}', '${l.title}', 'Lessons', 'edit')" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Edit"><i class="fas fa-pencil-alt"></i></a>
                      <a href="#" title="Delete" onclick="manage_action('${l.ID}', '${l.title}', 'Lessons', 'delete')" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Delete"><i class="fa fa-trash"></i></a>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${posts
              .map(
                (p) => `
                  <tr style='cursor:pointer;' onclick="manage_action('${p.ID}', '${p.title}', 'Culture', 'view')">
                    <td>${p.pubdate}</td>
                    <td>${p.title}</td> 
                  <td style="text-align: center;">
                    <a href="#" onclick="manage_action('${p.ID}', '${p.title}', 'Culture', 'edit')" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Edit"><i class="fas fa-pencil-alt"></i></a>
                    <a href="#" onclick="manage_action('${p.ID}', '${p.title}', 'Culture', 'delete')" style="border-radius: 0px;color:#9C3030;margin:10px;" title="Delete"><i class="fa fa-trash"></i></a>
                  </td>
                                  
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `;
      posts_container.innerHTML = postsHTML;
    }
  } catch (error) {
    console.log("Error fetching data");
  }
}

async function manage_action(ID, title, content_type, action) {
  localStorage.setItem("contentID", ID);
  localStorage.setItem("contentTitle", title);
  localStorage.setItem("contentType", content_type);
  if (action == "view") {
      window.location.href = `/${content_type}/${title.replace(/\s+/g, '-')}`;
  } else if (action == "edit") {
    window.location.href = `/edit/${content_type}/${title.replace(/\s+/g, '-')}`;
  }
}