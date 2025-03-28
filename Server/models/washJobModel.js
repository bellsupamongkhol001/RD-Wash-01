const mongoose = require('mongoose');

const washJobSchema = new mongoose.Schema({
  washCode: { type: String, required: true },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  uniformCode: { type: String, required: true },
  uniformSize: { type: String },
  uniformColor: { type: String },
  qty: { type: Number, required: true },
  status: { type: String, default: 'waiting send wash' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WashJob', washJobSchema);
