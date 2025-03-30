document.addEventListener('DOMContentLoaded', () => {
  loadWashes();
  setupWashForm();
});

// ดึงข้อมูลทั้งหมด
async function loadWashes() {
  const res = await fetch('/api/washjob');
  const data = await res.json();
  const tbody = document.getElementById('washTableBody');
  tbody.innerHTML = '';

  data.forEach(w => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${w.washCode}</td>
      <td>${w.employeeId}</td>
      <td>${w.employeeName}</td>
      <td>${w.uniformCode}</td>
      <td>${w.uniformSize}</td>
      <td>${w.uniformColor}</td>
      <td>${w.qty}</td>
      <td><span class="status ${w.status.replace(/\s/g, '-').toLowerCase()}">${w.status}</span></td>
      <td>
        <button onclick="editWash('${w._id}')">Edit</button>
        <button onclick="deleteWash('${w._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ตั้งค่า Modal Form
function setupWashForm() {
  const modal = document.getElementById('washModal');
  const form = document.getElementById('washForm');

  document.getElementById('addWashBtn').onclick = async () => {
    form.reset();
    document.getElementById('modalWashTitle').innerText = 'Add Wash Job';
    document.getElementById('washObjectId').value = '';
    await populateUniforms();
    modal.style.display = 'flex';
  };

  document.getElementById('closeWashModal').onclick = () => {
    modal.style.display = 'none';
  };

  document.getElementById('employeeId').onblur = async () => {
    const empId = document.getElementById('employeeId').value;
    const res = await fetch('/api/employee');
    const data = await res.json();
    const emp = data.find(e => e.employeeId === empId);
    document.getElementById('employeeName').value = emp ? emp.employeeName : '';
  };

  document.getElementById('uniformCode').onchange = async () => {
    const code = document.getElementById('uniformCode').value;
    const res = await fetch('/api/uniform');
    const data = await res.json();
    const uni = data.find(u => u.uniformCode === code);
    if (uni) {
      document.getElementById('uniformSize').value = uni.uniformSize;
      document.getElementById('uniformColor').value = uni.uniformColor;
    }
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('washObjectId').value;
    const payload = {
      employeeId: document.getElementById('employeeId').value,
      employeeName: document.getElementById('employeeName').value,
      uniformCode: document.getElementById('uniformCode').value,
      uniformSize: document.getElementById('uniformSize').value,
      uniformColor: document.getElementById('uniformColor').value,
      qty: Number(document.getElementById('uniformQty').value),
    };

    const url = id ? `/api/washjob/${id}` : '/api/washjob';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    modal.style.display = 'none';
    loadWashes();
  };
}

// ดึงชุดยูนิฟอร์มทั้งหมด
async function populateUniforms() {
  const res = await fetch('/api/uniform');
  const data = await res.json();
  const dropdown = document.getElementById('uniformCode');
  dropdown.innerHTML = data.map(u => `<option value="${u.uniformCode}">${u.uniformCode}</option>`).join('');
}

// แก้ไข
async function editWash(id) {
  const res = await fetch(`/api/washjob/${id}`);
  const w = await res.json();
  const modal = document.getElementById('washModal');

  document.getElementById('modalWashTitle').innerText = 'Edit Wash Job';
  document.getElementById('washObjectId').value = w._id;
  document.getElementById('employeeId').value = w.employeeId;
  document.getElementById('employeeName').value = w.employeeName;

  await populateUniforms();
  document.getElementById('uniformCode').value = w.uniformCode;
  document.getElementById('uniformSize').value = w.uniformSize;
  document.getElementById('uniformColor').value = w.uniformColor;
  document.getElementById('uniformQty').value = w.qty;

  modal.style.display = 'flex';
}

// ลบ
async function deleteWash(id) {
  if (confirm('Confirm delete this wash record?')) {
    await fetch(`/api/washjob/${id}`, { method: 'DELETE' });
    loadWashes();
  }
}
