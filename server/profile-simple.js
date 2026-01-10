const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./User');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = user.userId;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Profile GET request for user:', req.userId);
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Profile found:', user.name);
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Profile PUT request for user:', req.userId);
    console.log('Request body:', req.body);
    
    const {
      name,
      email,
      department,
      phone,
      bio,
      dateOfBirth,
      address,
      emergencyContact
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (department !== undefined) user.department = department.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (address) user.address = address;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    await user.save();
    console.log('Profile updated successfully');

    const updatedUser = await User.findById(req.userId).select('-password');
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Placeholder for profile picture upload
router.post('/profile/picture', authenticateToken, async (req, res) => {
  try {
    console.log('Profile picture upload request');
    res.json({
      message: 'Profile picture upload not implemented yet',
      profilePicture: ''
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;