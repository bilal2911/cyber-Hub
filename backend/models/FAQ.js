const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide question text'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please provide answer text']
  },
  category: {
    type: String,
    required: [true, 'Please specify FAQ category'],
    enum: ['General', 'Aadhaar', 'PAN', 'Loans'],
    default: 'General'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FAQ', FAQSchema);
