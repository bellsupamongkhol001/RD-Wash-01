const express = require('express');
const router = express.Router();
const Wash = require('../models/Wash');

// GET all
router.get('/', async (req, res) => {
  const items = await Wash.find();
  res.json(items);
});

// GET one
router.get('/:id', async (req, res) => {
  const item = await Wash.findById(req.params.id);
  res.json(item);
});

// POST new
router.post('/', async (req, res) => {
  const newItem = new Wash(req.body);
  await newItem.save();
  res.json(newItem);
});

// PUT update
router.put('/:id', async (req, res) => {
  const updated = await Wash.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Wash.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
