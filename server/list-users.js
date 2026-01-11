const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const listUsers = async () => {
  try {
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('All users:', JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

mongoose.connection.once('open', listUsers);