// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock users for example (this should be replaced with MongoDB queries)
const users = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 2, username: 'staff', password: 'staff123', name: 'Staff User', role: 'staff' },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'rdwash-secret',  // You should have a secret key in the .env file
    { expiresIn: '1d' }
  );

  res.json({ token, user: { name: user.name, role: user.role } });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, username, password, role } = req.body;

  // Validate if user already exists (using mock data for example)
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Add user to mock data (replace with MongoDB query)
  const newUser = { id: users.length + 1, name, username, password, role };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;
