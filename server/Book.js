const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Reference'],
    default: 'Fiction'
  },
  publisher: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  copies: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  available: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Set available copies equal to total copies when creating new book
bookSchema.pre('save', function(next) {
  if (this.isNew) {
    this.available = this.copies;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);