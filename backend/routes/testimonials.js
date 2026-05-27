const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/auth');

// @desc    Get active testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private (Admin Only)
router.post('/', protect, async (req, res) => {
  const { name, location, rating, reviewText } = req.body;

  try {
    if (!name || !reviewText) {
      return res.status(400).json({ success: false, message: 'Please provide reviewer name and review text' });
    }

    const testimonial = await Testimonial.create({
      name,
      location: location || 'Delhi',
      rating: Number(rating) || 5,
      reviewText
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add testimonial' });
  }
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin Only)
router.put('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial record not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update testimonial record' });
  }
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial record not found' });
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove testimonial' });
  }
});

module.exports = router;
