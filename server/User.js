const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Member', 'Librarian', 'Admin'],
    default: 'Member'
  },
  memberId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: String,
  phone: String,
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate unique member ID for all users
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.memberId) {
    let prefix;
    switch (this.role) {
      case 'Admin': prefix = 'ADM'; break;
      case 'Librarian': prefix = 'LIB'; break;
      case 'Member': prefix = 'MEM'; break;
      default: prefix = 'USR';
    }
    
    let isUnique = false;
    while (!isUnique) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const newId = prefix + randomNum;
      const existing = await this.constructor.findOne({ memberId: newId });
      if (!existing) {
        this.memberId = newId;
        isUnique = true;
      }
    }
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);