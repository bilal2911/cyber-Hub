const mongoose = require('mongoose');

const ContactInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide applicant name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide contact phone number'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Please provide the service queried']
  },
  message: {
    type: String,
    required: [true, 'Please describe your request details']
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
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

module.exports = mongoose.model('ContactInquiry', ContactInquirySchema);
