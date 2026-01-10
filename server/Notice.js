const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Normal', 'Medium', 'High'],
    default: 'Normal'
  },
  category: {
    type: String,
    enum: ['General', 'Events', 'Maintenance', 'Policy', 'Emergency'],
    default: 'General'
  },
  expiryDate: {
    type: Date
  },
  pinned: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Notice', noticeSchema);