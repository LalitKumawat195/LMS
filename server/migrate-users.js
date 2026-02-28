const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['Member', 'Librarian', 'Admin'],
    default: 'Member'
  },
  memberId: String,
  department: String,
  phone: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Migration function
async function migrateUsers() {
  try {
    console.log('Starting user migration...');
    
    // Update all users without role field
    const result = await User.updateMany(
      { role: { $exists: false } },
      { 
        $set: { 
          role: 'Member',
          status: 'Active'
        } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} users with default role`);
    
    // Generate member IDs for users without them
    const usersWithoutMemberId = await User.find({ 
      $or: [
        { memberId: { $exists: false } },
        { memberId: '' },
        { memberId: null }
      ]
    });
    
    for (let user of usersWithoutMemberId) {
      let prefix;
      switch (user.role) {
        case 'Admin': prefix = 'ADM'; break;
        case 'Librarian': prefix = 'LIB'; break;
        case 'Member': prefix = 'MEM'; break;
        default: prefix = 'USR';
      }
      
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      user.memberId = prefix + randomNum;
      await user.save();
      console.log(`Generated member ID ${user.memberId} for ${user.name}`);
    }
    
    console.log(`\nGenerated member IDs for ${usersWithoutMemberId.length} users`);
    
    // Display all users
    const allUsers = await User.find({}, 'name email role memberId status');
    console.log('\nAll users after migration:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Member ID: ${user.memberId || 'N/A'} - Status: ${user.status}`);
    });
    
    console.log('\nMigration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateUsers();
