document.addEventListener('DOMContentLoaded', () => {
    loadUniforms();
    setupUniformForm();
  });

  async function loadUniforms() {
    const res = await fetch('/api/uniform');
    const data = await res.json();
    const container = document.getElementById('uniformCards');
    container.innerHTML = '';

    data.forEach(u => {
      const card = document.createElement('div');
      card.className = 'uniform-card';
      card.innerHTML = `
        <img src="${u.image || 'https://via.placeholder.com/100'}" alt="uniform">
        <h4>${u.uniformCode}</h4>
        <p>Size: ${u.uniformSize}</p>
        <p>Color: ${u.uniformColor}</p>
        <p>Qty: ${u.qty}</p>
        <div class="actions">
          <button onclick="editUniform('${u._id}')">Edit</button>
          <button onclick="deleteUniform('${u._id}')">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function setupUniformForm() {
    const modal = document.getElementById('uniformModal');
    const form = document.getElementById('uniformForm');
    const preview = document.getElementById('previewUniformImage');
    const fileInput = document.getElementById('uniformImage');

    document.getElementById('addUniformBtn').onclick = () => {
      form.reset();
      preview.style.display = 'none';
      document.getElementById('modalUniformTitle').innerText = 'Add Uniform';
      document.getElementById('uniformObjectId').value = '';
      modal.style.display = 'block';
    };

    document.getElementById('closeUniformModal').onclick = () => modal.style.display = 'none';

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

      const id = document.getElementById('uniformObjectId').value;
      const uniformCode = document.getElementById('uniformCode').value.trim();
      const uniformSize = document.getElementById('uniformSize').value.trim();
      const uniformColor = document.getElementById('uniformColor').value.trim();
      const qty = Number(document.getElementById('uniformQty').value);
      const imageFile = document.getElementById('uniformImage').files[0];

      if (!uniformCode || !uniformSize || !uniformColor || isNaN(qty)) {
        return alert('Please fill in all required fields.');
      }

      const existing = await fetch('/api/uniform');
      const list = await existing.json();
      const duplicate = list.find(u => u.uniformCode === uniformCode && u._id !== id);
      if (duplicate) return alert('Uniform Code already exists.');

      let payload = { uniformCode, uniformSize, uniformColor, qty };
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          payload.image = reader.result;
          await saveUniform(id, payload);
        };
        reader.readAsDataURL(imageFile);
      } else {
        await saveUniform(id, payload);
      }
    };
  }

  async function saveUniform(id, payload) {
    const url = id ? `/api/uniform/${id}` : '/api/uniform';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    document.getElementById('uniformModal').style.display = 'none';
    loadUniforms();
  }

  async function editUniform(id) {
    const res = await fetch(`/api/uniform/${id}`);
    const u = await res.json();

    document.getElementById('modalUniformTitle').innerText = 'Edit Uniform';
    document.getElementById('uniformObjectId').value = u._id;
    document.getElementById('uniformCode').value = u.uniformCode;
    document.getElementById('uniformSize').value = u.uniformSize;
    document.getElementById('uniformColor').value = u.uniformColor;
    document.getElementById('uniformQty').value = u.qty;

    const preview = document.getElementById('previewUniformImage');
    if (u.image) {
      preview.src = u.image;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }

    document.getElementById('uniformModal').style.display = 'block';
  }

  async function deleteUniform(id) {
    if (confirm('Are you sure you want to delete this uniform?')) {
      await fetch(`/api/uniform/${id}`, { method: 'DELETE' });
      loadUniforms();
    }
  }