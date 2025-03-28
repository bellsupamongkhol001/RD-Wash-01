const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  employeeName: String,
  department: String
});

module.exports = mongoose.model('Employee', employeeSchema);
