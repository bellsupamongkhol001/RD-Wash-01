const mongoose = require('mongoose');

const washSchema = new mongoose.Schema({
  washCode: String,
  employeeId: String,
  employeeName: String,
  uniformCode: String,
  uniformSize: String,
  uniformColor: String,
  qty: Number,
  status: String,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model('Wash', washSchema);
