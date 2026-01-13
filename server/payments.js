const express = require('express');
const jwt = require('jsonwebtoken');
const Payment = require('./Payment');

const router = express.Router();

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

// Middleware to check if user is librarian or admin
const checkLibrarianOrAdmin = (req, res, next) => {
  if (req.user.role !== 'Librarian' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Librarian or Admin role required.' });
  }
  next();
};

// Get all payments
router.get('/', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new payment
router.post('/', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const payment = new Payment({
      ...req.body,
      processedBy: req.user.id
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get payments by date range
router.get('/range', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const payments = await Payment.find(query)
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get fine reports by date range
router.get('/reports', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const { period } = req.query;
    const now = new Date();
    let startDate, endDate;
    
    if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }
    
    const payments = await Payment.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('processedBy', 'name');
    
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    
    res.json({
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalCollected,
      totalWaived: 0,
      paymentsCount: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;