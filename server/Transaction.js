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
    type: Date
  },
  returnDate: {
    type: Date
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

// Set due date to 7 days from issue date
transactionSchema.pre('save', function(next) {
  if (this.type === 'issue' && !this.dueDate) {
    this.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }
  if (this.type === 'return') {
    this.returnDate = new Date();
    this.status = 'returned';
    
    // Calculate fine for overdue books (₹10 per day)
    if (this.dueDate && this.returnDate > this.dueDate) {
      const overdueDays = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
      this.fine = overdueDays * 10; // ₹10 per day
    }
  }
  next();
});

// Update overdue status automatically
transactionSchema.pre('find', function() {
  this.model.updateMany(
    {
      type: 'issue',
      status: 'active',
      dueDate: { $lt: new Date() }
    },
    { status: 'overdue' }
  ).exec();
});

transactionSchema.pre('findOne', function() {
  this.model.updateMany(
    {
      type: 'issue',
      status: 'active',
      dueDate: { $lt: new Date() }
    },
    { status: 'overdue' }
  ).exec();
});

module.exports = mongoose.model('Transaction', transactionSchema);