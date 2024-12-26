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
            <button class="delete-btn" onclick="deleteClass(event, '${cls.id}')">Xóa Lớp</button>
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
      '<tr><td colspan="8">Không có sinh viên trong lớp này.</td></tr>';
    return;
  }

  currentClass.students.forEach((student) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td data-label="Họ và Tên">${student.fullName}</td>
            <td data-label="Mã SV">${student.studentId}</td>
            <td data-label="Email">${student.email}</td>
            <td data-label="Số ĐT">${student.phone}</td>
            <td data-label="Giới Tính">${student.gender}</td>
            <td data-label="Điểm QT">${student.processScore}</td>
            <td data-label="Điểm Cuối Kì">${student.finalScore}</td>
            <td data-label="Hành Động"><button class="delete-btn" onclick="deleteStudent('${student.id}')">Xóa</button></td>
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

// Mở modal thêm lớp
function openAddClassModal() {
  document.getElementById("add-class-modal").style.display = "block";
}

// Đóng modal thêm lớp
function closeAddClassModal() {
  document.getElementById("add-class-modal").style.display = "none";
  document.getElementById("add-class-form").reset();
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

// Xóa lớp
function deleteClass(event, classId) {
  event.stopPropagation(); // Ngăn không cho sự kiện onclick của class-card được kích hoạt
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

// Lưu dữ liệu lớp vào localStorage
function saveClasses() {
  localStorage.setItem("classes", JSON.stringify(classes));
}

// Hàm tạo ID ngẫu nhiên
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Đóng modal khi click ngoài nội dung
window.onclick = function (event) {
  const addStudentModal = document.getElementById("add-student-modal");
  const addClassModal = document.getElementById("add-class-modal");
  if (event.target === addStudentModal) {
    closeAddStudentModal();
  }
  if (event.target === addClassModal) {
    closeAddClassModal();
  }
};

// Hiển thị danh sách lớp khi tải trang
window.onload = function () {
  classes = JSON.parse(localStorage.getItem("classes"));
  displayClasses();
};
