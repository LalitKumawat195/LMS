const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const updateRole = async () => {
  try {
    const result = await mongoose.connection.db.collection('users').updateOne(
      { name: "Pratiksha Pralhad Lad" },
      { $set: { role: 'Admin' } }
    );
    console.log('Update result:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

mongoose.connection.once('open', updateRole);