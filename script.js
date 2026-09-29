// ======================================================
// EVENING CLASSES
// MAIN JAVASCRIPT FILE
// ======================================================


// ======================================================
// INITIALIZE SYSTEM
// ======================================================

function initializeSystem() {

    if (!localStorage.getItem("staff")) {

        const defaultStaff = [
            {
                name: "Demo Teacher",
                username: "teacher",
                password: "teacher123"
            }
        ];

        localStorage.setItem(
            "staff",
            JSON.stringify(defaultStaff)
        );
    }


    if (!localStorage.getItem("subjects")) {

        const defaultSubjects = [
            "Mathematics",
            "English",
            "Kiswahili",
            "Biology",
            "Chemistry",
            "Physics",
            "Geography",
            "History",
            "Computer Studies"
        ];

        localStorage.setItem(
            "subjects",
            JSON.stringify(defaultSubjects)
        );
    }


    if (!localStorage.getItem("submissions")) {

        localStorage.setItem(
            "submissions",
            JSON.stringify([])
        );
    }
}


initializeSystem();


// ======================================================
// LOGIN
// ======================================================

function login() {

    const role =
        document.getElementById("role").value;

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const message =
        document.getElementById("message");


    // ADMIN LOGIN

    if (role === "admin") {

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "loggedInRole",
                "admin"
            );

            localStorage.setItem(
                "loggedInUser",
                "Administrator"
            );

            localStorage.removeItem(
                "loggedInUsername"
            );

            window.location.href =
                "admin-dashboard.html";

        } else {

            message.textContent =
                "Invalid administrator username or password.";
        }

        return;
    }


    // STAFF LOGIN

    if (role === "staff") {

        const staff =
            JSON.parse(
                localStorage.getItem("staff")
            ) || [];


        const foundStaff =
            staff.find(function(member) {

                return (
                    member.username === username &&
                    member.password === password
                );

            });


        if (foundStaff) {

            localStorage.setItem(
                "loggedInRole",
                "staff"
            );

            localStorage.setItem(
                "loggedInUser",
                foundStaff.name
            );

            localStorage.setItem(
                "loggedInUsername",
                foundStaff.username
            );

            window.location.href =
                "staff-dashboard.html";

        } else {

            message.textContent =
                "Invalid staff username or password.";
        }
    }
}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "loggedInRole"
    );

    localStorage.removeItem(
        "loggedInUser"
    );

    localStorage.removeItem(
        "loggedInUsername"
    );

    window.location.href =
        "index.html";
}


// ======================================================
// PAGE PROTECTION
// ======================================================

function protectAdminPage() {

    const role =
        localStorage.getItem(
            "loggedInRole"
        );

    if (role !== "admin") {

        window.location.href =
            "index.html";
    }
}


function protectStaffPage() {

    const role =
        localStorage.getItem(
            "loggedInRole"
        );

    if (role !== "staff") {

        window.location.href =
            "index.html";
    }
}


// ======================================================
// ADMIN DASHBOARD
// ======================================================

function loadAdminDashboard() {

    protectAdminPage();


    const staff =
        JSON.parse(
            localStorage.getItem("staff")
        ) || [];


    const subjects =
        JSON.parse(
            localStorage.getItem("subjects")
        ) || [];


    const submissions =
        JSON.parse(
            localStorage.getItem("submissions")
        ) || [];


    const pending =
        submissions.filter(function(item) {

            return item.status === "Pending";

        });


    setText(
        "staffCount",
        staff.length
    );


    setText(
        "subjectCount",
        subjects.length
    );


    setText(
        "submissionCount",
        submissions.length
    );


    setText(
        "pendingCount",
        pending.length
    );
}


// ======================================================
// STAFF MANAGEMENT
// ======================================================

