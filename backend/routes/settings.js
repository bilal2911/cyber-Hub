const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');

// @desc    Get current site settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({});
    
    // Auto-create initial default settings if empty
    if (!settings) {
      settings = await SiteSettings.create({
        businessName: 'Cyber Hub Services',
        tagline: 'Loan se lekar Cyber Work tak, sab kuch ek hi chhat ke neeche',
        phoneNumbers: ['9891067013', '8736909000'],
        whatsappNumber: '9891067013',
        address: '101 A, Street No. 13, Pratap Nagar, Mayur Vihar Phase-1, Delhi',
        emailNotifications: 'cyberhubservicesdelhi@gmail.com',
        openingHours: {
          weekdays: '09:30 AM - 08:30 PM',
          saturday: '09:30 AM - 08:30 PM',
          sunday: '10:00 AM - 02:00 PM'
        }
      });
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve site configurations' });
  }
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private (Admin Only)
router.put('/', protect, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({});

    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error(`Update settings error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to update dynamic configurations' });
  }
});

module.exports = router;
