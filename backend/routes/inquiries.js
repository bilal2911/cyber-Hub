const express = require('express');
const router = express.Router();
const ContactInquiry = require('../models/ContactInquiry');
const { protect } = require('../middleware/auth');

// @desc    Submit a new customer inquiry
// @route   POST /api/inquiries
// @access  Public
router.post('/', async (req, res) => {
  const { name, phone, service, message } = req.body;

  try {
    if (!name || !phone || !service || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone, service query, and message' });
    }

    const inquiry = await ContactInquiry.create({
      name,
      phone,
      service,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    console.error(`Submit inquiry error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to process inquiry submission' });
  }
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin Only)
router.get('/', protect, async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve administrative inquiries list' });
  }
});

// @desc    Update inquiry status & notes
// @route   PUT /api/inquiries/:id
// @access  Private (Admin Only)
router.put('/:id', protect, async (req, res) => {
  const { status, adminNotes } = req.body;

  try {
    let inquiry = await ContactInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry log not found' });
    }

    inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry status flag' });
  }
});

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry log not found' });
    }

    await ContactInquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry record permanently removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove inquiry record' });
  }
});

module.exports = router;
