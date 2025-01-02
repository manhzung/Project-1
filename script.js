// script.js

// Khởi tạo dữ liệu mẫu nếu localStorage trống
if (!localStorage.getItem("classes")) {
  const sampleClasses = [
    {
      id: generateId(),
      className: "Lớp Frontend",
      classCode: "FE101",
      courseCode: "CS501",
      students: [
        {
          id: generateId(),
          fullName: "Nguyễn Văn A",
          studentId: "SV001",
          email: "vana@example.com",
          phone: "0123456789",
          gender: "Nam",
          processScore: 8.5,
          finalScore: 9.0,
        },
        {
          id: generateId(),
          fullName: "Trần Thị B",
          studentId: "SV002",
          email: "thib@example.com",
          phone: "0987654321",
          gender: "Nữ",
          processScore: 7.0,
          finalScore: 8.5,
        },
      ],
    },
    {
      id: generateId(),
      className: "Lớp Backend",
      classCode: "BE202",
      courseCode: "CS502",
      students: [],
    },
  ];
  localStorage.setItem("classes", JSON.stringify(sampleClasses));
}

let classes = JSON.parse(localStorage.getItem("classes"));
let currentClassId = null;

// Hiển thị danh sách lớp
function displayClasses() {
  const classesContainer = document.getElementById("classes-container");
  classesContainer.innerHTML = "";
  if (classes.length === 0) {
    classesContainer.innerHTML =
      "<p>Không có lớp học nào. Vui lòng thêm lớp học.</p>";
    return;
  }
  classes.forEach((cls) => {
    const classCard = document.createElement("div");
    classCard.className = "class-card";
    classCard.onclick = () => openStudentView(cls.id);
    classCard.innerHTML = `
          <div class="flex justify-between align-center">
              <div>
                  <h3>${cls.className}</h3>
                  <p>Mã Lớp: ${cls.classCode}</p>
                  <p>Mã Học Phần: ${cls.courseCode}</p>
              </div>
              <div>
                  <p>Số Sinh Viên: ${cls.students.length}</p>
              </div>
          </div>
          <div class="flex">
              <button class="edit-btn" onclick="editClass(event, '${cls.id}')">Sửa</button>
              <button class="delete-btn" onclick="deleteClass(event, '${cls.id}')">Xóa Lớp</button>
          </div>
      `;
    classesContainer.appendChild(classCard);
  });
}

// Hiển thị danh sách sinh viên của một lớp
function openStudentView(classId) {
  currentClassId = classId;
  const studentView = document.getElementById("student-view");
  const classView = document.getElementById("class-view");
  classView.classList.add("hidden");
  studentView.classList.remove("hidden");

  const currentClass = classes.find((cls) => cls.id === classId);
  document.getElementById("current-class-name").innerText =
    currentClass.className;

  displayStudents();
}

