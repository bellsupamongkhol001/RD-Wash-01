const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// ใช้ CORS และ JSON parsing
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// เชื่อมต่อกับ MongoDB
if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MongoDB connection string");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));


// นำเข้า Routes
const employeeRoutes = require('./routes/employeeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const uniformRoutes = require('./routes/uniformRoutes');
const washJobRoutes = require('./routes/washJobRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// เชื่อมต่อ Routes กับ API Path
app.use('/api/employee', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/uniform', uniformRoutes);
app.use('/api/washjob', washJobRoutes);
app.use('/api/dashboard', dashboardRoutes);

// เส้นทางพื้นฐาน
app.get('/', (req, res) => {
  res.send('Welcome to RD Wash System');
});

// ฟังที่พอร์ตที่กำหนด
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
