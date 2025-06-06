// ==================== IndexedDB Setup ====================
const DB_NAME = 'RDWashDB';
const DB_VERSION = 2; // เปลี่ยนเวอร์ชันตรงนี้เมื่อ schema เปลี่ยน
const STORE_NAME = 'employees';

let db;

// Initialize DB and render table on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initDB().then(() => {
    document.getElementById('searchEmployee').addEventListener('input', renderEmployeeTable);
    renderEmployeeTable();
  });
});

// ==================== Initialize IndexedDB ====================
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e) => {
      console.error('❌ IndexedDB error:', e.target.error);
      reject(e);
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      console.log(`✅ Opened IndexedDB: ${DB_NAME} (v${db.version})`);
      resolve();
    };

    request.onupgradeneeded = (e) => {
      db = e.target.result;

      const oldVersion = e.oldVersion;
      const newVersion = e.newVersion;
      console.log(`⚙️ Upgrading DB from v${oldVersion} → v${newVersion}`);

      // กรณีสร้างใหม่ทั้งหมด
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'employeeId' });

        // สร้าง index เบื้องต้น
        store.createIndex('employeeName', 'employeeName', { unique: false });
        store.createIndex('department', 'department', { unique: false });

      } else {
        // ถ้ามี store อยู่แล้ว จะเข้าเคสนี้เวลาอัปเกรดเวอร์ชัน
        const transaction = e.target.transaction;
        const store = transaction.objectStore(STORE_NAME);

        // ตรวจสอบว่ามี index แล้วหรือยัง ถ้าไม่มีให้สร้าง
        if (!store.indexNames.contains('employeeName')) {
          store.createIndex('employeeName', 'employeeName', { unique: false });
        }

        if (!store.indexNames.contains('department')) {
          store.createIndex('department', 'department', { unique: false });
        }

        // ตัวอย่าง: เพิ่ม index ใหม่ในอนาคต
        // if (!store.indexNames.contains('position')) {
        //   store.createIndex('position', 'position', { unique: false });
        // }
      }
    };
  });
}

// ==================== Modal Controls ====================

function toggleEmployeeModal(show) {
  document.getElementById('employeeFormModal').style.display = show ? 'flex' : 'none';
}

let currentDeleteId = null;
function toggleDeleteModal(show, id = null) {
  document.getElementById('deleteModal').style.display = show ? 'flex' : 'none';
  currentDeleteId = id;
}

// ==================== CRUD Operations ====================

function openEmployeeForm(id = null) {
  const modal = document.getElementById('employeeFormModal');
  const title = document.getElementById('employeeModalTitle');
  clearForm();

  if (id) {
    title.textContent = 'Edit Employee';
    getEmployee(id).then(emp => {
      if (emp) {
        document.getElementById('employeeId').value = emp.employeeId;
        document.getElementById('employeeName').value = emp.employeeName;
        document.getElementById('employeeDept').value = emp.employeeDept;
        document.getElementById('employeePhoto').value = emp.employeePhoto;
        document.getElementById('employeeEditIndex').value = emp.employeeId;
      }
    });
  } else {
    title.textContent = 'Add Employee';
  }

  modal.style.display = 'flex';
}

function clearForm() {
  document.getElementById('employeeId').value = '';
  document.getElementById('employeeName').value = '';
  document.getElementById('employeeDept').value = '';
  
  // Correct way to clear the file input field
  document.getElementById('employeePhoto').value = '';  // Resets the file input

  document.getElementById('employeeEditIndex').value = '';
}


function saveEmployee() {
  const id = document.getElementById('employeeId').value.trim();
  const name = document.getElementById('employeeName').value.trim();
  const dept = document.getElementById('employeeDept').value.trim();
  const photoInput = document.getElementById('employeePhoto');
  const file = photoInput.files[0];

  if (!id || !name || !dept || !file) {
    alert('Please fill in all fields and select a photo!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const emp = {
      employeeId: id,
      employeeName: name,
      employeeDept: dept,
      employeePhoto: e.target.result
    };

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(emp);

    transaction.oncomplete = () => {
      toggleEmployeeModal(false);
      renderEmployeeTable();
    };
  };
  reader.readAsDataURL(file);
}

function deleteEmployee() {
  if (!currentDeleteId) return;
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.delete(currentDeleteId);

  transaction.oncomplete = () => {
    toggleDeleteModal(false);
    renderEmployeeTable();
  };
}

function getEmployee(id) {
  return new Promise((resolve) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
  });
}

function getAllEmployees() {
  return new Promise((resolve) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
}

// ==================== Render Employee Table ====================

function renderEmployeeTable() {
  const tbody = document.getElementById('employeeTableBody');
  const keyword = document.getElementById('searchEmployee').value.toLowerCase();
  tbody.innerHTML = '';  // Clear the table body

  getAllEmployees().then((employees) => {
    if (employees.length === 0) {
      // If no employees are found, show a message
      tbody.innerHTML = '<tr><td colspan="5">No employees found.</td></tr>';
      return;
    }

    employees.forEach((emp) => {
      if (
        !emp.employeeId.toLowerCase().includes(keyword) &&
        !emp.employeeName.toLowerCase().includes(keyword)
      ) return;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${emp.employeeId}</td>
        <td>${emp.employeeName}</td>
        <td>${emp.employeeDept}</td>
        <td><img src="${emp.employeePhoto}" alt="Photo" style="max-width:60px; border-radius:6px;"></td>
        <td class="actions">
          <button class="edit" onclick="openEmployeeForm('${emp.employeeId}')">Edit</button>
          <button class="delete" onclick="toggleDeleteModal(true, '${emp.employeeId}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  });
}

// ==================== Mock Data for Employees ====================

async function generateMockData() {
  const now = new Date();
  const departments = ['Research and Development'];
  
  // Dynamically generate employee names like EmployeeName001, EmployeeName002, etc.
  const employeeNames = [];
  for (let i = 1; i <= 20; i++) {
    employeeNames.push(`EmployeeName${String(i).padStart(3, '0')}`);
  }

  const employeePhotos = [
    'https://cdn-icons-png.flaticon.com/512/2919/2919906.png'
  ];

  // Generate 20 mock employees
  for (let i = 0; i < 20; i++) {
    const employeeId = `EMP${1000 + i}`;
    const employeeName = employeeNames[i];
    const employeeDept = departments[i % departments.length];
    const employeePhoto = employeePhotos[i % employeePhotos.length];
    
    const employee = {
      employeeId,
      employeeName,
      employeeDept,
      employeePhoto
    };

    // Insert employee data into IndexedDB
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(employee);

    transaction.oncomplete = () => {
      console.log(`Employee ${employeeId} added successfully!`);
    };
    transaction.onerror = (e) => {
      console.error('Error inserting employee:', e.target.error);
    };
  }

  // Re-render the table to display mock data
  renderEmployeeTable();
}
