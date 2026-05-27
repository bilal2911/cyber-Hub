const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const LoanApplication = require('../models/LoanApplication');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// @desc    File a new Loan Application with attachments
// @route   POST /api/loans
// @access  Public
router.post('/', upload.array('documents', 5), async (req, res) => {
  const { name, phone, city, loanType, amount, occupation } = req.body;

  try {
    if (!name || !phone || !loanType || !amount || !occupation) {
      // Clean up uploaded files if metadata validation fails
      if (req.files) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).json({ success: false, message: 'Please fill all required application fields' });
    }

    let documents = [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map(file => ({
        originalName: file.originalname,
        fileName: file.filename,
        fileUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype
      }));
    }

    const application = await LoanApplication.create({
      name,
      phone,
      city: city || 'Delhi',
      loanType,
      amount,
      occupation,
      documents
    });

    res.status(201).json({
      success: true,
      message: 'Loan application pre-approval request submitted successfully!',
      data: application
    });
  } catch (error) {
    // Clean up uploaded files in case of schema/server crash
    if (req.files) {
      req.files.forEach(file => {
        try { fs.unlinkSync(file.path); } catch (err) {}
      });
    }
    console.error(`Loan submit error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message || 'Failed to file loan application' });
  }
});

// @desc    Get all loan applications
// @route   GET /api/loans
// @access  Private (Admin Only)
router.get('/', protect, async (req, res) => {
  try {
    const loans = await LoanApplication.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: loans.length, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve administrative loan application records' });
  }
});

// @desc    Update loan status & notes
// @route   PUT /api/loans/:id
// @access  Private (Admin Only)
router.put('/:id', protect, async (req, res) => {
  const { status, adminNotes } = req.body;

  try {
    let loan = await LoanApplication.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan application portfolio not found' });
    }

    loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update loan processing pipeline status' });
  }
});

// @desc    Delete a loan application & remove all uploaded documents from disk
// @route   DELETE /api/loans/:id
// @access  Private (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan application portfolio not found' });
    }

    // Delete associated physical attachments from local storage folder
    if (loan.documents && loan.documents.length > 0) {
      loan.documents.forEach(doc => {
        const filePath = path.join(__dirname, '..', 'uploads', doc.fileName);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (err) { console.error(`Error deleting file: ${filePath}`, err); }
        }
      });
    }

    await LoanApplication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Loan portfolio and file attachments permanently wiped' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete loan application' });
  }
});

module.exports = router;
