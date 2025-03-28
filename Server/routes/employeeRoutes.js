const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Route สำหรับดึงข้อมูลพนักงานทั้งหมด
router.get('/', employeeController.getAllEmployees);

// Route สำหรับเพิ่มพนักงาน
router.post('/', employeeController.addEmployee);

module.exports = router;
