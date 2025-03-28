const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route สำหรับดึงข้อมูล Dashboard
router.get('/', dashboardController.getDashboardData);

module.exports = router;
