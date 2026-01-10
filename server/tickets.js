const express = require('express');
const jwt = require('jsonwebtoken');
const Ticket = require('./Ticket');

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

// Get tickets (user sees own, staff sees all)
router.get('/', verifyToken, async (req, res) => {
  try {
    const query = req.user.role === 'Member' 
      ? { userId: req.user.id }
      : {};
    
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create ticket
router.post('/', verifyToken, async (req, res) => {
  try {
    const ticket = new Ticket({
      ...req.body,
      userId: req.user.id,
      createdBy: req.user.name
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update ticket status (staff only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role === 'Member') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        assignedTo: req.user.id
      },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add response to ticket
router.post('/:id/response', verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user can respond (owner or staff)
    if (req.user.role === 'Member' && ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    ticket.responses.push({
      message: req.body.message,
      respondedBy: req.user.name,
      isStaff: req.user.role !== 'Member'
    });
    
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;