function saveStaff() {

    protectAdminPage();


    const name =
        document.getElementById(
            "staffName"
        ).value.trim();


    const username =
        document.getElementById(
            "staffUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "staffPassword"
        ).value.trim();


    const editIndex =
        document.getElementById(
            "staffEditIndex"
        ).value;


    const message =
        document.getElementById(
            "staffMessage"
        );


    if (
        name === "" ||
        username === "" ||
        password === ""
    ) {

        message.textContent =
            "Please complete all staff details.";

        return;
    }


    let staff =
        JSON.parse(
            localStorage.getItem("staff")
        ) || [];


    const duplicate =
        staff.findIndex(
            function(member, index) {

                return (
                    member.username.toLowerCase() ===
                    username.toLowerCase() &&
                    String(index) !== editIndex
                );

            }
        );


    if (duplicate !== -1) {

        message.textContent =
            "That username is already being used.";

        return;
    }


    const member = {

        name: name,
        username: username,
        password: password

    };


    if (editIndex === "") {

        staff.push(member);

        message.textContent =
            "Staff account added successfully.";

    } else {

        staff[Number(editIndex)] =
            member;

        message.textContent =
            "Staff account updated successfully.";
    }


    localStorage.setItem(
        "staff",
        JSON.stringify(staff)
    );


    clearStaffForm();

    loadStaff();
}


function loadStaff() {

    protectAdminPage();


    const table =
        document.getElementById(
            "staffTableBody"
        );


    if (!table) {

        return;
    }


    const staff =
        JSON.parse(
            localStorage.getItem("staff")
        ) || [];


    table.innerHTML = "";


    if (staff.length === 0) {

        table.innerHTML =
            '<tr><td colspan="4">No staff accounts have been added.</td></tr>';

        return;
    }


    staff.forEach(
        function(member, index) {

            const row =
                document.createElement("tr");


            row.innerHTML =

                "<td>" +
                (index + 1) +
                "</td>" +

                "<td>" +
                escapeHTML(member.name) +
                "</td>" +

                "<td>" +
                escapeHTML(member.username) +
                "</td>" +

                "<td>" +

                '<button class="edit-btn" onclick="editStaff(' +
                index +
                ')">Edit</button> ' +

                '<button class="delete-btn" onclick="deleteStaff(' +
                index +
                ')">Delete</button>' +

                "</td>";


            table.appendChild(row);

        }
    );
}


function editStaff(index) {

    const staff =
        JSON.parse(
            localStorage.getItem("staff")
        ) || [];


    const member =
        staff[index];


    if (!member) {

        return;
    }


    document.getElementById(
        "staffName"
    ).value =
        member.name;


    document.getElementById(
        "staffUsername"
    ).value =
        member.username;


    document.getElementById(
        "staffPassword"
    ).value =
        member.password;


    document.getElementById(
        "staffEditIndex"
    ).value =
        index;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function deleteStaff(index) {

    const answer =
        confirm(
            "Are you sure you want to delete this staff account?"
        );


    if (!answer) {

        return;
    }


    let staff =
        JSON.parse(
            localStorage.getItem("staff")
        ) || [];


    staff.splice(
        index,
        1
    );


    localStorage.setItem(
        "staff",
        JSON.stringify(staff)
    );


    loadStaff();
}


function clearStaffForm() {

    if (
        !document.getElementById(
            "staffName"
        )
    ) {

        return;
    }


    document.getElementById(
        "staffName"
    ).value = "";


    document.getElementById(
        "staffUsername"
    ).value = "";


    document.getElementById(
        "staffPassword"
    ).value = "";


    document.getElementById(
        "staffEditIndex"
    ).value = "";
}


// ======================================================
// SUBJECT MANAGEMENT
// ======================================================

function saveSubject() {

    protectAdminPage();


    const subjectName =
        document.getElementById(
            "subjectName"
        ).value.trim();


    const editIndex =
        document.getElementById(
            "subjectEditIndex"
        ).value;


    const message =
        document.getElementById(
            "subjectMessage"
        );


    if (subjectName === "") {

        message.textContent =
            "Please enter a subject name.";

        return;
    }


    let subjects =
        JSON.parse(
            localStorage.getItem("subjects")
        ) || [];


    const duplicate =
        subjects.findIndex(
            function(subject, index) {

                return (
                    subject.toLowerCase() ===
                    subjectName.toLowerCase() &&
                    String(index) !== editIndex
                );

            }
        );


    if (duplicate !== -1) {

        message.textContent =
            "This subject already exists.";

        return;
    }


    if (editIndex === "") {

        subjects.push(
            subjectName
        );

        message.textContent =
            "Subject added successfully.";

    } else {

        subjects[
            Number(editIndex)
        ] =
            subjectName;

        message.textContent =
            "Subject updated successfully.";
    }


    subjects.sort(
        function(a, b) {

            return a.localeCompare(b);

        }
    );


    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );


    clearSubjectForm();

    loadSubjects();
}


