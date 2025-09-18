const teacherUsers = [
    { id: "teacher1", email: "teacher1@example.com", password: "password1" },
    { id: "teacher2", email: "teacher2@example.com", password: "password2" }
];

const adminUsers = [
    { id: "admin1", email: "admin1@example.com", password: "adminpass1" }
];

let currentUser = null; // stores logged-in user info

document.addEventListener("DOMContentLoaded", () => {
    const buildingsContainer = document.getElementById("buildingsContainer");
    const loginContainer = document.getElementById("loginContainer");
    const bookingContainer = document.getElementById("bookingContainer");
    const buildingFilter = document.getElementById("buildingFilter");
    const timeFilter = document.getElementById("timeFilter");

    // Move logoutBtn outside bookingContainer so it won't be hidden
    let logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.classList.add("logout-btn");
    logoutBtn.style.display = "none"; // Hide initially
    document.body.appendChild(logoutBtn);

    logoutBtn.addEventListener("click", () => {
        currentUser = null;
        bookingContainer.style.display = "none";
        loginContainer.style.display = "block";
        logoutBtn.style.display = "none";
        buildingFilter.value = "";
        timeFilter.value = "";
        // Clear buildings container
        buildingsContainer.innerHTML = "";
    });

    // Render buildings accepts filtered building data
    function renderBuildings(data) {
        buildingsContainer.innerHTML = "";

        data.forEach((building) => {
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
                    roomElem.style.cursor = "pointer";
                } else {
                    roomElem.classList.add("green");
                    roomElem.style.cursor = "pointer";
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
                        currentUser.id.toLowerCase() ===
                        room.bookedBy.toLowerCase().replace(/\s/g, "")
                    ) {
                        const cancelBtn = document.createElement("button");
                        cancelBtn.textContent = "Cancel Booking";
                        styleButton(cancelBtn, "#ff5252");

                        cancelBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            if (
                                confirm(`Are you sure you want to cancel booking for ${room.name}?`)
                            ) {
                                room.status = "available";
                                room.bookedBy = null;
                                room.bookedUntil = null;
                                alert(`Booking for ${room.name} cancelled.`);
                                applyFilters();
                            }
                        });

                        tooltip.appendChild(document.createElement("br"));
                        tooltip.appendChild(cancelBtn);
                    }
                } else if (room.status === "soon" || room.status === "available") {
                    tooltip.textContent =
                        room.status === "soon"
                            ? "Will be available in next 1 hour."
                            : "Room available.";

                    if (currentUser && !currentUser.isStudent) {
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
                                applyFilters();
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
                    const tooltip = roomElem.querySelector(".tooltip");
                    const col = roomIndex % 4;

                    if (col === 0) {
                        tooltip.style.left = "10%";
                        tooltip.style.transform = "translateX(0%) translateY(-130%)";
                    } else if (col === 3) {
                        tooltip.style.left = "90%";
                        tooltip.style.transform = "translateX(-100%) translateY(-130%)";
                    } else if (col === 1) {
                        tooltip.style.left = "35%";
                        tooltip.style.transform = "translateX(-10%) translateY(-130%)";
                    } else if (col === 2) {
                        tooltip.style.left = "65%";
                        tooltip.style.transform = "translateX(-90%) translateY(-130%)";
                    } else {
                        tooltip.style.left = "50%";
                        tooltip.style.transform = "translateX(-50%) translateY(-130%)";
                    }

                    if (roomIndex < 20) {
                        tooltip.style.top = "44px";
                        tooltip.style.transform = tooltip.style.transform.replace(
                            "translateY(-130%)",
                            "translateY(0)"
                        );
                    } else {
                        tooltip.style.top = "20px";
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

    // Filtering function - filters buildings based on building and time slot filter values
    function applyFilters() {
        let filteredBuildings = buildingsData;

        const buildingId = buildingFilter.value;
        if (buildingId) {
            filteredBuildings = filteredBuildings.filter((b) => b.id === buildingId);
        }

        const timeSlot = timeFilter.value;
        if (timeSlot) {
            filteredBuildings = filteredBuildings
                .map((b) => {
                    const filteredRooms = b.rooms.filter(
                        (r) =>
                            (r.status === "available" || r.status === "soon") &&
                            r.timeSlot === timeSlot
                    );
                    return { ...b, rooms: filteredRooms };
                })
                .filter((b) => b.rooms.length > 0);
        }

        renderBuildings(filteredBuildings);
    }

    const studentTab = document.getElementById("studentTab");
    const teacherTab = document.getElementById("teacherTab");
    const adminTab = document.getElementById("adminTab");

    const studentForm = document.getElementById("studentLoginForm");
    const teacherForm = document.getElementById("teacherLoginForm");
    const adminForm = document.getElementById("adminLoginForm");

    // Tab switching including admin
    function switchTab(selectedTab, selectedForm) {
        studentTab.classList.remove("active");
        teacherTab.classList.remove("active");
        adminTab.classList.remove("active");
        studentTab.setAttribute("aria-selected", "false");
        teacherTab.setAttribute("aria-selected", "false");
        adminTab.setAttribute("aria-selected", "false");
        studentTab.tabIndex = -1;
        teacherTab.tabIndex = -1;
        adminTab.tabIndex = -1;

        selectedTab.classList.add("active");
        selectedTab.setAttribute("aria-selected", "true");
        selectedTab.tabIndex = 0;

        studentForm.style.display = "none";
        studentForm.setAttribute("aria-hidden", "true");
        teacherForm.style.display = "none";
        teacherForm.setAttribute("aria-hidden", "true");
        adminForm.style.display = "none";
        adminForm.setAttribute("aria-hidden", "true");

        selectedForm.style.display = "";
        selectedForm.setAttribute("aria-hidden", "false");
    }

    studentTab.addEventListener("click", () => {
        switchTab(studentTab, studentForm);
    });
    teacherTab.addEventListener("click", () => {
        switchTab(teacherTab, teacherForm);
    });
    adminTab.addEventListener("click", () => {
        switchTab(adminTab, adminForm);
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
    document.getElementById("adminForgotBtn").addEventListener("click", openResetModal);

    modalCloseBtn.addEventListener("click", () => {
        modalBg.classList.remove("active");
    });

    modalBg.addEventListener("click", (e) => {
        if (e.target === modalBg) modalBg.classList.remove("active");
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

    function validateLogin(form, errorElem, userType) {
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

        if (userType === "student") {
            currentUser = { id: id.toLowerCase(), isStudent: true };
        } else if (userType === "teacher") {
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
            currentUser = { ...found, isStudent: false, isAdmin: false };
        } else if (userType === "admin") {
            const found = adminUsers.find(
                (a) =>
                    a.id.toLowerCase() === id.toLowerCase() &&
                    a.email === email &&
                    a.password === password
            );
            if (!found) {
                errorElem.textContent = "Invalid admin credentials.";
                return false;
            }
            currentUser = { ...found, isAdmin: true, isStudent: false };
        }

        alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} logged in successfully!`);
        form.reset();
        if (userType === "admin") {
            window.location.href = "timetable.html";
            return true;
        }

        loginContainer.style.display = "none";
        bookingContainer.style.display = "block";
        logoutBtn.style.display = "block";
        applyFilters();

        return true;
    }

    document
        .getElementById("studentLoginForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            validateLogin(e.target, document.getElementById("studentLoginError"), "student");
        });

    document
        .getElementById("teacherLoginForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            validateLogin(e.target, document.getElementById("teacherLoginError"), "teacher");
        });

    document
        .getElementById("adminLoginForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            validateLogin(e.target, document.getElementById("adminLoginError"), "admin");
        });

    // Add event listeners for filter changes
    buildingFilter.addEventListener("change", applyFilters);
    timeFilter.addEventListener("change", applyFilters);
});
