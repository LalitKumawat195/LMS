const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date() });
});

// Test database connection
router.get('/db-test', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({ 
      message: 'Database test',
      status: states[state],
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;