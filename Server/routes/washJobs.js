// backend/routes/washJobs.js
const express = require('express');
const router = express.Router();
const WashJob = require('../models/washJobs');

// POST: เพิ่ม Wash Job ใหม่
router.post('/add', async (req, res) => {
  const { washCode, employeeId, employeeName, uniformCode, uniformSize, uniformColor, qty } = req.body;

  try {
    const newWashJob = new WashJob({
      washCode,
      employeeId,
      employeeName,
      uniformCode,
      uniformSize,
      uniformColor,
      qty
    });

    await newWashJob.save();
    res.status(201).json(newWashJob); // ส่งคืนข้อมูลที่เพิ่มเข้าไป
  } catch (err) {
    res.status(500).json({ message: 'Error adding wash job', error: err });
  }
});

module.exports = router;