function loadSubjects() {

    protectAdminPage();


    const table =
        document.getElementById(
            "subjectTableBody"
        );


    if (!table) {

        return;
    }


    const subjects =
        JSON.parse(
            localStorage.getItem("subjects")
        ) || [];


    table.innerHTML = "";


    if (subjects.length === 0) {

        table.innerHTML =
            '<tr><td colspan="3">No subjects have been added.</td></tr>';

        return;
    }


    subjects.forEach(
        function(subject, index) {

            const row =
                document.createElement("tr");


            row.innerHTML =

                "<td>" +
                (index + 1) +
                "</td>" +

                "<td>" +
                escapeHTML(subject) +
                "</td>" +

                "<td>" +

                '<button class="edit-btn" onclick="editSubject(' +
                index +
                ')">Edit</button> ' +

                '<button class="delete-btn" onclick="deleteSubject(' +
                index +
                ')">Delete</button>' +

                "</td>";


            table.appendChild(row);

        }
    );
}


function editSubject(index) {

    const subjects =
        JSON.parse(
            localStorage.getItem("subjects")
        ) || [];


    if (
        typeof subjects[index] ===
        "undefined"
    ) {

        return;
    }


    document.getElementById(
        "subjectName"
    ).value =
        subjects[index];


    document.getElementById(
        "subjectEditIndex"
    ).value =
        index;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function deleteSubject(index) {

    const answer =
        confirm(
            "Are you sure you want to delete this subject?"
        );


    if (!answer) {

        return;
    }


    let subjects =
        JSON.parse(
            localStorage.getItem("subjects")
        ) || [];


    subjects.splice(
        index,
        1
    );


    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );


    loadSubjects();
}


function clearSubjectForm() {

    if (
        !document.getElementById(
            "subjectName"
        )
    ) {

        return;
    }


    document.getElementById(
        "subjectName"
    ).value = "";


    document.getElementById(
        "subjectEditIndex"
    ).value = "";
}


// ======================================================
// STAFF DASHBOARD
// ======================================================

function loadStaffDashboard() {

    protectStaffPage();


    const staffName =
        localStorage.getItem(
            "loggedInUser"
        );


    setText(
        "staffWelcomeName",
        staffName || "Staff"
    );


    loadTeachingSubjects();

    loadMySubmissions();

    setDefaultTeachingDate();
}


// ======================================================
// SUBJECT DROPDOWN
// ======================================================

function loadTeachingSubjects() {

    const select =
        document.getElementById(
            "teachingSubject"
        );


    if (!select) {

        return;
    }


    const subjects =
        JSON.parse(
            localStorage.getItem("subjects")
        ) || [];


    select.innerHTML =
        '<option value="">Select Subject</option>';


    subjects.forEach(
        function(subject) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject;


            option.textContent =
                subject;


            select.appendChild(
                option
            );

        }
    );
}


// ======================================================
// DEFAULT DATE
// ======================================================

