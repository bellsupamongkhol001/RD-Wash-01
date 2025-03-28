const mongoose = require('mongoose');

const uniformSchema = new mongoose.Schema({
  uniformCode: String,
  uniformSize: String,
  uniformColor: String,
  qty: Number
});

module.exports = mongoose.model('Uniform', uniformSchema);
