const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Transaction = require('./Transaction');
const Book = require('./Book');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's stats (Member only)
router.get('/my-stats', verifyToken, async (req, res) => {
  try {
    await Transaction.updateMany(
      { type: 'issue', status: 'active', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const borrowed = await Transaction.countDocuments({
      memberId: req.user.id,
      type: 'issue',
      status: { $in: ['active', 'overdue'] }
    });

    const overdue = await Transaction.countDocuments({
      memberId: req.user.id,
      type: 'issue',
      status: 'overdue'
    });

    const fineTransactions = await Transaction.find({
      memberId: req.user.id,
      fine: { $gt: 0 }
    });

    const totalFines = fineTransactions.reduce((sum, t) => sum + (t.fine || 0), 0);

    res.json({
      borrowedBooks: borrowed,
      maxBooks: 5,
      overdueBooks: overdue,
      fines: totalFines
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's issued books (Member only)
router.get('/my-books', verifyToken, async (req, res) => {
  try {
    await Transaction.updateMany(
      { type: 'issue', status: 'active', dueDate: { $lt: new Date() } },
      { status: 'overdue' }
    );

    const transactions = await Transaction.find({
      memberId: req.user.id,
      type: 'issue',
      status: { $in: ['active', 'overdue'] }
    })
    .populate('bookId', 'title author isbn category publisher year location available copies')
    .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's transaction history (Member only)
router.get('/my-history', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      memberId: req.user.id
    })
    .populate('bookId', 'title author isbn category')
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request renewal (Member only) - must be before /:id routes
router.post('/:id/renew-request', verifyToken, async (req, res) => {
  try {
    const RenewRequest = require('./RenewRequest');
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.memberId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const existingRequest = await RenewRequest.findOne({
      transactionId: transaction._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Renewal request already exists' });
    }

    const renewRequest = new RenewRequest({
      transactionId: transaction._id,
      userId: req.user.id,
      status: 'pending'
    });
    await renewRequest.save();

    res.json({ message: 'Renewal request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Renew transaction (Librarian/Admin only) - must be before /:id route
router.post('/:id/renew', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'active' && transaction.status !== 'overdue') {
      return res.status(400).json({ message: 'Only active or overdue transactions can be renewed' });
    }

    // Extend due date by 7 days
    const newDueDate = new Date(transaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    // Create renewal transaction record
    const renewalTransaction = new Transaction({
      bookId: transaction.bookId,
      memberId: transaction.memberId,
      type: 'renew',
      dueDate: newDueDate,
      processedBy: req.user.id
    });
    await renewalTransaction.save();

    // Update original transaction
    transaction.dueDate = newDueDate;
    transaction.status = 'active';
    await transaction.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('bookId', 'title author isbn category publisher year location available copies')
      .populate('memberId', 'name email memberId')
      .populate('processedBy', 'name email');

    res.json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions
router.get('/', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'name email memberId')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction (issue book)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bookId, memberId, type, dueDate } = req.body;
    
    console.log('Received data:', { bookId, memberId, type, dueDate });
    
    // Check if book is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const transaction = new Transaction({
      bookId,
      memberId,
      type: type || 'issue',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      processedBy: req.user.id
    });

    await transaction.save();
    
    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('bookId', 'title author isbn')
      .populate('processedBy', 'name email');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(400).json({ message: error.message });
  }
});



// Update transaction (return book)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (req.body.type === 'return') {
      transaction.type = 'return';
      transaction.returnDate = new Date();
      transaction.status = 'returned';
      
      // Calculate fine if overdue
      if (transaction.dueDate && transaction.returnDate > transaction.dueDate) {
        const overdueDays = Math.ceil((transaction.returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
        transaction.fine = overdueDays * 10; // ₹10 per day
      }

      // Update book availability
      const book = await Book.findById(transaction.bookId);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }
    }

    if (req.body.dueDate) {
      transaction.dueDate = req.body.dueDate;
    }

    transaction.processedBy = req.user.id;
    await transaction.save();

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'name email memberId')
      .populate('processedBy', 'name email');

    res.json(populatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;