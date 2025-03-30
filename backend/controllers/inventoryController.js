const Inventory = require('../models/inventoryModel');

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมด
const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลสินค้าคงคลังได้', error });
  }
};

// ฟังก์ชันสำหรับเพิ่มสินค้าคงคลัง
const addInventory = async (req, res) => {
  const { itemCode, itemType, itemSize, itemColor, itemQty } = req.body;

  if (!itemCode || !itemType || !itemSize || !itemColor || !itemQty) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  try {
    const newItem = new Inventory({ itemCode, itemType, itemSize, itemColor, itemQty });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถเพิ่มสินค้าได้', error });
  }
};

module.exports = { getAllInventory, addInventory };
