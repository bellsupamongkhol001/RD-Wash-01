// ==================== IndexedDB Setup for Uniform Management ====================
let db;
const DB_NAME = 'UniformDB';
const STORE_NAME = 'uniforms';

// Initialize DB and render table on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initDB();
    setupListeners();
    renderUniformTable();
  } catch (e) {
    console.error('Error initializing DB:', e);
  }
});

// ==================== Initialize IndexedDB ====================
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (e) => {
      console.error('IndexedDB error:', e.target.error);
      reject(e);
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve();
    };

    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'uniformId' });
      }
    };
  });
}

// ==================== CRUD Operations ====================
function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e);
  });
}

function put(storeName, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(data);
    tx.oncomplete = resolve;
    tx.onerror = (e) => reject(e);
  });
}

function remove(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(id);
    tx.oncomplete = resolve;
    tx.onerror = (e) => reject(e);
  });
}

function getById(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e);
  });
}

// ==================== Setup Listeners ====================
function setupListeners() {
  // Open modal for adding a new uniform
  document.getElementById('addUniformBtn').addEventListener('click', () => {
    openForm();
  });

  // Close modal when clicking the close button
  document.querySelector('#uniformModal .close').addEventListener('click', () => {
    toggleModal(false);
  });

  // Handle form submission for saving uniform data
  document.getElementById('uniformForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveUniform();
  });

  // Delegate click events for edit and delete buttons in the uniform table
  document.getElementById('uniformTable').addEventListener('click', (e) => {
    if (e.target.classList.contains('editUniform')) {
      const uniformId = e.target.dataset.id;
      openForm(uniformId);
    } else if (e.target.classList.contains('deleteUniform')) {
      const uniformId = e.target.dataset.id;
      if (confirm('Are you sure you want to delete this uniform?')) {
        deleteUniform(uniformId);
      }
    }
  });
}

// ==================== Modal Functions ====================
function toggleModal(show) {
  const modal = document.getElementById('uniformModal');
  modal.style.display = show ? 'flex' : 'none';
}

function openForm(id = null) {
  clearForm();
  document.querySelector('#uniformModal h2').innerText = id ? 'Edit Uniform' : 'Add New Uniform';
  if (id) {
    getById(STORE_NAME, id).then(data => {
      if (data) {
        document.getElementById('uniformId').value = data.uniformId;
        document.getElementById('uniformCode').value = data.uniformCode;
        document.getElementById('uniformName').value = data.uniformName;
        document.getElementById('size').value = data.size;
        document.getElementById('color').value = data.color;
        document.getElementById('quantity').value = data.quantity;
      }
    });
  }
  toggleModal(true);
}

function clearForm() {
  document.getElementById('uniformForm').reset();
  document.getElementById('uniformId').value = '';
}

// ==================== Utility Functions ====================
// Generate a unique Uniform ID based on the current date and existing records
function generateUniformID() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return getAll(STORE_NAME).then(data => {
    const count = data.filter(u => u.uniformId.includes(ymd)).length + 1;
    return `UNI-${ymd}-${String(count).padStart(3, '0')}`;
  });
}

// Save uniform data (create new or update existing)
async function saveUniform() {
  const uniformIdField = document.getElementById('uniformId');
  const uniformCode = document.getElementById('uniformCode').value.trim();
  const uniformName = document.getElementById('uniformName').value.trim();
  const size = document.getElementById('size').value;
  const color = document.getElementById('color').value.trim();
  const quantity = parseInt(document.getElementById('quantity').value.trim(), 10);

  if (!uniformCode || !uniformName || !size || !color || isNaN(quantity)) {
    alert('Please fill in all required fields.');
    return;
  }

  let uniformId = uniformIdField.value;
  if (!uniformId) {
    uniformId = await generateUniformID();
  }

  const uniformData = {
    uniformId,
    uniformCode,
    uniformName,
    size,
    color,
    quantity
  };

  await put(STORE_NAME, uniformData);
  toggleModal(false);
  renderUniformTable();
}

// Delete uniform data from the database
async function deleteUniform(id) {
  await remove(STORE_NAME, id);
  renderUniformTable();
}

// ==================== Render Uniform Table ====================
async function renderUniformTable() {
  const tbody = document.querySelector('#uniformTable tbody');
  tbody.innerHTML = '';
  const uniforms = await getAll(STORE_NAME);

  if (uniforms.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No uniforms found.</td></tr>';
    return;
  }

  uniforms.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.uniformId}</td>
      <td>${u.uniformCode}</td>
      <td>${u.uniformName}</td>
      <td>${u.size}</td>
      <td>${u.color}</td>
      <td>${u.quantity}</td>
      <td>
        <button class="editUniform" data-id="${u.uniformId}">Edit</button>
        <button class="deleteUniform" data-id="${u.uniformId}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
