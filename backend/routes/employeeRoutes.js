const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// ดึงข้อมูลพนักงานทั้งหมด
router.get('/', employeeController.getAllEmployees);

// เพิ่มพนักงาน
router.post('/', employeeController.addEmployee);

// แก้ไขข้อมูลพนักงาน (ใช้ PUT และส่ง employeeId ผ่าน URL)
router.put('/:employeeId', employeeController.editEmployee);

// ลบพนักงาน (ใช้ DELETE และส่ง employeeId ผ่าน URL)
router.delete('/:employeeId', employeeController.deleteEmployee);

module.exports = router;
