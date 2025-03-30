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

// ฟังก์ชันสำหรับลบพนักงาน
const deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const deletedEmployee = await Employee.findOneAndDelete({ employeeId });
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'ไม่พบพนักงานที่ต้องการลบ' });
    }
    res.json({ message: 'ลบพนักงานเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถลบพนักงานได้', error });
  }
};

// ฟังก์ชันสำหรับแก้ไขข้อมูลพนักงาน
const editEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { employeeName, department } = req.body;

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      { employeeName, department },
      { new: true } // ส่งข้อมูลใหม่กลับ
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'ไม่พบพนักงานที่ต้องการแก้ไข' });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถแก้ไขข้อมูลพนักงานได้', error });
  }
};


module.exports = { getAllEmployees, addEmployee };