function setDefaultTeachingDate() {

    const input =
        document.getElementById(
            "teachingDate"
        );


    if (!input) {

        return;
    }


    if (input.value !== "") {

        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    input.value =
        year +
        "-" +
        month +
        "-" +
        day;
}


// ======================================================
// SUBMIT TEACHING RECORD
// ======================================================

function submitTeachingRecord(event) {

    event.preventDefault();


    protectStaffPage();


    const subject =
        document.getElementById(
            "teachingSubject"
        ).value;


    const date =
        document.getElementById(
            "teachingDate"
        ).value;


    const startTime =
        document.getElementById(
            "startTime"
        ).value;


    const endTime =
        document.getElementById(
            "endTime"
        ).value;


    const topic =
        document.getElementById(
            "topicCovered"
        ).value.trim();


    const remarks =
        document.getElementById(
            "remarks"
        ).value.trim();


    const message =
        document.getElementById(
            "submissionMessage"
        );


    if (
        subject === "" ||
        date === "" ||
        startTime === "" ||
        endTime === "" ||
        topic === ""
    ) {

        message.textContent =
            "Please complete all required fields.";

        message.className =
            "error-message";

        return;
    }


    if (
        endTime <=
        startTime
    ) {

        message.textContent =
            "End time must be later than start time.";

        message.className =
            "error-message";

        return;
    }


    let submissions =
        JSON.parse(
            localStorage.getItem(
                "submissions"
            )
        ) || [];


    const submission = {

        id:
            Date.now(),

        staffName:
            localStorage.getItem(
                "loggedInUser"
            ),

        username:
            localStorage.getItem(
                "loggedInUsername"
            ),

        subject:
            subject,

        date:
            date,

        startTime:
            startTime,

        endTime:
            endTime,

        topic:
            topic,

        remarks:
            remarks,

        status:
            "Pending",

        submittedAt:
            new Date().toISOString()

    };


    submissions.push(
        submission
    );


    localStorage.setItem(
        "submissions",
        JSON.stringify(submissions)
    );


    message.textContent =
        "Class record submitted successfully. It is awaiting approval.";


    message.className =
        "success-message";


    document.getElementById(
        "teachingSubject"
    ).value = "";


    document.getElementById(
        "startTime"
    ).value = "";


    document.getElementById(
        "endTime"
    ).value = "";


    document.getElementById(
        "topicCovered"
    ).value = "";


    document.getElementById(
        "remarks"
    ).value = "";


    loadMySubmissions();
}


// ======================================================
// STAFF PREVIOUS SUBMISSIONS
// ======================================================

function loadMySubmissions() {

    const table =
        document.getElementById(
            "mySubmissionTable"
        );


    if (!table) {

        return;
    }


    const username =
        localStorage.getItem(
            "loggedInUsername"
        );


    const submissions =
        JSON.parse(
            localStorage.getItem(
                "submissions"
            )
        ) || [];


    const mine =
        submissions.filter(
            function(item) {

                return (
                    item.username ===
                    username
                );

            }
        );


    table.innerHTML = "";


    if (mine.length === 0) {

        table.innerHTML =
            '<tr><td colspan="7">You have not submitted any evening classes yet.</td></tr>';

        return;
    }


    mine
        .slice()
        .reverse()
        .forEach(
            function(item, index) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML =

                    "<td>" +
                    (index + 1) +
                    "</td>" +

                    "<td>" +
                    formatDate(item.date) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(item.subject) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(item.startTime) +
                    " - " +
                    escapeHTML(item.endTime) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(item.topic) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.remarks || "-"
                    ) +
                    "</td>" +

                    '<td><span class="' +
                    getStatusClass(
                        item.status
                    ) +
                    '">' +

                    escapeHTML(
                        item.status
                    ) +

                    "</span></td>";


                table.appendChild(
                    row
                );

            }
        );
}


// ======================================================
// ADMIN SUBMISSIONS
// ======================================================

