const mongoose = require('mongoose');

const washJobSchema = new mongoose.Schema({
  washCode: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  uniformCode: { type: String, required: true },
  uniformSize: { type: String, required: true },
  uniformColor: { type: String, required: true },
  qty: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WashJob', washJobSchema);
