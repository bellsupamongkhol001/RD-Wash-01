//Wash-Post
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('washForm');
    
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อส่งฟอร์ม
  
      // ดึงค่าจาก input fields
      const washJob = {
        washCode: document.getElementById('washCode').value,
        employeeId: document.getElementById('employeeId').value,
        employeeName: document.getElementById('employeeName').value,
        uniformCode: document.getElementById('uniformCode').value,
        uniformSize: document.getElementById('uniformSize').value,
        uniformColor: document.getElementById('uniformColor').value,
        qty: Number(document.getElementById('uniformQty').value),
        createdAt: new Date().toISOString()
      };
  
      // ส่งข้อมูลไปยัง Backend (POST request)
      fetch('http://localhost:5000/api/wash-jobs/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(washJob)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Wash Job added:', data);
          // อัปเดต UI หรือแสดงข้อมูลใหม่ในตาราง
          alert('Wash Job added successfully!');
          form.reset(); // ล้างฟอร์มหลังจากส่งข้อมูล
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error adding wash job');
        });
    });
  });

//Wash-Get
document.addEventListener('DOMContentLoaded', function () {
    // ฟังก์ชันดึงข้อมูลจาก Backend (GET request)
    fetch('http://localhost:5000/api/wash-jobs')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById('washTableBody');
        data.forEach(washJob => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${washJob.washCode}</td>
            <td>${washJob.employeeId}</td>
            <td>${washJob.employeeName}</td>
            <td>${washJob.status}</td>
            <td><button>Edit</button> <button>Delete</button></td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error fetching wash jobs:', error);
      });
  });

// Wash-Update
function openEditModal(washJob) {
    document.getElementById('washCode').value = washJob.washCode;
    document.getElementById('employeeId').value = washJob.employeeId;
    document.getElementById('employeeName').value = washJob.employeeName;
    document.getElementById('uniformCode').value = washJob.uniformCode;
    document.getElementById('uniformSize').value = washJob.uniformSize;
    document.getElementById('uniformColor').value = washJob.uniformColor;
    document.getElementById('uniformQty').value = washJob.qty;
  
    // เมื่อกรอกข้อมูลแล้ว ให้ทำการอัปเดตในฐานข้อมูล
    document.getElementById('washForm').addEventListener('submit', function (e) {
      e.preventDefault();
      
      const updatedWashJob = {
        washCode: document.getElementById('washCode').value,
        employeeId: document.getElementById('employeeId').value,
        employeeName: document.getElementById('employeeName').value,
        uniformCode: document.getElementById('uniformCode').value,
        uniformSize: document.getElementById('uniformSize').value,
        uniformColor: document.getElementById('uniformColor').value,
        qty: Number(document.getElementById('uniformQty').value),
        createdAt: new Date().toISOString()
      };
  
      // ส่งข้อมูลที่อัปเดตไปยัง Backend
      fetch(`http://localhost:5000/api/wash-jobs/${washJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWashJob)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Wash Job updated:', data);
          alert('Wash Job updated successfully!');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error updating wash job');
        });
    });
  }
  
// Wash-Delete
function deleteWashJob(washJobId) {
    fetch(`http://localhost:5000/api/wash-jobs/${washJobId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Wash Job deleted:', data);
        alert('Wash Job deleted successfully!');
        // ลบแถวในตาราง
        const row = document.getElementById(`row-${washJobId}`);
        row.remove();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting wash job');
      });
  }
  
  