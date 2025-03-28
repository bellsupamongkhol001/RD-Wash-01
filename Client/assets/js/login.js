document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'home.html'; // ไปหน้า Home
        } else {
            document.getElementById('errorMessage').innerText = 'ข้อมูลไม่ถูกต้อง';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
    });
});