function loadAdminSubmissions() {

    protectAdminPage();


    const table =
        document.getElementById(
            "adminSubmissionTable"
        );


    if (!table) {

        return;
    }


    const filterField =
        document.getElementById(
            "submissionFilter"
        );


    const filter =
        filterField
            ? filterField.value
            : "All";


    const submissions =
        JSON.parse(
            localStorage.getItem(
                "submissions"
            )
        ) || [];


    let filtered =
        submissions;


    if (filter !== "All") {

        filtered =
            submissions.filter(
                function(item) {

                    return (
                        item.status ===
                        filter
                    );

                }
            );
    }


    table.innerHTML = "";


    if (
        filtered.length ===
        0
    ) {

        table.innerHTML =
            '<tr><td colspan="9">No teaching submissions found.</td></tr>';

        return;
    }


    filtered
        .slice()
        .reverse()
        .forEach(
            function(item, index) {

                const realIndex =
                    submissions.findIndex(
                        function(record) {

                            return (
                                record.id ===
                                item.id
                            );

                        }
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML =

                    "<td>" +
                    (index + 1) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.staffName
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.subject
                    ) +
                    "</td>" +

                    "<td>" +
                    formatDate(
                        item.date
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.startTime
                    ) +
                    " - " +
                    escapeHTML(
                        item.endTime
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.topic
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.remarks || "-"
                    ) +
                    "</td>" +

                    '<td><span class="' +
                    getStatusClass(
                        item.status
                    ) +
                    '">' +

                    escapeHTML(
                        item.status
                    ) +

                    "</span></td>" +

                    "<td>" +

                    '<button class="approve-btn" onclick="approveSubmission(' +
                    realIndex +
                    ')">Approve</button> ' +

                    '<button class="reject-btn" onclick="rejectSubmission(' +
                    realIndex +
                    ')">Reject</button> ' +

                    '<button class="delete-btn" onclick="deleteSubmission(' +
                    realIndex +
                    ')">Delete</button>' +

                    "</td>";


                table.appendChild(
                    row
                );

            }
        );
}


// ======================================================
// APPROVE SUBMISSION
// ======================================================

function approveSubmission(index) {

    let submissions =
        JSON.parse(
            localStorage.getItem(
                "submissions"
            )
        ) || [];


    if (!submissions[index]) {

        return;
    }


    submissions[index].status =
        "Approved";


    localStorage.setItem(
        "submissions",
        JSON.stringify(submissions)
    );


    loadAdminSubmissions();
}


// ======================================================
// REJECT SUBMISSION
// ======================================================

function rejectSubmission(index) {

    let submissions =
        JSON.parse(
            localStorage.getItem(
                "submissions"
            )
        ) || [];


    if (!submissions[index]) {

        return;
    }


    submissions[index].status =
        "Rejected";


    localStorage.setItem(
        "submissions",
        JSON.stringify(submissions)
    );


    loadAdminSubmissions();
}


// ======================================================
// DELETE SUBMISSION
// ======================================================

function deleteSubmission(index) {

    const answer =
        confirm(
            "Are you sure you want to permanently delete this teaching record?"
        );


    if (!answer) {

        return;
    }


    let submissions =
        JSON.parse(
            localStorage.getItem(
                "submissions"
            )
        ) || [];


    submissions.splice(
        index,
        1
    );


    localStorage.setItem(
        "submissions",
        JSON.stringify(submissions)
    );


    loadAdminSubmissions();
}


// ======================================================
// REPORTS
// ======================================================

function loadReports() {

    protectAdminPage();


    const submissions =
        JSON.parse(
            localStorage.getItem(
                "submissions"
            )
        ) || [];


    const staff =
        JSON.parse(
            localStorage.getItem(
                "staff"
            )
        ) || [];


    const subjects =
        JSON.parse(
            localStorage.getItem(
                "subjects"
            )
        ) || [];


    const approved =
        submissions.filter(
            function(item) {

                return (
                    item.status ===
                    "Approved"
                );

            }
        ).length;


    const pending =
        submissions.filter(
            function(item) {

                return (
                    item.status ===
                    "Pending"
                );

            }
        ).length;


    const rejected =
        submissions.filter(
            function(item) {

                return (
                    item.status ===
                    "Rejected"
                );

            }
        ).length;


    setText(
        "reportTotalClasses",
        submissions.length
    );


    setText(
        "reportApproved",
        approved
    );


    setText(
        "reportPending",
        pending
    );


    setText(
        "reportRejected",
        rejected
    );


    loadStaffReport(
        staff,
        submissions
    );


    loadSubjectReport(
        subjects,
        submissions
    );


    loadFullReport(
        submissions
    );
}


