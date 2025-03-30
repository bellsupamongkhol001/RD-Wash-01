const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route สำหรับดึงข้อมูลสินค้าทั้งหมด
router.get('/', inventoryController.getAllInventory);

// Route สำหรับเพิ่มสินค้า
router.post('/', inventoryController.addInventory);

module.exports = router;
