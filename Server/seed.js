const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// โหลด .env จาก path ปัจจุบัน
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🧪 MONGO_URI:', process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error('❌ ไม่พบค่า MONGO_URI ใน .env');
  process.exit(1);
}

// ===== Models =====
const Wash = require('./models/Wash');
const Employee = require('./models/Employee');
const Uniform = require('./models/Uniform');

// ===== Run Seeding =====
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ล้างข้อมูลเก่า
    await Wash.deleteMany({});
    await Employee.deleteMany({});
    await Uniform.deleteMany({});

    // เพิ่มพนักงาน
    await Employee.insertMany([
      { employeeId: 'EMP001', employeeName: 'สุดหล่อ', department: 'Production' },
      { employeeId: 'EMP002', employeeName: 'สุดสวย', department: 'QC' },
      { employeeId: 'EMP003', employeeName: 'สุดคิ้วท์', department: 'Engineering' }
    ]);
    console.log('✅ Inserted: employee');

    // เพิ่มชุด
    await Uniform.insertMany([
      { uniformCode: 'UC001', uniformSize: 'M', uniformColor: 'Blue', qty: 10 },
      { uniformCode: 'UC002', uniformSize: 'L', uniformColor: 'White', qty: 8 },
      { uniformCode: 'UC003', uniformSize: 'XL', uniformColor: 'Gray', qty: 5 }
    ]);
    console.log('✅ Inserted: uniform');

    // เพิ่มข้อมูลการซัก
    await Wash.insertMany([
      {
        washCode: 'W001',
        employeeId: 'EMP001',
        employeeName: 'สุดหล่อ',
        uniformCode: 'UC001',
        uniformSize: 'M',
        uniformColor: 'Blue',
        qty: 2,
        status: 'In Washing',
        startDate: new Date('2025-03-01T08:30:00Z'),
        endDate: null
      },
      {
        washCode: 'W002',
        employeeId: 'EMP002',
        employeeName: 'สุดสวย',
        uniformCode: 'UC002',
        uniformSize: 'L',
        uniformColor: 'White',
        qty: 1,
        status: 'Completed',
        startDate: new Date('2025-03-01T09:00:00Z'),
        endDate: new Date('2025-03-01T17:00:00Z')
      }
    ]);
    console.log('✅ Inserted: wash');

    console.log('🎉 All seed data inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

run();
