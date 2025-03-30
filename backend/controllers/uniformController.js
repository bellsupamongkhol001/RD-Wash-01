const Uniform = require('../models/uniformModel');

// ฟังก์ชันสำหรับดึงข้อมูลชุดยูนิฟอร์มทั้งหมด
const getAllUniforms = async (req, res) => {
  try {
    const uniforms = await Uniform.find();
    res.json(uniforms);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลชุดยูนิฟอร์มได้', error });
  }
};

// ฟังก์ชันสำหรับเพิ่มชุดยูนิฟอร์ม
const addUniform = async (req, res) => {
  const { uniformCode, uniformType, uniformSize, uniformColor, uniformQty } = req.body;

  if (!uniformCode || !uniformType || !uniformSize || !uniformColor || !uniformQty) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  try {
    const newUniform = new Uniform({ uniformCode, uniformType, uniformSize, uniformColor, uniformQty });
    await newUniform.save();
    res.status(201).json(newUniform);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถเพิ่มชุดยูนิฟอร์มได้', error });
  }
};

const editUniform = async ()

module.exports = { getAllUniforms, addUniform };
