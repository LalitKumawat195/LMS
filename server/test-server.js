const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Server is working' });
});

// Mock user data
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  department: 'IT',
  phone: '123-456-7890',
  bio: 'Test bio',
  dateOfBirth: null,
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  }
};

// Get user profile
app.get('/api/user/profile', (req, res) => {
  console.log('Profile GET request');
  res.json(mockUser);
});

// Update user profile
app.put('/api/user/profile', (req, res) => {
  console.log('Profile PUT request');
  console.log('Request body:', req.body);
  
  // Update mock user with request data
  Object.assign(mockUser, req.body);
  
  res.json({
    message: 'Profile updated successfully',
    user: mockUser
  });
});

// Profile picture upload placeholder
app.post('/api/user/profile/picture', (req, res) => {
  console.log('Profile picture upload request');
  res.json({
    message: 'Profile picture upload not implemented',
    profilePicture: ''
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/test');
  console.log('- GET /api/user/profile');
  console.log('- PUT /api/user/profile');
  console.log('- POST /api/user/profile/picture');
});