// Hiển thị danh sách sinh viên trong bảng
function displayStudents() {
  const currentClass = classes.find((cls) => cls.id === currentClassId);
  const tbody = document.querySelector("#students-table tbody");
  tbody.innerHTML = "";

  if (!currentClass || currentClass.students.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="9">Không có sinh viên trong lớp này.</td></tr>';
    return;
  }

  currentClass.students.forEach((student) => {
    const totalScore = (
      (student.processScore + student.finalScore) /
      2
    ).toFixed(1);
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td data-label="Họ và Tên">${student.fullName}</td>
          <td data-label="Mã SV">${student.studentId}</td>
          <td data-label="Email">${student.email}</td>
          <td data-label="Số ĐT">${student.phone}</td>
          <td data-label="Giới Tính">${student.gender}</td>
          <td data-label="Điểm QT">${student.processScore}</td>
          <td data-label="Điểm Cuối Kì">${student.finalScore}</td>
          <td data-label="Tổng Điểm">${totalScore}</td>
          <td data-label="Hành Động">
              <button class="edit-btn" onclick="editStudent(event, '${student.id}')">Sửa</button>
              <button class="delete-btn" onclick="deleteStudent('${student.id}')">Xóa</button>
          </td>
      `;
    tbody.appendChild(tr);
  });
}

// Quay lại trang danh sách lớp
function showClassView() {
  const studentView = document.getElementById("student-view");
  const classView = document.getElementById("class-view");
  studentView.classList.add("hidden");
  classView.classList.remove("hidden");
  currentClassId = null;
}

// Mở modal thêm sinh viên
function openAddStudentModal() {
  document.getElementById("add-student-modal").style.display = "block";
}

// Đóng modal thêm sinh viên
function closeAddStudentModal() {
  document.getElementById("add-student-modal").style.display = "none";
  document.getElementById("add-student-form").reset();
}

// Mở modal chỉnh sửa sinh viên
function editStudent(event, studentId) {
  event.stopPropagation(); // Ngăn không cho sự kiện onclick của class-card được kích hoạt
  const currentClass = classes.find((cls) => cls.id === currentClassId);
  if (!currentClass) return;

  const student = currentClass.students.find((s) => s.id === studentId);
  if (!student) return;

  // Fill thông tin vào form chỉnh sửa
  document.getElementById("edit-student-id").value = student.id;
  document.getElementById("edit-fullName").value = student.fullName;
  document.getElementById("edit-studentId").value = student.studentId;
  document.getElementById("edit-email").value = student.email;
  document.getElementById("edit-phone").value = student.phone;
  document.getElementById("edit-gender").value = student.gender;
  document.getElementById("edit-processScore").value = student.processScore;
  document.getElementById("edit-finalScore").value = student.finalScore;

  document.getElementById("edit-student-modal").style.display = "block";
}

// Đóng modal chỉnh sửa sinh viên
function closeEditStudentModal() {
  document.getElementById("edit-student-modal").style.display = "none";
  document.getElementById("edit-student-form").reset();
}

// Mở modal thêm lớp
function openAddClassModal() {
  document.getElementById("add-class-modal").style.display = "block";
}

// Đóng modal thêm lớp
function closeAddClassModal() {
  document.getElementById("add-class-modal").style.display = "none";
  document.getElementById("add-class-form").reset();
}

// Mở modal chỉnh sửa lớp
function editClass(event, classId) {
  event.stopPropagation(); // Ngăn không cho sự kiện onclick của class-card được kích hoạt
  const cls = classes.find((c) => c.id === classId);
  if (!cls) return;

  // Fill thông tin vào form chỉnh sửa
  document.getElementById("edit-class-id").value = cls.id;
  document.getElementById("edit-className").value = cls.className;
  document.getElementById("edit-classCode").value = cls.classCode;
  document.getElementById("edit-courseCode").value = cls.courseCode;

  document.getElementById("edit-class-modal").style.display = "block";
}

// Đóng modal chỉnh sửa lớp
function closeEditClassModal() {
  document.getElementById("edit-class-modal").style.display = "none";
  document.getElementById("edit-class-form").reset();
}

// Thêm sinh viên mới
document
  .getElementById("add-student-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const gender = document.getElementById("gender").value;
    const processScore = parseFloat(
      document.getElementById("processScore").value
    );
    const finalScore = parseFloat(document.getElementById("finalScore").value);

    if (
      !fullName ||
      !studentId ||
      !email ||
      !phone ||
      !gender ||
      isNaN(processScore) ||
      isNaN(finalScore)
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const newStudent = {
      id: generateId(),
      fullName,
      studentId,
      email,
      phone,
      gender,
      processScore,
      finalScore,
    };

    const currentClass = classes.find((cls) => cls.id === currentClassId);
    if (currentClass) {
      currentClass.students.push(newStudent);
      saveClasses();
      displayStudents();
      closeAddStudentModal();
    }
  });

// Xử lý chỉnh sửa sinh viên
document
  .getElementById("edit-student-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const studentId = document.getElementById("edit-student-id").value;
    const fullName = document.getElementById("edit-fullName").value.trim();
    const studentIdValue = document
      .getElementById("edit-studentId")
      .value.trim();
    const email = document.getElementById("edit-email").value.trim();
    const phone = document.getElementById("edit-phone").value.trim();
    const gender = document.getElementById("edit-gender").value;
    const processScore = parseFloat(
      document.getElementById("edit-processScore").value
    );
    const finalScore = parseFloat(
      document.getElementById("edit-finalScore").value
    );

    if (
      !fullName ||
      !studentIdValue ||
      !email ||
      !phone ||
      !gender ||
      isNaN(processScore) ||
      isNaN(finalScore)
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const currentClass = classes.find((cls) => cls.id === currentClassId);
    if (!currentClass) return;

    const studentIndex = currentClass.students.findIndex(
      (s) => s.id === studentId
    );
    if (studentIndex === -1) return;

    currentClass.students[studentIndex] = {
      id: studentId,
      fullName,
      studentId: studentIdValue,
      email,
      phone,
      gender,
      processScore,
      finalScore,
    };

    saveClasses();
    displayStudents();
    closeEditStudentModal();
  });

// Xóa sinh viên
function deleteStudent(studentId) {
  if (!confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) return;
  const currentClass = classes.find((cls) => cls.id === currentClassId);
  if (currentClass) {
    currentClass.students = currentClass.students.filter(
      (s) => s.id !== studentId
    );
    saveClasses();
    displayStudents();
  }
}

// Thêm lớp mới
document
  .getElementById("add-class-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const className = document.getElementById("className").value.trim();
    const classCode = document.getElementById("classCode").value.trim();
    const courseCode = document.getElementById("courseCode").value.trim();

    if (!className || !classCode || !courseCode) {
      alert("Vui lòng nhập đầy đủ thông tin lớp.");
      return;
    }

    // Kiểm tra trùng mã lớp
    const existingClass = classes.find((cls) => cls.classCode === classCode);
    if (existingClass) {
      alert("Mã lớp đã tồn tại. Vui lòng chọn mã lớp khác.");
      return;
    }

    const newClass = {
      id: generateId(),
      className,
      classCode,
      courseCode,
      students: [],
    };

    classes.push(newClass);
    saveClasses();
    displayClasses();
    closeAddClassModal();
  });

// Xử lý chỉnh sửa lớp
document
  .getElementById("edit-class-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const classId = document.getElementById("edit-class-id").value;
    const className = document.getElementById("edit-className").value.trim();
    const classCode = document.getElementById("edit-classCode").value.trim();
    const courseCode = document.getElementById("edit-courseCode").value.trim();

    if (!className || !classCode || !courseCode) {
      alert("Vui lòng nhập đầy đủ thông tin lớp.");
      return;
    }

    const existingClass = classes.find(
      (cls) => cls.classCode === classCode && cls.id !== classId
    );
    if (existingClass) {
      alert("Mã lớp đã tồn tại. Vui lòng chọn mã lớp khác.");
      return;
    }

    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;

    cls.className = className;
    cls.classCode = classCode;
    cls.courseCode = courseCode;

    saveClasses();
    displayClasses();
    closeEditClassModal();
  });

// Xóa lớp
function deleteClass(event, classId) {
  event.stopPropagation(); 
  if (
    !confirm(
      "Bạn có chắc chắn muốn xóa lớp này không? Tất cả sinh viên trong lớp sẽ bị xóa."
    )
  )
    return;
  classes = classes.filter((cls) => cls.id !== classId);
  saveClasses();
  displayClasses();
}

function saveClasses() {
  localStorage.setItem("classes", JSON.stringify(classes));
}

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

window.onclick = function (event) {
  const addStudentModal = document.getElementById("add-student-modal");
  const editStudentModal = document.getElementById("edit-student-modal");
  const addClassModal = document.getElementById("add-class-modal");
  const editClassModal = document.getElementById("edit-class-modal");
  if (event.target === addStudentModal) {
    closeAddStudentModal();
  }
  if (event.target === editStudentModal) {
    closeEditStudentModal();
  }
  if (event.target === addClassModal) {
    closeAddClassModal();
  }
  if (event.target === editClassModal) {
    closeEditClassModal();
  }
};

window.onload = function () {
  classes = JSON.parse(localStorage.getItem("classes"));
  displayClasses();
};
