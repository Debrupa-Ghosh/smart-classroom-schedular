const teacherUsers = [
  { id: "teacher1", email: "teacher1@example.com", password: "password1" },
  { id: "teacher2", email: "teacher2@example.com", password: "password2" }
];
let currentUser = null; // stores logged-in user info

document.addEventListener("DOMContentLoaded", () => {
  const buildingsContainer = document.getElementById("buildingsContainer");
  const loginContainer = document.getElementById("loginContainer");
  const bookingContainer = document.getElementById("bookingContainer");

  let logoutBtn = null;

  function renderBuildings() {
    buildingsContainer.innerHTML = "";

    buildingsData.forEach((building) => {
      const buildingElem = document.createElement("section");
      buildingElem.classList.add("building");
      buildingElem.setAttribute("role", "listitem");
      buildingElem.setAttribute("aria-label", building.name);

      const buildingTitle = document.createElement("h3");
      buildingTitle.textContent = building.name;
      buildingElem.appendChild(buildingTitle);

      const roomsGrid = document.createElement("div");
      roomsGrid.classList.add("rooms-grid");

      building.rooms.forEach((room, roomIndex) => {
        const roomElem = document.createElement("div");
        roomElem.classList.add("room");
        roomElem.textContent = room.name;

        roomElem.classList.remove("green", "orange", "grey");

        if (room.status === "booked") {
          roomElem.classList.add("grey");
          roomElem.style.cursor = "default";
        } else if (room.status === "soon") {
          roomElem.classList.add("orange");
          roomElem.style.cursor = currentUser && !currentUser.isStudent ? "pointer" : "default";
        } else {
          roomElem.classList.add("green");
          roomElem.style.cursor = currentUser && !currentUser.isStudent ? "pointer" : "default";
        }

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");

        if (room.status === "booked") {
          tooltip.innerHTML =
            `<strong>Booked by:</strong> ${room.bookedBy}<br>` +
            `<strong>Booked until:</strong> ${room.bookedUntil}`;

          if (
            currentUser &&
            !currentUser.isStudent &&
            currentUser.id.toLowerCase() === room.bookedBy.toLowerCase().replace(/\s/g, '')
          ) {
            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancel Booking";
            styleButton(cancelBtn, "#ff5252");

            cancelBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to cancel booking for ${room.name}?`)) {
                room.status = "available";
                room.bookedBy = null;
                room.bookedUntil = null;
                alert(`Booking for ${room.name} cancelled.`);
                renderBuildings();
              }
            });

            tooltip.appendChild(document.createElement("br"));
            tooltip.appendChild(cancelBtn);
          }

        } else if (room.status === "soon") {
          tooltip.textContent = "Will be available in next 1 hour.";

          if (
            currentUser &&
            !currentUser.isStudent
          ) {
            const bookBtn = document.createElement("button");
            bookBtn.textContent = "Book Room";
            styleButton(bookBtn, "#00bfa5");

            bookBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to book ${room.name}?`)) {
                room.status = "booked";
                room.bookedBy = currentUser.id;
                const now = new Date();
                const untilHour = now.getHours() + 1;
                room.bookedUntil =
                  untilHour > 12
                    ? untilHour - 12 + ":00 PM"
                    : untilHour + ":00 AM";
                alert(`Room ${room.name} booked successfully.`);
                renderBuildings();
              }
            });

            tooltip.appendChild(document.createElement("br"));
            tooltip.appendChild(bookBtn);
          }

        } else { // available
          tooltip.textContent = "Room available.";

          if (
            currentUser &&
            !currentUser.isStudent &&
            (room.status === "available")
          ) {
            const bookBtn = document.createElement("button");
            bookBtn.textContent = "Book Room";
            styleButton(bookBtn, "#00bfa5");

            bookBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to book ${room.name}?`)) {
                room.status = "booked";
                room.bookedBy = currentUser.id;
                const now = new Date();
                const untilHour = now.getHours() + 1;
                room.bookedUntil =
                  untilHour > 12
                    ? untilHour - 12 + ":00 PM"
                    : untilHour + ":00 AM";
                alert(`Room ${room.name} booked successfully.`);
                renderBuildings();
              }
            });

            tooltip.appendChild(document.createElement("br"));
            tooltip.appendChild(bookBtn);
          }
        }

        roomElem.appendChild(tooltip);

        // Dynamic tooltip positioning for edge rooms

        roomElem.addEventListener("mouseenter", () => {
          roomElem.classList.add("tooltip-visible");
          const tooltip = roomElem.querySelector('.tooltip');
          const col = roomIndex % 4;

          if (col === 0) {
            tooltip.style.left = "10%";
            tooltip.style.transform = "translateX(0%) translateY(-130%)";
          } else if (col === 3) {
            tooltip.style.left = "90%";
            tooltip.style.transform = "translateX(-100%) translateY(-130%)";
          } else if (col === 1) {
            tooltip.style.left = "35%"; // shift a bit right for second column
            tooltip.style.transform = "translateX(-10%) translateY(-130%)";
          } else if (col === 2) {
            tooltip.style.left = "65%"; // shift a bit left for third column
            tooltip.style.transform = "translateX(-90%) translateY(-130%)";
          } else {
            tooltip.style.left = "50%";
            tooltip.style.transform = "translateX(-50%) translateY(-130%)";
          }

          if (roomIndex < 12) {
            tooltip.style.top = "44px"; // show below the room
            tooltip.style.transform = tooltip.style.transform.replace('translateY(-130%)', 'translateY(0)');
          } else {
            tooltip.style.top = "20px"; // show above the room
            tooltip.style.transform += " translateY(-130%)";
          }
        });

        roomElem.addEventListener("mouseleave", () => {
          roomElem.classList.remove("tooltip-visible");
        });

        roomsGrid.appendChild(roomElem);
      });

      buildingElem.appendChild(roomsGrid);
      buildingsContainer.appendChild(buildingElem);
    });
  }

  function styleButton(button, bgColor) {
    button.style.marginTop = "6px";
    button.style.padding = "4px 6px";
    button.style.borderRadius = "6px";
    button.style.border = "none";
    button.style.backgroundColor = bgColor;
    button.style.color = "#fff";
    button.style.cursor = "pointer";
    button.style.fontSize = "0.8rem";
  }

  function addLogoutButton() {
    if (!logoutBtn) {
      logoutBtn = document.createElement("button");
      logoutBtn.textContent = "Logout";
      logoutBtn.classList.add('logout-btn');

      logoutBtn.addEventListener('click', () => {
        currentUser = null;
        bookingContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        if (logoutBtn.parentElement) {
          logoutBtn.parentElement.removeChild(logoutBtn);
          logoutBtn = null;
        }
      });

      bookingContainer.style.position = 'relative'; // ensure positioning context
      bookingContainer.appendChild(logoutBtn);
    }
  }


  const studentTab = document.getElementById("studentTab");
  const teacherTab = document.getElementById("teacherTab");
  const studentForm = document.getElementById("studentLoginForm");
  const teacherForm = document.getElementById("teacherLoginForm");

  studentTab.addEventListener("click", () => {
    studentTab.classList.add("active");
    teacherTab.classList.remove("active");
    studentTab.setAttribute("aria-selected", "true");
    teacherTab.setAttribute("aria-selected", "false");
    studentTab.tabIndex = 0;
    teacherTab.tabIndex = -1;
    studentForm.style.display = "";
    studentForm.setAttribute("aria-hidden", "false");
    teacherForm.style.display = "none";
    teacherForm.setAttribute("aria-hidden", "true");
  });

  teacherTab.addEventListener("click", () => {
    teacherTab.classList.add("active");
    studentTab.classList.remove("active");
    teacherTab.setAttribute("aria-selected", "true");
    studentTab.setAttribute("aria-selected", "false");
    teacherTab.tabIndex = 0;
    studentTab.tabIndex = -1;
    teacherForm.style.display = "";
    teacherForm.setAttribute("aria-hidden", "false");
    studentForm.style.display = "none";
    studentForm.setAttribute("aria-hidden", "true");
  });

  const modalBg = document.getElementById("modalBg");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const resetPasswordError = document.getElementById("resetPasswordError");

  function openResetModal() {
    resetPasswordError.textContent = "";
    resetPasswordForm.reset();
    modalBg.classList.add("active");
    resetPasswordForm.querySelector("input").focus();
  }

  document.getElementById("studentForgotBtn").addEventListener("click", openResetModal);
  document.getElementById("teacherForgotBtn").addEventListener("click", openResetModal);

  modalCloseBtn.addEventListener("click", () => {
    modalBg.classList.remove("active");
  });

  resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    resetPasswordError.textContent = "";

    const pw1 = resetPasswordForm.newPassword1.value.trim();
    const pw2 = resetPasswordForm.newPassword2.value.trim();

    if (pw1.length < 6) {
      resetPasswordError.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (pw1 !== pw2) {
      resetPasswordError.textContent = "Passwords do not match.";
      return;
    }

    alert("Password reset successful!");
    modalBg.classList.remove("active");
  });

  function validateLogin(form, errorElem, isStudent) {
    errorElem.textContent = "";

    const id = form.querySelector("input[type=text]").value.trim();
    const email = form.querySelector("input[type=email]").value.trim();
    const password = form.querySelector("input[type=password]").value.trim();

    if (!id || !email || !password) {
      errorElem.textContent = "All fields are required.";
      return false;
    }
    if (!email.includes("@")) {
      errorElem.textContent = "Enter a valid email.";
      return false;
    }
    if (password.length < 6) {
      errorElem.textContent = "Password must be at least 6 characters.";
      return false;
    }

    if (isStudent) {
      currentUser = { id: id.toLowerCase(), isStudent: true };
    } else {
      const found = teacherUsers.find(
        (t) =>
          t.id.toLowerCase() === id.toLowerCase() &&
          t.email === email &&
          t.password === password
      );
      if (!found) {
        errorElem.textContent = "Invalid teacher credentials.";
        return false;
      }
      currentUser = { ...found, isStudent: false };
    }

    alert(`${isStudent ? "Student" : "Teacher"} logged in successfully!`);
    form.reset();

    loginContainer.style.display = "none";
    bookingContainer.style.display = "block";
    addLogoutButton();
    renderBuildings();

    return true;
  }

  document.getElementById("studentLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    validateLogin(e.target, document.getElementById("studentLoginError"), true);
  });

  document.getElementById("teacherLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    validateLogin(e.target, document.getElementById("teacherLoginError"), false);
  });
});