// ======================================================
// STAFF REPORT
// ======================================================

function loadStaffReport(
    staff,
    submissions
) {

    const table =
        document.getElementById(
            "staffReportTable"
        );


    if (!table) {

        return;
    }


    table.innerHTML = "";


    staff.forEach(
        function(member) {

            const records =
                submissions.filter(
                    function(item) {

                        return (
                            item.username ===
                            member.username
                        );

                    }
                );


            const approved =
                records.filter(
                    function(item) {

                        return (
                            item.status ===
                            "Approved"
                        );

                    }
                ).length;


            const pending =
                records.filter(
                    function(item) {

                        return (
                            item.status ===
                            "Pending"
                        );

                    }
                ).length;


            const rejected =
                records.filter(
                    function(item) {

                        return (
                            item.status ===
                            "Rejected"
                        );

                    }
                ).length;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML =

                "<td>" +
                escapeHTML(member.name) +
                "</td>" +

                "<td>" +
                records.length +
                "</td>" +

                "<td>" +
                approved +
                "</td>" +

                "<td>" +
                pending +
                "</td>" +

                "<td>" +
                rejected +
                "</td>";


            table.appendChild(
                row
            );

        }
    );
}


// ======================================================
// SUBJECT REPORT
// ======================================================

function loadSubjectReport(
    subjects,
    submissions
) {

    const table =
        document.getElementById(
            "subjectReportTable"
        );


    if (!table) {

        return;
    }


    table.innerHTML = "";


    subjects.forEach(
        function(subject) {

            const total =
                submissions.filter(
                    function(item) {

                        return (
                            item.subject ===
                            subject
                        );

                    }
                ).length;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML =

                "<td>" +
                escapeHTML(subject) +
                "</td>" +

                "<td>" +
                total +
                "</td>";


            table.appendChild(
                row
            );

        }
    );
}


// ======================================================
// FULL REPORT
// ======================================================

function loadFullReport(
    submissions
) {

    const table =
        document.getElementById(
            "fullReportTable"
        );


    if (!table) {

        return;
    }


    table.innerHTML = "";


    if (
        submissions.length ===
        0
    ) {

        table.innerHTML =
            '<tr><td colspan="8">No evening classes have been submitted.</td></tr>';

        return;
    }


    submissions
        .slice()
        .reverse()
        .forEach(
            function(item, index) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML =

                    "<td>" +
                    (index + 1) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.staffName
                    ) +
                    "</td>" +

                    "<td>" +
                    formatDate(
                        item.date
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.subject
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.startTime
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.endTime
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHTML(
                        item.topic
                    ) +
                    "</td>" +

                    '<td><span class="' +
                    getStatusClass(
                        item.status
                    ) +
                    '">' +

                    escapeHTML(
                        item.status
                    ) +

                    "</span></td>";


                table.appendChild(
                    row
                );

            }
        );
}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(dateString) {

    if (!dateString) {

        return "";
    }


    const parts =
        dateString.split("-");


    if (
        parts.length !==
        3
    ) {

        return dateString;
    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );
}


// ======================================================
// STATUS CLASS
// ======================================================

function getStatusClass(status) {

    if (
        status ===
        "Approved"
    ) {

        return "status-approved";
    }


    if (
        status ===
        "Rejected"
    ) {

        return "status-rejected";
    }


    return "status-pending";
}


// ======================================================
// SAFE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ======================================================
// SET TEXT
// ======================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;
    }
}
// ==============================
// ADMIN LOGIN
// ==============================

