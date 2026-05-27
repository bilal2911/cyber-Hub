const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const { protect } = require('../middleware/auth');

// @desc    Get all active FAQs
// @route   GET /api/faqs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ active: true }).sort({ category: 1, createdAt: -1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
});

// @desc    Create an FAQ
// @route   POST /api/faqs
// @access  Private (Admin Only)
router.post('/', protect, async (req, res) => {
  const { question, answer, category } = req.body;

  try {
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Please provide question and answer details' });
    }

    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'General'
    });

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add FAQ record' });
  }
});

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private (Admin Only)
router.put('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ record not found' });
    }

    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update FAQ record' });
  }
});

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ record not found' });
    }

    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ record permanently removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ record' });
  }
});

module.exports = router;
