const teachersContainer = document.querySelector(".teachers .container");
const row = document.createElement("div");
row.classList.add("row");
fetch("http://localhost:3000/api/getTeachers")
  .then((response) => {
    if (!response.ok) {
      throw new Error("No response could be obtained from the server");
    }
    return response.json();
  })
  .then((data) => {
    data.Items.forEach((teacher, index) => {
      if (teacher.public_profile) {
        const teacherDiv = document.createElement("div");
        teacherDiv.classList.add(
          "col-lg-4",
          "col-md-6",
          "d-flex",
          "align-items-stretch"
        );
        teacherDiv.innerHTML = `
          <a href="teacher_profile.html?aWQ==${teacher.ID}">
            <div class="member">
              <div class="member-img">
                <img src="${teacher.profile_picture}" class="img-fluid" alt="">
                <div class="social" style="display: flex; justify-content: center; align-items: center;">
                  <div style="flex-grow: 1;">
                    <h4 style="text-align: center; margin: 0;">Hei, I'm <strong>${teacher.name}</strong></h4>
                  </div>
                  <div style="display: flex; align-items: center; padding-right: 5%;">
                    <div style="display: flex; align-items: center;">
                      <i style="font-size: 13px; margin-right: 5px; color:#ffc107;" class="fa fa-star ${teacher.rating >= 1 ? "checked" : ""}"></i>
                      <span style="font-size: 13px; color: #37423b; font-weight: bold;">${teacher.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="member-info">
                <div style="font-size: 13px;">
                  <strong>${teacher.location}</strong>&nbsp;
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
                <p style="padding-top:5px;">${teacher.short_description}</p> 
              </div>
            </div>
          </a>
        `;
        row.appendChild(teacherDiv);
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    document.getElementById("teacherData").textContent =
      "Error fetching data";
  });
teachersContainer.appendChild(row);