function adminLogin(){

    let username =
    document.getElementById("adminUsername").value;


    let password =
    document.getElementById("adminPassword").value;


    if(
        username==="admin" &&
        password==="admin123"
    ){

        localStorage.setItem(
            "loggedInRole",
            "admin"
        );


        localStorage.setItem(
            "loggedInUser",
            "Administrator"
        );


        window.location.href =
        "admin-dashboard.html";


    }else{


        document.getElementById(
        "adminMessage"
        ).innerHTML =
        "Wrong admin login details";


    }
loadCharts();
}



// ==============================
// STAFF LOGIN 
// ==============================

function staffLogin(){


    let username =
    document.getElementById(
    "staffUsername"
    ).value.trim();



    let password =
    document.getElementById(
    "staffPassword"
    ).value.trim();



    let staff = 
    JSON.parse(
    localStorage.getItem("staff")
    ) || [];



    let user =
    staff.find(function(member){


        return (

        member.username === username
        &&
        member.password === password

        );


    });



    if(user){


        localStorage.setItem(
        "loggedInRole",
        "staff"
        );


        localStorage.setItem(
        "loggedInUser",
        user.name
        );


        localStorage.setItem(
        "loggedInUsername",
        user.username
        );



        window.location.href =
        "staff-dashboard.html";



    }else{


        document.getElementById(
        "staffMessage"
        ).innerHTML =
        "Invalid staff username or password";


    }

}
// =====================================
// SCHOOL SETTINGS
// =====================================

function saveSettings(){


let settings={


schoolName:
document.getElementById("schoolName").value,


schoolMotto:
document.getElementById("schoolMotto").value,


schoolPhone:
document.getElementById("schoolPhone").value,


schoolEmail:
document.getElementById("schoolEmail").value,


academicYear:
document.getElementById("academicYear").value,


logo:
document.getElementById("logoPreview").src


};



localStorage.setItem(
"schoolSettings",
JSON.stringify(settings)
);



document.getElementById(
"settingsMessage"
).innerHTML =
"School settings saved successfully.";


}

function loadSettings(){


let settings =
JSON.parse(
localStorage.getItem("schoolSettings")
);



if(!settings){

return;

}



document.getElementById(
"schoolName"
).value =
settings.schoolName || "";



document.getElementById(
"schoolMotto"
).value =
settings.schoolMotto || "";



document.getElementById(
"schoolPhone"
).value =
settings.schoolPhone || "";



document.getElementById(
"schoolEmail"
).value =
settings.schoolEmail || "";



document.getElementById(
"academicYear"
).value =
settings.academicYear || "";

if(settings.logo){


document.getElementById(
"logoPreview"
).src =
settings.logo;


}
}



// LOGO PREVIEW

document.addEventListener(
"change",
function(event){


    if(
        event.target.id === "schoolLogo"
    ){


        let reader =
        new FileReader();



        reader.onload =
        function(){

            document.getElementById(
                "logoPreview"
            ).src =
            reader.result;


        };



        reader.readAsDataURL(
            event.target.files[0]
        );

    }


});
// ===================================
// LOAD SCHOOL BRANDING
// ===================================


function loadSchoolBranding(){


let settings =
JSON.parse(
localStorage.getItem(
"schoolSettings"
)
);



if(!settings){

return;

}



if(
document.getElementById(
"dashboardSchoolName"
)
){


document.getElementById(
"dashboardSchoolName"
).innerHTML =
settings.schoolName;


}



if(
document.getElementById(
"dashboardMotto"
)
){


document.getElementById(
"dashboardMotto"
).innerHTML =
settings.schoolMotto;


}



if(
document.getElementById(
"dashboardYear"
)
){


document.getElementById(
"dashboardYear"
).innerHTML =
settings.academicYear;


}



if(
document.getElementById(
"dashboardLogo"
)
&&
settings.logo
){


document.getElementById(
"dashboardLogo"
).src =
settings.logo;


}



}
// =====================================
// LOGIN BRANDING
// =====================================


