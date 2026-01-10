const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['General', 'Meeting', 'Workshop', 'Holiday', 'Maintenance', 'Event'],
    default: 'General'
  },
  reminder: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);