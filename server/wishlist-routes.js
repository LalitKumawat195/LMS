const express = require('express');
const jwt = require('jsonwebtoken');
const Wishlist = require('./Wishlist');

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

// Get user's wishlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate('bookId', 'title author isbn category publisher year available copies')
      .sort({ createdAt: -1 });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add book to wishlist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    
    const existing = await Wishlist.findOne({ userId: req.user.id, bookId });
    if (existing) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      userId: req.user.id,
      bookId
    });
    await wishlistItem.save();
    
    res.json({ message: 'Added to wishlist', item: wishlistItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