function loadLoginBranding(){


let settings =
JSON.parse(
localStorage.getItem("schoolSettings")
);



if(!settings){

return;

}



let name =
document.getElementById(
"loginSchoolName"
);



let motto =
document.getElementById(
"loginMotto"
);



let year =
document.getElementById(
"loginYear"
);



if(name){

name.innerHTML =
settings.schoolName;

}



if(motto){

motto.innerHTML =
settings.schoolMotto;

}



if(year){

year.innerHTML =
settings.academicYear;

}


}
// =====================================
// STAFF BRANDING
// =====================================


function loadStaffBranding(){


let settings =
JSON.parse(
localStorage.getItem("schoolSettings")
);



if(!settings){

return;

}



let name =
document.getElementById(
"staffSchoolName"
);



let motto =
document.getElementById(
"staffMotto"
);



let year =
document.getElementById(
"staffYear"
);



if(name){

name.innerHTML =
settings.schoolName;

}



if(motto){

motto.innerHTML =
settings.schoolMotto;

}



if(year){

year.innerHTML =
settings.academicYear;

}


}
function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const settings = JSON.parse(localStorage.getItem("schoolSettings")) || {};
    const pageWidth = doc.internal.pageSize.getWidth();
    const centre = pageWidth / 2;
    let y = 12;

    // Logo (added once, correct format)
    if (settings.logo && settings.logo.indexOf("data:image") === 0) {
        try {
            const format = settings.logo.indexOf("image/png") !== -1 ? "PNG" : "JPEG";
            doc.addImage(settings.logo, format, centre - 15, y, 30, 30);
            y += 36;
        } catch (e) {
            console.log("Logo could not be added:", e);
        }
    }

    // School name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(settings.schoolName || "EVENING CLASSES", centre, y, { align: "center" });
    y += 8;

    // Motto
    if (settings.schoolMotto) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(11);
        doc.text(settings.schoolMotto, centre, y, { align: "center" });
        y += 7;
    }

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y);
    y += 9;

    // Report title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("EVENING CLASSES ACTIVITY REPORT", centre, y, { align: "center" });
    y += 8;

    // Academic year (left) and date generated (right)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Academic Year: " + (settings.academicYear || "-"), 14, y);
    doc.text("Generated: " + new Date().toLocaleDateString("en-GB"), pageWidth - 14, y, { align: "right" });
    y += 6;

    // Table
    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];

    const rows = submissions.map(function (item, index) {
        const d = item.date.split("-");
        return [
            index + 1,
            item.staffName,
            d.length === 3 ? d[2] + "/" + d[1] + "/" + d[0] : item.date,
            item.startTime + " - " + item.endTime,
            item.subject,
            item.topic,
            item.status
        ];
    });

    doc.autoTable({
        startY: y,
        head: [["No", "Teacher", "Date", "Time", "Subject", "Topic", "Status"]],
        body: rows,
        styles: { fontSize: 9 }
    });

    doc.save("Evening_Classes_Report.pdf");
}



// LOGO PREVIEW

document.addEventListener(
"change",
function(e){


if(e.target.id==="schoolLogo"){


let reader = new FileReader();


reader.onload=function(){


document.getElementById(
"logoPreview"
).src = reader.result;


};


reader.readAsDataURL(
e.target.files[0]
);


}


});
function loadCharts(){


let submissions =
JSON.parse(
localStorage.getItem("submissions")
) || [];


// SUBJECT DATA

let subjects={};


submissions.forEach(function(item){


if(subjects[item.subject]){

subjects[item.subject]++;

}else{

subjects[item.subject]=1;

}


});



new Chart(
document.getElementById("subjectChart"),

{

type:"pie",

data:{


labels:Object.keys(subjects),


datasets:[{

data:Object.values(subjects)

}]


}


}

);





// STAFF DATA


let teachers={};


submissions.forEach(function(item){


if(teachers[item.staffName]){

teachers[item.staffName]++;

}else{

teachers[item.staffName]=1;

}


});



new Chart(

document.getElementById("teacherChart"),


{

type:"bar",

data:{


labels:Object.keys(teachers),


datasets:[{

label:"Lessons",

data:Object.values(teachers)

}]


}


}


);



}