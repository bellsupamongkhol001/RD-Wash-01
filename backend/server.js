const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MongoDB connection string");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Import Routes
const employeeRoutes = require('./routes/employeeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const uniformRoutes = require('./routes/uniformRoutes');
const washJobRoutes = require('./routes/washJobRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// API Routes
app.use('/api/employee', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/uniform', uniformRoutes);
app.use('/api/washjob', washJobRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Static Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
