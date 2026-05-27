const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'cyberhub_super_secret_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username and password' });
    }

    // Auto-create initial default admin on first-time login request if DB is empty!
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      console.log('⚡ Initial Boot: Seeding default admin account (admin / admin123)');
      await Admin.create({
        username: 'admin',
        password: 'adminpassword123' // Hashed by schema hook
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials' });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials' });
    }

    // Return successful token injection
    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        username: admin.username
      }
    });

  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error during authentication login' });
  }
});

// @desc    Verify current token and fetch admin details
// @route   GET /api/auth/verify
// @access  Private
router.get('/verify', protect, async (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

module.exports = router;
