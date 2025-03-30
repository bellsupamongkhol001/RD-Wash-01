const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemCode: { type: String, required: true },
  itemType: { type: String, required: true },
  itemSize: { type: String, required: true },
  itemColor: { type: String, required: true },
  itemQty: { type: Number, required: true }
});

module.exports = mongoose.model('Inventory', inventorySchema);
