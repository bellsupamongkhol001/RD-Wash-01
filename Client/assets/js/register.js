document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // ส่งข้อมูลไปยัง API /register
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, password, role })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('errorMessage').innerText = data.message;
        } else {
            // ถ้าสมัครสำเร็จ, redirect ไปหน้า login
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
    });
});
