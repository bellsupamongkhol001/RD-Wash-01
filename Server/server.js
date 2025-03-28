// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ใช้สำหรับ parsing JSON

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// นำเข้า Routes
const washJobRoutes = require('./routes/washJobs');
app.use('/api/wash-jobs', washJobRoutes);

// Serve static files from the Client folder
app.use(express.static(path.join(__dirname, '../Client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/pages/Wash.html'));
});

// ฟังพอร์ต
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
