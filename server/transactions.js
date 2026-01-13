const express = require('express');
const router = express.Router();
const Transaction = require('./Transaction');
const Book = require('./Book');
const auth = require('./auth');

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('bookId', 'title author isbn')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new transaction (issue book)
router.post('/', auth, async (req, res) => {
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
router.put('/:id', auth, async (req, res) => {
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
      .populate('processedBy', 'name email');

    res.json(populatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;