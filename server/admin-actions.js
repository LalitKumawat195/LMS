const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Book = require('./Book');
const User = require('./User');
const Transaction = require('./Transaction');
const Payment = require('./Payment');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Backup system - returns JSON for download
router.get('/backup', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const books = await Book.find().lean();
    const users = await User.find().lean();
    const transactions = await Transaction.find().lean();
    const payments = await Payment.find().lean();

    const backup = {
      timestamp: new Date().toISOString(),
      stats: {
        books: books.length,
        users: users.length,
        transactions: transactions.length,
        payments: payments.length
      },
      data: {
        books,
        users,
        transactions,
        payments
      }
    };

    res.json(backup);
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Generate reports
router.post('/reports', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalBooks = await Book.countDocuments();
    const totalMembers = await User.countDocuments({ role: 'Member' });
    const totalTransactions = await Transaction.countDocuments();
    
    const overdueTransactions = await Transaction.find({
      type: 'issue',
      status: 'overdue'
    });

    let totalOverdueFines = 0;
    overdueTransactions.forEach(transaction => {
      const overdueDays = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));
      totalOverdueFines += overdueDays * 10;
    });

    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const report = {
      totalBooks,
      totalMembers,
      totalTransactions,
      overdueBooks: overdueTransactions.length,
      totalOverdueFines,
      totalRevenue: totalRevenue[0]?.total || 0,
      generatedAt: new Date()
    };

    res.json({ 
      message: 'Comprehensive report generated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
