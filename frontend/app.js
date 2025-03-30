const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// ใช้ body-parser เพื่อให้เราสามารถรับข้อมูลในรูปแบบ JSON ได้
app.use(bodyParser.json());

// ใช้ CORS เพื่อให้ระบบสามารถรับคำขอจากภายนอกได้
app.use(cors());

// เชื่อมต่อกับฐานข้อมูล MongoDB
mongoose.connect('MONGODB_URI=mongodb+srv://bellsupamongkhol:123456n1ZA@rd-wash.fbkvkxr.mongodb.net/rdwash?retryWrites=true&w=majority&appName=RD-WASH', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('เชื่อมต่อฐานข้อมูล MongoDB สำเร็จ'))
  .catch((err) => console.error('ไม่สามารถเชื่อมต่อฐานข้อมูล MongoDB ได้', err));

// Import Routes
const employeeRoutes = require('./routes/employeeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const uniformRoutes = require('./routes/uniformRoutes');
const washJobRoutes = require('./routes/washJobRoutes');

// เชื่อมต่อ Routes เข้ากับ API Path
app.use('/api/employee', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/uniform', uniformRoutes);
app.use('/api/washjob', washJobRoutes);

// ตั้งค่า Port ที่จะให้ API ทำงาน
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
