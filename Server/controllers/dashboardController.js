const WashJob = require('../models/washJob');

// ฟังก์ชันดึงข้อมูลสรุปของคำสั่งซักทั้งหมด
const getDashboardData = async (req, res) => {
  try {
    // คำนวณจำนวนคำสั่งซักที่แต่ละสถานะ
    const waitingCount = await WashJob.countDocuments({ status: 'waiting send wash' });
    const washingCount = await WashJob.countDocuments({ status: 'washing' });
    const completedCount = await WashJob.countDocuments({ status: 'completed' });

    // สร้างข้อมูลสรุป
    const dashboardData = {
      totalWashJobs: await WashJob.countDocuments(),
      waitingCount,
      washingCount,
      completedCount,
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล Dashboard ได้', error });
  }
};

module.exports = { getDashboardData };