// ฟังก์ชัน logout
function logout() {
  localStorage.clear(); // ลบข้อมูลทั้งหมดจาก localStorage
  window.location.href = 'login.html'; // Redirect ไปหน้า Login
}

// ฟังก์ชันโหลดหน้า HTML
function loadPage(pageName) {
  const contentEl = document.getElementById('main-panel-content');

  // แสดงแถบโหลดระหว่าง fetch
  contentEl.innerHTML = `
    <h2>กำลังโหลด ${pageName}...</h2>
    <div class="loading-bar"><div class="bar"></div></div>
  `;

  fetch(`pages/${pageName}.html`)  // ตรวจสอบให้แน่ใจว่าโฟลเดอร์ `pages` มีไฟล์นั้น
    .then((response) => {
      if (!response.ok) throw new Error('ไม่สามารถโหลดหน้าได้');
      return response.text();
    })
    .then((html) => {
      contentEl.innerHTML = html;
    })
    .catch((err) => {
      contentEl.innerHTML = `<h2 style="color:red;">เกิดข้อผิดพลาดในการโหลดหน้า ${pageName}</h2><p>${err.message}</p>`;
    });
}

// สลับเมนู (เผื่อใช้กับ responsive)
function toggleMenu() {
  document.querySelector('.sidebar')?.classList.toggle('active');
}

// อัปเดตวันเวลา
function updateDateTime() {
  const now = new Date();
  const el = document.getElementById('datetime');
  if (el) {
      el.innerText = now.toLocaleString('th-TH', { hour12: false });
  }
}

// จำลองสถานะฐานข้อมูล (สุ่ม 95% เชื่อมต่อ)
function checkConnection() {
  const el = document.getElementById('connection-status');
  if (!el) return;

  const isConnected = Math.random() > 0.05;
  el.innerHTML = isConnected
      ? '<span class="status-dot green"></span> เชื่อมต่อฐานข้อมูล'
      : '<span class="status-dot red"></span> ขาดการเชื่อมต่อ';
}

// toggle dropdown ผู้ใช้
function toggleUserDropdown() {
  document.querySelector('.user-info')?.classList.toggle('show-dropdown');
}

// ซ่อน dropdown ถ้าคลิกนอก
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-info')) {
      document.querySelector('.user-info')?.classList.remove('show-dropdown');
  }
});

// เริ่มทำงาน
setInterval(updateDateTime, 1000);
setInterval(checkConnection, 5000);
updateDateTime();
checkConnection();
loadPage('Dashboard'); // โหลดหน้าแรก
