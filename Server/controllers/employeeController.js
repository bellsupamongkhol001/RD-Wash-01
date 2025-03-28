const Employee = require('../models/employeeModel');

// ฟังก์ชันสำหรับดึงข้อมูลพนักงานทั้งหมด
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลพนักงานได้', error });
  }
};

// ฟังก์ชันสำหรับเพิ่มพนักงาน
const addEmployee = async (req, res) => {
  const { employeeId, employeeName, department } = req.body;

  if (!employeeId || !employeeName || !department) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  try {
    const newEmployee = new Employee({ employeeId, employeeName, department });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถเพิ่มพนักงานได้', error });
  }
};

module.exports = { getAllEmployees, addEmployee };
