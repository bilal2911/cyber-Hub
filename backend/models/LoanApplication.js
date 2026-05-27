const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide applicant name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide contact number'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide resident city'],
    default: 'Delhi'
  },
  loanType: {
    type: String,
    required: [true, 'Please specify loan type category']
  },
  amount: {
    type: String,
    required: [true, 'Please select requested loan range']
  },
  occupation: {
    type: String,
    required: [true, 'Please select occupation profile']
  },
  documents: [
    {
      originalName: { type: String, required: true },
      fileName: { type: String, required: true },
      fileUrl: { type: String, required: true },
      mimeType: { type: String }
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
