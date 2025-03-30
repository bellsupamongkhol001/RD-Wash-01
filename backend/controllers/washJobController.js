const WashJob = require('../models/washJobModel');

// ฟังก์ชันสำหรับดึงข้อมูลการซักทั้งหมด
const getAllWashJobs = async (req, res) => {
  try {
    const washJobs = await WashJob.find();
    res.json(washJobs);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลการซักได้', error });
  }
};

// ฟังก์ชันสำหรับเพิ่มการซักใหม่
const addWashJob = async (req, res) => {
  const { washCode, employeeId, employeeName, uniformCode, uniformSize, uniformColor, qty } = req.body;

  if (!washCode || !employeeId || !employeeName || !uniformCode || !uniformSize || !uniformColor || !qty) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  try {
    const newWashJob = new WashJob({ washCode, employeeId, employeeName, uniformCode, uniformSize, uniformColor, qty });
    await newWashJob.save();
    res.status(201).json(newWashJob);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถเพิ่มการซักได้', error });
  }
};

module.exports = { getAllWashJobs, addWashJob };
