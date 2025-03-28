const express = require('express');
const router = express.Router();
const uniformController = require('../controllers/uniformController');

// Route สำหรับดึงข้อมูลชุดยูนิฟอร์มทั้งหมด
router.get('/', uniformController.getAllUniforms);

// Route สำหรับเพิ่มชุดยูนิฟอร์ม
router.post('/', uniformController.addUniform);

module.exports = router;
