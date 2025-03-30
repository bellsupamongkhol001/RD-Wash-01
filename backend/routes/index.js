const express = require('express');
const router = express.Router();

const uniformRoutes = require('./uniformRoutes');
const washJobRoutes = require('./washJobRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const employeeRoutes = require('./employeeRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// เส้นทางหลักสำหรับการใช้งาน API
router.use('/api', uniformRoutes);
router.use('/api', washJobRoutes);
router.use('/api', inventoryRoutes);
router.use('/api', employeeRoutes);
router.use('/api', dashboardRoutes);

module.exports = router;
