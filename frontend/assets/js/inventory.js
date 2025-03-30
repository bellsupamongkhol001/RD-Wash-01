document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
  setupStockForm();
});

// โหลดข้อมูล Stock จาก API
async function loadInventory() {
  const res = await fetch('/api/uniform');
  const data = await res.json();
  const container = document.getElementById('inventoryCards');
  container.innerHTML = '';

  let totalQty = 0;
  let lowStock = 0;

  data.forEach(u => {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.innerHTML = `
      <h4>${u.uniformCode}</h4>
      <p>Size: ${u.uniformSize}</p>
      <p>Color: ${u.uniformColor}</p>
      <p class="qty ${u.qty <= 5 ? 'low' : ''}">Qty: ${u.qty}</p>
      <div class="actions">
        <button onclick="editStock('${u._id}')">Edit</button>
        <button onclick="deleteStock('${u._id}')">Delete</button>
      </div>
    `;
    container.appendChild(card);

    totalQty += u.qty;
    if (u.qty <= 5) lowStock++;
  });

  document.getElementById('totalItems').innerText = data.length;
  document.getElementById('totalQuantity').innerText = totalQty;
  document.getElementById('lowStockCount').innerText = lowStock;
}

// ฟอร์มเพิ่ม/แก้ไข Stock
function setupStockForm() {
  const modal = document.getElementById('stockModal');
  const form = document.getElementById('stockForm');

  document.getElementById('addStockBtn').onclick = () => {
    form.reset();
    document.getElementById('modalStockTitle').innerText = 'Add Stock';
    document.getElementById('stockObjectId').value = '';
    modal.style.display = 'flex';
  };

  document.getElementById('closeStockModal').onclick = () => {
    modal.style.display = 'none';
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('stockObjectId').value;
    const payload = {
      uniformCode: document.getElementById('stockCode').value.trim(),
      uniformSize: document.getElementById('stockSize').value.trim(),
      uniformColor: document.getElementById('stockColor').value.trim(),
      qty: Number(document.getElementById('stockQty').value),
    };

    if (!payload.uniformCode || !payload.uniformSize || !payload.uniformColor || isNaN(payload.qty)) {
      return alert('Please fill in all fields correctly');
    }

    const url = id ? `/api/uniform/${id}` : '/api/uniform';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    modal.style.display = 'none';
    loadInventory();
  };
}

// แก้ไข Stock
async function editStock(id) {
  const res = await fetch(`/api/uniform/${id}`);
  const data = await res.json();

  document.getElementById('modalStockTitle').innerText = 'Edit Stock';
  document.getElementById('stockObjectId').value = data._id;
  document.getElementById('stockCode').value = data.uniformCode;
  document.getElementById('stockSize').value = data.uniformSize;
  document.getElementById('stockColor').value = data.uniformColor;
  document.getElementById('stockQty').value = data.qty;
  document.getElementById('stockModal').style.display = 'flex';
}

// ลบ Stock
async function deleteStock(id) {
  if (confirm('Are you sure you want to delete this stock?')) {
    await fetch(`/api/uniform/${id}`, { method: 'DELETE' });
    loadInventory();
  }
}
