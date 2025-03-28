const mongoose = require('mongoose');

const uniformSchema = new mongoose.Schema({
  uniformCode: { type: String, required: true },
  uniformType: { type: String, required: true },
  uniformSize: { type: String, required: true },
  uniformColor: { type: String, required: true },
  uniformQty: { type: Number, required: true },
});

module.exports = mongoose.model('Uniform', uniformSchema);
