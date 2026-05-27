const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide service title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide service category'],
    enum: ['aadhaar-pan', 'loans', 'cyber']
  },
  description: {
    type: String,
    required: [true, 'Please provide service description']
  },
  iconName: {
    type: String,
    default: 'icon-cyber'
  },
  estimatedTime: {
    type: String,
    required: [true, 'Please specify estimated processing time'],
    default: '1-3 Working Days'
  },
  serviceCharge: {
    type: String,
    default: 'Nominal Charges'
  },
  requiredDocuments: [
    {
      type: String,
      required: true
    }
  ],
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', ServiceSchema);
