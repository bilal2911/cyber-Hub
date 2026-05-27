const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide reviewer name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please specify customer locality'],
    default: 'Delhi'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  reviewText: {
    type: String,
    required: [true, 'Please provide feedback review text']
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

module.exports = mongoose.model('Testimonial', TestimonialSchema);
