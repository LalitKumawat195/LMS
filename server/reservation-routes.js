const express = require('express');
const jwt = require('jsonwebtoken');
const Reservation = require('./Reservation');

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
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's reservations
router.get('/', verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate('bookId', 'title author isbn category publisher year available copies')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create reservation
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    
    const existing = await Reservation.findOne({ 
      userId: req.user.id, 
      bookId,
      status: { $in: ['pending', 'ready'] }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Reservation already exists' });
    }

    const reservation = new Reservation({
      userId: req.user.id,
      bookId
    });
    await reservation.save();
    
    res.json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel reservation
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
