const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    default: 'Cyber Hub Services'
  },
  tagline: {
    type: String,
    required: true,
    default: 'Loan se lekar Cyber Work tak, sab kuch ek hi chhat ke neeche'
  },
  phoneNumbers: [
    {
      type: String,
      required: true
    }
  ],
  whatsappNumber: {
    type: String,
    required: true,
    default: '9891067013'
  },
  address: {
    type: String,
    required: true,
    default: '101 A, Street No. 13, Pratap Nagar, Mayur Vihar Phase-1, Delhi'
  },
  emailNotifications: {
    type: String,
    required: true,
    default: 'cyberhubservicesdelhi@gmail.com'
  },
  openingHours: {
    weekdays: { type: String, default: '09:30 AM - 08:30 PM' },
    saturday: { type: String, default: '09:30 AM - 08:30 PM' },
    sunday: { type: String, default: '10:00 AM - 02:00 PM' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
