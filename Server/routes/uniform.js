const express = require('express');
const router = express.Router();
const Uniform = require('../models/Uniform');

router.get('/', async (req, res) => {
  const list = await Uniform.find();
  res.json(list);
});

module.exports = router;
