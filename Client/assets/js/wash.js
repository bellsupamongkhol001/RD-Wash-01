// ========== Load Washes ==========
document.addEventListener('DOMContentLoaded', () => {
  loadWashes();
  setupWashForm();
});

async function loadWashes() {
  const res = await fetch('/api/wash');
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
      <td><span class="status ${w.status.toLowerCase().replace(' ', '-')}">${w.status}</span></td>
      <td>${new Date(w.startDate).toLocaleString()}</td>
      <td>${w.endDate ? new Date(w.endDate).toLocaleString() : '-'}</td>
      <td>
        <button onclick="editWash('${w._id}')">Edit</button>
        <button onclick="deleteWash('${w._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ========== Form Setup ==========
function setupWashForm() {
  const modal = document.getElementById('washModal');
  const form = document.getElementById('washForm');

  document.getElementById('addWashBtn').onclick = async () => {
    form.reset();
    document.getElementById('modalWashTitle').innerText = 'Add Wash Job';
    document.getElementById('washObjectId').value = '';
    modal.style.display = 'flex';
    await populateDropdowns();
  };

  document.getElementById('closeWashModal').onclick = () => modal.style.display = 'none';

  form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('washObjectId').value;
    const payload = {
      washCode: document.getElementById('washCode').value,
      employeeId: document.getElementById('employeeId').value,
      employeeName: document.getElementById('employeeId').selectedOptions[0].text,
      uniformCode: document.getElementById('uniformCode').value,
      uniformSize: document.getElementById('uniformSize').value,
      uniformColor: document.getElementById('uniformColor').value,
      qty: Number(document.getElementById('uniformQty').value),
      status: document.getElementById('status').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value || null,
    };

    const url = id ? `/api/wash/${id}` : '/api/wash';
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

// ========== Populate Employee & Uniform Dropdowns ==========
async function populateDropdowns() {
  const employeeSelect = document.getElementById('employeeId');
  const uniformSelect = document.getElementById('uniformCode');

  const empRes = await fetch('/api/employee');
  const empList = await empRes.json();
  employeeSelect.innerHTML = empList.map(e => `<option value="${e.employeeId}">${e.employeeName}</option>`).join('');

  const uniRes = await fetch('/api/uniform');
  const uniList = await uniRes.json();
  uniformSelect.innerHTML = uniList.map(u => `<option value="${u.uniformCode}">${u.uniformCode}</option>`).join('');
}

// ========== Edit ==========
async function editWash(id) {
  const res = await fetch(`/api/wash/${id}`);
  const w = await res.json();

  const form = document.getElementById('washForm');
  const modal = document.getElementById('washModal');

  document.getElementById('modalWashTitle').innerText = 'Edit Wash Job';
  document.getElementById('washObjectId').value = w._id;
  document.getElementById('washCode').value = w.washCode;
  await populateDropdowns();
  document.getElementById('employeeId').value = w.employeeId;
  document.getElementById('uniformCode').value = w.uniformCode;
  document.getElementById('uniformSize').value = w.uniformSize;
  document.getElementById('uniformColor').value = w.uniformColor;
  document.getElementById('uniformQty').value = w.qty;
  document.getElementById('status').value = w.status;
  document.getElementById('startDate').value = w.startDate.slice(0, 16);
  document.getElementById('endDate').value = w.endDate ? w.endDate.slice(0, 16) : '';

  modal.style.display = 'flex';
}

// ========== Delete ==========
async function deleteWash(id) {
  if (confirm('Are you sure you want to delete this wash job?')) {
    await fetch(`/api/wash/${id}`, { method: 'DELETE' });
    loadWashes();
  }
}
