const teachersContainer = document.getElementById("teachers_container");

function loadTeacherProfile(id) {
  localStorage.setItem("teacherID", id);
  window.location.href = "teacher.html";
}

async function fetchData() {
  try {
    const response = await fetch("/api/getTeachers");
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const data = await response.json();
    data.Items.forEach(async (teacher, index) => {
      if (teacher.public_profile) {
        const teacherDiv = document.createElement("div");
        teacherDiv.classList.add("col-lg-4");
        const teacherName = await get_teacher_name(teacher.ID);
        teacherDiv.innerHTML = `
          <a href="#" onclick="loadTeacherProfile('${teacher.ID}')">
            <div class="member" style="border-radius: 10px;">
              <div class="member-img">
                <img src="${teacher.profile_picture}" class="img-fluid" alt="">
                <div class="social" style="display: flex; justify-content: center; align-items: center;">
                  <div style="flex-grow: 1;">
                    <h4 style="text-align: center; margin: 0;">Hei, I'm <strong>${teacherName}</strong></h4>
                  </div>
                  <div style="display: flex; align-items: center; padding-right: 5%;">
                    ${teacher.rating > 0 ? `
                      <div style="display: flex; align-items: center;">
                        <i style="font-size: 13px; margin-right: 5px; color:#ffc107;" class="fa fa-star checked"></i>
                        <span style="font-size: 13px; color: #37423b; font-weight: bold;">
                          ${teacher.rating}
                        </span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
              <div class="member-info">
                <div style="font-size: 13px;">
                  <strong>${teacher.city_residence}</strong>&nbsp;
                  ${
                    teacher.teaching_online && teacher.teaching_in_person
                      ? `· Online and in person`
                      : teacher.teaching_online
                      ? `· Online`
                      : teacher.teaching_in_person
                      ? `· In person`
                      : ""
                  }&nbsp;&nbsp;<strong>${teacher.hourly_rate}</strong>
                </div>
                <p style="padding-top:5px;text-align:center;">${teacher.short_description}</p> 
              </div>
            </div>
          </a>`;
        teachersContainer.appendChild(teacherDiv);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("teacherData").textContent = "Error fetching data";
  }
}


async function get_teacher_name(id) {
  try {
    const response1 = await fetch(
      `/api/getUser?id=${id}&table=Users`
    );
    if (!response1.ok) {
      throw new Error("No response could be obtained from the server");
    }
    const user = await response1.json();
    return user.first_name;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

fetchData();