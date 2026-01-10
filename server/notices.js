const express = require('express');
const jwt = require('jsonwebtoken');
const Notice = require('./Notice');

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

// Get all notices
router.get('/', verifyToken, async (req, res) => {
  try {
    const notices = await Notice.find({
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } }
      ]
    }).sort({ pinned: -1, createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notice
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Librarian') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const notice = new Notice({
      ...req.body,
      createdBy: req.user.name
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update notice
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Librarian') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notice
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Librarian') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle pin notice
router.patch('/:id/pin', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Librarian') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    notice.pinned = !notice.pinned;
    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment views
router.patch('/:id/view', verifyToken, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;