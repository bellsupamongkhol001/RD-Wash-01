const express = require('express');
const router = express.Router();
const washJobController = require('../controllers/washJobController');

// Route สำหรับดึงข้อมูลการซักทั้งหมด
router.get('/', washJobController.getAllWashJobs);

// Route สำหรับเพิ่มการซักใหม่
router.post('/', washJobController.addWashJob);

module.exports = router;
