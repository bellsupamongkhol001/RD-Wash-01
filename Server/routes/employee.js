const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.get('/', async (req, res) => {
  const list = await Employee.find();
  res.json(list);
});

module.exports = router;
