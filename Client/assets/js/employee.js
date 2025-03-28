// ========== On Load ==========
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    setupEmployeeForm();
  });
  
  // ========== Load All Employees ==========
  async function loadEmployees() {
    const res = await fetch('/api/employee');
    const data = await res.json();
    const container = document.getElementById('employeeCards');
    container.innerHTML = '';
  
    data.forEach(emp => {
      const card = document.createElement('div');
      card.className = 'employee-card';
      card.innerHTML = `
        <img src="${emp.image || 'https://via.placeholder.com/80'}" alt="Profile">
        <h4>${emp.employeeName}</h4>
        <p>ID: ${emp.employeeId}</p>
        <p>Dept: ${emp.department}</p>
        <div class="actions">
          <button onclick="editEmployee('${emp._id}')">Edit</button>
          <button onclick="deleteEmployee('${emp._id}')">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  // ========== Setup Form & Events ==========
  function setupEmployeeForm() {
    const addBtn = document.getElementById('addEmployeeBtn');
    const modal = document.getElementById('employeeModal');
    const closeModal = document.getElementById('closeEmployeeModal');
    const form = document.getElementById('employeeForm');
    const preview = document.getElementById('previewImage');
    const fileInput = document.getElementById('employeeImage');
  
    addBtn.onclick = () => {
      form.reset();
      preview.style.display = 'none';
      document.getElementById('modalEmployeeTitle').innerText = 'Add Employee';
      document.getElementById('employeeObjectId').value = '';
      modal.style.display = 'block';
    };
  
    closeModal.onclick = () => modal.style.display = 'none';
  
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    };
  
    form.onsubmit = async (e) => {
      e.preventDefault();
  
      const id = document.getElementById('employeeObjectId').value;
      const employeeId = document.getElementById('employeeId').value.trim();
      const employeeName = document.getElementById('employeeName').value.trim();
      const department = document.getElementById('department').value.trim();
      const imageFile = document.getElementById('employeeImage').files[0];
  
      // Validation
      if (!employeeId || !employeeName || !department) {
        return alert('Please fill in all required fields.');
      }
  
      // Duplicate check
      const existing = await fetch('/api/employee');
      const list = await existing.json();
      const duplicate = list.find(e => e.employeeId === employeeId && e._id !== id);
      if (duplicate) return alert('Employee ID already exists.');
  
      // Build data
      let payload = { employeeId, employeeName, department };
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          payload.image = reader.result;
          await saveEmployee(id, payload);
        };
        reader.readAsDataURL(imageFile);
      } else {
        await saveEmployee(id, payload);
      }
    };
  }
  
  // ========== Save Employee ==========
  async function saveEmployee(id, payload) {
    const url = id ? `/api/employee/${id}` : '/api/employee';
    const method = id ? 'PUT' : 'POST';
  
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  
    document.getElementById('employeeModal').style.display = 'none';
    loadEmployees();
  }
  
  // ========== Edit ==========
  async function editEmployee(id) {
    const res = await fetch(`/api/employee/${id}`);
    const emp = await res.json();
  
    document.getElementById('modalEmployeeTitle').innerText = 'Edit Employee';
    document.getElementById('employeeObjectId').value = emp._id;
    document.getElementById('employeeId').value = emp.employeeId;
    document.getElementById('employeeName').value = emp.employeeName;
    document.getElementById('department').value = emp.department;
  
    const preview = document.getElementById('previewImage');
    if (emp.image) {
      preview.src = emp.image;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  
    document.getElementById('employeeModal').style.display = 'block';
  }
  
  // ========== Delete ==========
  async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
      await fetch(`/api/employee/${id}`, { method: 'DELETE' });
      loadEmployees();
    }
  }
  