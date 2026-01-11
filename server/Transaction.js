const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  memberId: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['issue', 'return'],
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: function() {
      return this.type === 'issue';
    }
  },
  returnDate: {
    type: Date,
    required: function() {
      return this.type === 'return';
    }
  },
  fine: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue'],
    default: 'active'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Set due date to 14 days from issue date
transactionSchema.pre('save', function(next) {
  if (this.isNew && this.type === 'issue') {
    this.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
  }
  if (this.type === 'return') {
    this.returnDate = new Date();
    this.status = 'returned';
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);