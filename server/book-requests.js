const express = require('express');
const jwt = require('jsonwebtoken');
const BookRequest = require('./BookRequest');

const router = express.Router();

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

const checkLibrarianOrAdmin = (req, res, next) => {
  if (req.user.role !== 'Librarian' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get all book requests (Librarian/Admin only)
router.get('/', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const requests = await BookRequest.find()
      .populate('bookId', 'title author isbn category')
      .populate('userId', 'name email memberId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve book request (Librarian/Admin only)
router.patch('/:id/approve', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const request = await BookRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('bookId', 'title author').populate('userId', 'name email memberId');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject book request (Librarian/Admin only)
router.patch('/:id/reject', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const request = await BookRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('bookId', 'title author').populate('userId', 'name email memberId');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;