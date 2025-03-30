const mongoose = require('mongoose');

const uniformSchema = new mongoose.Schema({
  uniformCode: { type: String, required: true },
  uniformType: { type: String, required: true }, // smock หรือ shoes
  uniformSize: { type: String, required: true },
  uniformColor: { type: String },
  qty: { type: Number, default: 1 }
});

module.exports = mongoose.model('Uniform', uniformSchema);
