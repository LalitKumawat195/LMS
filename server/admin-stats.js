const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Book = require('./Book');
const User = require('./User');
const Transaction = require('./Transaction');
const Payment = require('./Payment');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalBooks = await Book.countDocuments();
    const totalMembers = await User.countDocuments({ role: 'Member' });
    const totalLibrarians = await User.countDocuments({ role: { $in: ['Librarian', 'Admin'] } });

    // Daily transactions (today)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const dailyTransactions = await Transaction.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    const overdueTransactions = await Transaction.find({
      type: 'issue',
      status: 'overdue'
    });

    let outstandingFines = 0;
    overdueTransactions.forEach(transaction => {
      const overdueDays = Math.ceil((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24));
      outstandingFines += overdueDays * 10;
    });

    const totalFinesGenerated = await Transaction.aggregate([
      { $match: { fine: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    const totalPaid = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const finesGenerated = totalFinesGenerated[0]?.total || 0;
    const finesPaid = totalPaid[0]?.total || 0;
    const collectionRate = finesGenerated > 0 ? ((finesPaid / finesGenerated) * 100).toFixed(1) : 0;

    res.json({
      totalBooks,
      totalMembers,
      totalLibrarians,
      dailyTransactions,
      monthlyRevenue: finesPaid,
      outstandingFines,
      collectionRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
