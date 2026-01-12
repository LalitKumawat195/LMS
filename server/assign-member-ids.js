const mongoose = require('mongoose');
const User = require('./User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false,
  tlsAllowInvalidCertificates: true
});

async function assignMemberIds() {
  try {
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    let updated = 0;
    for (const user of users) {
      if (!user.memberId) {
        const prefix = user.role === 'Admin' ? 'ADM' : user.role === 'Librarian' ? 'LIB' : 'MEM';
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const memberId = prefix + randomNum;
        
        await User.findByIdAndUpdate(user._id, { memberId });
        console.log(`Assigned ${memberId} to ${user.name}`);
        updated++;
      } else {
        console.log(`${user.name} already has member ID: ${user.memberId}`);
      }
    }
    
    console.log(`Updated ${updated} users`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

assignMemberIds();