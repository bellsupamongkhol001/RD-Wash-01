// backend/models/WashJob.js
const mongoose = require('mongoose');

// สร้าง Schema สำหรับ WashJob
const washJobSchema = new mongoose.Schema({
  washCode: {
    type: String,
    required: true,
    unique: true // ให้รหัสการซักไม่ซ้ำกัน
  },
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  uniformCode: {
    type: String,
    required: true
  },
  uniformSize: {
    type: String,
    required: true
  },
  uniformColor: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// สร้าง Model จาก Schema
const WashJob = mongoose.model('WashJob', washJobSchema);

module.exports = WashJob;
