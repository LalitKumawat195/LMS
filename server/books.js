const express = require('express');
const jwt = require('jsonwebtoken');
const Book = require('./Book');

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

// Get all books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new book (Librarian/Admin only)
router.post('/', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      addedBy: req.user.id
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Book with this ISBN already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Update book (Librarian/Admin only)
router.put('/:id', verifyToken, checkLibrarianOrAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete book (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search books
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const query = req.params.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;