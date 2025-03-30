// 📌 config
const baseURL = "https://rd-wash.onrender.com/api";

// ฟังก์ชัน logout
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// ฟังก์ชันโหลดหน้า HTML จากโฟลเดอร์ /pages/
function loadPage(pageName) {
  const contentEl = document.getElementById('main-panel-content');

  // แสดงแถบโหลด
  contentEl.innerHTML = `
    <h2>กำลังโหลด ${pageName}...</h2>
    <div class="loading-bar"><div class="bar"></div></div>
  `;

  fetch(`/RD-Wash-01/frontend/pages/${pageName}.html`)
    .then((res) => {
      if (!res.ok) throw new Error('ไม่สามารถโหลดหน้าได้');
      return res.text();
    })
    .then((html) => {
      contentEl.innerHTML = html;
      runPageScript(pageName); // 👈 โหลดสคริปต์เพิ่มเติม (เรียก API)
    })
    .catch((err) => {
      contentEl.innerHTML = `<h2 style="color:red;">❌ เกิดข้อผิดพลาดในการโหลดหน้า ${pageName}</h2><p>${err.message}</p>`;
    });
}

// เรียกใช้หลังโหลด HTML เสร็จ เพื่อเชื่อม API แต่ละหน้า
function runPageScript(pageName) {
  switch (pageName) {
    case 'Employee':
      fetch(`${baseURL}/employee`)
        .then(res => res.json())
        .then(data => {
          const list = document.getElementById('employee-list');
          if (!list) return;

          list.innerHTML = '';
          if (data.length === 0) {
            list.innerHTML = '<li>ไม่พบข้อมูลพนักงาน</li>';
            return;
          }

          data.forEach(emp => {
            const li = document.createElement('li');
            li.textContent = `${emp.employeeId} - ${emp.employeeName} (${emp.department})`;
            list.appendChild(li);
          });
        })
        .catch(err => {
          console.error('โหลดข้อมูลพนักงานล้มเหลว:', err);
          const list = document.getElementById('employee-list');
          if (list) {
            list.innerHTML = `<li style="color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</li>`;
          }
        });
      break;

    // เพิ่มหน้าอื่น เช่น Uniform, Wash ต่อได้เลย
  }
}

// toggle dropdown ผู้ใช้
function toggleUserDropdown() {
  document.querySelector('.user-info')?.classList.toggle('show-dropdown');
}

// ซ่อน dropdown เมื่อคลิกนอก
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-info')) {
    document.querySelector('.user-info')?.classList.remove('show-dropdown');
  }
});

// toggle เมนู (สำหรับ mobile)
function toggleMenu() {
  document.querySelector('.sidebar')?.classList.toggle('active');
}

// อัปเดตวันเวลา
function updateDateTime() {
  const now = new Date();
  const el = document.getElementById('datetime');
  if (el) el.innerText = now.toLocaleString('th-TH', { hour12: false });
}

// จำลองสถานะการเชื่อมต่อฐานข้อมูล
function checkConnection() {
  const el = document.getElementById('connection-status');
  if (!el) return;
  const isConnected = Math.random() > 0.05;
  el.innerHTML = isConnected
    ? '<span class="status-dot green"></span> เชื่อมต่อฐานข้อมูล'
    : '<span class="status-dot red"></span> ขาดการเชื่อมต่อ';
}

// เริ่มต้นระบบ
setInterval(updateDateTime, 1000);
setInterval(checkConnection, 5000);
updateDateTime();
checkConnection();
loadPage('Dashboard'); // เปิดหน้าแรก
