const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services database' });
  }
});

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug.toLowerCase(), active: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service profile not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving service details' });
  }
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin Only)
router.post('/', protect, async (req, res) => {
  const { title, category, description, iconName, estimatedTime, serviceCharge, requiredDocuments, faqs } = req.body;

  try {
    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide title, category, and description' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingService = await Service.findOne({ slug });
    if (existingService) {
      return res.status(400).json({ success: false, message: 'Service with this name already exists (slug conflict)' });
    }

    const service = await Service.create({
      title,
      slug,
      category,
      description,
      iconName: iconName || 'icon-cyber',
      estimatedTime: estimatedTime || '1-3 Days',
      serviceCharge: serviceCharge || 'Nominal Fees',
      requiredDocuments: requiredDocuments || [],
      faqs: faqs || []
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error(`Create service error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to create new service profile' });
  }
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin Only)
router.put('/:id', protect, async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service profile not found' });
    }

    // Regeneate slug if title changes
    if (req.body.title && req.body.title !== service.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update service profile parameters' });
  }
});

// @desc    Delete a service (Soft-delete or Hard-delete)
// @route   DELETE /api/services/:id
// @access  Private (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service profile not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service profile permanently removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service profile' });
  }
});

module.exports = router;
